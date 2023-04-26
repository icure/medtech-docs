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
  "id": "6b758b2f-9019-4973-bc8e-0c0432a9158c",
  "rev": "1-8b7f2fb10583a094125b162504578b32",
  "created": 1682493732610,
  "modified": 1682493732610,
  "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
  "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
  "healthcareElementId": "6b758b2f-9019-4973-bc8e-0c0432a9158c",
  "valueDate": 20230426072212,
  "openingDate": 20230426072212,
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
    "encryptedSelf": "Phu1EfE1fTr2HlIYS5et3r6kDvXHIxikV6QNy+BMn7IZ36F3jBgX3e7XlI4DtAVk"
  }
}
```
</details>

<!-- output://code-samples/explanation/patient-creates-data-sample/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "ed27aa30-3cb2-4cea-87b5-9fcdc0112afd",
  "qualifiedLinks": {},
  "batchId": "a777d454-a3c2-49d9-92bb-f47c3d9325d0",
  "index": 0,
  "valueDate": 20230426072213,
  "openingDate": 20230426072213,
  "created": 1682493733381,
  "modified": 1682493733381,
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
