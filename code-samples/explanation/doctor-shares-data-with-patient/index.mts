import 'isomorphic-fetch'
import {
  CodingReference,
  Content,
  DataSample,
  HealthcareElement,
  medTechApi,
} from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import { hex2ua } from '@icure/api'
import {
  host,
  initLocalStorage,
  password,
  patientId,
  patientPassword,
  patientPrivKey,
  patientUserName,
  privKey,
  userName,
} from '../../utils/index.mjs'
import { expect } from 'chai'
import {
  Notification,
  NotificationTypeEnum,
} from '@icure/medical-device-sdk/src/models/Notification.js'
import { v4 as uuid } from 'uuid'

initLocalStorage()

const api = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .build()

const user = await api.userApi.getLoggedUser()
await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  user.healthcarePartyId ?? user.patientId ?? user.deviceId,
  hex2ua(privKey),
)

const patient = await api.patientApi.getPatient(patientId)

//tech-doc: doctor shares medical data
const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'My diagnosis is that the patient has Hay Fever',
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|21719001|20020131',
        type: 'SNOMEDCT',
        code: '21719001',
        version: '20020131',
      }),
    ]),
  }),
  patient.id,
)
expect(!!healthcareElement).to.eq(true) //skip
expect(healthcareElement.description).to.eq('My diagnosis is that the patient has Hay Fever') //skip
const dataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    content: {
      en: new Content({
        stringValue: 'The patient has fatigue',
      }),
    },
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|84229001|20020131',
        type: 'SNOMEDCT',
        code: '84229001',
        version: '20020131',
      }),
    ]),
    healthcareElementIds: new Set([healthcareElement.id]),
  }),
)
//tech-doc: STOP HERE
expect(!!dataSample).to.eq(true)

const patientApi = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(patientUserName)
  .withPassword(patientPassword)
  .withCrypto(webcrypto as any)
  .build()

const patientUser = await patientApi.userApi.getLoggedUser()
await patientApi.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  patientUser.healthcarePartyId ?? patientUser.patientId ?? patientUser.deviceId,
  hex2ua(patientPrivKey),
)

//tech-doc: patient sends notification
const accessNotification = await patientApi.notificationApi.createOrModifyNotification(
  new Notification({
    id: uuid(),
    status: 'pending',
    author: patientUser.id,
    responsible: patientUser.patientId,
    type: NotificationTypeEnum.OTHER,
  }),
  user.healthcarePartyId,
)
//tech-doc: STOP HERE

//tech-doc: doctor receives notification
const newNotifications = await api.notificationApi.getPendingNotifications()
const newPatientNotifications = newNotifications.filter(
  (notification) =>
    notification.type === NotificationTypeEnum.OTHER &&
    notification.responsible === patientUser.patientId,
)

if (!!newPatientNotifications && newPatientNotifications.length > 0) {
  await api.healthcareElementApi.giveAccessTo(healthcareElement, patient.id)
  await api.dataSampleApi.giveAccessTo(dataSample, patient.id)
  await api.notificationApi.updateNotificationStatus(newPatientNotifications[0], 'completed')
}
//tech-doc: STOP HERE
const fetchedHE = await patientApi.healthcareElementApi.getHealthcareElement(healthcareElement.id)
expect(fetchedHE.id).to.eq(healthcareElement.id)
const fetchedDS = await patientApi.dataSampleApi.getDataSample(dataSample.id)
expect(fetchedDS.id).to.eq(dataSample.id)
