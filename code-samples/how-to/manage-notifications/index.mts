import "isomorphic-fetch";
import {
  CodingReference,
  HealthcareElement, HealthcareElementFilter,
  medTechApi, NotificationFilter, Patient,
} from '@icure/medical-device-sdk'
import { webcrypto } from "crypto";
import { hex2ua} from "@icure/api";
import { LocalStorage } from 'node-localstorage';
import { host, password, patientId, privKey, userName, patientUserName, patientPassword, patientPrivKey } from "../../utils/index.mjs";
import os from "os";
import { assert, expect } from 'chai';
import { Notification, NotificationTypeEnum } from '@icure/medical-device-sdk/src/models/Notification';

const tmp = os.tmpdir();
(global as any).localStorage = new LocalStorage(tmp, 5 * 1024**3);
(global as any).Storage = "";

const patientApi = await medTechApi()
  .withICureBasePath(host)
  .withUserName(patientUserName)
  .withPassword(patientPassword)
  .withCrypto(webcrypto as any)
  .build()

const patientUser = await patientApi.userApi.getLoggedUser()
await patientApi.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  patientUser.healthcarePartyId ?? patientUser.patientId ?? patientUser.deviceId,
  hex2ua(patientPrivKey)
);

const api = await medTechApi()
  .withICureBasePath(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .build()

const user = await api.userApi.getLoggedUser()
await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  user.healthcarePartyId ?? user.patientId ?? user.deviceId,
  hex2ua(privKey)
);
const hcp = await api.healthcareProfessionalApi.getHealthcareProfessional(user.healthcarePartyId)

//tech-doc: create a notification as patient
const accessNotification = await patientApi.notificationApi.createOrModifyNotification(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
  }),
  hcp.id
)
//tech-doc: STOP HERE
expect(!!accessNotification).to.eq(true)
expect(accessNotification.type).to.eq(NotificationTypeEnum.KEY_PAIR_UPDATE)

//tech-doc: creates a notification, then retrieves it
const createdNotification = await patientApi.notificationApi.createOrModifyNotification(
  new Notification({
    type: NotificationTypeEnum.OTHER,
  }),
  hcp.id
)

const retrievedNotification = await patientApi.notificationApi.getNotification(createdNotification.id)
//tech-doc: STOP HERE
expect(!!createdNotification).to.eq(true)
expect(!!retrievedNotification).to.eq(true)
expect(createdNotification.id).to.eq(retrievedNotification.id)

//tech-doc: creates after date filter
const startTimestamp = new Date(2022, 8, 27).getTime()

const afterDateFilter = await new NotificationFilter()
  .forDataOwner(user.healthcarePartyId)
  .afterDateFilter(startTimestamp)
  .build()
//tech-doc: STOP HERE
expect(!!afterDateFilter).to.eq(true)

//tech-doc: gets the first page of results
const notificationsFirstPage = await api.notificationApi.filterNotifications(
  afterDateFilter,
  undefined,
  10
)
//tech-doc: STOP HERE
expect(!!notificationsFirstPage).to.eq(true)
expect(notificationsFirstPage.rows.length).to.gt(0)
notificationsFirstPage.rows.forEach( notification => {
  assert(notification.created! >= startTimestamp);
})

//tech-doc: gets the second page of results
const notificationsSecondPage = await api.notificationApi.filterNotifications(
  afterDateFilter,
  notificationsFirstPage.nextKeyPair.startKeyDocId,
  10
)
//tech-doc: STOP HERE
expect(!!notificationsSecondPage).to.eq(true)
expect(notificationsSecondPage.rows.length).to.gt(0)
notificationsSecondPage.rows.forEach( notification => {
  assert(notification.created! >= startTimestamp);
})

//tech-doc: gets the pending notifications
const pendingNotifications = await api.notificationApi.getPendingNotifications();
//tech-doc: STOP HERE
expect(!!pendingNotifications).to.eq(true)
expect(pendingNotifications.length).to.gt(0)
pendingNotifications.forEach( notification => {
  assert(notification.status! === "pending");
})

//tech-doc: modifies a notification
const newNotification = await api.notificationApi.createOrModifyNotification(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
  }),
  hcp.id
)

const notificationToModify = new Notification({...newNotification, status: "ongoing"})

const modifiedNotification = await api.notificationApi.createOrModifyNotification(
  notificationToModify,
  hcp.id
)
//tech-doc: STOP HERE
expect(!!newNotification).to.eq(true)
expect(!!modifiedNotification).to.eq(true)
expect(newNotification.id).to.eq(modifiedNotification.id)
expect(newNotification.status).to.eq("pending")
expect(modifiedNotification.status).to.eq("ongoing")

//tech-doc: updates notification status
const notificationToUpdate = await api.notificationApi.createOrModifyNotification(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
  }),
  hcp.id
)

const updatedNotification = await api.notificationApi.updateNotificationStatus(notificationToUpdate, "ongoing")
//tech-doc: STOP HERE
expect(!!notificationToUpdate).to.eq(true)
expect(!!updatedNotification).to.eq(true)
expect(notificationToUpdate.id).to.eq(updatedNotification.id)
expect(notificationToUpdate.status).to.eq("pending")
expect(updatedNotification.status).to.eq("ongoing")

//tech-doc: deletes a notification
const notificationToDelete = await api.notificationApi.createOrModifyNotification(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
  }),
  hcp.id
)

const deletedNotificationId = await api.notificationApi.deleteNotification(notificationToDelete.id)
//tech-doc: STOP HERE
expect(!!notificationToDelete).to.eq(true)
expect(!!deletedNotificationId).to.eq(true)
expect(!!deletedNotificationId).to.eq(notificationToDelete.id)
