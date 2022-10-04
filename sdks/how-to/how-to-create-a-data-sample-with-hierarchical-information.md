---
slug: how-to-create-a-data-sample-with-hierarchical-information
description: Learn how to create a data sample with hierarchical information.
tags:
- DataSample
- Measure
- TimeSeries
---

# How to create a data sample with hierarchical information

In this section, we will learn how to create data samples with complex nested objects.

:::info

You can learn more about the DataSample class in the [DataSample Glossary reference](../glossary#data-sample).

:::

:::note

We assume that you already know how to manage data samples. If not, please follow the [Handling DataSamples](../how-to/how-to-manage-datasamples) guide

:::

## Create children DataSamples

In some cases, you may want to create a `DataSample` with nested DataSamples. 
For example, you may want to create a single `DataSample` which groups mean heart rate measurements over
different time intervals (1 hour mean heart rate, 8 hour mean heart, ...).

As you know the `content` of a `DataSample` is a `Map<String, Content>`, where each entry associates a language code ([ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)) to a [`Content`](/sdks/references/classes/Content) object.

A `Content` object allows us to store different types of data. In this example we will use the `compoundValue`, `measureValue` and `timeSeries` properties.

### 1. One hour mean heart rate measurements.

The first step is to create the children DataSamples. For example, we will create a DataSample with 1 hour mean heart rate measurements.

<!-- file://code-samples/how-to/hierarchical-datasample/index.mts snippet:create children dataSample one hour mean-->
```typescript
const oneHourMeanDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '41920-0', version: '2.73' })]),
  comment: 'Heart rate 1 hour mean',
  openingDate: 20220929083400,
  content: {
    en: {
      measureValue: {
        value: 72,
        unit: '{beats}/min',
        unitCodes: new Set([new CodingReference({ type: 'UCUM', code: '{beats}/min', version: '1.2' })]),
      },
    },
  },
})
```

### 2. Eight hours mean heart rate measurements.

Then, we will create a DataSample with 8 hours mean heart rate measurements.

<!-- file://code-samples/how-to/hierarchical-datasample/index.mts snippet:create children dataSample eight hour mean-->
```typescript
const eightHourMeanDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '41921-8', version: '2.73' })]),
  comment: 'Heart rate 8 hour mean',
  openingDate: 20220929083400,
  content: {
    en: {
      measureValue: {
        value: 63,
        unit: '{beats}/min',
        unitCodes: new Set([new CodingReference({ type: 'UCUM', code: '{beats}/min', version: '1.2' })]),
      },
    },
  },
})
```

### 3. Temperatures (TimeSeries)

And finally, we will create a DataSample with multiple temperature measurements, using a `TimeSeries`.

<!-- file://code-samples/how-to/hierarchical-datasample/index.mts snippet:create children dataSample temperatures-->
```typescript
const temperaturesDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '8310-5', version: '2.73' })]),
  comment: 'Body temperature',
  openingDate: 20220929083400,
  content: {
    en: {
      // highlight-start
      timeSeries: new TimeSeries({
        samples: Array.apply(null, { length: 60 }).map(Function.call, () => Array.apply(null, { length: 1 }).map(Function.call, () => Math.random() + 36.2)), // Simulate 60 random values for temperature between 36.2 and 37.2 (e.g. [[36.5], [37.0], [36.8], ...])
        fields: ['C°'],
      }),
      // highlight-end
    },
  },
})
```

:::caution

These examples are in no way real values. They are only used to illustrate the concept.

:::

## Create the parent DataSample

Now that we have created the children DataSamples, we can create the parent DataSample.

<!-- file://code-samples/how-to/hierarchical-datasample/index.mts snippet:create heart rate datasample-->
```typescript
const meanHeartRateDataSample = new DataSample({
  labels: new Set([
    new CodingReference({ type: 'LOINC', code: '43149-4', version: '2.73' }),
    // highlight-start
    new CodingReference({ type: 'LOINC', code: '41920-0', version: '2.73' }),
    new CodingReference({ type: 'LOINC', code: '41921-8', version: '2.73' }),
    // highlight-end
  ]),
  openingDate: 20220929083400,
  content: {
    en: {
      compoundValue: [
        // highlight-start
        oneHourMeanDataSample,
        eightHourMeanDataSample,
        temperaturesDataSample,
        // highlight-end
      ],
    },
  },
})

const createdDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(patient.id!, meanHeartRateDataSample)
```

<details>
    <summary>Output</summary>

```json
{
  "id": "7fc48e2e-3718-4388-ae0e-fc1b4cd1a19c",
  "identifier": [],
  "content": {
    "en": {
      "compoundValue": [
        {
          "id": "084371fd-b5ad-45e3-a21c-64158b83fdc7",
          "identifier": [],
          "content": {
            "en": {
              "timeSeries": {
                "fields": [
                  "C°"
                ],
                "samples": [
                  [
                    36.56299537967781
                  ],
                  [
                    36.4297076828631
                  ],
                  [
                    36.443597548686064
                  ],
                  [
                    36.5490239818563
                  ],
                  [
                    36.668913688817824
                  ]
                  /**
                   * ...
                   */
                ]
              }
            }
          },
          "qualifiedLinks": {},
          "codes": {},
          "labels": {},
          "healthcareElementIds": {},
          "canvasesIds": {},
          "openingDate": 20220929083400,
          "comment": "Body temperature",
          "systemMetaData": {
            "secretForeignKeys": [],
            "cryptedForeignKeys": {},
            "delegations": {},
            "encryptionKeys": {}
          }
        },
        {
          "id": "5a9e6237-fc65-4801-b50b-ebcc2925adcc",
          "identifier": [],
          "content": {
            "en": {
              "measureValue": {
                "value": 63,
                "unit": "{beats}/min",
                "unitCodes": {}
              }
            }
          },
          "qualifiedLinks": {},
          "codes": {},
          "labels": {},
          "healthcareElementIds": {},
          "canvasesIds": {},
          "openingDate": 20220929083400,
          "comment": "Heart rate 8 hour mean",
          "systemMetaData": {
            "secretForeignKeys": [],
            "cryptedForeignKeys": {},
            "delegations": {},
            "encryptionKeys": {}
          }
        },
        {
          "id": "d59906c3-ea1e-4717-bb45-92804c47ced9",
          "identifier": [],
          "content": {
            "en": {
              "measureValue": {
                "value": 72,
                "unit": "{beats}/min",
                "unitCodes": {}
              }
            }
          },
          "qualifiedLinks": {},
          "codes": {},
          "labels": {},
          "healthcareElementIds": {},
          "canvasesIds": {},
          "openingDate": 20220929083400,
          "comment": "Heart rate 1 hour mean",
          "systemMetaData": {
            "secretForeignKeys": [],
            "cryptedForeignKeys": {},
            "delegations": {},
            "encryptionKeys": {}
          }
        }
      ]
    }
  },
  "qualifiedLinks": {},
  "codes": {},
  "labels": {},
  "batchId": "683f14f1-ff41-43c3-8b7a-1eb69dc6821d",
  "healthcareElementIds": {},
  "canvasesIds": {},
  "index": 0,
  "valueDate": 20220930122128,
  "openingDate": 20220929083400,
  "created": 1664540488422,
  "modified": 1664540488421,
  "author": "b36fa6cb-d7a8-40f0-bcf6-af6ce0decb78",
  "responsible": "ab623d88-baed-40b9-91b7-ab26e9a08db5",
  "systemMetaData": {
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {},
    "encryptionKeys": {}
  }
}
```
</details>

## Additional information

### Accessing the children DataSamples

The children DataSamples are not directly accessible. They are only accessible through the parent DataSample.

### Filtering

Currently, you cannot apply filter on nested DataSamples. You can only filter on the parent DataSample. If you want to filter on nested DataSamples, you can replicate the information of the children on the parent DataSample. (e.g. `labels` of [Create the parent DataSample](#create-the-parent-datasample))

### Deleting and updating

You can update or delete nested DataSamples. But you will have to do it manually by updating the parent DataSample.
