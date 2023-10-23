---
slug: healthcare-professional
tags:
    - data model
    - data owner
    - {{hcp}}
---
# Healthcare Professional

A Healthcare Professional is an actor that can manage and is responsible for Patients, Medical Devices and other 
Healthcare Professionals.  
As [Data Owners](/{{sdk}}/glossary#data-owner) they can create medical information and share it with other Data Owners.
Other Data Owner can decide to share their medical information with them.

## When Should I Use a Healthcare Professional?

You should use a Healthcare Professional when you need to represent a Doctor, or another actor responsible for patients,
medical data, and treatments, in your application.

## How is a Healthcare Professional Related to Other Entities?

A Healthcare Professional can:
- create Users for other Patients, Medical Devices, and Healthcare Professionals.  
- manage other Users, by changing their passwords or deactivating them.  
- create {{Services}} and {{HealthcareElements}} for Patients.  
- share {{Services}} and {{HealthcareElements}} with other Data Owners.  
- create Notifications and  update the ones shared with them.

## Examples

### A Doctor Inviting a Patient

A Doctor (Healthcare Professional) visits for the first time a Patient. After the visit, they invite the patient
to the iCure platform.

<!-- file://code-samples/{{sdk}}/explanation/doctor-invites-a-patient/index.mts snippet:doctor invites user-->
```typescript
const messageFactory = new ICureRegistrationEmail(hcp, 'test', 'iCure', existingPatient)
const createdUser = await api.userApi.createAndInviteUser(existingPatient, messageFactory)
```
<!-- output://code-samples/{{sdk}}/explanation/doctor-invites-a-patient/createdUser.txt -->
<details>
<summary>createdUser</summary>

```json
{
  "id": "ccdbc448-d077-4e56-b6ba-c4402e2c2b69",
  "rev": "1-dec65f6eeea486564c3ec2cd171a0331",
  "created": 1679997648117,
  "name": "46d07176@icure.com",
  "login": "46d07176@icure.com",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "5c0dbd86-9f09-4ab9-8a94-6d5d1a37ca91",
  "email": "46d07176@icure.com",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {}
}
```
</details>

### A Doctor Registering a Visit and Sharing the Outcome with the Patient

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new {{Service}}.  
Then, they add the diagnosis (hay fever) as associated Healthcare Element.

<!-- file://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/index.mts snippet:doctor shares medical data-->
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
<!-- output://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
{
  "id": "90204e83-14a1-48f5-9e9f-5633d0f0c42a",
  "rev": "1-a3fc371acc6ffbd2c0da58729fe70491",
  "created": 1679997660649,
  "modified": 1679997660649,
  "author": "731d1e22-37e9-4e0f-8d4d-f5ad2b7f18c4",
  "responsible": "fa2f6b0f-dabd-4943-84f6-35ad63a860cb",
  "healthcareElementId": "90204e83-14a1-48f5-9e9f-5633d0f0c42a",
  "valueDate": 20230328100100,
  "openingDate": 20230328100100,
  "description": "My diagnosis is that the patient has Hay Fever",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
    ],
    "cryptedForeignKeys": {
      "fa2f6b0f-dabd-4943-84f6-35ad63a860cb": {}
    },
    "delegations": {
      "fa2f6b0f-dabd-4943-84f6-35ad63a860cb": {}
    },
    "encryptionKeys": {
      "fa2f6b0f-dabd-4943-84f6-35ad63a860cb": {}
    },
    "encryptedSelf": "mN6jtZ0AihLZ4tuim6ozcUZeIcQgyiYo+4ms07l4AJSBn+iiD3jngc/Z+4gEM+GWNXz7n3pzJ49Q+O6SmGqX6zUChPnNvgPZ/HniMuQ6qdY="
  }
}
```
</details>

<!-- output://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "53026d1a-4ed1-44c6-a4f4-9b264fb15822",
  "qualifiedLinks": {},
  "batchId": "649a6fb6-1d2b-42a1-9d61-74d118ffe049",
  "index": 0,
  "valueDate": 20230328100101,
  "openingDate": 20230328100101,
  "created": 1679997661282,
  "modified": 1679997661282,
  "author": "731d1e22-37e9-4e0f-8d4d-f5ad2b7f18c4",
  "responsible": "fa2f6b0f-dabd-4943-84f6-35ad63a860cb",
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
      "fa2f6b0f-dabd-4943-84f6-35ad63a860cb": {}
    },
    "delegations": {
      "fa2f6b0f-dabd-4943-84f6-35ad63a860cb": {}
    },
    "encryptionKeys": {
      "fa2f6b0f-dabd-4943-84f6-35ad63a860cb": {}
    }
  }
}
```
</details>

After that, the Doctor checks if there are new Notifications from the Patient and shares the data with them.

<!-- file://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/index.mts snippet:doctor receives notification-->
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
<!-- output://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/newPatientNotifications.txt -->
<details>
<summary>newPatientNotifications</summary>

```text
[
  {
    "id": "bb9ecb0a-7ccb-46c6-93f6-819b93590f8e",
    "rev": "1-a020a2fffee07382ba131351377ee192",
    "created": 1679997661848,
    "modified": 1679997661848,
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
        "fa2f6b0f-dabd-4943-84f6-35ad63a860cb": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "fa2f6b0f-dabd-4943-84f6-35ad63a860cb": {}
      }
    }
  }
]
```
</details>

### A Doctor Updating the Status of a Patient

A Doctor (Healthcare Professional) discovers that their Patient is pregnant. Therefore, they update her condition in the
application.

<!-- file://code-samples/{{sdk}}/explanation/doctor-creates-he/index.mts snippet:doctor can create HE-->
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
<!-- output://code-samples/{{sdk}}/explanation/doctor-creates-he/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
{
  "id": "7eb81d0e-b11a-4886-b5cc-fcc64d482d7b",
  "rev": "1-5b29be8c488d2acf731454dfc15cc995",
  "created": 1679997646588,
  "modified": 1679997646588,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "7eb81d0e-b11a-4886-b5cc-fcc64d482d7b",
  "valueDate": 20230328100046,
  "openingDate": 1679997646130,
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
    "encryptedSelf": "XXqVThq9xvjrtWx93heJcf56BCgZtIxTX5gEuuhQYH9HZ95RCaWOYLABjfYt7ZdPCP6oKjduxv+uPzHFgUiK8w=="
  }
}
```
</details>
