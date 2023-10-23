---
slug: service
tags:
    - data model
    - {{service}}
---
# {{Service}}

A {{Service}} represents a piece of medical information related to a Patient provided by a [Data Owner](/{{sdk}}/glossary#data-owner) 
at a defined moment of time.  
According to the Data Owner that created it, a {{Service}} can contain either biometric measurements or other type of 
unstructured medical data, or both.  

## When Should I Use a {{Service}}?

You should use a {{Service}} when a Data Owner wants to register some kind of objective or subjective medical data 
related to a Patient.

## How is a {{Service}} Related to Other Entities?

A {{Service}}:
- Is always associated to a Patient.
- May be linked to oner or more {{HealthcareElements}}, in order to provide a context for its measure.
- May have a Coding, which associates the medical information or the measurement to the code of a
[Terminology](/{{sdk}}/glossary#terminologies).

## Examples

### A Patient Registering Their Symptoms

A Patient has a period tracking app and wants to add some symptoms she is experiencing (headache) by adding a new {{Service}}.
Then, she adds the information that her period started as a Healthcare Element associated to the {{Service}}.

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

### A Doctor Registering a Visit

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new {{Service}}.  
Then, they add the diagnosis (hay fever) as associated Healthcare Element.

<!-- file://code-samples/{{sdk}}/explanation/data-sample-w-coding/index.mts snippet:doctor can create DS and HE-->
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
<!-- output://code-samples/{{sdk}}/explanation/data-sample-w-coding/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
{
  "id": "dcecd029-a957-47be-b950-5493dc66b886",
  "rev": "1-57784152c3a73d536e80b2954398eb73",
  "created": 1679997643409,
  "modified": 1679997643409,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "dcecd029-a957-47be-b950-5493dc66b886",
  "valueDate": 20230328100043,
  "openingDate": 20230328100043,
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
    "encryptedSelf": "R2G3aeSUeLmHwq9PL8o/D+8HZMiNqwEG9RUPFj0dZhtEPy/oESzurR0AfUqUmv5lvOoogQfgnuhKuVjTcPAAbs9L+vZd0O8tEJ5ZBYqN1Pg="
  }
}
```
</details>

<!-- output://code-samples/{{sdk}}/explanation/data-sample-w-coding/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "6ef07673-05a4-445c-b0ba-9f19702ee9ac",
  "qualifiedLinks": {},
  "batchId": "34a978e1-8de5-4b94-895a-0d054f7dc976",
  "index": 0,
  "valueDate": 20230328100044,
  "openingDate": 20230328100044,
  "created": 1679997644163,
  "modified": 1679997644163,
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
