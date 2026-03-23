import {
	AccessLevel,
	AuthenticationMethod,
	CardinalSdk,
	DecryptedDocument,
	DecryptedHealthElement,
	DecryptedPatient,
	HealthcareParty,
	PatientShareOptions,
	RequestedPermission,
	SecretIdShareOptions,
	ShareMetadataBehaviour,
	StorageFacade,
	User,
} from '@icure/cardinal-sdk'
import { v4 as uuid } from 'uuid'

// ── cross-block state ──────────────────────────────────────────────────

let otherSdk: CardinalSdk
let otherHcp: HealthcareParty
let oldDocument: DecryptedDocument
let updatedDocument: DecryptedDocument
let createdNewDocument: DecryptedDocument
let createdPatient: DecryptedPatient
let login: string
let createdUser: User
let loginToken: string
let patient: DecryptedPatient
let patientSdk: CardinalSdk
let createdHealthElement: DecryptedHealthElement
let newCreatedHealthElement: DecryptedHealthElement

// ── helpers ────────────────────────────────────────────────────────────

const readLn = async (_prompt: string) => 'mock-input'
const CARDINAL_URL = process.env.CARDINAL_URL ?? 'https://api.icure.cloud'

// ── preTestProvides ────────────────────────────────────────────────────

export const preTestProvides: Record<string, string[]> = {
	'4_share_data block 1 (WITE)': ['readLn', 'CARDINAL_URL'],
	'4_share_data block 2 (ZESO)': [],
	'4_share_data block 3 (KIXO)': ['otherSdk', 'oldDocument'],
	'4_share_data block 4 (VEKO)': ['otherHcp', 'oldDocument'],
	'4_share_data block 5 (BUNA)': ['otherSdk', 'oldDocument'],
	'4_share_data block 6 (GEJU)': ['otherHcp'],
	'4_share_data block 7 (HAJI)': ['otherSdk', 'createdNewDocument'],
	'4_share_data block 8 (BACA)': [],
	'4_share_data block 9 (TUNI)': ['createdPatient'],
	'4_share_data block 10 (GAZA)': ['createdUser'],
	'4_share_data block 11 (LUDI)': ['CARDINAL_URL', 'login', 'loginToken'],
	'4_share_data block 12 (BOKI)': ['createdPatient'],
	'4_share_data block 13 (LIHA)': ['CARDINAL_URL', 'login', 'loginToken'],
	'4_share_data block 14 (FEHI)': ['patient'],
	'4_share_data block 15 (XALO)': ['patientSdk', 'createdHealthElement'],
	'4_share_data block 16 (DUCO)': ['patient', 'createdHealthElement'],
	'4_share_data block 17 (KUFA)': ['patientSdk', 'createdHealthElement'],
	'4_share_data block 18 (XEFE)': ['patient'],
	'4_share_data block 19 (NUZA)': ['patientSdk', 'newCreatedHealthElement'],
}

// ── preTest ────────────────────────────────────────────────────────────

