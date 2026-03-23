import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'registering-users block 1 (XIMO)': ['askUserValidationCode'],
	'registering-users block 3 (BEQO)': ['askUserValidationCode'],
	'registering-users block 5 (GIZU)': ['showRecoveryKey'],
	'registering-users block 6 (GANO)': ['askValidationCode', 'askRecoveryKey'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'registering-users block 1 (XIMO)': async () => ({
		askUserValidationCode: async () => '123456',
	}),
	'registering-users block 2 (QOJA)': async () => ({}),
	'registering-users block 3 (BEQO)': async () => ({
		askUserValidationCode: async () => '123456',
	}),
	'registering-users block 4 (VOMA)': async () => ({}),
	'registering-users block 5 (GIZU)': async () => ({
		showRecoveryKey: () => {},
	}),
	'registering-users block 6 (GANO)': async () => ({
		askValidationCode: async () => '123456',
		askRecoveryKey: async () => 'mock-recovery-key',
	}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'registering-users block 1 (XIMO)': async (
		_sdk: CardinalSdk,
		REGISTRATION_PROCESS_ID: any,
		SPEC_ID: any,
		registerAndLogin: (...args: any[]) => any,
	) => {
		expect(typeof registerAndLogin).toBe('function')
	},

	'registering-users block 2 (QOJA)': async (
		_sdk: CardinalSdk,
		inviteExistingPatientAsUser: (...args: any[]) => any,
	) => {
		expect(typeof inviteExistingPatientAsUser).toBe('function')
	},

	'registering-users block 3 (BEQO)': async (
		_sdk: CardinalSdk,
		LOGIN_PROCESS_ID: any,
		SPEC_ID: any,
		login: (...args: any[]) => any,
	) => {
		expect(typeof login).toBe('function')
	},

	'registering-users block 4 (VOMA)': async (
		_sdk: CardinalSdk,
		initializePatientSdk: (...args: any[]) => any,
	) => {
		expect(typeof initializePatientSdk).toBe('function')
	},

	'registering-users block 5 (GIZU)': async (
		_sdk: CardinalSdk,
		invitePatientAndPreShare: (...args: any[]) => any,
	) => {
		expect(typeof invitePatientAndPreShare).toBe('function')
	},

	'registering-users block 6 (GANO)': async (
		_sdk: CardinalSdk,
		SPEC_ID: any,
		PROCESS_ID: any,
		initializePatientSdkAfterInvite: (...args: any[]) => any,
	) => {
		expect(typeof initializePatientSdkAfterInvite).toBe('function')
	},
}
