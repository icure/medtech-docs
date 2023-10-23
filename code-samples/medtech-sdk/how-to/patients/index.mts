import { Patient, PatientFilter, PersonName } from '@icure/medical-device-sdk'
import 'isomorphic-fetch'
import * as console from 'console'

import { initLocalStorage, initMedTechApi, output } from '../../../utils/index.mjs'
import { expect } from 'chai'

initLocalStorage()

const api = await initMedTechApi(true)
const loggedUser = await api.userApi.getLoggedUser()

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
output({ createdPatient })

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
output({ updatedPatient })

console.log('Update: ', JSON.stringify(updatedPatient))

expect(updatedPatient.note).to.equal('Good news everyone!')
expect(updatedPatient.modified).to.not.be.undefined
expect(updatedPatient.modified).to.be.greaterThan(updatedPatient.created)
expect(updatedPatient.rev).to.not.equal(createdPatient.rev)

//tech-doc: get a patient
const patient = await api.patientApi.getPatient(updatedPatient.id!)
//tech-doc: STOP HERE
output({ patient })

console.log('Get: ', JSON.stringify(patient))

expect(JSON.stringify(patient)).to.equal(JSON.stringify(updatedPatient))

//tech-doc: get a list of patient
const filter = await new PatientFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId!)
  .dateOfBirthBetween(28000101, 29000101)
  .build()

const patients = await api.patientApi.filterPatients(filter)
//tech-doc: STOP HERE
output({ patients })

// console.log('Filter: ', JSON.stringify(patients))
expect(patients.rows).to.lengthOf.greaterThan(0)

// THIS SHOULD WORK, BUT DOESN'T (We need to merge the PR about RSocket)
//tech-doc: get a list of patient ids
const filterForMatch = await new PatientFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId!)

  .dateOfBirthBetween(28000101, 29000101)
  .build()

const patientIds = await api.patientApi.matchPatients(filterForMatch)
//tech-doc: STOP HERE
output({ patientIds })

console.log('Match', JSON.stringify(patientIds))

expect(patientIds).to.lengthOf.greaterThan(0)

//tech-doc: delete a patient
const deletedPatientId = await api.patientApi.deletePatient(patient.id!)
//tech-doc: STOP HERE
output({ deletedPatientId })

console.log('Delete: ', JSON.stringify(deletedPatientId))

expect(deletedPatientId).to.equal(patient.id)

//tech-doc: filter builder
const patientFilter = new PatientFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId!)
  .dateOfBirthBetween(28000101, 29000101)
  .build()
//tech-doc: STOP HERE
output({ patientFilter })
