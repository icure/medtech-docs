---
slug: how-to-manage-notifications
description: Learn how to manage notifications
tags:
- Notification
---

# Handling notifications

## What Is a Notification?

A Notification represents a request from a [Data Owner](/sdks/glossary#data-owner) to a Healthcare Professional to perform 
an operation.  
As for now, there are three types of Notifications:

* **KEY_PAIR_UPDATE**: when a Patient loses their private key and gets a new one, they can send this type of Notification to a Healthcare Professional to ask them to share their data with them again.
* **NEW_USER_OWN_DATA_ACCESS**: when a Patient logs in for the first time, they can send this type of Notification to a Healthcare Professional to aks for access to their own data.
* **OTHER**: all the other use cases.

### Status of a Notification

You can manage the lifecycle of a Notification by altering its status. Each Notification can have four possible states:

* **pending**: the Notification was created, and it is waiting to be managed.
* **ongoing**: the Notification was acknowledged, and the operations it prescribes are being managed.
* **completed**: the Notification was managed, and the operations it prescribes ended.
* **cancelled**: the Notification was cancelled without starting the operations it prescribes.

```mermaid
flowchart TD
 
 PENDING --> ONGOING
 ONGOING --> COMPLETED
 PENDING --> CANCELED
```

## Creating a Notification

:::note

To perform the following operations, we suppose you have at least a Patient and a Healthcare Professional in your database.

:::

In the following example, a Patient creates a Notification for a Healthcare Professional communicating that they have a new
 key and need access to their data.

<!-- file://code-samples/how-to/manage-notifications/index.mts snippet:create a notification as patient-->
```typescript
const accessNotification = await patientApi.notificationApi.createOrModifyNotification(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
  }),
  hcp.id,
)
```

:::note

The default status of a Notification is `pending`

:::

## Retrieving a Notification

### Retrieving a Notification Using its Id

In the following example, a Patient creates a Notification for a Healthcare Professional and then retrieves it using its
 id.

<!-- file://code-samples/how-to/manage-notifications/index.mts snippet:creates a notification, then retrieves it-->
```typescript
const createdNotification = await patientApi.notificationApi.createOrModifyNotification(
  new Notification({
    type: NotificationTypeEnum.OTHER,
  }),
  hcp.id,
)

const retrievedNotification = await patientApi.notificationApi.getNotification(
  createdNotification.id,
)
```

### Retrieving Notifications Using Complex Criteria

If you want to retrieve a set of Notifications that satisfy complex criteria, you can use a Filter.  
In this example, a Healthcare Professional filters all their Notifications that were created after a certain date.

<!-- file://code-samples/how-to/manage-notifications/index.mts snippet:creates after date filter-->
```typescript
const startTimestamp = new Date(2022, 8, 27).getTime()

const afterDateFilter = await new NotificationFilter()
  .forDataOwner(user.healthcarePartyId)
  .afterDate(startTimestamp)
  .build()
```

:::note

You can learn more about filters in the how to

:::

After creating the filter, is it possible to use it to retrieve the Notifications.

<!-- file://code-samples/how-to/manage-notifications/index.mts snippet:gets the first page of results-->
```typescript
const notificationsFirstPage = await api.notificationApi.filterNotifications(
  afterDateFilter,
  undefined,
  10,
)
```

The `filter` method returns a PaginatedList, which contains up to `limit` Notifications in the `rows` field, as specified by the method parameter (1000 by default).
If  the PaginatedList has a non-null field `startKeyDocId` there are more notifications which can be retrieved with this filter: you can use this value to retrieve (part of) the remaining notifications.

<!-- file://code-samples/how-to/manage-notifications/index.mts snippet:gets the second page of results-->
```typescript
const notificationsSecondPage = await api.notificationApi.filterNotifications(
  afterDateFilter,
  notificationsFirstPage.nextKeyPair.startKeyDocId,
  10,
)
```

### Retrieving all the Pending Notifications

A Healthcare Professional can also retrieve all the Notifications assigned to him that have a `pending` status.

<!-- file://code-samples/how-to/manage-notifications/index.mts snippet:gets the pending notifications-->
```typescript
const pendingNotifications = await api.notificationApi.getPendingNotificationsAfter()
```

## Modifying a Notification

A Data Owner can modify a Notification.

<!-- file://code-samples/how-to/manage-notifications/index.mts snippet:modifies a notification-->
```typescript
const newNotification = await api.notificationApi.createOrModifyNotification(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
  }),
  hcp.id,
)

const notificationToModify = new Notification({ ...newNotification, status: 'ongoing' })

const modifiedNotification = await api.notificationApi.createOrModifyNotification(
  notificationToModify,
  hcp.id,
)
```

:::caution

Only the `status`, `identifiers`, and `property` fields can be modified.

:::

### Updating the Status of a Notification

The Notification API also provided a shortcut method to update the status of a Notification.

<!-- file://code-samples/how-to/manage-notifications/index.mts snippet:updates notification status-->
```typescript
const notificationToUpdate = await api.notificationApi.createOrModifyNotification(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
    status: 'pending',
  }),
  hcp.id,
)

const updatedNotification = await api.notificationApi.updateNotificationStatus(
  notificationToUpdate,
  'ongoing',
)
```

## Deleting a Notification

Finally, a Data Owner that has access to a Notification can decide to delete it.

<!-- file://code-samples/how-to/manage-notifications/index.mts snippet:deletes a notification-->
```typescript
const notificationToDelete = await api.notificationApi.createOrModifyNotification(
  new Notification({
    type: NotificationTypeEnum.KEY_PAIR_UPDATE,
  }),
  hcp.id,
)

const deletedNotificationId = await api.notificationApi.deleteNotification(notificationToDelete.id)
```
