import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'configure-what-to-encrypt block 1 (BUVA)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'configure-what-to-encrypt block 1 (BUVA)': async (
		_sdk: CardinalSdk,
		initializeMySdk: (...args: any[]) => any,
	) => {
		expect(typeof initializeMySdk).toBe('function')
	},
}
