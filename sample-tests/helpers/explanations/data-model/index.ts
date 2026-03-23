import { CardinalSdk } from '@icure/cardinal-sdk'

export const preTestProvides: Record<string, string[]> = {
	'index block 1 (SIHI)': ['readLn', 'healthElementId'],
}

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'index block 1 (SIHI)': async () => {
		const responses: Record<string, string> = {
			'Login: ': 'test-user@example.com',
			'Password: ': 'test-password',
		}
		return {
			readLn: async (prompt: string) => responses[prompt] ?? 'mock-input',
			healthElementId: 'test-health-element-id',
		}
	},
}

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'index block 1 (SIHI)': async () => {},
}
