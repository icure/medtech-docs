import {
	AccessLevel,
	AuthenticationMethod,
	CardinalSdk,
	CodeStub,
	DecryptedContact,
	DecryptedContent,
	DecryptedPatient,
	DecryptedService,
	Measure,
	PatientShareOptions,
	RequestedPermission,
	SecretIdShareOptions,
	ServiceFilters,
	ShareMetadataBehaviour,
	StorageFacade,
	User,
} from '@icure/cardinal-sdk'
import { v4 as uuid } from 'uuid'

// ── cross-block state ──────────────────────────────────────────────────

let createdPatient: DecryptedPatient
let login: string
let loginToken: string
let patient: DecryptedPatient
let patientSdk: CardinalSdk
let contact: DecryptedContact
let serviceIterator: any

// ── helpers ────────────────────────────────────────────────────────────

const readLn = async (_prompt: string) => 'mock-input'
const CARDINAL_URL = process.env.CARDINAL_URL ?? 'https://api.icure.cloud'
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min
const currentFuzzyDate = () => parseInt(new Date().toISOString().replace(/[-T:\.Z]/g, '').substring(0, 14))

// ── preTestProvides ────────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'0_publisher block 1 (GOSI)': ['readLn'],
	'0_publisher block 3 (NUTE)': ['createdPatient'],
	'0_publisher block 4 (FABE)': ['CARDINAL_URL', 'login', 'loginToken'],
	'0_publisher block 5 (QOHO)': ['createdPatient'],
	'0_publisher block 6 (ZORI)': ['CARDINAL_URL', 'login', 'loginToken'],
	'0_publisher block 7 (BIJA)': ['random', 'currentFuzzyDate'],
	'0_publisher block 8 (JICE)': ['patient', 'patientSdk', 'contact'],
	'0_publisher block 9 (MAZU)': ['patientSdk'],
	'0_publisher block 10 (PEXO)': ['serviceIterator', 'patientSdk'],
}

// ── preTest ────────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'0_publisher block 1 (GOSI)': async () => ({
		readLn,
	}),
	'0_publisher block 2 (MIWE)': async () => ({}),
	'0_publisher block 3 (NUTE)': async (sdk) => {
		if (!createdPatient && sdk) {
			const p = new DecryptedPatient({ id: uuid(), firstName: 'Edmond', lastName: 'Dantes' })
			createdPatient = await sdk.patient.createPatient(await sdk.patient.withEncryptionMetadata(p))
		}
		return { createdPatient }
	},
	'0_publisher block 4 (FABE)': async (sdk) => {
		if (!login && sdk) {
			await preTest['0_publisher block 3 (NUTE)'](sdk)
			login = `edmond.dantes.${uuid().substring(0, 6)}@icure.com`
			const patientUser = new User({ id: uuid(), patientId: createdPatient.id, login, email: login })
			const createdUser = await sdk.user.createUser(patientUser)
			loginToken = await sdk.user.getToken(createdUser.id, 'login')
		}
		return { CARDINAL_URL, login, loginToken }
	},
	'0_publisher block 5 (QOHO)': async (sdk) => {
		if (!createdPatient && sdk) {
			await preTest['0_publisher block 3 (NUTE)'](sdk)
		}
		return { createdPatient }
	},
	'0_publisher block 6 (ZORI)': async (sdk) => {
		await preTest['0_publisher block 4 (FABE)'](sdk)
		return { CARDINAL_URL, login, loginToken }
	},
	'0_publisher block 7 (BIJA)': async () => ({
		random,
		currentFuzzyDate,
	}),
	'0_publisher block 8 (JICE)': async (sdk) => {
		if (!patient && sdk) {
			await preTest['0_publisher block 4 (FABE)'](sdk)
			patient = await sdk.patient.shareWith(
				createdPatient.id,
				createdPatient,
				{
					options: new PatientShareOptions({
						shareSecretIds: new SecretIdShareOptions.AllAvailable({ requireAtLeastOne: true }),
						shareEncryptionKey: ShareMetadataBehaviour.IfAvailable,
						requestedPermissions: RequestedPermission.MaxWrite,
					}),
				},
			)
			patientSdk = await CardinalSdk.initialize(
				undefined,
				CARDINAL_URL,
				new AuthenticationMethod.UsingCredentials.UsernamePassword(login, loginToken),
				StorageFacade.usingFileSystem('../scratch/storage'),
			)
		}
		if (!contact) {
			contact = new DecryptedContact({
				id: uuid(),
				openingDate: currentFuzzyDate(),
				services: [
					new DecryptedService({
						id: uuid(),
						content: {
							en: new DecryptedContent({
								measureValue: new Measure({
									value: random(60, 160),
									unitCodes: [new CodeStub({ id: 'UCUM|mmol/L|1', type: 'UCUM', code: 'mmol/L', version: '1' })],
								}),
							}),
						},
						tags: [
							new CodeStub({ id: 'LOINC|2339-0|1', type: 'LOINC', code: '2339-0', version: '1' }),
							new CodeStub({ id: 'CARDINAL|TO_BE_ANALYZED|1', type: 'CARDINAL', code: 'TO_BE_ANALYZED', version: '1' }),
						],
					}),
				],
			})
		}
		return { patient, patientSdk, contact }
	},
	'0_publisher block 9 (MAZU)': async (sdk) => {
		await preTest['0_publisher block 8 (JICE)'](sdk)
		return { patientSdk }
	},
	'0_publisher block 10 (PEXO)': async (sdk) => {
		await preTest['0_publisher block 9 (MAZU)'](sdk)
		if (!serviceIterator) {
			const filter = ServiceFilters.byTagAndValueDateForSelf('CARDINAL', { tagCode: 'ANALYZED' })
			serviceIterator = await patientSdk.contact.filterServicesBy(filter)
		}
		return { serviceIterator, patientSdk }
	},
}

// ── postTest ──────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'0_publisher block 1 (GOSI)': async () => {},
	'0_publisher block 2 (MIWE)': async (_sdk: any, _newPatient: any, _patientWithMetadata: any, cp: any) => {
		if (cp) createdPatient = cp
	},
	'0_publisher block 3 (NUTE)': async (_sdk: any, _login: any, _patientUser: any, _createdUser: any, lt: any) => {
		if (_login) login = _login
		if (lt) loginToken = lt
	},
	'0_publisher block 4 (FABE)': async () => {},
	'0_publisher block 5 (QOHO)': async (_sdk: any, p: any) => {
		if (p) patient = p
	},
	'0_publisher block 6 (ZORI)': async (_sdk: any, ps: any) => {
		if (ps) patientSdk = ps
	},
	'0_publisher block 7 (BIJA)': async (_sdk: any, _glycemiaValue: any, c: any) => {
		if (c) contact = c
	},
	'0_publisher block 8 (JICE)': async () => {},
	'0_publisher block 9 (MAZU)': async (_sdk: any, _filter: any, si: any) => {
		if (si) serviceIterator = si
	},
	'0_publisher block 10 (PEXO)': async () => {},
}
