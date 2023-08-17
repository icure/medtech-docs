---
slug: how-to-manage-healthcare-elements
description: Learn how to manage {{ healthcareElements }}
tags:
- HealthcareElement
---
# Handling {{ healthcareElements }}

## What is a Healthcare Element?

A [Healthcare Element](../references/classes/HealthcareElement) is a piece of medical information that can be used to give more details about the context of a [{{ Service }}](../references/classes/DataSample).  
It typically describes a long-lasting condition affecting a Patient.
{{ HealthcareElements }} can be created by [Patient](../references/classes/Patient) and Healthcare Professionals. The sensitive information they contain are 
encrypted and can be read only by Data Owners with an explicit access.

:::note

To perform the following operations, we suppose you have at least a Patient and a Healthcare Professional in your database.

:::

## Creating a Healthcare Element

In the following example, a Healthcare Professional will create, for a Patient, a Healthcare Element describing a medical condition.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:create a HE as data owner-->
```typescript
const newHealthcareElement = new HealthcareElement({
  description: 'The patient has been diagnosed Pararibulitis',
  codes: new Set([
    new CodingReference({
      id: 'SNOMEDCT|617|20020131',
      type: 'SNOMEDCT',
      code: '617',
      version: '20020131',
    }),
  ]),
  openingDate: new Date('2019-10-12').getTime(),
})

const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  newHealthcareElement,
  patient.id,
)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/newHealthcareElement.txt -->
<details>
<summary>newHealthcareElement</summary>

```json
{
  "description": "The patient has been diagnosed Pararibulitis",
  "openingDate": 1570838400000,
  "identifiers": [],
  "codes": {},
  "labels": {}
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
{
  "id": "56e23859-7a37-409a-838b-c3b36287fc3f",
  "rev": "1-6df36f6e04f043b26851ca7c5421bd68",
  "created": 1688378968721,
  "modified": 1688378968721,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "56e23859-7a37-409a-838b-c3b36287fc3f",
  "valueDate": 20230703120928,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
    "encryptedSelf": "7IyFeBsXd32ypgoZzRvkzUwztRYgqHRLQw5PNyc6NEwopK+5ohYbTd9vcx9ttUA7O/QhC0d0vEPzFnM2sWylj50jnDn2trhenZBmfUX8lk8="
  }
}
```
</details>

:::note

If not specified, the value of the following parameters will be automatically set by the iCure Back-End:

* id (to a random UUID)
* created (to the current timestamp)
* modified (to the current timestamp)
* author (to the id of the user who created this Healthcare Element)
* responsible (to the id of the Data Owner id who created this Healthcare Element)
* healthElementId (to the id of the current Healthcare Element)
* valueDate (to the current timestamp)
* openingDate (to the current timestamp)

:::

When creating a new Healthcare Element, you must specify the Patient it is associated to.  
If the method runs successfully, the Promise will return the newly created Healthcare Element.
It is also possible to create a series of {{ HealthcareElements }} that describe a medical history. In a medical history, 
the {{ healthcareElements }} share the same `healthcareElementId`

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:create multiple related HEs as data owner-->
```typescript
const startHealthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'The patient has been diagnosed Pararibulitis',
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|617|20020131',
        type: 'SNOMEDCT',
        code: '617',
        version: '20020131',
      }),
    ]),
    openingDate: new Date('2019-10-12').getTime(),
  }),
  patient.id,
)

const followUpHealthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'The patient recovered',
    openingDate: new Date('2020-11-08').getTime(),
    healthcareElementId: startHealthcareElement.healthcareElementId,
  }),
  patient.id,
)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/startHealthcareElement.txt -->
<details>
<summary>startHealthcareElement</summary>

