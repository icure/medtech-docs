package com.icure.docs.helpers.tutorial.basic.modules

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.model.DecryptedDocument
import com.icure.cardinal.sdk.model.DecryptedHealthElement
import com.icure.cardinal.sdk.model.DecryptedPatient
import com.icure.cardinal.sdk.model.HealthcareParty
import com.icure.cardinal.sdk.model.User
import java.io.ByteArrayInputStream

object _4ShareDataHelper {
    // Module-level state passed between blocks
    private var otherSdk: CardinalSdk? = null
    private var otherHcp: HealthcareParty? = null
    private var oldDocument: DecryptedDocument? = null
    private var createdNewDocument: DecryptedDocument? = null
    private var createdPatient: DecryptedPatient? = null
    private var login: String? = null
    private var createdUser: User? = null
    private var loginToken: String? = null
    private var patient: DecryptedPatient? = null
    private var patientSdk: CardinalSdk? = null
    private var createdHealthElement: DecryptedHealthElement? = null
    private var newCreatedHealthElement: DecryptedHealthElement? = null

    private fun cardinalUrl(): String =
        System.getenv("CARDINAL_URL") ?: error("Missing CARDINAL_URL")

    private fun hcpUsername(): String =
        System.getenv("CARDINAL_OTHER_USERNAME") ?: "test-other-hcp"

    private fun hcpPassword(): String =
        System.getenv("CARDINAL_OTHER_PASSWORD") ?: "test-other-hcp-pass"

    // ---------- preTest ----------

    private suspend fun preBlock1(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
        // Feed readln() calls: username then password
        val username = hcpUsername()
        val password = hcpPassword()
        System.setIn(ByteArrayInputStream("$username\n$password\n".toByteArray()))
        return mapOf("CARDINAL_URL" to cardinalUrl())
    }

    private suspend fun preBlock3(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("otherSdk" to otherSdk, "oldDocument" to oldDocument)

    private suspend fun preBlock4(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("otherHcp" to otherHcp, "oldDocument" to oldDocument)

    private suspend fun preBlock5(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("otherSdk" to otherSdk, "oldDocument" to oldDocument)

    private suspend fun preBlock6(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("otherHcp" to otherHcp)

    private suspend fun preBlock7(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("otherSdk" to otherSdk, "createdNewDocument" to createdNewDocument)

    private suspend fun preBlock9(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("createdPatient" to createdPatient)

    private suspend fun preBlock10(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("createdUser" to createdUser, "login" to login)

    private suspend fun preBlock11(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("CARDINAL_URL" to cardinalUrl(), "login" to login, "loginToken" to loginToken)

    private suspend fun preBlock12(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("createdPatient" to createdPatient)

    private suspend fun preBlock13(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("CARDINAL_URL" to cardinalUrl(), "login" to login, "loginToken" to loginToken)

    private suspend fun preBlock14(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("patient" to patient)

    private suspend fun preBlock15(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("patientSdk" to patientSdk, "createdHealthElement" to createdHealthElement)

    private suspend fun preBlock16(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("patient" to patient, "createdHealthElement" to createdHealthElement)

    private suspend fun preBlock17(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("patientSdk" to patientSdk, "createdHealthElement" to createdHealthElement)

    private suspend fun preBlock18(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("patient" to patient)

    private suspend fun preBlock19(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> =
        mapOf("patientSdk" to patientSdk, "newCreatedHealthElement" to newCreatedHealthElement)

    // ---------- postTest ----------

    private suspend fun postBlock1(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk, extracted: Map<String, Any?>) {
        otherSdk = extracted["otherSdk"] as? CardinalSdk
        otherHcp = extracted["otherHcp"] as? HealthcareParty
    }

    private suspend fun postBlock2(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk, extracted: Map<String, Any?>) {
        oldDocument = extracted["oldDocument"] as? DecryptedDocument
    }

    private suspend fun postBlock6(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk, extracted: Map<String, Any?>) {
        createdNewDocument = extracted["createdNewDocument"] as? DecryptedDocument
    }

    private suspend fun postBlock8(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk, extracted: Map<String, Any?>) {
        createdPatient = extracted["createdPatient"] as? DecryptedPatient
    }

    private suspend fun postBlock9(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk, extracted: Map<String, Any?>) {
        login = extracted["login"] as? String
        createdUser = extracted["createdUser"] as? User
    }

    private suspend fun postBlock10(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk, extracted: Map<String, Any?>) {
        loginToken = extracted["loginToken"] as? String
    }

    private suspend fun postBlock12(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk, extracted: Map<String, Any?>) {
        patient = extracted["patient"] as? DecryptedPatient
    }

    private suspend fun postBlock13(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk, extracted: Map<String, Any?>) {
        patientSdk = extracted["patientSdk"] as? CardinalSdk
    }

    private suspend fun postBlock14(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk, extracted: Map<String, Any?>) {
        createdHealthElement = extracted["createdHealthElement"] as? DecryptedHealthElement
    }

    private suspend fun postBlock18(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk, extracted: Map<String, Any?>) {
        newCreatedHealthElement = extracted["newCreatedHealthElement"] as? DecryptedHealthElement
    }

    // ---------- Maps ----------

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "4_share_data block 1 (AAEF)" to ::preBlock1,
        "4_share_data block 3 (AAEH)" to ::preBlock3,
        "4_share_data block 4 (AAEI)" to ::preBlock4,
        "4_share_data block 5 (AAEJ)" to ::preBlock5,
        "4_share_data block 6 (AAEK)" to ::preBlock6,
        "4_share_data block 7 (AAEL)" to ::preBlock7,
        "4_share_data block 9 (AAEN)" to ::preBlock9,
        "4_share_data block 10 (AAEO)" to ::preBlock10,
        "4_share_data block 11 (AAEP)" to ::preBlock11,
        "4_share_data block 12 (AAEQ)" to ::preBlock12,
        "4_share_data block 13 (AAER)" to ::preBlock13,
        "4_share_data block 14 (AAES)" to ::preBlock14,
        "4_share_data block 15 (AAET)" to ::preBlock15,
        "4_share_data block 16 (AAEU)" to ::preBlock16,
        "4_share_data block 17 (AAEV)" to ::preBlock17,
        "4_share_data block 18 (AAEW)" to ::preBlock18,
        "4_share_data block 19 (AAEX)" to ::preBlock19,
    )

    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf(
        "4_share_data block 1 (AAEF)" to ::postBlock1,
        "4_share_data block 2 (AAEG)" to ::postBlock2,
        "4_share_data block 6 (AAEK)" to ::postBlock6,
        "4_share_data block 8 (AAEM)" to ::postBlock8,
        "4_share_data block 9 (AAEN)" to ::postBlock9,
        "4_share_data block 10 (AAEO)" to ::postBlock10,
        "4_share_data block 12 (AAEQ)" to ::postBlock12,
        "4_share_data block 13 (AAER)" to ::postBlock13,
        "4_share_data block 14 (AAES)" to ::postBlock14,
        "4_share_data block 18 (AAEW)" to ::postBlock18,
    )
}
