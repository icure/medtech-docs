import {
	CardinalSdk,
	CodeStub,
	DecryptedContact,
	DecryptedService,
	EntitySubscriptionEvent,
	FilterOptions,
	ServiceFilters,
	intersection,
} from '@icure/cardinal-sdk'

// ── additional imports ─────────────────────────────────────────────────

export const additionalImports: string[] = [
	'import { CodeStub } from "@icure/cardinal-sdk"',
]

// ── cross-block state ──────────────────────────────────────────────────

let filter: FilterOptions<DecryptedService>
let subscription: any

// ── helpers ────────────────────────────────────────────────────────────

const readLn = async (_prompt: string) => 'mock-input'
const CARDINAL_URL = process.env.CARDINAL_URL ?? 'https://api.icure.cloud'

// Mock event for blocks that reference it
const mockEvent: any = null

// ── preTestProvides ────────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'1_subscriber block 1 (MIXI)': ['readLn'],
	'1_subscriber block 2 (JOGA)': [],
	'1_subscriber block 3 (GOQU)': ['filter'],
	'1_subscriber block 4 (CEGU)': ['subscription'],
	'1_subscriber block 5 (WIPO)': ['subscription'],
	'1_subscriber block 6 (LUXI)': ['event', 'CodeStub'],
	'1_subscriber block 7 (WUNI)': ['event', 'CodeStub'],
	'1_subscriber block 8 (DUPI)': ['event', 'CodeStub'],
	'1_subscriber block 9 (JEXO)': ['subscription', 'CodeStub'],
}

// ── preTest ────────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'1_subscriber block 1 (MIXI)': async () => ({
		readLn,
		CARDINAL_URL,
	}),
	'1_subscriber block 2 (JOGA)': async () => ({}),
	'1_subscriber block 3 (GOQU)': async (sdk) => {
		if (!filter) {
			filter = intersection(
				ServiceFilters.byTagAndValueDateForSelf('LOINC', { tagCode: '2339-0' }),
				ServiceFilters.byTagAndValueDateForSelf('CARDINAL', { tagCode: 'TO_BE_ANALYZED' }),
			)
		}
		return { filter }
	},
	'1_subscriber block 4 (CEGU)': async (sdk) => {
		if (!subscription && sdk) {
			if (!filter) {
				filter = intersection(
					ServiceFilters.byTagAndValueDateForSelf('LOINC', { tagCode: '2339-0' }),
					ServiceFilters.byTagAndValueDateForSelf('CARDINAL', { tagCode: 'TO_BE_ANALYZED' }),
				)
			}
			subscription = await sdk.contact.subscribeToServiceCreateOrUpdateEvents(filter)
		}
		return { subscription }
	},
	'1_subscriber block 5 (WIPO)': async (sdk) => {
		await preTest['1_subscriber block 4 (CEGU)'](sdk)
		return { subscription }
	},
	'1_subscriber block 6 (LUXI)': async () => ({
		event: mockEvent,
		CodeStub,
	}),
	'1_subscriber block 7 (WUNI)': async () => ({
		event: mockEvent,
		CodeStub,
	}),
	'1_subscriber block 8 (DUPI)': async () => ({
		event: mockEvent,
		CodeStub,
	}),
	'1_subscriber block 9 (JEXO)': async (sdk) => {
		await preTest['1_subscriber block 4 (CEGU)'](sdk)
		return { subscription, CodeStub }
	},
}

// ── postTest ───────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'1_subscriber block 1 (MIXI)': async () => {},
	'1_subscriber block 2 (JOGA)': async (_sdk: CardinalSdk, f: any) => {
		if (f) filter = f
	},
	'1_subscriber block 3 (GOQU)': async (_sdk: CardinalSdk, s: any) => {
		if (s) subscription = s
	},
	'1_subscriber block 4 (CEGU)': async () => {},
	'1_subscriber block 5 (WIPO)': async () => {},
	'1_subscriber block 6 (LUXI)': async () => {},
	'1_subscriber block 7 (WUNI)': async () => {},
	'1_subscriber block 8 (DUPI)': async () => {},
	'1_subscriber block 9 (JEXO)': async () => {},
}