import {
	CardinalSdk,
	DecryptedContact,
	DecryptedContent,
	DecryptedDocument,
	EncryptedDocument,
	DecryptedHealthElement,
	DecryptedPatient,
	DecryptedService,
	DecryptedSubContact,
	DocumentType,
	Identifier,
	Measure,
	TimeSeries,
} from '@icure/cardinal-sdk'
import { v4 as uuid } from 'uuid'

// ── additional imports ─────────────────────────────────────────────────

export const additionalImports: string[] = [
	'import { Identifier, DocumentType, DecryptedSubContact } from "@icure/cardinal-sdk"',
]

// ── cross-block state ──────────────────────────────────────────────────

let patient: DecryptedPatient
let contact: DecryptedContact
let contactWithMetadata: DecryptedContact
let createdContact: DecryptedContact
let bloodPressureService: DecryptedService
let contactWithBloodPressure: DecryptedContact
let contactWithECG: DecryptedContact
let document: DecryptedDocument
let createdDocument: DecryptedDocument
let documentWithAttachment: EncryptedDocument
let contactWithImage: DecryptedContact
let createdDiagnosis: DecryptedHealthElement
let contactWithDiagnosis: DecryptedContact
let finalContact: DecryptedContact

// ── helpers ────────────────────────────────────────────────────────────

const readLn = async (_prompt: string) => 'mock-input'
const currentFuzzyDate = () => parseInt(new Date().toISOString().replace(/[-T:\.Z]/g, '').substring(0, 14))
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min

// ── preTestProvides ────────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'2_create_medical_data block 1 (TAKI)': ['readLn', 'currentFuzzyDate'],
	'2_create_medical_data block 2 (GOGU)': ['readLn', 'currentFuzzyDate'],
	'2_create_medical_data block 3 (POBI)': ['contact', 'patient'],
	'2_create_medical_data block 4 (TUCU)': ['contactWithMetadata'],
	'2_create_medical_data block 5 (FUVE)': ['random', 'Identifier'],
	'2_create_medical_data block 6 (FELI)': ['createdContact', 'bloodPressureService'],
	'2_create_medical_data block 7 (COLU)': ['random', 'Identifier', 'contactWithBloodPressure'],
	'2_create_medical_data block 8 (SEGA)': ['DocumentType'],
	'2_create_medical_data block 9 (LOWU)': ['document'],
	'2_create_medical_data block 10 (NIDA)': ['random', 'createdDocument'],
	'2_create_medical_data block 11 (XEQU)': ['Identifier', 'documentWithAttachment', 'contactWithECG'],
	'2_create_medical_data block 12 (LUKO)': ['readLn', 'patient'],
	'2_create_medical_data block 13 (REHE)': ['DecryptedSubContact', 'contactWithImage', 'createdDiagnosis'],
	'2_create_medical_data block 14 (MIZA)': ['currentFuzzyDate', 'contactWithDiagnosis'],
}

