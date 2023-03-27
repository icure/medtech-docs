---
slug: notification
tags:
    - data model   
    - notification
---
# Notification

A Notification is a request by a [Data Owner](/sdks/glossary#data-owner) for a Healthcare Professional to perform a 
particular action, such as sharing a piece of information.  
Since the Notification is encrypted, only the responsible Healthcare Professional can see its content.

## When Should I Use a Notification?

You should use a Notification when a Data Owner needs a Healthcare Professional to perform an action and wants to 
be sure that no one else can access to the request.

## How a Healthcare Professional is Related to Other Entities?

Any Data Owner can create a Notification.  
A Notification will be shared with a Healthcare Professional.  
A Healthcare Professional can modify a Notification shared with them.

## Examples

### A Doctor Receives a Data Sharing Request

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new Data Sample.  
Then, they add the diagnosis (hay fever) as associated Healthcare Element.

<!-- file://code-samples/explanation/doctor-shares-data-with-patient/index.mts snippet:doctor shares medical data-->
```typescript
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
```
<!-- output://code-samples/explanation/doctor-shares-data-with-patient/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
{
  "id": "2d1ad658-15f8-42f7-a2de-3060567591c6",
  "rev": "1-71ff1070747f8ea4d676891a4295a504",
  "created": 1679927938127,
  "modified": 1679927938127,
  "author": "591cdb4c-02ea-4adf-bde9-674f1fde87c8",
  "responsible": "94dee587-c7ba-4f53-86ab-280a44525c0a",
  "healthcareElementId": "2d1ad658-15f8-42f7-a2de-3060567591c6",
  "valueDate": 20230327163858,
  "openingDate": 20230327163858,
  "description": "My diagnosis is that the patient has Hay Fever",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
    ],
    "cryptedForeignKeys": {
      "94dee587-c7ba-4f53-86ab-280a44525c0a": {}
    },
    "delegations": {
      "94dee587-c7ba-4f53-86ab-280a44525c0a": {}
    },
    "encryptionKeys": {
      "94dee587-c7ba-4f53-86ab-280a44525c0a": {}
    },
    "encryptedSelf": "kWEaJLgEg9wT7CB3JK7uTU3GKwEQy71YpI85A71onIlSakHDudlA3fHQsVejhZb9wmoorvlKBPqP7/FrCCbV6rNPxe2IimtMeBB7hMYVHDs="
  }
}
```
</details>

<!-- output://code-samples/explanation/doctor-shares-data-with-patient/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "882d06bb-f1f4-4b8f-b74f-466b3bacafb2",
  "qualifiedLinks": {},
  "batchId": "89450f09-b1d2-44e1-a329-203ad940ccb5",
  "index": 0,
  "valueDate": 20230327163858,
  "openingDate": 20230327163858,
  "created": 1679927938274,
  "modified": 1679927938274,
  "author": "591cdb4c-02ea-4adf-bde9-674f1fde87c8",
  "responsible": "94dee587-c7ba-4f53-86ab-280a44525c0a",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "The patient has fatigue",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
    ],
    "cryptedForeignKeys": {
      "94dee587-c7ba-4f53-86ab-280a44525c0a": {}
    },
    "delegations": {
      "94dee587-c7ba-4f53-86ab-280a44525c0a": {}
    },
    "encryptionKeys": {
      "94dee587-c7ba-4f53-86ab-280a44525c0a": {}
    }
  }
}
```
</details>

Then, the Patient sends a Notification to the doctor to ask for access to the data.

<!-- file://code-samples/explanation/doctor-shares-data-with-patient/index.mts snippet:patient sends notification-->
```typescript
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
```
<!-- output://code-samples/explanation/doctor-shares-data-with-patient/notification.txt -->
<details>
<summary>notification</summary>

```json
{
  "id": "a310b11b-4ac1-472f-b268-eea3fe4c7988",
  "rev": "1-29e1a36b99ced9375312f442c48bc3fd",
  "created": 1679927938401,
  "modified": 1679927938401,
  "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
  "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
  "status": "pending",
  "identifiers": [],
  "properties": [],
  "type": "OTHER",
  "systemMetaData": {
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
      "94dee587-c7ba-4f53-86ab-280a44525c0a": {}
    },
    "encryptionKeys": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
      "94dee587-c7ba-4f53-86ab-280a44525c0a": {}
    }
  }
}
```
</details>

After that, the Doctor receives a notification from the Patient and shares the data with them.

<!-- file://code-samples/explanation/doctor-shares-data-with-patient/index.mts snippet:doctor receives notification-->
```typescript
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
```
<!-- output://code-samples/explanation/doctor-shares-data-with-patient/newPatientNotifications.txt -->
<details>
<summary>newPatientNotifications</summary>

```text
[
  {
    "id": "a310b11b-4ac1-472f-b268-eea3fe4c7988",
    "rev": "1-29e1a36b99ced9375312f442c48bc3fd",
    "created": 1679927938401,
    "modified": 1679927938401,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "completed",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "94dee587-c7ba-4f53-86ab-280a44525c0a": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "94dee587-c7ba-4f53-86ab-280a44525c0a": {}
      }
    }
  }
]
```
</details>
