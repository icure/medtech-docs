import {
	CardinalSdk,
	ContactFilters,
	DecryptedContact,
	DecryptedContent,
	DecryptedPatient,
	DecryptedService,
	Identifier,
	Measure,
	PaginatedListIterator,
	Patient,
	PatientFilters,
	ServiceFilters,
} from '@icure/cardinal-sdk'
import { v4 as uuid } from 'uuid'

// ── additional imports ─────────────────────────────────────────────────

export const additionalImports: string[] = [
	'import { Identifier } from "@icure/cardinal-sdk"',
]

// ── cross-block state ──────────────────────────────────────────────────

let patientIterator: PaginatedListIterator<DecryptedPatient>
let patient: Patient | null

// ── helpers ────────────────────────────────────────────────────────────

const readLn = async (_prompt: string) => 'y'
const prettyPrintPatient = (p: any) => console.log(`Patient: ${p.firstName} ${p.lastName} (${p.id})`)
const prettyPrintContact = (c: any) => console.log(`Contact: ${c.descr} (${c.id})`)
const prettyPrintService = (s: any) => console.log(`Service: ${s.label} (${s.id})`)

// ── preTestProvides ────────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'3_searching_data block 1 (FENA)': ['readLn'],
	'3_searching_data block 2 (NOTO)': ['patientIterator', 'readLn', 'prettyPrintPatient'],
	'3_searching_data block 3 (SAGU)': ['patient', 'readLn', 'prettyPrintContact'],
	'3_searching_data block 4 (MOKA)': ['readLn', 'Identifier', 'prettyPrintService'],
}

// ── preTest ────────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'3_searching_data block 1 (FENA)': async () => ({
		readLn,
	}),
	'3_searching_data block 2 (NOTO)': async (sdk) => {
		if (!patientIterator && sdk) {
			patientIterator = await sdk.patient.filterPatientsBy(PatientFilters.byNameForSelf('mock-input'))
		}
		return { patientIterator, readLn, prettyPrintPatient }
	},
	'3_searching_data block 3 (SAGU)': async (sdk) => {
		if (patient === undefined && sdk) {
			// Create a patient so we have something to search for
			const p = await sdk.patient.createPatient(
				await sdk.patient.withEncryptionMetadata(
					new DecryptedPatient({ id: uuid(), firstName: 'Test', lastName: 'Patient' }),
				),
			)
			patient = p
		}
		return { patient: patient ?? new DecryptedPatient({ id: uuid(), firstName: 'Test', lastName: 'Patient' }), readLn, prettyPrintContact }
	},
	'3_searching_data block 4 (MOKA)': async () => ({
		readLn,
		Identifier,
		prettyPrintService,
	}),
}

// ── postTest ───────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'3_searching_data block 1 (FENA)': async (_sdk: CardinalSdk, _nameToSearch: any, iter: any) => {
		if (iter) patientIterator = iter
	},
	'3_searching_data block 2 (NOTO)': async (_sdk: CardinalSdk, p: any) => {
		if (p !== undefined) patient = p
	},
	'3_searching_data block 3 (SAGU)': async () => {},
	'3_searching_data block 4 (MOKA)': async () => {},
}