---
slug: patient
tags:
    - data model
    - data owner
    - patient
---
# Patient

A Patient is the subject of all the medical processes. They can register to iCure autonomously or be invited by Healthcare Professionals.
Healthcare professionals can associate Data Samples and Healthcare Elements to Patients.
Additionally, as [Data Owners](/sdks/glossary#data-owner) Patients can also ask to access this data or create
Data Samples and Healthcare Elements by themselves.

## When Should I Use a Patient?

You should use a Patient when you need to represent the recipient of the medical care in your application.

## How is a Patient Related to Other Entities?

A Healthcare Professional can create a Patient.  
A Patient can create Data Samples and Healthcare Elements.  
A Patient can ask to access a Data Sample or a Healthcare Element by creating a Notification to a Healthcare Professional.  

## Examples

### A Patient Registering Their Symptoms

A Patient has a period tracking app and wants to register that her period started and that she is experiencing a headache.
She will create a Healthcare Element to register that her period started, then she will create a Data Sample associated to the Healthcare Element to register the headache.

<!-- file://code-samples/explanation/patient-creates-data-sample/index.mts snippet:patient can create DS and HE-->
```typescript
const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'My period started',
  }),
  patient.id,
)

const dataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    content: {
      en: new Content({
        stringValue: 'I have a headache',
      }),
    },
    healthcareElementIds: new Set([healthcareElement.id]),
  }),
)
```
<!-- output://code-samples/explanation/patient-creates-data-sample/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
{
  "id": "e1b17f65-358e-4c55-8119-59d047a1f396",
  "rev": "1-0b860e3ccce0959eb2ae2db0d51a6310",
  "created": 1688378944382,
  "modified": 1688378944382,
  "author": "9bcfa0be-af9a-4d3e-a3da-321270563e24",
  "responsible": "d8df1f2b-938c-46c0-a85c-015117142cc6",
  "healthcareElementId": "e1b17f65-358e-4c55-8119-59d047a1f396",
  "valueDate": 20230703120904,
  "openingDate": 20230703120904,
  "description": "My period started",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "baa346f5-db86-4317-8115-0f7d2c5b075e"
    ],
    "cryptedForeignKeys": {
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "delegations": {
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "encryptionKeys": {
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "encryptedSelf": "Htq/RR4p5EQaXKuCfk692gBeUb8XniKTuXwOb+c3FOJ5Y+5RmHjYaCRRfayR/k6K"
  }
}
```
</details>

<!-- output://code-samples/explanation/patient-creates-data-sample/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "b5c4fa09-e97e-43c8-bdd3-a799ae35ce5b",
  "qualifiedLinks": {},
  "batchId": "72a4f0fd-e1cc-4719-a816-400801e70966",
  "index": 0,
  "valueDate": 20230703120904,
  "openingDate": 20230703120904,
  "created": 1688378944443,
  "modified": 1688378944443,
  "author": "9bcfa0be-af9a-4d3e-a3da-321270563e24",
  "responsible": "d8df1f2b-938c-46c0-a85c-015117142cc6",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "I have a headache",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "encryptedSelf": "r3a47An2aJrbJWug1hnquOc+TREkF4he9hak5d2OVLw2DA3+CIyX5pVaUbqTKZhK26dg1OqmrwbWgl/zVF95lx3iyshBkhxiCyEjwMC2zoHtZRB2/2C7lhtfdv5y7cHvsYKrIy9BtJNqS1xOaBKvEg==",
    "secretForeignKeys": [
      "baa346f5-db86-4317-8115-0f7d2c5b075e"
    ],
    "cryptedForeignKeys": {
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "delegations": {
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "encryptionKeys": {
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

### A Patient Asking a Doctor to Access Their Own Data

A Patient goes for a first visit to a Doctor. The Doctor registers them and, after the visit, the Patient creates a 
Notification to ask the Doctor to access the outcome of the visit.

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
  "id": "21f14c4b-92f7-4a3a-8ab2-1bc83441710e",
  "rev": "1-65b155cc47e6a73808d6f2f45d36c04b",
  "created": 1688378943614,
  "modified": 1688378943614,
  "author": "9bcfa0be-af9a-4d3e-a3da-321270563e24",
  "responsible": "d8df1f2b-938c-46c0-a85c-015117142cc6",
  "status": "pending",
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
```
</details>
