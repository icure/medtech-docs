---
slug: coding
tags:
    - coding
    - code
    - data model
---

# Coding

A Coding represents a code of a [Terminology](/{{sdk}}/glossary#terminologies) (such as SNOMED CT or LOINC).  
A Coding is uniquely identified by:
- **Type**: the Terminology it belongs to (e.g. SNOMED CT)
- **Code**: the unique code in the Terminology (e.g. 84229001)
- **Version**: the version of the Terminology (e.g. 20220901)

## When Should I Use a Coding?

You should use a Coding when a Data Owner wants to define the medical information of other entities, such as Data 
Samples or {{HealthcareElements}}, using standards that are widely used in the medical field rather than in natural language.

## How is a Coding Related to Other Entities?

You can add a Coding to {{HealthcareElements}} and {{Services}}.

:::note

To add a Coding to a Healthcare Element or a {{Service}}, you just need to add its CodingReference, that contains the 
type, code, and version of the coding.

:::

## Examples

### A Doctor Registering a Diagnosis

After a visit, a Doctor register the symptoms the Patient is experiencing ([fatigue](https://snomedbrowser.com/Codes/Details/84229001)) as a new {{Service}}.  
Then, they add the diagnosis ([hay fever](https://snomedbrowser.com/Codes/Details/21719001)) as associated {{HealthcareElement}}.
Instead of using the natural language description for both, the application allows the Doctor to select the proper 
SNOMED CT terms using Codings.

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
<summary>{{healthcareElementNoSpace}}</summary>

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
<summary>{{dataSampleNoSpace}}</summary>

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
