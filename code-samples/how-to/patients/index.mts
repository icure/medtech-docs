import { Patient, PatientFilter, PersonName } from '@icure/medical-device-sdk'
import { hex2ua } from '@icure/api'
import 'isomorphic-fetch'
import * as console from 'console'

import { initLocalStorage, initMedTechApi, privKey } from '../../utils/index.mjs'
import { expect } from 'chai'

initLocalStorage()

const api = await initMedTechApi()

const loggedUser = await api.userApi.getLoggedUser()
await api!.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  loggedUser.healthcarePartyId!,
  hex2ua(privKey),
)

//tech-doc: create a patient
const createdPatient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Hubert',
    lastName: 'Farnsworth',
    dateOfBirth: 28410409,
    birthSex: 'male',
    gender: 'male',
    profession: 'CEO/Owner of Planet Express, Lecturer at Mars University',
    names: [
      new PersonName({
        firstNames: ['Hubert', 'J'],
        lastName: 'Farnsworth',
        use: 'official',
      }),
      new PersonName({
        firstNames: ['Professor'],
        use: 'nickname',
      }),
    ],
    nationality: 'American',
  }),
)
//tech-doc: STOP HERE

console.log('Create: ', JSON.stringify(createdPatient))

//tech-doc: update a patient
const updatedPatient = await api.patientApi.createOrModifyPatient(
  new Patient({
    ...createdPatient,
    // highlight-start
    modified: undefined,
    note: 'Good news everyone!',
    // highlight-end
  }),
)
//tech-doc: STOP HERE

console.log('Update: ', JSON.stringify(updatedPatient))

expect(updatedPatient.note).to.equal('Good news everyone!')
expect(updatedPatient.modified).to.not.be.undefined
expect(updatedPatient.modified).to.be.greaterThan(updatedPatient.created)
expect(updatedPatient.rev).to.not.equal(createdPatient.rev)

//tech-doc: get a patient
const patient = await api.patientApi.getPatient(updatedPatient.id!)
//tech-doc: STOP HERE

console.log('Get: ', JSON.stringify(patient))

expect(JSON.stringify(patient)).to.equal(JSON.stringify(updatedPatient))

//tech-doc: get a list of patient
const filter = await new PatientFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)

  .dateOfBirthBetween(28000101, 29000101)
  .build()

const patients = await api.patientApi.filterPatients(filter)
//tech-doc: STOP HERE

// console.log('Filter: ', JSON.stringify(patients))

expect(patients.rows).to.lengthOf.greaterThan(0)

// THIS SHOULD WORK, BUT DOESN'T (We need to merge the PR about RSocket)
//tech-doc: get a list of patient ids
const filterForMatch = await new PatientFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)

  .dateOfBirthBetween(28000101, 29000101)
  .build()

const patientIds = await api.patientApi.matchPatients(filterForMatch)
//tech-doc: STOP HERE

console.log('Match', JSON.stringify(patientIds))

expect(patientIds).to.lengthOf.greaterThan(0)

//tech-doc: delete a patient
const deletedPatient = await api.patientApi.deletePatient(patient.id!)
//tech-doc: STOP HERE

console.log('Delete: ', JSON.stringify(deletedPatient))

expect(deletedPatient).to.equal(patient.id)

//tech-doc: filter builder
new PatientFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)

  .dateOfBirthBetween(28000101, 29000101)
  .build()