export const preTest: Record<string, (sdk?: CardinalSdk) => Promise<Record<string, any>>> = {
	'4_share_data block 1 (WITE)': async () => ({
		readLn,
		CARDINAL_URL,
	}),
	'4_share_data block 2 (ZESO)': async () => ({}),
	'4_share_data block 3 (KIXO)': async (sdk) => {
		if (!otherSdk && sdk) {
			// Cannot create another SDK without credentials; use the same sdk as a fallback
			otherSdk = sdk
			otherHcp = await otherSdk.healthcareParty.getCurrentHealthcareParty()
		}
		if (!oldDocument && sdk) {
			oldDocument = await sdk.document.createDocument(
				await sdk.document.withEncryptionMetadataUnlinked(
					new DecryptedDocument({ id: uuid(), name: 'An important document' }),
				),
			)
		}
		return { otherSdk, oldDocument }
	},
	'4_share_data block 4 (VEKO)': async (sdk) => {
		if (!otherHcp && sdk) {
			otherHcp = await sdk.healthcareParty.getCurrentHealthcareParty()
		}
		if (!oldDocument && sdk) {
			oldDocument = await sdk.document.createDocument(
				await sdk.document.withEncryptionMetadataUnlinked(
					new DecryptedDocument({ id: uuid(), name: 'An important document' }),
				),
			)
		}
		return { otherHcp, oldDocument, updatedDocument }
	},
	'4_share_data block 5 (BUNA)': async (sdk) => {
		await preTest['4_share_data block 3 (KIXO)'](sdk)
		return { otherSdk, oldDocument }
	},
	'4_share_data block 6 (GEJU)': async (sdk) => {
		if (!otherHcp && sdk) {
			otherHcp = await sdk.healthcareParty.getCurrentHealthcareParty()
		}
		return { otherHcp }
	},
	'4_share_data block 7 (HAJI)': async (sdk) => {
		if (!otherSdk && sdk) {
			otherSdk = sdk
			otherHcp = await otherSdk.healthcareParty.getCurrentHealthcareParty()
		}
		if (!createdNewDocument && sdk) {
			if (!otherHcp) {
				otherHcp = await sdk.healthcareParty.getCurrentHealthcareParty()
			}
			const newDoc = new DecryptedDocument({ id: uuid(), name: 'Another important document' })
			const newDocWithMeta = await sdk.document.withEncryptionMetadataUnlinked(newDoc, {
				delegates: { [otherHcp.id]: AccessLevel.Read },
			})
			createdNewDocument = await sdk.document.createDocument(newDocWithMeta)
		}
		return { otherSdk, createdNewDocument }
	},
	'4_share_data block 8 (BACA)': async () => ({}),
	'4_share_data block 9 (TUNI)': async (sdk) => {
		if (!createdPatient && sdk) {
			const newPatient = new DecryptedPatient({ id: uuid(), firstName: 'Edmond', lastName: 'Dantes' })
			const patientWithMetadata = await sdk.patient.withEncryptionMetadata(newPatient)
			createdPatient = await sdk.patient.createPatient(patientWithMetadata)
		}
		return { createdPatient }
	},
	'4_share_data block 10 (GAZA)': async (sdk) => {
		if (!createdUser && sdk) {
			if (!createdPatient) {
				await preTest['4_share_data block 9 (TUNI)'](sdk)
			}
			login = `edmond.dantes.${uuid().substring(0, 6)}@icure.com`
			const patientUser = new User({
				id: uuid(),
				patientId: createdPatient.id,
				login: login,
				email: login,
			})
			createdUser = await sdk.user.createUser(patientUser)
		}
		return { createdUser }
	},
	'4_share_data block 11 (LUDI)': async (sdk) => {
		if (!login && sdk) {
			await preTest['4_share_data block 10 (GAZA)'](sdk)
		}
		if (!loginToken && sdk) {
			loginToken = await sdk.user.getToken(createdUser.id, 'login')
		}
		return { CARDINAL_URL, login, loginToken }
	},
	'4_share_data block 12 (BOKI)': async (sdk) => {
		if (!createdPatient && sdk) {
			await preTest['4_share_data block 9 (TUNI)'](sdk)
		}
		return { createdPatient }
	},
	'4_share_data block 13 (LIHA)': async (sdk) => {
		if (!login && sdk) {
			await preTest['4_share_data block 10 (GAZA)'](sdk)
		}
		if (!loginToken && sdk) {
			loginToken = await sdk.user.getToken(createdUser.id, 'login')
		}
		return { CARDINAL_URL, login, loginToken }
	},
	'4_share_data block 14 (FEHI)': async (sdk) => {
		if (!patient && sdk) {
			if (!createdPatient) {
				await preTest['4_share_data block 9 (TUNI)'](sdk)
			}
			patient = await sdk.patient.shareWith(createdPatient.id, createdPatient, {
				options: new PatientShareOptions({
					shareSecretIds: new SecretIdShareOptions.AllAvailable({ requireAtLeastOne: true }),
					shareEncryptionKey: ShareMetadataBehaviour.IfAvailable,
					requestedPermissions: RequestedPermission.MaxWrite,
				}),
			})
		}
		return { patient }
	},
	'4_share_data block 15 (XALO)': async (sdk) => {
		if (!patientSdk && sdk) {
			await preTest['4_share_data block 13 (LIHA)'](sdk)
			patientSdk = await CardinalSdk.initialize(
				undefined,
				CARDINAL_URL,
				new AuthenticationMethod.UsingCredentials.UsernamePassword(login, loginToken),
				StorageFacade.usingFileSystem('../scratch/storage'),
			)
		}
		if (!createdHealthElement && sdk) {
			if (!patient) {
				await preTest['4_share_data block 14 (FEHI)'](sdk)
			}
			const he = new DecryptedHealthElement({ id: uuid(), descr: 'This is some medical context' })
			const heWithMeta = await sdk.healthElement.withEncryptionMetadata(he, patient)
			createdHealthElement = await sdk.healthElement.createHealthElement(heWithMeta)
		}
		return { patientSdk, createdHealthElement }
	},
	'4_share_data block 16 (DUCO)': async (sdk) => {
		if (!patient && sdk) {
			await preTest['4_share_data block 14 (FEHI)'](sdk)
		}
		if (!createdHealthElement && sdk) {
			await preTest['4_share_data block 15 (XALO)'](sdk)
		}
		return { patient, createdHealthElement }
	},
	'4_share_data block 17 (KUFA)': async (sdk) => {
		if (!patientSdk && sdk) {
			await preTest['4_share_data block 15 (XALO)'](sdk)
		}
		if (!createdHealthElement && sdk) {
			await preTest['4_share_data block 15 (XALO)'](sdk)
		}
		return { patientSdk, createdHealthElement }
	},
	'4_share_data block 18 (XEFE)': async (sdk) => {
		if (!patient && sdk) {
			await preTest['4_share_data block 14 (FEHI)'](sdk)
		}
		return { patient }
	},
	'4_share_data block 19 (NUZA)': async (sdk) => {
		if (!patientSdk && sdk) {
			await preTest['4_share_data block 15 (XALO)'](sdk)
		}
		if (!newCreatedHealthElement && sdk) {
			if (!patient) {
				await preTest['4_share_data block 14 (FEHI)'](sdk)
			}
			const newHe = new DecryptedHealthElement({ id: uuid(), descr: 'This is some other medical context' })
			const newHeWithMeta = await sdk.healthElement.withEncryptionMetadata(newHe, patient, {
				delegates: { [patient.id]: AccessLevel.Write },
			})
			newCreatedHealthElement = await sdk.healthElement.createHealthElement(newHeWithMeta)
		}
		return { patientSdk, newCreatedHealthElement }
	},
}

