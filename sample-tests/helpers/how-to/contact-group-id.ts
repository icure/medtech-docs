import {
	AccessLevel,
	CardinalSdk,
	DecryptedContact,
	DecryptedContent,
	DecryptedPatient,
	DecryptedService,
	Measure,
	Medication,
	randomUuid,
	Substanceproduct,
	TimeSeries,
} from '@icure/cardinal-sdk'
import { v4 as uuid } from 'uuid'

// ── shared state across blocks ───────────────────────────────────────
// The MDX code blocks for this page form a sequential scenario.
// Variables declared in one block are referenced in later blocks.
// Pre-tests return the missing variables so the generated test can
// destructure them into the local scope.

let visitingDoctorSdk: CardinalSdk
let researchDoctorSdk: CardinalSdk
let patient: DecryptedPatient
let researchDoctorId: string
let bloodPressureService: DecryptedService
let heartRateService: DecryptedService
let medicationService: DecryptedService

// ── helpers ──────────────────────────────────────────────────────────

async function createTestPatient(sdk: CardinalSdk, first = 'Rupert', last = 'Venables'): Promise<DecryptedPatient> {
	const init = await sdk.patient.withEncryptionMetadata(
		new DecryptedPatient({
			id: randomUuid(),
			firstName: first,
			lastName: last,
		}),
	)
	return sdk.patient.createPatient(init)
}

function buildServices() {
	const bp = new DecryptedService({
		id: uuid(),
		label: 'Blood pressure',
		valueDate: 20240920154600,
		content: {
			en: new DecryptedContent({
				measureValue: new Measure({
					value: Math.floor(Math.random() * (80 - 120 + 1)) + 120,
					unit: 'mmHg',
				}),
			}),
		},
	})

	const ecgSignal = Array.from({ length: 10 }, () => (Math.floor(Math.random() * (0 - 100 + 1)) + 100) / 100.0)
	const hr = new DecryptedService({
		id: uuid(),
		label: 'Heart rate',
		valueDate: 20240920154600,
		content: {
			en: new DecryptedContent({
				timeSeries: new TimeSeries({
					samples: [ecgSignal],
				}),
			}),
		},
	})

	const med = new DecryptedService({
		id: uuid(),
		label: 'Prescription',
		valueDate: 20240920154600,
		content: {
			en: new DecryptedContent({
				medicationValue: new Medication({
					substanceProduct: new Substanceproduct({
						deliveredname: 'lisinopril',
					}),
					instructionForPatient: '10mg before breakfast.',
				}),
			}),
		},
	})

	return { bloodPressure: bp, heartRate: hr, medication: med }
}

// ── preTestProvides ──────────────────────────────────────────────────
// Declares which variables each pre-test returns, so the test generator
// can emit a destructuring assignment.

export const preTestProvides: Record<string, string[]> = {
	'contact-group-id block 1 (line 74)': ['VISITING_DOCTOR_USERNAME', 'VISITING_DOCTOR_PASSWORD', 'RESEARCH_DOCTOR_USERNAME', 'RESEARCH_DOCTOR_PASSWORD'],
	'contact-group-id block 2 (line 162)': ['visitingDoctorSdk'],
	'contact-group-id block 3 (line 216)': ['researchDoctorSdk'],
	'contact-group-id block 4 (line 303)': [],
	'contact-group-id block 5 (line 480)': ['visitingDoctorSdk', 'patient', 'heartRateService', 'bloodPressureService', 'medicationService', 'researchDoctorId'],
	'contact-group-id block 6 (line 597)': ['visitingDoctorSdk', 'patient'],
	'contact-group-id block 7 (line 661)': ['researchDoctorSdk'],
}

// ── preTest ──────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
	// Block 1 has placeholder credentials in the MDX.
	// Provide them from env vars (or test defaults) so the block can run.
	'contact-group-id block 1 (line 74)': async (sdk) => {
		visitingDoctorSdk = sdk
		researchDoctorSdk = sdk
		return {
			VISITING_DOCTOR_USERNAME: process.env.CARDINAL_USERNAME ?? 'visiting-doctor',
			VISITING_DOCTOR_PASSWORD: process.env.CARDINAL_PASSWORD ?? 'password',
			RESEARCH_DOCTOR_USERNAME: process.env.CARDINAL_USERNAME ?? 'research-doctor',
			RESEARCH_DOCTOR_PASSWORD: process.env.CARDINAL_PASSWORD ?? 'password',
		}
	},

	// Block 2 uses visitingDoctorSdk (set by block 1)
	'contact-group-id block 2 (line 162)': async (sdk) => {
		if (!visitingDoctorSdk) visitingDoctorSdk = sdk
		return { visitingDoctorSdk }
	},

	// Block 3 uses researchDoctorSdk
	'contact-group-id block 3 (line 216)': async (sdk) => {
		if (!researchDoctorSdk) researchDoctorSdk = sdk
		return { researchDoctorSdk }
	},

	// Block 4 is self-contained (only constructs objects)
	'contact-group-id block 4 (line 303)': async () => {
		return {}
	},

	// Block 5 uses visitingDoctorSdk, patient, services, researchDoctorId
	'contact-group-id block 5 (line 480)': async (sdk) => {
		if (!visitingDoctorSdk) visitingDoctorSdk = sdk
		if (!patient) patient = await createTestPatient(visitingDoctorSdk)
		const services = buildServices()
		bloodPressureService = services.bloodPressure
		heartRateService = services.heartRate
		medicationService = services.medication
		if (!researchDoctorId) {
			researchDoctorId = (await visitingDoctorSdk.healthcareParty.getCurrentHealthcareParty()).id
		}
		return { visitingDoctorSdk, patient, heartRateService, bloodPressureService, medicationService, researchDoctorId }
	},

	// Block 6 uses visitingDoctorSdk, patient
	'contact-group-id block 6 (line 597)': async (sdk) => {
		if (!visitingDoctorSdk) visitingDoctorSdk = sdk
		if (!patient) patient = await createTestPatient(visitingDoctorSdk)
		return { visitingDoctorSdk, patient }
	},

	// Block 7 uses researchDoctorSdk
	'contact-group-id block 7 (line 661)': async (sdk) => {
		if (!researchDoctorSdk) researchDoctorSdk = sdk
		return { researchDoctorSdk }
	},
}