// ── preTest ────────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'2_create_medical_data block 1 (TAKI)': async () => ({
		readLn,
		currentFuzzyDate,
	}),
	'2_create_medical_data block 2 (GOGU)': async () => ({
		readLn,
		currentFuzzyDate,
	}),
	'2_create_medical_data block 3 (POBI)': async (sdk) => {
		if (!patient && sdk) {
			patient = await sdk.patient.createPatient(
				await sdk.patient.withEncryptionMetadata(
					new DecryptedPatient({ id: uuid(), firstName: 'Annabelle', lastName: 'Hall' }),
				),
			)
		}
		if (!contact) {
			contact = new DecryptedContact({
				id: uuid(),
				descr: 'mock-input',
				openingDate: currentFuzzyDate(),
			})
		}
		return { contact, patient }
	},
	'2_create_medical_data block 4 (TUCU)': async (sdk) => {
		if (!contactWithMetadata && sdk) {
			if (!patient) {
				patient = await sdk.patient.createPatient(
					await sdk.patient.withEncryptionMetadata(
						new DecryptedPatient({ id: uuid(), firstName: 'Annabelle', lastName: 'Hall' }),
					),
				)
			}
			if (!contact) {
				contact = new DecryptedContact({
					id: uuid(),
					descr: 'mock-input',
					openingDate: currentFuzzyDate(),
				})
			}
			contactWithMetadata = await sdk.contact.withEncryptionMetadata(contact, patient)
		}
		return { contactWithMetadata }
	},
	'2_create_medical_data block 5 (FUVE)': async () => ({
		random,
		Identifier,
	}),
	'2_create_medical_data block 6 (FELI)': async (sdk) => {
		if (!createdContact && sdk) {
			if (!patient) {
				patient = await sdk.patient.createPatient(
					await sdk.patient.withEncryptionMetadata(
						new DecryptedPatient({ id: uuid(), firstName: 'Annabelle', lastName: 'Hall' }),
					),
				)
			}
			if (!contact) {
				contact = new DecryptedContact({ id: uuid(), descr: 'mock-input', openingDate: currentFuzzyDate() })
			}
			if (!contactWithMetadata) {
				contactWithMetadata = await sdk.contact.withEncryptionMetadata(contact, patient)
			}
			createdContact = await sdk.contact.createContact(contactWithMetadata)
		}
		if (!bloodPressureService) {
			bloodPressureService = new DecryptedService({
				id: uuid(),
				label: 'Blood pressure',
				identifier: [new Identifier({ system: 'cardinal', value: 'bloodPressure' })],
				content: {
					en: new DecryptedContent({
						measureValue: new Measure({ value: random(80, 120), unit: 'mmHg' }),
					}),
				},
			})
		}
		return { createdContact, bloodPressureService }
	},
	'2_create_medical_data block 7 (COLU)': async (sdk) => {
		if (!contactWithBloodPressure && sdk) {
			// Ensure createdContact exists
			if (!createdContact) {
				const provides = await preTest['2_create_medical_data block 6 (FELI)'](sdk)
				createdContact = provides.createdContact
				bloodPressureService = provides.bloodPressureService
			}
			contactWithBloodPressure = await sdk.contact.modifyContact(
				new DecryptedContact({
					...createdContact,
					services: [...createdContact.services, bloodPressureService],
				}),
			)
		}
		return { random, Identifier, contactWithBloodPressure }
	},
	'2_create_medical_data block 8 (SEGA)': async () => ({
		DocumentType,
	}),
	'2_create_medical_data block 9 (LOWU)': async (sdk) => {
		if (!document) {
			document = new DecryptedDocument({
				id: uuid(),
				documentType: DocumentType.Labresult,
			})
		}
		return { document }
	},
	'2_create_medical_data block 10 (NIDA)': async (sdk) => {
		if (!createdDocument && sdk) {
			if (!document) {
				document = new DecryptedDocument({ id: uuid(), documentType: DocumentType.Labresult })
			}
			createdDocument = await sdk.document.createDocument(await sdk.document.withEncryptionMetadataUnlinked(document))
		}
		return { random, createdDocument }
	},
	'2_create_medical_data block 11 (XEQU)': async (sdk) => {
		if (!contactWithECG && sdk) {
			await preTest['2_create_medical_data block 7 (COLU)'](sdk)
			const ecgSignal = Array.from({ length: 10 }, () => random(0, 100) / 100.0)
			const heartRateService = new DecryptedService({
				id: uuid(),
				identifier: [new Identifier({ system: 'cardinal', value: 'ecg' })],
				label: 'Heart rate',
				content: {
					en: new DecryptedContent({
						timeSeries: new TimeSeries({ samples: [ecgSignal] }),
					}),
				},
			})
			contactWithECG = await sdk.contact.modifyContact(
				new DecryptedContact({
					...contactWithBloodPressure,
					services: [...contactWithBloodPressure.services, heartRateService],
				}),
			)
		}
		if (!documentWithAttachment && sdk) {
			await preTest['2_create_medical_data block 10 (NIDA)'](sdk)
			const xRayImage = new Int8Array(100)
			for (let i = 0; i < 100; i++) {
				xRayImage[i] = random(-127, 128)
			}
			documentWithAttachment = await sdk.document.encryptAndSetMainAttachment(createdDocument, ['public.tiff'], xRayImage)
		}
		return { Identifier, documentWithAttachment, contactWithECG }
	},
	'2_create_medical_data block 12 (LUKO)': async (sdk) => {
		if (!patient && sdk) {
			patient = await sdk.patient.createPatient(
				await sdk.patient.withEncryptionMetadata(
					new DecryptedPatient({ id: uuid(), firstName: 'Annabelle', lastName: 'Hall' }),
				),
			)
		}
		return { readLn, patient }
	},
	'2_create_medical_data block 13 (REHE)': async (sdk) => {
		if (!contactWithImage && sdk) {
			await preTest['2_create_medical_data block 11 (XEQU)'](sdk)
			const xRayService = new DecryptedService({
				id: uuid(),
				label: 'X-Ray image',
				identifier: [new Identifier({ system: 'cardinal', value: 'xRay' })],
				content: {
					en: new DecryptedContent({ documentId: documentWithAttachment.id }),
				},
			})
			contactWithImage = await sdk.contact.modifyContact(
				new DecryptedContact({
					...contactWithECG,
					services: [...contactWithECG.services, xRayService],
				}),
			)
		}
		if (!createdDiagnosis && sdk) {
			if (!patient) {
				patient = await sdk.patient.createPatient(
					await sdk.patient.withEncryptionMetadata(
						new DecryptedPatient({ id: uuid(), firstName: 'Annabelle', lastName: 'Hall' }),
					),
				)
			}
			const healthElement = new DecryptedHealthElement({ id: uuid(), descr: 'mock-diagnosis' })
			createdDiagnosis = await sdk.healthElement.createHealthElement(
				await sdk.healthElement.withEncryptionMetadata(healthElement, patient),
			)
		}
		return { DecryptedSubContact, contactWithImage, createdDiagnosis }
	},
	'2_create_medical_data block 14 (MIZA)': async (sdk) => {
		if (!contactWithDiagnosis && sdk) {
			await preTest['2_create_medical_data block 13 (REHE)'](sdk)
			contactWithDiagnosis = await sdk.contact.modifyContact(
				new DecryptedContact({
					...contactWithImage,
					subContacts: [
						new DecryptedSubContact({
							descr: 'Diagnosis',
							healthElementId: createdDiagnosis.id,
						}),
					],
				}),
			)
		}
		return { currentFuzzyDate, contactWithDiagnosis }
	},
}