// ── postTest ───────────────────────────────────────────────────────────

export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
	'4_share_data block 1 (WITE)': async (_sdk: CardinalSdk, _username: any, _otherPassword: any, s: any, h: any) => {
		if (s) otherSdk = s
		if (h) otherHcp = h
	},
	'4_share_data block 2 (ZESO)': async (_sdk: CardinalSdk, d: any) => {
		if (d) oldDocument = d
	},
	'4_share_data block 3 (KIXO)': async () => {},
	'4_share_data block 4 (VEKO)': async (_sdk: CardinalSdk, d: any) => {
		if (d) updatedDocument = d
	},
	'4_share_data block 5 (BUNA)': async () => {},
	'4_share_data block 6 (GEJU)': async (_sdk: CardinalSdk, _newDocument: any, _newDocumentWithMetadata: any, d: any) => {
		if (d) createdNewDocument = d
	},
	'4_share_data block 7 (HAJI)': async () => {},
	'4_share_data block 8 (BACA)': async (_sdk: CardinalSdk, _newPatient: any, _patientWithMetadata: any, p: any) => {
		if (p) createdPatient = p
	},
	'4_share_data block 9 (TUNI)': async (_sdk: CardinalSdk, l: any, _patientUser: any, u: any) => {
		if (l) login = l
		if (u) createdUser = u
	},
	'4_share_data block 10 (GAZA)': async (_sdk: CardinalSdk, t: any) => {
		if (t) loginToken = t
	},
	'4_share_data block 11 (LUDI)': async () => {},
	'4_share_data block 12 (BOKI)': async (_sdk: CardinalSdk, p: any) => {
		if (p) patient = p
	},
	'4_share_data block 13 (LIHA)': async (_sdk: CardinalSdk, s: any) => {
		if (s) patientSdk = s
	},
	'4_share_data block 14 (FEHI)': async (_sdk: CardinalSdk, _healthElement: any, _healthElementWithMetadata: any, h: any) => {
		if (h) createdHealthElement = h
	},
	'4_share_data block 15 (XALO)': async () => {},
	'4_share_data block 16 (DUCO)': async () => {},
	'4_share_data block 17 (KUFA)': async () => {},
	'4_share_data block 18 (XEFE)': async (_sdk: CardinalSdk, _newHealthElement: any, _newHealthElementWithMetadata: any, h: any) => {
		if (h) newCreatedHealthElement = h
	},
	'4_share_data block 19 (NUZA)': async () => {},
}