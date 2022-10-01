import "isomorphic-fetch";
import {
	CodingReference, Content,
	DataSample,
	HealthcareElement,
	medTechApi,
} from '@icure/medical-device-sdk'
import { webcrypto } from "crypto";
import { hex2ua} from "@icure/api";
import { LocalStorage } from 'node-localstorage';
import { host, password, patientId, privKey, userName } from "../../utils/index.mjs";
import os from "os";
import {expect} from 'chai';

const tmp = os.tmpdir();
(global as any).localStorage = new LocalStorage(tmp, 5 * 1024**3);
(global as any).Storage = "";

const api = await medTechApi()
	.withICureBasePath(host)
	.withUserName(userName)
	.withPassword(password)
	.withCrypto(webcrypto as any)
	.build()

const user = await api.userApi.getLoggedUser()
await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
	user.healthcarePartyId ?? user.patientId ?? user.deviceId,
	hex2ua(privKey)
);

const patient = await api.patientApi.getPatient(patientId)

//tech-doc: doctor can create DS and HE
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
expect(!!healthcareElement).to.eq(true); //skip
expect(healthcareElement.description).to.eq('My diagnosis is that the patient has Hay Fever'); //skip
const dataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
	patient.id,
	new DataSample({
		content: { 'en': new Content({
				stringValue: 'The patient has fatigue'
			})},
		codes: new Set([
			new CodingReference({
				id: 'SNOMEDCT|84229001|20020131',
				type: 'SNOMEDCT',
				code: '84229001',
				version: '20020131'
			})
		]),
		healthcareElementIds: new Set([healthcareElement.id])
	})
)

//tech-doc: STOP HERE
expect(!!dataSample).to.eq(true); //skip