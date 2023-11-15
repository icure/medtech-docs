import { UserFilter } from '@icure/medical-device-sdk'
import { output, initLocalStorage, initMedTechApi } from '../../../utils/index.mjs'
import 'isomorphic-fetch'
import { expect } from 'chai'

initLocalStorage()

const api = await initMedTechApi(true)

//tech-doc: Create a user
import { User } from '@icure/medical-device-sdk'

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
import { Patient, Address, Telecom } from '@icure/medical-device-sdk'

const loggedUser = await api.userApi.getLogged()
const loggedHcp = await api.healthcareProfessionalApi.get(loggedUser.healthcarePartyId)

if (
  !loggedHcp.addresses.find((a) =>
    a.telecoms.some((t) => t.telecomType === 'email' && !!t.telecomNumber),
  )
) {
  //An email address is required for the healthcare professional to send the invitation
  loggedHcp.addresses.push(
    new Address({
      telecoms: [
        new Telecom({
          telecomType: 'email',
          telecomNumber: `hcp${uniqueId}@hospital.care`,
        }),
      ],
    }),
  )
}

const patientToCreate = new Patient({
  firstName: 'Argan',
  lastName: 'Poquelin',
  addresses: [
    new Address({
      addressType: 'home',
      telecoms: [
        new Telecom({
          telecomType: 'email',
          telecomNumber: `argan${uniqueId}@moliere.fr`,
        }),
      ],
    }),
  ],
  dateOfBirth: 19730210,
  ssin: '1973021014722',
})
const createdPatient = await api.patientApi.createOrModify(patientToCreate)

const createdPatientUser = await api.userApi.createAndInviteUser(createdPatient)

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
