package com.icure.docs.generator

data class ExtractedBlock(
    val code: String,
    val startLine: Int,
    val testId: String? = null,
)

private val TEST_ID_REGEX = Regex("""\btest-(\w{4})\b""")

fun extractKotlinBlocks(mdxContent: String): List<ExtractedBlock> {
    val lines = mdxContent.split("\n")
    val blocks = mutableListOf<ExtractedBlock>()
    var i = 0

    while (i < lines.size) {
        val trimmed = lines[i].trim()

        if (trimmed.startsWith("```kotlin")) {
            val fenceInfo = trimmed.removePrefix("```")

            if ("no-test" in fenceInfo) {
                i++
                while (i < lines.size && !lines[i].trim().startsWith("```")) i++
                i++
                continue
            }

            val testId = TEST_ID_REGEX.find(fenceInfo)?.groupValues?.get(1)
            val startLine = i + 1
            val codeLines = mutableListOf<String>()
            i++

            while (i < lines.size && !lines[i].trim().startsWith("```")) {
                codeLines.add(lines[i])
                i++
            }
            i++

            blocks.add(ExtractedBlock(codeLines.joinToString("\n"), startLine, testId))
        } else {
            i++
        }
    }

    return blocks
}

fun isKotlinImportLine(line: String): Boolean {
    val trimmed = line.trim()
    if (trimmed.startsWith("//")) return false
    return trimmed.startsWith("import ") || trimmed.startsWith("import\t")
}

/**
 * Strip Kotlin modifiers that are invalid inside function bodies:
 * - `private`, `public`, `internal`, `protected` on val/var/fun/const
 * - `const` on local variables
 */
private val MODIFIER_STRIP_REGEX = Regex(
    """^(\s*)(?:(?:private|public|internal|protected)\s+)?(?:const\s+)?((?:val|var|fun|suspend)\s)"""
)

fun stripImportsFromBlock(code: String): String {
    val lines = code.split("\n")
    val bodyLines = lines.filterNot { isKotlinImportLine(it) }

    val trimmed = bodyLines
        .dropWhile { it.isBlank() }
        .dropLastWhile { it.isBlank() }

    // Strip modifiers invalid in local scope
    val strippedLines = trimmed.map { line ->
        MODIFIER_STRIP_REGEX.replace(line) { match ->
            match.groupValues[1] + match.groupValues[2]
        }
    }

    return strippedLines.joinToString("\n")
}
