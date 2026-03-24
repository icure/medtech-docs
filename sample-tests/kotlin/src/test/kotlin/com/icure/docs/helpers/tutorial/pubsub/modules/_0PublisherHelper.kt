@file:OptIn(kotlin.time.ExperimentalTime::class)
package com.icure.docs.helpers.tutorial.pubsub.modules

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.model.DecryptedContact
import com.icure.cardinal.sdk.model.DecryptedPatient
import com.icure.cardinal.sdk.model.User
import com.icure.cardinal.sdk.model.base.CodeStub
import com.icure.cardinal.sdk.model.embed.AccessLevel
import com.icure.cardinal.sdk.model.embed.DecryptedContent
import com.icure.cardinal.sdk.model.embed.DecryptedService
import com.icure.cardinal.sdk.model.embed.Measure
import com.icure.cardinal.sdk.crypto.entities.PatientShareOptions
import com.icure.cardinal.sdk.crypto.entities.SecretIdShareOptions
import com.icure.cardinal.sdk.crypto.entities.ShareMetadataBehaviour
import com.icure.cardinal.sdk.model.requests.RequestedPermission
import com.icure.cardinal.sdk.options.AuthenticationMethod
import com.icure.cardinal.sdk.auth.UsernamePassword
import com.icure.cardinal.sdk.filters.ServiceFilters
import com.icure.cardinal.sdk.storage.impl.FileStorageFacade
import java.util.UUID
import kotlin.random.Random

object _0PublisherHelper {
    private const val CARDINAL_URL = "https://api.icure.cloud"
    private const val SNOMED = "http://snomed.info/sct"
    private const val LOINC = "http://loinc.org"
    private const val CARDINAL = "com.icure.cardinal"
    private const val UCUM = "http://unitsofmeasure.org"

    private var createdPatient: DecryptedPatient? = null
    private var login: String? = null
    private var loginToken: String? = null
    private var patient: DecryptedPatient? = null
    private var patientSdk: CardinalSdk? = null

    private suspend fun preBlock3(sdk: CardinalSdk): Map<String, Any?> {
        if (createdPatient == null) {
            val newPatient = DecryptedPatient(
                id = UUID.randomUUID().toString(),
                firstName = "Edmond",
                lastName = "Dantes",
            )
            val patientWithMetadata = sdk.patient.withEncryptionMetadata(newPatient)
            createdPatient = sdk.patient.createPatient(patientWithMetadata)
        }
        return mapOf("createdPatient" to createdPatient)
    }

    private suspend fun preBlock4(sdk: CardinalSdk): Map<String, Any?> {
        if (login == null || loginToken == null) {
            preBlock3(sdk)
            val l = "edmond.dantes.${UUID.randomUUID().toString().substring(0, 6)}@icure.com"
            val patientUser = User(
                id = UUID.randomUUID().toString(),
                patientId = createdPatient!!.id,
                login = l,
                email = l
            )
            val createdUser = sdk.user.createUser(patientUser)
            login = l
            loginToken = sdk.user.getToken(createdUser.id, "login")
        }
        return mapOf("CARDINAL_URL" to CARDINAL_URL, "login" to login, "loginToken" to loginToken)
    }

    private suspend fun preBlock5(sdk: CardinalSdk): Map<String, Any?> {
        if (createdPatient == null) {
            preBlock3(sdk)
        }
        return mapOf("createdPatient" to createdPatient)
    }

    private suspend fun preBlock6(sdk: CardinalSdk): Map<String, Any?> {
        if (login == null || loginToken == null) {
            preBlock4(sdk)
        }
        return mapOf("CARDINAL_URL" to CARDINAL_URL, "login" to login, "loginToken" to loginToken)
    }

