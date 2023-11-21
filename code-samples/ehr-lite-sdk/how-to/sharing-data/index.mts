import 'isomorphic-fetch'
import { userName, userName2, patientUserName, initLocalStorage } from '../../../utils/index.mjs'
import { expect, use as chaiUse } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { initEHRLiteApi, initEHRLiteApi2, initPatientEHRLiteApi } from '../../utils/index.mjs'
import { Patient, Annotation, Condition, Observation, LocalComponent } from '@icure/ehr-lite-sdk'
import { mapOf } from '@icure/typescript-common'
import { CodingReference } from '@icure/ehr-lite-sdk'
chaiUse(chaiAsPromised)

initLocalStorage()
const hcp1Api = await initEHRLiteApi(true)
const hcp2Api = await initEHRLiteApi2(true)
const pApi = await initPatientEHRLiteApi(true)
const hcp1User = await hcp1Api.userApi.getLogged()
const hcp2User = await hcp2Api.userApi.getLogged()
const pUser = await pApi.userApi.getLogged()
expect(hcp1User.email).to.equal(userName)
expect(hcp2User.email).to.equal(userName2)
expect(pUser.email).to.equal(patientUserName)

//tech-doc: create a patient
// hcp1 creates a new patient
const note = 'Winter is coming'
const patient = await hcp1Api.patientApi.createOrModify(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    notes: [
      new Annotation({
        markdown: mapOf({ en: note }),
      }),
    ],
  }),
)
//tech-doc: end
expect((await hcp1Api.patientApi.get(patient.id)).notes[0].markdown.get('en')).to.equal(note)
expect(pApi.patientApi.get(patient.id)).to.be.rejected
//tech-doc: share a patient
// hcp1 shares the information of `patient` with hcp2
const updatedPatient = await hcp1Api.patientApi.giveAccessTo(
  patient,
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User),
)
// hcp1 shares the information of `patient` with p (a different patient that is also a data owner)
await hcp1Api.patientApi.giveAccessTo(updatedPatient, hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser))
//tech-doc: end
expect((await hcp1Api.patientApi.get(patient.id)).notes[0].markdown.get('en')).to.equal(note)
expect((await hcp2Api.patientApi.get(patient.id)).notes[0].markdown.get('en')).to.equal(note)
expect((await pApi.patientApi.get(patient.id)).notes[0].markdown.get('en')).to.equal(note)

//tech-doc: create a healthcare element
// hcp1 creates a new healthcare element
const description = 'The patient has been diagnosed Pararibulitis'
const condition = await hcp1Api.conditionApi.createOrModify(
  new Condition({
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
expect(
  //skip
  (await hcp1Api.conditionApi.get(condition.id)).description, //skip
).to.equal(description) //skip
await expect(hcp2Api.conditionApi.get(condition.id)).to.be.rejected //skip //skip
await expect(pApi.conditionApi.get(condition.id)).to.be.rejected //skip
// hcp1 shares `healthcareElement` with p
await hcp1Api.conditionApi.giveAccessTo(condition, hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser))
//tech-doc: end
console.log('Share HE with another HCP')

//tech-doc: share a healthcare element
// p retrieves `healthcareElement` and shares it with hcp2
await pApi.conditionApi.giveAccessTo(
  await pApi.conditionApi.get(condition.id),
  pApi.dataOwnerApi.getDataOwnerIdOf(hcp2User),
)
//tech-doc: end
expect((await hcp1Api.conditionApi.get(condition.id)).description).to.equal(description)
expect((await hcp2Api.conditionApi.get(condition.id)).description).to.equal(description)
expect((await pApi.conditionApi.get(condition.id)).description).to.equal(description)

//tech-doc: create and share a data sample
// p creates a data sample
const contentString = 'Hello world'
const observation = await pApi.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    tags: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    localContent: mapOf({ en: new LocalComponent({ stringValue: contentString }) }),
    openingDate: 20220929083400,
  }),
)
expect((await pApi.observationApi.get(observation.id)).localContent.get('en').stringValue).to.equal(
  //skip
  contentString, //skip
) //skip
expect(hcp2Api.observationApi.get(observation.id)).to.be.rejected //skip
// p shares the data sample with hcp1
await pApi.observationApi.giveAccessTo(observation, pApi.dataOwnerApi.getDataOwnerIdOf(hcp1User))
// hcp1 shares the data sample with hcp2
await hcp1Api.observationApi.giveAccessTo(
  await hcp1Api.observationApi.get(observation.id),
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User),
)
//tech-doc: end
expect(
  (await hcp1Api.observationApi.get(observation.id)).localContent.get('en').stringValue,
).to.equal(contentString)
expect(
  (await hcp2Api.observationApi.get(observation.id)).localContent.get('en').stringValue,
).to.equal(contentString)
expect((await pApi.observationApi.get(observation.id)).localContent.get('en').stringValue).to.equal(
  contentString,
)
