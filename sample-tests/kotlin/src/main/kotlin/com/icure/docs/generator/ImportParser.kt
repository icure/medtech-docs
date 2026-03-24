package com.icure.docs.generator

/**
 * Import prefixes that are NOT available in the test classpath and should be excluded
 * from the global import superset.
 */
private val EXCLUDED_IMPORT_PREFIXES = listOf(
    "import com.icure.kotp",
    "import com.icure.cardinal.sdk.storage.impl.LocalStorageStorageFacade",
    "import com.icure.cardinal.sdk.storage.impl.JwkKeyStorage",
    "import com.icure.cardinal.sdk.storage.impl.JsonAndBase64KeyStorage",
    "import io.ktor.client.engine.cio",
)

fun isExcludedImport(line: String): Boolean {
    val trimmed = line.trim()
    return EXCLUDED_IMPORT_PREFIXES.any { trimmed.startsWith(it) }
}

fun mergeKotlinImports(importLines: List<String>): List<String> {
    val unique = importLines
        .map { it.trim() }
        .filter { isKotlinImportLine(it) && !isExcludedImport(it) }
        .toSortedSet()

    return unique.toList()
}

fun renderKotlinImports(imports: List<String>): String {
    return imports.joinToString("\n")
}
