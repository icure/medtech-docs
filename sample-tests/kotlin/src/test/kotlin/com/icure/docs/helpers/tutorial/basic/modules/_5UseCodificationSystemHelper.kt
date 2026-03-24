package com.icure.docs.helpers.tutorial.basic.modules

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.model.Code
import java.io.ByteArrayInputStream

object _5UseCodificationSystemHelper {
    private var selectedCode: Code? = null
    private val prettyPrint: (Any?) -> Unit = { println(it) }

    private suspend fun preBlock2(sdk: CardinalSdk): Map<String, Any?> {
        System.setIn(ByteArrayInputStream("y\n".toByteArray()))
        return mapOf(
            "prettyPrint" to prettyPrint,
        )
    }

    private suspend fun preBlock3(sdk: CardinalSdk): Map<String, Any?> {
        if (selectedCode == null) {
            // Fallback: pick the first SNOMED code with "blood" from the codes created in block 1
            val codeIterator = sdk.code.filterCodesBy(
                com.icure.cardinal.sdk.filters.CodeFilters.byLanguageTypeLabelRegion(
                    language = "en",
                    label = "blood",
                    type = "SNOMED"
                )
            )
            if (codeIterator.hasNext()) {
                selectedCode = codeIterator.next(1).first()
            }
        }
        return mapOf(
            "selectedCode" to selectedCode,
            "prettyPrint" to prettyPrint,
        )
    }

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "5_use_codification_system block 2 (AAED)" to ::preBlock2,
        "5_use_codification_system block 3 (AAEE)" to ::preBlock3,
    )

    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf(
        "5_use_codification_system block 2 (AAED)" to { _, extracted ->
            selectedCode = extracted["selectedCode"] as? Code
        },
    )
}
