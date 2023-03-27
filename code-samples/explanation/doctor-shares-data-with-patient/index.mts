import 'isomorphic-fetch'
import { CodingReference, Content, DataSample, HealthcareElement } from '@icure/medical-device-sdk'
import {
  host,
  initLocalStorage,
  initMedTechApi,
  initPatientMedTechApi,
  msgGtwUrl,
  output,
  patientId,
  signUpUserUsingEmail,
  specId,
} from '../../utils/index.mjs'
import { expect } from 'chai'
import {
  Notification,
  NotificationTypeEnum,
} from '@icure/medical-device-sdk/src/models/Notification.js'
import { v4 as uuid } from 'uuid'
import process from 'process'

initLocalStorage()

const masterApi = await initMedTechApi(true)
const masterUser = await masterApi.userApi.getLoggedUser()

const { api } = await signUpUserUsingEmail(
  host,
  msgGtwUrl,
  specId,
  process.env.AUTH_BY_EMAIL_HCP_PROCESS_ID,
  masterUser.healthcarePartyId!,
)
const user = await api.userApi.getLoggedUser()

const patientApi = await initPatientMedTechApi(true)
const patient = await patientApi.patientApi.getPatient(patientId)
const patientUser = await patientApi.userApi.getLoggedUser()
await patientApi.patientApi.giveAccessTo(patient, user.healthcarePartyId!)

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
output({ healthcareElement, dataSample })

//tech-doc: patient sends notification
const notification = await patientApi.notificationApi.createOrModifyNotification(
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
output({ notification })

//tech-doc: doctor receives notification
const newNotifications = await api.notificationApi.getPendingNotificationsAfter()
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
output({ newPatientNotifications })
const fetchedHE = await patientApi.healthcareElementApi.getHealthcareElement(healthcareElement.id)
expect(fetchedHE.id).to.eq(healthcareElement.id)
const fetchedDS = await patientApi.dataSampleApi.getDataSample(dataSample.id)
expect(fetchedDS.id).to.eq(dataSample.id)
