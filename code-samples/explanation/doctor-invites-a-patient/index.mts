import 'isomorphic-fetch'
import {
  ICureRegistrationEmail,
  Patient,
  Address,
  Telecom,
  medTechApi,
} from '@icure/medical-device-sdk'
import { hex2ua } from '@icure/api'
import {
  host,
  initLocalStorage,
  msgGtwUrl,
  output,
  password,
  privKey,
  specId,
  userName,
} from '../../utils/index.mjs'
import { expect } from 'chai'
import { v4 as uuid } from 'uuid'
import { webcrypto } from 'crypto'

initLocalStorage()

const api = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .build()

const user = await api.userApi.getLoggedUser()
await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  user.healthcarePartyId ?? user.patientId ?? user.deviceId,
  hex2ua(privKey),
)
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
