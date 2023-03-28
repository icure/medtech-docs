---
slug: how-to-share-data-automatically
---

# Sharing data automatically with other data owners

iCure allows to share data between different data owners, as explained in the guide 
[How to share data between data owners](/sdks/how-to/how-to-share-data), however this requires to perform an explicit request every time
we want to share a new entity. 

In some cases you may need to always share all data created by a data owner with other data-owners, for example you may
want to always share all data created by a patient with their general practitioner. 
In these situations it may be more convenient to use the automatic-sharing feature of iCure. 

:::note

In the following examples we use different instances of `MedTechApi`s, to perform the requests as different users.
The api we use are `hcp1Api` and `hcp2Api` to act as two different healthcare practitioners data owners (`hcp1` and
`hcp2`, respectively) and `pApi` to act as a patient data owner (`p`).

:::

## Start sharing data with another user

You can use the `shareAllFutureDataWith` method from the `userApi` to start sharing all new data the user creates with
another user. This method lets you specify with whom you are sharing data and what is the kind of data you are sharing.

The following example shows how to automatically share the medical information for all new entities which will be created by `hcp1` with `hcp2`.

:::info

The supported values for the `kind` argument of `shareAllFutureDataWith` are `medicalInformation`, `administrativeInformation` and `all`.
If the kind argument is omitted, all data will be shared.

:::

<!-- file://code-samples/how-to/auto-share/index.mts snippet:auto share-->
```typescript
const user = await hcp1Api.userApi.shareAllFutureDataWith(
  [hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User)],
  'medicalInformation',
)
```
<!-- output://code-samples/how-to/auto-share/user.txt -->
<details>
<summary>user</summary>

```json
{
  "id": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "rev": "81-e9e7772c07a6ca1a86a4ff6895407527",
  "created": 1679919731079,
  "name": "Master HCP",
  "login": "master@b16baa.icure",
  "groupId": "ic-e2etest-medtech-docs",
  "healthcarePartyId": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "email": "master@b16baa.icure",
  "properties": {},
  "roles": {},
  "sharingDataWith": {
    "medicalInformation": {}
  },
  "authenticationTokens": {}
}
```
</details>

<details>
    <summary>Data creation example</summary>

<!-- file://code-samples/how-to/auto-share/index.mts snippet:sample creation-->
```typescript
const note = 'Winter is coming'
const patient = await hcp1Api.patientApi.createOrModifyPatient(
  new Patient({ firstName: 'John', lastName: 'Snow', note }),
)
const patient1 = await hcp1Api.patientApi.getPatient(patient.id)
const patient2 = await hcp2Api.patientApi.getPatient(patient.id)
// hcp2 can already access patient
const contentString = 'Hello world'
const dataSample = await hcp1Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: new Content({ stringValue: contentString }) },
  }),
)
const dataSample1 = await hcp1Api.dataSampleApi.getDataSample(dataSample.id)
const dataSample2 = await hcp2Api.dataSampleApi.getDataSample(dataSample.id)
// hcp2 can already access dataSample
```
</details>

<!-- output://code-samples/how-to/auto-share/patient1.txt -->
<details>
<summary>patient1</summary>

```json
{
  "id": "c4246b6b-6c0d-4ade-a391-f0c5a8cf8094",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-05d54271f19e029cfef560472777e0c5",
  "created": 1679991654678,
  "modified": 1679991654678,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "firstName": "John",
  "lastName": "Snow",
  "note": "Winter is coming",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "John"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Snow",
      "text": "Snow John",
      "use": "official"
    }
  ],
  "addresses": [],
  "gender": "unknown",
  "birthSex": "unknown",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {},
    "transferKeys": {},
    "encryptedSelf": "20NihERrvgEf/jPK/a1M7j8vq3MWrg11jt6Pt8IjooaO2rZR53cDXpwvWVzQplAV",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    }
  }
}
```
</details>

<!-- output://code-samples/how-to/auto-share/patient2.txt -->
<details>
<summary>patient2</summary>

```json
{
  "id": "c4246b6b-6c0d-4ade-a391-f0c5a8cf8094",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-05d54271f19e029cfef560472777e0c5",
  "created": 1679991654678,
  "modified": 1679991654678,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "firstName": "John",
  "lastName": "Snow",
  "note": "Winter is coming",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "John"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Snow",
      "text": "Snow John",
      "use": "official"
    }
  ],
  "addresses": [],
  "gender": "unknown",
  "birthSex": "unknown",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {},
    "transferKeys": {},
    "encryptedSelf": "20NihERrvgEf/jPK/a1M7j8vq3MWrg11jt6Pt8IjooaO2rZR53cDXpwvWVzQplAV",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    }
  }
}
```
</details>