```json
{
  "id": "d989ccd4-3672-4856-aa00-ae88d49ff6a0",
  "rev": "1-9d7e3b618294434eca22e5c0d4e560ce",
  "created": 1688378968807,
  "modified": 1688378968807,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "d989ccd4-3672-4856-aa00-ae88d49ff6a0",
  "valueDate": 20230703120928,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
    "encryptedSelf": "EGPaZbnHJH0X8IfWsglxtPr5vb4mfaqonEGU26r9AMHF9FXI5e+UHxMleYpal5ZtxywEBRde1B0EW7YKuXuvqawRJgXIUYuY4b/X/objz2o="
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/followUpHealthcareElement.txt -->
<details>
<summary>followUpHealthcareElement</summary>

```json
{
  "id": "7b3d08e6-4c01-457f-877c-68c35e34a05f",
  "rev": "1-42897eae3f8690c7eba627ef04ffb413",
  "created": 1688378968826,
  "modified": 1688378968826,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "d989ccd4-3672-4856-aa00-ae88d49ff6a0",
  "valueDate": 20230703120928,
  "openingDate": 1604793600000,
  "description": "The patient recovered",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
    "encryptedSelf": "7K06qhfwKvgjGbGW9n6e7aID4KhcQpTE0u5DIcDe0QYP3Klq3F5Ftb6mxAyav2GmcCUTCRwsn/fLphY0JRnBqA=="
  }
}
```
</details>

:::note

The `healthcareElementId` is the id of the first Healthcare Element of the series.

:::

Several unrelated {{ HealthcareElements }} can also be created at once.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:create multiple HEs as data owner-->
```typescript
const healthcareElement1 = new HealthcareElement({
  description: 'The patient has been diagnosed Pararibulitis',
  codes: new Set([
    new CodingReference({
      id: 'SNOMEDCT|617|20020131',
      type: 'SNOMEDCT',
      code: '617',
      version: '20020131',
    }),
  ]),
  openingDate: new Date('2019-10-12').getTime(),
})

const healthcareElement2 = new HealthcareElement({
  description: 'The patient has also the flu',
  openingDate: new Date('2020-11-08').getTime(),
})

const newElements = await api.healthcareElementApi.createOrModifyHealthcareElements(
  [healthcareElement1, healthcareElement2],
  patient.id,
)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/healthcareElement1.txt -->
<details>
<summary>healthcareElement1</summary>

```json
{
  "description": "The patient has been diagnosed Pararibulitis",
  "openingDate": 1570838400000,
  "identifiers": [],
  "codes": {},
  "labels": {}
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/healthcareElement2.txt -->
<details>
<summary>healthcareElement2</summary>

```json
{
  "description": "The patient has also the flu",
  "openingDate": 1604793600000,
  "identifiers": [],
  "codes": {},
  "labels": {}
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/newElements.txt -->
<details>
<summary>newElements</summary>

```text
[
  {
    "id": "72ab9642-4a9c-4e02-af57-853290817ea5",
    "rev": "1-ba89d80c2b341cc5f633e7d2ddf4d2aa",
    "healthcareElementId": "72ab9642-4a9c-4e02-af57-853290817ea5",
    "openingDate": 1570838400000,
    "description": "The patient has been diagnosed Pararibulitis",
    "identifiers": [],
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
      "encryptedSelf": "vjZ1v6M46qDgAS28whQSPgj8zPAmXV3HnKthXr8VXvzHb/XdaAnHPNXur0tD/u9S+oGjg3DMeHdsfJmXzRW0pSKXqds408GljtqEDE8prkA="
    }
  },
  {
    "id": "42524916-2c91-4c38-871b-949d2a3271ac",
    "rev": "1-1e8c6f36737357bdfe0d236d211c213b",
    "healthcareElementId": "42524916-2c91-4c38-871b-949d2a3271ac",
    "openingDate": 1604793600000,
    "description": "The patient has also the flu",
    "identifiers": [],
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
      "encryptedSelf": "eg0t05TB9HOS/UtFySZz/gfiovFUUPsfQY+OFn/tMoDJJSabr2vRAj0cRYBU3L56Pqz2NW9msBIrqAi0orlwYQ=="
    }
  }
]
```
</details>

:::caution

Even if you associate a Healthcare Element to a Patient, the Patient does not automatically have access to it. 
You need to explicitly give access to the patient user to this created Healthcare Element by calling the service `giveAccessTo`.

:::

## Sharing a Healthcare Element with a Patient

After creating the Healthcare Element, the Healthcare Professional can share it with the Patient.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:HE sharing with data owner-->
```typescript
const sharedHealthcareElement = await api.healthcareElementApi.giveAccessTo(
  healthcareElement,
  patient.id,
)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/sharedHealthcareElement.txt -->
<details>
<summary>sharedHealthcareElement</summary>

```json
{
  "id": "56e23859-7a37-409a-838b-c3b36287fc3f",
  "rev": "2-c1aa01a40afa65c721b49f2df31b1e1c",
  "created": 1688378968721,
  "modified": 1688378968721,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "56e23859-7a37-409a-838b-c3b36287fc3f",
  "valueDate": 20230703120928,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "encryptedSelf": "qIB6AZTutx1Bj0tDyL5kYRiAVajOcSSGIKN8zqkdqyPETdtkIVx97he3IvI2SpalMxFLc786v3/M75WwKzbQOSnLQocOy6cqa1wGt14EAbo="
  }
}
```
</details>

If the operation is successful, the method returns a Promise with the updated Healthcare Element.  
Using the same service, the Healthcare Professional can share the Healthcare Element with another Healthcare Professional.

:::note

Any Data Owner that has access to a Healthcare Element can share it with another Data Owner using this service.  
A Patient could allow another Patient or HCP to access a Healthcare Element.

:::

## Retrieving a Healthcare Element Using its ID

A single Healthcare Element can be retrieved from the iCure Back-end using its id.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:retrieve a HE as data owner-->
```typescript
const retrievedHealthcareElement = await api.healthcareElementApi.getHealthcareElement(
  healthcareElement.id,
)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/retrievedHealthcareElement.txt -->
<details>
<summary>retrievedHealthcareElement</summary>

