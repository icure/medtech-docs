package com.icure.docs.helpers.explanations

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.filters.PatientFilters

object EverythingAboutFiltersHelper {

    private suspend fun providePatientFilters(sdk: CardinalSdk, vararg names: String): Map<String, Any?> {
        val result = mutableMapOf<String, Any?>()
        for (name in names) {
            result[name] = PatientFilters.byActiveForSelf(true)
        }
        return result
    }

    val preTest = mapOf<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>>(
        "everything-about-filters block 1 (AAGB)" to { sdk ->
            providePatientFilters(sdk, "filterA", "filterB", "filterC")
        },
        "everything-about-filters block 2 (AAGC)" to { sdk ->
            providePatientFilters(sdk, "filterA", "filterB")
        },
        "everything-about-filters block 3 (AAGD)" to { sdk ->
            mapOf(
                "ofFilter" to PatientFilters.byActiveForSelf(true),
                "subtractingFilter" to PatientFilters.byActiveForSelf(false),
            )
        },
        "everything-about-filters block 4 (AAGE)" to { sdk ->
            providePatientFilters(sdk, "filterA", "filterB", "filterC", "filterD", "filterE")
        },
    )

    val postTest = mapOf<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit>()
}
