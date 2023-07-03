---
slug: healthcare-element
tags:
    - data model
    - healthcare element
---
# Healthcare Element

A Healthcare Element is a piece of medical information that can give some context about the status of a Patient or to a
series of measurements. 

## When Should I Use a Healthcare Element?

You should use a Healthcare Element when a [Data Owner](/sdks/glossary#data-owner) wants to specify an underlying 
condition related to a Patient, to a visit or to a set of measurements associated to a Patient.

## How is a Healthcare Element Related to Other Entities?

A Healthcare Element:
- may be associated to one or more Data Samples to give a context to their measurements.  
- may use Codings to associate its medical information to the codes of a [Terminology](/sdks/glossary#terminologies).

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

### A Doctor Updating the Status of a Patient

A Doctor (Healthcare Professional) discovers that their Patient is pregnant. Therefore, they update her condition.

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
  "id": "68a213d2-23b2-4d95-b1df-1de467b403fb",
  "rev": "1-996c06c7fea838b2b47eac0d6843a008",
  "created": 1688378941768,
  "modified": 1688378941768,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "68a213d2-23b2-4d95-b1df-1de467b403fb",
  "valueDate": 20230703120901,
  "openingDate": 1688378941744,
  "description": "The patient is pregnant",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
    "encryptedSelf": "wizUUK7TJRTq7OdWIi4U93InI+ZW/XG+dTtRL/8M9zcg58+bC76VAWO3XHWXzuZB3zO1Ap+QiYdGH0DTLPUU3Q=="
  }
}
```
</details>
