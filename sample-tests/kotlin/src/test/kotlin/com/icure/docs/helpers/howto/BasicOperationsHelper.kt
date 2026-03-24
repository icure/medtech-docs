package com.icure.docs.helpers.howto

import com.icure.cardinal.sdk.CardinalSdk

/**
 * Mock for the undefined placeholder used in the conflict-resolution code sample.
 * Simply picks the incoming (new) note value.
 */
fun askUserToResolveNoteConflict(existingNote: String?, newNote: String): String = newNote

object BasicOperationsHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "basic-operations block 10 (AAAJ)" to { _ -> emptyMap() },
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
