---
slug: how-to-manage-healthcare-elements
description: Learn how to manage {{healthcareElements}}
tags:
- HealthcareElement
---
# Handling {{healthcareElements}}

## What is a Healthcare Element?

A [Healthcare Element](../references/classes/HealthcareElement) is a piece of medical information that can be used to give more details about the context of a [{{Service}}](../references/classes/DataSample).  
It typically describes a long-lasting condition affecting a Patient.
{{HealthcareElements}} can be created by [Patient](../references/classes/Patient) and Healthcare Professionals. The sensitive information they contain are 
encrypted and can be read only by Data Owners with an explicit access.

:::note

To perform the following operations, we suppose you have at least a Patient and a Healthcare Professional in your database.

:::

## Creating a Healthcare Element

In the following example, a Healthcare Professional will create, for a Patient, a Healthcare Element describing a medical condition.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:create a HE as data owner-->
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
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/newHealthcareElement.txt -->
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

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
{
  "id": "efe79fdf-3fd9-4aa3-bd47-30417f2ba828",
  "rev": "1-30423d703dedae96aa49dd502852dea1",
  "created": 1679926538736,
  "modified": 1679926538736,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "efe79fdf-3fd9-4aa3-bd47-30417f2ba828",
  "valueDate": 20230327141538,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptedSelf": "OTWWH65edx/vwhcqR8YLXCzF6BJLp5LCbIM/a9ix/RVLdrJ+XrBqv9I8i9KIhracAiLDCrqPg+CaQYo9tzgeboXfD6wYYHCU5JtSgjMLlA4="
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
It is also possible to create a series of {{HealthcareElements}} that describe a medical history. In a medical history, 
the {{healthcareElements}} share the same `healthcareElementId`

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:create multiple related HEs as data owner-->
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
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/startHealthcareElement.txt -->
<details>
<summary>startHealthcareElement</summary>

```json
{
  "id": "716ea02a-0058-455e-9aef-81980b0c0d4b",
  "rev": "1-e58efcde8d7c0ea4470b2c38770c5640",
  "created": 1679926539806,
  "modified": 1679926539806,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "716ea02a-0058-455e-9aef-81980b0c0d4b",
  "valueDate": 20230327141539,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptedSelf": "D9Ijnfcd+09zK2nLtGikMiaR/qTMxdqZJVeFzDekbPEGgDlR1bFQ7qBgmB0gloBD7+M78R/ExxpfspjAFbP1LVF6crozlZqKX+RFQkKw/m8="
  }
}
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/followUpHealthcareElement.txt -->
<details>
<summary>followUpHealthcareElement</summary>

```json
{
  "id": "7a48c343-691c-4895-8464-e080f9c46ae7",
  "rev": "1-56018d2d18a8687b86617f48ae1a5c58",
  "created": 1679926540176,
  "modified": 1679926540176,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "716ea02a-0058-455e-9aef-81980b0c0d4b",
  "valueDate": 20230327141540,
  "openingDate": 1604793600000,
  "description": "The patient recovered",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptedSelf": "E2/WLKwIXWpkEezmstG0zZFgfSh1agLGqX4cm3BdY9aVf7ztOWeve+c8kzUB65lvzZlgZi1sWMgLFp1zAMDtyA=="
  }
}
```
</details>

:::note

The `healthcareElementId` is the id of the first Healthcare Element of the series.

:::

Several unrelated {{HealthcareElements}} can also be created at once.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:create multiple HEs as data owner-->
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
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElement1.txt -->
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

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElement2.txt -->
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

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/newElements.txt -->
<details>
<summary>newElements</summary>

```text
[
  {
    "id": "58b5cde4-d2b3-4352-868d-3c7bd0586211",
    "rev": "1-0558500b2e788337ade7af507ba91d4d",
    "healthcareElementId": "58b5cde4-d2b3-4352-868d-3c7bd0586211",
    "openingDate": 1570838400000,
    "description": "The patient has been diagnosed Pararibulitis",
    "identifiers": [],
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
      ],
      "cryptedForeignKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptedSelf": "MjnqQDElZim/yURPrgwctmzyNjuTNOXGPlmD0IH55Jh7ydooLjn5ayxbqxSYXpSnxEiOJUu8BdnPcQ43Or4R5JzMrH+6EsJIqIBt8mrq8vU="
    }
  },
  {
    "id": "84c0573a-7901-4f29-a648-f3b56bc9c06e",
    "rev": "1-e1cabc028e688f471d3f776efaedfe25",
    "healthcareElementId": "84c0573a-7901-4f29-a648-f3b56bc9c06e",
    "openingDate": 1604793600000,
    "description": "The patient has also the flu",
    "identifiers": [],
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
      ],
      "cryptedForeignKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptedSelf": "hCKTDlj31RDWdMkCrMN4rna32gEFr5cvqwN4AHnT4e3M+fUv/E3u10Q5P3u70nriQ5Y84YTBCCKlRsps66uaBQ=="
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

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:HE sharing with data owner-->
```typescript
const sharedHealthcareElement = await api.healthcareElementApi.giveAccessTo(
  healthcareElement,
  patient.id,
)
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/sharedHealthcareElement.txt -->
<details>
<summary>sharedHealthcareElement</summary>

```json
{
  "id": "efe79fdf-3fd9-4aa3-bd47-30417f2ba828",
  "rev": "2-c05a2d57a873ddba11bebb6297136973",
  "created": 1679926538736,
  "modified": 1679926538736,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "efe79fdf-3fd9-4aa3-bd47-30417f2ba828",
  "valueDate": 20230327141538,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "encryptedSelf": "xrsGxKPGBXOKmmUm+LDZXfPbuiwrO9xMev9/xYbCkqjmu1/sZrwdoEHcpQyUCv0aWwidBYbmLW7bNN82ca3G4oGV2vvLicNilwee23LqejQ="
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

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:retrieve a HE as data owner-->
```typescript
const retrievedHealthcareElement = await api.healthcareElementApi.getHealthcareElement(
  healthcareElement.id,
)
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/retrievedHealthcareElement.txt -->
<details>
<summary>retrievedHealthcareElement</summary>

```json
{
  "id": "efe79fdf-3fd9-4aa3-bd47-30417f2ba828",
  "rev": "2-c05a2d57a873ddba11bebb6297136973",
  "created": 1679926538736,
  "modified": 1679926538736,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "efe79fdf-3fd9-4aa3-bd47-30417f2ba828",
  "valueDate": 20230327141538,
  "openingDate": 1570838400000,
  "description": "The patient has been diagnosed Pararibulitis",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
    },
    "encryptedSelf": "xrsGxKPGBXOKmmUm+LDZXfPbuiwrO9xMev9/xYbCkqjmu1/sZrwdoEHcpQyUCv0aWwidBYbmLW7bNN82ca3G4oGV2vvLicNilwee23LqejQ="
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

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:modify a HE as data owner-->
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
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/yetAnotherHealthcareElement.txt -->
<details>
<summary>yetAnotherHealthcareElement</summary>

```json
{
  "id": "57245ebb-39f5-4860-a93a-42f54009bee9",
  "rev": "1-b3d1ef9fc3b478faf5838d20a84a7f57",
  "created": 1679926541624,
  "modified": 1679926541624,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "57245ebb-39f5-4860-a93a-42f54009bee9",
  "valueDate": 20230327141541,
  "openingDate": 20230327141541,
  "description": "To modify, I must create",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptedSelf": "XSO5usDrGNesKivLJpG+inHOS6GU+CRZhc7zPYfrJf4pYmMvRcnse25sFtuYAQAH5BspJIV5d9esmD77pv9hHg=="
  }
}
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/modifiedHealthcareElement.txt -->
<details>
<summary>modifiedHealthcareElement</summary>

```json
{
  "id": "57245ebb-39f5-4860-a93a-42f54009bee9",
  "rev": "1-b3d1ef9fc3b478faf5838d20a84a7f57",
  "created": 1679926541624,
  "modified": 1679926541624,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "57245ebb-39f5-4860-a93a-42f54009bee9",
  "valueDate": 20230327141541,
  "openingDate": 1570838400000,
  "description": "I can change and I can add",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptedSelf": "XSO5usDrGNesKivLJpG+inHOS6GU+CRZhc7zPYfrJf4pYmMvRcnse25sFtuYAQAH5BspJIV5d9esmD77pv9hHg=="
  }
}
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/modificationResult.txt -->
<details>
<summary>modificationResult</summary>

