package com.icure.docs.helpers.quickstart

import com.icure.cardinal.sdk.CardinalSdk

object KotlinHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf()
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