```json
{
  "id": "56e23859-7a37-409a-838b-c3b36287fc3f",
  "rev": "2-c1aa01a40afa65c721b49f2df31b1e1c",
  "created": 1688378968721,
  "modified": 1688378968721,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "56e23859-7a37-409a-838b-c3b36287fc3f",
  "valueDate": 20230703120928,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
    },
    "encryptedSelf": "qIB6AZTutx1Bj0tDyL5kYRiAVajOcSSGIKN8zqkdqyPETdtkIVx97he3IvI2SpalMxFLc786v3/M75WwKzbQOSnLQocOy6cqa1wGt14EAbo="
  }
}
```
</details>

:::caution

Trying to retrieve a Healthcare Element you do not have access to will produce an error.

:::

## Modifying a Healthcare Element

Given an existing Healthcare Element, it is possible to modify it.  

:::note

The id and rev fields cannot be modified.

:::

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:modify a HE as data owner-->
```typescript
const yetAnotherHealthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'To modify, I must create',
  }),
  patient.id,
)

const modifiedHealthcareElement = new HealthcareElement({
  ...yetAnotherHealthcareElement,
  description: 'I can change and I can add',
  openingDate: new Date('2019-10-12').getTime(),
})

const modificationResult = await api.healthcareElementApi.createOrModifyHealthcareElement(
  modifiedHealthcareElement,
  patient.id,
)
console.log(modificationResult)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/yetAnotherHealthcareElement.txt -->
<details>
<summary>yetAnotherHealthcareElement</summary>

```json
{
  "id": "3f3430db-828d-4bee-b882-a8ee53a1fd64",
  "rev": "1-d8b15b59e7cf2f32b788e8810a67e932",
  "created": 1688378968881,
  "modified": 1688378968881,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "3f3430db-828d-4bee-b882-a8ee53a1fd64",
  "valueDate": 20230703120928,
  "openingDate": 20230703120928,
  "description": "To modify, I must create",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
    "encryptedSelf": "pEECYOunOsCtJeQHQps9Z3X0uh7ssn7jfA75yqa4lTx/4oSAX9siMWtH1X+5Y611gpTbFtg+snhtUWJiZLYJ6A=="
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/modifiedHealthcareElement.txt -->
<details>
<summary>modifiedHealthcareElement</summary>

```json
{
  "id": "3f3430db-828d-4bee-b882-a8ee53a1fd64",
  "rev": "1-d8b15b59e7cf2f32b788e8810a67e932",
  "created": 1688378968881,
  "modified": 1688378968881,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "3f3430db-828d-4bee-b882-a8ee53a1fd64",
  "valueDate": 20230703120928,
  "openingDate": 1570838400000,
  "description": "I can change and I can add",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
    "encryptedSelf": "pEECYOunOsCtJeQHQps9Z3X0uh7ssn7jfA75yqa4lTx/4oSAX9siMWtH1X+5Y611gpTbFtg+snhtUWJiZLYJ6A=="
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/modificationResult.txt -->
<details>
<summary>modificationResult</summary>

```json
{
  "id": "3f3430db-828d-4bee-b882-a8ee53a1fd64",
  "rev": "2-9b5ff5071f618856358717b3c78d8a40",
  "created": 1688378968881,
  "modified": 1688378968881,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "3f3430db-828d-4bee-b882-a8ee53a1fd64",
  "valueDate": 20230703120928,
  "openingDate": 1570838400000,
  "description": "I can change and I can add",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
    "encryptedSelf": "2q+8KCOx0UPXNRuMSYMxoFQASPjORIfDRRWgiND6E1fkRv2bVIEOpDqVzOmOgok6MAheUdf51tueoHtU3Ibt8Q=="
  }
}
```
</details>

If the operation is successful, the method returns the updated Healthcare Element.

:::caution

To update a Healthcare Element, both id and rev fields must be valid:

* the id should be the one of an existing Healthcare Element
* the rev is a field automatically managed by the iCure Back-End to handle conflicts. It must be equal to the one received
 from the server when creating or getting the Healthcare Element you want to modify.

:::

## Retrieving Healthcare Element Using Complex Search Criteria

If you want to retrieve a set of Healthcare Element that satisfy complex criteria, you can use a Filter.  
In the following example, you will instantiate a filter to retrieve all the Healthcare Element of a Patient that a Healthcare Professional
 can access

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:create HE filter-->
```typescript
const healthcareElementFilter = await new HealthcareElementFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .forPatients([patient])
  .build()
