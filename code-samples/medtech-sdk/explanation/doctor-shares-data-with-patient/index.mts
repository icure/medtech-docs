import 'isomorphic-fetch'
import {
  CodingReference,
  Content,
  DataSample,
  HealthcareElement,
  Notification,
} from '@icure/medical-device-sdk'
import {
  initLocalStorage,
  initMedTechApi,
  initPatientMedTechApi,
  output,
  patientId,
} from '../../../utils/index.mjs'
import { expect } from 'chai'
import { v4 as uuid } from 'uuid'
import { mapOf, NotificationTypeEnum } from '@icure/typescript-common'
import { MaintenanceTask } from '@icure/api'
import StatusEnum = MaintenanceTask.StatusEnum

initLocalStorage()

const api = await initMedTechApi(true)
const user = await api.userApi.getLoggedUser()

const patientApi = await initPatientMedTechApi(true)
const patient = await patientApi.patientApi.getPatient(patientId)
const patientUser = await patientApi.userApi.getLoggedUser()

//tech-doc: doctor shares medical data
const healthcareElement = await api.healthcareElementApi.createOrModify(
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
const dataSample = await api.dataSampleApi.createOrModifyFor(
  patient.id,
  new DataSample({
    content: mapOf({
      en: new Content({
        stringValue: 'The patient has fatigue',
      }),
    }),
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
const notification = await patientApi.notificationApi.createOrModify(
  new Notification({
    id: uuid(),
    status: StatusEnum.Pending,
    author: patientUser.id,
    responsible: patientUser.patientId,
    type: NotificationTypeEnum.Other,
  }),
  user.healthcarePartyId,
)
//tech-doc: STOP HERE
output({ notification })

//tech-doc: doctor receives notification
const newNotifications = await api.notificationApi.getPendingAfter()
const newPatientNotifications = newNotifications.filter(
  (notification) =>
    notification.type === NotificationTypeEnum.Other &&
    notification.responsible === patientUser.patientId,
)

if (!!newPatientNotifications && newPatientNotifications.length > 0) {
  await api.healthcareElementApi.giveAccessTo(healthcareElement, patient.id)
  await api.dataSampleApi.giveAccessTo(dataSample, patient.id)
  await api.notificationApi.updateStatus(newPatientNotifications[0], StatusEnum.Completed)
}

await patientApi.cryptoApi.forceReload()
const fetchedHE = await patientApi.healthcareElementApi.get(healthcareElement.id)
const fetchedDS = await patientApi.dataSampleApi.get(dataSample.id)
//tech-doc: STOP HERE
output({ newPatientNotifications })
expect(fetchedHE.id).to.eq(healthcareElement.id)
expect(fetchedDS.id).to.eq(dataSample.id)
