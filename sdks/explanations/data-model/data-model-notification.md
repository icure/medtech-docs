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
  "id": "c5584a0e-bdd1-43a1-9889-bf3632f1856f",
  "rev": "1-76985a8a26b7cc121ec64cebeacfa6e8",
  "created": 1679991766820,
  "modified": 1679991766820,
  "author": "3127a2bf-caea-4130-a761-42a56b8e4266",
  "responsible": "442da163-0338-4459-915a-e7a5270dcc88",
  "healthcareElementId": "c5584a0e-bdd1-43a1-9889-bf3632f1856f",
  "valueDate": 20230328102246,
  "openingDate": 20230328102246,
  "description": "My diagnosis is that the patient has Hay Fever",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
    ],
    "cryptedForeignKeys": {
      "442da163-0338-4459-915a-e7a5270dcc88": {}
    },
    "delegations": {
      "442da163-0338-4459-915a-e7a5270dcc88": {}
    },
    "encryptionKeys": {
      "442da163-0338-4459-915a-e7a5270dcc88": {}
    },
    "encryptedSelf": "YLqEE33L4/5BrPDfkv6YdU97gODsHZ+PTAiqRqh0K/LlskyYx55YLJ/p+YHwOCCppHFCV59MwPRBWx69Jix4JJhRvwTc4WFt/55Z6UV10DM="
  }
}
```
</details>

<!-- output://code-samples/explanation/doctor-shares-data-with-patient/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "5628217e-2516-4612-b68d-2eeaaf036362",
  "qualifiedLinks": {},
  "batchId": "7a53796b-0909-44dd-bcff-f5694a306ce8",
  "index": 0,
  "valueDate": 20230328102247,
  "openingDate": 20230328102247,
  "created": 1679991767190,
  "modified": 1679991767190,
  "author": "3127a2bf-caea-4130-a761-42a56b8e4266",
  "responsible": "442da163-0338-4459-915a-e7a5270dcc88",
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
      "442da163-0338-4459-915a-e7a5270dcc88": {}
    },
    "delegations": {
      "442da163-0338-4459-915a-e7a5270dcc88": {}
    },
    "encryptionKeys": {
      "442da163-0338-4459-915a-e7a5270dcc88": {}
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
  "id": "d8720091-3834-4d31-a17a-576a57beb284",
  "rev": "1-0a2ec12dfd86257b2e255ba510fb1ea3",
  "created": 1679991767695,
  "modified": 1679991767695,
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
      "442da163-0338-4459-915a-e7a5270dcc88": {}
    },
    "encryptionKeys": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
      "442da163-0338-4459-915a-e7a5270dcc88": {}
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
    "id": "d8720091-3834-4d31-a17a-576a57beb284",
    "rev": "1-0a2ec12dfd86257b2e255ba510fb1ea3",
    "created": 1679991767695,
    "modified": 1679991767695,
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
        "442da163-0338-4459-915a-e7a5270dcc88": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "442da163-0338-4459-915a-e7a5270dcc88": {}
      }
    }
  }
]
```
</details>
