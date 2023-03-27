import { DataSampleFilter, medTechApi, UserFilter } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import { host, userName, password, privKey, output } from '../../utils/index.mjs'
import 'isomorphic-fetch'
import { LocalStorage } from 'node-localstorage'
import * as os from 'os'
import { expect } from 'chai'

const tmp = os.tmpdir()
;(global as any).localStorage = new LocalStorage(tmp, 5 * 1024 * 1024 * 1024)
;(global as any).Storage = ''

const api = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withMsgGwSpecId('ic')
  .withMsgGwUrl('https://msg-gw.icure.dev')
  .withCrypto(webcrypto as any)
  .build()

const user = await api.userApi.getLoggedUser()
await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  user.healthcarePartyId ?? user.patientId ?? user.deviceId,
  hex2ua(privKey),
)

//tech-doc: Create a user
import { User } from '@icure/medical-device-sdk'
import { ICureRegistrationEmail } from '@icure/medical-device-sdk'

//4 random characters to guarantee login uniqueness
const uniqueId = Math.random().toString(36).substring(4)

const userToCreate = new User({
  login: `john+${uniqueId}`,
  email: `john+${uniqueId}@hospital.care`,
  passwordHash: 'correct horse battery staple',
})

const createdUser = await api.userApi.createOrModifyUser(userToCreate)

//tech-doc: STOP HERE
output({ createdUser })

expect(createdUser.id).to.be.a('string')
expect(createdUser.login).to.equal(`john+${uniqueId}`)
expect(createdUser.email).to.equal(`john+${uniqueId}@hospital.care`)
expect(createdUser.passwordHash).to.not.equal('correct horse battery staple')

//tech-doc: Create a patient user
import { Patient, Address, Telecom } from '@icure/medical-device-sdk'
import { hex2ua } from '@icure/api'

const loggedUser = await api.userApi.getLoggedUser()
const loggedHcp = await api.healthcareProfessionalApi.getHealthcareProfessional(
  loggedUser.healthcarePartyId,
)

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
          telecomNumber: `hcp+${uniqueId}@hospital.care`,
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
          telecomNumber: `argan+${uniqueId}@moliere.fr`,
        }),
      ],
    }),
  ],
  dateOfBirth: 19730210,
  ssin: '1973021014722',
})
const createdPatient = await api.patientApi.createOrModifyPatient(patientToCreate)

const createdPatientUser = await api.userApi.createAndInviteUser(
  createdPatient,
  new ICureRegistrationEmail(
    loggedHcp,
    'https://myapplication.care/login',
    'My application',
    createdPatient,
  ),
)

//tech-doc: STOP HERE
output({ createdPatient, createdPatientUser })

expect(createdPatientUser.id).to.be.a('string')
expect(createdPatientUser.patientId).to.be.equal(createdPatient.id)
expect(createdPatientUser.login).to.equal(`argan+${uniqueId}@moliere.fr`)
expect(createdPatientUser.email).to.equal(`argan+${uniqueId}@moliere.fr`)

//tech-doc: Load a user
const loadedUser = await api.userApi.getUser(createdUser.id)

//tech-doc: STOP HERE
output({ loadedUser })

expect(loadedUser.id).to.be.equal(createdUser.id)
expect(loadedUser.login).to.equal(`john+${uniqueId}`)
expect(loadedUser.email).to.equal(`john+${uniqueId}@hospital.care`)

//tech-doc: Load a user by email
const loadedUserByEmail = await api.userApi.getUserByEmail(createdUser.email)

//tech-doc: STOP HERE
output({ loadedUserByEmail })

expect(loadedUserByEmail.id).to.be.equal(createdUser.id)
expect(loadedUserByEmail.login).to.equal(`john+${uniqueId}`)
expect(loadedUserByEmail.email).to.equal(`john+${uniqueId}@hospital.care`)

//tech-doc: Filter users
const users = await api.userApi.filterUsers(
  await new UserFilter().byPatientId(createdPatient.id).build(),
)

//tech-doc: STOP HERE
output({ users })

expect(users.rows.length).to.be.equal(1)
expect(users.rows[0].id).to.be.equal(createdPatientUser.id)

//tech-doc: Update a user
const userToModify = await api.userApi.getUser(createdUser.id)
const modifiedUser = await api.userApi.createOrModifyUser(
  new User({ ...userToModify, passwordHash: 'wrong horse battery staple' }),
)

//tech-doc: STOP HERE
output({ modifiedUser })

expect(modifiedUser.id).to.be.equal(createdUser.id)
expect(modifiedUser.login).to.equal(`john+${uniqueId}`)
expect(modifiedUser.passwordHash).to.not.equal('wrong horse battery staple')

//tech-doc: Delete a user
const deletedUserId = await api.userApi.deleteUser(createdUser.id)

//tech-doc: STOP HERE
output({ deletedUserId })
