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
  "id": "3810a809-dd59-4ee6-9782-c50a507a618f",
  "rev": "1-01993e6f38df5d34fc24c71d08a3430c",
  "created": 1679928225518,
  "name": "7ad50e14@icure.com",
  "login": "7ad50e14@icure.com",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "8f29506a-46fb-4de2-b682-dd83c43b9706",
  "email": "7ad50e14@icure.com",
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
  "id": "ceeda6a0-4cdb-407c-b092-b757d593f3d9",
  "rev": "1-672f016a873eef7b071855892409b1c4",
  "created": 1679928224753,
  "modified": 1679928224753,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "ceeda6a0-4cdb-407c-b092-b757d593f3d9",
  "valueDate": 20230327164344,
  "openingDate": 1679928224698,
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
    "encryptedSelf": "2R5OeezfFxcB4v/mLDZIL0o/7+SGE9Ct3EG1tbRGuNZesmdfyA6h2q30JgctoFFcjAqE+W4YpECF6hkrlpejuw=="
  }
}
```
</details>