<!-- output://code-samples/how-to/auto-share/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "9b9e6b0b-c3e1-4f6a-8bc3-c136ea6ea1b5",
  "qualifiedLinks": {},
  "batchId": "1ca80dfa-de87-49c4-8516-e3503e54dd18",
  "index": 0,
  "valueDate": 20230328102055,
  "openingDate": 20230328102055,
  "created": 1679991655534,
  "modified": 1679991655534,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "Hello world",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "da26fe66-4739-460b-982c-b2a5c3e264db"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    }
  }
}
```
</details>

<!-- output://code-samples/how-to/auto-share/dataSample1.txt -->
<details>
<summary>dataSample1</summary>

```json
{
  "id": "9b9e6b0b-c3e1-4f6a-8bc3-c136ea6ea1b5",
  "qualifiedLinks": {},
  "batchId": "1ca80dfa-de87-49c4-8516-e3503e54dd18",
  "index": 0,
  "valueDate": 20230328102055,
  "openingDate": 20230328102055,
  "created": 1679991655534,
  "modified": 1679991655534,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "Hello world",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "da26fe66-4739-460b-982c-b2a5c3e264db"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    }
  }
}
```
</details>

<!-- output://code-samples/how-to/auto-share/dataSample2.txt -->
<details>
<summary>dataSample2</summary>

```json
{
  "id": "9b9e6b0b-c3e1-4f6a-8bc3-c136ea6ea1b5",
  "qualifiedLinks": {},
  "batchId": "1ca80dfa-de87-49c4-8516-e3503e54dd18",
  "index": 0,
  "valueDate": 20230328102055,
  "openingDate": 20230328102055,
  "created": 1679991655534,
  "modified": 1679991655534,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "Hello world",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "da26fe66-4739-460b-982c-b2a5c3e264db"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    }
  }
}
```
</details>

## No automatic share on modify

The automatic data sharing applies only on entity creation, and not on modification. If a user is sharing data with 
another user and modifies an entity that is not yet shared with that user the updated entity won't automatically be 
shared with them.

<!-- file://code-samples/how-to/auto-share/index.mts snippet:not on modify-->
```typescript
const contentNotOnModify = "Won't automatically update who the data is shared with on modify"
const dataSampleNotOnModify = await hcp1Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    ...existingDataSample,
    content: { en: new Content({ stringValue: contentNotOnModify }) },
  }),
)
```

<!-- output://code-samples/how-to/auto-share/dataSampleNotOnModify.txt -->
<details>
<summary>dataSampleNotOnModify</summary>

```json
{
  "id": "b59cbb02-f23d-4cf2-8e60-723059bc36ef",
  "qualifiedLinks": {},
  "batchId": "4fef1f36-9d1e-4638-9b63-5effed5e9c2e",
  "index": 0,
  "valueDate": 20230328102056,
  "openingDate": 20230328102056,
  "created": 1679991656489,
  "modified": 1679991656489,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "Won't automatically update who the data is shared with on modify",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "da26fe66-4739-460b-982c-b2a5c3e264db"
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


## Uni-directional

Note that the auto-share is uni-directional: if `hcp1` is automatically sharing data with `hcp2` it does not mean that
`hcp2` will automatically data with `hcp1`. Anything created by `hcp2` won't be accessible to `hcp1` until `hcp2` shares
it.

<!-- file://code-samples/how-to/auto-share/index.mts snippet:one directional-->
```typescript
const contentNotSharedBy2 = 'Hcp 2 is not sharing automatically with 1'
const dataSampleNotSharedBy2 = await hcp2Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: new Content({ stringValue: contentNotSharedBy2 }) },
  }),
)
```

<!-- output://code-samples/how-to/auto-share/dataSampleNotSharedBy2.txt -->
<details>
<summary>dataSampleNotSharedBy2</summary>

```json
{
  "id": "c07fa5d3-c994-451f-8258-0cbfb97dc9fe",
  "qualifiedLinks": {},
  "batchId": "3616645f-1d58-4747-ba29-336de1801b2a",
  "index": 0,
  "valueDate": 20230328102057,
  "openingDate": 20230328102057,
  "created": 1679991657810,
  "modified": 1679991657810,
  "author": "84cb80e5-95fb-46ce-ad08-d5a6c211a9ff",
  "responsible": "396f6d45-1d92-4bca-888c-086d8415aef9",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "Hcp 2 is not sharing automatically with 1",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "da26fe66-4739-460b-982c-b2a5c3e264db"
    ],
    "cryptedForeignKeys": {
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    },
    "delegations": {
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    },
    "encryptionKeys": {
      "396f6d45-1d92-4bca-888c-086d8415aef9": {}
    }
  }
}
```
</details>

## Stop sharing

You can stop the automatic data share using the `stopSharingDataWith` method.

<!-- file://code-samples/how-to/auto-share/index.mts snippet:stop auto share-->
```typescript
const userWithoutShare = await hcp1Api.userApi.stopSharingDataWith(
  [hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User)],
  'medicalInformation',
)
```

<!-- output://code-samples/how-to/auto-share/userWithoutShare.txt -->
<details>
<summary>userWithoutShare</summary>

```json
{
  "id": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "rev": "84-8d9871263765d31298e2398a98a2745c",
  "created": 1679919731079,
  "name": "Master HCP",
  "login": "master@b16baa.icure",
  "groupId": "ic-e2etest-medtech-docs",
  "healthcarePartyId": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "email": "master@b16baa.icure",
  "properties": {},
  "roles": {},
  "sharingDataWith": {
    "medicalInformation": {}
  },
  "authenticationTokens": {}
}
```
</details>

<details>
    <summary>Data creation example</summary>

<!-- file://code-samples/how-to/auto-share/index.mts snippet:sample no share-->
```typescript
const contentNotSharedAnymore = 'Hcp 1 stopped sharing data automatically with 2'
const dataSampleNotSharedAnymore = await hcp1Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: new Content({ stringValue: contentNotSharedAnymore }) },
  }),
)
```
</details>

<!-- output://code-samples/how-to/auto-share/dataSampleNotSharedAnymore.txt -->
<details>
<summary>dataSampleNotSharedAnymore</summary>

```json
{
  "id": "e515407f-4804-4a2f-9e01-ef15882fb621",
  "qualifiedLinks": {},
  "batchId": "908b2e22-623b-4191-9970-7ae3d3ecb7d3",
  "index": 0,
  "valueDate": 20230328102058,
  "openingDate": 20230328102058,
  "created": 1679991658607,
  "modified": 1679991658607,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "Hcp 1 stopped sharing data automatically with 2",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "da26fe66-4739-460b-982c-b2a5c3e264db"
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

## Non-retroactivity

Both the `shareAllFutureDataWith` and `stopSharingDataWith` methods are not retroactive. This means that when a user
starts sharing data with another user they will not give access to already existing data, and when they stop sharing 
data they will not revoke access to shared data.

## Applicable to all data owners

Any data owner can automatically share data with any other data owner, regardless of their type (patient, healthcare 
professional, or medical device).

## No chaining of automatic data share

The automatic data sharing applies only to entities created by the user which is sharing the data. If `hcp1` shares all 
data with `p` and `p` shares all data with `hcp2` when `hcp1` creates a new entity it will only be shared with `p`, and
not also with `hcp2`.

<!-- file://code-samples/how-to/auto-share/index.mts snippet:share chain-->
```typescript
await hcp1Api.userApi.shareAllFutureDataWith(
  [hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser)],
  'medicalInformation',
)
await pApi.userApi.shareAllFutureDataWith(
  [pApi.dataOwnerApi.getDataOwnerIdOf(hcp2User)],
  'medicalInformation',
)

const contentNoChaining =
  "Even if hcp1 shares with p and p shares with hcp2, hcp2 won't have automatic access to the data"
const dataSampleNoChaining = await hcp1Api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: new Content({ stringValue: contentNoChaining }) },
  }),
)
```

<!-- output://code-samples/how-to/auto-share/dataSampleNoChaining.txt -->
<details>
<summary>dataSampleNoChaining</summary>

```json
{
  "id": "d80a4ccf-2471-4b54-974a-450474b208e9",
  "qualifiedLinks": {},
  "batchId": "99d42a05-b081-41fb-a640-8ef213bdd42a",
  "index": 0,
  "valueDate": 20230328102059,
  "openingDate": 20230328102059,
  "created": 1679991659339,
  "modified": 1679991659339,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "Even if hcp1 shares with p and p shares with hcp2, hcp2 won't have automatic access to the data",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "da26fe66-4739-460b-982c-b2a5c3e264db"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    }
  }
}
```
</details>
