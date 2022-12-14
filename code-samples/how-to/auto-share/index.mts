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

//tech-doc: auto share
await hcp1Api.userApi.shareAllFutureDataWith('medicalInformation', [
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User),
])
//tech-doc: end
//tech-doc: sample creation
const note = 'Winter is coming'
const patient = await hcp1Api.patientApi.createOrModifyPatient(
  new Patient({ firstName: 'John', lastName: 'Snow', note }),
)
expect((await hcp1Api.patientApi.getPatient(patient.id)).note).to.equal(note) //skip
expect((await hcp2Api.patientApi.getPatient(patient.id)).note).to.equal(note) //skip
// hcp2 can already access patient
const contentString = 'Hello world'
const dataSample = await hcp1Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: contentString } },
  }),
)
expect(
  //skip
  (await hcp1Api.dataSampleApi.getDataSample(dataSample.id)).content['en'].stringValue, //skip
).to.equal(contentString) //skip
expect(
  //skip
  (await hcp2Api.dataSampleApi.getDataSample(dataSample.id)).content['en'].stringValue, //skip
).to.equal(contentString) //skip
// hcp2 can already access dataSample
//tech-doc: end

await hcp1Api.userApi.stopSharingDataWith('medicalInformation', [
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User),
])
const existingContent = 'Existing data sample'
const existingDataSample = await hcp1Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: existingContent } },
  }),
)
expect(
  (await hcp1Api.dataSampleApi.getDataSample(existingDataSample.id)).content['en'].stringValue,
).to.equal(existingContent)
expect(hcp2Api.dataSampleApi.getDataSample(existingDataSample.id)).to.be.rejected
await hcp1Api.userApi.shareAllFutureDataWith('medicalInformation', [
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User),
])

//tech-doc: not on modify
const contentNotOnModify = "Won't automatically update who the data is shared with on modify"
const dataSampleNotOnModify = await hcp1Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    ...existingDataSample,
    content: { en: { stringValue: contentNotOnModify } },
  }),
)
//tech-doc: end
expect(
  (await hcp1Api.dataSampleApi.getDataSample(dataSampleNotOnModify.id)).content['en'].stringValue,
).to.equal(contentNotOnModify)
expect(hcp2Api.dataSampleApi.getDataSample(dataSampleNotOnModify.id)).to.be.rejected

//tech-doc: one directional
const contentNotSharedBy2 = 'Hcp 2 is not sharing automatically with 1'
const dataSampleNotSharedBy2 = await hcp2Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: contentNotSharedBy2 } },
  }),
)
//tech-doc: end
expect(hcp1Api.dataSampleApi.getDataSample(dataSampleNotSharedBy2.id)).to.be.rejected
expect(
  (await hcp2Api.dataSampleApi.getDataSample(dataSampleNotSharedBy2.id)).content['en'].stringValue,
).to.equal(contentNotSharedBy2)

//tech-doc: stop auto share
await hcp1Api.userApi.stopSharingDataWith('medicalInformation', [
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User),
])
//tech-doc: end

//tech-doc: sample no share
const contentNotSharedAnymore = 'Hcp 1 stopped sharing data automatically with 2'
const dataSampleNotSharedAnymore = await hcp1Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: contentNotSharedAnymore } },
  }),
)
//tech-doc: end
expect(
  (await hcp1Api.dataSampleApi.getDataSample(dataSampleNotSharedAnymore.id)).content['en']
    .stringValue,
).to.equal(contentNotSharedAnymore)
expect(hcp2Api.dataSampleApi.getDataSample(dataSampleNotSharedAnymore.id)).to.be.rejected

//tech-doc: share chain
await hcp1Api.userApi.shareAllFutureDataWith('medicalInformation', [
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser),
])
await pApi.userApi.shareAllFutureDataWith('medicalInformation', [
  pApi.dataOwnerApi.getDataOwnerIdOf(hcp2User),
])

const contentNoChaining =
  "Even if hcp1 shares with p and p shares with hcp2, hcp2 won't have automatic access to the data"
const dataSampleNoChaining = await hcp1Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: contentNoChaining } },
  }),
)
//tech-doc: end
expect(
  (await hcp1Api.dataSampleApi.getDataSample(dataSampleNoChaining.id)).content['en'].stringValue,
).to.equal(contentNoChaining)
expect(
  (await pApi.dataSampleApi.getDataSample(dataSampleNoChaining.id)).content['en'].stringValue,
).to.equal(contentNoChaining)
expect(hcp2Api.dataSampleApi.getDataSample(dataSampleNoChaining.id)).to.be.rejected

await hcp1Api.userApi.stopSharingDataWith('medicalInformation', [
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser),
])
await pApi.userApi.stopSharingDataWith('medicalInformation', [
  pApi.dataOwnerApi.getDataOwnerIdOf(hcp2User),
])
