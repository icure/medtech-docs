package com.icure.docs.helpers.howto.initializethesdk

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.auth.AuthSecretDetails
import com.icure.cardinal.sdk.auth.AuthSecretProvider
import com.icure.cardinal.sdk.auth.AuthenticationProcessApi
import com.icure.cardinal.sdk.model.embed.AuthenticationClass

private var cachedSecretProvider: AuthSecretProvider? = null

private fun buildMockSecretProvider(): AuthSecretProvider = object : AuthSecretProvider {
    override suspend fun getSecret(
        acceptedSecrets: Set<AuthenticationClass>,
        previousAttempts: List<AuthSecretDetails>,
        authProcessApi: AuthenticationProcessApi
    ): AuthSecretDetails {
        if (AuthenticationClass.Password in acceptedSecrets) {
            return AuthSecretDetails.PasswordDetails("test-password")
        }
        if (AuthenticationClass.LongLivedToken in acceptedSecrets) {
            return AuthSecretDetails.LongLivedTokenDetails("test-token")
        }
        throw UnsupportedOperationException("Unsupported secrets: $acceptedSecrets")
    }
}

private suspend fun preBlockAABY(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val provider = cachedSecretProvider ?: buildMockSecretProvider()
    return mapOf("secretProvider" to provider)
}

private suspend fun preBlockAABZ(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val provider = cachedSecretProvider ?: buildMockSecretProvider()
    return mapOf("secretProvider" to provider)
}

object AuthenticationWithSecretProviderHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "authentication-with-secret-provider block 2 (AABY)" to ::preBlockAABY,
        "authentication-with-secret-provider block 3 (AABZ)" to ::preBlockAABZ,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf(
        "authentication-with-secret-provider block 1 (AABX)" to { _, extracted ->
            @Suppress("UNCHECKED_CAST")
            cachedSecretProvider = extracted["secretProvider"] as? AuthSecretProvider
        },
    )
}
