import 'isomorphic-fetch'
import { initLocalStorage, output, patientId } from '../../../utils/index.mjs'
import { expect } from 'chai'
import { initEHRLiteApi, initPatientEHRLiteApi } from '../../utils/index.mjs'
import { Condition, ConditionFilter, Patient } from '@icure/ehr-lite-sdk'
import { CodingReference } from '@icure/medical-device-sdk'

initLocalStorage()

const api = await initEHRLiteApi(true)
const user = await api.userApi.getLogged()

const patientApi = await initPatientEHRLiteApi(true)
const tmpPatient = await patientApi.patientApi.get(patientId)
await patientApi.patientApi.giveAccessTo(tmpPatient, user.healthcarePartyId!)

const patient = await api.patientApi.get(patientId)

//tech-doc: create a HE as data owner
const newCondition = new Condition({
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

const condition = await api.conditionApi.createOrModify(newCondition, patient.id)
//tech-doc: STOP HERE
output({ newCondition, healthcareElement: condition })

expect(!!condition).to.eq(true)
expect(condition.description).to.eq('The patient has been diagnosed Pararibulitis')
try {
  await patientApi.conditionApi.get(condition.id)
  expect(true, 'promise should fail').eq(false)
} catch (e) {
  expect(!!e)
}

//tech-doc: create multiple HEs as data owner
const condition1 = new Condition({
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

const condition2 = new Condition({
  description: 'The patient has also the flu',
  openingDate: new Date('2020-11-08').getTime(),
})

const newConditions = await api.conditionApi.createOrModifyMany(
  [condition1, condition2],
  patient.id,
)
//tech-doc: STOP HERE
output({
  healthcareElement1: condition1,
  healthcareElement2: condition2,
  newElements: newConditions,
})

expect(!!newConditions).to.eq(true)
expect(newConditions.length).to.eq(2)

//tech-doc: create multiple related HEs as data owner
const startCondition = await api.conditionApi.createOrModify(
  new Condition({
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

const followUpCondition = await api.conditionApi.createOrModify(
  new Condition({
    description: 'The patient recovered',
    openingDate: new Date('2020-11-08').getTime(),
    healthcareElementId: startCondition.healthcareElementId,
  }),
  patient.id,
)
//tech-doc: STOP HERE
output({ startCondition, followUpCondition })

expect(!!startCondition).to.eq(true)
expect(startCondition.description).to.eq('The patient has been diagnosed Pararibulitis')
expect(!!followUpCondition).to.eq(true)
expect(followUpCondition.description).to.eq('The patient recovered')

//tech-doc: HE sharing with data owner
const sharedCondition = await api.conditionApi.giveAccessTo(condition, patient.id)
//tech-doc: STOP HERE
output({ sharedCondition })

expect(!!sharedCondition).to.eq(true)
expect(sharedCondition.id).to.eq(condition.id)
await patientApi.cryptoApi.forceReload()
const retrievedHE = await patientApi.conditionApi.get(condition.id)
expect(retrievedHE.id).to.eq(condition.id)

//tech-doc: retrieve a HE as data owner
const retrievedCondition = await api.conditionApi.get(condition.id)
//tech-doc: STOP HERE
output({ retrievedCondition })

expect(retrievedCondition.id).to.eq(condition.id)

//tech-doc: modify a HE as data owner
const yetAnotherCondition = await api.conditionApi.createOrModify(
  new Condition({
    description: 'To modify, I must create',
  }),
  patient.id,
)

const modifiedCondition = new Condition({
  ...yetAnotherCondition,
  description: 'I can change and I can add',
  openingDate: new Date('2019-10-12').getTime(),
})

const modificationResult = await api.conditionApi.createOrModify(modifiedCondition, patient.id)
console.log(modificationResult)
//tech-doc: STOP HERE
output({ yetAnotherCondition, modifiedCondition, modificationResult })
expect(modificationResult.id).to.eq(yetAnotherCondition.id)
expect(modificationResult.description).to.eq('I can change and I can add')
expect(modificationResult.openingDate).to.eq(new Date('2019-10-12').getTime())

const existingPatient = await api.patientApi.createOrModify(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
  }),
)

await api.conditionApi.createOrModify(
  new Condition({
    description: 'To modify, I must create',
  }),
  existingPatient.id,
)

//tech-doc: create HE filter
const conditionFilter = await new ConditionFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .forPatients([patient])
  .build()
//tech-doc: STOP HERE
output({ healthcareElementFilter: conditionFilter })

for (let i = 0; i < 10; i++) {
  await api.conditionApi.createOrModify(
    new Condition({
      description: `Condition ${i}`,
      openingDate: new Date('2019-10-12').getTime(),
    }),
    patient.id,
  )
}

//tech-doc: use HE filter method
const conditionsFirstPage = await api.conditionApi.filterBy(conditionFilter, undefined, 10)
//tech-doc: STOP HERE
output({ healthcareElementsFirstPage: conditionsFirstPage })

//tech-doc: use HE filter method second page
const conditionsSecondPage = await api.conditionApi.filterBy(
  conditionFilter,
  conditionsFirstPage.nextKeyPair.startKeyDocId,
  10,
)
//tech-doc: STOP HERE
output({ healthcareElementsSecondPage: conditionsSecondPage })

expect(conditionsSecondPage).not.to.be.undefined

//tech-doc: use HE match method
const conditionsIdList = await api.conditionApi.matchBy(conditionFilter)
//tech-doc: STOP HERE
output({ healthcareElementsIdList: conditionsIdList })

expect(conditionsIdList).not.to.be.undefined

//tech-doc: use by patient method
const conditionsForPatient = await api.conditionApi.getAllForPatient(existingPatient)
//tech-doc: STOP HERE
output({ healthcareElementsForPatient: conditionsForPatient })

expect(conditionsForPatient).not.to.be.undefined

//tech-doc: delete a HE as data owner
const conditionsToDelete = await api.conditionApi.createOrModify(
  new Condition({
    description: 'I am doomed',
  }),
  patient.id,
)

const deletedCondition = await api.conditionApi.delete(conditionsToDelete.id)
//tech-doc: STOP HERE
output({ healthcareElementToDelete: conditionsToDelete, deletedCondition })

expect(deletedCondition).not.to.be.undefined
