---
slug: healthcare-element
tags:
    - data model
    - {{healthcareElement}}
---
# Healthcare Element

A Healthcare Element is a piece of medical information that can give some context about the status of a Patient or to a
series of measurements. 

## When Should I Use a Healthcare Element?

You should use a Healthcare Element when a [Data Owner](/{{sdk}}/glossary#data-owner) wants to specify an underlying 
condition related to a Patient, to a visit or to a set of measurements associated to a Patient.

## How is a Healthcare Element Related to Other Entities?

A Healthcare Element:
- may be associated to one or more {{Services}} to give a context to their measurements.  
- may use Codings to associate its medical information to the codes of a [Terminology](/{{sdk}}/glossary#terminologies).

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

### A Doctor Updating the Status of a Patient

A Doctor (Healthcare Professional) discovers that their Patient is pregnant. Therefore, they update her condition.

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
