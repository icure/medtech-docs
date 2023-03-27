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
  "id": "74679ab7-69d2-4288-b065-688429e8096a",
  "rev": "1-dfbe20cf52427ab41925d1038c7a7f2c",
  "created": 1679928223813,
  "modified": 1679928223813,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "74679ab7-69d2-4288-b065-688429e8096a",
  "valueDate": 20230327164343,
  "openingDate": 20230327164343,
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
    "encryptedSelf": "Q3wbLUw760q0oUP0CUBGTLDvAe1cniuJJypjzpt1KWdrmNra4n9VM1bDtZCxPH+tjJMnrL/xij16BvhkYD8IJr0AIu6zN/mkBxa5yEaj7nY="
  }
}
```
</details>

<!-- output://code-samples/explanation/data-sample-w-coding/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "c3be37dd-739c-4614-9f60-5d79b822abfd",
  "qualifiedLinks": {},
  "batchId": "cb6ec94f-d921-4d22-95ec-069bea6b6da4",
  "index": 0,
  "valueDate": 20230327164344,
  "openingDate": 20230327164344,
  "created": 1679928224038,
  "modified": 1679928224038,
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
