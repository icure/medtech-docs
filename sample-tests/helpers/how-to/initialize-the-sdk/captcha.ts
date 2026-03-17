import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'captcha block 1 (line 48)': ['specId', 'processId', 'email', 'friendlyCaptchaResponse'],
	'captcha block 2 (line 129)': ['specId', 'processId', 'email', 'reCaptchaResponse'],
	'captcha block 3 (line 214)': ['specId', 'processId', 'email'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'captcha block 1 (line 48)': async () => ({
		specId: 'test-spec',
		processId: 'test-process',
		email: 'test@example.com',
		friendlyCaptchaResponse: 'test-captcha',
	}),
	'captcha block 2 (line 129)': async () => ({
		specId: 'test-spec',
		processId: 'test-process',
		email: 'test@example.com',
		reCaptchaResponse: 'test-recaptcha',
	}),
	'captcha block 3 (line 214)': async () => ({
		specId: 'test-spec',
		processId: 'test-process',
		email: 'test@example.com',
	}),
	'captcha block 4 (line 359)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'captcha block 1 (line 48)': async (
		_sdk: CardinalSdk,
		_authenticationStep: any,
	) => {
		// Can't really test without real captcha — no-op
	},

	'captcha block 2 (line 129)': async (
		_sdk: CardinalSdk,
		_authenticationStep: any,
	) => {
		// Can't really test without real captcha — no-op
	},

	'captcha block 3 (line 214)': async (
		_sdk: CardinalSdk,
		_authenticationStep: any,
	) => {
		// Can't really test without real captcha — no-op
	},

	'captcha block 4 (line 359)': async (
		_sdk: CardinalSdk,
		getAndSolveKerberusChallenge: (...args: any[]) => any,
		_msgGwUrl: string,
		_specId: string,
		_processId: string,
	) => {
		expect(typeof getAndSolveKerberusChallenge).toBe('function')
	},
}
