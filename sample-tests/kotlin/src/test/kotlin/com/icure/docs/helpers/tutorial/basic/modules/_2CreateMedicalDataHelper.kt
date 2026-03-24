package com.icure.docs.helpers.tutorial.basic.modules

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.model.DecryptedContact
import com.icure.cardinal.sdk.model.DecryptedDocument
import com.icure.cardinal.sdk.model.DecryptedHealthElement
import com.icure.cardinal.sdk.model.DecryptedPatient
import com.icure.cardinal.sdk.model.embed.DecryptedService
import java.io.ByteArrayInputStream
import java.time.format.DateTimeFormatter

object _2CreateMedicalDataHelper {

    // Module-level state for cross-block variable passing
    private var savedPatient: DecryptedPatient? = null
    private var savedContact: DecryptedContact? = null
    private var savedFormatter: DateTimeFormatter? = null
    private var savedContactWithMetadata: DecryptedContact? = null
    private var savedCreatedContact: DecryptedContact? = null
    private var savedBloodPressureService: DecryptedService? = null
    private var savedContactWithBloodPressure: DecryptedContact? = null
    private var savedContactWithECG: DecryptedContact? = null
    private var savedDocument: DecryptedDocument? = null
    private var savedCreatedDocument: DecryptedDocument? = null
    private var savedDocumentWithAttachment: DecryptedDocument? = null
    private var savedContactWithImage: DecryptedContact? = null
    private var savedCreatedDiagnosis: DecryptedHealthElement? = null
    private var savedContactWithDiagnosis: DecryptedContact? = null

    // --- preTest named functions ---

    private suspend fun preBlock1(sdk: CardinalSdk): Map<String, Any?> {
        // Mock readlnOrNull() -> blank so it creates a new patient
        System.setIn(ByteArrayInputStream("\n".toByteArray()))
        return emptyMap()
    }

    private suspend fun preBlock2(sdk: CardinalSdk): Map<String, Any?> {
        // Mock readln() for description
        System.setIn(ByteArrayInputStream("Annual checkup\n".toByteArray()))
        return emptyMap()
    }

    private suspend fun preBlock3(sdk: CardinalSdk): Map<String, Any?> = mapOf(
        "contact" to savedContact!!,
        "patient" to savedPatient!!,
    )

    private suspend fun preBlock4(sdk: CardinalSdk): Map<String, Any?> = mapOf(
        "contactWithMetadata" to savedContactWithMetadata!!,
    )

    private suspend fun preBlock6(sdk: CardinalSdk): Map<String, Any?> = mapOf(
        "createdContact" to savedCreatedContact!!,
        "bloodPressureService" to savedBloodPressureService!!,
    )

    private suspend fun preBlock7(sdk: CardinalSdk): Map<String, Any?> = mapOf(
        "contactWithBloodPressure" to savedContactWithBloodPressure!!,
    )

    private suspend fun preBlock9(sdk: CardinalSdk): Map<String, Any?> = mapOf(
        "document" to savedDocument!!,
    )

    private suspend fun preBlock10(sdk: CardinalSdk): Map<String, Any?> = mapOf(
        "createdDocument" to savedCreatedDocument!!,
    )

    private suspend fun preBlock11(sdk: CardinalSdk): Map<String, Any?> = mapOf(
        "documentWithAttachment" to savedDocumentWithAttachment!!,
        "contactWithECG" to savedContactWithECG!!,
    )

    private suspend fun preBlock12(sdk: CardinalSdk): Map<String, Any?> {
        // Mock readln() for diagnosis
        System.setIn(ByteArrayInputStream("Mild hypertension\n".toByteArray()))
        return mapOf(
            "patient" to savedPatient!!,
        )
    }

    private suspend fun preBlock13(sdk: CardinalSdk): Map<String, Any?> = mapOf(
        "contactWithImage" to savedContactWithImage!!,
        "createdDiagnosis" to savedCreatedDiagnosis!!,
    )

