@file:OptIn(kotlin.time.ExperimentalTime::class)
package com.icure.docs.helpers.tutorial.basic.modules

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.filters.PatientFilters
import com.icure.cardinal.sdk.model.DecryptedContact
import com.icure.cardinal.sdk.model.DecryptedPatient
import com.icure.cardinal.sdk.model.Patient
import com.icure.cardinal.sdk.model.base.Identifier
import com.icure.cardinal.sdk.model.embed.DecryptedContent
import com.icure.cardinal.sdk.model.embed.DecryptedService
import com.icure.cardinal.sdk.model.embed.Measure
import com.icure.cardinal.sdk.utils.pagination.PaginatedListIterator
import java.io.ByteArrayInputStream
import java.util.UUID

object _3SearchingDataHelper {
    private var patient: Patient? = null
    private var patientIterator: PaginatedListIterator<Patient>? = null
    private val prettyPrint: (Any?) -> Unit = { println(it) }

    private suspend fun preBlock1(sdk: CardinalSdk): Map<String, Any?> {
        // Create a patient so the search has something to find
        val testPatient = sdk.patient.createPatient(
            sdk.patient.withEncryptionMetadata(
                DecryptedPatient(
                    id = UUID.randomUUID().toString(),
                    firstName = "Annabelle",
                    lastName = "Hall",
                )
            )
        )
        patient = testPatient
        System.setIn(ByteArrayInputStream("Annabelle\n".toByteArray()))
        return emptyMap()
    }

    private suspend fun preBlock2(sdk: CardinalSdk): Map<String, Any?> {
        if (patientIterator == null) {
            if (patient == null) {
                val testPatient = sdk.patient.createPatient(
                    sdk.patient.withEncryptionMetadata(
                        DecryptedPatient(
                            id = UUID.randomUUID().toString(),
                            firstName = "Annabelle",
                            lastName = "Hall",
                        )
                    )
                )
                patient = testPatient
            }
            patientIterator = sdk.patient.filterPatientsBy(
                PatientFilters.byNameForSelf("Annabelle")
            )
        }
        System.setIn(ByteArrayInputStream("y\n".toByteArray()))
        return mapOf(
            "patientIterator" to patientIterator,
            "prettyPrint" to prettyPrint,
        )
    }

    private suspend fun preBlock3(sdk: CardinalSdk): Map<String, Any?> {
        if (patient == null) {
            val testPatient = sdk.patient.createPatient(
                sdk.patient.withEncryptionMetadata(
                    DecryptedPatient(
                        id = UUID.randomUUID().toString(),
                        firstName = "Annabelle",
                        lastName = "Hall",
                    )
                )
            )
            patient = testPatient
        }
        // Create a contact linked to the patient so filter has results
        val contact = DecryptedContact(
            id = UUID.randomUUID().toString(),
            descr = "Test contact",
            services = setOf(
                DecryptedService(
                    id = UUID.randomUUID().toString(),
                    label = "Test service",
                    identifier = listOf(Identifier(system = "cardinal", value = "bloodPressure")),
                    content = mapOf(
                        "en" to DecryptedContent(
                            measureValue = Measure(
                                value = 100.0,
                                unit = "mmHg"
                            )
                        )
                    )
                )
            )
        )
        sdk.contact.createContact(
            sdk.contact.withEncryptionMetadata(contact, patient as DecryptedPatient)
        )
        System.setIn(ByteArrayInputStream("\n".toByteArray()))
        return mapOf(
            "patient" to patient,
            "prettyPrint" to prettyPrint,
        )
    }

    private suspend fun preBlock4(sdk: CardinalSdk): Map<String, Any?> {
        System.setIn(ByteArrayInputStream("0\n\n".toByteArray()))
        return mapOf(
            "prettyPrint" to prettyPrint,
        )
    }

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "3_searching_data block 1 (AAFN)" to ::preBlock1,
        "3_searching_data block 2 (AAFO)" to ::preBlock2,
        "3_searching_data block 3 (AAFP)" to ::preBlock3,
        "3_searching_data block 4 (AAFQ)" to ::preBlock4,
    )

    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf(
        "3_searching_data block 1 (AAFN)" to { _, extracted ->
            @Suppress("UNCHECKED_CAST")
            patientIterator = extracted["patientIterator"] as? PaginatedListIterator<Patient>
        },
        "3_searching_data block 2 (AAFO)" to { _, extracted ->
            patient = extracted["patient"] as? Patient
        },
    )
}