```
<!-- output://code-samples/how-to/manage-healthcare-elements/healthcareElementFilter.txt -->
<details>
<summary>healthcareElementFilter</summary>

```json
{
  "healthcarePartyId": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "patientSecretForeignKeys": [
    "c52b89c3-d70f-4823-9fd9-a97f946ce1fd",
    "baa346f5-db86-4317-8115-0f7d2c5b075e"
  ],
  "$type": "HealthcareElementByHealthcarePartyPatientFilter"
}
```
</details>

:::note

You can learn more about filters in the [how to](../how-to/how-to-filter-data-with-advanced-search-criteria).

:::

After creating a filter, you can use it to retrieve the {{ HealthcareElements }}.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use HE filter method-->
```typescript
const healthcareElementsFirstPage = await api.healthcareElementApi.filterHealthcareElement(
  healthcareElementFilter,
  undefined,
  10,
)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/healthcareElementsFirstPage.txt -->
<details>
<summary>healthcareElementsFirstPage</summary>

```json
{
  "pageSize": 10,
  "totalSize": 9,
  "rows": [
    {
      "id": "1a5ea884-2e16-4a05-92dc-aaf039495f02",
      "rev": "1-f062aebec81da6b4ab81c9ac44fabd63",
      "created": 1688378940977,
      "modified": 1688378940977,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "1a5ea884-2e16-4a05-92dc-aaf039495f02",
      "valueDate": 20230703120900,
      "openingDate": 20230703120900,
      "description": "My diagnosis is that the patient has Hay Fever",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "R90mdcD8niWw2Lya3fKvlaqTri5It5LpbpjmQwhdl9KBzOCaIvZOA8yBVXqBty9AByqf+JL/jhTtuTOtVu58uhIX+WVWeyMWxrFrQFPl7To="
      }
    },
    {
      "id": "3f3430db-828d-4bee-b882-a8ee53a1fd64",
      "rev": "2-9b5ff5071f618856358717b3c78d8a40",
      "created": 1688378968881,
      "modified": 1688378968881,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "3f3430db-828d-4bee-b882-a8ee53a1fd64",
      "valueDate": 20230703120928,
      "openingDate": 1570838400000,
      "description": "I can change and I can add",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "2q+8KCOx0UPXNRuMSYMxoFQASPjORIfDRRWgiND6E1fkRv2bVIEOpDqVzOmOgok6MAheUdf51tueoHtU3Ibt8Q=="
      }
    },
    {
      "id": "42524916-2c91-4c38-871b-949d2a3271ac",
      "rev": "1-1e8c6f36737357bdfe0d236d211c213b",
      "healthcareElementId": "42524916-2c91-4c38-871b-949d2a3271ac",
      "openingDate": 1604793600000,
      "description": "The patient has also the flu",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "eg0t05TB9HOS/UtFySZz/gfiovFUUPsfQY+OFn/tMoDJJSabr2vRAj0cRYBU3L56Pqz2NW9msBIrqAi0orlwYQ=="
      }
    },
    {
      "id": "56e23859-7a37-409a-838b-c3b36287fc3f",
      "rev": "2-c1aa01a40afa65c721b49f2df31b1e1c",
      "created": 1688378968721,
      "modified": 1688378968721,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "56e23859-7a37-409a-838b-c3b36287fc3f",
      "valueDate": 20230703120928,
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
        ],
        "cryptedForeignKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "delegations": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "encryptionKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "encryptedSelf": "qIB6AZTutx1Bj0tDyL5kYRiAVajOcSSGIKN8zqkdqyPETdtkIVx97he3IvI2SpalMxFLc786v3/M75WwKzbQOSnLQocOy6cqa1wGt14EAbo="
      }
    },
    {
      "id": "68a213d2-23b2-4d95-b1df-1de467b403fb",
      "rev": "1-996c06c7fea838b2b47eac0d6843a008",
      "created": 1688378941768,
      "modified": 1688378941768,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "68a213d2-23b2-4d95-b1df-1de467b403fb",
      "valueDate": 20230703120901,
      "openingDate": 1688378941744,
      "description": "The patient is pregnant",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "wizUUK7TJRTq7OdWIi4U93InI+ZW/XG+dTtRL/8M9zcg58+bC76VAWO3XHWXzuZB3zO1Ap+QiYdGH0DTLPUU3Q=="
      }
    },
    {
      "id": "72ab9642-4a9c-4e02-af57-853290817ea5",
      "rev": "1-ba89d80c2b341cc5f633e7d2ddf4d2aa",
      "healthcareElementId": "72ab9642-4a9c-4e02-af57-853290817ea5",
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "vjZ1v6M46qDgAS28whQSPgj8zPAmXV3HnKthXr8VXvzHb/XdaAnHPNXur0tD/u9S+oGjg3DMeHdsfJmXzRW0pSKXqds408GljtqEDE8prkA="
      }
    },
    {
      "id": "7b3d08e6-4c01-457f-877c-68c35e34a05f",
      "rev": "1-42897eae3f8690c7eba627ef04ffb413",
      "created": 1688378968826,
      "modified": 1688378968826,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "d989ccd4-3672-4856-aa00-ae88d49ff6a0",
      "valueDate": 20230703120928,
      "openingDate": 1604793600000,
      "description": "The patient recovered",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "7K06qhfwKvgjGbGW9n6e7aID4KhcQpTE0u5DIcDe0QYP3Klq3F5Ftb6mxAyav2GmcCUTCRwsn/fLphY0JRnBqA=="
      }
    },
    {
      "id": "81b03963-bf41-4ea9-bee2-18cb64f8a5d0",
      "rev": "2-4510516722fd5cd685ae9d7d6d65b0fe",
      "created": 1688378943488,
      "modified": 1688378943488,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "81b03963-bf41-4ea9-bee2-18cb64f8a5d0",
      "valueDate": 20230703120903,
      "openingDate": 20230703120903,
      "description": "My diagnosis is that the patient has Hay Fever",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
        ],
        "cryptedForeignKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "delegations": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "encryptionKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "encryptedSelf": "ukaDpblB2joEE+7RNSrJwAfcfmTTkJ3aTAHaIsC92CXlzweClJ6KmS+24vlo7V9h+deuXJ5431rzcgYsErnuJv0VWS6BD1brJzFIXdTvowo="
      }
    },
    {
      "id": "d989ccd4-3672-4856-aa00-ae88d49ff6a0",
      "rev": "1-9d7e3b618294434eca22e5c0d4e560ce",
      "created": 1688378968807,
      "modified": 1688378968807,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "d989ccd4-3672-4856-aa00-ae88d49ff6a0",
      "valueDate": 20230703120928,
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "EGPaZbnHJH0X8IfWsglxtPr5vb4mfaqonEGU26r9AMHF9FXI5e+UHxMleYpal5ZtxywEBRde1B0EW7YKuXuvqawRJgXIUYuY4b/X/objz2o="
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

The `filter` method returns a PaginatedList that contains at most the number of elements stated
 in the method's parameter. If you do not specify any number, the default value is 1000.  
To retrieve more {{ HealthcareElements }}, you can call the same method again, using the startDocumentId provided in the previous PaginatedList.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use HE filter method second page-->
```typescript
const healthcareElementsSecondPage = await api.healthcareElementApi.filterHealthcareElement(
  healthcareElementFilter,
  healthcareElementsFirstPage.nextKeyPair.startKeyDocId,
  10,
)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/healthcareElementsSecondPage.txt -->
<details>
<summary>healthcareElementsSecondPage</summary>

