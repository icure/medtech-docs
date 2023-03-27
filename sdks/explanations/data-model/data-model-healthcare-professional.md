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
  "id": "ca5118af-07b2-42ca-9f73-85af66556ec6",
  "rev": "1-55e01e1fe1a448fc141e693bfe5270f7",
  "created": 1679926863991,
  "name": "57f9b172@icure.com",
  "login": "57f9b172@icure.com",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "aa2c8fa9-0bb9-4a65-bc22-3cba0647dd9c",
  "email": "57f9b172@icure.com",
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
    "id": "08b629a0-486e-4746-9ee2-13b07a425223",
    "rev": "1-d9e4db4677deac384eabf14d077b06b9",
    "created": 1679926465677,
    "modified": 1679926465677,
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
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "867f2933-aeab-4c72-86d0-19d210d9b970",
    "rev": "1-5958f8cd45dbdb67c970cc7313fe47eb",
    "created": 1679926244077,
    "modified": 1679926244077,
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
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "a65d7657-3391-431b-9872-941cc3c7d489",
    "rev": "1-bfde6894ac0c0cb56e75927a1c523fd2",
    "created": 1679925849955,
    "modified": 1679925849955,
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
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "e1de0bdb-210c-4714-ace2-f754a9d710ae",
    "rev": "1-5e25b2aa812122e2c68185dbff9d7ce6",
    "created": 1679924658464,
    "modified": 1679924658464,
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
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "f39ecbc2-08fd-43a8-b9fe-44815661bef1",
    "rev": "1-04738d5e98c1c2f7c3de713e2a778351",
    "created": 1679924397742,
    "modified": 1679924397742,
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
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "3f686d41-6bf0-40b7-b3c7-d2505c318b29",
    "rev": "1-44a0d898b07a30b72d16cb6f4e2cb564",
    "created": 1679923798190,
    "modified": 1679923798190,
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
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "25f99cd0-fc8b-4f05-accc-d74b99cd6e5e",
    "rev": "1-f84a220f33cea4bcea8b9cfe374b5ae9",
    "created": 1679920642531,
    "modified": 1679920642531,
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
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "6abae71b-c44b-45db-909d-ef3715b36a80",
    "rev": "1-511cf5b3a9de410f5295cd41ee47b3eb",
    "created": 1679920308705,
    "modified": 1679920308705,
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
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "43192bf9-4f72-454e-ae4a-692249e7af3c",
    "rev": "1-2b145be29a7773bb5e3f86b2b8aeb963",
    "created": 1679920182773,
    "modified": 1679920182773,
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
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
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
  "id": "c8965679-b88c-4138-ba1a-c32678886b5b",
  "rev": "1-b370d2a1470d400172293b4314a55ac5",
  "created": 1679926459426,
  "modified": 1679926459426,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "c8965679-b88c-4138-ba1a-c32678886b5b",
  "valueDate": 20230327141419,
  "openingDate": 1679926459134,
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
    "encryptedSelf": "YIesLsMTi4wp/c7b20tsPXga3BhxSsxhOAQBxapujKG8kfp5QAAuk4fZAsdcA1Dapy+ZsNSYs6AR3ZfVftN5DA=="
  }
}
```
</details>
