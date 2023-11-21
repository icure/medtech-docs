import 'isomorphic-fetch'
import { initEHRLiteApi, initPatientEHRLiteApi } from '../../utils/index.mjs'
import { patientId } from '../../../utils/index.mjs'
import { expect } from 'chai'
import {
  CodingReference,
  mapOf,
  Notification,
  NotificationTypeEnum,
} from '@icure/typescript-common'
import { v4 as uuid } from 'uuid'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import { Condition, LocalComponent, Observation } from '@icure/ehr-lite-sdk'
import { MaintenanceTask, sleep } from '@icure/api'
import StatusEnum = MaintenanceTask.StatusEnum

initLocalStorage()

const api = await initEHRLiteApi(true)
const user = await api.userApi.getLogged()

const patientApi = await initPatientEHRLiteApi(true)
const patient = await patientApi.patientApi.get(patientId)
const patientUser = await patientApi.userApi.getLogged()

//tech-doc: doctor shares medical data
const condition = await api.conditionApi.createOrModify(
  new Condition({
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
expect(!!condition).to.eq(true) //skip
expect(condition.description).to.eq('My diagnosis is that the patient has Hay Fever') //skip
const observation = await api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    localContent: mapOf({
      en: new LocalComponent({
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
    healthcareElementIds: [condition.id],
  }),
)
//tech-doc: STOP HERE
expect(!!observation).to.eq(true)
output({ healthcareElement: condition, dataSample: observation })

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
  await api.conditionApi.giveAccessTo(condition, patient.id)
  await api.observationApi.giveAccessTo(observation, patient.id)
  await api.notificationApi.updateStatus(newPatientNotifications[0], StatusEnum.Completed)
}

await patientApi.cryptoApi.forceReload() // Necessary only if this is the first time that HCP shares data with patient
const fetchedCondition = await patientApi.conditionApi.get(condition.id)
const fetchedObservation = await patientApi.observationApi.get(observation.id)
//tech-doc: STOP HERE

output({ newPatientNotifications })
expect(fetchedCondition.id).to.eq(condition.id)
expect(fetchedObservation.id).to.eq(observation.id)
