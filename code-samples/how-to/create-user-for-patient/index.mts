import 'isomorphic-fetch'

import {
  authProcessId,
  host,
  initLocalStorage,
  initMedTechApi,
  msgGtwUrl,
  privKey,
  specId, userName,
} from '../../utils/index.mjs'
import { hex2ua, ua2hex } from '@icure/api'
import { assert, expect } from 'chai'
import { v4 as uuid } from 'uuid'
import {
  Address,
  AnonymousMedTechApiBuilder,
  CodingReference,
  DataSample,
  ICureRegistrationEmail,
  Patient,
  Telecom,
} from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import { NotificationTypeEnum } from '@icure/medical-device-sdk/src/models/Notification.js'
import axios, { Method } from 'axios'

initLocalStorage()

async function getEmail(email: string): Promise<any> {
  const emailOptions = {
    method: 'GET' as Method,
    url: `${msgGtwUrl}/${specId}/lastEmail/${email}`,
  }
  const { data: response } = await axios.request(emailOptions)
  return response
}

const api = await initMedTechApi()

const loggedUser = await api.userApi.getLoggedUser()
await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  loggedUser.healthcarePartyId,
  hex2ua(privKey),
)

const hcp = await api.healthcareProfessionalApi.getHealthcareProfessional(
  loggedUser.healthcarePartyId,
)

hcp.addresses = [
  new Address({
    addressType: 'home',
    description: 'London',
    telecoms: [
      new Telecom({
        telecomType: 'email',
        telecomNumber: userName,
      }),
    ],
  }),
]

const email = `${uuid().substring(0, 8)}@icure.com`
const patient = await api.patientApi.createOrModifyPatient(
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
            telecomNumber: email,
          }),
        ],
      }),
    ],
  }),
)
assert(!!patient)

const dataSample = api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: 'Hello world' } },
  }),
)
assert(!!dataSample)

//tech-doc: instantiate a message factory
const messageFactory = new ICureRegistrationEmail(
  hcp,
  'URL_WHERE_TO_LOGIN',
  'SOLUTION_NAME',
  patient,
)
//tech-doc: STOP HERE

//tech-doc: doctor invites user
await api.userApi.createAndInviteUser(patient, messageFactory, 3600)
//tech-doc: STOP HERE

const loginAndPassword = (await getEmail(email)).subject
const patientUsername = loginAndPassword.split('|')[0]
const patientToken = loginAndPassword.split('|')[1]

//tech-doc: user logs in
const anonymousMedTechApi = await new AnonymousMedTechApiBuilder()
  .withICureUrlPath(host)
  .withMsgGtwUrl(msgGtwUrl)
  .withMsgGtwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessId)
  .withAuthProcessBySmsId(authProcessId)
  .build()

const { publicKey, privateKey } = await anonymousMedTechApi.cryptoApi.RSA.generateKeyPair()
const publicKeyHex = ua2hex(await anonymousMedTechApi.cryptoApi.RSA.exportKey(publicKey, 'spki'))
const privateKeyHex = ua2hex(await anonymousMedTechApi.cryptoApi.RSA.exportKey(privateKey, 'pkcs8'))

await anonymousMedTechApi.authenticationApi.authenticateAndAskAccessToItsExistingData(
  patientUsername,
  patientToken,
  [privateKeyHex, publicKeyHex],
  () => undefined,
)
//tech-doc: STOP HERE

const newNotifications = await api.notificationApi.getPendingNotifications()
const patientNotification = newNotifications.filter(
  (notification) =>
    notification.type === NotificationTypeEnum.NEW_USER_OWN_DATA_ACCESS &&
    notification.responsible === patient.id,
)[0]

expect(!!patientNotification).to.eq(true)

const ongoingStatusUpdate = await api.notificationApi.updateNotificationStatus(
  patientNotification,
  'ongoing',
)
expect(!!ongoingStatusUpdate).to.eq(true)
expect(ongoingStatusUpdate?.status).to.eq('ongoing')

const sharedData = await api.patientApi.giveAccessToAllDataOf(patient.id)

expect(!!sharedData).to.eq(true)
expect(sharedData.patient?.id).to.eq(patient.id)
expect(sharedData.statuses.dataSamples?.success).to.eq(true)
expect(!!sharedData.statuses.dataSamples?.error).to.eq(false)
expect(sharedData.statuses.dataSamples?.modified).to.eq(1)

const completedStatusUpdate = await api.notificationApi.updateNotificationStatus(
  ongoingStatusUpdate,
  'completed'
)

expect(!!completedStatusUpdate).to.eq(true)
expect(completedStatusUpdate?.status).to.eq('completed')
