package com.icure.docs.helpers.howto

import com.icure.cardinal.sdk.CardinalSdk

private suspend fun preTestBlock1(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val getDeviceId: () -> String = { "test-device-id" }
    val saveCredentialsInPersistentStorage: (String, String) -> Unit = { _: String, _: String -> }
    return mapOf(
        "getDeviceId" to getDeviceId,
        "saveCredentialsInPersistentStorage" to saveCredentialsInPersistentStorage,
    )
}

private suspend fun preTestBlock2(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val getCredentialsFromPersistentStorage: () -> Pair<String, String> = { Pair("testuser", "testtoken") }
    return mapOf("getCredentialsFromPersistentStorage" to getCredentialsFromPersistentStorage)
}

object RememberMeHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "remember-me block 1 (AABD)" to ::preTestBlock1,
        "remember-me block 2 (AABE)" to ::preTestBlock2,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = emptyMap()
}
