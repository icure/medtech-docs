package com.icure.docs.helpers.howto.initializethesdk

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.storage.StorageFacade

private suspend fun preBlockAACF(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val askValidationCode: suspend () -> String = { "123456" }
    return mapOf(
        "specId" to "test-spec-id",
        "processId" to "test-process-id",
        "askValidationCode" to askValidationCode,
    )
}

private suspend fun preBlockAACG(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    val getCachedToken: suspend () -> String? = { "test-cached-token" }
    val askUserPassword: suspend () -> String = { "test-password" }
    return mapOf(
        "username" to "test-username",
        "getCachedToken" to getCachedToken,
        "askUserPassword" to askUserPassword,
    )
}

private suspend fun preBlockAACH(@Suppress("UNUSED_PARAMETER") sdk: CardinalSdk): Map<String, Any?> {
    // Mock LocalStorageStorageFacade (browser-only) with an in-memory StorageFacade
    val mockLocalStorage: () -> StorageFacade = {
        object : StorageFacade {
            private val data = mutableMapOf<String, String>()
            override suspend fun getItem(key: String): String? = data[key]
            override suspend fun setItem(key: String, value: String) { data[key] = value }
            override suspend fun removeItem(key: String) { data.remove(key) }
        }
    }
    return mapOf("LocalStorageStorageFacade" to mockLocalStorage)
}

object IndexHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "index block 5 (AACF)" to ::preBlockAACF,
        "index block 6 (AACG)" to ::preBlockAACG,
        "index block 7 (AACH)" to ::preBlockAACH,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
