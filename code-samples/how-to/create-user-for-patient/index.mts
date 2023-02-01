import 'isomorphic-fetch'

import {
  authProcessId,
  host,
  initLocalStorage,
  msgGtwUrl,
  password,
  privKey,
  specId,
  userName,
} from '../../utils/index.mjs'
import { hex2ua, sleep, ua2hex } from '@icure/api'
import { assert, expect } from 'chai'
import { v4 as uuid } from 'uuid'
import {
  Address,
  AnonymousMedTechApiBuilder,
  CodingReference,
  Content,
  DataSample,
  HealthcareElement,
  HealthcareElementFilter,
  ICureRegistrationEmail,
  medTechApi,
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

const apiAsDoctor = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .build()

const loggedUser = await apiAsDoctor.userApi.getLoggedUser()
await apiAsDoctor.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  loggedUser.healthcarePartyId,
  hex2ua(privKey),
)

const hcp = await apiAsDoctor.healthcareProfessionalApi.getHealthcareProfessional(
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
const patient = await apiAsDoctor.patientApi.createOrModifyPatient(
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

const dataSample = apiAsDoctor.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: new Content({ stringValue: 'Hello world' }) },
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
await apiAsDoctor.userApi.createAndInviteUser(patient, messageFactory, 3600)
//tech-doc: STOP HERE

const loginAndPasswordRegex = new RegExp(': ([^ &]+) & (.+)')
const emailBody = (await getEmail(email)).html
const loginAndPassword = loginAndPasswordRegex.exec(emailBody)
const patientUsername = loginAndPassword[1]
const patientToken = loginAndPassword[2]

await sleep(5000)

//tech-doc: user logs in
const anonymousMedTechApi = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(host)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessId)
  .withAuthProcessBySmsId(authProcessId)
  .build()

const authenticationResult = await anonymousMedTechApi.authenticationApi.authenticateAndAskAccessToItsExistingData(
  patientUsername,
  patientToken,
)
const apiAsPatient = authenticationResult.medTechApi
//tech-doc: STOP HERE

//tech-doc: get patient details
const patientUser = await apiAsPatient.userApi.getLoggedUser()
// apiAsPatient.patientApi.getPatient would fail
const patientDetails = await apiAsPatient.patientApi.getPatientAndTryDecrypt(patientUser.patientId!)
//tech-doc: STOP HERE

//tech-doc: modify patient details
patientDetails.companyName = 'iCure'
// patientDetails.note = 'This would make modify fail'
const modifiedPatientDetails = await apiAsPatient.patientApi.modifyPotentiallyEncryptedPatient(patientDetails)
//tech-doc: STOP HERE

//tech-doc: create healthcare element
const newHEByPatient = await apiAsPatient.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: "I don't feel so well",
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|617|20020131',
        type: 'SNOMEDCT',
        code: '617',
        version: '20020131',
      }),
    ]),
    openingDate: new Date('2019-10-12').getTime(),
  }),
  modifiedPatientDetails.id
)
await apiAsPatient.healthcareElementApi.giveAccessTo(newHEByPatient, hcp.id)
// The doctor can now access the healthcare element
apiAsDoctor.cryptoApi.emptyHcpCache(hcp.id)
console.log(await apiAsDoctor.healthcareElementApi.getHealthcareElement(newHEByPatient.id!)) // HealthcareElement...
//tech-doc: STOP HERE

//tech-doc: share healthcare element sfk
const filterForHcpWithoutAccessByPatient = await new HealthcareElementFilter()
  .forPatients(apiAsDoctor.cryptoApi, [await apiAsDoctor.patientApi.getPatient(patient.id)])
  .forDataOwner(hcp.id)
  .build()
const notFoundHEs = await apiAsDoctor.healthcareElementApi.filterHealthcareElement(filterForHcpWithoutAccessByPatient)
console.log(notFoundHEs.rows.find((x) => x.id == newHEByPatient.id)) // undefined
expect(notFoundHEs.rows.find((x) => x.id == newHEByPatient.id)).to.be.undefined //skip
// The patient shares his secret foreign key with the doctor
await apiAsPatient.patientApi.giveAccessToPotentiallyEncrypted(modifiedPatientDetails, hcp.id)
// The doctor can now also find the healthcare element
const filterForHcpWithAccessByPatient = await new HealthcareElementFilter()
  .forPatients(apiAsDoctor.cryptoApi, [await apiAsDoctor.patientApi.getPatient(patient.id)])
  .forDataOwner(hcp.id)
  .build()
const foundHEs = await apiAsDoctor.healthcareElementApi.filterHealthcareElement(filterForHcpWithAccessByPatient)
console.log(foundHEs.rows.find((x) => x.id == newHEByPatient.id)) // HealthcareElement...
expect(foundHEs.rows.find((x) => x.id == newHEByPatient.id)).to.not.be.undefined //skip
//tech-doc: STOP HERE


//tech-doc: doctor gets pending notifications
const newNotifications = await apiAsDoctor.notificationApi.getPendingNotificationsAfter()
const patientNotification = newNotifications.filter(
  (notification) =>
    notification.type === NotificationTypeEnum.NEW_USER_OWN_DATA_ACCESS &&
    notification.responsible === patient.id,
)[0]
//tech-doc: STOP HERE
expect(!!patientNotification).to.eq(true)

//tech-doc: notification set ongoing
const ongoingStatusUpdate = await apiAsDoctor.notificationApi.updateNotificationStatus(
  patientNotification,
  'ongoing',
)
//tech-doc: STOP HERE
expect(!!ongoingStatusUpdate).to.eq(true)
expect(ongoingStatusUpdate?.status).to.eq('ongoing')

//tech-doc: data sharing
const sharedData = await apiAsDoctor.patientApi.giveAccessToAllDataOf(patient.id)
//tech-doc: STOP HERE
console.log(sharedData)
expect(!!sharedData).to.eq(true)
expect(sharedData.patient?.id).to.eq(patient.id)
expect(sharedData.statuses.dataSamples?.success).to.eq(true)
expect(!!sharedData.statuses.dataSamples?.error).to.eq(false)
expect(sharedData.statuses.dataSamples?.modified).to.eq(1)

//tech-doc: completed status
const completedStatusUpdate = await apiAsDoctor.notificationApi.updateNotificationStatus(
  ongoingStatusUpdate,
  'completed',
)
//tech-doc: STOP HERE
expect(!!completedStatusUpdate).to.eq(true)
expect(completedStatusUpdate?.status).to.eq('completed')