```json
{
  "id": "57245ebb-39f5-4860-a93a-42f54009bee9",
  "rev": "2-f7aa238c4e78290eb52c04567b18d937",
  "created": 1679926541624,
  "modified": 1679926541624,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "57245ebb-39f5-4860-a93a-42f54009bee9",
  "valueDate": 20230327141541,
  "openingDate": 1570838400000,
  "description": "I can change and I can add",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptedSelf": "N3ac1zQQZWmXyyO/a2VKQhJkxUjFUBh8c5kM6CWW/1DZXWKtsTKXGwzTvbg7LUfMP7pifWzTrQ4aOaWWQXKI3w=="
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

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:create HE filter-->
```typescript
const healthcareElementFilter = await new HealthcareElementFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .forPatients([patient])
  .build()
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementFilter.txt -->
<details>
<summary>healthcareElementFilter</summary>

```json
{
  "healthcarePartyId": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "patientSecretForeignKeys": [
    "4742a08d-bbc1-4ed1-a758-f0a605529bf1",
    "ce1568d1-d1d5-4c0a-b05b-18efed77163d"
  ],
  "$type": "HealthcareElementByHealthcarePartyPatientFilter"
}
```
</details>

:::note

You can learn more about filters in the [how to](../how-to/how-to-filter-data-with-advanced-search-criteria).

