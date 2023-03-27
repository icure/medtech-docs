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
  "id": "1dc92085-dd5f-4996-afca-62c56876763e",
  "rev": "1-aa056e11f364d429a45aaaa5d7f3423e",
  "created": 1679929606205,
  "modified": 1679929606205,
  "author": "85c430de-6108-4135-b0c8-946722a9b5cd",
  "responsible": "d8bf246b-9bc4-4d64-84e3-b58fc8980572",
  "healthcareElementId": "1dc92085-dd5f-4996-afca-62c56876763e",
  "valueDate": 20230327170646,
  "openingDate": 20230327170646,
  "description": "My diagnosis is that the patient has Hay Fever",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
    ],
    "cryptedForeignKeys": {
      "d8bf246b-9bc4-4d64-84e3-b58fc8980572": {}
    },
    "delegations": {
      "d8bf246b-9bc4-4d64-84e3-b58fc8980572": {}
    },
    "encryptionKeys": {
      "d8bf246b-9bc4-4d64-84e3-b58fc8980572": {}
    },
    "encryptedSelf": "s650Oe0163V5Xlh+4UrCuClJl+GDBOUzts9AAmZ6GG310m8m8FSqGkwWxciA7vkbebvdH0eCbHQjAwtr9WSnddSwkdOo8111Ex7h681Mre0="
  }
}
```
</details>

<!-- output://code-samples/explanation/doctor-shares-data-with-patient/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "0a5a88b5-32ad-4649-83ad-53986b9fe142",
  "qualifiedLinks": {},
  "batchId": "d17ef103-a561-4e76-99fb-a3e24a57ccb9",
  "index": 0,
  "valueDate": 20230327170646,
  "openingDate": 20230327170646,
  "created": 1679929606376,
  "modified": 1679929606376,
  "author": "85c430de-6108-4135-b0c8-946722a9b5cd",
  "responsible": "d8bf246b-9bc4-4d64-84e3-b58fc8980572",
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
      "d8bf246b-9bc4-4d64-84e3-b58fc8980572": {}
    },
    "delegations": {
      "d8bf246b-9bc4-4d64-84e3-b58fc8980572": {}
    },
    "encryptionKeys": {
      "d8bf246b-9bc4-4d64-84e3-b58fc8980572": {}
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
  "id": "59fdfb2b-a1d1-4edf-9bfc-38e38b50550a",
  "rev": "1-4f64c768fed6e8e74bd3280ae6c0a63c",
  "created": 1679929606518,
  "modified": 1679929606518,
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
      "d8bf246b-9bc4-4d64-84e3-b58fc8980572": {}
    },
    "encryptionKeys": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
      "d8bf246b-9bc4-4d64-84e3-b58fc8980572": {}
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
    "id": "59fdfb2b-a1d1-4edf-9bfc-38e38b50550a",
    "rev": "1-4f64c768fed6e8e74bd3280ae6c0a63c",
    "created": 1679929606518,
    "modified": 1679929606518,
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
        "d8bf246b-9bc4-4d64-84e3-b58fc8980572": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "d8bf246b-9bc4-4d64-84e3-b58fc8980572": {}
      }
    }
  }
]
```
</details>
