---
slug: how-to-manage-data-samples
description: Learn how to manage {{services}}
tags:

- DataSample

---

# Handling {{services}}

In this section, we will learn how to manage {{services}}. DataSamples are used to store data that is not part of the
patient's medical record, such as blood pressure measurements.

:::note

We assume in the examples below that you have already created a patient. If not, please follow
the [Handling patients](/{{sdk}}/how-to/how-to-manage-patients) guide.

:::

## How to create a DataSample&#8239;?

To create a DataSample, we can use the `createOrModifyDataSampleFor` method on the `DataSampleApi` object. This method
takes two parameters: the patient's id and the DataSample object.

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:create a dataSample-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/createdDataSample.txt -->
<details>
<summary>createdDataSample</summary>

```json
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

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:get a dataSample-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
```
</details>

## How to update a DataSample&#8239;?

In order to update a DataSample, we can use the `createOrModifyDataSampleFor` method on the `DataSampleApi`. This method takes two parameters: the patient's id and the DataSample object. 

:::info

The patient's id **must** be the same as the one used to create the DataSample.

If you linked the DataSample at the wrong patient, you have to delete the first DataSample and create a new one with the correct patient's id.

:::

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:update a dataSample-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/updatedDataSample.txt -->
<details>
<summary>updatedDataSample</summary>

```json
```
</details>

## How to delete a DataSample&#8239;?

To delete a DataSample, you can use the `deleteDataSample` method on the `DataSampleApi`. This method takes one parameter: the DataSample's id.

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:delete a dataSample-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/deletedDataSample.txt -->
<details>
<summary>deletedDataSample</summary>

```text
```
</details>

## How to filter DataSamples&#8239;?

To retrieve a list of DataSamples, we can use the `filterDataSamples` method on the `DataSampleApi`. This method takes one parameter: the filter object.

We can build the filter object using the `DataSampleFilter` builder.

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:get a list of dataSamples-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/filteredDataSamples.txt -->
<details>
<summary>filteredDataSamples</summary>

```json
```
</details>

### Filter builder

To create a filter, we can use the [`DataSampleFilter`](/{{sdk}}/references/filters/DataSampleFilter#methods) builder methods. This builder allows us to create complex filter object.

In the example above, we created the filter this way:

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:filter builder-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/dataSampleFilter.txt -->
<details>
<summary>dataSampleFilter</summary>

```json
```
</details>

The resulting filter object will create a filter that allows us to get all `DataSamples` that satisfy all the following requirements:

- The `DataSample` is owned by the logged user's healthcare party
- The `DataSample` has a tag with type `IC-TEST` and code `TEST`
- The `DataSample` is linked to `patient`

## How to get a list of DataSample ids&#8239;?

In some circumstances, you might want to get a list of DataSample ids instead of the DataSamples themselves. To do so, you can use the `matchDataSample` method on the `DataSampleApi`. This method takes one parameter: the filter object.

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:get a list of dataSamples ids-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/matchedDataSampleIds.txt -->
<details>
<summary>matchedDataSampleIds</summary>

```text
```
</details>