```json
{
  "pageSize": 10,
  "totalSize": 9,
  "rows": [
    {
      "id": "1a5ea884-2e16-4a05-92dc-aaf039495f02",
      "rev": "1-f062aebec81da6b4ab81c9ac44fabd63",
      "created": 1688378940977,
      "modified": 1688378940977,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "1a5ea884-2e16-4a05-92dc-aaf039495f02",
      "valueDate": 20230703120900,
      "openingDate": 20230703120900,
      "description": "My diagnosis is that the patient has Hay Fever",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "R90mdcD8niWw2Lya3fKvlaqTri5It5LpbpjmQwhdl9KBzOCaIvZOA8yBVXqBty9AByqf+JL/jhTtuTOtVu58uhIX+WVWeyMWxrFrQFPl7To="
      }
    },
    {
      "id": "3f3430db-828d-4bee-b882-a8ee53a1fd64",
      "rev": "2-9b5ff5071f618856358717b3c78d8a40",
      "created": 1688378968881,
      "modified": 1688378968881,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "3f3430db-828d-4bee-b882-a8ee53a1fd64",
      "valueDate": 20230703120928,
      "openingDate": 1570838400000,
      "description": "I can change and I can add",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "2q+8KCOx0UPXNRuMSYMxoFQASPjORIfDRRWgiND6E1fkRv2bVIEOpDqVzOmOgok6MAheUdf51tueoHtU3Ibt8Q=="
      }
    },
    {
      "id": "42524916-2c91-4c38-871b-949d2a3271ac",
      "rev": "1-1e8c6f36737357bdfe0d236d211c213b",
      "healthcareElementId": "42524916-2c91-4c38-871b-949d2a3271ac",
      "openingDate": 1604793600000,
      "description": "The patient has also the flu",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "eg0t05TB9HOS/UtFySZz/gfiovFUUPsfQY+OFn/tMoDJJSabr2vRAj0cRYBU3L56Pqz2NW9msBIrqAi0orlwYQ=="
      }
    },
    {
      "id": "56e23859-7a37-409a-838b-c3b36287fc3f",
      "rev": "2-c1aa01a40afa65c721b49f2df31b1e1c",
      "created": 1688378968721,
      "modified": 1688378968721,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "56e23859-7a37-409a-838b-c3b36287fc3f",
      "valueDate": 20230703120928,
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
        ],
        "cryptedForeignKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "delegations": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "encryptionKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "encryptedSelf": "qIB6AZTutx1Bj0tDyL5kYRiAVajOcSSGIKN8zqkdqyPETdtkIVx97he3IvI2SpalMxFLc786v3/M75WwKzbQOSnLQocOy6cqa1wGt14EAbo="
      }
    },
    {
      "id": "68a213d2-23b2-4d95-b1df-1de467b403fb",
      "rev": "1-996c06c7fea838b2b47eac0d6843a008",
      "created": 1688378941768,
      "modified": 1688378941768,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "68a213d2-23b2-4d95-b1df-1de467b403fb",
      "valueDate": 20230703120901,
      "openingDate": 1688378941744,
      "description": "The patient is pregnant",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "wizUUK7TJRTq7OdWIi4U93InI+ZW/XG+dTtRL/8M9zcg58+bC76VAWO3XHWXzuZB3zO1Ap+QiYdGH0DTLPUU3Q=="
      }
    },
    {
      "id": "72ab9642-4a9c-4e02-af57-853290817ea5",
      "rev": "1-ba89d80c2b341cc5f633e7d2ddf4d2aa",
      "healthcareElementId": "72ab9642-4a9c-4e02-af57-853290817ea5",
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "vjZ1v6M46qDgAS28whQSPgj8zPAmXV3HnKthXr8VXvzHb/XdaAnHPNXur0tD/u9S+oGjg3DMeHdsfJmXzRW0pSKXqds408GljtqEDE8prkA="
      }
    },
    {
      "id": "7b3d08e6-4c01-457f-877c-68c35e34a05f",
      "rev": "1-42897eae3f8690c7eba627ef04ffb413",
      "created": 1688378968826,
      "modified": 1688378968826,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "d989ccd4-3672-4856-aa00-ae88d49ff6a0",
      "valueDate": 20230703120928,
      "openingDate": 1604793600000,
      "description": "The patient recovered",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "7K06qhfwKvgjGbGW9n6e7aID4KhcQpTE0u5DIcDe0QYP3Klq3F5Ftb6mxAyav2GmcCUTCRwsn/fLphY0JRnBqA=="
      }
    },
    {
      "id": "81b03963-bf41-4ea9-bee2-18cb64f8a5d0",
      "rev": "2-4510516722fd5cd685ae9d7d6d65b0fe",
      "created": 1688378943488,
      "modified": 1688378943488,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "81b03963-bf41-4ea9-bee2-18cb64f8a5d0",
      "valueDate": 20230703120903,
      "openingDate": 20230703120903,
      "description": "My diagnosis is that the patient has Hay Fever",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
        ],
        "cryptedForeignKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "delegations": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "encryptionKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "d8df1f2b-938c-46c0-a85c-015117142cc6": {}
        },
        "encryptedSelf": "ukaDpblB2joEE+7RNSrJwAfcfmTTkJ3aTAHaIsC92CXlzweClJ6KmS+24vlo7V9h+deuXJ5431rzcgYsErnuJv0VWS6BD1brJzFIXdTvowo="
      }
    },
    {
      "id": "d989ccd4-3672-4856-aa00-ae88d49ff6a0",
      "rev": "1-9d7e3b618294434eca22e5c0d4e560ce",
      "created": 1688378968807,
      "modified": 1688378968807,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "d989ccd4-3672-4856-aa00-ae88d49ff6a0",
      "valueDate": 20230703120928,
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
        "encryptedSelf": "EGPaZbnHJH0X8IfWsglxtPr5vb4mfaqonEGU26r9AMHF9FXI5e+UHxMleYpal5ZtxywEBRde1B0EW7YKuXuvqawRJgXIUYuY4b/X/objz2o="
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

If the `nextKeyPair` property of the result is `undefined`, than there are no more {{ HealthcareElements }} to retrieve.  
You can also retrieve just the id of the Healthcare Element instead of the whole documents by using the match method.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use HE match method-->
```typescript
const healthcareElementsIdList = await api.healthcareElementApi.matchHealthcareElement(
  healthcareElementFilter,
)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/healthcareElementsIdList.txt -->
<details>
<summary>healthcareElementsIdList</summary>

