---
slug: how-to-manage-hierarchical-data-samples-structure
description: Learn how to create a data sample with hierarchical information.
tags:
- DataSample
- Measure
- TimeSeries
---

# Handling a hierarchical data samples structure

In this section, we will learn how to create data samples with complex nested objects.

:::info

You can learn more about the DataSample class in the [DataSample Glossary reference](/sdks/glossary#data-sample).

:::

:::note

We assume that you already know how to manage data samples. If not, please follow the [Handling DataSamples](/sdks/how-to/how-to-manage-data-samples/index.md) guide

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
    en: new Content({
      measureValue: new Measure({
        value: 72,
        unit: '{beats}/min',
        unitCodes: new Set([
          new CodingReference({ type: 'UCUM', code: '{beats}/min', version: '1.2' }),
        ]),
      }),
    }),
  },
})
```
<!-- output://code-samples/how-to/hierarchical-datasample/oneHourMeanDataSample.txt -->
<details>
<summary>oneHourMeanDataSample</summary>

```json
{
  "comment": "Heart rate 1 hour mean",
  "openingDate": 20220929083400,
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "measureValue": {
        "value": 72,
        "unit": "{beats}/min",
        "unitCodes": {}
      },
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {}
}
```
</details>

### 2. Eight hours mean heart rate measurements.

Then, we will create a DataSample with 8 hours mean heart rate measurements.

<!-- file://code-samples/how-to/hierarchical-datasample/index.mts snippet:create children dataSample eight hour mean-->
```typescript
const eightHourMeanDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '41921-8', version: '2.73' })]),
  comment: 'Heart rate 8 hour mean',
  openingDate: 20220929083400,
  content: {
    en: new Content({
      measureValue: new Measure({
        value: 63,
        unit: '{beats}/min',
        unitCodes: new Set([
          new CodingReference({ type: 'UCUM', code: '{beats}/min', version: '1.2' }),
        ]),
      }),
    }),
  },
})
```
<!-- output://code-samples/how-to/hierarchical-datasample/eightHourMeanDataSample.txt -->
<details>
<summary>eightHourMeanDataSample</summary>

```json
{
  "comment": "Heart rate 8 hour mean",
  "openingDate": 20220929083400,
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "measureValue": {
        "value": 63,
        "unit": "{beats}/min",
        "unitCodes": {}
      },
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {}
}
```
</details>

### 3. Temperatures (TimeSeries)

And finally, we will create a DataSample with multiple temperature measurements, using a `TimeSeries`.

<!-- file://code-samples/how-to/hierarchical-datasample/index.mts snippet:create children dataSample temperatures-->
```typescript
const temperaturesDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '8310-5', version: '2.73' })]),
  comment: 'Body temperature',
  openingDate: 20220929083400,
  content: {
    en: new Content({
      // highlight-start
      timeSeries: new TimeSeries({
        samples: new Array<number>(60).map(Function.call, () =>
          new Array<number>(1).map(Function.call, () => Math.random() + 36.2),
        ), // Simulate 60 random values for temperature between
        // 36.2 and 37.2 (e.g. [[36.5], [37.0], [36.8], ...])
        fields: ['C°'],
      }),
      // highlight-end
    }),
  },
})
```
<!-- output://code-samples/how-to/hierarchical-datasample/temperaturesDataSample.txt -->
<details>
<summary>temperaturesDataSample</summary>

```json
{
  "comment": "Body temperature",
  "openingDate": 20220929083400,
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "timeSeries": {
        "samples": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        "fields": [
          "C°"
        ]
      },
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {}
}
```
</details>

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
    en: new Content({
      compoundValue: [
        // highlight-start
        oneHourMeanDataSample,
        eightHourMeanDataSample,
        temperaturesDataSample,
        // highlight-end
      ],
    }),
  },
})

const createdDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id!,
  meanHeartRateDataSample,
)
```
<!-- output://code-samples/how-to/hierarchical-datasample/meanHeartRateDataSample.txt -->
<details>
<summary>meanHeartRateDataSample</summary>

```json
{
  "openingDate": 20220929083400,
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "compoundValue": [
        {
          "comment": "Heart rate 1 hour mean",
          "openingDate": 20220929083400,
          "identifiers": [],
          "healthcareElementIds": {},
          "canvasesIds": {},
          "content": {
            "en": {
              "measureValue": {
                "value": 72,
                "unit": "{beats}/min",
                "unitCodes": {}
              },
              "compoundValue": [],
              "ratio": [],
              "range": []
            }
          },
          "codes": {},
          "labels": {}
        },
        {
          "comment": "Heart rate 8 hour mean",
          "openingDate": 20220929083400,
          "identifiers": [],
          "healthcareElementIds": {},
          "canvasesIds": {},
          "content": {
            "en": {
              "measureValue": {
                "value": 63,
                "unit": "{beats}/min",
                "unitCodes": {}
              },
              "compoundValue": [],
              "ratio": [],
              "range": []
            }
          },
          "codes": {},
          "labels": {}
        },
        {
          "comment": "Body temperature",
          "openingDate": 20220929083400,
          "identifiers": [],
          "healthcareElementIds": {},
          "canvasesIds": {},
          "content": {
            "en": {
              "timeSeries": {
                "samples": [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                "fields": [
                  "C°"
                ]
              },
              "compoundValue": [],
              "ratio": [],
              "range": []
            }
          },
          "codes": {},
          "labels": {}
        }
      ],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {}
}
```
</details>

