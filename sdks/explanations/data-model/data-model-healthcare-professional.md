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
  "id": "9ec1e44b-9f52-4102-bd0f-a7952898802f",
  "rev": "1-6d74940885b8204278839e22bd9bfef3",
  "created": 1680075173802,
  "name": "55447a33@icure.com",
  "login": "55447a33@icure.com",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "e6b0e080-37de-4a18-9821-1b66657b9037",
  "email": "55447a33@icure.com",
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
  "id": "88eebad0-dca1-4559-bc85-734c239dffd7",
  "rev": "1-a901a3df1e640b8eee670970958a6b0e",
  "created": 1680075181829,
  "modified": 1680075181829,
  "author": "7b9f5cc1-b2d9-4ab0-8052-5ff8c42fa241",
  "responsible": "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65",
  "healthcareElementId": "88eebad0-dca1-4559-bc85-734c239dffd7",
  "valueDate": 20230329073301,
  "openingDate": 20230329073301,
  "description": "My diagnosis is that the patient has Hay Fever",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
    ],
    "cryptedForeignKeys": {
      "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65": {}
    },
    "delegations": {
      "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65": {}
    },
    "encryptionKeys": {
      "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65": {}
    },
    "encryptedSelf": "sRX1dynPOS7u5axsDZsru1abWAjpGy+lg2AvNmWg1aSNS8Rig+cz2j5FwXPzXSqY+71QiBQZeORBD3yN3XVyeOdoSyq/3K5U08wkT6pglEA="
  }
}
```
</details>

<!-- output://code-samples/explanation/doctor-shares-data-with-patient/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "1f048e92-b619-4cb7-9784-41074666da25",
  "qualifiedLinks": {},
  "batchId": "0028e54a-b674-418e-982f-0c978f0d3d17",
  "index": 0,
  "valueDate": 20230329073302,
  "openingDate": 20230329073302,
  "created": 1680075182305,
  "modified": 1680075182305,
  "author": "7b9f5cc1-b2d9-4ab0-8052-5ff8c42fa241",
  "responsible": "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65",
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
      "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65": {}
    },
    "delegations": {
      "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65": {}
    },
    "encryptionKeys": {
      "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65": {}
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
    "id": "90e059a7-2f5c-4bff-a0e4-8d9545735fc8",
    "rev": "1-ebf3839e7858b3c40cf7722d3fd6ac2b",
    "created": 1680075182795,
    "modified": 1680075182795,
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
        "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65": {}
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
  "id": "06bdea2b-f5b4-42b5-b6fd-1050d052bee4",
  "rev": "1-e3df7a309a7ee746e609a4809b968e9b",
  "created": 1680075172334,
  "modified": 1680075172334,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "06bdea2b-f5b4-42b5-b6fd-1050d052bee4",
  "valueDate": 20230329073252,
  "openingDate": 1680075171966,
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
    "encryptedSelf": "74BmMM6YXhGYHsVuwcV8b0qFgS2kfSZy8i5dgwHgsOGwt4iM+LKbRVOs7OsNKYDgxG4EBa8QilBytMHMB9JK2A=="
  }
}
```
</details>
