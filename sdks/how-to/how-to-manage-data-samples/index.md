---
slug: how-to-manage-data-samples
description: Learn how to manage {{services}}
tags:

- {{services}}

---

# Handling {{Services}}

In this section, we will learn how to manage {{services}}. {{Services}} are used to store data that is not part of the
patient's medical record, such as blood pressure measurements.

:::note

We assume in the examples below that you have already created a patient. If not, please follow
the [Handling patients](/{{sdk}}/how-to/how-to-manage-patients) guide.

:::

## How to create {{ServiceNoSpaces}}?

To create {{ServiceNoSpaces}}, we can use the `createOrModifyFor` method on the `{{ServiceNoSpace}}Api` object. This method
takes two parameters: the patient's id and the {{ServiceNoSpace}} object.

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:create a dataSample-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/createdDataSample.txt -->
<details>
<summary>createdDataSample</summary>

```json
```
</details>

In this example, we created a {{ServiceNoSpace}} with the `IC-TEST` tag code and `TEST` tag type. We also added a comment and an
opening date.

:::info

Behind the scenes: the `createOrModifyFor` method will encrypt the `{{ServiceNoSpace}}` and send it to the iCure backend. From now on you will be able to retrieve the content of this `{{ServiceNoSpace}}` only if you have the correct key to decrypt it.

:::

## How to retrieve {{ServiceNoSpaces}}?

To retrieve a {{ServiceNoSpace}}, we can use the `get` method on the `{{ServiceNoSpace}}Api`. This method takes one
parameter: the {{ServiceNoSpace}}'s id.

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:get a dataSample-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
```
</details>

## How to update {{ServiceNoSpaces}}?

In order to update a {{ServiceNoSpace}}, we can use the `createOrModifyFor` method on the `{{ServiceNoSpace}}Api`. This method takes two parameters: the patient's id and the {{ServiceNoSpace}} object. 

:::info

The patient's id **must** be the same as the one used to create the {{ServiceNoSpace}}.

If you linked the {{ServiceNoSpace}} to the wrong patient, you have to delete the first {{ServiceNoSpace}} and create a new one with the correct patient's id.

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

## How to delete {{ServiceNoSpaces}}?

To delete a {{ServiceNoSpace}}, you can use the `delete` method on the `{{ServiceNoSpace}}Api`. This method takes one parameter: the {{ServiceNoSpace}}'s id.

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:delete a dataSample-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/deletedDataSample.txt -->
<details>
<summary>deletedDataSample</summary>

```text
```
</details>

## How to filter {{ServiceNoSpaces}}?

To retrieve a list of {{ServiceNoSpace}}, we can use the `filterBy` method on the `{{ServiceNoSpace}}Api`. This method takes one parameter: the filter object.

We can build the filter object using the `{{ServiceNoSpace}}Filter` builder.

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

To create a filter, we can use the [`{{ServiceNoSpace}}Filter`](/{{sdk}}/references/filters/DataSampleFilter#methods) builder methods. This builder allows us to create complex filter object.

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

The resulting filter object will create a filter that allows us to get all `{{ServiceNoSpaces}}` that satisfy all the following requirements:

- The `{{ServiceNoSpace}}` is owned by the logged user's healthcare party
- The `{{ServiceNoSpace}}` has a tag with type `IC-TEST` and code `TEST`
- The `{{ServiceNoSpace}}` is linked to `patient`

## How to get a list of {{ServiceNoSpace}} ids?

In some circumstances, you might want to get a list of {{ServiceNoSpace}} ids instead of the {{ServiceNoSpaces}} themselves. To do so, you can use the `matchBy` method on the `{{ServiceNoSpace}}Api`. This method takes one parameter: the filter object.

<!-- file://code-samples/{{sdk}}/how-to/datasamples/index.mts snippet:get a list of dataSamples ids-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/datasamples/matchedDataSampleIds.txt -->
<details>
<summary>matchedDataSampleIds</summary>

```text
```
</details>
