---
slug: coding
tags:
    - coding
    - code
    - data model
---

# Coding

A Coding represents a code of a [Terminology](/sdks/glossary#terminologies) (such as SNOMED CT or LOINC).  
A Coding is uniquely identified by:
- **Type**: the Terminology it belongs to (e.g. SNOMED CT)
- **Code**: the unique code in the Terminology (e.g. 84229001)
- **Version**: the version of the Terminology (e.g. 20220901)

## When Should I Use a Coding?

You should use a Coding when a Data Owner wants to define the medical information of other entities, such as Data 
Samples or Healthcare Elements, using standards that are widely used in the medical field rather than in natural language.

## How is a Coding Related to Other Entities?

You can add a Coding to Healthcare Elements and Data Samples.

:::note

To add a Coding to a Healthcare Element or a Data Sample, you just need to add its CodingReference, that contains the 
type, code, and version of the coding.

:::

## Examples

### A Doctor Registering a Diagnosis

After a visit, a Doctor register the symptoms the Patient is experiencing ([fatigue](https://snomedbrowser.com/Codes/Details/84229001)) as a new Data Sample.  
Then, they add the diagnosis ([hay fever](https://snomedbrowser.com/Codes/Details/21719001)) as associated Healthcare Element.
Instead of using the natural language description for both, the application allows the Doctor to select the proper 
SNOMED CT terms using Codings.

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
