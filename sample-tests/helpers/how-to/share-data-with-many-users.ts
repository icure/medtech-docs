import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────
// Declarations that the code block references but doesn't define.

export const preTestProvides: Record<string, string[]> = {
	'share-data-with-many-users block 1 (line 108)': [],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'share-data-with-many-users block 1 (line 108)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: defines initializeMySdk(username, password) — self-contained
	'share-data-with-many-users block 1 (line 108)': async (
		_sdk: CardinalSdk,
		initializeMySdk: any,
	) => {
		expect(typeof initializeMySdk).toBe('function')
	},
}
