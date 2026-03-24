@file:OptIn(kotlin.time.ExperimentalTime::class)
package com.icure.docs.helpers.howto

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.auth.UsernamePassword
import com.icure.cardinal.sdk.model.DecryptedPatient
import com.icure.cardinal.sdk.model.embed.AccessLevel
import com.icure.cardinal.sdk.model.embed.DecryptedContent
import com.icure.cardinal.sdk.model.embed.DecryptedService
import com.icure.cardinal.sdk.model.embed.Measure
import com.icure.cardinal.sdk.model.embed.Medication
import com.icure.cardinal.sdk.model.embed.Substanceproduct
import com.icure.cardinal.sdk.model.embed.TimeSeries
import com.icure.cardinal.sdk.options.AuthenticationMethod
import com.icure.cardinal.sdk.storage.impl.FileStorageFacade
import java.util.UUID
import kotlin.random.Random

object ContactGroupIdHelper {

    private suspend fun initSdks(): Pair<CardinalSdk, CardinalSdk> {
        val cardinalUrl = System.getenv("CARDINAL_URL")
            ?: error("Missing required environment variable: CARDINAL_URL")
        val visitingDoctorUsername = System.getenv("VISITING_DOCTOR_USERNAME")
            ?: error("Missing required environment variable: VISITING_DOCTOR_USERNAME")
        val visitingDoctorPassword = System.getenv("VISITING_DOCTOR_PASSWORD")
            ?: error("Missing required environment variable: VISITING_DOCTOR_PASSWORD")
        val researchDoctorUsername = System.getenv("RESEARCH_DOCTOR_USERNAME")
            ?: error("Missing required environment variable: RESEARCH_DOCTOR_USERNAME")
        val researchDoctorPassword = System.getenv("RESEARCH_DOCTOR_PASSWORD")
            ?: error("Missing required environment variable: RESEARCH_DOCTOR_PASSWORD")

        val visitingDoctorSdk = CardinalSdk.initialize(
            projectId = null,
            baseUrl = cardinalUrl,
            authenticationMethod = AuthenticationMethod.UsingCredentials(
                UsernamePassword(visitingDoctorUsername, visitingDoctorPassword)
            ),
            baseStorage = FileStorageFacade("./scratch/storage")
        )
        val researchDoctorSdk = CardinalSdk.initialize(
            projectId = null,
            baseUrl = cardinalUrl,
            authenticationMethod = AuthenticationMethod.UsingCredentials(
                UsernamePassword(researchDoctorUsername, researchDoctorPassword)
            ),
            baseStorage = FileStorageFacade("./scratch/storage")
        )
        return Pair(visitingDoctorSdk, researchDoctorSdk)
    }

    private suspend fun createPatient(visitingDoctorSdk: CardinalSdk): DecryptedPatient {
        val patientToCreate = DecryptedPatient(
            id = UUID.randomUUID().toString(),
            firstName = "Rupert",
            lastName = "Venables",
        )
        return visitingDoctorSdk.patient.createPatient(
            visitingDoctorSdk.patient.withEncryptionMetadata(patientToCreate)
        )
    }

    private fun createServices(): Triple<DecryptedService, DecryptedService, DecryptedService> {
        val bloodPressureService = DecryptedService(
            id = UUID.randomUUID().toString(),
            label = "Blood pressure",
            valueDate = 20240920154600,
            content = mapOf(
                "en" to DecryptedContent(
                    measureValue = Measure(
                        value = Random.nextInt(80, 120).toDouble(),
                        unit = "mmHg"
                    )
                )
            )
        )

        val ecgSignal = List(10) { Random.nextInt(0, 100) / 100.0 }
        val heartRateService = DecryptedService(
            id = UUID.randomUUID().toString(),
            label = "Heart rate",
            valueDate = 20240920154600,
            content = mapOf(
                "en" to DecryptedContent(
                    timeSeries = TimeSeries(
                        samples = listOf(ecgSignal)
                    )
                )
            )
        )

        val medicationService = DecryptedService(
            id = UUID.randomUUID().toString(),
            label = "Prescription",
            valueDate = 20240920154600,
            content = mapOf(
                "en" to DecryptedContent(
                    medicationValue = Medication(
                        substanceProduct = Substanceproduct(
                            deliveredname = "lisinopril"
                        ),
                        instructionForPatient = "10mg before breakfast."
                    )
                )
            )
        )

        return Triple(bloodPressureService, heartRateService, medicationService)
    }

