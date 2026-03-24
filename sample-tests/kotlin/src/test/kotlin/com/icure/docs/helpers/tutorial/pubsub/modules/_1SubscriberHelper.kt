package com.icure.docs.helpers.tutorial.pubsub.modules

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.filters.ServiceFilters
import com.icure.cardinal.sdk.model.embed.EncryptedService
import com.icure.cardinal.sdk.subscription.EntitySubscription
import com.icure.cardinal.sdk.subscription.EntitySubscriptionEvent

object _1SubscriberHelper {
    private var filter: Any? = null
    private var subscription: EntitySubscription<EncryptedService>? = null

    @Suppress("UNCHECKED_CAST")
    private suspend fun preBlock3(sdk: CardinalSdk): Map<String, Any?> {
        if (filter == null) {
            filter = ServiceFilters.byTagAndValueDateForSelf(
                tagType = "LOINC",
                tagCode = "2339-0"
            ).and(
                ServiceFilters.byTagAndValueDateForSelf(
                    tagType = "CARDINAL",
                    tagCode = "TO_BE_ANALYZED"
                )
            )
        }
        return mapOf("filter" to filter)
    }

    @Suppress("UNCHECKED_CAST")
    private suspend fun preBlock4(sdk: CardinalSdk): Map<String, Any?> {
        if (filter == null) {
            preBlock3(sdk)
        }
        val sub = sdk.contact.subscribeToServiceCreateOrUpdateEvents(
            filter = filter as com.icure.cardinal.sdk.filters.FilterOptions<com.icure.cardinal.sdk.model.embed.Service>
        )
        sub.close()
        return mapOf("subscription" to sub)
    }

    @Suppress("UNCHECKED_CAST")
    private suspend fun preBlock5(sdk: CardinalSdk): Map<String, Any?> {
        return preBlock4(sdk)
    }

    private suspend fun preBlock6(sdk: CardinalSdk): Map<String, Any?> {
        val event: EntitySubscriptionEvent<EncryptedService> = EntitySubscriptionEvent.Connected
        return mapOf("event" to event)
    }

    private suspend fun preBlock7(sdk: CardinalSdk): Map<String, Any?> {
        val event: EntitySubscriptionEvent<EncryptedService> = EntitySubscriptionEvent.Connected
        return mapOf("event" to event)
    }

    private suspend fun preBlock8(sdk: CardinalSdk): Map<String, Any?> {
        val event: EntitySubscriptionEvent<EncryptedService> = EntitySubscriptionEvent.Connected
        return mapOf("event" to event)
    }

    @Suppress("UNCHECKED_CAST")
    private suspend fun preBlock9(sdk: CardinalSdk): Map<String, Any?> {
        if (filter == null) {
            preBlock3(sdk)
        }
        val sub = sdk.contact.subscribeToServiceCreateOrUpdateEvents(
            filter = filter as com.icure.cardinal.sdk.filters.FilterOptions<com.icure.cardinal.sdk.model.embed.Service>
        )
        sub.close()
        return mapOf("subscription" to sub)
    }

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "1_subscriber block 3 (AADP)" to ::preBlock3,
        "1_subscriber block 4 (AADQ)" to ::preBlock4,
        "1_subscriber block 5 (AADR)" to ::preBlock5,
        "1_subscriber block 6 (AADS)" to ::preBlock6,
        "1_subscriber block 7 (AADT)" to ::preBlock7,
        "1_subscriber block 8 (AADU)" to ::preBlock8,
        "1_subscriber block 9 (AADV)" to ::preBlock9,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf(
        "1_subscriber block 2 (AADO)" to { _, extracted ->
            filter = extracted["filter"]
        },
        "1_subscriber block 3 (AADP)" to { _, extracted ->
            @Suppress("UNCHECKED_CAST")
            subscription = extracted["subscription"] as? EntitySubscription<EncryptedService>
        },
    )
}
