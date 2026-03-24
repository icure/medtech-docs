package com.icure.docs.helpers.howto

import com.icure.cardinal.sdk.CardinalSdk

object ShareDataWithManyUsersHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf()
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
