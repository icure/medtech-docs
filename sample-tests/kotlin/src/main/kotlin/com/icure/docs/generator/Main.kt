package com.icure.docs.generator

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.io.File

@Serializable
data class HelperMeta(
    val preTestProvides: Map<String, List<String>> = emptyMap(),
    val preTestProvideTypes: Map<String, Map<String, String>> = emptyMap(),
    val additionalImports: List<String> = emptyList(),
)

data class FileData(
    val mdxPath: File,
    val sourcePath: String,
    val blocks: List<ExtractedBlock>,
)

private val json = Json { ignoreUnknownKeys = true }

fun findMdxFiles(dir: File): List<File> {
    val results = mutableListOf<File>()
    for (entry in dir.listFiles().orEmpty()) {
        if (entry.isDirectory) {
            results.addAll(findMdxFiles(entry))
        } else if (entry.name.endsWith(".mdx")) {
            results.add(entry)
        }
    }
    return results
}

fun sourcePathToHelperMetaPath(sourcePath: String, helpersMetaDir: File): File? {
    val withoutSdk = sourcePath.removePrefix("sdk/")
    val metaFile = helpersMetaDir.resolve(withoutSdk.replace(".mdx", ".json"))
    return if (metaFile.exists()) metaFile else null
}

fun loadHelperMeta(metaFile: File): HelperMeta {
    return json.decodeFromString(metaFile.readText())
}

fun sourcePathToHelperInfo(sourcePath: String): Pair<String, String>? {
    val withoutSdk = sourcePath.removePrefix("sdk/")
    val dir = File(withoutSdk).parent ?: ""
    val baseName = File(withoutSdk).nameWithoutExtension

    val packageSuffix = dir
        .replace(File.separatorChar, '.')
        .replace('/', '.')
        .replace("-", "")
        .lowercase()

    val raw = baseName
        .split(Regex("[_\\-]"))
        .joinToString("") { segment ->
            segment.replaceFirstChar { it.uppercaseChar() }
        } + "Helper"
    // Kotlin identifiers cannot start with a digit
    val className = if (raw.first().isDigit()) "_$raw" else raw

    val fullPackage = "com.icure.docs.helpers.$packageSuffix"
    val importPath = "$fullPackage.$className"
    return Pair(className, importPath)
}

fun hasHelperFile(sourcePath: String, testSourceDir: File): Boolean {
    val withoutSdk = sourcePath.removePrefix("sdk/")
    val dir = File(withoutSdk).parent ?: ""
    val baseName = File(withoutSdk).nameWithoutExtension

    val packageDir = dir
        .replace("-", "")
        .lowercase()

    val raw = baseName
        .split(Regex("[_\\-]"))
        .joinToString("") { segment ->
            segment.replaceFirstChar { it.uppercaseChar() }
        } + "Helper"
    // Kotlin identifiers cannot start with a digit
    val className = if (raw.first().isDigit()) "_$raw" else raw

    val helperFile = testSourceDir.resolve("com/icure/docs/helpers/$packageDir/$className.kt")
    return helperFile.exists()
}

fun main(args: Array<String>) {
    val sdkDir = File(args.getOrElse(0) { error("Missing SDK directory argument") })
    val outputDir = File(args.getOrElse(1) { error("Missing output directory argument") })
    val helpersMetaDir = File(args.getOrElse(2) { error("Missing helpers-meta directory argument") })

    val testSourceDir = File(sdkDir.parentFile, "sample-tests/kotlin/src/test/kotlin")

    // --- Pass 1: Collect all import lines across all MDX files (global superset) ---

    val mdxFiles = findMdxFiles(sdkDir)
    val allImportLines = mutableListOf<String>()

    // Load common additional imports
    val commonMetaFile = helpersMetaDir.resolve("_common.json")
    if (commonMetaFile.exists()) {
        val commonMeta = loadHelperMeta(commonMetaFile)
        for (line in commonMeta.additionalImports) {
            if (isKotlinImportLine(line)) {
                allImportLines.add(line.trim())
            }
        }
    }
    val fileDataList = mutableListOf<FileData>()

    for (mdxPath in mdxFiles) {
        val content = mdxPath.readText()
        val blocks = extractKotlinBlocks(content)

        if (blocks.isEmpty()) continue

        val sourcePath = "sdk/${mdxPath.relativeTo(sdkDir)}"

        for (block in blocks) {
            for (line in block.code.split("\n")) {
                if (isKotlinImportLine(line)) {
                    allImportLines.add(line.trim())
                }
            }
        }

        // Collect additional imports from helper metadata
        val metaFile = sourcePathToHelperMetaPath(sourcePath, helpersMetaDir)
        if (metaFile != null) {
            val meta = loadHelperMeta(metaFile)
            for (line in meta.additionalImports) {
                if (isKotlinImportLine(line)) {
                    allImportLines.add(line.trim())
                }
            }
        }

        fileDataList.add(FileData(mdxPath, sourcePath, blocks))
    }

    // mergeKotlinImports filters out excluded imports (unavailable packages)
    val merged = mergeKotlinImports(allImportLines)
    val importSuperset = renderKotlinImports(merged)

    // --- Pass 2: Generate test files ---

    if (outputDir.exists()) {
        outputDir.deleteRecursively()
    }
    outputDir.mkdirs()

    var generated = 0

    for (fileData in fileDataList) {
        val metaFile = sourcePathToHelperMetaPath(fileData.sourcePath, helpersMetaDir)
        val meta = metaFile?.let { loadHelperMeta(it) }

        val helperInfo = sourcePathToHelperInfo(fileData.sourcePath)
        val helperExists = hasHelperFile(fileData.sourcePath, testSourceDir)

        val packageName = sourcePathToPackage(fileData.sourcePath)
        val className = sourcePathToClassName(fileData.sourcePath)
        val packageDir = packageName.replace('.', '/')
        val outFile = outputDir.resolve("$packageDir/$className.kt")

        val content = generateTestFileContent(
            GenerateTestFileOptions(
                sourcePath = fileData.sourcePath,
                blocks = fileData.blocks,
                importSuperset = importSuperset,
                helperClassName = if (helperExists && helperInfo != null) helperInfo.first else null,
                helperImportPath = if (helperExists && helperInfo != null) helperInfo.second else null,
                preTestProvides = meta?.preTestProvides ?: emptyMap(),
                preTestProvideTypes = meta?.preTestProvideTypes ?: emptyMap(),
            )
        )

        outFile.parentFile.mkdirs()
        outFile.writeText(content)

        val relOutput = outFile.relativeTo(outputDir)
        println("✓  ${fileData.sourcePath}  →  $relOutput  (${fileData.blocks.size} block${if (fileData.blocks.size != 1) "s" else ""})")
        generated++
    }

    println("\nGenerated $generated test file(s) from ${mdxFiles.size} MDX file(s).")
}
