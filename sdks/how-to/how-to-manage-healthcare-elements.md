---
slug: how-to-manage-healthcare-elements
description: Learn how to manage healthcare elements
tags:
- HealthcareElement
---
# Handling healthcare elements

## What is a Healthcare Element?

A [Healthcare Element](../references/classes/HealthcareElement) is a piece of medical information that can be used to give more details about the context of a [Data Sample](../references/classes/DataSample).  
It typically describes a long-lasting condition affecting a Patient.
Healthcare Elements can be created by [Patient](../references/classes/Patient) and Healthcare Professionals. The sensitive information they contain are 
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
  "id": "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
  "rev": "1-44806d4da4496b73f1c2fa84aa138d50",
  "created": 1688375619923,
  "modified": 1688375619923,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
  "valueDate": 20230703111339,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
    "encryptedSelf": "d17ZdAULYaKJHyb+sg9t4w5mUstxoY7IB+w9PWXZz3tOInsaMOGN3uBqLI2JyY20j9b1I1Fxn+8AOfo7QJhbHmSVNGBH72GpOYpniBF3s98="
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
It is also possible to create a series of Healthcare Elements that describe a medical history. In a medical history, 
the healthcare elements share the same `healthcareElementId`

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
  "id": "7a57106b-46b0-4a6f-8c56-0d78e30c03e0",
  "rev": "1-b294c441bd6f46768f968e94bff2b968",
  "created": 1688375619997,
  "modified": 1688375619997,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "7a57106b-46b0-4a6f-8c56-0d78e30c03e0",
  "valueDate": 20230703111339,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
    "encryptedSelf": "i8Xo9e/XSSBRVsU2l0bJ9gLU+nheSM0ZUN+m0wg6YmW/nFfdYy0V3AvmcCNgtlIbCGj6snxuefJpff1duCq/IEf8kvxrnx1S4Th4RTUbIsk="
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/followUpHealthcareElement.txt -->
<details>
<summary>followUpHealthcareElement</summary>

```json
{
  "id": "9f734e70-bbb8-4a49-97fc-661092e5f284",
  "rev": "1-ee9b89b9ecdfdee04e7468c60bcb0b15",
  "created": 1688375620022,
  "modified": 1688375620022,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "7a57106b-46b0-4a6f-8c56-0d78e30c03e0",
  "valueDate": 20230703111340,
  "openingDate": 1604793600000,
  "description": "The patient recovered",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
    "encryptedSelf": "iJsCGVdbkmVf2PFxnl3xySYt+pNQwIETV7QW/wXTO6K3Yuql31MA6pUGK6gQk89eN0VP05iyon2oc4mX6Jevdg=="
  }
}
```
</details>

:::note

The `healthcareElementId` is the id of the first Healthcare Element of the series.

:::

Several unrelated Healthcare Elements can also be created at once.

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
    "id": "1f981c2c-d438-4bd0-a247-c34ac6131155",
    "rev": "1-5c0959a4bb10792e2d037c5ddfb2359c",
    "healthcareElementId": "1f981c2c-d438-4bd0-a247-c34ac6131155",
    "openingDate": 1570838400000,
    "description": "The patient has been diagnosed Pararibulitis",
    "identifiers": [],
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
      "encryptedSelf": "QzxKk7bJ7ilR3j3yJtGv2VXATaxoBfi40c1jCtAbWKDP4CLwnBBSZDhKmT6BR/eWvsAq0t9lrLnIDc8aykL5aZbVj3albOoSYOifnqLymzA="
    }
  },
  {
    "id": "92631681-e139-443c-bfa5-f62f280f7302",
    "rev": "1-3f790d8e0c2eba6d7e551b4e86bd4241",
    "healthcareElementId": "92631681-e139-443c-bfa5-f62f280f7302",
    "openingDate": 1604793600000,
    "description": "The patient has also the flu",
    "identifiers": [],
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
      "encryptedSelf": "648wgU1nr2re97nRfrMtIzaJhAwOb5l3q3wpwwnSGYJE4wVdrqSR/25H6axn3UCErH8PCiWqAfWKab6TUmn9RQ=="
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
  "id": "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
  "rev": "2-7170fc38e6e132882e88ab4dd3e618a7",
  "created": 1688375619923,
  "modified": 1688375619923,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
  "valueDate": 20230703111339,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "encryptedSelf": "6bLFUR1m2wH+d0ClRQAHt2wkhHgJMUOPfTVuP1XDcINy6MYTGTdP93w4F/5W/ep17Rm2JfCFUXB+Q6H7yIeFYs6q6XeJbei5nwS5bSOipqo="
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
  "id": "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
  "rev": "2-7170fc38e6e132882e88ab4dd3e618a7",
  "created": 1688375619923,
  "modified": 1688375619923,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
  "valueDate": 20230703111339,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
      "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
    },
    "encryptedSelf": "6bLFUR1m2wH+d0ClRQAHt2wkhHgJMUOPfTVuP1XDcINy6MYTGTdP93w4F/5W/ep17Rm2JfCFUXB+Q6H7yIeFYs6q6XeJbei5nwS5bSOipqo="
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
  "id": "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
  "rev": "1-89efe31d7faf4eacf7f1291e5eef0358",
  "created": 1688375620079,
  "modified": 1688375620079,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
  "valueDate": 20230703111340,
  "openingDate": 20230703111340,
  "description": "To modify, I must create",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
    "encryptedSelf": "8C3pOlLhY0UqmmdxKKPQIbMVP8T55jUzDVyKIxa00wXi7ChPaB6q/MA9nT+TWXhufz8/tGYd++93jcnG5l91JQ=="
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/modifiedHealthcareElement.txt -->
<details>
<summary>modifiedHealthcareElement</summary>

