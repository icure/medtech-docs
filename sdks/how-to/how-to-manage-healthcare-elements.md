---
slug: how-to-manage-healthcare-elements
description: Learn how to manage healthcare elements
tags:
- HealthcareElement
---
# How to Manage Healthcare Elements

## What is a Healthcare Element?

A Healthcare Element is a piece of medical information that can be used to give more details about the context of a 
Patient or a Data Sample.  
Healthcare Elements can be created by Patients and Healthcare Professionals. As they contain sensitive information, it is
possible to access them only if in possess of a delegation.

:::note

To perform the following operations, we suppose you have at least a Patient and a Healthcare Professional in your database.

:::

## Creating a Healthcare Element

In the following example, a Healthcare Professional will create a Healthcare Element related to a Patient, to update its
 condition related to a disease.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:create a HE as data owner-->
```typescript
```

:::note

The value of some parameters, such as the id of the Healthcare Element, its author or the responsible Data Owner will be
filled automatically by the backend.

:::

When creating a new Healthcare Element, you must specify the Patient it is associated to.  
If the method runs successfully, the Promise will return the newly created Healthcare Element as it is on the database.
It is also possible to create several Healthcare Elements at once.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:create multiple HEs as data owner-->
```typescript
```

In this case, an array of Healthcare Elements is returned.

:::caution

Even if you associate a Healthcare Element to a Patient, the Patient does not have access to it unless you give access 
to them.

:::

## Sharing a Healthcare Element with a Patient

After creating the Healthcare Element, the Healthcare Professional shares it with the Patient.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:HE sharing with data owner-->
```typescript
```

If the operation is successful, the method returns a Promise with the updated Healthcare Element.

## Retrieving a Healthcare Element Using its ID

A single Healthcare Element can be retrieved from the Backend using its id.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:retrieve a HE as data owner-->
```typescript
```

:::caution

Trying to retrieve a Healthcare Element you do not have access to will result in an error.

:::

## Modifying a Healthcare Element

Given an existing Healthcare Element, it is possible to modify it.  
Some fields, like id and rev, cannot be modified.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:modify a HE as data owner-->
```typescript
```

If the operation is successful, the method returns the updated Healthcare Element as it is stored in the Backend.

:::caution

To update a Healthcare Element, both id and rev fields must be valid.

:::

## Retrieving Healthcare Element Using Complex Search Criteria

If you want to retrieve a set of Healthcare Element that satisfy complex criteria, you can use a Filter.  
In the following example, you will instantiate a filter to retrieve all the Healthcare Element that a Healthcare Professional
 can access

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:create HE filter-->
```typescript
```

:::note

You can learn more about filters in the how to.

:::

After creating a filter, you can use it to retrieve the Healthcare Elements.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use HE filter method-->
```typescript
```

Note that the Filter method will return a PaginatedList which contains a number of element up to the maximum you specify
 in the method's parameter. If you do not specify any number, the default value is 1000.  
To retrieve more Healthcare Elements, you can call the same method again, using the startDocumentId provided in the previous
 request.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use HE filter method second page-->
```typescript
```

If the `nextKeyPair` property of the result is `undefined`, than there are no more Healthcare Elements to retrieve.  
You can also retrieve just the id of the Healthcare Element instead of the whole documents by using the match method.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use HE match method-->
```typescript
```

Finally, you can also retrieve all the Healthcare Elements related to a specific patient that the current Data Owner 
can access.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use by patient method-->
```typescript
```


## Deleting a Healthcare Element

Finally, a Data Owner that has access to a Healthcare Element can decide to delete it.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:delete a HE as data owner-->
```typescript
```