    private suspend fun preBlock8(sdk: CardinalSdk): Map<String, Any?> {
        // Ensure patient user exists and is set up
        if (login == null || loginToken == null) {
            preBlock4(sdk)
        }
        // Ensure patient entity was shared
        if (patient == null) {
            // Initialize patient key by logging in as patient
            CardinalSdk.initialize(
                projectId = null,
                baseUrl = CARDINAL_URL,
                authenticationMethod = AuthenticationMethod.UsingCredentials(
                    UsernamePassword(login!!, loginToken!!)
                ),
                baseStorage = FileStorageFacade("./scratch/storage")
            )
            // Share patient with itself
            patient = sdk.patient.shareWith(
                delegateId = createdPatient!!.id,
                patient = createdPatient!!,
                options = PatientShareOptions(
                    shareSecretIds = SecretIdShareOptions.AllAvailable(true),
                    shareEncryptionKey = ShareMetadataBehaviour.IfAvailable,
                    requestedPermissions = RequestedPermission.MaxWrite
                )
            )
        }
        if (patientSdk == null) {
            patientSdk = CardinalSdk.initialize(
                projectId = null,
                baseUrl = CARDINAL_URL,
                authenticationMethod = AuthenticationMethod.UsingCredentials(
                    UsernamePassword(login!!, loginToken!!)
                ),
                baseStorage = FileStorageFacade("./scratch/storage")
            )
        }
        // Create a contact for the test
        val glycemiaValue = Random.nextInt(60, 160).toDouble()
        val contact = DecryptedContact(
            id = UUID.randomUUID().toString(),
            openingDate = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")).toLong(),
            services = setOf(
                DecryptedService(
                    id = UUID.randomUUID().toString(),
                    content = mapOf(
                        "en" to DecryptedContent(
                            measureValue = Measure(
                                value = glycemiaValue,
                                unitCodes = setOf(
                                    CodeStub(
                                        id = "UCUM|mmol/L|1",
                                        type = "UCUM",
                                        code = "mmol/L",
                                        version = "1"
                                    )
                                )
                            )
                        )
                    ),
                    tags = setOf(
                        CodeStub(
                            id = "LOINC|2339-0|1",
                            type = "LOINC",
                            code = "2339-0",
                            version = "1"
                        ),
                        CodeStub(
                            id = "CARDINAL|TO_BE_ANALYZED|1",
                            type = "CARDINAL",
                            code = "TO_BE_ANALYZED",
                            version = "1"
                        )
                    )
                )
            )
        )
        return mapOf("patient" to patient, "patientSdk" to patientSdk, "contact" to contact)
    }

    private suspend fun preBlock9(sdk: CardinalSdk): Map<String, Any?> {
        if (patientSdk == null) {
            preBlock8(sdk)
        }
        return mapOf("patientSdk" to patientSdk)
    }

    private suspend fun preBlock10(sdk: CardinalSdk): Map<String, Any?> {
        if (patientSdk == null) {
            preBlock8(sdk)
        }
        val filter = ServiceFilters.byTagAndValueDateForSelf(
            tagType = "CARDINAL",
            tagCode = "ANALYZED"
        )
        val serviceIterator = patientSdk!!.contact.filterServicesBy(filter)
        return mapOf("serviceIterator" to serviceIterator, "patientSdk" to patientSdk)
    }

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "0_publisher block 3 (AADF)" to ::preBlock3,
        "0_publisher block 4 (AADG)" to ::preBlock4,
        "0_publisher block 5 (AADH)" to ::preBlock5,
        "0_publisher block 6 (AADI)" to ::preBlock6,
        "0_publisher block 8 (AADK)" to ::preBlock8,
        "0_publisher block 9 (AADL)" to ::preBlock9,
        "0_publisher block 10 (AADM)" to ::preBlock10,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf(
        "0_publisher block 2 (AADE)" to { _, extracted ->
            createdPatient = extracted["createdPatient"] as? DecryptedPatient
        },
        "0_publisher block 3 (AADF)" to { _, extracted ->
            login = extracted["login"] as? String
            loginToken = extracted["loginToken"] as? String
        },
        "0_publisher block 5 (AADH)" to { _, extracted ->
            patient = extracted["patient"] as? DecryptedPatient
        },
        "0_publisher block 6 (AADI)" to { _, extracted ->
            patientSdk = extracted["patientSdk"] as? CardinalSdk
        },
    )
}
