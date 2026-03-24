import { CardinalSdk } from '@icure/cardinal-sdk'

// ── additionalImports ───────────────────────────────────────────────

export const additionalImports: string[] = [
	'import { RecoveryKeyOptions } from "@icure/cardinal-sdk"',
]

// ── preTestProvides ──────────────────────────────────────────────────
// All blocks are self-contained — no cross-block deps.

export const preTestProvides: Record<string, string[]> = {
	'key-management block 1 (KOGO)': ['window'],
	'key-management block 2 (ZUFE)': ['FileReader'],
	'key-management block 3 (SUTU)': ['window'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'key-management block 1 (KOGO)': async () => ({
		window: {
			URL: { createObjectURL: (_blob: Blob) => 'blob:mock-url' },
			open: (_url: string) => {},
		},
	}),
	'key-management block 2 (ZUFE)': async () => {
		const mockFileContent = JSON.stringify({
			'test-data-owner-id': {
				'test-key-fingerprint': 'dGVzdC1rZXktZGF0YQ==',
			},
		})
		return {
			FileReader: class MockFileReader {
				result: string | null = null
				onload: ((ev: any) => void) | null = null
				onerror: ((ev: any) => void) | null = null
				readAsText(_file: any) {
					this.result = mockFileContent
					setTimeout(() => this.onload?.({} as any), 0)
				}
			},
		}
	},
	'key-management block 3 (SUTU)': async () => ({
		window: {
			URL: { createObjectURL: (_blob: Blob) => 'blob:mock-url' },
			open: (_url: string) => {},
		},
	}),
	'key-management block 4 (XIKU)': async () => ({}),
	'key-management block 5 (HIRA)': async () => ({}),
	'key-management block 6 (ZUNO)': async () => ({}),
	'key-management block 7 (TELU)': async () => ({}),
	'key-management block 8 (WACE)': async () => ({}),
	'key-management block 9 (KUFO)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: exportAndDownloadKeysFile — browser-only, verify defined
	'key-management block 1 (KOGO)': async (
		_sdk: CardinalSdk,
		exportAndDownloadKeysFile: (...args: any[]) => any,
	) => {
		expect(typeof exportAndDownloadKeysFile).toBe('function')
	},

	// Block 2: MyCryptoStrategies class + initializeSdk function — browser-only, verify defined
	'key-management block 2 (ZUFE)': async (
		_sdk: CardinalSdk,
		MyCryptoStrategies: any,
		initializeSdk: (...args: any[]) => any,
	) => {
		expect(MyCryptoStrategies).toBeDefined()
		expect(typeof initializeSdk).toBe('function')
	},

	// Block 3: MyCryptoStrategies class — browser-only, verify defined
	'key-management block 3 (SUTU)': async (_sdk: CardinalSdk, MyCryptoStrategies: any) => {
		expect(MyCryptoStrategies).toBeDefined()
	},

	// Block 4: createRecoveryDataAndPrintKey(sdk) — needs real SDK with recovery setup, verify defined
	'key-management block 4 (XIKU)': async (
		_sdk: CardinalSdk,
		createRecoveryDataAndPrintKey: (...args: any[]) => any,
	) => {
		expect(typeof createRecoveryDataAndPrintKey).toBe('function')
	},

	// Block 5: MyCryptoStrategies class — verify defined
	'key-management block 5 (HIRA)': async (_sdk: CardinalSdk, MyCryptoStrategies: any) => {
		expect(MyCryptoStrategies).toBeDefined()
	},

	// Block 6: createShortRecoveryDataAndPrintKey(sdk) — verify defined
	'key-management block 6 (ZUNO)': async (
		_sdk: CardinalSdk,
		createShortRecoveryDataAndPrintKey: (...args: any[]) => any,
	) => {
		expect(typeof createShortRecoveryDataAndPrintKey).toBe('function')
	},

	// Block 7: MyCryptoStrategies class — verify defined
	'key-management block 7 (TELU)': async (_sdk: CardinalSdk, MyCryptoStrategies: any) => {
		expect(MyCryptoStrategies).toBeDefined()
	},

	// Block 8: createRecoveryDataForGiveAccessBackAndPrint + useRecoveryDataFromGiveAccessBack — verify defined
	'key-management block 8 (WACE)': async (
		_sdk: CardinalSdk,
		createRecoveryDataForGiveAccessBackAndPrint: (...args: any[]) => any,
		useRecoveryDataFromGiveAccessBack: (...args: any[]) => any,
	) => {
		expect(typeof createRecoveryDataForGiveAccessBackAndPrint).toBe('function')
		expect(typeof useRecoveryDataFromGiveAccessBack).toBe('function')
	},

	// Block 9: resolveGiveAccessBackRequests + promptGiveAccessBackConfirmation — verify defined
	'key-management block 9 (KUFO)': async (
		_sdk: CardinalSdk,
		resolveGiveAccessBackRequests: (...args: any[]) => any,
		promptGiveAccessBackConfirmation: (...args: any[]) => any,
	) => {
		expect(typeof resolveGiveAccessBackRequests).toBe('function')
		expect(typeof promptGiveAccessBackConfirmation).toBe('function')
	},
}
