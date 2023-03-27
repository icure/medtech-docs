---
slug: healthcare-professional
tags:
    - data model
    - data owner
    - healthcare professional
---
# Healthcare Professional

A Healthcare Professional is an actor that can manage and is responsible for Patients, Medical Devices and other 
Healthcare Professionals.  
As [Data Owners](/sdks/glossary#data-owner) they can create medical information and share it with other Data Owners.
Other Data Owner can decide to share their medical information with them.

## When Should I Use a Healthcare Professional?

You should use a Healthcare Professional when you need to represent a Doctor, or another actor responsible for patients,
medical data, and treatments, in your application.

## How is a Healthcare Professional Related to Other Entities?

A Healthcare Professional can:
- create Users for other Patients, Medical Devices, and Healthcare Professionals.  
- manage other Users, by changing their passwords or deactivating them.  
- create Data Samples and Healthcare Elements for Patients.  
- share Data Samples and Healthcare Elements with other Data Owners.  
- create Notifications and  update the ones shared with them.

## Examples

### A Doctor Inviting a Patient

A Doctor (Healthcare Professional) visits for the first time a Patient. After the visit, they invite the patient
to the iCure platform.

<!-- file://code-samples/explanation/doctor-invites-a-patient/index.mts snippet:doctor invites user-->
```typescript
const messageFactory = new ICureRegistrationEmail(hcp, 'test', 'iCure', existingPatient)
const createdUser = await api.userApi.createAndInviteUser(existingPatient, messageFactory)
```
<!-- output://code-samples/explanation/doctor-invites-a-patient/createdUser.txt -->
<details>
<summary>createdUser</summary>

```json
{
  "id": "a9a0a632-6439-40e7-bf0c-9d69bf25c014",
  "rev": "1-0db7e069ec8b7e012d86a0564f5150f9",
  "created": 1679929599161,
  "name": "451d2b89@icure.com",
  "login": "451d2b89@icure.com",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "5f4105fa-8994-4778-9711-02cf93541c43",
  "email": "451d2b89@icure.com",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {}
}
```
</details>

### A Doctor Registering a Visit and Sharing the Outcome with the Patient

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

After that, the Doctor checks if there are new Notifications from the Patient and shares the data with them.

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

### A Doctor Updating the Status of a Patient

A Doctor (Healthcare Professional) discovers that their Patient is pregnant. Therefore, they update her condition in the
application.

<!-- file://code-samples/explanation/doctor-creates-he/index.mts snippet:doctor can create HE-->
```typescript
const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'The patient is pregnant',
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|77386006|20020131',
        type: 'SNOMEDCT',
        code: '77386006',
        version: '20020131',
      }),
    ]),
    openingDate: new Date().getTime(),
  }),
  patient.id,
)
```
<!-- output://code-samples/explanation/doctor-creates-he/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
{
  "id": "00577c6a-512d-4b8c-8a25-09bae8a22b69",
  "rev": "1-7c09aae1ea0b60c298878e9c5fa576c9",
  "created": 1679929598446,
  "modified": 1679929598447,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "00577c6a-512d-4b8c-8a25-09bae8a22b69",
  "valueDate": 20230327170638,
  "openingDate": 1679929598396,
  "description": "The patient is pregnant",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptedSelf": "6IdDpQngFvwbESUoUkQlLPnmUAEtZ43AsJr1+MQam8ysa2Ho88sa8sFFAsG3aNv6oFxV1Xpn5VM4sSyuWEJNRg=="
  }
}
```
</details>