:::

After creating a filter, you can use it to retrieve the {{HealthcareElements}}.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:use HE filter method-->
```typescript
const healthcareElementsFirstPage = await api.healthcareElementApi.filterHealthcareElement(
  healthcareElementFilter,
  undefined,
  10,
)
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementsFirstPage.txt -->
<details>
<summary>healthcareElementsFirstPage</summary>

```json
{
  "pageSize": 10,
  "totalSize": 93,
  "rows": [
    {
      "id": "018bae52-1304-47c5-9612-55a1adf21530",
      "rev": "1-903481a509a3124dcf07e1ba628dd8a5",
      "created": 1679920190072,
      "modified": 1679920190072,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "018bae52-1304-47c5-9612-55a1adf21530",
      "valueDate": 20230327142950,
      "openingDate": 1570838400000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "/3TPnhFGPx7F76afmT6FMJ3mSGxgWGO6qgB0c6gbcc0yM+7Z399lXDG9hQU3pjDqGoX2TMabRca4LQp8S/zUpnxm/P3rAoXLAEdEVHx3kqs="
      }
    },
    {
      "id": "0263ddb6-5a8d-4c12-b206-6ffa40b8d568",
      "rev": "1-a61b6309f7f14c2c6a411db67f64698e",
      "healthcareElementId": "0263ddb6-5a8d-4c12-b206-6ffa40b8d568",
      "openingDate": 1604793600000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "LAiccuQ032oPDA7UiK50TgKPP05kJrGe+k+NUL7CGY62YuQst1FYmYoVprv90sbbtCUAHHUu/satXfuSFmOf/A=="
      }
    },
    {
      "id": "05a887d7-7ccf-4234-a308-22fa9740f260",
      "rev": "2-8f04260fb877a3614aa6a384c42be42a",
      "created": 1679920256640,
      "modified": 1679920256640,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "05a887d7-7ccf-4234-a308-22fa9740f260",
      "valueDate": 20230327143056,
      "openingDate": 20230327143056,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptedSelf": "XRzXlSLpjr3fPf++gP0U+qPi9QY53H4tlBYb2P0ttRtu9vfhHtS1bpZYbhBMO7BsmxwKLTn50IcG95qMwRNAhfa+keIvoGMe5tK8blr+LSY="
      }
    },
    {
      "id": "06ce559d-1547-49cb-86ac-610efb2053a1",
      "rev": "1-24c28b69dacce7bbfac8ec7e0d43d485",
      "healthcareElementId": "06ce559d-1547-49cb-86ac-610efb2053a1",
      "openingDate": 1570838400000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "o4BKrDuWLHQaqgijYDnpi0pXPjQ41A6DNPxw6c9uBvrd1hC3Qr5iyMyA/blLe99K4m4vB+vK4l7Ppr5v9gcRc70xAsTNRIE/o+vsJ+YgCYk="
      }
    },
    {
      "id": "07d0aefb-ee2e-4733-b07c-27f2ecb6f52b",
      "rev": "1-e63d26fb7c01a79766a0597115f7aba9",
      "healthcareElementId": "07d0aefb-ee2e-4733-b07c-27f2ecb6f52b",
      "openingDate": 1570838400000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "av0b+sVl+bKDktOeQX/3KQ1Mbt6j3cGuLPAqqZmVLgwPk8nzM5rD/PkL1/LahhfqERqQv5D+RytrH44DB+4N9OpFojgDbBabqOyhV+yXSAk="
      }
    },
    {
      "id": "0e0c21d0-c08b-4493-9aed-67a1f14f6ae1",
      "rev": "1-b92291123021ab1f1f2608be4f455747",
      "created": 1679920147470,
      "modified": 1679920147470,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "0e0c21d0-c08b-4493-9aed-67a1f14f6ae1",
      "valueDate": 20230327142907,
      "openingDate": 20230327142907,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "uZw4JqwRmpbpKJMRizVyqJGFSTCQo5PXMyvdgxZub48I/mJUN/GB6u8Qa37zikx0rGebmauJg6oyOHf2zpkcpDi2T6nrtO7Yv8j+llX/Jwk="
      }
    },
    {
      "id": "0ecb5315-2511-406a-91ec-fbf137584ac1",
      "rev": "1-31eb96b07c52c7dd4ded21afc33d3029",
      "created": 1679920190154,
      "modified": 1679920190154,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "018bae52-1304-47c5-9612-55a1adf21530",
      "valueDate": 20230327142950,
      "openingDate": 1604793600000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "idhr76046wN1wJ0s5dyXzMwkkkQaCZs5ogFkuqSnxa6c2PVAFNbWSlpd7Vbx3tU/vta1r9jXEo1+Ubdqqn8WoA=="
      }
    },
    {
      "id": "11a257cc-7ba2-4051-8ced-e52d34d2b14c",
      "rev": "2-84dda6e8e9f2ede361433551d964eed8",
      "created": 1679920301243,
      "modified": 1679920301243,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "11a257cc-7ba2-4051-8ced-e52d34d2b14c",
      "valueDate": 20230327143141,
      "openingDate": 1570838400000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptedSelf": "xq4ChOklbxF8UCyo1/ewpbUIbi5cvjJ6qQRlMvxEeER4hxbtw/lB4xOILJAQSrjsyH8KmuHgrANPh99w91BVhg5mO0llafm3z6sRO4VkKkc="
      }
    },
    {
      "id": "162a3124-5d18-4376-926b-bb55ee712a1d",
      "rev": "1-5eb6f3c885113337f1863d1ffe0cc6a2",
      "created": 1679926457319,
      "modified": 1679926457319,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "162a3124-5d18-4376-926b-bb55ee712a1d",
      "valueDate": 20230327141417,
      "openingDate": 20230327141417,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "2rrnliwtYvQbfMhoutOYDQlbbDCDK9wMaLBf56Gqsxf+MMM1DKV3A65Ln0V4E6vj9G6fF3+6vMgVVrzXT1AbyV0LnlJcH0jyIQ40bFOlGMo="
      }
    },
    {
      "id": "250bb146-f58b-4b4b-835d-15e97f03b611",
      "rev": "1-dbaeb35b1306f77f05e8d748f840e714",
      "created": 1679926396533,
      "modified": 1679926396533,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "250bb146-f58b-4b4b-835d-15e97f03b611",
      "valueDate": 20230327141316,
      "openingDate": 20230327141316,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "oaDiaTz53WEOZaj7zQ0qw+geij9yvZ91gVp0HA3O6UB/grIFrD85YaP3ilB8U1L4wJfeAsylnksQnSaDNeF6OGNtAZkPBiwbJ2guvE/Mpas="
      }
    }
  ],
  "nextKeyPair": {
    "startKey": "2544c3be-662f-4c6d-b773-c692125b7ca1",
    "startKeyDocId": "2544c3be-662f-4c6d-b773-c692125b7ca1"
  }
}
```
</details>

The `filter` method returns a PaginatedList that contains at most the number of elements stated
 in the method's parameter. If you do not specify any number, the default value is 1000.  
To retrieve more {{HealthcareElements}}, you can call the same method again, using the startDocumentId provided in the previous PaginatedList.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:use HE filter method second page-->
```typescript
const healthcareElementsSecondPage = await api.healthcareElementApi.filterHealthcareElement(
  healthcareElementFilter,
  healthcareElementsFirstPage.nextKeyPair.startKeyDocId,
  10,
)
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementsSecondPage.txt -->
<details>
<summary>healthcareElementsSecondPage</summary>

