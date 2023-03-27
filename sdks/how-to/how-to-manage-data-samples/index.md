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
  "id": "50ee8487-6eae-4c9d-a8ce-7e49cbb92919",
  "qualifiedLinks": {},
  "batchId": "c63494ba-0ea7-45e3-9422-5cf20cfd1664",
  "index": 0,
  "valueDate": 20230327141526,
  "openingDate": 20220929083400,
  "created": 1679926526606,
  "modified": 1679926526606,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
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
    "secretForeignKeys": [
      "715193d7-8b58-4008-92a8-7395befe5b19"
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
  "id": "50ee8487-6eae-4c9d-a8ce-7e49cbb92919",
  "qualifiedLinks": {},
  "batchId": "c63494ba-0ea7-45e3-9422-5cf20cfd1664",
  "index": 0,
  "valueDate": 20230327141526,
  "openingDate": 20220929083400,
  "created": 1679926526606,
  "modified": 1679926526606,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
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
    "secretForeignKeys": [
      "715193d7-8b58-4008-92a8-7395befe5b19"
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
  "id": "50ee8487-6eae-4c9d-a8ce-7e49cbb92919",
  "qualifiedLinks": {},
  "batchId": "c63494ba-0ea7-45e3-9422-5cf20cfd1664",
  "index": 0,
  "valueDate": 20230327141526,
  "openingDate": 20220929083400,
  "created": 1679926526606,
  "modified": 1679926527341,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
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
    "secretForeignKeys": [
      "715193d7-8b58-4008-92a8-7395befe5b19"
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
50ee8487-6eae-4c9d-a8ce-7e49cbb92919
```
</details>

## How to filter DataSamples&#8239;?

To retrieve a list of DataSamples, we can use the `filterDataSamples` method on the `DataSampleApi`. This method takes one parameter: the filter object.

We can build the filter object using the `DataSampleFilter` builder.

<!-- file://code-samples/how-to/datasamples/index.mts snippet:get a list of dataSamples-->
```typescript
const filter = await new DataSampleFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byLabelCodeDateFilter('IC-TEST', 'TEST')
  .forPatients(api.cryptoApi, [patient])
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
      "id": "50ee8487-6eae-4c9d-a8ce-7e49cbb92919",
      "qualifiedLinks": {},
      "batchId": "c63494ba-0ea7-45e3-9422-5cf20cfd1664",
      "index": 0,
      "valueDate": 20230327141526,
      "openingDate": 20220929083400,
      "created": 1679926526606,
      "modified": 1679926527341,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
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
        "secretForeignKeys": [
          "715193d7-8b58-4008-92a8-7395befe5b19"
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
  ],
  "nextKeyPair": {}
}
```
</details>

### Filter builder

To create a filter, we can use the [`DataSampleFilter`](/sdks/references/classes/DataSampleFilter#methods-1) builder methods. This builder allows us to create complex filter object.

In the example above, we created the filter this way:

<!-- file://code-samples/how-to/datasamples/index.mts snippet:filter builder-->
```typescript
const dataSampleFilter = new DataSampleFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byLabelCodeDateFilter('IC-TEST', 'TEST')
  .forPatients(api.cryptoApi, [patient])
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
const matchFilter = await new DataSampleFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)
  .forPatients(api.cryptoApi, [patient])
  .build()

const matchedDataSampleIds = await api.dataSampleApi.matchDataSample(matchFilter)
```
<!-- output://code-samples/how-to/datasamples/matchedDataSampleIds.txt -->
<details>
<summary>matchedDataSampleIds</summary>

```text
[
  "50ee8487-6eae-4c9d-a8ce-7e49cbb92919"
]
```
</details>
