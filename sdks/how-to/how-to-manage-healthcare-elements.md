---
slug: how-to-manage-healthcare-elements
description: Learn how to manage healthcare elements
tags:
- HealthcareElement
---
# How to Manage Healthcare Elements

## What is a Healthcare Element?

A Healthcare Element is a piece of medical information that can be used to give more details about the context of  a Data Sample.  It typically describes a long lasting condition affecting a Patient.
Healthcare Elements can be created by Patients and Healthcare Professionals. The sensitive information they contain are 
encrypted and can be read only by Data Owners with an explicit access.

:::note

To perform the following operations, we suppose you have at least a Patient and a Healthcare Professional in your database.

:::

## Creating a Healthcare Element

In the following example, a Healthcare Professional will create, for a Patient, a Healthcare Element describing a medical condition.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:create a HE as data owner-->
```typescript
const newHE = new HealthcareElement({
  description: 'The patient has been diagnosed Pararibulitis',
  codes: new Set([
    new CodingReference({
      id: 'SNOMEDCT|617|20020131',
      type: 'SNOMEDCT',
      code: '617',
      version: '20020131'
    })
  ]),
  openingDate: new Date("2019-10-12").getTime()
})

const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  newHE,
  patient.id
)
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
const healthcareElement1 = new HealthcareElement({
  description: 'The patient has been diagnosed Pararibulitis',
  codes: new Set([
    new CodingReference({
      id: 'SNOMEDCT|617|20020131',
      type: 'SNOMEDCT',
      code: '617',
      version: '20020131'
    })
  ]),
  openingDate: new Date("2019-10-12").getTime()
})

const healthcareElement2 = new HealthcareElement({
  description: 'The patient recovered',
  openingDate: new Date("2020-11-08").getTime()
})

const newElements = await api.healthcareElementApi.createOrModifyHealthcareElements(
  [healthcareElement1, healthcareElement2],
  patient.id
)
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
const sharedHealthcareElement = await api.healthcareElementApi.giveAccessTo(healthcareElement, patient.id)
```

If the operation is successful, the method returns a Promise with the updated Healthcare Element.

## Retrieving a Healthcare Element Using its ID

A single Healthcare Element can be retrieved from the Backend using its id.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:retrieve a HE as data owner-->
```typescript
const healthcareElementToRetrieve = new HealthcareElement({
  description: 'To retrieve, I must create',
})

const createdHealthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  healthcareElementToRetrieve,
  patient.id
)

const retrievedHealthcareElement = await api.healthcareElementApi.getHealthcareElement(createdHealthcareElement.id)
```

:::caution

Trying to retrieve a Healthcare Element you do not have access to will produce an error.

:::

## Modifying a Healthcare Element

Given an existing Healthcare Element, it is possible to modify it.  
Some fields, like id and rev, cannot be modified.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:modify a HE as data owner-->
```typescript
const yetAnotherHealthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'To modify, I must create',
  }),
  patient.id
)

const modifiedHealthcareElement = {
  ...yetAnotherHealthcareElement,
  description: 'I can change and I can add',
  openingDate: new Date("2019-10-12").getTime()
}

const modificationResult = await api.healthcareElementApi.createOrModifyHealthcareElement(
  modifiedHealthcareElement,
  patient.id
)
```

If the operation is successful, the method returns the updated Healthcare Element as it is stored in the Backend.

:::caution

To update a Healthcare Element, both id and rev fields must be valid.

:::

## Retrieving Healthcare Element Using Complex Search Criteria

If you want to retrieve a set of Healthcare Element that satisfy complex criteria, you can use a Filter.  
In the following example, you will instantiate a filter to retrieve all the Healthcare Element of a Patient that a Healthcare Professional
 can access

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:create HE filter-->
```typescript
const healthcareElementFilter = await new HealthcareElementFilter()
  .forDataOwner(user.healthcarePartyId)
  .forPatients(api.cryptoApi, [patient])
  .build()
```

:::note

You can learn more about filters in the how to.

:::

After creating a filter, you can use it to retrieve the Healthcare Elements.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use HE filter method-->
```typescript
const healthcareElementsFirstPage = await api.healthcareElementApi.filterHealthcareElement(
  healthcareElementFilter,
  undefined,
  10
)
```

The `filter` method returns a PaginatedList that contains at most the number of elements stated
 in the method's parameter. If you do not specify any number, the default value is 1000.  
To retrieve more Healthcare Elements, you can call the same method again, using the startDocumentId provided in the previous
 request.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use HE filter method second page-->
```typescript
const healthcareElementsSecondPage = await api.healthcareElementApi.filterHealthcareElement(
  healthcareElementFilter,
  healthcareElementsFirstPage.nextKeyPair.startKeyDocId,
  10
)
```

If the `nextKeyPair` property of the result is `undefined`, than there are no more Healthcare Elements to retrieve.  
You can also retrieve just the id of the Healthcare Element instead of the whole documents by using the match method.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use HE match method-->
```typescript
const healthcareElementsIdList = await api.healthcareElementApi.matchHealthcareElement(healthcareElementFilter)
```

You can also retrieve all the Healthcare Elements belonging to a specific patient that the current Data Owner 
can access.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use by patient method-->
```typescript
const healthcareElementsForPatient = await api.healthcareElementApi.getHealthcareElementsForPatient(existingPatient)
```


## Deleting a Healthcare Element

Finally, a Data Owner that has access to a Healthcare Element can decide to delete it.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:delete a HE as data owner-->
```typescript
const healthcareElementToDelete = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'I am doomed',
  }),
  patient.id
)

const deletedHealthcareElement = await api.healthcareElementApi.deleteHealthcareElement(healthcareElementToDelete.id)
```
