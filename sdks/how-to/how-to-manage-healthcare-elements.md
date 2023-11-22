---
slug: how-to-manage-healthcare-elements
description: Learn how to manage {{healthcareElements}}
tags:
- HealthcareElement
---
# Handling {{healthcareElements}}

## What is a {{HealthcareElement}}?

A [{{HealthcareElement}}](../references/classes/HealthcareElement) is a piece of medical information that can be used to give more details about the context of a [{{Service}}](../references/classes/DataSample).  
It typically describes a long-lasting condition affecting a Patient.
{{HealthcareElements}} can be created by [Patient](../references/classes/Patient) and {{Hcp}}. The sensitive information they contain are 
encrypted and can be read only by Data Owners with an explicit access.

:::note

To perform the following operations, we suppose you have at least a Patient and a {{Hcp}} in your database.

:::

## Creating a {{HealthcareElement}}

In the following example, a {{Hcp}} will create, for a Patient, a {{HealthcareElement}} describing a medical condition.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:create a HE as data owner-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/newHealthcareElement.txt -->
<details>
<summary>newHealthcareElement</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
```
</details>

:::note

If not specified, the value of the following parameters will be automatically set by the iCure API:

* `id` (to a random UUID)
* `created` (to the current timestamp)
* `modified` (to the current timestamp)
* `author` (to the id of the user who created this Healthcare Element)
* `responsible` (to the id of the Data Owner id who created this Healthcare Element)
* `healthElementId` (to the id of the current Healthcare Element)
* `valueDate` (to the current timestamp)
* `openingDate` (to the current timestamp)

:::

When creating a new {{HealthcareElement}}, you must specify the Patient it is associated to.  
If the method runs successfully, the Promise will return the newly created {{HealthcareElement}}.
It is also possible to create a series of {{HealthcareElements}} that describe a medical history. In a medical history, 
the {{healthcareElements}} share the same `healthcareElementId`

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:create multiple related HEs as data owner-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/startHealthcareElement.txt -->
<details>
<summary>startHealthcareElement</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/followUpHealthcareElement.txt -->
<details>
<summary>followUpHealthcareElement</summary>

```json
```
</details>

:::note

The `healthcareElementId` is the id of the first {{HealthcareElement}} of the series.

:::

Several unrelated {{HealthcareElements}} can also be created at once.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:create multiple HEs as data owner-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElement1.txt -->
<details>
<summary>healthcareElement1</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElement2.txt -->
<details>
<summary>healthcareElement2</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/newElements.txt -->
<details>
<summary>newElements</summary>

```text
```
</details>

:::caution

Even if you associate a {{HealthcareElement}} to a Patient, the Patient does not automatically have access to it. 
You need to explicitly give access to the patient user to this created {{HealthcareElement}} by calling the service `giveAccessTo`.

:::

## Sharing a {{HealthcareElement}} with a Patient

After creating the {{HealthcareElement}}, the {{Hcp}} can share it with the Patient.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:HE sharing with data owner-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/sharedHealthcareElement.txt -->
<details>
<summary>sharedHealthcareElement</summary>

```json
```
</details>

If the operation is successful, the method returns a Promise with the updated {{HealthcareElement}}.  
Using the same service, the {{Hcp}} can share the Healthcare Element with another Healthcare Professional.

:::note

Any Data Owner that has access to a {{HealthcareElement}} can share it with another Data Owner using this service.  
A Patient could allow another Patient or {{Hcp}} to access a {{HealthcareElement}}.

:::

## Retrieving a {{HealthcareElement}} Using its ID

A single {{HealthcareElement}} can be retrieved from the iCure Back-end using its id.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:retrieve a HE as data owner-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/retrievedHealthcareElement.txt -->
<details>
<summary>retrievedHealthcareElement</summary>

```json
```
</details>

:::caution

Trying to retrieve a {{HealthcareElement}} you do not have access to will produce an error.

:::

## Modifying a {{HealthcareElement}}

Given an existing {{HealthcareElement}}, it is possible to modify it.  

:::note

The id and rev fields cannot be modified.

:::

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:modify a HE as data owner-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/yetAnotherHealthcareElement.txt -->
<details>
<summary>yetAnotherHealthcareElement</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/modifiedHealthcareElement.txt -->
<details>
<summary>modifiedHealthcareElement</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/modificationResult.txt -->
<details>
<summary>modificationResult</summary>

```json
```
</details>

If the operation is successful, the method returns the updated {{HealthcareElement}}.

:::caution

To update a {{HealthcareElement}}, both id and rev fields must be valid:

* the id should be the one of an existing {{HealthcareElement}}
* the rev is a field automatically managed by the iCure API to handle conflicts. It must be equal to the one received
 from the server when creating or getting the {{HealthcareElement}} you want to modify.

:::

## Retrieving {{HealthcareElement}} Using Complex Search Criteria

If you want to retrieve a set of {{HealthcareElement}} that satisfy complex criteria, you can use a Filter.  
In the following example, you will instantiate a filter to retrieve all the {{HealthcareElement}} of a Patient that a {{Hcp}}
 can access

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:create HE filter-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementFilter.txt -->
<details>
<summary>healthcareElementFilter</summary>

```json
```
</details>

:::note

You can learn more about filters in the [how to](../how-to/how-to-filter-data-with-advanced-search-criteria).

:::

After creating a filter, you can use it to retrieve the {{HealthcareElements}}.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:use HE filter method-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementsFirstPage.txt -->
<details>
<summary>healthcareElementsFirstPage</summary>

```json
```
</details>

The `filterBy` method returns a PaginatedList that contains at most the number of elements stated
 in the method's parameter. If you do not specify any number, the default value is 1000.  
To retrieve more {{HealthcareElements}}, you can call the same method again, using the startDocumentId provided in the previous PaginatedList.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:use HE filter method second page-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementsSecondPage.txt -->
<details>
<summary>healthcareElementsSecondPage</summary>

```json
```
</details>

If the `nextKeyPair` property of the result is `undefined`, than there are no more {{HealthcareElements}} to retrieve.  
You can also retrieve just the id of the {{HealthcareElement}} instead of the whole documents by using the match method.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:use HE match method-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementsIdList.txt -->
<details>
<summary>healthcareElementsIdList</summary>

```text
```
</details>

You can also retrieve all the {{HealthcareElements}} belonging to a specific patient that the current Data Owner 
can access.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:use by patient method-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementsForPatient.txt -->
<details>
<summary>healthcareElementsForPatient</summary>

```text
```
</details>

## Deleting a {{HealthcareElement}}

Finally, a Data Owner that has access to a {{HealthcareElement}} can decide to delete it.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:delete a HE as data owner-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementToDelete.txt -->
<details>
<summary>healthcareElementToDelete</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/deletedHealthcareElement.txt -->
<details>
<summary>deletedHealthcareElement</summary>

```text
```
</details>