```json
{
  "pageSize": 10,
  "totalSize": 93,
  "rows": [
    {
      "id": "2544c3be-662f-4c6d-b773-c692125b7ca1",
      "rev": "1-2f58d3db136589bd97d5fcb1d246b662",
      "healthcareElementId": "2544c3be-662f-4c6d-b773-c692125b7ca1",
      "openingDate": 1570838400000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "Pz5GMq+dUWryssgd41QrYYKQ4IrR4rMo3IbA5VYL5A22JiGHbng+2kib6z0ppQo0jZBvBj5vCAnFSu0epG1M/Co6oO3V+C/WdpvlSlyqSa8="
      }
    },
    {
      "id": "26d0b00d-06e1-447a-94dd-91bf548dff56",
      "rev": "1-07e35bd4541f7d01319f8fd46a7d2328",
      "created": 1679924340272,
      "modified": 1679924340272,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "26d0b00d-06e1-447a-94dd-91bf548dff56",
      "valueDate": 20230327153900,
      "openingDate": 20230327153900,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "I+zRrVTskFmEC0VvSAQCmqCqIMmu8rlnWNnDftWxxFkrvJ76y+r9Ws4hhAad6gXPc9f2s0oSU7euCB522HNHsD35XwXs28DHUKDg4DohUPg="
      }
    },
    {
      "id": "2956779a-240e-4d14-8229-38ee7bbe00d1",
      "rev": "1-037994e4187d9f722616b58047f98581",
      "created": 1679920301514,
      "modified": 1679920301514,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "2956779a-240e-4d14-8229-38ee7bbe00d1",
      "valueDate": 20230327143141,
      "openingDate": 1570838400000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "jNjcYt4XsDEyiFqoYOBlA7rR3MMf2SRxPoAixNVaT+F9INyD7g+zTAybEqsnpOMQGp7UpTnRzmAebKMJM3Uz4Vk8ebYAZ7bdiP2Zsi4D41s="
      }
    },
    {
      "id": "2a74d815-734d-4658-95d1-1944a65a4cfd",
      "rev": "2-942d5ba4027d67efc67d308085dcf8fc",
      "created": 1679920073782,
      "modified": 1679920073782,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "2a74d815-734d-4658-95d1-1944a65a4cfd",
      "valueDate": 20230327142753,
      "openingDate": 20230327142753,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptedSelf": "N9/krlawkBWhcayT5s92aKoTECASua8h/j2t3VNSaXlTUXT65Q+mA48ojm837vAad9T/g+dFVZaMLQk981gJU9RhLoCqv85QpDkRi1zOhMw="
      }
    },
    {
      "id": "2d998b7f-ea7a-4c33-b0bb-291edd385473",
      "rev": "2-4da7eaaa1c1191217a55c722dc955964",
      "created": 1679923794623,
      "modified": 1679923794623,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "2d998b7f-ea7a-4c33-b0bb-291edd385473",
      "valueDate": 20230327152954,
      "openingDate": 1570838400000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptedSelf": "rOnAr5jvsISmn1VD7gouj7t7NSyMC2rLhpoyTpWgd4hWml7s5hJOmP5tDxLES5ZJKxfJdICWR04NFpQpZ13istPKlquDQsAoWNWL4uvXFIk="
      }
    },
    {
      "id": "3159d705-0fa6-4b0f-9998-054d47eb3b52",
      "rev": "2-8f7ed22fa922c263b087fdc3c5b12e42",
      "created": 1679923740670,
      "modified": 1679923740670,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "3159d705-0fa6-4b0f-9998-054d47eb3b52",
      "valueDate": 20230327152900,
      "openingDate": 20230327152900,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptedSelf": "reLlKAwNa9LhTEfvUPLqbhYuERMITK6gepeTu41lh2butW1G5NzlF5KvOkhvXlsv1kcCHrOIP0qOav6+v0XgDZC+A5JN8x74y9qn5MOrbhs="
      }
    },
    {
      "id": "32fa8e3d-aa6f-4cd4-b83a-2b55cb657de3",
      "rev": "2-14d47068521b23e3f1d6a58fa1f28f97",
      "created": 1679924391518,
      "modified": 1679924391518,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "32fa8e3d-aa6f-4cd4-b83a-2b55cb657de3",
      "valueDate": 20230327153951,
      "openingDate": 1570838400000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptedSelf": "kIYiyPhi/M4maNbX6bOQTzd9mOw7tK7wTbrfWzqzvF5gh6LoPWWXT/9qf5jEeuh0fW3krN2M5Humzjk/T41NRkQ9xsOCtHNechpPqMZe4MY="
      }
    },
    {
      "id": "3581880d-fcc1-4803-a4e4-64e585e863ef",
      "rev": "1-d61b3266a1fa6169ffeea20cbd55dfba",
      "created": 1679926239497,
      "modified": 1679926239497,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "86d9a0b1-0e7d-4498-b0e5-052b9eac3b7b",
      "valueDate": 20230327161039,
      "openingDate": 1604793600000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "xvtfh5lyuvJE7U26okhjYF2TxT5ZZqJ2+TZDAm8+/OFlHgox/xmppXGbEEMYLfimBEmzAzxIEwnP8SVwNtDcgA=="
      }
    },
    {
      "id": "3f5e9daa-122d-4dcf-a7c3-b6b12c69ae4d",
      "rev": "1-1bad127fe0b633cf3a65adebc66b3057",
      "created": 1679926267545,
      "modified": 1679926267545,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "3f5e9daa-122d-4dcf-a7c3-b6b12c69ae4d",
      "valueDate": 20230327161107,
      "openingDate": 20230327161107,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "tATR2KxmjfQ9bdKbegifkNzUYxYGy3pnSBLFqgMcGxLCRoB0U1lUelOhpLeJOa7bLcdw2frSDcer1oxV52WdjG7KfcmvLUAF17mvm8MGEu4="
      }
    },
    {
      "id": "43d77a42-cc42-40b5-b707-1cef789b4d70",
      "rev": "1-ed3e5d56293fc14dcb38af62d640008f",
      "created": 1679920046531,
      "modified": 1679920046531,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "43d77a42-cc42-40b5-b707-1cef789b4d70",
      "valueDate": 20230327142726,
      "openingDate": 1570838400000,
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "GyMvacFoIzsP3BQQXZkVo4V0T0T7GL1sTi31gn4dRlchtLysQFhcw1doM9rSX78CN5oGhQM9asfM4qlWsEIDrJIcWv5mVpXjw+VGXycyFME="
      }
    }
  ],
  "nextKeyPair": {
    "startKey": "442c2628-d9cc-4c95-9c21-6cc3ffead2d5",
    "startKeyDocId": "442c2628-d9cc-4c95-9c21-6cc3ffead2d5"
  }
}
```
</details>

