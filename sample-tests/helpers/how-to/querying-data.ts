import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────
// All blocks in querying-data are self-contained — no cross-block deps.

export const preTestProvides: Record<string, string[]> = {}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'querying-data block 1 (line 30)': async () => ({}),
	'querying-data block 2 (line 178)': async () => ({}),
	'querying-data block 3 (line 242)': async () => ({}),
	'querying-data block 4 (line 311)': async () => ({}),
	'querying-data block 5 (line 439)': async () => ({}),
	'querying-data block 6 (line 547)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: hcpWithName filter variable
	'querying-data block 1 (line 30)': async (sdk: CardinalSdk, hcpWithName: any) => {
		expect(hcpWithName).toBeDefined()
	},

	// Block 2: myFilter using union/intersection of PatientFilters
	'querying-data block 2 (line 178)': async (sdk: CardinalSdk, myFilter: any) => {
		expect(myFilter).toBeDefined()
	},

	// Block 3: getIdsOfPatientsMatching function
	'querying-data block 3 (line 242)': async (
		sdk: CardinalSdk,
		getIdsOfPatientsMatching: (sdk: CardinalSdk, filterOptions: any) => Promise<any>,
	) => {
		expect(typeof getIdsOfPatientsMatching).toBe('function')
	},

	// Block 4: four iterator/pagination functions
	'querying-data block 4 (line 311)': async (
		sdk: CardinalSdk,
		getDecryptedPatientsIterator: (...args: any[]) => any,
		getEncryptedPatientsIterator: (...args: any[]) => any,
		getPatientsIterator: (...args: any[]) => any,
		printAllPatientsBy10: (...args: any[]) => any,
	) => {
		expect(typeof getDecryptedPatientsIterator).toBe('function')
		expect(typeof getEncryptedPatientsIterator).toBe('function')
		expect(typeof getPatientsIterator).toBe('function')
		expect(typeof printAllPatientsBy10).toBe('function')
	},

	// Block 5: getSortedAcuteOrLongCovidDiagnosesForPatient
	'querying-data block 5 (line 439)': async (
		sdk: CardinalSdk,
		getSortedAcuteOrLongCovidDiagnosesForPatient: (sdk: CardinalSdk, patient: any) => Promise<any>,
	) => {
		expect(typeof getSortedAcuteOrLongCovidDiagnosesForPatient).toBe('function')
	},

	// Block 6: getHeartRateMeasurements
	'querying-data block 6 (line 547)': async (
		sdk: CardinalSdk,
		getHeartRateMeasurements: (sdk: CardinalSdk) => Promise<any>,
	) => {
		expect(typeof getHeartRateMeasurements).toBe('function')
	},
}
