import 'isomorphic-fetch'
import { NotificationFilter } from '@icure/medical-device-sdk'
import {
  initLocalStorage,
  output,
} from '../../../utils/index.mjs'
import { assert, expect } from 'chai'
import {initEHRLiteApi, initPatientEHRLiteApi} from "@site/code-samples/ehr-lite-sdk/utils/index.mjs";
import { Notification, NotificationTypeEnum } from "@icure/typescript-common";

initLocalStorage()

const patientApi = await initPatientEHRLiteApi(true)
const api = await initEHRLiteApi(true)

const user = await api.userApi.getLogged()
const practitioner = await api.practitionerApi.get(user.healthcarePartyId)

//tech-doc: create a notification as patient
const accessNotification = await patientApi.notificationApi.createOrModify(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
  }),
  practitioner.id,
)
//tech-doc: STOP HERE
output({ accessNotification })

expect(!!accessNotification).to.eq(true)
expect(accessNotification.type).to.eq(NotificationTypeEnum.KEY_PAIR_UPDATE)

//tech-doc: creates a notification, then retrieves it
const createdNotification = await patientApi.notificationApi.createOrModify(
  new Notification({
    type: NotificationTypeEnum.OTHER,
  }),
  practitioner.id,
)

const retrievedNotification = await patientApi.notificationApi.get(
  createdNotification.id,
)
//tech-doc: STOP HERE
output({ createdNotification, retrievedNotification })

expect(!!createdNotification).to.eq(true)
expect(!!retrievedNotification).to.eq(true)
expect(createdNotification.id).to.eq(retrievedNotification.id)

//tech-doc: creates after date filter
const startTimestamp = new Date(2022, 8, 27).getTime()

const afterDateFilter = await new NotificationFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .afterDate(startTimestamp)
  .build()
//tech-doc: STOP HERE
output({ afterDateFilter })

expect(!!afterDateFilter).to.eq(true)

//tech-doc: gets the first page of results
const notificationsFirstPage = await api.notificationApi.filterBy(
  afterDateFilter,
  undefined,
  10,
)
//tech-doc: STOP HERE
output({ notificationsFirstPage })

expect(!!notificationsFirstPage).to.eq(true)
expect(notificationsFirstPage.rows.length).to.gt(0)
notificationsFirstPage.rows.forEach((notification) => {
  assert(notification.created! >= startTimestamp)
})

//tech-doc: gets the second page of results
const notificationsSecondPage = await api.notificationApi.filterBy(
  afterDateFilter,
  notificationsFirstPage.nextKeyPair.startKeyDocId,
  10,
)
//tech-doc: STOP HERE
output({ notificationsSecondPage })

expect(!!notificationsSecondPage).to.eq(true)
expect(notificationsSecondPage.rows.length).to.gt(0)
notificationsSecondPage.rows.forEach((notification) => {
  assert(notification.created! >= startTimestamp)
})

//tech-doc: gets the pending notifications
const pendingNotifications = await api.notificationApi.getPendingAfter()
//tech-doc: STOP HERE
output({ pendingNotifications })

expect(!!pendingNotifications).to.eq(true)
expect(pendingNotifications.length).to.gt(0)
pendingNotifications.forEach((notification) => {
  assert(notification.status! === 'pending')
})

//tech-doc: modifies a notification
const newNotification = await api.notificationApi.createOrModify(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
  }),
  practitioner.id,
)

const notificationToModify = new Notification({ ...newNotification, status: 'ongoing' })

const modifiedNotification = await api.notificationApi.createOrModify(
  notificationToModify,
  practitioner.id,
)
//tech-doc: STOP HERE
output({ newNotification, modifiedNotification })

expect(!!newNotification).to.eq(true)
expect(!!modifiedNotification).to.eq(true)
expect(newNotification.id).to.eq(modifiedNotification.id)
expect(newNotification.status).to.eq('pending')
expect(modifiedNotification.status).to.eq('ongoing')

//tech-doc: updates notification status
const notificationToUpdate = await api.notificationApi.createOrModify(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
    status: 'pending',
  }),
  practitioner.id,
)

const updatedNotification = await api.notificationApi.updateStatus(
  notificationToUpdate,
  'ongoing',
)
//tech-doc: STOP HERE
output({ notificationToUpdate, updatedNotification })

expect(!!notificationToUpdate).to.eq(true)
expect(!!updatedNotification).to.eq(true)
expect(notificationToUpdate.id).to.eq(updatedNotification.id)
expect(updatedNotification.status).to.eq('ongoing')

//tech-doc: deletes a notification
const notificationToDelete = await api.notificationApi.createOrModify(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
  }),
  practitioner.id,
)

const deletedNotificationId = await api.notificationApi.delete(notificationToDelete.id)
//tech-doc: STOP HERE
output({ notificationToDelete, deletedNotificationId })

expect(!!notificationToDelete).to.eq(true)
expect(!!deletedNotificationId).to.eq(true)
expect(deletedNotificationId).to.eq(notificationToDelete.id)
