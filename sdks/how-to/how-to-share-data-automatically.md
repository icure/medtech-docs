---
slug: how-to-share-data-automatically
---

# Sharing data automatically with other data owners

iCure allows to share data between different data owners, as explained in the guide 
[How to share data between data owners](/{{ sdk }}/how-to/how-to-share-data), however this requires to perform an explicit request every time
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
  "rev": "87-c8850505205ccfcdf2cbb8e6716b81fc",
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
  "id": "dd8a343e-1dbd-4b92-8b00-7407339f8f74",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-d23ee9f3c8f772866ed07bcc91e9647d",
  "created": 1688378947289,
  "modified": 1688378947289,
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
    "encryptedSelf": "o66vME7T1G/FHgNDkKWSdykFBEJ/MwTOQJBnZeALaIgddG1JQHs5Z8xArWRv9lrw",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
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
  "id": "dd8a343e-1dbd-4b92-8b00-7407339f8f74",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-d23ee9f3c8f772866ed07bcc91e9647d",
  "created": 1688378947289,
  "modified": 1688378947289,
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
    "encryptedSelf": "o66vME7T1G/FHgNDkKWSdykFBEJ/MwTOQJBnZeALaIgddG1JQHs5Z8xArWRv9lrw",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
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
  "id": "07459079-e7be-47b3-998f-53baae16689d",
  "qualifiedLinks": {},
  "batchId": "54ed842f-8fd9-4d7b-ba14-b4f31fc392e7",
  "index": 0,
  "valueDate": 20230703120907,
  "openingDate": 20230703120907,
  "created": 1688378947355,
  "modified": 1688378947355,
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
    "encryptedSelf": "icfuKkZOIMGlEXuo5LAXE5icukphIa+7el5NjEytpHbIl9VyRjSGmzvY1gXjQotkf0RHbWddt0hSSicPRzEcPniesE5yEDKwUAIgkgQz36SF30Nci9597D7AFth2BkkES4yN+lZfakViVe6TAZY4sw==",
    "secretForeignKeys": [
      "5518665e-d0a1-4482-9860-15292eb5dfe7"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
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
  "id": "07459079-e7be-47b3-998f-53baae16689d",
  "qualifiedLinks": {},
  "batchId": "54ed842f-8fd9-4d7b-ba14-b4f31fc392e7",
  "index": 0,
  "valueDate": 20230703120907,
  "openingDate": 20230703120907,
  "created": 1688378947355,
  "modified": 1688378947355,
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
    "encryptedSelf": "icfuKkZOIMGlEXuo5LAXE5icukphIa+7el5NjEytpHbIl9VyRjSGmzvY1gXjQotkf0RHbWddt0hSSicPRzEcPniesE5yEDKwUAIgkgQz36SF30Nci9597D7AFth2BkkES4yN+lZfakViVe6TAZY4sw==",
    "secretForeignKeys": [
      "5518665e-d0a1-4482-9860-15292eb5dfe7"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
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
  "id": "07459079-e7be-47b3-998f-53baae16689d",
  "qualifiedLinks": {},
  "batchId": "54ed842f-8fd9-4d7b-ba14-b4f31fc392e7",
  "index": 0,
  "valueDate": 20230703120907,
  "openingDate": 20230703120907,
  "created": 1688378947355,
  "modified": 1688378947355,
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
    "encryptedSelf": "icfuKkZOIMGlEXuo5LAXE5icukphIa+7el5NjEytpHbIl9VyRjSGmzvY1gXjQotkf0RHbWddt0hSSicPRzEcPniesE5yEDKwUAIgkgQz36SF30Nci9597D7AFth2BkkES4yN+lZfakViVe6TAZY4sw==",
    "secretForeignKeys": [
      "5518665e-d0a1-4482-9860-15292eb5dfe7"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "950898e3-4cee-4228-a609-f08606f680e5": {}
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
  "id": "d16ca9b2-1a78-474e-9ab4-e2c087b71c5e",
  "qualifiedLinks": {},
  "batchId": "8582ade4-5f34-4c08-9989-40a428bcdf69",
  "index": 0,
  "valueDate": 20230703120907,
  "openingDate": 20230703120907,
  "created": 1688378947474,
  "modified": 1688378947474,
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
    "encryptedSelf": "fTAyCRIuTWoaDZDe9PKGUiqsMARVBIyCp4EamQRmcqp2hqGeFmIiD7OUycz2Cy2OIy5qjItLcIb6114LYR7Kxqc0ip6fEa54b8Nw7kLhRqpcXg+dMLYbC1RS+BOPLYMaY9wcOEQ2nlWSokeXwieuMVmNryRDxBcabU+D60DMJp/iZRgszsn6knjepCiRXeq3O5q91om9Yax1ZP3ZM4e0kA==",
    "secretForeignKeys": [
      "5518665e-d0a1-4482-9860-15292eb5dfe7"
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
  "id": "73d58dde-130a-455d-8841-0a2eabfc377b",
  "qualifiedLinks": {},
  "batchId": "a508b6e6-a8d3-4e6c-8821-cae549c49fe6",
  "index": 0,
  "valueDate": 20230703120907,
  "openingDate": 20230703120907,
  "created": 1688378947667,
  "modified": 1688378947667,
  "author": "9a55eaed-b2d0-41f9-8345-507f8e42460e",
  "responsible": "950898e3-4cee-4228-a609-f08606f680e5",
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
    "encryptedSelf": "8XiQUWx32172wEQ7zn4Lk4o53veSQdKYOmxghtV96rVm7TmoiItCvkxavbLYYuUa5acY6N5KitB4enyR8NWMI2kPSxe8vvZx0U9nSqVNqdXqr22g43wDpSYl0Gq7NbwqG5iOr9z5Gbam57XjdB8P0N6cSl0Is1ZdFjtg6/X9PopEfolBWNgXOXrtPoyEyES0",
    "secretForeignKeys": [
      "5518665e-d0a1-4482-9860-15292eb5dfe7"
    ],
    "cryptedForeignKeys": {
      "950898e3-4cee-4228-a609-f08606f680e5": {}
    },
    "delegations": {
      "950898e3-4cee-4228-a609-f08606f680e5": {}
    },
    "encryptionKeys": {
      "950898e3-4cee-4228-a609-f08606f680e5": {}
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
  "rev": "90-33d46790d9953be2e24e9791e8a79c6f",
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
  "id": "5f1088e2-2bf6-4811-8a17-6430ad53c7fe",
  "qualifiedLinks": {},
  "batchId": "0c720630-a9fc-4463-b281-6880dfa25620",
  "index": 0,
  "valueDate": 20230703120907,
  "openingDate": 20230703120907,
  "created": 1688378947743,
  "modified": 1688378947743,
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
    "encryptedSelf": "K6Tkw7aOQRaOTuuRURukPbyL91gLJto4nLr5YS/Kd4YDe5gopnNyL4OANJxn1QbBGxA38ieeKXo6lKvghqXk9c0A62o9C5/Oli0tRbL4S/KnYOQks91/sIeQUjHJ0diYLuSNw1Qs0Vn/wG98lZdzMXFe2KBzNaMNbLX/x6rFiIsoDp9zFlhxvMykHNYc9g0R",
    "secretForeignKeys": [
      "5518665e-d0a1-4482-9860-15292eb5dfe7"
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
  "id": "3ae4782e-0ee7-4162-b21f-dc3486b07311",
  "qualifiedLinks": {},
  "batchId": "30fb71e4-535e-45c9-a66c-dfde1d9e9c93",
  "index": 0,
  "valueDate": 20230703120907,
  "openingDate": 20230703120907,
  "created": 1688378947846,
  "modified": 1688378947846,
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
    "encryptedSelf": "XxAnanTwk5/6hAoo4IPgZqEpSIZY+BtjqUS61f2i8aNFrLrrh5kqwPrcaqPXdyFasQuFGDUPrXUzUl+rjwUDdMvm0o0yTnInigdBqvO9xuOIDaY3GOi2mNpKh8/9M5Rr6Phow5PLGkojf2XwhLt7KkWzSPGULl9d9CrL/XpY7QuEqcsFonf79V9i3xL2VjlDUd0Qrx9idVxvtiezC080SHFSVSLbNhwX7G6mZOMObPq37OWVtPZ6oenvW7e4i3F0",
    "secretForeignKeys": [
      "5518665e-d0a1-4482-9860-15292eb5dfe7"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>
