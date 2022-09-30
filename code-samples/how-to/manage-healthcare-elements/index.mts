import "isomorphic-fetch";
import {
  CodingReference,
  HealthcareElement, HealthcareElementFilter,
  medTechApi, Patient,
} from '@icure/medical-device-sdk'
import { webcrypto } from "crypto";
import { hex2ua} from "@icure/api";
import { LocalStorage } from 'node-localstorage';
import { host, password, patientId, privKey, userName, patientUserName, patientPassword, patientPrivKey } from "../../utils/index.mjs";
import os from "os";
import {expect} from 'chai';

const tmp = os.tmpdir();
(global as any).localStorage = new LocalStorage(tmp, 5 * 1024**3);
(global as any).Storage = "";

const patientApi = await medTechApi()
  .withICureBasePath(host)
  .withUserName(patientUserName)
  .withPassword(patientPassword)
  .withCrypto(webcrypto as any)
  .build()

const patientUser = await patientApi.userApi.getLoggedUser()
await patientApi.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  patientUser.healthcarePartyId ?? patientUser.patientId ?? patientUser.deviceId,
  hex2ua(patientPrivKey)
);

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

//tech-doc: create a HE as data owner
const newHE = new HealthcareElement({
  description: 'The patient has been diagnosed Pararibulitis',
  codes: new Set([
    new CodingReference({
      id: 'SNOMEDCT|617|20020131',
      type: 'SNOMEDCT',
      code: '617',
      version: '20020131'
    })
  ]),
  openingDate: new Date("2019-10-12").getTime()
})

const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  newHE,
  patient.id
)
//tech-doc: STOP HERE

expect(!!healthcareElement).to.eq(true);
expect(healthcareElement.description).to.eq('The patient has been diagnosed Pararibulitis');
try {
  await patientApi.healthcareElementApi.getHealthcareElement(healthcareElement.id)
  expect(true, 'promise should fail').eq(false)
} catch (e) {
  expect(!!e)
}

//tech-doc: create multiple HEs as data owner
const healthcareElement1 = new HealthcareElement({
  description: 'The patient has been diagnosed Pararibulitis',
  codes: new Set([
    new CodingReference({
      id: 'SNOMEDCT|617|20020131',
      type: 'SNOMEDCT',
      code: '617',
      version: '20020131'
    })
  ]),
  openingDate: new Date("2019-10-12").getTime()
})

const healthcareElement2 = new HealthcareElement({
  description: 'The patient recovered',
  openingDate: new Date("2020-11-08").getTime()
})

const newElements = await api.healthcareElementApi.createOrModifyHealthcareElements(
  [healthcareElement1, healthcareElement2],
  patient.id
)
//tech-doc: STOP HERE
expect(!!newElements).to.eq(true);
expect(newElements.length).to.eq(2);

//tech-doc: HE sharing with data owner
const sharedHealthcareElement = await api.healthcareElementApi.giveAccessTo(healthcareElement, patient.id)
//tech-doc: STOP HERE
expect(!!sharedHealthcareElement).to.eq(true)
expect(sharedHealthcareElement.id).to.eq(healthcareElement.id)
const retrievedHE = await patientApi.healthcareElementApi.getHealthcareElement(healthcareElement.id)
expect(retrievedHE.id).to.eq(healthcareElement.id)

//tech-doc: retrieve a HE as data owner
const healthcareElementToRetrieve = new HealthcareElement({
  description: 'To retrieve, I must create',
})

const createdHealthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  healthcareElementToRetrieve,
  patient.id
)

const retrievedHealthcareElement = await api.healthcareElementApi.getHealthcareElement(createdHealthcareElement.id)
//tech-doc: STOP HERE
expect(retrievedHealthcareElement.id).to.eq(createdHealthcareElement.id)

//tech-doc: modify a HE as data owner
const yetAnotherHealthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'To modify, I must create',
  }),
  patient.id
)

const modifiedHealthcareElement = {
  ...yetAnotherHealthcareElement,
  description: 'I can change and I can add',
  openingDate: new Date("2019-10-12").getTime()
}

const modificationResult = await api.healthcareElementApi.createOrModifyHealthcareElement(
  modifiedHealthcareElement,
  patient.id
)
//tech-doc: STOP HERE
expect(modificationResult.id).to.eq(yetAnotherHealthcareElement.id)
expect(modificationResult.description).to.eq('I can change and I can add')
expect(modificationResult.openingDate).to.eq(new Date("2019-10-12").getTime())

const existingPatient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    note: 'Winter is coming',
  })
)

await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'To modify, I must create',
  }),
  existingPatient.id
)

//tech-doc: create HE filter
const healthcareElementFilter = await new HealthcareElementFilter()
  .forDataOwner(user.healthcarePartyId)
  .forPatients(api.cryptoApi, [patient])
  .build()
//tech-doc: STOP HERE

//tech-doc: use HE filter method
const healthcareElementsFirstPage = await api.healthcareElementApi.filterHealthcareElement(
  healthcareElementFilter,
  undefined,
  10
)
//tech-doc: STOP HERE

//tech-doc: use HE filter method second page
const healthcareElementsSecondPage = await api.healthcareElementApi.filterHealthcareElement(
  healthcareElementFilter,
  healthcareElementsFirstPage.nextKeyPair.startKeyDocId,
  10
)
//tech-doc: STOP HERE

//tech-doc: use HE match method
const healthcareElementsIdList = await api.healthcareElementApi.matchHealthcareElement(healthcareElementFilter)
//tech-doc: STOP HERE

//tech-doc: use by patient method
const healthcareElementsForPatient = await api.healthcareElementApi.getHealthcareElementsForPatient(existingPatient)
//tech-doc: STOP HERE

//tech-doc: delete a HE as data owner
const healthcareElementToDelete = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'I am doomed',
  }),
  patient.id
)

const deletedHealthcareElement = await api.healthcareElementApi.deleteHealthcareElement(healthcareElementToDelete.id)
//tech-doc: STOP HERE
