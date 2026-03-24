package com.icure.docs.helpers.howto.initializethesdk

import com.icure.cardinal.sdk.CardinalSdk

private suspend fun preBlockAACF(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val askValidationCode: suspend () -> String = { "123456" }
    return mapOf(
        "specId" to "test-spec-id",
        "processId" to "test-process-id",
        "askValidationCode" to askValidationCode,
    )
}

private suspend fun preBlockAACG(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val getCachedToken: suspend () -> String? = { "test-cached-token" }
    val askUserPassword: suspend () -> String = { "test-password" }
    return mapOf(
        "username" to "test-username",
        "getCachedToken" to getCachedToken,
        "askUserPassword" to askUserPassword,
    )
}

object IndexHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "index block 5 (AACF)" to ::preBlockAACF,
        "index block 6 (AACG)" to ::preBlockAACG,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
