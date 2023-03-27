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
    content: { en: { stringValue: 'Hello world' } },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
```

<details>
    <summary>Output</summary>

```json
{
  "id": "1a9b7f64-2dc1-4436-af21-087167f700e3",
  "identifier": [],
  "content": {
    "en": {
      "stringValue": "Hello world"
    }
  },
  "qualifiedLinks": {},
  "codes": {},
  "labels": {},
  "batchId": "3d1fa254-eaf6-4515-a719-7c5c0a63efae",
  "healthcareElementIds": {},
  "canvasesIds": {},
  "index": 0,
  "valueDate": 20220929115108,
  "openingDate": 20220929083400,
  "created": 1664452268208,
  "modified": 1664452268208,
  "author": "b36fa6cb-d7a8-40f0-bcf6-af6ce0decb78",
  "responsible": "ab623d88-baed-40b9-91b7-ab26e9a08db5",
  "comment": "This is a comment",
  "systemMetaData": {
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {},
    "encryptionKeys": {}
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

<details>
	<summary>Output:</summary>

```json
{
  "id": "1a9b7f64-2dc1-4436-af21-087167f700e3",
  "identifier": [],
  "content": {
    "en": {
      "stringValue": "Hello world"
    }
  },
  "qualifiedLinks": {},
  "codes": {},
  "labels": {},
  "batchId": "3d1fa254-eaf6-4515-a719-7c5c0a63efae",
  "healthcareElementIds": {},
  "canvasesIds": {},
  "index": 0,
  "valueDate": 20220929115108,
  "openingDate": 20220929083400,
  "created": 1664452268208,
  "modified": 1664452268208,
  "author": "b36fa6cb-d7a8-40f0-bcf6-af6ce0decb78",
  "responsible": "ab623d88-baed-40b9-91b7-ab26e9a08db5",
  "comment": "This is a comment",
  "systemMetaData": {
    "secretForeignKeys": [
      "694592d4-7af1-4295-bf52-de8d5c8d5a73"
    ],
    "cryptedForeignKeys": {
      "ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
    },
    "delegations": {
      "ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
    },
    "encryptionKeys": {
      "ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
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
const updatedDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(patient.id!, {
  ...createdDataSample,
  // highlight-start
  content: { en: { stringValue: 'Hello world updated' } },
  comment: 'This is a updated comment',
  modified: undefined,
  // highlight-end
})
```

<details>
    <summary>Output:</summary>

```json
{
  "id": "1a9b7f64-2dc1-4436-af21-087167f700e3",
  "identifier": [],
  "content": {
    "en": {
      "stringValue": "Hello world updated"
    }
  },
  "qualifiedLinks": {},
  "codes": {},
  "labels": {},
  "batchId": "3d1fa254-eaf6-4515-a719-7c5c0a63efae",
  "healthcareElementIds": {},
  "canvasesIds": {},
  "index": 0,
  "valueDate": 20220929115108,
  "openingDate": 20220929083400,
  "created": 1664452268208,
  "modified": 1664452269234,
  "author": "b36fa6cb-d7a8-40f0-bcf6-af6ce0decb78",
  "responsible": "ab623d88-baed-40b9-91b7-ab26e9a08db5",
  "comment": "This is a updated comment",
  "systemMetaData": {
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {},
    "encryptionKeys": {}
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

## How to filter DataSamples&#8239;?

To retrieve a list of DataSamples, we can use the `filterDataSamples` method on the `DataSampleApi`. This method takes one parameter: the filter object.

We can build the filter object using the `DataSampleFilter` builder.

<!-- file://code-samples/how-to/datasamples/index.mts snippet:get a list of dataSamples-->
```typescript
const filter = await new DataSampleFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byLabelCodeFilter('IC-TEST', 'TEST')
  .forPatients(api.cryptoApi, [patient])
  .build()

const filteredDataSamples = await api.dataSampleApi.filterDataSample(filter)
```

<details>
    <summary>Output</summary>

```json
{
  "pageSize": 1,
  "totalSize": 1,
  "rows": [
    {
      "id": "1a9b7f64-2dc1-4436-af21-087167f700e3",
      "identifier": [],
      "content": {
        "en": {
          "stringValue": "Hello world updated"
        }
      },
      "qualifiedLinks": {},
      "codes": {},
      "labels": {},
      "batchId": "3d1fa254-eaf6-4515-a719-7c5c0a63efae",
      "healthcareElementIds": {},
      "canvasesIds": {},
      "index": 0,
      "valueDate": 20220929115108,
      "openingDate": 20220929083400,
      "created": 1664452268208,
      "modified": 1664452269234,
      "author": "b36fa6cb-d7a8-40f0-bcf6-af6ce0decb78",
      "responsible": "ab623d88-baed-40b9-91b7-ab26e9a08db5",
      "comment": "This is a updated comment",
      "systemMetaData": {
        "secretForeignKeys": [
          "694592d4-7af1-4295-bf52-de8d5c8d5a73"
        ],
        "cryptedForeignKeys": {
          "ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
        },
        "delegations": {
          "ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
        },
        "encryptionKeys": {
          "ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
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
new DataSampleFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byLabelCodeFilter('IC-TEST', 'TEST')
  .forPatients(api.cryptoApi, [patient])
  .build()
```

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

<details>
    <summary>Output</summary>

```json
[
  "1a9b7f64-2dc1-4436-af21-087167f700e3"
]
```

</details>
