import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'0_sdk_initialization block 1 (WAXO)': ['readLn'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'0_sdk_initialization block 1 (WAXO)': async () => ({
		readLn: async (_prompt: string) => 'mock-input',
	}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'0_sdk_initialization block 1 (WAXO)': async () => {},
}