// ── postTest ─────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	// Block 1: initialises visitingDoctorSdk, researchDoctorSdk
	// Code has <PLACEHOLDER> syntax so it won't actually run.
	'contact-group-id block 1 (line 74)': async (
		_sdk: CardinalSdk,
		_CARDINAL_URL: string,
		_visitingDoctorUsername: any,
		_visitingDoctorPassword: any,
		_researchDoctorUsername: any,
		_researchDoctorPassword: any,
		visitingDoctorSdkLocal: CardinalSdk,
		researchDoctorSdkLocal: CardinalSdk,
	) => {
		if (visitingDoctorSdkLocal) {
			expect(visitingDoctorSdkLocal).toBeDefined()
			visitingDoctorSdk = visitingDoctorSdkLocal
		}
		if (researchDoctorSdkLocal) {
			expect(researchDoctorSdkLocal).toBeDefined()
			researchDoctorSdk = researchDoctorSdkLocal
		}
	},

	// Block 2: creates patientToCreate and patient
	'contact-group-id block 2 (line 162)': async (
		_sdk: CardinalSdk,
		patientToCreate: DecryptedPatient,
		patientLocal: DecryptedPatient,
	) => {
		expect(patientLocal).toBeDefined()
		expect(patientLocal.id).toBeTruthy()
		expect(patientLocal.firstName).toBe('Rupert')
		expect(patientLocal.lastName).toBe('Venables')
		patient = patientLocal
	},

	// Block 3: gets researchDoctorId
	'contact-group-id block 3 (line 216)': async (_sdk: CardinalSdk, researchDoctorIdLocal: string) => {
		expect(researchDoctorIdLocal).toBeTruthy()
		expect(typeof researchDoctorIdLocal).toBe('string')
		researchDoctorId = researchDoctorIdLocal
	},

	// Block 4: constructs service objects
	'contact-group-id block 4 (line 303)': async (
		_sdk: CardinalSdk,
		bloodPressureServiceLocal: DecryptedService,
		ecgSignal: number[],
		heartRateServiceLocal: DecryptedService,
		medicationServiceLocal: DecryptedService,
	) => {
		expect(bloodPressureServiceLocal).toBeDefined()
		expect(bloodPressureServiceLocal.label).toBe('Blood pressure')

		expect(heartRateServiceLocal).toBeDefined()
		expect(heartRateServiceLocal.label).toBe('Heart rate')

		expect(medicationServiceLocal).toBeDefined()
		expect(medicationServiceLocal.label).toBe('Prescription')

		expect(Array.isArray(ecgSignal)).toBe(true)
		expect(ecgSignal.length).toBe(10)

		bloodPressureService = bloodPressureServiceLocal
		heartRateService = heartRateServiceLocal
		medicationService = medicationServiceLocal
	},

	// Block 5: creates two contacts with same groupId
	'contact-group-id block 5 (line 480)': async (
		_sdk: CardinalSdk,
		groupId: string,
		contactForResearch: DecryptedContact,
		contact: DecryptedContact,
	) => {
		expect(groupId).toBeTruthy()
		expect(contactForResearch).toBeDefined()
		expect(contactForResearch.groupId).toBe(groupId)
		expect(contact).toBeDefined()
		expect(contact.groupId).toBe(groupId)
	},

	// Block 6: iterates services for patient
	'contact-group-id block 6 (line 597)': async (_sdk: CardinalSdk, allServicesIterator: any) => {
		expect(allServicesIterator).toBeDefined()
	},

	// Block 7: iterates contacts by opening date
	'contact-group-id block 7 (line 661)': async (_sdk: CardinalSdk, researchContactIterator: any) => {
		expect(researchContactIterator).toBeDefined()
	},
}
