import { initLocalStorage, output } from '../../../utils/index.mjs'
import { initEHRLiteApi } from '../../utils/index.mjs'
import 'isomorphic-fetch'
import { expect } from 'chai'
import { ContactPoint, Location, Patient, User, UserFilter } from '@icure/ehr-lite-sdk'
import { ContactPointTelecomTypeEnum } from '@icure/ehr-lite-sdk/models/enums/ContactPointTelecomType.enum.js'
import { LocationAddressTypeEnum } from '@icure/ehr-lite-sdk/models/enums/LocationAddressType.enum.js'

initLocalStorage()

const api = await initEHRLiteApi(true)

//tech-doc: Create a user
//4 random characters to guarantee login uniqueness
const uniqueId = Math.random().toString(36).substring(4)

const userToCreate = new User({
  login: `john${uniqueId}`,
  email: `john${uniqueId}@hospital.care`,
  passwordHash: 'correct horse battery staple',
})

const createdUser = await api.userApi.createOrModify(userToCreate)

//tech-doc: STOP HERE
output({ createdUser, userToCreate })

expect(createdUser.id).to.be.a('string')
expect(createdUser.login).to.equal(`john${uniqueId}`)
expect(createdUser.email).to.equal(`john${uniqueId}@hospital.care`)
expect(createdUser.passwordHash).to.not.equal('correct horse battery staple')

//tech-doc: Create a token
const token = await api.userApi.createToken(createdUser.id, 3600)
//tech-doc: STOP HERE
output({ token })

//tech-doc: Create a patient user
const loggedUser = await api.userApi.getLogged()
const loggedPractitioner = await api.practitionerApi.get(loggedUser.healthcarePartyId)

if (
  !loggedPractitioner.addresses.find((a) =>
    a.telecoms.some((t) => t.system === ContactPointTelecomTypeEnum.EMAIL && !!t.value),
  )
) {
  //An email address is required for the healthcare professional to send the invitation
  loggedPractitioner.addresses.push(
    new Location({
      telecoms: [
        new ContactPoint({
          system: ContactPointTelecomTypeEnum.EMAIL,
          value: `hcp${uniqueId}@hospital.care`,
        }),
      ],
    }),
  )
}

const patientToCreate = new Patient({
  firstName: 'Argan',
  lastName: 'Poquelin',
  addresses: [
    new Location({
      addressType: LocationAddressTypeEnum.HOME,
      telecoms: [
        new ContactPoint({
          system: ContactPointTelecomTypeEnum.EMAIL,
          value: `argan${uniqueId}@moliere.fr`,
        }),
      ],
    }),
  ],
  dateOfBirth: 19730210,
  ssin: '1973021014722',
})
const createdPatient = await api.patientApi.createOrModify(patientToCreate)

const createdPatientUser = await api.userApi.createAndInviteFor(createdPatient)

//tech-doc: STOP HERE
output({ createdPatient, createdPatientUser })

expect(createdPatientUser.id).to.be.a('string')
expect(createdPatientUser.patientId).to.be.equal(createdPatient.id)
expect(createdPatientUser.login).to.equal(`argan${uniqueId}@moliere.fr`)
expect(createdPatientUser.email).to.equal(`argan${uniqueId}@moliere.fr`)

//tech-doc: Load a user
const loadedUser = await api.userApi.get(createdUser.id)

//tech-doc: STOP HERE
output({ loadedUser })

expect(loadedUser.id).to.be.equal(createdUser.id)
expect(loadedUser.login).to.equal(`john${uniqueId}`)
expect(loadedUser.email).to.equal(`john${uniqueId}@hospital.care`)

//tech-doc: Load a user by email
const loadedUserByEmail = await api.userApi.getByEmail(createdUser.email)

//tech-doc: STOP HERE
output({ loadedUserByEmail })

expect(loadedUserByEmail.id).to.be.equal(createdUser.id)
expect(loadedUserByEmail.login).to.equal(`john${uniqueId}`)
expect(loadedUserByEmail.email).to.equal(`john${uniqueId}@hospital.care`)

//tech-doc: Filter users
const users = await api.userApi.filterBy(
  await new UserFilter(api).byPatientId(createdPatient.id).build(),
)

//tech-doc: STOP HERE
output({ users })

expect(users.rows.length).to.be.equal(1)
expect(users.rows[0].id).to.be.equal(createdPatientUser.id)

//tech-doc: Update a user
const userToModify = await api.userApi.get(createdUser.id)
const modifiedUser = await api.userApi.createOrModify(
  new User({ ...userToModify, passwordHash: 'wrong horse battery staple' }),
)

//tech-doc: STOP HERE
output({ modifiedUser })

expect(modifiedUser.id).to.be.equal(createdUser.id)
expect(modifiedUser.login).to.equal(`john${uniqueId}`)
expect(modifiedUser.passwordHash).to.not.equal('wrong horse battery staple')

//tech-doc: Delete a user
const deletedUserId = await api.userApi.delete(createdUser.id)

//tech-doc: STOP HERE
output({ deletedUserId })