    private suspend fun preBlock14(sdk: CardinalSdk): Map<String, Any?> = mapOf(
        "contactWithDiagnosis" to savedContactWithDiagnosis!!,
        "formatter" to savedFormatter!!,
    )

    // --- postTest named functions ---

    private suspend fun postBlock1(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedPatient = extracted["patient"] as DecryptedPatient
    }

    private suspend fun postBlock2(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedFormatter = extracted["formatter"] as DateTimeFormatter
        savedContact = extracted["contact"] as DecryptedContact
    }

    private suspend fun postBlock3(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedContactWithMetadata = extracted["contactWithMetadata"] as DecryptedContact
    }

    private suspend fun postBlock4(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedCreatedContact = extracted["createdContact"] as DecryptedContact
    }

    private suspend fun postBlock5(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedBloodPressureService = extracted["bloodPressureService"] as DecryptedService
    }

    private suspend fun postBlock6(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedContactWithBloodPressure = extracted["contactWithBloodPressure"] as DecryptedContact
    }

    private suspend fun postBlock7(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedContactWithECG = extracted["contactWithECG"] as DecryptedContact
    }

    private suspend fun postBlock8(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedDocument = extracted["document"] as DecryptedDocument
    }

    private suspend fun postBlock9(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedCreatedDocument = extracted["createdDocument"] as DecryptedDocument
    }

    private suspend fun postBlock10(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedDocumentWithAttachment = extracted["documentWithAttachment"] as DecryptedDocument
    }

    private suspend fun postBlock11(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedContactWithImage = extracted["contactWithImage"] as DecryptedContact
    }

    private suspend fun postBlock12(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedCreatedDiagnosis = extracted["createdDiagnosis"] as DecryptedHealthElement
    }

    private suspend fun postBlock13(sdk: CardinalSdk, extracted: Map<String, Any?>) {
        savedContactWithDiagnosis = extracted["contactWithDiagnosis"] as DecryptedContact
    }

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "2_create_medical_data block 1 (AAEY)" to ::preBlock1,
        "2_create_medical_data block 2 (AAEZ)" to ::preBlock2,
        "2_create_medical_data block 3 (AAFA)" to ::preBlock3,
        "2_create_medical_data block 4 (AAFB)" to ::preBlock4,
        "2_create_medical_data block 6 (AAFD)" to ::preBlock6,
        "2_create_medical_data block 7 (AAFE)" to ::preBlock7,
        "2_create_medical_data block 9 (AAFG)" to ::preBlock9,
        "2_create_medical_data block 10 (AAFH)" to ::preBlock10,
        "2_create_medical_data block 11 (AAFI)" to ::preBlock11,
        "2_create_medical_data block 12 (AAFJ)" to ::preBlock12,
        "2_create_medical_data block 13 (AAFK)" to ::preBlock13,
        "2_create_medical_data block 14 (AAFL)" to ::preBlock14,
    )

    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf(
        "2_create_medical_data block 1 (AAEY)" to ::postBlock1,
        "2_create_medical_data block 2 (AAEZ)" to ::postBlock2,
        "2_create_medical_data block 3 (AAFA)" to ::postBlock3,
        "2_create_medical_data block 4 (AAFB)" to ::postBlock4,
        "2_create_medical_data block 5 (AAFC)" to ::postBlock5,
        "2_create_medical_data block 6 (AAFD)" to ::postBlock6,
        "2_create_medical_data block 7 (AAFE)" to ::postBlock7,
        "2_create_medical_data block 8 (AAFF)" to ::postBlock8,
        "2_create_medical_data block 9 (AAFG)" to ::postBlock9,
        "2_create_medical_data block 10 (AAFH)" to ::postBlock10,
        "2_create_medical_data block 11 (AAFI)" to ::postBlock11,
        "2_create_medical_data block 12 (AAFJ)" to ::postBlock12,
        "2_create_medical_data block 13 (AAFK)" to ::postBlock13,
    )
}