```json
{
  "id": "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
  "rev": "1-89efe31d7faf4eacf7f1291e5eef0358",
  "created": 1688375620079,
  "modified": 1688375620079,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
  "valueDate": 20230703111340,
  "openingDate": 1570838400000,
  "description": "I can change and I can add",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
    "encryptedSelf": "8C3pOlLhY0UqmmdxKKPQIbMVP8T55jUzDVyKIxa00wXi7ChPaB6q/MA9nT+TWXhufz8/tGYd++93jcnG5l91JQ=="
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/modificationResult.txt -->
<details>
<summary>modificationResult</summary>

```json
{
  "id": "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
  "rev": "2-920ffb595cb0787d896cb14ebde8047b",
  "created": 1688375620079,
  "modified": 1688375620079,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
  "valueDate": 20230703111340,
  "openingDate": 1570838400000,
  "description": "I can change and I can add",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
    "encryptedSelf": "LyeUFAmROyhbTvgUDxJ6WZqUQ5lb9xuulbWvKO3K84JKydV5DIQjhLXOwvrqtg7iuIYssfvpydSBbm3gUbdmkg=="
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
    "41b78e71-f3fe-4a00-8540-ab2e845144dc",
    "1116a2d7-9787-4891-92d7-dce89c536759"
  ],
  "$type": "HealthcareElementByHealthcarePartyPatientFilter"
}
```
</details>

:::note

You can learn more about filters in the [how to](../how-to/how-to-filter-data-with-advanced-search-criteria).

:::

After creating a filter, you can use it to retrieve the Healthcare Elements.

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
  "totalSize": 6,
  "rows": [
    {
      "id": "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
      "rev": "2-7170fc38e6e132882e88ab4dd3e618a7",
      "created": 1688375619923,
      "modified": 1688375619923,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
      "valueDate": 20230703111339,
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
        ],
        "cryptedForeignKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
        },
        "delegations": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
        },
        "encryptionKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
        },
        "encryptedSelf": "6bLFUR1m2wH+d0ClRQAHt2wkhHgJMUOPfTVuP1XDcINy6MYTGTdP93w4F/5W/ep17Rm2JfCFUXB+Q6H7yIeFYs6q6XeJbei5nwS5bSOipqo="
      }
    },
    {
      "id": "1f981c2c-d438-4bd0-a247-c34ac6131155",
      "rev": "1-5c0959a4bb10792e2d037c5ddfb2359c",
      "healthcareElementId": "1f981c2c-d438-4bd0-a247-c34ac6131155",
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
        "encryptedSelf": "QzxKk7bJ7ilR3j3yJtGv2VXATaxoBfi40c1jCtAbWKDP4CLwnBBSZDhKmT6BR/eWvsAq0t9lrLnIDc8aykL5aZbVj3albOoSYOifnqLymzA="
      }
    },
    {
      "id": "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
      "rev": "2-920ffb595cb0787d896cb14ebde8047b",
      "created": 1688375620079,
      "modified": 1688375620079,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
      "valueDate": 20230703111340,
      "openingDate": 1570838400000,
      "description": "I can change and I can add",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
        "encryptedSelf": "LyeUFAmROyhbTvgUDxJ6WZqUQ5lb9xuulbWvKO3K84JKydV5DIQjhLXOwvrqtg7iuIYssfvpydSBbm3gUbdmkg=="
      }
    },
    {
      "id": "7a57106b-46b0-4a6f-8c56-0d78e30c03e0",
      "rev": "1-b294c441bd6f46768f968e94bff2b968",
      "created": 1688375619997,
      "modified": 1688375619997,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "7a57106b-46b0-4a6f-8c56-0d78e30c03e0",
      "valueDate": 20230703111339,
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
        "encryptedSelf": "i8Xo9e/XSSBRVsU2l0bJ9gLU+nheSM0ZUN+m0wg6YmW/nFfdYy0V3AvmcCNgtlIbCGj6snxuefJpff1duCq/IEf8kvxrnx1S4Th4RTUbIsk="
      }
    },
    {
      "id": "92631681-e139-443c-bfa5-f62f280f7302",
      "rev": "1-3f790d8e0c2eba6d7e551b4e86bd4241",
      "healthcareElementId": "92631681-e139-443c-bfa5-f62f280f7302",
      "openingDate": 1604793600000,
      "description": "The patient has also the flu",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
        "encryptedSelf": "648wgU1nr2re97nRfrMtIzaJhAwOb5l3q3wpwwnSGYJE4wVdrqSR/25H6axn3UCErH8PCiWqAfWKab6TUmn9RQ=="
      }
    },
    {
      "id": "9f734e70-bbb8-4a49-97fc-661092e5f284",
      "rev": "1-ee9b89b9ecdfdee04e7468c60bcb0b15",
      "created": 1688375620022,
      "modified": 1688375620022,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "7a57106b-46b0-4a6f-8c56-0d78e30c03e0",
      "valueDate": 20230703111340,
      "openingDate": 1604793600000,
      "description": "The patient recovered",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
        "encryptedSelf": "iJsCGVdbkmVf2PFxnl3xySYt+pNQwIETV7QW/wXTO6K3Yuql31MA6pUGK6gQk89eN0VP05iyon2oc4mX6Jevdg=="
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

The `filter` method returns a PaginatedList that contains at most the number of elements stated
 in the method's parameter. If you do not specify any number, the default value is 1000.  
To retrieve more Healthcare Elements, you can call the same method again, using the startDocumentId provided in the previous PaginatedList.

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
  "totalSize": 6,
  "rows": [
    {
      "id": "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
      "rev": "2-7170fc38e6e132882e88ab4dd3e618a7",
      "created": 1688375619923,
      "modified": 1688375619923,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
      "valueDate": 20230703111339,
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
        ],
        "cryptedForeignKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
        },
        "delegations": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
        },
        "encryptionKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
          "1457ac8d-fb1f-4645-aaad-98f093a6c341": {}
        },
        "encryptedSelf": "6bLFUR1m2wH+d0ClRQAHt2wkhHgJMUOPfTVuP1XDcINy6MYTGTdP93w4F/5W/ep17Rm2JfCFUXB+Q6H7yIeFYs6q6XeJbei5nwS5bSOipqo="
      }
    },
    {
      "id": "1f981c2c-d438-4bd0-a247-c34ac6131155",
      "rev": "1-5c0959a4bb10792e2d037c5ddfb2359c",
      "healthcareElementId": "1f981c2c-d438-4bd0-a247-c34ac6131155",
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
        "encryptedSelf": "QzxKk7bJ7ilR3j3yJtGv2VXATaxoBfi40c1jCtAbWKDP4CLwnBBSZDhKmT6BR/eWvsAq0t9lrLnIDc8aykL5aZbVj3albOoSYOifnqLymzA="
      }
    },
    {
      "id": "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
      "rev": "2-920ffb595cb0787d896cb14ebde8047b",
      "created": 1688375620079,
      "modified": 1688375620079,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
      "valueDate": 20230703111340,
      "openingDate": 1570838400000,
      "description": "I can change and I can add",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
        "encryptedSelf": "LyeUFAmROyhbTvgUDxJ6WZqUQ5lb9xuulbWvKO3K84JKydV5DIQjhLXOwvrqtg7iuIYssfvpydSBbm3gUbdmkg=="
      }
    },
    {
      "id": "7a57106b-46b0-4a6f-8c56-0d78e30c03e0",
      "rev": "1-b294c441bd6f46768f968e94bff2b968",
      "created": 1688375619997,
      "modified": 1688375619997,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "7a57106b-46b0-4a6f-8c56-0d78e30c03e0",
      "valueDate": 20230703111339,
      "openingDate": 1570838400000,
      "description": "The patient has been diagnosed Pararibulitis",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
        "encryptedSelf": "i8Xo9e/XSSBRVsU2l0bJ9gLU+nheSM0ZUN+m0wg6YmW/nFfdYy0V3AvmcCNgtlIbCGj6snxuefJpff1duCq/IEf8kvxrnx1S4Th4RTUbIsk="
      }
    },
    {
      "id": "92631681-e139-443c-bfa5-f62f280f7302",
      "rev": "1-3f790d8e0c2eba6d7e551b4e86bd4241",
      "healthcareElementId": "92631681-e139-443c-bfa5-f62f280f7302",
      "openingDate": 1604793600000,
      "description": "The patient has also the flu",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
        "encryptedSelf": "648wgU1nr2re97nRfrMtIzaJhAwOb5l3q3wpwwnSGYJE4wVdrqSR/25H6axn3UCErH8PCiWqAfWKab6TUmn9RQ=="
      }
    },
    {
      "id": "9f734e70-bbb8-4a49-97fc-661092e5f284",
      "rev": "1-ee9b89b9ecdfdee04e7468c60bcb0b15",
      "created": 1688375620022,
      "modified": 1688375620022,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
      "healthcareElementId": "7a57106b-46b0-4a6f-8c56-0d78e30c03e0",
      "valueDate": 20230703111340,
      "openingDate": 1604793600000,
      "description": "The patient recovered",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
        "encryptedSelf": "iJsCGVdbkmVf2PFxnl3xySYt+pNQwIETV7QW/wXTO6K3Yuql31MA6pUGK6gQk89eN0VP05iyon2oc4mX6Jevdg=="
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

If the `nextKeyPair` property of the result is `undefined`, than there are no more Healthcare Elements to retrieve.  
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
  "0a2aeda2-1371-4a2a-9cdf-8de4c8758c0c",
  "1f981c2c-d438-4bd0-a247-c34ac6131155",
  "3d00cb68-6a5f-4d79-af6f-7e93dbfd2ee9",
  "7a57106b-46b0-4a6f-8c56-0d78e30c03e0",
  "92631681-e139-443c-bfa5-f62f280f7302",
  "9f734e70-bbb8-4a49-97fc-661092e5f284"
]
```
</details>