If the `nextKeyPair` property of the result is `undefined`, than there are no more {{HealthcareElements}} to retrieve.  
You can also retrieve just the id of the Healthcare Element instead of the whole documents by using the match method.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:use HE match method-->
```typescript
const healthcareElementsIdList = await api.healthcareElementApi.matchHealthcareElement(
  healthcareElementFilter,
)
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementsIdList.txt -->
<details>
<summary>healthcareElementsIdList</summary>

```text
[
  "018bae52-1304-47c5-9612-55a1adf21530",
  "0263ddb6-5a8d-4c12-b206-6ffa40b8d568",
  "05a887d7-7ccf-4234-a308-22fa9740f260",
  "06ce559d-1547-49cb-86ac-610efb2053a1",
  "07d0aefb-ee2e-4733-b07c-27f2ecb6f52b",
  "0e0c21d0-c08b-4493-9aed-67a1f14f6ae1",
  "0ecb5315-2511-406a-91ec-fbf137584ac1",
  "11a257cc-7ba2-4051-8ced-e52d34d2b14c",
  "162a3124-5d18-4376-926b-bb55ee712a1d",
  "250bb146-f58b-4b4b-835d-15e97f03b611",
  "2544c3be-662f-4c6d-b773-c692125b7ca1",
  "26d0b00d-06e1-447a-94dd-91bf548dff56",
  "2956779a-240e-4d14-8229-38ee7bbe00d1",
  "2a74d815-734d-4658-95d1-1944a65a4cfd",
  "2d998b7f-ea7a-4c33-b0bb-291edd385473",
  "3159d705-0fa6-4b0f-9998-054d47eb3b52",
  "32fa8e3d-aa6f-4cd4-b83a-2b55cb657de3",
  "3581880d-fcc1-4803-a4e4-64e585e863ef",
  "3f5e9daa-122d-4dcf-a7c3-b6b12c69ae4d",
  "43d77a42-cc42-40b5-b707-1cef789b4d70",
  "442c2628-d9cc-4c95-9c21-6cc3ffead2d5",
  "4db6be85-da39-4bd8-8906-4cf9df26fac0",
  "538ceecd-bf6f-4145-969a-84ff671ac573",
  "539d8fed-30c7-46b5-93dc-6383124468be",
  "548f54b1-eeb0-4b41-bde5-36549a273bb8",
  "561cd236-55a6-48f5-9213-44f236899f2a",
  "57245ebb-39f5-4860-a93a-42f54009bee9",
  "572b0640-3bdd-4ef4-b9fd-70eea2ada2a8",
  "58054161-0505-43f5-b7b0-3c745c145318",
  "58b5cde4-d2b3-4352-868d-3c7bd0586211",
  "5c20018b-36cc-4a76-bdb6-dfc71c66a57b",
  "5dba54c5-942c-48c1-9cfd-4acfcb249b19",
  "5dca19aa-8a16-4ed5-af68-254bd94b8d6f",
  "60280f87-93bb-40d1-8089-347b88554b1c",
  "61c74c60-42f0-4ad5-b119-d8b25e3fda0e",
  "638e134c-0c91-4a25-9c4a-32aaa3bdc6a1",
  "67704b42-6aba-497d-935f-62a54a41d0f3",
  "6b309b42-3b6e-4ed5-a7b0-7e6e24114710",
  "6bd8c3ca-5c9c-4ce9-a778-48b7097d64f3",
  "6cad6fa0-e5b8-4707-bbc9-29e0a1da367c",
  "6df51f69-64cf-43fa-b5fc-183268bebd59",
  "6e151c27-f17c-4023-9713-1bc84644368d",
  "70708065-166a-475d-ac89-3f4947f37582",
  "716ea02a-0058-455e-9aef-81980b0c0d4b",
  "7364ea52-7586-4592-b5a9-8f681e6e9925",
  "73bfee8e-9e7b-48de-b7b6-7b781a0d2603",
  "752fbc60-3ee9-4648-b694-d9f488843311",
  "7a48c343-691c-4895-8464-e080f9c46ae7",
  "7d967b50-b49c-49b4-984a-f8c568833aa8",
  "812a330e-27ee-4360-a8cf-0eb549b95af8",
  "843ef730-a644-45e6-ace4-5678cf3835ca",
  "84c0573a-7901-4f29-a648-f3b56bc9c06e",
  "85d75e4a-0868-43d8-a95c-88725d291db9",
  "86d9a0b1-0e7d-4498-b0e5-052b9eac3b7b",
  "893335b7-661c-40b6-8f3d-2482c6ce790e",
  "9246add6-374e-4ba5-b0df-fe4a698af748",
  "952e4666-7aef-4556-848e-6fd4cae72a3b",
  "9aa6b89f-47c0-43ab-a39f-3d288174cd45",
  "9dbd065e-a219-49b7-86de-2edadc8e7573",
  "9e92765f-7d5a-41d5-9357-1b82f6f022f1",
  "a13ced82-5090-4199-b93b-f955e73458a6",
  "abf689b3-e9ff-42d3-a6cb-288f84d513fa",
  "b0c77c02-5408-4d5f-b2f1-bceeb45971c8",
  "b1945529-5297-4268-b766-2e54c23fd9cd",
  "b2c05187-f8e7-4c13-9fb6-49808659d271",
  "b39658db-c8b7-453f-a8d0-eeb2addf4802",
  "b60d7298-147c-4c7b-890d-d8a41ac8dcea",
  "b6348f01-523f-40ea-a29f-80dba72d8c55",
  "b6721071-2b7f-435a-8523-1e62bdc4c9ca",
  "b6fcb433-0628-4bf9-8c80-ee22af0e68d3",
  "ba5dce37-59f2-4c34-bb70-9096ecafb01d",
  "bdd30325-0aeb-4a4d-9bd3-13d02ab296f6",
  "bdfda04c-8e72-4690-bb5f-2af1bdc453a4",
  "c271f3f1-0a3a-42ad-9dd5-8055919ec4b2",
  "c2c41d3e-b002-46b7-b500-b1a7b1dcd3e3",
  "c4d49c8e-0b8b-4087-bcc5-c004d2021535",
  "c8965679-b88c-4138-ba1a-c32678886b5b",
  "cbacf43a-91d5-471d-932b-d0dae5e67403",
  "cbd88c2b-4dfd-4d92-863e-6f402bd597f3",
  "ce9b7e2f-37ef-4ef7-8fd5-295d36201f80",
  "cf048447-a91d-4ed2-8801-2be3e201fe64",
  "cf4d2b5e-8191-4997-9e2f-69f2e5b11d17",
  "d89aa316-b4af-406f-8b2b-848aad75a769",
  "db13490a-a5f0-4dc4-bb57-8319b28e029e",
  "df498876-bad8-463d-99dd-198c62d6051b",
  "e1b992ee-61e1-4123-853b-a62396f3bb6c",
  "e3be5de1-3d73-486a-8c90-a61d5bda1bfb",
  "eddce246-d4ca-4cc8-ad41-6365a1004c1d",
  "efe79fdf-3fd9-4aa3-bd47-30417f2ba828",
  "f066171b-4ea2-4d77-8eae-2573f2bd89b0",
  "f099bdcc-cd09-48e6-a16e-dfe928236ff0",
  "f5b238b3-9441-4abc-9ba7-7bddc73fda11",
  "f97401aa-22b7-42fd-8f0b-fe5b5f42ef5d"
]
```
</details>

You can also retrieve all the {{HealthcareElements}} belonging to a specific patient that the current Data Owner 
can access.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:use by patient method-->
```typescript
const healthcareElementsForPatient = await api.healthcareElementApi.getHealthcareElementsForPatient(
  existingPatient,
)
```
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementsForPatient.txt -->
<details>
<summary>healthcareElementsForPatient</summary>

```text
[
  {
    "id": "75a77b6c-5b52-4f9b-8ddc-8e7320318431",
    "rev": "1-58b5822c0490090b2cc8fde4670adbb0",
    "created": 1679926542704,
    "modified": 1679926542704,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "healthcareElementId": "75a77b6c-5b52-4f9b-8ddc-8e7320318431",
    "valueDate": 20230327141542,
    "openingDate": 20230327141542,
    "identifiers": [],
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "21766cd3-5d6f-48f9-ac36-db6e74ac252f"
      ],
      "cryptedForeignKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptedSelf": "aqy/cq7mJJ1HEhUO1mGBU4VkThp19yVVPQXLE7jhCrEbr+idpipbGBjORQzlvmNLuMX+sQ/ZK1zNugykbfLWcA=="
    }
  }
]
```
</details>

## Deleting a Healthcare Element

Finally, a Data Owner that has access to a Healthcare Element can decide to delete it.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-elements/index.mts snippet:delete a HE as data owner-->
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
<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/healthcareElementToDelete.txt -->
<details>
<summary>healthcareElementToDelete</summary>

```json
{
  "id": "680886c9-c9fe-4032-990c-cd6ea361f601",
  "rev": "1-1cc1f038e390b001059b885caa1176ac",
  "created": 1679926544565,
  "modified": 1679926544565,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "680886c9-c9fe-4032-990c-cd6ea361f601",
  "valueDate": 20230327141544,
  "openingDate": 20230327141544,
  "description": "I am doomed",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "4742a08d-bbc1-4ed1-a758-f0a605529bf1"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptedSelf": "kUTylkqCYr5CMCbxKWulCHXXHfmcc6sQ8kzZgNqgo5q615OK2ILHRXCsFrsh5xdL"
  }
}
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-elements/deletedHealthcareElement.txt -->
<details>
<summary>deletedHealthcareElement</summary>

```text
2-5f2cdb2f10ac3ff57597d360cfb9c3b3
```
</details>
