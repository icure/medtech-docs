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
  "id": "34496762-f4e8-4e16-9b80-20d236e86ab8",
  "rev": "1-3028f1e20e7adcb19ebbb85fa5a0572f",
  "created": 1679928233357,
  "modified": 1679928233357,
  "author": "a090565b-28b5-41aa-9033-508d43a3fa3e",
  "responsible": "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd",
  "healthcareElementId": "34496762-f4e8-4e16-9b80-20d236e86ab8",
  "valueDate": 20230327164353,
  "openingDate": 20230327164353,
  "description": "My diagnosis is that the patient has Hay Fever",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
    ],
    "cryptedForeignKeys": {
      "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {}
    },
    "delegations": {
      "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {}
    },
    "encryptionKeys": {
      "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {}
    },
    "encryptedSelf": "eRHSQgOBy65DlcIeZkZVLx7g2ZjfnRavV1dEU4UezRHPvnIa4MOGLYHm0RGSlYaWsaZyfWD0NNJ9tEkeJOwqRRYW1HuJ54q4vugVPdSclUw="
  }
}
```
</details>

<!-- output://code-samples/explanation/doctor-shares-data-with-patient/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "c5bb9aa6-deb9-4c28-b6f5-fec97669e0a7",
  "qualifiedLinks": {},
  "batchId": "0610b2a6-78f4-4054-bbfb-10f9b93ca755",
  "index": 0,
  "valueDate": 20230327164353,
  "openingDate": 20230327164353,
  "created": 1679928233539,
  "modified": 1679928233539,
  "author": "a090565b-28b5-41aa-9033-508d43a3fa3e",
  "responsible": "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd",
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
      "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {}
    },
    "delegations": {
      "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {}
    },
    "encryptionKeys": {
      "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {}
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
  "id": "33a27dd4-6b82-48b6-bb4d-1bbfd910daa0",
  "rev": "1-95e6bc0938aa8cf9c792e400f9f00518",
  "created": 1679928233816,
  "modified": 1679928233816,
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
      "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {}
    },
    "encryptionKeys": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
      "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {}
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
    "id": "33a27dd4-6b82-48b6-bb4d-1bbfd910daa0",
    "rev": "1-95e6bc0938aa8cf9c792e400f9f00518",
    "created": 1679928233816,
    "modified": 1679928233816,
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
        "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {}
      }
    }
  }
]
```
</details>
