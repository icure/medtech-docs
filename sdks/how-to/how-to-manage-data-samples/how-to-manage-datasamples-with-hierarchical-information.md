---
slug: how-to-manage-hierarchical-data-samples-structure
description: Learn how to create a {{service}} with hierarchical information.
tags:
- DataSample
- Measure
- TimeSeries
---

# Handling a hierarchical {{services}} structure

In this section, we will learn how to create {{services}} with complex nested objects.

:::info

You can learn more about the DataSample class in the [DataSample Glossary reference](/{{sdk}}/glossary#data-sample).

:::

:::note

We assume that you already know how to manage {{services}}. If not, please follow the [Handling DataSamples](/{{sdk}}/how-to/how-to-manage-data-samples/index.md) guide

:::

## Create children DataSamples

In some cases, you may want to create a `DataSample` with nested DataSamples. 
For example, you may want to create a single `DataSample` which groups mean heart rate measurements over
different time intervals (1 hour mean heart rate, 8 hour mean heart, ...).

As you know the `content` of a `DataSample` is a `Map<String, Content>`, where each entry associates a language code ([ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)) to a [`Content`](/{{sdk}}/references/classes/Content) object.

A `Content` object allows us to store different types of data. In this example we will use the `compoundValue`, `measureValue` and `timeSeries` properties.

### 1. One hour mean heart rate measurements.

The first step is to create the children DataSamples. For example, we will create a DataSample with 1 hour mean heart rate measurements.

<!-- file://code-samples/{{sdk}}/how-to/hierarchical-datasample/index.mts snippet:create children dataSample one hour mean-->
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
<!-- output://code-samples/{{sdk}}/how-to/hierarchical-datasample/oneHourMeanDataSample.txt -->
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

<!-- file://code-samples/{{sdk}}/how-to/hierarchical-datasample/index.mts snippet:create children dataSample eight hour mean-->
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
<!-- output://code-samples/{{sdk}}/how-to/hierarchical-datasample/eightHourMeanDataSample.txt -->
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

<!-- file://code-samples/{{sdk}}/how-to/hierarchical-datasample/index.mts snippet:create children dataSample temperatures-->
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
<!-- output://code-samples/{{sdk}}/how-to/hierarchical-datasample/temperaturesDataSample.txt -->
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

<!-- file://code-samples/{{sdk}}/how-to/hierarchical-datasample/index.mts snippet:create heart rate datasample-->
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
<!-- output://code-samples/{{sdk}}/how-to/hierarchical-datasample/meanHeartRateDataSample.txt -->
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

<!-- output://code-samples/{{sdk}}/how-to/hierarchical-datasample/createdDataSample.txt -->
<details>
<summary>createdDataSample</summary>

```json
{
  "id": "6e12ef8a-e62d-4abc-b9e2-622d8ee1a5ed",
  "qualifiedLinks": {},
  "batchId": "99e6b010-d3a8-4e36-8ba4-75a7c495a748",
  "index": 0,
  "valueDate": 20230327141535,
  "openingDate": 20220929083400,
  "created": 1679926535583,
  "modified": 1679926535583,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "compoundValue": [
        {
          "id": "4cecbb7c-24bf-4a90-ac04-6acd6929c244",
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
            "secretForeignKeys": [],
            "cryptedForeignKeys": {},
            "delegations": {},
            "encryptionKeys": {}
          }
        },
        {
          "id": "9a4318dd-7f17-42b9-9e46-8b5497139138",
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
            "secretForeignKeys": [],
            "cryptedForeignKeys": {},
            "delegations": {},
            "encryptionKeys": {}
          }
        },
        {
          "id": "b40f6fc5-9fec-4367-b7d8-574bdb4090a8",
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
            "encryptionKeys": {}
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
      "c55a9a2a-b18a-484d-9c7f-0da7a1db3329"
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

## Additional information

### Accessing the children DataSamples

The children DataSamples are not directly accessible. They are only accessible through the parent DataSample.

### Filtering

Currently, you cannot apply filter on nested DataSamples. You can only filter on the parent DataSample. If you want to filter on nested DataSamples, you can replicate the information of the children on the parent DataSample. (e.g. `labels` of [Create the parent DataSample](#create-the-parent-datasample))

### Deleting and updating

You can update or delete nested DataSamples. But you will have to do it manually by updating the parent DataSample.
