import { medTechApi } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import { host, userName, password } from '../../utils/index.mjs'
import 'isomorphic-fetch'
import { LocalStorage } from 'node-localstorage'
import * as os from 'os'
import { expect } from 'chai'

const tmp = os.tmpdir()
;(global as any).localStorage = new LocalStorage(tmp, 5 * 1024 * 1024 * 1024)
;(global as any).Storage = ''

const api = await medTechApi()
  .withICureBasePath(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .build()

//tech-doc: Create a user
import { User } from '@icure/medical-device-sdk'
import { ICureRegistrationEmail } from '@icure/medical-device-sdk'

const userToCreate = new User({
  login: 'john',
  email: 'john@hospital.care',
  passwordHash: 'correct horse battery staple',
})

const createdUser = await api.userApi.createOrModifyUser(userToCreate)

//tech-doc: STOP HERE
expect(createdUser.id).to.be.a('string')
expect(createdUser.login).to.equal('john')
expect(createdUser.email).to.equal('john@hospital.care')
expect(createdUser.passwordHash).to.not.equal('correct horse battery staple')

//tech-doc: Create a patient user
import { Patient, Address, Telecom } from '@icure/medical-device-sdk'

const loggedUser = await api.userApi.getLoggedUser()
const loggedHcp = await api.healthcareProfessionalApi.getHealthcareProfessional(loggedUser.healthcarePartyId)
const patientToCreate = new Patient({
  firstName: 'Argan',
  lastName: 'Poquelin',
  addresses: [new Address({ addressType: 'home', telecoms: [new Telecom({ telecomType: 'email', telecomNumber: 'argan@moliere.fr' })] })],
  dateOfBirth: 19730210,
  ssin: '1973021014722',
})
const createdPatient = await api.patientApi.createOrModifyPatient(patientToCreate)

const createdPatientUser = await api.userApi.createAndInviteUser(
  createdPatient,
  new ICureRegistrationEmail(loggedHcp, 'https://myapplication.care/login', 'My application', createdPatient),
)

//tech-doc: STOP HERE
expect(createdPatientUser.id).to.be.a('string')
expect(createdPatientUser.login).to.equal('john')
expect(createdUser.email).to.equal('john@hospital.care')
expect(createdUser.passwordHash).to.not.equal('correct horse battery staple')
