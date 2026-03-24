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
	'how-to-subscribe-to-events block 2 (HIHE)': ['subscription'],
	'how-to-subscribe-to-events block 3 (KANU)': ['EntityNotification', 'addToQueueToProcess'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest = {
	'how-to-subscribe-to-events block 1 (DUNO)': async (sdk: CardinalSdk): Promise<Record<string, never>> => ({}),
	'how-to-subscribe-to-events block 2 (HIHE)': async (sdk: CardinalSdk): Promise<{
		subscription: Pick<EntitySubscription<HealthElement>, 'closeReason' | 'close'>
	}> => ({
		subscription: {
			closeReason: null as EntitySubscriptionCloseReason | null,
			close: async () => {},
		},
	}),
	'how-to-subscribe-to-events block 3 (KANU)': async (sdk: CardinalSdk): Promise<{
		EntityNotification: typeof EntityNotification
		addToQueueToProcess: (he: HealthElement) => Promise<void>
	}> => ({
		EntityNotification: EntityNotification,
		addToQueueToProcess: async () => {},
	}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (sdk: CardinalSdk, ...args: unknown[]) => void | Promise<void>> = {
	'how-to-subscribe-to-events block 1 (DUNO)': async (_sdk, subscription) => {
		expect(subscription).toBeDefined()
	},

	'how-to-subscribe-to-events block 2 (HIHE)': async () => {
		// no-op — block just inspects subscription.closeReason
	},

	'how-to-subscribe-to-events block 3 (KANU)': async (_sdk, getMissedEvents, subscription) => {
		expect(getMissedEvents).toBeDefined()
		expect(subscription).toBeDefined()
	},
}
