package com.icure.docs.helpers.explanations.datamodel

import com.icure.cardinal.sdk.CardinalSdk

object IndexHelper {
    val preTest = mapOf<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>>(
        "index block 1 (AAFM)" to { _ ->
            mapOf(
                "CARDINAL_URL" to (System.getenv("CARDINAL_URL") ?: "https://api.icure.cloud"),
                "username" to (System.getenv("CARDINAL_USERNAME") ?: "test"),
                "password" to (System.getenv("CARDINAL_PASSWORD") ?: "test"),
                "healthElementId" to java.util.UUID.randomUUID().toString(),
            )
        },
    )
    val postTest = mapOf<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit>()
}
