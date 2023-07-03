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
  "id": "68f5c324-c37a-46a2-952c-35488f7c7bef",
  "rev": "1-e24cfda23e437c95495feb708b41db96",
  "created": 1688375638866,
  "modified": 1688375638866,
  "author": "14e2a82b-f7a9-44d9-b135-fdf7575f884f",
  "responsible": "1457ac8d-fb1f-4645-aaad-98f093a6c341",
  "healthcareElementId": "68f5c324-c37a-46a2-952c-35488f7c7bef",
  "valueDate": 20230703111358,
  "openingDate": 20230703111358,
  "description": "My period started",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
    ],
    "cryptedForeignKeys": {
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "delegations": {
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "encryptionKeys": {
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "encryptedSelf": "fGl5MMi4boiwHgBJICXbu3fFOXI1TzT2Bj2/roSv4TkTIXzjBySigC98ZQpqg8jh"
  }
}
```
</details>

<!-- output://code-samples/explanation/patient-creates-data-sample/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "1319bd7c-9610-4951-9606-69fcb3354820",
  "qualifiedLinks": {},
  "batchId": "c654b7cc-cbbd-4fa3-9276-f468517d11d7",
  "index": 0,
  "valueDate": 20230703111358,
  "openingDate": 20230703111358,
  "created": 1688375638916,
  "modified": 1688375638916,
  "author": "14e2a82b-f7a9-44d9-b135-fdf7575f884f",
  "responsible": "1457ac8d-fb1f-4645-aaad-98f093a6c341",
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
    "encryptedSelf": "LvH2vlxmWy64ik8f0KaNzkHzIXUGNIXvICqKvVX259MPMalqjO1k/PSYUz1ueLKS7qnjzFuuLkhhWKP2W6YNQprmvVgUy7RGfTGjqp/a2mywvQxn4R/xgmlVTGjDlMsDPlcVsuEshPUyNfY69X2SWw==",
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
    ],
    "cryptedForeignKeys": {
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "delegations": {
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "encryptionKeys": {
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
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
  "id": "a1c28ece-f624-4c7a-b919-e12f04428141",
  "rev": "1-d95edad32e9656c326a946998d31625f",
  "created": 1688375638146,
  "modified": 1688375638146,
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
    "encryptedSelf": "J7pAlo17oR6DUmc3arKprHpErTAQj7383qsGPpd9Y50="
  }
}
```
</details>
