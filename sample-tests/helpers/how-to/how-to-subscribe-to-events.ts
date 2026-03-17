import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'how-to-subscribe-to-events block 2 (line 256)': ['subscription'],
	'how-to-subscribe-to-events block 3 (line 390)': ['EntityNotification', 'addToQueueToProcess'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'how-to-subscribe-to-events block 1 (line 95)': async () => ({}),
	'how-to-subscribe-to-events block 2 (line 256)': async () => ({
		subscription: {
			closeReason: null,
			close: async () => {},
		},
	}),
	'how-to-subscribe-to-events block 3 (line 390)': async () => ({
		EntityNotification: class EntityNotification {
			type: string
			entity: any
			constructor(type: string, entity: any) {
				this.type = type
				this.entity = entity
			}
		},
		addToQueueToProcess: async () => {},
	}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'how-to-subscribe-to-events block 1 (line 95)': async (_sdk: CardinalSdk, subscription: any) => {
		expect(subscription).toBeDefined()
	},

	'how-to-subscribe-to-events block 2 (line 256)': async () => {
		// no-op — block just inspects subscription.closeReason
	},

	'how-to-subscribe-to-events block 3 (line 390)': async (_sdk: CardinalSdk, getMissedEvents: any, subscription: any) => {
		expect(getMissedEvents).toBeDefined()
		expect(subscription).toBeDefined()
	},
}
