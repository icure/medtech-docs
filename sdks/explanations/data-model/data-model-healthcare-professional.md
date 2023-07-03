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
  "id": "f9ae2441-cb35-4a4c-bcc2-d87d9d045835",
  "rev": "1-4612fed481010a57d45deaee2fa2d9e9",
  "created": 1688375637135,
  "name": "740d356d@icure.com",
  "login": "740d356d@icure.com",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "c4eec5b6-0d62-4cba-8ad8-614e1df660d2",
  "email": "740d356d@icure.com",
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
  "id": "25a46efc-96c7-4f65-9f9c-a10b7e9ef24b",
  "rev": "1-0b02cbf013763ec2c9b319f9e242ab26",
  "created": 1688375638088,
  "modified": 1688375638088,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "25a46efc-96c7-4f65-9f9c-a10b7e9ef24b",
  "valueDate": 20230703111358,
  "openingDate": 20230703111358,
  "description": "My diagnosis is that the patient has Hay Fever",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
    "encryptedSelf": "lhgG/jBFbq8ov1+01xVPz2TXdJYY4rfKLJcEDst9XEy4MifxWnUYodpVNdx7ozVhrIp8Qoxd+0a3awa6bNvuC+CbFh/RQvMqOQKNA1MXCXA="
  }
}
```
</details>

<!-- output://code-samples/explanation/doctor-shares-data-with-patient/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "a45fad0a-bfc1-4b2c-a0bb-d9cd55bd2811",
  "qualifiedLinks": {},
  "batchId": "aefd6e81-bfea-42ab-b639-98b9ee5f5248",
  "index": 0,
  "valueDate": 20230703111358,
  "openingDate": 20230703111358,
  "created": 1688375638132,
  "modified": 1688375638131,
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
    "encryptedSelf": "zLCR5yXnEbq8qBHCTVTLD3xhF5TZNQwsql/4I45m+cJvc80Xg60fMY+KyzNDKqpMSyjJEJV2Wm5dq6wx+BKkCBWpLXVfyYRsfuit4UzT+y/2KA2MLJa1Qd0lsMoV1xKe750zuKPFI+n3qZ7gClW+nSz8mLJpZqLWIUuxwxTJHHM=",
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
    "id": "a1c28ece-f624-4c7a-b919-e12f04428141",
    "rev": "1-d95edad32e9656c326a946998d31625f",
    "created": 1688375638146,
    "modified": 1688375638146,
    "author": "14e2a82b-f7a9-44d9-b135-fdf7575f884f",
    "responsible": "1457ac8d-fb1f-4645-aaad-98f093a6c341",
    "status": "completed",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "1457ac8d-fb1f-4645-aaad-98f093a6c341": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptionKeys": {
        "1457ac8d-fb1f-4645-aaad-98f093a6c341": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptedSelf": "J7pAlo17oR6DUmc3arKprHpErTAQj7383qsGPpd9Y50="
    }
  },
  {
    "id": "3796628c-a302-4e42-af5d-619a4769337a",
    "rev": "1-eb641d7c97359fca12dbccfd05d86527",
    "created": 1688375623944,
    "modified": 1688375623944,
    "author": "14e2a82b-f7a9-44d9-b135-fdf7575f884f",
    "responsible": "1457ac8d-fb1f-4645-aaad-98f093a6c341",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "1457ac8d-fb1f-4645-aaad-98f093a6c341": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptionKeys": {
        "1457ac8d-fb1f-4645-aaad-98f093a6c341": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptedSelf": "fu1O5aJ+mrVmx5+5S344YKkwSYrT/lIeEvH2ltFgbQk="
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
  "id": "db88d52d-15c2-406b-bf4c-aa8ef3297ca1",
  "rev": "1-63ff9e411d9310799d7c4f13af2e5a93",
  "created": 1688375636420,
  "modified": 1688375636420,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "db88d52d-15c2-406b-bf4c-aa8ef3297ca1",
  "valueDate": 20230703111356,
  "openingDate": 1688375636390,
  "description": "The patient is pregnant",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
    "encryptedSelf": "ggBwCs1qSRLmodgJPwoo1/vjadzFToPVbLdbBtKVgESgtdv81EbyMhhbzLjbl3nEkGKxdZVOItvEF6+OMRRz3A=="
  }
}
```
</details>
