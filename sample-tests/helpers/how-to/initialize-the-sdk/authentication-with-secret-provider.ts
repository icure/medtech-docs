import { CardinalSdk, AuthSecretDetails } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────
// Declarations that the code block references but doesn't define.

export const preTestProvides: Record<string, string[]> = {
	'authentication-with-secret-provider block 2 (FUPI)': ['secretProvider'],
	'authentication-with-secret-provider block 3 (FOSE)': ['secretProvider', 'username', 'longToken'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'authentication-with-secret-provider block 1 (ZATE)': async () => ({}),
	'authentication-with-secret-provider block 2 (FUPI)': async () => ({
		secretProvider: { getSecret: async () => new AuthSecretDetails.PasswordDetails('test') },
	}),
	'authentication-with-secret-provider block 3 (FOSE)': async () => ({
		secretProvider: { getSecret: async () => new AuthSecretDetails.PasswordDetails('test') },
		username: 'test-user@example.com',
		longToken: 'mock-long-token',
	}),
	'authentication-with-secret-provider block 4 (BARU)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: defines mock functions and secretProvider object
	'authentication-with-secret-provider block 1 (ZATE)': async (
		_sdk: CardinalSdk,
		_promptInvalidPasswordMessage: any,
		_loadRememberMe: any,
		_askPreferredMethodToUser: any,
		_authenticateUsingThirdParty: any,
		_askForUserPassword: any,
		_askForTotp: any,
		_askForShortTokenReceivedByMail: any,
		secretProvider: any,
	) => {
		expect(secretProvider).toBeDefined()
		expect(typeof secretProvider.getSecret).toBe('function')
	},

	// Block 2: references secretProvider from block 1, SDK init would need real credentials
	'authentication-with-secret-provider block 2 (FUPI)': async (_sdk: CardinalSdk) => {},

	// Block 3: references secretProvider from block 1, has syntax errors with placeholder values
	'authentication-with-secret-provider block 3 (FOSE)': async (_sdk: CardinalSdk) => {},

	// Block 4: uses sdk.user.getCurrentUser() and sdk.user.getToken()
	'authentication-with-secret-provider block 4 (BARU)': async (
		_sdk: CardinalSdk,
		user: any,
		token: any,
	) => {
		expect(user).toBeDefined()
		expect(token).toBeDefined()
	},
}
