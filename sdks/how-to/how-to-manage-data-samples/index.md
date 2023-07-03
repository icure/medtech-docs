---
slug: how-to-manage-data-samples
description: Learn how to manage data samples
tags:

- DataSample

---

# Handling data samples

In this section, we will learn how to manage data samples. DataSamples are used to store data that is not part of the
patient's medical record, such as blood pressure measurements.

:::note

We assume in the examples below that you have already created a patient. If not, please follow
the [Handling patients](/sdks/how-to/how-to-manage-patients) guide.

:::

## How to create a DataSample&#8239;?

To create a DataSample, we can use the `createOrModifyDataSampleFor` method on the `DataSampleApi` object. This method
takes two parameters: the patient's id and the DataSample object.

<!-- file://code-samples/how-to/datasamples/index.mts snippet:create a dataSample-->
```typescript
const createdDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id!,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: new Content({ stringValue: 'Hello world' }) },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
```
<!-- output://code-samples/how-to/datasamples/createdDataSample.txt -->
<details>
<summary>createdDataSample</summary>

```json
{
  "id": "150fe143-6b51-4dbc-9aeb-87deb6b9bda0",
  "qualifiedLinks": {},
  "batchId": "df2cc34c-b1b6-4a6d-ac4f-3a794da6c5e8",
  "index": 0,
  "valueDate": 20230703111325,
  "openingDate": 20220929083400,
  "created": 1688375605231,
  "modified": 1688375605231,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "comment": "This is a comment",
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
    "encryptedSelf": "ekbRvY4iIqbnUV3/nSkqzoQSGLWzaQWK4nxLGHiqaQFOFv6goSfwNbnx+qDMTPTpXKQhlXZ7zMnYAuErFobq6QeMClcCNBIJ4Ui+Y/hnUYO36M1oiPNfWbnjhkmf6VIACKen9pVGcv2/xLZ8nOLFlw==",
    "secretForeignKeys": [
      "65a8fbc3-0644-4daf-b791-7598775d3142"
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

In this example, we created a DataSample with the `IC-TEST` tag code and `TEST` tag type. We also added a comment and an
opening date.

:::info

Behind the scenes: the `createOrModifyDataSampleFor` method will encrypt the `DataSample` and send it to the iCure backend. From now on you will be able to retrieve the content of this `DataSample` only if you have the correct key to decrypt it.

:::

## How to retrieve a DataSample&#8239;?

To retrieve a DataSample, we can use the `getDataSample` method on the `DataSampleApi`. This method takes one
parameter: the DataSample's id.

<!-- file://code-samples/how-to/datasamples/index.mts snippet:get a dataSample-->
```typescript
const dataSample = await api.dataSampleApi.getDataSample(createdDataSample.id!)
```
<!-- output://code-samples/how-to/datasamples/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "150fe143-6b51-4dbc-9aeb-87deb6b9bda0",
  "qualifiedLinks": {},
  "batchId": "df2cc34c-b1b6-4a6d-ac4f-3a794da6c5e8",
  "index": 0,
  "valueDate": 20230703111325,
  "openingDate": 20220929083400,
  "created": 1688375605231,
  "modified": 1688375605231,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "comment": "This is a comment",
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
    "encryptedSelf": "ekbRvY4iIqbnUV3/nSkqzoQSGLWzaQWK4nxLGHiqaQFOFv6goSfwNbnx+qDMTPTpXKQhlXZ7zMnYAuErFobq6QeMClcCNBIJ4Ui+Y/hnUYO36M1oiPNfWbnjhkmf6VIACKen9pVGcv2/xLZ8nOLFlw==",
    "secretForeignKeys": [
      "65a8fbc3-0644-4daf-b791-7598775d3142"
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

## How to update a DataSample&#8239;?

In order to update a DataSample, we can use the `createOrModifyDataSampleFor` method on the `DataSampleApi`. This method takes two parameters: the patient's id and the DataSample object. 

:::info

The patient's id **must** be the same as the one used to create the DataSample.

If you linked the DataSample at the wrong patient, you have to delete the first DataSample and create a new one with the correct patient's id.

:::

<!-- file://code-samples/how-to/datasamples/index.mts snippet:update a dataSample-->
```typescript
const updatedDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id!,
  new DataSample({
    ...createdDataSample,
    // highlight-start
    content: { en: new Content({ stringValue: 'Hello world updated' }) },
    comment: 'This is a updated comment',
    modified: undefined,
    // highlight-end
  }),
)
```
<!-- output://code-samples/how-to/datasamples/updatedDataSample.txt -->
<details>
<summary>updatedDataSample</summary>

```json
{
  "id": "150fe143-6b51-4dbc-9aeb-87deb6b9bda0",
  "qualifiedLinks": {},
  "batchId": "df2cc34c-b1b6-4a6d-ac4f-3a794da6c5e8",
  "index": 0,
  "valueDate": 20230703111325,
  "openingDate": 20220929083400,
  "created": 1688375605231,
  "modified": 1688375605326,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "comment": "This is a updated comment",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "Hello world updated",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "encryptedSelf": "sJudB4mJSVleTDPGArXVfAmJzIkRuftaUYflsfpUhBgAGANKgnIzCxtk0I6Zz6FB/vc3tu4PXtE4UqKB6fBCF++9YXaNp4BxfgIuXGEO9doi58wG0PxGOLc7DLSBWPZbFfQP9IT9EYgYawq1WKBpLECecDtt7ln5WT53wWacAEs=",
    "secretForeignKeys": [
      "65a8fbc3-0644-4daf-b791-7598775d3142"
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

## How to delete a DataSample&#8239;?

To delete a DataSample, you can use the `deleteDataSample` method on the `DataSampleApi`. This method takes one parameter: the DataSample's id.

<!-- file://code-samples/how-to/datasamples/index.mts snippet:delete a dataSample-->
```typescript
const deletedDataSample = await api.dataSampleApi.deleteDataSample(updatedDataSample.id!)
```
<!-- output://code-samples/how-to/datasamples/deletedDataSample.txt -->
<details>
<summary>deletedDataSample</summary>

```text
150fe143-6b51-4dbc-9aeb-87deb6b9bda0
```
</details>

## How to filter DataSamples&#8239;?

To retrieve a list of DataSamples, we can use the `filterDataSamples` method on the `DataSampleApi`. This method takes one parameter: the filter object.

We can build the filter object using the `DataSampleFilter` builder.

<!-- file://code-samples/how-to/datasamples/index.mts snippet:get a list of dataSamples-->
```typescript
const filter = await new DataSampleFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byLabelCodeDateFilter('IC-TEST', 'TEST')
  .forPatients([patient])
  .build()

const filteredDataSamples = await api.dataSampleApi.filterDataSample(filter)
```
<!-- output://code-samples/how-to/datasamples/filteredDataSamples.txt -->
<details>
<summary>filteredDataSamples</summary>

```json
{
  "pageSize": 1,
  "totalSize": 1,
  "rows": [
    {
      "id": "150fe143-6b51-4dbc-9aeb-87deb6b9bda0",
      "qualifiedLinks": {},
      "batchId": "df2cc34c-b1b6-4a6d-ac4f-3a794da6c5e8",
      "index": 0,
      "valueDate": 20230703111325,
      "openingDate": 20220929083400,
      "created": 1688375605231,
      "modified": 1688375605326,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "comment": "This is a updated comment",
      "identifiers": [],
      "healthcareElementIds": {},
      "canvasesIds": {},
      "content": {
        "en": {
          "stringValue": "Hello world updated",
          "compoundValue": [],
          "ratio": [],
          "range": []
        }
      },
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "encryptedSelf": "sJudB4mJSVleTDPGArXVfAmJzIkRuftaUYflsfpUhBgAGANKgnIzCxtk0I6Zz6FB/vc3tu4PXtE4UqKB6fBCF++9YXaNp4BxfgIuXGEO9doi58wG0PxGOLc7DLSBWPZbFfQP9IT9EYgYawq1WKBpLECecDtt7ln5WT53wWacAEs=",
        "secretForeignKeys": [
          "65a8fbc3-0644-4daf-b791-7598775d3142"
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
  ],
  "nextKeyPair": {}
}
```
</details>

### Filter builder

To create a filter, we can use the [`DataSampleFilter`](/sdks/references/filters/DataSampleFilter#methods) builder methods. This builder allows us to create complex filter object.

In the example above, we created the filter this way:

<!-- file://code-samples/how-to/datasamples/index.mts snippet:filter builder-->
```typescript
const dataSampleFilter = new DataSampleFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byLabelCodeDateFilter('IC-TEST', 'TEST')
  .forPatients([patient])
  .build()
```
<!-- output://code-samples/how-to/datasamples/dataSampleFilter.txt -->
<details>
<summary>dataSampleFilter</summary>

```json
{}
```
</details>

The resulting filter object will create a filter that allows us to get all `DataSamples` that satisfy all the following requirements:

- The `DataSample` is owned by the logged user's healthcare party
- The `DataSample` has a tag with type `IC-TEST` and code `TEST`
- The `DataSample` is linked to `patient`

## How to get a list of DataSample ids&#8239;?

In some circumstances, you might want to get a list of DataSample ids instead of the DataSamples themselves. To do so, you can use the `matchDataSample` method on the `DataSampleApi`. This method takes one parameter: the filter object.

<!-- file://code-samples/how-to/datasamples/index.mts snippet:get a list of dataSamples ids-->
```typescript
const matchFilter = await new DataSampleFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId!)
  .forPatients([patient])
  .build()

const matchedDataSampleIds = await api.dataSampleApi.matchDataSample(matchFilter)
```
<!-- output://code-samples/how-to/datasamples/matchedDataSampleIds.txt -->
<details>
<summary>matchedDataSampleIds</summary>

```text
[
  "150fe143-6b51-4dbc-9aeb-87deb6b9bda0"
]
```
</details>
