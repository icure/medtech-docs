---
slug: data-sample
tags:
    - data model
    - data sample
---
# Data Sample

A Data Sample represents a piece of medical information related to a Patient provided by a [Data Owner](/sdks/glossary#data-owner) 
at a defined moment of time.  
According to the Data Owner that created it, a Data Sample can contain either biometric measurements or other type of 
unstructured medical data, or both.  

## When Should I Use a Data Sample?

You should use a Data Sample when a Data Owner wants to register some kind of objective or subjective medical data 
related to a Patient.

## How is a Data Sample Related to Other Entities?

A Data Sample:
- Is always associated to a Patient.
- May be linked to oner or more Healthcare Elements, in order to provide a context for its measure.
- May have a Coding, which associates the medical information or the measurement to the code of a
[Terminology](/sdks/glossary#terminologies).

## Examples

### A Patient Registering Their Symptoms

A Patient has a period tracking app and wants to add some symptoms she is experiencing (headache) by adding a new Data Sample.
Then, she adds the information that her period started as a Healthcare Element associated to the Data Sample.

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

### A Doctor Registering a Visit

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new Data Sample.  
Then, they add the diagnosis (hay fever) as associated Healthcare Element.

<!-- file://code-samples/explanation/data-sample-w-coding/index.mts snippet:doctor can create DS and HE-->
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
<!-- output://code-samples/explanation/data-sample-w-coding/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
{
  "id": "9e763ba6-3c0c-4cef-a427-ea43071aca17",
  "rev": "1-983a54fa06a7a3dd2c77872d74d729f9",
  "created": 1679929587447,
  "modified": 1679929587447,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "9e763ba6-3c0c-4cef-a427-ea43071aca17",
  "valueDate": 20230327170627,
  "openingDate": 20230327170627,
  "description": "My diagnosis is that the patient has Hay Fever",
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
    "encryptedSelf": "a9juQafYm6NjH78m66PBM1npm6oTGPhNFvJf5bhSR2wijlqigPVY/iPyWC1eNy6Fz96X57B3usRGypTSaKXRbA4TSwbC95w2WusBYbdW81M="
  }
}
```
</details>

<!-- output://code-samples/explanation/data-sample-w-coding/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "f510bd7d-5953-4711-a40a-49d6392260d1",
  "qualifiedLinks": {},
  "batchId": "607fc68f-d245-43fb-ac5a-fe32a7a0fd02",
  "index": 0,
  "valueDate": 20230327170627,
  "openingDate": 20230327170627,
  "created": 1679929587565,
  "modified": 1679929587565,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
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
    }
  }
}
```
</details>