You can also retrieve all the Healthcare Elements belonging to a specific patient that the current Data Owner 
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
    "id": "410f34f2-86dd-4da3-8cfe-f85ad3e17030",
    "rev": "1-be2f0f282e5073257da86e20597a169d",
    "created": 1688375620171,
    "modified": 1688375620171,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "healthcareElementId": "410f34f2-86dd-4da3-8cfe-f85ad3e17030",
    "valueDate": 20230703111340,
    "openingDate": 20230703111340,
    "description": "To modify, I must create",
    "identifiers": [],
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "1ad17bc4-2eb2-4425-ae70-1add39abba25"
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
      "encryptedSelf": "N54xf69zE383ISSH5U7kciWbse8wBUC9+iW9oc9e9BPdEmg29JSzaazHZxq4B1V8C9ThDWby9Dha8Dm7OMvcig=="
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
  "id": "077d0879-888a-4a56-8595-f68039448c1d",
  "rev": "1-5f15acf13d05a38a430aed8faa3ae7c3",
  "created": 1688375620288,
  "modified": 1688375620288,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "healthcareElementId": "077d0879-888a-4a56-8595-f68039448c1d",
  "valueDate": 20230703111340,
  "openingDate": 20230703111340,
  "description": "I am doomed",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "41b78e71-f3fe-4a00-8540-ab2e845144dc"
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
    "encryptedSelf": "mwjLSGlr2jCoJzPi910lk1UJmgzbq5V2J8cS70ZoOXi3oCQPrQ771Dacv7CHUlS2"
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/deletedHealthcareElement.txt -->
<details>
<summary>deletedHealthcareElement</summary>

```text
2-8e2d16429d530a5b7beb1a5ddd75c281
```
</details>
