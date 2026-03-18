import {
	CardinalSdk,
	EntitySubscription,
	EntitySubscriptionCloseReason,
	EntitySubscriptionEvent,
	HealthElement,
} from '@icure/cardinal-sdk'
import EntityNotification = EntitySubscriptionEvent.EntityNotification;

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'how-to-subscribe-to-events block 2 (line 256)': ['subscription'],
	'how-to-subscribe-to-events block 3 (line 390)': ['EntityNotification', 'addToQueueToProcess'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest = {
	'how-to-subscribe-to-events block 1 (line 95)': async (sdk: CardinalSdk): Promise<Record<string, never>> => ({}),
	'how-to-subscribe-to-events block 2 (line 256)': async (sdk: CardinalSdk): Promise<{
		subscription: Pick<EntitySubscription<HealthElement>, 'closeReason' | 'close'>
	}> => ({
		subscription: {
			closeReason: null as EntitySubscriptionCloseReason | null,
			close: async () => {},
		},
	}),
	'how-to-subscribe-to-events block 3 (line 390)': async (sdk: CardinalSdk): Promise<{
		EntityNotification: typeof EntityNotification
		addToQueueToProcess: (he: HealthElement) => Promise<void>
	}> => ({
		EntityNotification: EntityNotification,
		addToQueueToProcess: async () => {},
	}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (sdk: CardinalSdk, ...args: unknown[]) => void | Promise<void>> = {
	'how-to-subscribe-to-events block 1 (line 95)': async (_sdk, subscription) => {
		expect(subscription).toBeDefined()
	},

	'how-to-subscribe-to-events block 2 (line 256)': async () => {
		// no-op — block just inspects subscription.closeReason
	},

	'how-to-subscribe-to-events block 3 (line 390)': async (_sdk, getMissedEvents, subscription) => {
		expect(getMissedEvents).toBeDefined()
		expect(subscription).toBeDefined()
	},
}
