---
slug: healthcare-professional
tags:
    - data model
    - data owner
    - {{ hcp }}
---
# Healthcare Professional

A Healthcare Professional is an actor that can manage and is responsible for Patients, Medical Devices and other 
Healthcare Professionals.  
As [Data Owners](/{{ sdk }}/glossary#data-owner) they can create medical information and share it with other Data Owners.
Other Data Owner can decide to share their medical information with them.

## When Should I Use a Healthcare Professional?

You should use a Healthcare Professional when you need to represent a Doctor, or another actor responsible for patients,
medical data, and treatments, in your application.

## How is a Healthcare Professional Related to Other Entities?

A Healthcare Professional can:
- create Users for other Patients, Medical Devices, and Healthcare Professionals.  
- manage other Users, by changing their passwords or deactivating them.  
- create {{ Services }} and {{ HealthcareElements }} for Patients.  
- share {{ Services }} and {{ HealthcareElements }} with other Data Owners.  
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
  "id": "cfee7e51-7fb3-4e66-9348-26dcbf869dac",
  "rev": "1-ce781b826cbf86448aa0e9d2c8993e01",
  "created": 1688378942543,
  "name": "6e1ed36a@icure.com",
  "login": "6e1ed36a@icure.com",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "286a2ae5-aff2-4e81-a9a9-e9ebc9d1941e",
  "email": "6e1ed36a@icure.com",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {}
}
```
</details>

### A Doctor Registering a Visit and Sharing the Outcome with the Patient

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new {{ Service }}.  
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
  "id": "81b03963-bf41-4ea9-bee2-18cb64f8a5d0",
  "rev": "1-a68177aac5893ec916446e0489cf4e9f",
  "created": 1688378943488,
  "modified": 1688378943488,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "81b03963-bf41-4ea9-bee2-18cb64f8a5d0",
  "valueDate": 20230703120903,
  "openingDate": 20230703120903,
  "description": "My diagnosis is that the patient has Hay Fever",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptedSelf": "HLu9rC/lCUhceyiBFODQk0CajB1Qo3mG3bhF2Q1AWVBkbczQLIe725XYUBQ5f4s4AwyNVK7lloI2ynx0bes7T9oylPtAIE/lWiupJ1XJ/z8="
  }
}
```
</details>

<!-- output://code-samples/explanation/doctor-shares-data-with-patient/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "d2e3a7c6-6074-4cb9-b634-3ca4058c3b5a",
  "qualifiedLinks": {},
  "batchId": "4b0ed737-9569-4f3a-b710-594415bf6ff2",
  "index": 0,
  "valueDate": 20230703120903,
  "openingDate": 20230703120903,
  "created": 1688378943529,
  "modified": 1688378943529,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "encryptedSelf": "dctsYBHtQqHIvFgTMMLkqcHwnpWZ8yxrBruEZSS/ZQkjP2ZV+GFmfSntGhpk8o+8V+GBWpKzMZzmWReSo4F90Ox2V1V+DwD9+OSeLqy7sq8JyimQKs/Xui4R39mvOqaCseboJx8llhOMu58Yao/ABGOk2aRibxOj/DvRwiNHcP0=",
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "publicKeysForOaepWithSha256": {}
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
    "id": "21f14c4b-92f7-4a3a-8ab2-1bc83441710e",
    "rev": "1-65b155cc47e6a73808d6f2f45d36c04b",
    "created": 1688378943614,
    "modified": 1688378943614,
    "author": "9bcfa0be-af9a-4d3e-a3da-321270563e24",
    "responsible": "d8df1f2b-938c-46c0-a85c-015117142cc6",
    "status": "completed",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "d8df1f2b-938c-46c0-a85c-015117142cc6": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptionKeys": {
        "d8df1f2b-938c-46c0-a85c-015117142cc6": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptedSelf": "Fm064ir2QPytWbI5RiCmg4t1kzNnf6YAodkKog2gAwg="
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
  "id": "68a213d2-23b2-4d95-b1df-1de467b403fb",
  "rev": "1-996c06c7fea838b2b47eac0d6843a008",
  "created": 1688378941768,
  "modified": 1688378941768,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "68a213d2-23b2-4d95-b1df-1de467b403fb",
  "valueDate": 20230703120901,
  "openingDate": 1688378941744,
  "description": "The patient is pregnant",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptedSelf": "wizUUK7TJRTq7OdWIi4U93InI+ZW/XG+dTtRL/8M9zcg58+bC76VAWO3XHWXzuZB3zO1Ap+QiYdGH0DTLPUU3Q=="
  }
}
```
</details>
