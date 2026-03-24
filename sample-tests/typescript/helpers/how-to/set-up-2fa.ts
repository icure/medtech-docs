import {
	CardinalSdk,
	AuthSecretDetails,
	AuthenticationClass,
	AuthSecretProvider,
	AuthenticationProcessApi,
} from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'set-up-2fa block 1 (WUCU)': ['userId', 'otpSecret'],
	'set-up-2fa block 3 (GOSO)': ['authSecretProvider'],
	'set-up-2fa block 4 (RAWE)': ['userId'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'set-up-2fa block 1 (WUCU)': async () => ({
		userId: 'test-user-id',
		otpSecret: 'JBSWY3DPEHPK3PXP',
	}),
	'set-up-2fa block 2 (KOLI)': async () => ({}),
	'set-up-2fa block 3 (GOSO)': async () => ({
		authSecretProvider: {
			getSecret: async (_acceptedSecrets: AuthenticationClass[], _previousAttempts: AuthSecretDetails[]) => {
				return new AuthSecretDetails.TwoFactorAuthTokenDetails( '12345678')
			},
		} satisfies AuthSecretProvider,
	}),
	'set-up-2fa block 4 (RAWE)': async () => ({
		userId: 'test-user-id',
	}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: has syntax errors (incomplete assignments) — no-op
	'set-up-2fa block 1 (WUCU)': async () => {},

	// Block 2: defines askOneTimeCode and authSecretProvider — verify authSecretProvider is defined
	'set-up-2fa block 2 (KOLI)': async (
		_sdk: CardinalSdk,
		askOneTimeCode: (...args: any[]) => any,
		authSecretProvider: AuthSecretProvider,
	) => {
		expect(authSecretProvider).toBeDefined()
		expect(authSecretProvider.getSecret).toBeDefined()
		expect(typeof askOneTimeCode).toBe('function')
	},

	// Block 3: has syntax errors (placeholder comments) — no-op
	'set-up-2fa block 3 (GOSO)': async () => {},

	// Block 4: has syntax errors (incomplete assignment) — no-op
	'set-up-2fa block 4 (RAWE)': async () => {},
}
