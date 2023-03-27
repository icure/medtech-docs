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
  "id": "27ad9a27-7dd8-4fb3-848f-53f5c825235d",
  "rev": "1-e22b436b5c8de0d4671b6d69c349d135",
  "created": 1679927940303,
  "name": "a5aa98f1@icure.com",
  "login": "a5aa98f1@icure.com",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "a4740c7a-7622-476b-a2f0-7193357d8db1",
  "email": "a5aa98f1@icure.com",
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
  "id": "bcf8e2bd-c205-488b-82b0-4d628d13910e",
  "rev": "1-6cecbbd9ad1e1936f309aa0f2237a8b8",
  "created": 1679927933402,
  "modified": 1679927933402,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "bcf8e2bd-c205-488b-82b0-4d628d13910e",
  "valueDate": 20230327163853,
  "openingDate": 1679927933353,
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
    "encryptedSelf": "2Sew0lYQyJcGEEU57YRPZvzbj8j9WTX8GnSoUz+DrRyVu9Is2cY38gHeWsL/KZvhXh6ejE/Fd1Z4wMo1aSFC0g=="
  }
}
```
</details>