// ── postTest ───────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'2_create_medical_data block 1 (TAKI)': async (_sdk: CardinalSdk, _patientId: any, p: any) => {
		if (p) patient = p
	},
	'2_create_medical_data block 2 (GOGU)': async (_sdk: CardinalSdk, _description: any, c: any) => {
		if (c) contact = c
	},
	'2_create_medical_data block 3 (POBI)': async (_sdk: CardinalSdk, c: any) => {
		if (c) contactWithMetadata = c
	},
	'2_create_medical_data block 4 (TUCU)': async (_sdk: CardinalSdk, c: any) => {
		if (c) createdContact = c
	},
	'2_create_medical_data block 5 (FUVE)': async (_sdk: CardinalSdk, s: any) => {
		if (s) bloodPressureService = s
	},
	'2_create_medical_data block 6 (FELI)': async (_sdk: CardinalSdk, c: any) => {
		if (c) contactWithBloodPressure = c
	},
	'2_create_medical_data block 7 (COLU)': async (_sdk: CardinalSdk, _ecgSignal: any, _heartRateService: any, c: any) => {
		if (c) contactWithECG = c
	},
	'2_create_medical_data block 8 (SEGA)': async (_sdk: CardinalSdk, d: any) => {
		if (d) document = d
	},
	'2_create_medical_data block 9 (LOWU)': async (_sdk: CardinalSdk, d: any) => {
		if (d) createdDocument = d
	},
	'2_create_medical_data block 10 (NIDA)': async (_sdk: CardinalSdk, _xRayImage: any, d: any) => {
		if (d) documentWithAttachment = d
	},
	'2_create_medical_data block 11 (XEQU)': async (_sdk: CardinalSdk, _xRayService: any, c: any) => {
		if (c) contactWithImage = c
	},
	'2_create_medical_data block 12 (LUKO)': async (_sdk: CardinalSdk, _diagnosis: any, _healthElement: any, d: any) => {
		if (d) createdDiagnosis = d
	},
	'2_create_medical_data block 13 (REHE)': async (_sdk: CardinalSdk, c: any) => {
		if (c) contactWithDiagnosis = c
	},
	'2_create_medical_data block 14 (MIZA)': async (_sdk: CardinalSdk, c: any) => {
		if (c) finalContact = c
	},
}