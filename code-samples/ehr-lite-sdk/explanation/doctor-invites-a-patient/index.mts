import 'isomorphic-fetch'
import { ICureRegistrationEmail, Patient, Address, Telecom } from '@icure/medical-device-sdk'
import { initLocalStorage, initMedTechApi, output } from '../../utils/index.mjs'
import { expect } from 'chai'
import { v4 as uuid } from 'uuid'

initLocalStorage()

const api = await initMedTechApi(true)

const user = await api.userApi.getLoggedUser()

const hcp = await api.healthcareProfessionalApi.getHealthcareProfessional(user.healthcarePartyId)
hcp.addresses = [
  new Address({
    addressType: 'home',
    description: 'London',
    telecoms: [
      new Telecom({
        telecomType: 'email',
        telecomNumber: 'test@example.com',
      }),
    ],
  }),
]

const patientEmail = `${uuid().substring(0, 8)}@icure.com`

const existingPatient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Marc',
    lastName: 'Specter',
    addresses: [
      new Address({
        addressType: 'home',
        description: 'London',
        telecoms: [
          new Telecom({
            telecomType: 'email',
            telecomNumber: patientEmail,
          }),
        ],
      }),
    ],
  }),
)
expect(!!existingPatient).to.eq(true) //skip

//tech-doc: doctor invites user
const messageFactory = new ICureRegistrationEmail(hcp, 'test', 'iCure', existingPatient)
const createdUser = await api.userApi.createAndInviteUser(existingPatient, messageFactory)
//tech-doc: STOP HERE
output({ createdUser })
expect(createdUser.patientId).to.eq(existingPatient.id)
