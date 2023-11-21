---
slug: how-to-manage-hierarchical-data-samples-structure
description: Learn how to create a {{service}} with hierarchical information.
sidebar_position: 50
tags:
- {{service}}
- Measure
- TimeSeries
---

# Handling a hierarchical {{services}} structure

In this section, we will learn how to create {{services}} with complex nested objects.

:::info

You can learn more about the {{service}} class in the [{{ServiceNoSpace}} Glossary reference](/{{sdk}}/glossary#data-sample).

:::

:::note

We assume that you already know how to manage {{services}}. If not, please follow the [Handling {{ServiceNoSpaces}}](/{{sdk}}/how-to/how-to-manage-data-samples/index.md) guide

:::

## Create children {{ServiceNoSpaces}}

In some cases, you may want to create a `{{ServiceNoSpace}}` with nested {{ServiceNoSpaces}}. 
For example, you may want to create a single `{{ServiceNoSpace}}` which groups mean heart rate measurements over
different time intervals (1 hour mean heart rate, 8 hour mean heart, ...).

{{#medtech}}
As you know the `content` of a `{{ServiceNoSpace}}` is a `Map<String, Content>`, where each entry associates a language code ([ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)) to a [`Content`](/{{sdk}}/references/classes/Content) object.
{{/medtech}}
{{#ehrlite}}
As you know a `{{ServiceNoSpace}}` has `Content` property.
{{/ehrlite}}

A `Content` object allows us to store different types of data. In this example we will use the `compoundValue`, `measureValue` and `timeSeries` properties.

### 1. One hour mean heart rate measurements.

The first step is to create the children {{ServiceNoSpaces}}. For example, we will create a {{ServiceNoSpace}} with 1 hour mean heart rate measurements.

<!-- file://code-samples/{{sdk}}/how-to/hierarchical-datasample/index.mts snippet:create children dataSample one hour mean-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/hierarchical-datasample/oneHourMeanDataSample.txt -->
<details>
<summary>oneHourMeanDataSample</summary>

```json
```
</details>

### 2. Eight hours mean heart rate measurements.

Then, we will create a {{ServiceNoSpace}} with 8 hours mean heart rate measurements.

<!-- file://code-samples/{{sdk}}/how-to/hierarchical-datasample/index.mts snippet:create children dataSample eight hour mean-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/hierarchical-datasample/eightHourMeanDataSample.txt -->
<details>
<summary>eightHourMeanDataSample</summary>

```json
```
</details>

### 3. Temperatures (TimeSeries)

And finally, we will create a {{ServiceNoSpace}} with multiple temperature measurements, using a `TimeSeries`.

<!-- file://code-samples/{{sdk}}/how-to/hierarchical-datasample/index.mts snippet:create children dataSample temperatures-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/hierarchical-datasample/temperaturesDataSample.txt -->
<details>
<summary>temperaturesDataSample</summary>

```json
```
</details>

:::caution

These examples are in no way real values. They are only used to illustrate the concept.

:::

## Create the parent {{ServiceNoSpace}}

Now that we have created the children {{ServiceNoSpaces}}, we can create the parent {{ServiceNoSpace}}.

<!-- file://code-samples/{{sdk}}/how-to/hierarchical-datasample/index.mts snippet:create heart rate datasample-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/hierarchical-datasample/meanHeartRateDataSample.txt -->
<details>
<summary>meanHeartRateDataSample</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/hierarchical-datasample/createdDataSample.txt -->
<details>
<summary>createdDataSample</summary>

```json
```
</details>

## Additional information

### Accessing the children {{ServiceNoSpaces}}

The children {{ServiceNoSpaces}} are not directly accessible. They are only accessible through the parent {{ServiceNoSpace}}.

### Filtering

Currently, you cannot apply filter on nested {{ServiceNoSpaces}}. You can only filter on the parent {{ServiceNoSpace}}. If you want to filter on nested {{ServiceNoSpaces}}, you can replicate the information of the children on the parent {{ServiceNoSpace}}. (e.g. `labels` of [Create the parent {{ServiceNoSpace}}](#create-the-parent-{{serviceNoSpace}}))

### Deleting and updating

You can update or delete nested {{ServiceNoSpaces}}. But you will have to do it manually by updating the parent {{ServiceNoSpace}}.
