import 'isomorphic-fetch'
import {
  userName,
  userName2,
  patientUserName,
  initLocalStorage,
  initMedTechApi,
  initMedTechApi2,
  initPatientMedTechApi,
} from '../../utils/index.mjs'
import { expect, use as chaiUse } from 'chai'
import { CodingReference, DataSample, HealthcareElement, Patient } from '@icure/medical-device-sdk'
import chaiAsPromised from 'chai-as-promised'
chaiUse(chaiAsPromised)

console.log('Initialising')
initLocalStorage()
const hcp1Api = await initMedTechApi(true)
const hcp2Api = await initMedTechApi2(true)
const pApi = await initPatientMedTechApi(true)
const hcp1User = await hcp1Api.userApi.getLoggedUser()
const hcp2User = await hcp2Api.userApi.getLoggedUser()
const pUser = await pApi.userApi.getLoggedUser()
expect(hcp1User.email).to.equal(userName)
expect(hcp2User.email).to.equal(userName2)
expect(pUser.email).to.equal(patientUserName)

console.log('Testing patient')
//tech-doc: create a patient
// hcp1 creates a new patient
const note = 'Winter is coming'
const patient = await hcp1Api.patientApi.createOrModifyPatient(
  new Patient({ firstName: 'John', lastName: 'Snow', note }),
)
//tech-doc: end
expect((await hcp1Api.patientApi.getPatient(patient.id)).note).to.equal(note)
expect((await hcp2Api.patientApi.getPatient(patient.id)).note).to.be.undefined
expect(pApi.patientApi.getPatient(patient.id)).to.be.rejected
//tech-doc: share a patient
// hcp1 shares the information of `patient` with hcp2
const updatedPatient = await hcp1Api.patientApi.giveAccessTo(
  patient,
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User),
)
// hcp1 shares the information of `patient` with p (a different patient that is also a data owner)
await hcp1Api.patientApi.giveAccessTo(updatedPatient, hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser))
//tech-doc: end
expect((await hcp1Api.patientApi.getPatient(patient.id)).note).to.equal(note)
expect((await hcp2Api.patientApi.getPatient(patient.id)).note).to.equal(note)
expect((await pApi.patientApi.getPatient(patient.id)).note).to.equal(note)

console.log('Testing healthcare element')
//tech-doc: create a healthcare element
// hcp1 creates a new healthcare element
const description = 'The patient has been diagnosed Pararibulitis'
const healthcareElement = await hcp1Api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: description,
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|617|20020131',
        type: 'SNOMEDCT',
        code: '617',
        version: '20020131',
      }),
    ]),
    openingDate: new Date('2019-10-12').getTime(),
  }),
  patient.id,
)
expect( //skip
  (await hcp1Api.healthcareElementApi.getHealthcareElement(healthcareElement.id)).description, //skip
).to.equal(description) //skip
expect((await hcp2Api.healthcareElementApi.getHealthcareElement(healthcareElement.id)).description) //skip
  .to.be.undefined //skip
expect(pApi.healthcareElementApi.getHealthcareElement(healthcareElement.id)).to.be.rejected //skip
// hcp1 shares `healthcareElement` with p
await hcp1Api.healthcareElementApi.giveAccessTo(
  healthcareElement,
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser),
)
//tech-doc: end
//tech-doc: share a healthcare element
// p retrieves `healthcareElement` and shares it with hcp2
await pApi.healthcareElementApi.giveAccessTo(
  await pApi.healthcareElementApi.getHealthcareElement(healthcareElement.id),
  pApi.dataOwnerApi.getDataOwnerIdOf(hcp2User),
)
//tech-doc: end
expect(
  (await hcp1Api.healthcareElementApi.getHealthcareElement(healthcareElement.id)).description,
).to.equal(description)
expect(
  (await hcp2Api.healthcareElementApi.getHealthcareElement(healthcareElement.id)).description,
).to.equal(description)
expect(
  (await pApi.healthcareElementApi.getHealthcareElement(healthcareElement.id)).description,
).to.equal(description)

console.log('Testing data sample')
//tech-doc: create and share a data sample
// p creates a data sample
const contentString = 'Hello world'
const dataSample = await pApi.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: contentString } },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
expect((await pApi.dataSampleApi.getDataSample(dataSample.id)).content['en'].stringValue).to.equal( //skip
  contentString, //skip
) //skip
expect(hcp1Api.dataSampleApi.getDataSample(dataSample.id)).to.be.rejected //skip
expect(hcp1Api.dataSampleApi.getDataSample(dataSample.id)).to.be.rejected //skip
// p shares the data sample with hcp1
await pApi.dataSampleApi.giveAccessTo(dataSample, pApi.dataOwnerApi.getDataOwnerIdOf(hcp1User))
// hcp1 shares the data sample with hcp2
await hcp1Api.dataSampleApi.giveAccessTo(
  await hcp1Api.dataSampleApi.getDataSample(dataSample.id),
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User),
)
//tech-doc: end
expect(
  (await hcp1Api.dataSampleApi.getDataSample(dataSample.id)).content['en'].stringValue,
).to.equal(contentString)
expect(
  (await hcp2Api.dataSampleApi.getDataSample(dataSample.id)).content['en'].stringValue,
).to.equal(contentString)
expect((await pApi.dataSampleApi.getDataSample(dataSample.id)).content['en'].stringValue).to.equal(
  contentString,
)
