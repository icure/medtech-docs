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
  "id": "02a8bbb3-4fb2-4bf1-bb9b-dd2b7341220e",
  "rev": "1-89fd4b9e9d1dd31bf7e3a98ee31fbcf2",
  "created": 1688375635698,
  "modified": 1688375635698,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "02a8bbb3-4fb2-4bf1-bb9b-dd2b7341220e",
  "valueDate": 20230703111355,
  "openingDate": 20230703111355,
  "description": "My diagnosis is that the patient has Hay Fever",
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
    "encryptedSelf": "Mh5yNY9GRIHGQv7ew3UZ1jVUvsPQXTvxm6c1IupUcbQdYhEJBmWB0asJSvX8cGJfeiDDUieZbesTr+w4A5yioLS4SyIiK5vB5J40tQI7vbI="
  }
}
```
</details>

<!-- output://code-samples/explanation/data-sample-w-coding/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "9b913c03-811e-495a-a272-5620c052ff14",
  "qualifiedLinks": {},
  "batchId": "34420ec9-efaf-4630-9e47-939c9317ff07",
  "index": 0,
  "valueDate": 20230703111355,
  "openingDate": 20230703111355,
  "created": 1688375635734,
  "modified": 1688375635734,
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
    "encryptedSelf": "o0620wKMungmxKrwxEQtn621iHecRqxFNHrAerz1MNK+T0vTkhm7bn9v4z79W4DMg9QuyNix/KF8SJawg4do8Uy+t2YPcoT8F4cq1Xh+rLXqLg+AfWN2f0nm6mFOR8jdMZsGmCDN4hTFw+epllhRirFHJtxxKZdatHSrI4aEJVs=",
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
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>
