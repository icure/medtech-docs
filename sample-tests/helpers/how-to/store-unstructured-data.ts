import { CardinalSdk, DecryptedDocument, randomUuid } from '@icure/cardinal-sdk'
import { v4 as uuid } from 'uuid'

// ── shared state across blocks ───────────────────────────────────────
// The MDX code blocks for this page form a sequential scenario.
// Variables declared in one block are referenced in later blocks.
// Pre-tests return the missing variables so the generated test can
// destructure them into the local scope.

let document: DecryptedDocument
let xmlData: any
let documentWithMainAttachment: DecryptedDocument
let retrievedDocument: DecryptedDocument
let attachmentId: string

// ── helpers ──────────────────────────────────────────────────────────

async function createTestDocument(sdk: CardinalSdk) {
	return sdk.document.createDocument(
		await sdk.document.withEncryptionMetadata(new DecryptedDocument({ id: uuid(), name: 'Test doc' }), null),
	)
}

// ── preTestProvides ──────────────────────────────────────────────────
// Declares which variables each pre-test returns, so the test generator
// can emit a destructuring assignment.

export const preTestProvides: Record<string, string[]> = {
	'store-unstructured-data block 2 (line 99)': ['document'],
	'store-unstructured-data block 3 (line 144)': ['document', 'xmlData'],
	'store-unstructured-data block 4 (line 182)': ['documentWithMainAttachment'],
	'store-unstructured-data block 5 (line 227)': ['document'],
	'store-unstructured-data block 6 (line 274)': ['document'],
	'store-unstructured-data block 7 (line 319)': ['retrievedDocument', 'attachmentId'],
	'store-unstructured-data block 8 (line 355)': ['retrievedDocument', 'attachmentId'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	// Block 1: self-contained — creates a document
	'store-unstructured-data block 1 (line 38)': async () => ({}),

	// Block 2: needs document from block 1
	'store-unstructured-data block 2 (line 99)': async (sdk) => {
		if (!document) document = await createTestDocument(sdk)
		return { document }
	},

	// Block 3: needs document and xmlData from prior blocks
	'store-unstructured-data block 3 (line 144)': async (sdk) => {
		if (!document) document = await createTestDocument(sdk)
		if (!xmlData) xmlData = '<xml>test</xml>'
		return { document, xmlData }
	},

	// Block 4: needs documentWithMainAttachment from block 2
	'store-unstructured-data block 4 (line 182)': async (sdk) => {
		if (!documentWithMainAttachment) {
			if (!document) document = await createTestDocument(sdk)
			documentWithMainAttachment = document
		}
		return { documentWithMainAttachment }
	},

	// Block 5: needs document from block 1
	'store-unstructured-data block 5 (line 227)': async (sdk) => {
		if (!document) document = await createTestDocument(sdk)
		return { document }
	},

	// Block 6: needs document from block 1
	'store-unstructured-data block 6 (line 274)': async (sdk) => {
		if (!document) document = await createTestDocument(sdk)
		return { document }
	},

	// Block 7: needs retrievedDocument and attachmentId from prior blocks
	'store-unstructured-data block 7 (line 319)': async (sdk) => {
		if (!retrievedDocument || !attachmentId) {
			if (!document) document = await createTestDocument(sdk)
			// Add an attachment so we can retrieve it
			const image = new ArrayBuffer(16)
			const attId = uuid()
			await sdk.document.encryptAndSetSecondaryAttachment(document.id, attId, ['public.tiff'], new Int8Array(new Uint8Array(image)))
			retrievedDocument = await sdk.document.getDocument(document.id)
			attachmentId = attId
		}
		return { retrievedDocument, attachmentId }
	},

	// Block 8: needs retrievedDocument and attachmentId from prior blocks
	'store-unstructured-data block 8 (line 355)': async (sdk) => {
		if (!retrievedDocument || !attachmentId) {
			if (!document) document = await createTestDocument(sdk)
			const image = new ArrayBuffer(16)
			const attId = uuid()
			await sdk.document.encryptAndSetSecondaryAttachment(document.id, attId, ['public.tiff'], new Int8Array(new Uint8Array(image)))
			retrievedDocument = await sdk.document.getDocument(document.id)
			attachmentId = attId
		}
		return { retrievedDocument, attachmentId }
	},
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: creates document
	'store-unstructured-data block 1 (line 38)': async (sdk: CardinalSdk, documentLocal: DecryptedDocument) => {
		expect(documentLocal).toBeDefined()
		expect(documentLocal.id).toBeTruthy()
		document = documentLocal
	},

	// Block 2: creates xmlData and documentWithMainAttachment
	'store-unstructured-data block 2 (line 99)': async (
		sdk: CardinalSdk,
		xmlDataLocal: any,
		documentWithMainAttachmentLocal: DecryptedDocument,
	) => {
		expect(documentWithMainAttachmentLocal).toBeDefined()
		xmlData = xmlDataLocal
		documentWithMainAttachment = documentWithMainAttachmentLocal
	},

	// Block 3: setRawMainAttachment returns void-ish — no-op
	'store-unstructured-data block 3 (line 144)': async () => {},

	// Block 4: creates image, attachmentId, decryptedAttachmentId, documentWithSecondaryAttachment, documentWithUnencryptedSecondaryAttachment
	'store-unstructured-data block 4 (line 182)': async (
		sdk: CardinalSdk,
		image: any,
		attachmentIdLocal: string,
		decryptedAttachmentIdLocal: string,
		documentWithSecondaryAttachment: DecryptedDocument,
		documentWithUnencryptedSecondaryAttachment: DecryptedDocument,
	) => {
		expect(typeof attachmentIdLocal).toBe('string')
		attachmentId = attachmentIdLocal
	},

	// Block 5: retrieves document and attachments
	'store-unstructured-data block 5 (line 227)': async (
		sdk: CardinalSdk,
		retrievedDocumentLocal: DecryptedDocument,
		retrievedMainAttachment: any,
		retrievedEncryptedMainAttachment: any,
	) => {
		expect(retrievedDocumentLocal).toBeDefined()
		expect(retrievedMainAttachment).toBeDefined()
		expect(retrievedEncryptedMainAttachment).toBeDefined()
		retrievedDocument = retrievedDocumentLocal
	},

	// Block 6: retrieves document and checks XML validity
	'store-unstructured-data block 6 (line 274)': async (
		sdk: CardinalSdk,
		retrievedDocumentLocal: DecryptedDocument,
		isValidXml: any,
	) => {
		expect(retrievedDocumentLocal).toBeDefined()
		expect(isValidXml).toBeDefined()
		retrievedDocument = retrievedDocumentLocal
	},

	// Block 7: retrieves secondary attachments
	'store-unstructured-data block 7 (line 319)': async (
		sdk: CardinalSdk,
		retrievedSecondaryAttachment: any,
		retrievedDecryptedSecondaryAttachment: any,
	) => {
		expect(retrievedSecondaryAttachment).toBeDefined()
		expect(retrievedDecryptedSecondaryAttachment).toBeDefined()
	},

	// Block 8: deletes attachments
	'store-unstructured-data block 8 (line 355)': async (
		sdk: CardinalSdk,
		documentWithoutMainAttachment: any,
		documentWithoutAttachments: any,
	) => {
		expect(documentWithoutMainAttachment).toBeDefined()
		expect(documentWithoutAttachments).toBeDefined()
	},
}
