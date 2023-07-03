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
  "id": "1a5ea884-2e16-4a05-92dc-aaf039495f02",
  "rev": "1-f062aebec81da6b4ab81c9ac44fabd63",
  "created": 1688378940977,
  "modified": 1688378940977,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "1a5ea884-2e16-4a05-92dc-aaf039495f02",
  "valueDate": 20230703120900,
  "openingDate": 20230703120900,
  "description": "My diagnosis is that the patient has Hay Fever",
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
    "encryptedSelf": "R90mdcD8niWw2Lya3fKvlaqTri5It5LpbpjmQwhdl9KBzOCaIvZOA8yBVXqBty9AByqf+JL/jhTtuTOtVu58uhIX+WVWeyMWxrFrQFPl7To="
  }
}
```
</details>

<!-- output://code-samples/explanation/data-sample-w-coding/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "25eb6a58-36d6-4e31-884f-bf1f1e77097e",
  "qualifiedLinks": {},
  "batchId": "c6279d82-93b5-4578-b797-04df3d0b0747",
  "index": 0,
  "valueDate": 20230703120901,
  "openingDate": 20230703120901,
  "created": 1688378941048,
  "modified": 1688378941048,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "encryptedSelf": "RKqqVROZlYdJl16L7HT7GtPaVVg8NmSr8sWDRj2aoyp8VsZWj9UbAAPEGx3wheLol/ON8FBXszSWXkaZH66UfSqSvN8WpXvZcesswoQPK5GikY+JdfV5GozxuvFA7nggcRn4voGUSaV0qbP0XDf/DVEYwPOqXQlKKX91uCfeuDI=",
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
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>
