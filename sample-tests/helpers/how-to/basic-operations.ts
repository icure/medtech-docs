import {
	CardinalSdk,
	DecryptedContact,
	DecryptedHealthElement,
	DecryptedPatient,
	FilterOptions,
	HealthcareParty,
	Patient,
	PatientFilters,
	randomUuid,
	User,
} from '@icure/cardinal-sdk'

// ── helpers ──────────────────────────────────────────────────────────

async function createTestPatient(sdk: CardinalSdk, first = 'Test', last = 'Patient'): Promise<DecryptedPatient> {
	const init = await sdk.patient.withEncryptionMetadata(
		new DecryptedPatient({
			id: randomUuid(),
			firstName: first,
			lastName: last,
		}),
	)
	return sdk.patient.createPatient(init)
}

// ── preTestProvides ──────────────────────────────────────────────────
// All blocks in basic-operations are self-contained — no cross-block deps.

export const preTestProvides: Record<string, string[]> = {
	'basic-operations block 10 (line 747)': ['askUserToResolveNoteConflict'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'basic-operations block 1 (line 57)': async () => ({}),
	'basic-operations block 2 (line 126)': async () => ({}),
	'basic-operations block 3 (line 217)': async () => ({}),
	'basic-operations block 4 (line 309)': async () => ({}),
	'basic-operations block 5 (line 378)': async () => ({}),
	'basic-operations block 6 (line 478)': async () => ({}),
	'basic-operations block 7 (line 552)': async () => ({}),
	'basic-operations block 8 (line 601)': async () => ({}),
	'basic-operations block 9 (line 674)': async () => ({}),
	'basic-operations block 10 (line 747)': async () => ({
		// Simple conflict resolution: always pick the incoming note
		askUserToResolveNoteConflict: (existingNote: string | undefined, newNote: string) => newNote,
	}),
	'basic-operations block 11 (line 879)': async () => ({}),
	'basic-operations block 12 (line 1050)': async () => ({}),
	'basic-operations block 13 (line 1237)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: createDoctor(sdk, firstName, lastName) → HealthcareParty
	'basic-operations block 1 (line 57)': async (
		sdk: CardinalSdk,
		createDoctor: (sdk: CardinalSdk, firstName: string, lastName: string) => Promise<HealthcareParty>,
	) => {
		const hp = await createDoctor(sdk, 'Alice', 'Smith')
		expect(hp).toBeDefined()
		expect(hp.id).toBeTruthy()
		expect(hp.firstName).toBe('Alice')
		expect(hp.lastName).toBe('Smith')
	},

	// Block 2: createPatient(sdk, firstName, lastName) → DecryptedPatient
	'basic-operations block 2 (line 126)': async (
		sdk: CardinalSdk,
		createPatient: (sdk: CardinalSdk, firstName: string, lastName: string) => Promise<DecryptedPatient>,
	) => {
		const patient = await createPatient(sdk, 'Bob', 'Jones')
		expect(patient).toBeDefined()
		expect(patient.id).toBeTruthy()
		expect(patient.firstName).toBe('Bob')
		expect(patient.lastName).toBe('Jones')
	},

	// Block 3: createHealthElementForPatient(sdk, patient, description) → DecryptedHealthElement
	'basic-operations block 3 (line 217)': async (
		sdk: CardinalSdk,
		createHealthElementForPatient: (sdk: CardinalSdk, patient: Patient, description: string) => Promise<DecryptedHealthElement>,
	) => {
		const patient = await createTestPatient(sdk)
		const he = await createHealthElementForPatient(sdk, patient, 'Test condition')
		expect(he).toBeDefined()
		expect(he.id).toBeTruthy()
		expect(he.descr).toBe('Test condition')
	},

	// Block 4: createPatient(sdk, firstName, lastName) using null init → DecryptedPatient
	'basic-operations block 4 (line 309)': async (
		sdk: CardinalSdk,
		createPatient: (sdk: CardinalSdk, firstName: string, lastName: string) => Promise<DecryptedPatient>,
	) => {
		const patient = await createPatient(sdk, 'Carol', 'White')
		expect(patient).toBeDefined()
		expect(patient.id).toBeTruthy()
		expect(patient.firstName).toBe('Carol')
		expect(patient.lastName).toBe('White')
	},

	// Block 5: createPatient(sdk, firstName, lastName, sharedWith) → DecryptedPatient
	'basic-operations block 5 (line 378)': async (
		sdk: CardinalSdk,
		createPatient: (sdk: CardinalSdk, firstName: string, lastName: string, sharedWith: string | null) => Promise<DecryptedPatient>,
	) => {
		const patient = await createPatient(sdk, 'Dave', 'Brown', null)
		expect(patient).toBeDefined()
		expect(patient.id).toBeTruthy()
		expect(patient.firstName).toBe('Dave')
		expect(patient.lastName).toBe('Brown')
	},

	// Block 6: createPatient(sdk, currentUser, firstName, lastName) → DecryptedPatient
	'basic-operations block 6 (line 478)': async (
		sdk: CardinalSdk,
		createPatient: (sdk: CardinalSdk, currentUser: User, firstName: string, lastName: string) => Promise<DecryptedPatient>,
	) => {
		const currentUser = await sdk.user.getCurrentUser()
		const patient = await createPatient(sdk, currentUser, 'Eve', 'Green')
		expect(patient).toBeDefined()
		expect(patient.id).toBeTruthy()
		expect(patient.firstName).toBe('Eve')
		expect(patient.lastName).toBe('Green')
	},

	// Block 7: getPatientOfUser(sdk, user) → DecryptedPatient
	// We can only verify the function exists and throws for non-patient users
	'basic-operations block 7 (line 552)': async (
		sdk: CardinalSdk,
		getPatientOfUser: (sdk: CardinalSdk, user: User) => Promise<DecryptedPatient>,
	) => {
		const user = await sdk.user.getCurrentUser()
		if (user.patientId) {
			const patient = await getPatientOfUser(sdk, user)
			expect(patient).toBeDefined()
			expect(patient.id).toBe(user.patientId)
		} else {
			await expect(getPatientOfUser(sdk, user)).rejects.toThrow('Not a patient user')
		}
	},

	// Block 8: getContactsOfPatient(sdk, patient, limit) → DecryptedContact[]
	'basic-operations block 8 (line 601)': async (
		sdk: CardinalSdk,
		getContactsOfPatient: (sdk: CardinalSdk, patient: Patient, limit: number) => Promise<DecryptedContact[]>,
	) => {
		const patient = await createTestPatient(sdk)
		const contacts = await getContactsOfPatient(sdk, patient, 10)
		expect(Array.isArray(contacts)).toBe(true)
	},

	// Block 9: setPatientNote(sdk, patient, newNote) → DecryptedPatient
	'basic-operations block 9 (line 674)': async (
		sdk: CardinalSdk,
		setPatientNote: (sdk: CardinalSdk, patient: DecryptedPatient, newNote: string) => Promise<DecryptedPatient>,
	) => {
		const patient = await createTestPatient(sdk)
		const updated = await setPatientNote(sdk, patient, 'Hello note')
		expect(updated.note).toBe('Hello note')
		expect(updated.id).toBe(patient.id)
	},

	// Block 10: setPatientNote with conflict handling — uses undefined askUserToResolveNoteConflict
	// We can only test the happy path (no conflict)
	'basic-operations block 10 (line 747)': async (
		sdk: CardinalSdk,
		setPatientNote: (sdk: CardinalSdk, patient: DecryptedPatient, newNote: string) => Promise<DecryptedPatient>,
	) => {
		const patient = await createTestPatient(sdk)
		const updated = await setPatientNote(sdk, patient, 'Conflict-safe note')
		expect(updated.note).toBe('Conflict-safe note')
		expect(updated.id).toBe(patient.id)
	},

	// Block 11: deletePatient, undeletePatient, purgeUser
	'basic-operations block 11 (line 879)': async (
		sdk: CardinalSdk,
		deletePatient: (sdk: CardinalSdk, patient: Patient) => Promise<void>,
		undeletePatient: (sdk: CardinalSdk, patientId: string, patientRev: string) => Promise<DecryptedPatient>,
		_purgeUser: (sdk: CardinalSdk, user: User) => Promise<void>,
	) => {
		const patient = await createTestPatient(sdk, 'ToDelete', 'Patient')
		// deletePatient logs the id/rev; just verify it doesn't throw
		await deletePatient(sdk, patient)
		// The patient should now be soft-deleted; get it to find the rev for undelete
		const deleted = await sdk.patient.getPatient(patient.id)
		expect(deleted).toBeDefined()
		const restored = await undeletePatient(sdk, patient.id, deleted.rev!)
		expect(restored).toBeDefined()
		expect(restored.id).toBe(patient.id)
		// We skip purgeUser — it requires a deleted user and is destructive
	},

	// Block 12: printMatchingPatientNames, printPatientDetails
	'basic-operations block 12 (line 1050)': async (
		sdk: CardinalSdk,
		printMatchingPatientNames: (sdk: CardinalSdk, filter: FilterOptions<Patient>, limit: number) => Promise<void>,
		printPatientDetails: (sdk: CardinalSdk, patientId: string) => Promise<void>,
	) => {
		const patient = await createTestPatient(sdk, 'Findable', 'Person')
		// Just verify the functions execute without throwing
		await printMatchingPatientNames(sdk, PatientFilters.byIds([patient.id]), 10)
		await printPatientDetails(sdk, patient.id)
	},

	// Block 13: shareHealthElementForStatistics — uses a placeholder STATISTICS_DATA_OWNER_ID = "..."
	// Cannot meaningfully test without a real second data owner, so just verify the function is defined
	'basic-operations block 13 (line 1237)': async (
		_sdk: CardinalSdk,
		shareHealthElementForStatistics: (...args: any[]) => Promise<any>,
		STATISTICS_DATA_OWNER_ID: string,
	) => {
		expect(typeof shareHealthElementForStatistics).toBe('function')
		expect(STATISTICS_DATA_OWNER_ID).toBeDefined()
	},
}
