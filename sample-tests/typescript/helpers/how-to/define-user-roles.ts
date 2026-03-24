import { CardinalSdk, User } from '@icure/cardinal-sdk'

// ── shared state across blocks ───────────────────────────────────────
// block 1: get all roles
// block 2: add a role to a user (references allRoles from block 1, has syntax error for userId)
// block 3: remove roles from a user (references userId from block 2)

let allRoles: any[]
let userId: string

// ── preTestProvides ──────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'define-user-roles block 1 (WEGE)': [],
	'define-user-roles block 2 (JALU)': ['allRoles', 'userId'],
	'define-user-roles block 3 (NUBU)': ['userId'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'define-user-roles block 1 (WEGE)': async () => {
		return {}
	},

	// Block 2 references `allRoles` from block 1.
	'define-user-roles block 2 (JALU)': async (sdk) => {
		if (!allRoles) {
			allRoles = await sdk.role.getAllRoles()
		}
		const currentUser = await sdk.user.getCurrentUser()
		userId = currentUser.id
		return { allRoles, userId }
	},

	// Block 3 references userId from block 2.
	'define-user-roles block 3 (NUBU)': async (sdk) => {
		if (!userId) {
			const currentUser = await sdk.user.getCurrentUser()
			userId = currentUser.id
		}
		return { userId }
	},
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: const allRoles = await sdk.role.getAllRoles()
	'define-user-roles block 1 (WEGE)': async (_sdk: CardinalSdk, allRolesLocal: any[]) => {
		expect(allRolesLocal).toBeDefined()
		expect(Array.isArray(allRolesLocal)).toBe(true)
		expect(allRolesLocal.length).toBeGreaterThan(0)
		allRoles = allRolesLocal
	},

	// Block 2: gets user, adds role
	// Code has syntax error so it won't run as-is.
	'define-user-roles block 2 (JALU)': async (_sdk: CardinalSdk, userIdLocal: string, user: User) => {
		if (userIdLocal && user) {
			expect(userIdLocal).toBeTruthy()
			expect(user).toBeDefined()
			expect(user.id).toBe(userIdLocal)
		}
	},

	// Block 3: removes roles from user
	'define-user-roles block 3 (NUBU)': async (sdk: CardinalSdk) => {
		const user = await sdk.user.getCurrentUser()
		expect(user).toBeDefined()
	},
}
