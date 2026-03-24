package com.icure.docs.helpers.tutorial.basic.modules

import com.icure.cardinal.sdk.CardinalSdk

object _0SdkInitializationHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf()
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
