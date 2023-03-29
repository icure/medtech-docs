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
  "id": "ec056451-13f3-4a01-8011-33dfe51676be",
  "rev": "1-8e949dc799cf35787b5d427b42307dc3",
  "created": 1680075187899,
  "modified": 1680075187899,
  "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
  "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
  "healthcareElementId": "ec056451-13f3-4a01-8011-33dfe51676be",
  "valueDate": 20230329073307,
  "openingDate": 20230329073307,
  "description": "My period started",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
    ],
    "cryptedForeignKeys": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "delegations": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "encryptionKeys": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "encryptedSelf": "rlFoiLomBkC6eqSqAMcVWbBTNLF4LtG479T3H/Y6y2Nq9+bIWIsEIFobcMemkZuo"
  }
}
```
</details>

<!-- output://code-samples/explanation/patient-creates-data-sample/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "9b7babc0-257b-4354-a932-3d22aca17b5a",
  "qualifiedLinks": {},
  "batchId": "2e6baf22-c113-41f9-a90c-e1ba35f2e33a",
  "index": 0,
  "valueDate": 20230329073308,
  "openingDate": 20230329073308,
  "created": 1680075188375,
  "modified": 1680075188375,
  "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
  "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
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
    "secretForeignKeys": [
      "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
    ],
    "cryptedForeignKeys": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "delegations": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "encryptionKeys": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    }
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
  "id": "90e059a7-2f5c-4bff-a0e4-8d9545735fc8",
  "rev": "1-ebf3839e7858b3c40cf7722d3fd6ac2b",
  "created": 1680075182795,
  "modified": 1680075182795,
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
      "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65": {}
    },
    "encryptionKeys": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
      "2275c045-7c0c-4fa8-8f1c-83f6ad75ad65": {}
    }
  }
}
```
</details>
