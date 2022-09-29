import "isomorphic-fetch";
import {
	CodingReference, Content,
	DataSample,
	DataSampleFilter,
	HealthcareElement,
	medTechApi,
	Patient
} from '@icure/medical-device-sdk'
import { webcrypto } from "crypto";
import {HealthElement, hex2ua, sleep} from "@icure/api";
import {tmpdir} from "os";
import {TextDecoder, TextEncoder} from "util";
import {LocalStorage} from 'node-localstorage';

;(global as any).localStorage = new LocalStorage(tmpdir(), 5 * 1024**3)
;(global as any).Storage = ''
;(global as any).TextDecoder = TextDecoder
;(global as any).TextEncoder = TextEncoder

const password = process.env.PASSWORD
const userName = process.env.USERNAME
const privKey = process.env.PRIV_KEY
const hcpId = process.env.HCP_ID
const patientId = process.env.PATIENT_ID
const host = 'https://kraken.icure.dev/rest/v1'

const api = await medTechApi()
	.withICureBasePath(host)
	.withUserName(userName)
	.withPassword(password)
	.withCrypto(webcrypto as any)
	.build()

await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
	hcpId,
	hex2ua(privKey)
);

const patient = await api.patientApi.getPatient(patientId)

const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
		new HealthcareElement({
			description: 'My diagnosis is that the patient has Hay Fever',
				codes: new Set([
					new CodingReference({
						id: 'SNOMEDCT|21719001|20020131',
						type: 'SNOMEDCT',
						code: '21719001',
						version: '20020131'
					})
				])
	}),
	patient.id
)

// await api.dataSampleApi.createOrModifyDataSampleFor(
// 	patient.id,
// 	new DataSample({
// 		content: { 'en': new Content({
// 				stringValue: 'The patient has fatigue'
// 			})},
// 		codes: new Set([
// 			new CodingReference({
// 				id: 'SNOMEDCT|84229001|20020131',
// 				type: 'SNOMEDCT',
// 				code: '84229001',
// 				version: '20020131'
// 			})
// 		]),
// 		healthcareElementIds: new Set([healthcareElement.id])
// 	})
// )

