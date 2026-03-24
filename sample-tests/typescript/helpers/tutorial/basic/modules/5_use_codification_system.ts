import {
	CardinalSdk,
	Code,
	CodeFilters,
	CodeStub,
	DecryptedContact,
	DecryptedContent,
	DecryptedPatient,
	DecryptedService,
	Measure,
	ServiceFilters,
} from '@icure/cardinal-sdk'
import { v4 as uuid } from 'uuid'

// ── additional imports ─────────────────────────────────────────────────

export const additionalImports: string[] = [
	'import { Code, CodeFilters, CodeStub } from "@icure/cardinal-sdk"',
]

// ── cross-block state ──────────────────────────────────────────────────

let internalCode: Code
let selectedCode: Code | null
let patient: DecryptedPatient
let createdContact: DecryptedContact

// ── helpers ────────────────────────────────────────────────────────────

const readLn = async (_prompt: string) => 'y'
const prettyPrintCode = (c: any) => console.log(`Code: ${c.type}|${c.code} — ${JSON.stringify(c.label)}`)
const prettyPrintService = (s: any) => console.log(`Service: ${s.label} (${s.id})`)
const currentFuzzyDate = () => parseInt(new Date().toISOString().replace(/[-T:\.Z]/g, '').substring(0, 14))
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min

// ── preTestProvides ────────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'5_use_codification_system block 1 (TIWU)': ['Code'],
	'5_use_codification_system block 2 (MEQI)': ['CodeFilters', 'readLn', 'prettyPrintCode', 'currentFuzzyDate', 'random', 'CodeStub'],
	'5_use_codification_system block 3 (FIKE)': ['selectedCode', 'prettyPrintService'],
}

// ── preTest ────────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'5_use_codification_system block 1 (TIWU)': async () => ({
		Code,
	}),
	'5_use_codification_system block 2 (MEQI)': async (sdk) => {
		return {
			CodeFilters,
			readLn,
			prettyPrintCode,
			currentFuzzyDate,
			random,
			CodeStub,
		}
	},
	'5_use_codification_system block 3 (FIKE)': async (sdk) => {
		if (!selectedCode && sdk) {
			// Try to find or create a code to use
			try {
				const codeIterator = await sdk.code.filterCodesBy(
					CodeFilters.byLanguageTypeLabelRegion('en', 'SNOMED', { label: 'blood' }),
				)
				if (await codeIterator.hasNext()) {
					selectedCode = (await codeIterator.next(1))[0]
				}
			} catch {
				// Fallback: create a code
			}
			if (!selectedCode) {
				selectedCode = new Code({
					id: 'SNOMED|38341003|1',
					type: 'SNOMED',
					code: '38341003',
					version: '1',
					label: { en: 'High blood pressure' },
				})
			}
		}
		return { selectedCode, prettyPrintService }
	},
}

// ── postTest ───────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'5_use_codification_system block 1 (TIWU)': async (_sdk: CardinalSdk, c: any) => {
		if (c) internalCode = c
	},
	'5_use_codification_system block 2 (MEQI)': async (_sdk: CardinalSdk, _codeIterator: any, s: any, _p: any, _contact: any, cc: any) => {
		if (s !== undefined) selectedCode = s
		if (cc) createdContact = cc
	},
	'5_use_codification_system block 3 (FIKE)': async () => {},
}