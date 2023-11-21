import 'isomorphic-fetch'
import * as console from 'console'

import { initLocalStorage, output } from '../../../utils/index.mjs'
import { expect } from 'chai'
import { initEHRLiteApi } from '../../utils/index.mjs'
import { HumanName, Patient, Annotation, PatientFilter } from '@icure/ehr-lite-sdk'
import { GenderEnum } from '@icure/ehr-lite-sdk/models/enums/Gender.enum.js'
import { HumanNameUseEnum } from '@icure/ehr-lite-sdk/models/enums/HumanNameUse.enum.js'
import { mapOf } from '@icure/typescript-common'

initLocalStorage()

const api = await initEHRLiteApi(true)
const loggedUser = await api.userApi.getLogged()

//tech-doc: create a patient
const createdPatient = await api.patientApi.createOrModify(
  new Patient({
    firstName: 'Hubert',
    lastName: 'Farnsworth',
    dateOfBirth: 28410409,
    birthSex: GenderEnum.MALE,
    gender: GenderEnum.MALE,
    profession: 'CEO/Owner of Planet Express, Lecturer at Mars University',
    names: [
      new HumanName({
        given: ['Hubert', 'J'],
        family: 'Farnsworth',
        use: HumanNameUseEnum.OFFICIAL,
      }),
      new HumanName({
        given: ['Professor'],
        use: HumanNameUseEnum.NICKNAME,
      }),
    ],
    nationality: 'American',
  }),
)
//tech-doc: STOP HERE
output({ createdPatient })

//tech-doc: update a patient
const updatedPatient = await api.patientApi.createOrModify(
  new Patient({
    ...createdPatient,
    // highlight-start
    modified: undefined,
    notes: [
      new Annotation({
        markdown: mapOf({ en: 'Good news everyone!' }),
      }),
    ],
    // highlight-end
  }),
)
//tech-doc: STOP HERE
output({ updatedPatient })

expect(updatedPatient.notes[0].markdown.get('en')).to.equal('Good news everyone!')
expect(updatedPatient.modified).to.not.be.undefined
expect(updatedPatient.modified).to.be.greaterThan(updatedPatient.created)
expect(updatedPatient.rev).to.not.equal(createdPatient.rev)

//tech-doc: get a patient
const patient = await api.patientApi.get(updatedPatient.id!)
//tech-doc: STOP HERE
output({ patient })

console.log('Get: ', JSON.stringify(patient))

expect(JSON.stringify(patient)).to.equal(JSON.stringify(updatedPatient))

//tech-doc: get a list of patient
const filter = await new PatientFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId!)
  .dateOfBirthBetween(28000101, 29000101)
  .build()

const patients = await api.patientApi.filterBy(filter)
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

const patientIds = await api.patientApi.matchBy(filterForMatch)
//tech-doc: STOP HERE
output({ patientIds })

console.log('Match', JSON.stringify(patientIds))

expect(patientIds).to.lengthOf.greaterThan(0)

//tech-doc: delete a patient
const deletedPatientId = await api.patientApi.delete(patient.id!)
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
