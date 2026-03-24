package com.icure.docs.helpers.howto

import com.icure.cardinal.sdk.CardinalSdk
import com.icure.cardinal.sdk.model.DecryptedDocument
import java.util.UUID

object StoreUnstructuredDataHelper {

    private suspend fun createDocument(sdk: CardinalSdk): DecryptedDocument {
        return sdk.document.createDocument(
            sdk.document.withEncryptionMetadataUnlinked(
                DecryptedDocument(
                    id = UUID.randomUUID().toString(),
                    name = "My medical document"
                ),
                null
            )
        )
    }

    private suspend fun createDocumentWithAttachment(sdk: CardinalSdk): Pair<DecryptedDocument, String> {
        val document = createDocument(sdk)
        val xmlData = """
            <root>
                <data>Very important data</data>
                <value>42</value>
            </root>
        """.trimIndent()
        val documentWithMainAttachment = sdk.document.encryptAndSetMainAttachment(
            document, listOf("public.xml"), xmlData.toByteArray(Charsets.UTF_8)
        ).let { sdk.document.decrypt(it) }
        return Pair(documentWithMainAttachment, xmlData)
    }

    private suspend fun createDocumentWithAllAttachments(sdk: CardinalSdk): Triple<DecryptedDocument, String, String> {
        val (documentWithMainAttachment, _) = createDocumentWithAttachment(sdk)
        val image = kotlin.random.Random.nextBytes(100)
        val attachmentId = "medical-image-${UUID.randomUUID()}"
        val decryptedAttachmentId = "decrypted-medical-image-${UUID.randomUUID()}"
        val documentWithSecondaryAttachment = sdk.document.encryptAndSetSecondaryAttachment(
            documentWithMainAttachment, attachmentId, listOf("public.tiff"), image
        ).let { sdk.document.decrypt(it) }
        sdk.document.setRawSecondaryAttachment(
            documentWithSecondaryAttachment.id, decryptedAttachmentId,
            checkNotNull(documentWithSecondaryAttachment.rev), listOf("public.tiff"), image, false
        )
        return Triple(documentWithSecondaryAttachment, attachmentId, decryptedAttachmentId)
    }

    private suspend fun preBlock2(sdk: CardinalSdk): Map<String, Any?> {
        val document = createDocument(sdk)
        return mapOf("document" to document)
    }

    private suspend fun preBlock3(sdk: CardinalSdk): Map<String, Any?> {
        val document = createDocument(sdk)
        val xmlData = """
            <root>
                <data>Very important data</data>
                <value>42</value>
            </root>
        """.trimIndent()
        return mapOf("document" to document, "xmlData" to xmlData)
    }

    private suspend fun preBlock4(sdk: CardinalSdk): Map<String, Any?> {
        val (documentWithMainAttachment, _) = createDocumentWithAttachment(sdk)
        return mapOf("documentWithMainAttachment" to documentWithMainAttachment)
    }

    private suspend fun preBlock5(sdk: CardinalSdk): Map<String, Any?> {
        val document = createDocument(sdk)
        // Create a document with main attachment so retrieval will work
        val xmlData = """
            <root>
                <data>Very important data</data>
                <value>42</value>
            </root>
        """.trimIndent()
        sdk.document.encryptAndSetMainAttachment(document, listOf("public.xml"), xmlData.toByteArray(Charsets.UTF_8))
        return mapOf("document" to document)
    }

    private suspend fun preBlock6(sdk: CardinalSdk): Map<String, Any?> {
        val document = createDocument(sdk)
        val xmlData = """
            <root>
                <data>Very important data</data>
                <value>42</value>
            </root>
        """.trimIndent()
        sdk.document.encryptAndSetMainAttachment(document, listOf("public.xml"), xmlData.toByteArray(Charsets.UTF_8))
        return mapOf("document" to document)
    }

    private suspend fun preBlock7(sdk: CardinalSdk): Map<String, Any?> {
        val (doc, attachmentId, _) = createDocumentWithAllAttachments(sdk)
        val retrievedDocument = sdk.document.getDocument(doc.id)
        return mapOf("retrievedDocument" to retrievedDocument, "attachmentId" to attachmentId)
    }

    private suspend fun preBlock8(sdk: CardinalSdk): Map<String, Any?> {
        val (doc, attachmentId, _) = createDocumentWithAllAttachments(sdk)
        val retrievedDocument = sdk.document.getDocument(doc.id)
        return mapOf("retrievedDocument" to retrievedDocument, "attachmentId" to attachmentId)
    }

    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "store-unstructured-data block 2 (AACV)" to ::preBlock2,
        "store-unstructured-data block 3 (AACW)" to ::preBlock3,
        "store-unstructured-data block 4 (AACX)" to ::preBlock4,
        "store-unstructured-data block 5 (AACY)" to ::preBlock5,
        "store-unstructured-data block 6 (AACZ)" to ::preBlock6,
        "store-unstructured-data block 7 (AADA)" to ::preBlock7,
        "store-unstructured-data block 8 (AADB)" to ::preBlock8,
    )
    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf()
}
