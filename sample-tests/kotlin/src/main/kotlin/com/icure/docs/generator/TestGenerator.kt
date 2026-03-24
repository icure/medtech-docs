package com.icure.docs.generator

import java.io.File

data class GenerateTestFileOptions(
    val sourcePath: String,
    val blocks: List<ExtractedBlock>,
    val importSuperset: String,
    val helperClassName: String?,
    val helperImportPath: String?,
    val preTestProvides: Map<String, List<String>>,
    val preTestProvideTypes: Map<String, Map<String, String>> = emptyMap(),
)

private val FUNCTION_REGEX = Regex("""^(?:suspend\s+)?fun\s+(\w+)\s*\(""", RegexOption.MULTILINE)
private val VARIABLE_REGEX = Regex("""^(?:val|var)\s+(\w+)\s*[=:]""", RegexOption.MULTILINE)

fun extractFunctionNames(code: String): List<String> {
    return FUNCTION_REGEX.findAll(code).map { it.groupValues[1] }.toList()
}

fun extractVariableNames(code: String): List<String> {
    return VARIABLE_REGEX.findAll(code).map { it.groupValues[1] }.toList()
}

fun sourcePathToPackage(sourcePath: String): String {
    val withoutSdk = sourcePath.removePrefix("sdk/")
    val dir = File(withoutSdk).parent ?: return "com.icure.docs.generated"
    val packageSuffix = dir
        .replace(File.separatorChar, '.')
        .replace('/', '.')
        .replace("-", "")
        .lowercase()
    return "com.icure.docs.generated.$packageSuffix"
}

fun sourcePathToClassName(sourcePath: String): String {
    val baseName = File(sourcePath).nameWithoutExtension
    val raw = baseName
        .split(Regex("[_\\-]"))
        .joinToString("") { segment ->
            segment.replaceFirstChar { it.uppercaseChar() }
        } + "Test"
    // Kotlin class names cannot start with a digit
    return if (raw.first().isDigit()) "_$raw" else raw
}

fun fileBaseNameFromSource(sourcePath: String): String {
    return File(sourcePath).nameWithoutExtension
}

fun generateTestFileContent(options: GenerateTestFileOptions): String {
    val (sourcePath, blocks, importSuperset, helperClassName, helperImportPath, preTestProvides, preTestProvideTypes) = options
    val fileBaseName = fileBaseNameFromSource(sourcePath)
    val packageName = sourcePathToPackage(sourcePath)
    val className = sourcePathToClassName(sourcePath)

    val lines = mutableListOf<String>()

    lines.add("// Auto-generated from $sourcePath -- do not edit")
    lines.add("@file:OptIn(kotlin.time.ExperimentalTime::class)")
    lines.add("@file:Suppress(\"LocalVariableName\", \"unused\", \"UNUSED_VARIABLE\", \"RemoveRedundantQualifierName\", \"UNCHECKED_CAST\", \"UNREACHABLE_CODE\", \"RedundantSuspendModifier\")")
    lines.add("package $packageName")
    lines.add("")
    lines.add(importSuperset)
    lines.add("")
    lines.add("import com.icure.docs.helpers.SdkFixture")
    if (helperImportPath != null) {
        lines.add("import $helperImportPath")
    }
    lines.add("import io.kotest.core.spec.style.FunSpec")
    lines.add("")
    lines.add("class $className : FunSpec({")
    lines.add("")
    lines.add("    lateinit var sdk: com.icure.cardinal.sdk.CardinalSdk")
    lines.add("")
    lines.add("    beforeSpec {")
    lines.add("        sdk = SdkFixture.getTestSdk()")
    lines.add("    }")
    lines.add("")

    for ((i, block) in blocks.withIndex()) {
        val blockRef = block.testId ?: "line ${block.startLine}"
        val testName = "$fileBaseName block ${i + 1} ($blockRef)"
        val body = stripImportsFromBlock(block.code)
        val indentedBody = body.split("\n").joinToString("\n") { line ->
            if (line.isBlank()) "" else "        $line"
        }

        lines.add("    test(\"$testName\") {")

        if (helperClassName != null) {
            val provides = preTestProvides[testName] ?: emptyList()
            if (provides.isNotEmpty()) {
                lines.add("        val __provided = ${helperClassName}.preTest[\"$testName\"]?.invoke(sdk) ?: emptyMap()")
                val typeMap = preTestProvideTypes[testName] ?: emptyMap()
                for (varName in provides) {
                    val type = typeMap[varName]
                    if (type != null) {
                        lines.add("        val $varName = __provided[\"$varName\"] as $type")
                    } else {
                        lines.add("        val $varName = __provided[\"$varName\"]")
                    }
                }
            } else {
                lines.add("        ${helperClassName}.preTest[\"$testName\"]?.invoke(sdk)")
            }
        }

        lines.add(indentedBody)

        if (helperClassName != null) {
            val funcNames = extractFunctionNames(body)
            val varNames = extractVariableNames(body)
            val allNames = funcNames + varNames
            if (allNames.isNotEmpty()) {
                lines.add("        val __extracted = mutableMapOf<String, Any?>()")
                for (name in funcNames) {
                    lines.add("        __extracted[\"$name\"] = ::$name")
                }
                for (name in varNames) {
                    lines.add("        __extracted[\"$name\"] = $name")
                }
                lines.add("        ${helperClassName}.postTest[\"$testName\"]?.invoke(sdk, __extracted)")
            } else {
                lines.add("        ${helperClassName}.postTest[\"$testName\"]?.invoke(sdk, emptyMap())")
            }
        }

        lines.add("    }")
        lines.add("")
    }

    lines.add("})")
    lines.add("")

    return lines.joinToString("\n")
}
