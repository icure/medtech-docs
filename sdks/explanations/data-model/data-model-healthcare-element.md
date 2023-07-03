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
