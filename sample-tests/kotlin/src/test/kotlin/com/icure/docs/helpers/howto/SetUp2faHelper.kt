package com.icure.docs.helpers.howto

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.auth.AuthSecretDetails
import com.icure.cardinal.sdk.auth.AuthSecretProvider
import com.icure.cardinal.sdk.auth.AuthenticationProcessApi
import com.icure.cardinal.sdk.model.embed.AuthenticationClass
import com.icure.cardinal.sdk.model.security.Enable2faRequest

object SetUp2faHelper {

    // A valid Base32-encoded secret for TOTP (160 bits = 20 bytes)
    private const val TEST_OTP_SECRET = "JBSWY3DPEHPK3PXP4GG2WBRHCUSO6MLK"

    private suspend fun preBlock1(sdk: CardinalSdk): Map<String, Any?> {
        val user = sdk.user.getCurrentUser()
        return mapOf(
            "userId" to user.id,
            "otpSecret" to TEST_OTP_SECRET,
        )
    }

    private suspend fun preBlock3(sdk: CardinalSdk): Map<String, Any?> {
        val authSecretProvider = object : AuthSecretProvider {
            override suspend fun getSecret(
                acceptedSecrets: Set<AuthenticationClass>,
                previousAttempts: List<AuthSecretDetails>,
                authProcessApi: AuthenticationProcessApi
            ): AuthSecretDetails {
                if (acceptedSecrets.contains(AuthenticationClass.TwoFactorAuthentication)) {
                    val otp = "00000000"
                    return AuthSecretDetails.TwoFactorAuthTokenDetails(otp)
                } else {
                    throw IllegalStateException("2FA cannot be used for this operation")
                }
            }
        }
        return mapOf(
            "authSecretProvider" to authSecretProvider,
            "applicationId" to null,
            "cardinalUrl" to (System.getenv("CARDINAL_URL") ?: "https://api.icure.cloud"),
            "loginUsername" to (System.getenv("CARDINAL_USERNAME") ?: ""),
            "loginPassword" to (System.getenv("CARDINAL_PASSWORD") ?: ""),
        )
    }

    private suspend fun preBlock4(sdk: CardinalSdk): Map<String, Any?> {
        val user = sdk.user.getCurrentUser()
        val userId = user.id
        try {
            sdk.user.enable2faForUser(userId, Enable2faRequest(TEST_OTP_SECRET, 8))
        } catch (_: Exception) {
            // 2FA may already be enabled from block 1
        }
        return mapOf("userId" to userId)
    }

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "set-up-2fa block 1 (AABO)" to ::preBlock1,
        "set-up-2fa block 3 (AABQ)" to ::preBlock3,
        "set-up-2fa block 4 (AABR)" to ::preBlock4,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
