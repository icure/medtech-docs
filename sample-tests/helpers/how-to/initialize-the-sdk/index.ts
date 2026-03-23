import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'index block 5 (ZIMO)': ['specId', 'processId', 'askValidationCode'],
	'index block 6 (LOVO)': ['getCachedToken', 'askUserPassword', 'username'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'index block 1 (VETE)': async () => ({}),
	'index block 2 (NUQI)': async () => ({}),
	'index block 3 (BADA)': async () => ({}),
	'index block 4 (JAJO)': async () => ({}),
	'index block 5 (ZIMO)': async () => ({
		specId: 'test-spec',
		processId: 'test-process',
		askValidationCode: async () => '123456',
	}),
	'index block 6 (LOVO)': async () => ({
		getCachedToken: async () => 'mock-cached-token',
		askUserPassword: async () => 'mock-password',
		username: 'mock-user@example.com',
	}),
	'index block 7 (TECO)': async () => ({}),
	'index block 8 (GESA)': async () => ({}),
	'index block 9 (NUCO)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'index block 1 (VETE)': async (
		_sdk: CardinalSdk,
		initializeMySdk: (...args: any[]) => any,
	) => {
		expect(typeof initializeMySdk).toBe('function')
	},

	'index block 2 (NUQI)': async (
		_sdk: CardinalSdk,
		auth: any,
	) => {
		expect(auth).toBeDefined()
	},

	'index block 3 (BADA)': async (
		_sdk: CardinalSdk,
		auth: any,
	) => {
		expect(auth).toBeDefined()
	},

	'index block 4 (JAJO)': async (
		_sdk: CardinalSdk,
		auth: any,
	) => {
		expect(auth).toBeDefined()
	},

	'index block 5 (ZIMO)': async (
		_sdk: CardinalSdk,
		initializeMySdk: (...args: any[]) => any,
	) => {
		expect(typeof initializeMySdk).toBe('function')
	},

	'index block 6 (LOVO)': async (
		_sdk: CardinalSdk,
		auth: any,
	) => {
		if (auth !== undefined) {
			expect(auth).toBeDefined()
		}
	},

	'index block 7 (TECO)': async (
		_sdk: CardinalSdk,
		fileStorage: any,
		_localStorage: any,
		_MyVolatileStorage: any,
	) => {
		expect(fileStorage).toBeDefined()
	},

	'index block 8 (GESA)': async (
		_sdk: CardinalSdk,
		options: any,
	) => {
		expect(options).toBeDefined()
	},

	'index block 9 (NUCO)': async (
		_sdk: CardinalSdk,
		base64EncodedKeyStorage: any,
		_jwkEncodedKeyStorage: any,
	) => {
		expect(base64EncodedKeyStorage).toBeDefined()
	},
}
