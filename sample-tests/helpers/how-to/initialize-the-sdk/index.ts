import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'index block 5 (line 377)': ['specId', 'processId', 'askValidationCode'],
	'index block 6 (line 584)': ['getCachedToken', 'askUserPassword', 'username'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'index block 1 (line 47)': async () => ({}),
	'index block 2 (line 180)': async () => ({}),
	'index block 3 (line 233)': async () => ({}),
	'index block 4 (line 283)': async () => ({}),
	'index block 5 (line 377)': async () => ({
		specId: 'test-spec',
		processId: 'test-process',
		askValidationCode: async () => '123456',
	}),
	'index block 6 (line 584)': async () => ({
		getCachedToken: async () => 'mock-cached-token',
		askUserPassword: async () => 'mock-password',
		username: 'mock-user@example.com',
	}),
	'index block 7 (line 715)': async () => ({}),
	'index block 8 (line 845)': async () => ({}),
	'index block 9 (line 927)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'index block 1 (line 47)': async (
		_sdk: CardinalSdk,
		initializeMySdk: (...args: any[]) => any,
	) => {
		expect(typeof initializeMySdk).toBe('function')
	},

	'index block 2 (line 180)': async (
		_sdk: CardinalSdk,
		auth: any,
	) => {
		expect(auth).toBeDefined()
	},

	'index block 3 (line 233)': async (
		_sdk: CardinalSdk,
		auth: any,
	) => {
		expect(auth).toBeDefined()
	},

	'index block 4 (line 283)': async (
		_sdk: CardinalSdk,
		auth: any,
	) => {
		expect(auth).toBeDefined()
	},

	'index block 5 (line 377)': async (
		_sdk: CardinalSdk,
		initializeMySdk: (...args: any[]) => any,
	) => {
		expect(typeof initializeMySdk).toBe('function')
	},

	'index block 6 (line 584)': async (
		_sdk: CardinalSdk,
		auth: any,
	) => {
		if (auth !== undefined) {
			expect(auth).toBeDefined()
		}
	},

	'index block 7 (line 715)': async (
		_sdk: CardinalSdk,
		fileStorage: any,
		_localStorage: any,
		_MyVolatileStorage: any,
	) => {
		expect(fileStorage).toBeDefined()
	},

	'index block 8 (line 845)': async (
		_sdk: CardinalSdk,
		options: any,
	) => {
		expect(options).toBeDefined()
	},

	'index block 9 (line 927)': async (
		_sdk: CardinalSdk,
		base64EncodedKeyStorage: any,
		_jwkEncodedKeyStorage: any,
	) => {
		expect(base64EncodedKeyStorage).toBeDefined()
	},
}