<!-- output://code-samples/how-to/hierarchical-datasample/createdDataSample.txt -->
<details>
<summary>createdDataSample</summary>

```json
{
  "id": "81d2da0f-e676-4fa1-86fe-2366cdf7c277",
  "qualifiedLinks": {},
  "batchId": "e5632bcf-5feb-49e0-a4e5-7a9ddc4d8073",
  "index": 0,
  "valueDate": 20230703120926,
  "openingDate": 20220929083400,
  "created": 1688378966794,
  "modified": 1688378966794,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "compoundValue": [
        {
          "id": "3d65cb0c-8964-437e-846c-f0a3338352b6",
          "qualifiedLinks": {},
          "openingDate": 20220929083400,
          "comment": "Heart rate 1 hour mean",
          "identifiers": [],
          "healthcareElementIds": {},
          "canvasesIds": {},
          "content": {
            "en": {
              "measureValue": {
                "value": 72,
                "unit": "{beats}/min",
                "unitCodes": {}
              },
              "compoundValue": [],
              "ratio": [],
              "range": []
            }
          },
          "codes": {},
          "labels": {},
          "systemMetaData": {
            "encryptedSelf": "qN4yRNPzR6+YQriJryleO5nHYUL31JIHJbIB/z/sASwLsJvH7XBAYm7xIXG0O4hOWBY4f+fXqUSTpBCua43ie+CI50o8eba/fIFB7FNs3rpkbqA8nToLidN2kdWzDSLUdC+ngjgvNe7tBh5+uNKzCVrHVvC60Jy8VM6VTiU8uXOKYZ8S77bpQJ88wQsUQUQKGwtc/c1pXCgH/P4zvHhtB3Bn2+JuzRlsIVqrSCqfCq7rD7XoZ6buNnC4FFBkUUYpqiaW5KB2jdGeIPV3VzBMfQ==",
            "secretForeignKeys": [],
            "cryptedForeignKeys": {},
            "delegations": {},
            "encryptionKeys": {},
            "publicKeysForOaepWithSha256": {}
          }
        },
        {
          "id": "39f3ae05-aaa5-495d-8ddb-7b519186860f",
          "qualifiedLinks": {},
          "openingDate": 20220929083400,
          "comment": "Heart rate 8 hour mean",
          "identifiers": [],
          "healthcareElementIds": {},
          "canvasesIds": {},
          "content": {
            "en": {
              "measureValue": {
                "value": 63,
                "unit": "{beats}/min",
                "unitCodes": {}
              },
              "compoundValue": [],
              "ratio": [],
              "range": []
            }
          },
          "codes": {},
          "labels": {},
          "systemMetaData": {
            "encryptedSelf": "D0rjznJhSfpSf6VpwUtKGQa3vvFpqoiL7HFuESeuEq05DuVPrfTYp7S3DMA7lo337XyGgWRhCEPDl5f3Nyw+SfeJMbL6lzQzsZR0C936rqsbtQfjeEjODxyBVuAQhy500yFN2U7adGLY0lWSsJe57EVDe4tkSAlJP8tJqBNfyrAi7X07fCtOqU4GzrUsYbI3RJKaXgB0TFIEFOImVLz5+Eq9dMjKbJiIxHmqj5FVMg+uqkxKCV7brP+OeNxJ/A7qSjwQlKOG/p9uwhDzjoaOfg==",
            "secretForeignKeys": [],
            "cryptedForeignKeys": {},
            "delegations": {},
            "encryptionKeys": {},
            "publicKeysForOaepWithSha256": {}
          }
        },
        {
          "id": "7bb7d542-6501-4344-906f-e15b27201a8c",
          "qualifiedLinks": {},
          "openingDate": 20220929083400,
          "comment": "Body temperature",
          "identifiers": [],
          "healthcareElementIds": {},
          "canvasesIds": {},
          "content": {
            "en": {
              "timeSeries": {
                "fields": [
                  "C°"
                ],
                "samples": [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                "min": [],
                "max": [],
                "mean": [],
                "median": [],
                "variance": []
              },
              "compoundValue": [],
              "ratio": [],
              "range": []
            }
          },
          "codes": {},
          "labels": {},
          "systemMetaData": {
            "secretForeignKeys": [],
            "cryptedForeignKeys": {},
            "delegations": {},
            "encryptionKeys": {},
            "publicKeysForOaepWithSha256": {}
          }
        }
      ],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "659454da-f513-4a9b-8fda-f5095586e3ab"
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

## Additional information

### Accessing the children DataSamples

The children DataSamples are not directly accessible. They are only accessible through the parent DataSample.

### Filtering

Currently, you cannot apply filter on nested DataSamples. You can only filter on the parent DataSample. If you want to filter on nested DataSamples, you can replicate the information of the children on the parent DataSample. (e.g. `labels` of [Create the parent DataSample](#create-the-parent-datasample))

### Deleting and updating

You can update or delete nested DataSamples. But you will have to do it manually by updating the parent DataSample.
