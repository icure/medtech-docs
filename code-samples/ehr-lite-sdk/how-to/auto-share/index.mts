import 'isomorphic-fetch'
import { initEHRLiteApi2, initEHRLiteApi3, initPatientEHRLiteApi } from '../../utils/index.mjs'
import { userName2, patientUserName, userName3 } from '../../../utils/index.mjs'
import { expect, use as chaiUse } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import { LocalComponent, Observation, Patient } from '@icure/ehr-lite-sdk'
import { CodingReference, mapOf } from '@icure/typescript-common'
chaiUse(chaiAsPromised)

initLocalStorage()
const hcp1Api = await initEHRLiteApi3(true)
const pApi = await initPatientEHRLiteApi(true)
const hcp2Api = await initEHRLiteApi2(true)

const hcp1User = await hcp1Api.userApi.getLogged()
const hcp2User = await hcp2Api.userApi.getLogged()
const pUser = await pApi.userApi.getLogged()

expect(hcp1User.email).to.equal(userName3)
expect(hcp2User.email).to.equal(userName2)
expect(pUser.email).to.equal(patientUserName)

//tech-doc: auto share
const user = await hcp1Api.userApi.shareAllFutureDataWith(
  [hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User)],
  'medicalInformation',
)
//tech-doc: end
output({ user })
//tech-doc: sample creation
const ssin = 'AAAA.BBB.1942'
const patient = await hcp1Api.patientApi.createOrModify(
  new Patient({ firstName: 'John', lastName: 'Snow', ssin }),
)
const patient1 = await hcp1Api.patientApi.get(patient.id)
expect(patient1.ssin).to.equal(ssin) //skip
const patient2 = await hcp2Api.patientApi.get(patient.id)
expect(patient2.ssin).to.equal(ssin) //skip
// hcp2 can already access patient
const contentString = 'Hello world'
const observation = await hcp1Api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    tags: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    localContent: mapOf({ en: new LocalComponent({ stringValue: contentString }) }),
  }),
)
const observation1 = await hcp1Api.observationApi.get(observation.id)
const observation2 = await hcp2Api.observationApi.get(observation.id)
// hcp2 can already access dataSample
//tech-doc: end
expect(observation1.localContent.get('en').stringValue).to.equal(contentString)
expect(
  //skip
  observation2.localContent.get('en').stringValue,
).to.equal(contentString)

output({
  patient,
  dataSample: observation,
  patient1,
  patient2,
  dataSample1: observation1,
  dataSample2: observation2,
})

await hcp1Api.userApi.stopSharingDataWith(
  [hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User)],
  'medicalInformation',
)
const existingContent = 'Existing data sample'
const existingObservation = await hcp1Api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    tags: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    localContent: mapOf({ en: new LocalComponent({ stringValue: existingContent }) }),
  }),
)
expect(
  (await hcp1Api.observationApi.get(existingObservation.id)).localContent.get('en').stringValue,
).to.equal(existingContent)
expect(hcp2Api.observationApi.get(existingObservation.id)).to.be.rejected
await hcp1Api.userApi.shareAllFutureDataWith(
  [hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User)],
  'medicalInformation',
)

//tech-doc: not on modify
const contentNotOnModify = "Won't automatically update who the data is shared with on modify"
const observationNotOnModify = await hcp1Api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    ...existingObservation,
    localContent: mapOf({ en: new LocalComponent({ stringValue: contentNotOnModify }) }),
  }),
)
//tech-doc: end
output({ dataSampleNotOnModify: observationNotOnModify })
expect(
  (await hcp1Api.observationApi.get(observationNotOnModify.id)).localContent.get('en').stringValue,
).to.equal(contentNotOnModify)
expect(hcp2Api.observationApi.get(observationNotOnModify.id)).to.be.rejected

//tech-doc: one directional
const contentNotSharedBy2 = 'Hcp 2 is not sharing automatically with 1'
const observationNotSharedBy2 = await hcp2Api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    tags: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    localContent: mapOf({ en: new LocalComponent({ stringValue: contentNotSharedBy2 }) }),
  }),
)
//tech-doc: end
output({ dataSampleNotSharedBy2: observationNotSharedBy2 })

expect(hcp1Api.observationApi.get(observationNotSharedBy2.id)).to.be.rejected
expect(
  (await hcp2Api.observationApi.get(observationNotSharedBy2.id)).localContent.get('en').stringValue,
).to.equal(contentNotSharedBy2)

//tech-doc: stop auto share
const userWithoutShare = await hcp1Api.userApi.stopSharingDataWith(
  [hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User)],
  'medicalInformation',
)
//tech-doc: end
output({ userWithoutShare })

//tech-doc: sample no share
const contentNotSharedAnymore = 'Hcp 1 stopped sharing data automatically with 2'
const observationNotSharedAnymore = await hcp1Api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    tags: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    localContent: mapOf({ en: new LocalComponent({ stringValue: contentNotSharedAnymore }) }),
  }),
)
//tech-doc: end
output({ dataSampleNotSharedAnymore: observationNotSharedAnymore })

expect(
  (await hcp1Api.observationApi.get(observationNotSharedAnymore.id)).localContent.get('en')
    .stringValue,
).to.equal(contentNotSharedAnymore)
expect(hcp2Api.observationApi.get(observationNotSharedAnymore.id)).to.be.rejected

//tech-doc: share chain
await hcp1Api.userApi.shareAllFutureDataWith(
  [hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser)],
  'medicalInformation',
)
await pApi.userApi.shareAllFutureDataWith(
  [pApi.dataOwnerApi.getDataOwnerIdOf(hcp2User)],
  'medicalInformation',
)

const contentNoChaining =
  "Even if hcp1 shares with p and p shares with hcp2, hcp2 won't have automatic access to the data"
const observationNoChaining = await hcp1Api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    tags: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    localContent: mapOf({ en: new LocalComponent({ stringValue: contentNoChaining }) }),
  }),
)
//tech-doc: end
output({ dataSampleNoChaining: observationNoChaining })

expect(
  (await hcp1Api.observationApi.get(observationNoChaining.id)).localContent.get('en').stringValue,
).to.equal(contentNoChaining)
await expect(hcp2Api.observationApi.get(observationNoChaining.id)).to.be.rejected

await hcp1Api.userApi.stopSharingDataWith(
  [hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser)],
  'medicalInformation',
)
await pApi.userApi.stopSharingDataWith(
  [pApi.dataOwnerApi.getDataOwnerIdOf(hcp2User)],
  'medicalInformation',
)
