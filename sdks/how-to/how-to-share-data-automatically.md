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
  "id": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "rev": "75-98fac92aa5782708c41e7f1d5b1dc768",
  "created": 1688371977279,
  "name": "Master HCP",
  "login": "master@e2b6e8.icure",
  "groupId": "ic-e2etest-medtech-docs",
  "healthcarePartyId": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "email": "master@e2b6e8.icure",
  "properties": {},
  "roles": {},
  "sharingDataWith": {
    "medicalInformation": {}
  },
  "authenticationTokens": {
    "c1284f05-cca6-444e-bdac-3cd134d54e6b": {
      "creationTime": 1688371977378,
      "validity": 86400
    }
  }
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
  "id": "8ab2fc96-ac87-47c2-ac51-1f6cddad01ac",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-585fd019c82a832b26856dcf9329a18d",
  "created": 1688375598835,
  "modified": 1688375598835,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "aesExchangeKeys": {},
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "transferKeys": {},
    "encryptedSelf": "tZTIAjfWfon1RInBZ3ZmvbHb4W4Lg+Z5VLA/TST4xqNI3VSf+4z7gKcpu2L61sBY",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

<!-- output://code-samples/how-to/auto-share/patient2.txt -->
<details>
<summary>patient2</summary>

```json
{
  "id": "8ab2fc96-ac87-47c2-ac51-1f6cddad01ac",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-585fd019c82a832b26856dcf9329a18d",
  "created": 1688375598835,
  "modified": 1688375598835,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "aesExchangeKeys": {},
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "transferKeys": {},
    "encryptedSelf": "tZTIAjfWfon1RInBZ3ZmvbHb4W4Lg+Z5VLA/TST4xqNI3VSf+4z7gKcpu2L61sBY",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

<!-- output://code-samples/how-to/auto-share/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "80e28261-ffc1-4330-b158-6d79f36658b8",
  "qualifiedLinks": {},
  "batchId": "1d46e1ca-7767-44d0-915c-24cbcf8ca7cc",
  "index": 0,
  "valueDate": 20230703111318,
  "openingDate": 20230703111318,
  "created": 1688375598890,
  "modified": 1688375598890,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "encryptedSelf": "jSXcMzESgKsZfBzTnZOfEJ4PrrNYWKWYysl1INT/1t+vGG6XSZTe6Q/RnzPxtPPKHXddhK6Gt77LNbFvG+tdFrQgdaIN9cdZIuCKF0E4hs9M8Cn6/DxMr8WXJuBEEPyeyR1A/knQDHgyfmq+O0krbQ==",
    "secretForeignKeys": [
      "ec6e2516-cc70-4b7e-adf2-d2c895abd004"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

<!-- output://code-samples/how-to/auto-share/dataSample1.txt -->
<details>
<summary>dataSample1</summary>

```json
{
  "id": "80e28261-ffc1-4330-b158-6d79f36658b8",
  "qualifiedLinks": {},
  "batchId": "1d46e1ca-7767-44d0-915c-24cbcf8ca7cc",
  "index": 0,
  "valueDate": 20230703111318,
  "openingDate": 20230703111318,
  "created": 1688375598890,
  "modified": 1688375598890,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "encryptedSelf": "jSXcMzESgKsZfBzTnZOfEJ4PrrNYWKWYysl1INT/1t+vGG6XSZTe6Q/RnzPxtPPKHXddhK6Gt77LNbFvG+tdFrQgdaIN9cdZIuCKF0E4hs9M8Cn6/DxMr8WXJuBEEPyeyR1A/knQDHgyfmq+O0krbQ==",
    "secretForeignKeys": [
      "ec6e2516-cc70-4b7e-adf2-d2c895abd004"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

<!-- output://code-samples/how-to/auto-share/dataSample2.txt -->
<details>
<summary>dataSample2</summary>

```json
{
  "id": "80e28261-ffc1-4330-b158-6d79f36658b8",
  "qualifiedLinks": {},
  "batchId": "1d46e1ca-7767-44d0-915c-24cbcf8ca7cc",
  "index": 0,
  "valueDate": 20230703111318,
  "openingDate": 20230703111318,
  "created": 1688375598890,
  "modified": 1688375598890,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "encryptedSelf": "jSXcMzESgKsZfBzTnZOfEJ4PrrNYWKWYysl1INT/1t+vGG6XSZTe6Q/RnzPxtPPKHXddhK6Gt77LNbFvG+tdFrQgdaIN9cdZIuCKF0E4hs9M8Cn6/DxMr8WXJuBEEPyeyR1A/knQDHgyfmq+O0krbQ==",
    "secretForeignKeys": [
      "ec6e2516-cc70-4b7e-adf2-d2c895abd004"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "publicKeysForOaepWithSha256": {}
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
  "id": "607efc45-c128-4158-b8ae-4b0cf5402ed7",
  "qualifiedLinks": {},
  "batchId": "1b03b47a-eb56-4861-bad8-dfdc03728854",
  "index": 0,
  "valueDate": 20230703111319,
  "openingDate": 20230703111319,
  "created": 1688375599005,
  "modified": 1688375599005,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "encryptedSelf": "XFd579Yxv9iK5DWWXLrkryxtnUQG/lCzoLqzzsKAOB+1RfXjXNfb4SUrAwIS9ODcDp0KfnnPpwCdBdALT30lS5vUx6gJ59lcR6uDWgi3wwyClSwlSeqK66hpx84HnkDN7MKru9l+VZdQsKId+MrSolp/3BP68WrbSdX1yB0HF7dHeE7aKtUOofZWsGuy9lCAV7oSZxtrbbNCTdRnvLNUIA==",
    "secretForeignKeys": [
      "ec6e2516-cc70-4b7e-adf2-d2c895abd004"
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
  "id": "95759cc3-c13e-45f7-9104-481eb3ae05b5",
  "qualifiedLinks": {},
  "batchId": "ae7d0310-8874-4255-85cd-5db5fa137206",
  "index": 0,
  "valueDate": 20230703111319,
  "openingDate": 20230703111319,
  "created": 1688375599197,
  "modified": 1688375599197,
  "author": "1b66e6d6-d71f-432e-876b-5e883bdc7bd9",
  "responsible": "64738f29-9344-4a05-bbd6-29d897977748",
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
    "encryptedSelf": "wYzEEzS2VxrWWFZY7EkKaRVkTt1vgV1zJsx9YBtrVk/M9l0fbZ71pEyLdxBj7KJXbHTJ8A2cDwHjp4st86+tDthLKN/VwiLfFqHpFi8eC4VCAw89DiTgkjSo1VtkpVvSYSyEVEiGyMuoewPEDyAW4CdTm/EAZZSFWfgBsfOQdIjts+Eofb+JsqUD3KNwMF+j",
    "secretForeignKeys": [
      "ec6e2516-cc70-4b7e-adf2-d2c895abd004"
    ],
    "cryptedForeignKeys": {
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "delegations": {
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "encryptionKeys": {
      "64738f29-9344-4a05-bbd6-29d897977748": {}
    },
    "publicKeysForOaepWithSha256": {}
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
  "id": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "rev": "78-2363d8822a3a4fc0dbaff82eafe236fe",
  "created": 1688371977279,
  "name": "Master HCP",
  "login": "master@e2b6e8.icure",
  "groupId": "ic-e2etest-medtech-docs",
  "healthcarePartyId": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "email": "master@e2b6e8.icure",
  "properties": {},
  "roles": {},
  "sharingDataWith": {
    "medicalInformation": {}
  },
  "authenticationTokens": {
    "c1284f05-cca6-444e-bdac-3cd134d54e6b": {
      "creationTime": 1688371977378,
      "validity": 86400
    }
  }
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
  "id": "83702f59-1084-41d9-86d9-7a0fd957ea93",
  "qualifiedLinks": {},
  "batchId": "7ab81b0d-2204-447f-951a-2c45c55172a2",
  "index": 0,
  "valueDate": 20230703111319,
  "openingDate": 20230703111319,
  "created": 1688375599296,
  "modified": 1688375599296,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "encryptedSelf": "qIpqeI9oYR9BfQXuZ3qBdQWBqoZIwyYZAR/uBsz3ebmzvrAHN0DMVOJ5NoKEQSNSZSjLoOf3O7wJRswLRa/KvAgkXn/GGnSWXLeAw2k/MijecAyUaiPbjVS20UHe6CjkeN+jXd9fff62d/fh1KMn9yo2spNZCbe5uk9RH8exgcpY8LrWEL5QU1T9GwZD5ZK7",
    "secretForeignKeys": [
      "ec6e2516-cc70-4b7e-adf2-d2c895abd004"
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
  "id": "2131cfde-88dd-4a2c-a66c-358938384dfe",
  "qualifiedLinks": {},
  "batchId": "edfaf05a-d23a-42d2-b97f-2b8a987067a9",
  "index": 0,
  "valueDate": 20230703111319,
  "openingDate": 20230703111319,
  "created": 1688375599400,
  "modified": 1688375599400,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "encryptedSelf": "BFBzFAzHGo66ChtS05gIYtqcuw1ps7gAgCYekiLfVSOKBcSQEEeaPOn47BDoDKclLrZdKjY4PEoZk9fNfN0Aa92BW0uO7qcLdqVixWk68WWw4E2vej+VBSm2d6MOjE8vc7/ymHoKk1E2XAC71z8Xh37QUwMQnDQs0viDvS69AC7AwLxJnkr7nDaDJFEmUrbZR96b5r/vIpGMbgKPBZDZryOjLksD/G9amr1eX0TqpZCMh3xHqgeye9M7wr+62aKP",
    "secretForeignKeys": [
      "ec6e2516-cc70-4b7e-adf2-d2c895abd004"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>
