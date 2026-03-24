package com.icure.docs.helpers.howto.initializethesdk

import com.icure.cardinal.sdk.CardinalSdk

private suspend fun preBlockAABT(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> = mapOf(
    "specId" to "test-spec-id",
    "processId" to "test-process-id",
    "friendlyCaptchaResponse" to "test-captcha-response",
)

private suspend fun preBlockAABU(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> = mapOf(
    "specId" to "test-spec-id",
    "processId" to "test-process-id",
    "reCaptchaResponse" to "test-recaptcha-response",
)

private suspend fun preBlockAABV(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> = mapOf(
    "specId" to "test-spec-id",
    "processId" to "test-process-id",
)

object CaptchaHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "captcha block 1 (AABT)" to ::preBlockAABT,
        "captcha block 2 (AABU)" to ::preBlockAABU,
        "captcha block 3 (AABV)" to ::preBlockAABV,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
