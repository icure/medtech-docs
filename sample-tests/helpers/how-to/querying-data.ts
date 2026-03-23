import { CardinalSdk } from '@icure/cardinal-sdk'

// ── preTestProvides ──────────────────────────────────────────────────
// All blocks in querying-data are self-contained — no cross-block deps.

export const preTestProvides: Record<string, string[]> = {}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	'querying-data block 1 (WUVO)': async () => ({}),
	'querying-data block 2 (POMO)': async () => ({}),
	'querying-data block 3 (TEWO)': async () => ({}),
	'querying-data block 4 (XICA)': async () => ({}),
	'querying-data block 5 (QOMO)': async () => ({}),
	'querying-data block 6 (FAJU)': async () => ({}),
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: hcpWithName filter variable
	'querying-data block 1 (WUVO)': async (sdk: CardinalSdk, hcpWithName: any) => {
		expect(hcpWithName).toBeDefined()
	},

	// Block 2: myFilter using union/intersection of PatientFilters
	'querying-data block 2 (POMO)': async (sdk: CardinalSdk, myFilter: any) => {
		expect(myFilter).toBeDefined()
	},

	// Block 3: getIdsOfPatientsMatching function
	'querying-data block 3 (TEWO)': async (
		sdk: CardinalSdk,
		getIdsOfPatientsMatching: (sdk: CardinalSdk, filterOptions: any) => Promise<any>,
	) => {
		expect(typeof getIdsOfPatientsMatching).toBe('function')
	},

	// Block 4: four iterator/pagination functions
	'querying-data block 4 (XICA)': async (
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
	'querying-data block 5 (QOMO)': async (
		sdk: CardinalSdk,
		getSortedAcuteOrLongCovidDiagnosesForPatient: (sdk: CardinalSdk, patient: any) => Promise<any>,
	) => {
		expect(typeof getSortedAcuteOrLongCovidDiagnosesForPatient).toBe('function')
	},

	// Block 6: getHeartRateMeasurements
	'querying-data block 6 (FAJU)': async (
		sdk: CardinalSdk,
		getHeartRateMeasurements: (sdk: CardinalSdk) => Promise<any>,
	) => {
		expect(typeof getHeartRateMeasurements).toBe('function')
	},
}
