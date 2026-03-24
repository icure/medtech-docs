import { CardinalSdk, DecryptedPatient } from '@icure/cardinal-sdk'
import { v4 as uuid } from 'uuid'

// ── cross-block state ────────────────────────────────────────────────

let patient: DecryptedPatient
let patientWithMetadata: DecryptedPatient
let createdPatient: DecryptedPatient
let updatedPatient: DecryptedPatient

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'1_create_patient block 1 (SOGI)': ['readLn'],
	'1_create_patient block 2 (MOJO)': ['patient'],
	'1_create_patient block 3 (BOZE)': ['patientWithMetadata'],
	'1_create_patient block 4 (JIDO)': ['readLn', 'createdPatient'],
	'1_create_patient block 5 (QISU)': ['updatedPatient'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'1_create_patient block 1 (SOGI)': async () => ({
		readLn: async (_prompt: string) => 'Test',
	}),
	'1_create_patient block 2 (MOJO)': async (sdk) => {
		if (!patient) {
			patient = new DecryptedPatient({ id: uuid(), firstName: 'Test', lastName: 'Patient' })
		}
		return { patient }
	},
	'1_create_patient block 3 (BOZE)': async (sdk) => {
		if (!patientWithMetadata && sdk) {
			patient = patient ?? new DecryptedPatient({ id: uuid(), firstName: 'Test', lastName: 'Patient' })
			patientWithMetadata = await sdk.patient.withEncryptionMetadata(patient)
		}
		return { patientWithMetadata }
	},
	'1_create_patient block 4 (JIDO)': async (sdk) => {
		if (!createdPatient && sdk) {
			patient = patient ?? new DecryptedPatient({ id: uuid(), firstName: 'Test', lastName: 'Patient' })
			patientWithMetadata = patientWithMetadata ?? await sdk.patient.withEncryptionMetadata(patient)
			createdPatient = await sdk.patient.createPatient(patientWithMetadata)
		}
		return {
			readLn: async (_prompt: string) => '19900101',
			createdPatient,
		}
	},
	'1_create_patient block 5 (QISU)': async (sdk) => {
		if (!updatedPatient && sdk) {
			patient = patient ?? new DecryptedPatient({ id: uuid(), firstName: 'Test', lastName: 'Patient' })
			patientWithMetadata = patientWithMetadata ?? await sdk.patient.withEncryptionMetadata(patient)
			createdPatient = createdPatient ?? await sdk.patient.createPatient(patientWithMetadata)
			updatedPatient = await sdk.patient.modifyPatient(
				new DecryptedPatient({ ...createdPatient, dateOfBirth: 19900101 }),
			)
		}
		return { updatedPatient }
	},
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'1_create_patient block 1 (SOGI)': async (_sdk: CardinalSdk, _firstName: any, _lastName: any, p: any) => {
		if (p) patient = p
	},
	'1_create_patient block 2 (MOJO)': async (_sdk: CardinalSdk, p: any) => {
		if (p) patientWithMetadata = p
	},
	'1_create_patient block 3 (BOZE)': async (_sdk: CardinalSdk, p: any) => {
		if (p) createdPatient = p
	},
	'1_create_patient block 4 (JIDO)': async (_sdk: CardinalSdk, _dateOfBirth: any, _patientWithBirth: any, p: any) => {
		if (p) updatedPatient = p
	},
	'1_create_patient block 5 (QISU)': async () => {},
}
