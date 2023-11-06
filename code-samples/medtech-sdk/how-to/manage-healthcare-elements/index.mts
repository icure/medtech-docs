import 'isomorphic-fetch'
import {
  CodingReference,
  HealthcareElement,
  HealthcareElementFilter,
  Patient,
} from '@icure/medical-device-sdk'
import {
  patientId,
  initLocalStorage,
  initMedTechApi,
  initPatientMedTechApi,
  output,
} from '../../../utils/index.mjs'
import { expect } from 'chai'
import { Condition } from '@icure/ehr-lite-sdk'

initLocalStorage()

const api = await initMedTechApi(true)
const user = await api.userApi.getLoggedUser()

const patientApi = await initPatientMedTechApi(true)
const tmpPatient = await patientApi.patientApi.getPatient(patientId)
await patientApi.patientApi.giveAccessTo(tmpPatient, user.healthcarePartyId)

const patient = await api.patientApi.getPatient(patientId)

//tech-doc: create a HE as data owner
const newHealthcareElement = new HealthcareElement({
  description: 'The patient has been diagnosed Pararibulitis',
  codes: new Set([
    new CodingReference({
      id: 'SNOMEDCT|617|20020131',
      type: 'SNOMEDCT',
      code: '617',
      version: '20020131',
    }),
  ]),
  openingDate: new Date('2019-10-12').getTime(),
})

const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  newHealthcareElement,
  patient.id,
)
//tech-doc: STOP HERE
output({ newHealthcareElement, healthcareElement })

expect(!!healthcareElement).to.eq(true)
expect(healthcareElement.description).to.eq('The patient has been diagnosed Pararibulitis')
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
      version: '20020131',
    }),
  ]),
  openingDate: new Date('2019-10-12').getTime(),
})

const healthcareElement2 = new HealthcareElement({
  description: 'The patient has also the flu',
  openingDate: new Date('2020-11-08').getTime(),
})

const newElements = await api.healthcareElementApi.createOrModifyHealthcareElements(
  [healthcareElement1, healthcareElement2],
  patient.id,
)
//tech-doc: STOP HERE
output({ healthcareElement1, healthcareElement2, newElements })

expect(!!newElements).to.eq(true)
expect(newElements.length).to.eq(2)

//tech-doc: create multiple related HEs as data owner
const startHealthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'The patient has been diagnosed Pararibulitis',
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

const followUpHealthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'The patient recovered',
    openingDate: new Date('2020-11-08').getTime(),
    healthcareElementId: startHealthcareElement.healthcareElementId,
  }),
  patient.id,
)
//tech-doc: STOP HERE
output({ startHealthcareElement, followUpHealthcareElement })

expect(!!startHealthcareElement).to.eq(true)
expect(startHealthcareElement.description).to.eq('The patient has been diagnosed Pararibulitis')
expect(!!followUpHealthcareElement).to.eq(true)
expect(followUpHealthcareElement.description).to.eq('The patient recovered')

//tech-doc: HE sharing with data owner
const sharedHealthcareElement = await api.healthcareElementApi.giveAccessTo(
  healthcareElement,
  patient.id,
)
//tech-doc: STOP HERE
output({ sharedHealthcareElement })

expect(!!sharedHealthcareElement).to.eq(true)
expect(sharedHealthcareElement.id).to.eq(healthcareElement.id)
await patientApi.cryptoApi.forceReload()
const retrievedHE = await patientApi.healthcareElementApi.getHealthcareElement(healthcareElement.id)
expect(retrievedHE.id).to.eq(healthcareElement.id)

//tech-doc: retrieve a HE as data owner
const retrievedHealthcareElement = await api.healthcareElementApi.getHealthcareElement(
  healthcareElement.id,
)
//tech-doc: STOP HERE
output({ retrievedHealthcareElement })

expect(retrievedHealthcareElement.id).to.eq(healthcareElement.id)

//tech-doc: modify a HE as data owner
const yetAnotherHealthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'To modify, I must create',
  }),
  patient.id,
)

const modifiedHealthcareElement = new HealthcareElement({
  ...yetAnotherHealthcareElement,
  description: 'I can change and I can add',
  openingDate: new Date('2019-10-12').getTime(),
})

const modificationResult = await api.healthcareElementApi.createOrModifyHealthcareElement(
  modifiedHealthcareElement,
  patient.id,
)
//tech-doc: STOP HERE
output({ yetAnotherHealthcareElement, modifiedHealthcareElement, modificationResult })
expect(modificationResult.id).to.eq(yetAnotherHealthcareElement.id)
expect(modificationResult.description).to.eq('I can change and I can add')
expect(modificationResult.openingDate).to.eq(new Date('2019-10-12').getTime())

const existingPatient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    note: 'Winter is coming',
  }),
)

await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'To modify, I must create',
  }),
  existingPatient.id,
)

for (let i = 0; i < 10; i++) {
  await api.healthcareElementApi.createOrModifyHealthcareElement(
    new HealthcareElement({
      description: `Healthcare Element ${i}`,
      openingDate: new Date('2019-10-12').getTime(),
    }),
    patient.id,
  )
}

//tech-doc: create HE filter
const healthcareElementFilter = await new HealthcareElementFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .forPatients([patient])
  .build()
//tech-doc: STOP HERE
output({ healthcareElementFilter })

//tech-doc: use HE filter method
const healthcareElementsFirstPage = await api.healthcareElementApi.filterHealthcareElement(
  healthcareElementFilter,
  undefined,
  10,
)
//tech-doc: STOP HERE
output({ healthcareElementsFirstPage })

//tech-doc: use HE filter method second page
const healthcareElementsSecondPage = await api.healthcareElementApi.filterHealthcareElement(
  healthcareElementFilter,
  healthcareElementsFirstPage.nextKeyPair.startKeyDocId,
  10,
)
//tech-doc: STOP HERE
output({ healthcareElementsSecondPage })

expect(healthcareElementsSecondPage).not.to.be.undefined

//tech-doc: use HE match method
const healthcareElementsIdList = await api.healthcareElementApi.matchHealthcareElement(
  healthcareElementFilter,
)
//tech-doc: STOP HERE
output({ healthcareElementsIdList })

expect(healthcareElementsIdList).not.to.be.undefined

//tech-doc: use by patient method
const healthcareElementsForPatient = await api.healthcareElementApi.getHealthcareElementsForPatient(
  existingPatient,
)
//tech-doc: STOP HERE
output({ healthcareElementsForPatient })

expect(healthcareElementsForPatient).not.to.be.undefined

//tech-doc: delete a HE as data owner
const healthcareElementToDelete = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'I am doomed',
  }),
  patient.id,
)

const deletedHealthcareElement = await api.healthcareElementApi.deleteHealthcareElement(
  healthcareElementToDelete.id,
)
//tech-doc: STOP HERE
output({ healthcareElementToDelete, deletedHealthcareElement })

expect(deletedHealthcareElement).not.to.be.undefined