```text
[
  "1a5ea884-2e16-4a05-92dc-aaf039495f02",
  "3f3430db-828d-4bee-b882-a8ee53a1fd64",
  "42524916-2c91-4c38-871b-949d2a3271ac",
  "56e23859-7a37-409a-838b-c3b36287fc3f",
  "68a213d2-23b2-4d95-b1df-1de467b403fb",
  "72ab9642-4a9c-4e02-af57-853290817ea5",
  "7b3d08e6-4c01-457f-877c-68c35e34a05f",
  "81b03963-bf41-4ea9-bee2-18cb64f8a5d0",
  "d989ccd4-3672-4856-aa00-ae88d49ff6a0"
]
```
</details>

You can also retrieve all the {{ HealthcareElements }} belonging to a specific patient that the current Data Owner 
can access.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:use by patient method-->
```typescript
const healthcareElementsForPatient = await api.healthcareElementApi.getHealthcareElementsForPatient(
  existingPatient,
)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/healthcareElementsForPatient.txt -->
<details>
<summary>healthcareElementsForPatient</summary>

```text
[
  {
    "id": "74d09fab-509a-44e3-8160-b8cdb9f50927",
    "rev": "1-8b2aed14176c456b7ee097c1daf6f395",
    "created": 1688378968940,
    "modified": 1688378968940,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "healthcareElementId": "74d09fab-509a-44e3-8160-b8cdb9f50927",
    "valueDate": 20230703120928,
    "openingDate": 20230703120928,
    "description": "To modify, I must create",
    "identifiers": [],
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "a146dfb6-60fe-4d3b-bf52-52a95b593a52"
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
      "encryptedSelf": "dBvDVXPTPkGWmeZ8IXitbKMhK5r4vVNSnlaiQTU1OGo/pnRBWu9hPYzIc0+u7XNYaQmHZPy0sBC3KLw/qjcXIQ=="
    }
  }
]
```
</details>

## Deleting a Healthcare Element

Finally, a Data Owner that has access to a Healthcare Element can decide to delete it.

<!-- file://code-samples/how-to/manage-healthcare-elements/index.mts snippet:delete a HE as data owner-->
```typescript
const healthcareElementToDelete = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'I am doomed',
  }),
  patient.id,
)

const deletedHealthcareElement = await api.healthcareElementApi.deleteHealthcareElement(
  healthcareElementToDelete.id,
)
```
<!-- output://code-samples/how-to/manage-healthcare-elements/healthcareElementToDelete.txt -->
<details>
<summary>healthcareElementToDelete</summary>

```json
{
  "id": "cdf58b9a-7159-4505-91fc-d51b27767d36",
  "rev": "1-8fadd2f90baf08b1dc26f0340cad8818",
  "created": 1688378969059,
  "modified": 1688378969059,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "cdf58b9a-7159-4505-91fc-d51b27767d36",
  "valueDate": 20230703120929,
  "openingDate": 20230703120929,
  "description": "I am doomed",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "c52b89c3-d70f-4823-9fd9-a97f946ce1fd"
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
    "encryptedSelf": "fmXqGAAJn9bOJwAecVxZfwYXWAWCl8N+DL1TdiXLh504J+tAE5Axr39NHWaaSk5h"
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/deletedHealthcareElement.txt -->
<details>
<summary>deletedHealthcareElement</summary>

```text
2-93ec8eb272d70e5a7afee51132ae5a89
```
</details>
