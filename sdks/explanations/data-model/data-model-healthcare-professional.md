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
  "id": "7a6b2227-a886-43be-a33a-94a6771dc27c",
  "rev": "1-fb516453aef2f827be7f0533564fce3c",
  "created": 1682493711304,
  "name": "fdd399d0@icure.com",
  "login": "fdd399d0@icure.com",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "82d4ed50-ab11-4009-98ae-e70536546fe2",
  "email": "fdd399d0@icure.com",
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
  "id": "a72dd3e9-9a50-423c-ae21-35bb380a8e63",
  "rev": "1-9d34cde2b845705807309417c74506be",
  "created": 1682493724426,
  "modified": 1682493724426,
  "author": "3531d4cd-69a7-41d3-b711-e2edaae99875",
  "responsible": "d4817fbd-c84e-486d-92da-daa2aa2edc48",
  "healthcareElementId": "a72dd3e9-9a50-423c-ae21-35bb380a8e63",
  "valueDate": 20230426072204,
  "openingDate": 20230426072204,
  "description": "My diagnosis is that the patient has Hay Fever",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
    ],
    "cryptedForeignKeys": {
      "d4817fbd-c84e-486d-92da-daa2aa2edc48": {}
    },
    "delegations": {
      "d4817fbd-c84e-486d-92da-daa2aa2edc48": {}
    },
    "encryptionKeys": {
      "d4817fbd-c84e-486d-92da-daa2aa2edc48": {}
    },
    "encryptedSelf": "h6wo0KjyPMowE7AgZMKPdPZfbMDp6lgezBtLfhthTQXXZyZ9yqYbZ0+heJWuv36LbHQZu71OLt7AIcbAc2X1xSD1yZuz+EPCZtFn6AiBdus="
  }
}
```
</details>

<!-- output://code-samples/explanation/doctor-shares-data-with-patient/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "51c2fa84-6141-41ad-8fc0-679fc95b7e0b",
  "qualifiedLinks": {},
  "batchId": "5dac91e7-103e-4c7f-a98b-ec8e6d2a37fa",
  "index": 0,
  "valueDate": 20230426072205,
  "openingDate": 20230426072205,
  "created": 1682493725225,
  "modified": 1682493725226,
  "author": "3531d4cd-69a7-41d3-b711-e2edaae99875",
  "responsible": "d4817fbd-c84e-486d-92da-daa2aa2edc48",
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
      "d4817fbd-c84e-486d-92da-daa2aa2edc48": {}
    },
    "delegations": {
      "d4817fbd-c84e-486d-92da-daa2aa2edc48": {}
    },
    "encryptionKeys": {
      "d4817fbd-c84e-486d-92da-daa2aa2edc48": {}
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
    "id": "28a75e22-9d65-4307-9a99-0774d6c7c422",
    "rev": "1-72c27ed9e1cd3a21873dfe975e7ce433",
    "created": 1682493726056,
    "modified": 1682493726056,
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
        "d4817fbd-c84e-486d-92da-daa2aa2edc48": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "d4817fbd-c84e-486d-92da-daa2aa2edc48": {}
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
  "id": "f291f117-9d0c-42a4-82cd-c3d6f6bc1974",
  "rev": "1-cdad5190f3f5075789b09cbd9793a0a8",
  "created": 1682493708885,
  "modified": 1682493708885,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "f291f117-9d0c-42a4-82cd-c3d6f6bc1974",
  "valueDate": 20230426072148,
  "openingDate": 1682493708192,
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
    "encryptedSelf": "de8pQxU4RjsIao5xVoBtnQY/hYb1OSGMldoQPAP832NWPLKaps7IItrW1jRgk5lKLSMGutpvoSNyb/wvPZgZig=="
  }
}
```
</details>