    private suspend fun preBlock1(sdk: CardinalSdk): Map<String, Any?> {
        return mapOf(
            "VISITING_DOCTOR_USERNAME" to (System.getenv("VISITING_DOCTOR_USERNAME") ?: error("Missing VISITING_DOCTOR_USERNAME")),
            "VISITING_DOCTOR_PASSWORD" to (System.getenv("VISITING_DOCTOR_PASSWORD") ?: error("Missing VISITING_DOCTOR_PASSWORD")),
            "RESEARCH_DOCTOR_USERNAME" to (System.getenv("RESEARCH_DOCTOR_USERNAME") ?: error("Missing RESEARCH_DOCTOR_USERNAME")),
            "RESEARCH_DOCTOR_PASSWORD" to (System.getenv("RESEARCH_DOCTOR_PASSWORD") ?: error("Missing RESEARCH_DOCTOR_PASSWORD")),
        )
    }

    private suspend fun preBlock2(sdk: CardinalSdk): Map<String, Any?> {
        val (visitingDoctorSdk, _) = initSdks()
        return mapOf("visitingDoctorSdk" to visitingDoctorSdk)
    }

    private suspend fun preBlock3(sdk: CardinalSdk): Map<String, Any?> {
        val (_, researchDoctorSdk) = initSdks()
        return mapOf("researchDoctorSdk" to researchDoctorSdk)
    }

    private suspend fun preBlock5(sdk: CardinalSdk): Map<String, Any?> {
        val (visitingDoctorSdk, researchDoctorSdk) = initSdks()
        val patient = createPatient(visitingDoctorSdk)
        val researchDoctorId = researchDoctorSdk.healthcareParty.getCurrentHealthcareParty().id
        val (bloodPressureService, heartRateService, medicationService) = createServices()
        return mapOf(
            "visitingDoctorSdk" to visitingDoctorSdk,
            "patient" to patient,
            "researchDoctorId" to researchDoctorId,
            "heartRateService" to heartRateService,
            "bloodPressureService" to bloodPressureService,
            "medicationService" to medicationService,
        )
    }

    private suspend fun preBlock6(sdk: CardinalSdk): Map<String, Any?> {
        val (visitingDoctorSdk, researchDoctorSdk) = initSdks()
        val patient = createPatient(visitingDoctorSdk)
        val researchDoctorId = researchDoctorSdk.healthcareParty.getCurrentHealthcareParty().id
        val (bloodPressureService, heartRateService, medicationService) = createServices()

        // Create the contacts so the services can be found by filters
        val groupId = UUID.randomUUID().toString()
        val contactForResearch = com.icure.cardinal.sdk.model.DecryptedContact(
            id = UUID.randomUUID().toString(),
            openingDate = 20240920154460,
            groupId = groupId,
            services = setOf(heartRateService)
        )
        val contact = com.icure.cardinal.sdk.model.DecryptedContact(
            id = UUID.randomUUID().toString(),
            closingDate = 20240920164460,
            groupId = groupId,
            services = setOf(bloodPressureService, medicationService)
        )
        visitingDoctorSdk.contact.createContact(
            visitingDoctorSdk.contact.withEncryptionMetadata(contact, patient)
        )
        visitingDoctorSdk.contact.createContact(
            visitingDoctorSdk.contact.withEncryptionMetadata(
                contactForResearch, patient,
                delegates = mapOf(researchDoctorId to AccessLevel.Read)
            )
        )

        return mapOf(
            "visitingDoctorSdk" to visitingDoctorSdk,
            "patient" to patient,
        )
    }

    private suspend fun preBlock7(sdk: CardinalSdk): Map<String, Any?> {
        val (_, researchDoctorSdk) = initSdks()
        return mapOf("researchDoctorSdk" to researchDoctorSdk)
    }

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "contact-group-id block 1 (AAAN)" to ::preBlock1,
        "contact-group-id block 2 (AAAO)" to ::preBlock2,
        "contact-group-id block 3 (AAAP)" to ::preBlock3,
        "contact-group-id block 5 (AAAR)" to ::preBlock5,
        "contact-group-id block 6 (AAAS)" to ::preBlock6,
        "contact-group-id block 7 (AAAT)" to ::preBlock7,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
