---
slug: patient
tags:
    - data model
    - data owner
    - patient
---
# Patient

A Patient is the subject of all the medical processes. They can register to iCure autonomously or be invited by Healthcare Professionals.
{{Hcps}} can associate {{Services}} and {{HealthcareElements}} to Patients.
Additionally, as [Data Owners](/{{sdk}}/glossary#data-owner) Patients can also ask to access this data or create
{{Services}} and {{HealthcareElements}} by themselves.

## When Should I Use a Patient?

You should use a Patient when you need to represent the recipient of the medical care in your application.

## How is a Patient Related to Other Entities?

A Healthcare Professional can create a Patient.  
A Patient can create {{Services}} and {{HealthcareElements}}.  
A Patient can ask to access a {{Service}} or a Healthcare Element by creating a Notification to a Healthcare Professional.  

## Examples

### A Patient Registering Their Symptoms

A Patient has a period tracking app and wants to register that her period started and that she is experiencing a headache.
She will create a Healthcare Element to register that her period started, then she will create a {{Service}} associated to the Healthcare Element to register the headache.

<!-- file://code-samples/{{sdk}}/explanation/patient-creates-data-sample/index.mts snippet:patient can create DS and HE-->
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
<!-- output://code-samples/{{sdk}}/explanation/patient-creates-data-sample/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
{
  "id": "9b3cb285-2c43-4b1b-8ba7-fdd400637f3f",
  "rev": "1-092c876a88e049bbede6bea952452262",
  "created": 1679997666743,
  "modified": 1679997666743,
  "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
  "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
  "healthcareElementId": "9b3cb285-2c43-4b1b-8ba7-fdd400637f3f",
  "valueDate": 20230328100106,
  "openingDate": 20230328100106,
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
    "encryptedSelf": "oaxZS7/yN0aSE53tdLLfZIiku+wJOGnF/zkx2aYc1BbCY7hD5YjH3Ksq+6fWRE0x"
  }
}
```
</details>

<!-- output://code-samples/{{sdk}}/explanation/patient-creates-data-sample/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "0046342e-f5c2-4db7-af40-030998388386",
  "qualifiedLinks": {},
  "batchId": "32559cbf-814b-4626-8242-b076f94b567a",
  "index": 0,
  "valueDate": 20230328100107,
  "openingDate": 20230328100107,
  "created": 1679997667245,
  "modified": 1679997667246,
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

<!-- file://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/index.mts snippet:patient sends notification-->
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
<!-- output://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/notification.txt -->
<details>
<summary>notification</summary>

```json
{
  "id": "bb9ecb0a-7ccb-46c6-93f6-819b93590f8e",
  "rev": "1-a020a2fffee07382ba131351377ee192",
  "created": 1679997661848,
  "modified": 1679997661848,
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
      "fa2f6b0f-dabd-4943-84f6-35ad63a860cb": {}
    },
    "encryptionKeys": {
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
      "fa2f6b0f-dabd-4943-84f6-35ad63a860cb": {}
    }
  }
}
```
</details>
