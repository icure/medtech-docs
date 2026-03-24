package com.icure.docs.helpers.howto

import com.icure.cardinal.sdk.CardinalSdk

private suspend fun preBlockAABF(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val askUserValidationCode: suspend () -> String = { "123456" }
    return mapOf("askUserValidationCode" to askUserValidationCode)
}

private suspend fun preBlockAABH(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val askUserValidationCode: suspend () -> String = { "123456" }
    return mapOf("askUserValidationCode" to askUserValidationCode)
}

private suspend fun preBlockAABJ(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val showRecoveryKey: (String) -> Unit = { _ -> }
    return mapOf("showRecoveryKey" to showRecoveryKey)
}

private suspend fun preBlockAABK(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val askValidationCode: suspend () -> String = { "123456" }
    val askRecoveryKey: suspend () -> String = { "AAAA-BBBB-CCCC-DDDD-EEEE-FFFF-GGGG" }
    return mapOf(
        "askValidationCode" to askValidationCode,
        "askRecoveryKey" to askRecoveryKey,
    )
}

object RegisteringUsersHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "registering-users block 1 (AABF)" to ::preBlockAABF,
        "registering-users block 3 (AABH)" to ::preBlockAABH,
        "registering-users block 5 (AABJ)" to ::preBlockAABJ,
        "registering-users block 6 (AABK)" to ::preBlockAABK,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
