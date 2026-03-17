import {
	CardinalSdk,
	AuthSecretDetails,
	AuthenticationClass,
	AuthSecretProvider,
	AuthenticationProcessApi,
} from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'set-up-2fa block 1 (line 39)': ['userId', 'otpSecret'],
	'set-up-2fa block 3 (line 170)': ['authSecretProvider'],
	'set-up-2fa block 4 (line 205)': ['userId'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'set-up-2fa block 1 (line 39)': async () => ({
		userId: 'test-user-id',
		otpSecret: 'JBSWY3DPEHPK3PXP',
	}),
	'set-up-2fa block 2 (line 112)': async () => ({}),
	'set-up-2fa block 3 (line 170)': async () => ({
		authSecretProvider: {
			getSecret: async (_acceptedSecrets: AuthenticationClass[], _previousAttempts: AuthSecretDetails[]) => {
				return new AuthSecretDetails(AuthenticationClass.TwoFactorAuthentication, '12345678')
			},
		} satisfies AuthSecretProvider,
	}),
	'set-up-2fa block 4 (line 205)': async () => ({
		userId: 'test-user-id',
	}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: has syntax errors (incomplete assignments) — no-op
	'set-up-2fa block 1 (line 39)': async () => {},

	// Block 2: defines askOneTimeCode and authSecretProvider — verify authSecretProvider is defined
	'set-up-2fa block 2 (line 112)': async (
		_sdk: CardinalSdk,
		askOneTimeCode: (...args: any[]) => any,
		authSecretProvider: AuthSecretProvider,
	) => {
		expect(authSecretProvider).toBeDefined()
		expect(authSecretProvider.getSecret).toBeDefined()
		expect(typeof askOneTimeCode).toBe('function')
	},

	// Block 3: has syntax errors (placeholder comments) — no-op
	'set-up-2fa block 3 (line 170)': async () => {},

	// Block 4: has syntax errors (incomplete assignment) — no-op
	'set-up-2fa block 4 (line 205)': async () => {},
}
