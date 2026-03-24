package com.icure.docs.helpers.tutorial.basic.modules

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.model.DecryptedPatient
import java.io.ByteArrayInputStream
import java.util.UUID

object _1CreatePatientHelper {
    private var patient: DecryptedPatient? = null
    private var patientWithMetadata: DecryptedPatient? = null
    private var createdPatient: DecryptedPatient? = null
    private var updatedPatient: DecryptedPatient? = null

    private suspend fun preBlock1(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
        System.setIn(ByteArrayInputStream("John\nDoe\n".toByteArray()))
        return emptyMap()
    }

    private suspend fun preBlock2(sdk: CardinalSdk): Map<String, Any?> {
        if (patient == null) {
            patient = DecryptedPatient(
                id = UUID.randomUUID().toString(),
                firstName = "John",
                lastName = "Doe",
            )
        }
        return mapOf("patient" to patient)
    }

    private suspend fun preBlock3(sdk: CardinalSdk): Map<String, Any?> {
        if (patientWithMetadata == null) {
            val p = patient ?: DecryptedPatient(
                id = UUID.randomUUID().toString(),
                firstName = "John",
                lastName = "Doe",
            )
            patientWithMetadata = sdk.patient.withEncryptionMetadata(p)
        }
        return mapOf("patientWithMetadata" to patientWithMetadata)
    }

    private suspend fun preBlock4(sdk: CardinalSdk): Map<String, Any?> {
        if (createdPatient == null) {
            val p = patientWithMetadata ?: sdk.patient.withEncryptionMetadata(
                DecryptedPatient(
                    id = UUID.randomUUID().toString(),
                    firstName = "John",
                    lastName = "Doe",
                )
            )
            createdPatient = sdk.patient.createPatient(p)
        }
        System.setIn(ByteArrayInputStream("19900101\n".toByteArray()))
        return mapOf("createdPatient" to createdPatient)
    }

    private suspend fun preBlock5(sdk: CardinalSdk): Map<String, Any?> {
        if (updatedPatient == null) {
            val cp = createdPatient ?: sdk.patient.createPatient(
                sdk.patient.withEncryptionMetadata(
                    DecryptedPatient(
                        id = UUID.randomUUID().toString(),
                        firstName = "John",
                        lastName = "Doe",
                    )
                )
            )
            updatedPatient = sdk.patient.modifyPatient(cp.copy(dateOfBirth = 19900101))
        }
        return mapOf("updatedPatient" to updatedPatient)
    }

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "1_create_patient block 1 (AADX)" to ::preBlock1,
        "1_create_patient block 2 (AADY)" to ::preBlock2,
        "1_create_patient block 3 (AADZ)" to ::preBlock3,
        "1_create_patient block 4 (AAEA)" to ::preBlock4,
        "1_create_patient block 5 (AAEB)" to ::preBlock5,
    )

    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf(
        "1_create_patient block 1 (AADX)" to { _, extracted ->
            patient = extracted["patient"] as? DecryptedPatient
        },
        "1_create_patient block 2 (AADY)" to { _, extracted ->
            patientWithMetadata = extracted["patientWithMetadata"] as? DecryptedPatient
        },
        "1_create_patient block 3 (AADZ)" to { _, extracted ->
            createdPatient = extracted["createdPatient"] as? DecryptedPatient
        },
        "1_create_patient block 4 (AAEA)" to { _, extracted ->
            updatedPatient = extracted["updatedPatient"] as? DecryptedPatient
        },
    )
}
