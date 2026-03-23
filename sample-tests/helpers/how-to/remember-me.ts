import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────
// Declarations that the code block references but doesn't define.

export const preTestProvides: Record<string, string[]> = {
	'remember-me block 1 (HOBU)': ['getDeviceId', 'saveCredentialsInPersistentStorage'],
	'remember-me block 2 (TILA)': ['getCredentialsFromPersistentStorage'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'remember-me block 1 (HOBU)': async () => ({
		getDeviceId: async () => 'test-device-id',
		saveCredentialsInPersistentStorage: async (username: string, token: string) => {},
	}),
	'remember-me block 2 (TILA)': async () => ({
		getCredentialsFromPersistentStorage: async () => ['testuser', 'testtoken'],
	}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: verify longToken is a string
	'remember-me block 1 (HOBU)': async (
		_sdk: CardinalSdk,
		deviceId: any,
		currentUser: any,
		longToken: any,
	) => {
		expect(typeof longToken).toBe('string')
	},

	// Block 2: destructuring + shadowed sdk — no extractable variables, no-op
	'remember-me block 2 (TILA)': async (_sdk: CardinalSdk) => {},
}
