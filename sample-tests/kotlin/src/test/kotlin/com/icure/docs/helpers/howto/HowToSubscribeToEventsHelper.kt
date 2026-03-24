package com.icure.docs.helpers.howto

import com.icure.cardinal.sdk.CardinalSdk

object HowToSubscribeToEventsHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "how-to-subscribe-to-events block 2 (AABB)" to { sdk ->
            val subscription = sdk.healthElement.subscribeToEvents(
                emptySet(),
                com.icure.cardinal.sdk.filters.HealthElementFilters.byTagForSelf(
                    tagType = "_",
                    tagCode = "_",
                ),
            )
            subscription.close()
            mapOf("subscription" to subscription)
        },
        "how-to-subscribe-to-events block 3 (AABC)" to { _ ->
            val addToQueueToProcess: suspend (Any?) -> Unit = { }
            mapOf(
                "addToQueueToProcess" to addToQueueToProcess,
                "INTERNAL_INFERENCE_STATUS" to "INTERNAL_INFERENCE_STATUS",
                "TO_BE_STARTED" to "TO_BE_STARTED",
            )
        },
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
