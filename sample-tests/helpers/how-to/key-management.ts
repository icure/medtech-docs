import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────
// All blocks are self-contained — no cross-block deps.

export const preTestProvides: Record<string, string[]> = {}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'key-management block 1 (line 88)': async () => ({}),
	'key-management block 2 (line 206)': async () => ({}),
	'key-management block 3 (line 373)': async () => ({}),
	'key-management block 4 (line 453)': async () => ({}),
	'key-management block 5 (line 528)': async () => ({}),
	'key-management block 6 (line 624)': async () => ({}),
	'key-management block 7 (line 696)': async () => ({}),
	'key-management block 8 (line 784)': async () => ({}),
	'key-management block 9 (line 867)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: exportAndDownloadKeysFile — browser-only, verify defined
	'key-management block 1 (line 88)': async (
		_sdk: CardinalSdk,
		exportAndDownloadKeysFile: (...args: any[]) => any,
	) => {
		expect(typeof exportAndDownloadKeysFile).toBe('function')
	},

	// Block 2: MyCryptoStrategies class + initializeSdk function — browser-only, verify defined
	'key-management block 2 (line 206)': async (
		_sdk: CardinalSdk,
		MyCryptoStrategies: any,
		initializeSdk: (...args: any[]) => any,
	) => {
		expect(MyCryptoStrategies).toBeDefined()
		expect(typeof initializeSdk).toBe('function')
	},

	// Block 3: MyCryptoStrategies class — browser-only, verify defined
	'key-management block 3 (line 373)': async (_sdk: CardinalSdk, MyCryptoStrategies: any) => {
		expect(MyCryptoStrategies).toBeDefined()
	},

	// Block 4: createRecoveryDataAndPrintKey(sdk) — needs real SDK with recovery setup, verify defined
	'key-management block 4 (line 453)': async (
		_sdk: CardinalSdk,
		createRecoveryDataAndPrintKey: (...args: any[]) => any,
	) => {
		expect(typeof createRecoveryDataAndPrintKey).toBe('function')
	},

	// Block 5: MyCryptoStrategies class — verify defined
	'key-management block 5 (line 528)': async (_sdk: CardinalSdk, MyCryptoStrategies: any) => {
		expect(MyCryptoStrategies).toBeDefined()
	},

	// Block 6: createShortRecoveryDataAndPrintKey(sdk) — verify defined
	'key-management block 6 (line 624)': async (
		_sdk: CardinalSdk,
		createShortRecoveryDataAndPrintKey: (...args: any[]) => any,
	) => {
		expect(typeof createShortRecoveryDataAndPrintKey).toBe('function')
	},

	// Block 7: MyCryptoStrategies class — verify defined
	'key-management block 7 (line 696)': async (_sdk: CardinalSdk, MyCryptoStrategies: any) => {
		expect(MyCryptoStrategies).toBeDefined()
	},

	// Block 8: createRecoveryDataForGiveAccessBackAndPrint + useRecoveryDataFromGiveAccessBack — verify defined
	'key-management block 8 (line 784)': async (
		_sdk: CardinalSdk,
		createRecoveryDataForGiveAccessBackAndPrint: (...args: any[]) => any,
		useRecoveryDataFromGiveAccessBack: (...args: any[]) => any,
	) => {
		expect(typeof createRecoveryDataForGiveAccessBackAndPrint).toBe('function')
		expect(typeof useRecoveryDataFromGiveAccessBack).toBe('function')
	},

	// Block 9: resolveGiveAccessBackRequests + promptGiveAccessBackConfirmation — verify defined
	'key-management block 9 (line 867)': async (
		_sdk: CardinalSdk,
		resolveGiveAccessBackRequests: (...args: any[]) => any,
		promptGiveAccessBackConfirmation: (...args: any[]) => any,
	) => {
		expect(typeof resolveGiveAccessBackRequests).toBe('function')
		expect(typeof promptGiveAccessBackConfirmation).toBe('function')
	},
}
