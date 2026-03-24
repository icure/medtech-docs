package com.icure.docs.helpers

import com.icure.cardinal.sdk.CardinalSdk

object SdkFixture {
    private var cachedSdk: CardinalSdk? = null

    /**
     * Returns an initialized CardinalSdk instance, cached for reuse across tests.
     * Reads credentials from environment variables.
     *
     * Required env vars:
     *   CARDINAL_URL       - e.g. "https://api.icure.cloud"
     *   CARDINAL_USERNAME  - login username
     *   CARDINAL_PASSWORD  - login password
     */
    suspend fun getTestSdk(): CardinalSdk {
        cachedSdk?.let { return it }

        val url = System.getenv("CARDINAL_URL")
            ?: error("Missing required environment variable: CARDINAL_URL")
        val username = System.getenv("CARDINAL_USERNAME")
            ?: error("Missing required environment variable: CARDINAL_USERNAME")
        val password = System.getenv("CARDINAL_PASSWORD")
            ?: error("Missing required environment variable: CARDINAL_PASSWORD")

        // TODO: Replace with actual CardinalSdk initialization.
        // Example:
        //   cachedSdk = CardinalSdk.initialize(url, AuthenticationMethod.UsingCredentials(UsernamePassword(username, password)))
        //   return cachedSdk!!
        error("SDK initialization not yet implemented -- update SdkFixture.kt")
    }
}
