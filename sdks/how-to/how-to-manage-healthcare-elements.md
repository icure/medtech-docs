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
  "id": "b922cdb0-a420-4efa-96ec-f6b9cfa8951f",
  "rev": "1-d769fefa791b83435626d7d11add2288",
  "created": 1682493616074,
  "modified": 1682493616074,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "b922cdb0-a420-4efa-96ec-f6b9cfa8951f",
  "valueDate": 20230426072016,
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
    "encryptedSelf": "QiMW7ML7dxRLjMwHfAM4e5X3fuMQU6pJrnIPQOpbbD4b+tZOa0XiAbobj0hOKS1uHMSXwUZhcrbznuK7mPGgHa8zakY+yynkUSbRsxlkh/U="
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
  "id": "15cefa68-325e-4e40-85af-1c78f99cb121",
  "rev": "1-d5d705873c0f87012bc6ab265f189725",
  "created": 1682493617857,
  "modified": 1682493617856,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "15cefa68-325e-4e40-85af-1c78f99cb121",
  "valueDate": 20230426072017,
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
    "encryptedSelf": "/kRFq+2ca/GQ93P+WCD50KhqF3/b7HlSx7ZS4XuBaGpoRLmKFkif1gRDzuCO1bcITzm9H0hC9DPblgkL/pu71sfdhOaj9pr1p1R0O0NRCRc="
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/followUpHealthcareElement.txt -->
<details>
<summary>followUpHealthcareElement</summary>

```json
{
  "id": "41927424-b3f9-44d7-8eca-eef5b280285c",
  "rev": "1-fade332d32946df2abcc6c9ba02c842c",
  "created": 1682493618519,
  "modified": 1682493618519,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "15cefa68-325e-4e40-85af-1c78f99cb121",
  "valueDate": 20230426072018,
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
    "encryptedSelf": "Ae7wgRhg+WCiZjpYw9KxcD1PIlDcmdYsTtrhFGDXAxhxCwQiCn5E5WMfqqD1aq+S6YqAGAX2gQ8HC2nQigjWcQ=="
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
    "id": "7d2465e9-3926-4bfc-81bd-4924f826e449",
    "rev": "1-ea514afb16431fe8b66c285a5a5b2576",
    "healthcareElementId": "7d2465e9-3926-4bfc-81bd-4924f826e449",
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
      "encryptedSelf": "iBobjETvtRQkeAxxpi03BECiN2AP9dbDfrQCt2DwueDWZGHJgchmYeu9pfA7G1h9K5O73zGCpy8ijcdDFrJZgHH5S1ezfj7xMqvxQZY9wtc="
    }
  },
  {
    "id": "e41b2f2c-899d-4f8d-810b-0971b29f9bd2",
    "rev": "1-fe2d130cd8dd4d58d19937979dfa112e",
    "healthcareElementId": "e41b2f2c-899d-4f8d-810b-0971b29f9bd2",
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
      "encryptedSelf": "r4Hby98d/6Wfw3mvzOGUt88T4iLh18utmhulemyakTpOLAn38a4/X7gj44bHoOMKGXas+QQWf0UxvrAwJguexg=="
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
  "id": "b922cdb0-a420-4efa-96ec-f6b9cfa8951f",
  "rev": "2-106803bd67198780eb571c1292fd393c",
  "created": 1682493616074,
  "modified": 1682493616074,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "b922cdb0-a420-4efa-96ec-f6b9cfa8951f",
  "valueDate": 20230426072016,
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
    "encryptedSelf": "jyF8oP39lDUt57EAwHZrSphhGbC9IWzKsn2Ks9Ay9HtV5gFJY8LfnWcRQT9dBxZJ4GLuhFOtHklYyqaK4HJ9YF6U2QclFnGY8oY1ik95sCg="
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
  "id": "b922cdb0-a420-4efa-96ec-f6b9cfa8951f",
  "rev": "2-106803bd67198780eb571c1292fd393c",
  "created": 1682493616074,
  "modified": 1682493616074,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "b922cdb0-a420-4efa-96ec-f6b9cfa8951f",
  "valueDate": 20230426072016,
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
    "encryptedSelf": "jyF8oP39lDUt57EAwHZrSphhGbC9IWzKsn2Ks9Ay9HtV5gFJY8LfnWcRQT9dBxZJ4GLuhFOtHklYyqaK4HJ9YF6U2QclFnGY8oY1ik95sCg="
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
  "id": "96180498-b7a0-4a3c-a04d-9e554a58e80f",
  "rev": "1-d5264e41f3f1e6cd9b8407bd4b07807b",
  "created": 1682493621005,
  "modified": 1682493621005,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "96180498-b7a0-4a3c-a04d-9e554a58e80f",
  "valueDate": 20230426072021,
  "openingDate": 20230426072021,
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
    "encryptedSelf": "vTnzDCgBUZTRMlN6y+uWmhm3AcClRTC/SJm+OWbcKRNUCsJjVMoEL/RBB7eot/3fJaQp9ZqHyokgaRRTatE0wQ=="
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/modifiedHealthcareElement.txt -->
<details>
<summary>modifiedHealthcareElement</summary>

```json
{
  "id": "96180498-b7a0-4a3c-a04d-9e554a58e80f",
  "rev": "1-d5264e41f3f1e6cd9b8407bd4b07807b",
  "created": 1682493621005,
  "modified": 1682493621005,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "96180498-b7a0-4a3c-a04d-9e554a58e80f",
  "valueDate": 20230426072021,
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
    "encryptedSelf": "vTnzDCgBUZTRMlN6y+uWmhm3AcClRTC/SJm+OWbcKRNUCsJjVMoEL/RBB7eot/3fJaQp9ZqHyokgaRRTatE0wQ=="
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/modificationResult.txt -->
<details>
<summary>modificationResult</summary>

```json
{
  "id": "96180498-b7a0-4a3c-a04d-9e554a58e80f",
  "rev": "2-e972af654f7176c9282b3f192adef7b2",
  "created": 1682493621005,
  "modified": 1682493621005,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "96180498-b7a0-4a3c-a04d-9e554a58e80f",
  "valueDate": 20230426072021,
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
    "encryptedSelf": "fP01XQkz8jvQcGFjhIZ6UA0kSrwS815HVLTXbQDFbC93rIgUKZ8rxnf4wjmEseSqs3m0azXlLjmBn6DtM5MPEw=="
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
const healthcareElementFilter = await new HealthcareElementFilter()
  .forDataOwner(user.healthcarePartyId)
  .forPatients(api.cryptoApi, [patient])
  .build()
```
<!-- output://code-samples/how-to/manage-healthcare-elements/healthcareElementFilter.txt -->
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
  "totalSize": 161,
  "rows": [
    {
      "id": "00577c6a-512d-4b8c-8a25-09bae8a22b69",
      "rev": "1-7c09aae1ea0b60c298878e9c5fa576c9",
      "created": 1679929598446,
      "modified": 1679929598447,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "00577c6a-512d-4b8c-8a25-09bae8a22b69",
      "valueDate": 20230327170638,
      "openingDate": 1679929598396,
      "description": "The patient is pregnant",
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
        "encryptedSelf": "6IdDpQngFvwbESUoUkQlLPnmUAEtZ43AsJr1+MQam8ysa2Ho88sa8sFFAsG3aNv6oFxV1Xpn5VM4sSyuWEJNRg=="
      }
    },
    {
      "id": "00a6241a-015e-4db3-923c-628bf3b1acd0",
      "rev": "2-e3050efb2902b381c79c254f5c3dd17e",
      "created": 1679928187710,
      "modified": 1679928187710,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "00a6241a-015e-4db3-923c-628bf3b1acd0",
      "valueDate": 20230327164307,
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
        "encryptedSelf": "bXYv24amaYqStnss+L3BRQXmboUVOuaW6ctN6wI2sQm7K2OuknuenxZbWdmMVif62E9PFRnNaOy9k1moDIRBRWQLxDysykAi4RyK2hAqiSA="
      }
    },
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
        "encryptedSelf": "/3TPnhFGPx7F76afmT6FMJ3mSGxgWGO6qgB0c6gbcc0yM+7Z399lXDG9hQU3pjDqGoX2TMabRca4LQp8S/zUpnxm/P3rAoXLAEdEVHx3kqs="
      }
    },
    {
      "id": "0263ddb6-5a8d-4c12-b206-6ffa40b8d568",
      "rev": "1-a61b6309f7f14c2c6a411db67f64698e",
      "healthcareElementId": "0263ddb6-5a8d-4c12-b206-6ffa40b8d568",
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
        "encryptedSelf": "LAiccuQ032oPDA7UiK50TgKPP05kJrGe+k+NUL7CGY62YuQst1FYmYoVprv90sbbtCUAHHUu/satXfuSFmOf/A=="
      }
    },
    {
      "id": "02ff28de-9130-4dee-bfff-ac7b9c42b078",
      "rev": "1-023eaa3fb2b175b44f563b7abdc52947",
      "healthcareElementId": "02ff28de-9130-4dee-bfff-ac7b9c42b078",
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
        "encryptedSelf": "enSJgwD3+Wm70Ysq0alyF/r1HxYPQqk8wzHDOiVZlC5KVcnmEPAvsvq1YEU4tmJLIcTzbkqNZbl3golJ72tgqg=="
      }
    },
    {
      "id": "04a5bae9-06af-4030-b20f-1ba24c775c27",
      "rev": "1-df2e2c1958d4762d5dda0002b55c04cf",
      "healthcareElementId": "04a5bae9-06af-4030-b20f-1ba24c775c27",
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
        "encryptedSelf": "DqDyUO2ma7iV5v/5fzk7OvQRrzRVYNiLgdhjwNOCAIHhtkCARCo1X7qmZ9yHaPbPQ+F/L5O+R/yst+gCvx/YCYwIWV5YrI5E3H8P6JyP4as="
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
      "description": "My diagnosis is that the patient has Hay Fever",
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
      "id": "06bdea2b-f5b4-42b5-b6fd-1050d052bee4",
      "rev": "1-e3df7a309a7ee746e609a4809b968e9b",
      "created": 1680075172334,
      "modified": 1680075172334,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "06bdea2b-f5b4-42b5-b6fd-1050d052bee4",
      "valueDate": 20230329073252,
      "openingDate": 1680075171966,
      "description": "The patient is pregnant",
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
        "encryptedSelf": "74BmMM6YXhGYHsVuwcV8b0qFgS2kfSZy8i5dgwHgsOGwt4iM+LKbRVOs7OsNKYDgxG4EBa8QilBytMHMB9JK2A=="
      }
    },
    {
      "id": "06ce559d-1547-49cb-86ac-610efb2053a1",
      "rev": "1-24c28b69dacce7bbfac8ec7e0d43d485",
      "healthcareElementId": "06ce559d-1547-49cb-86ac-610efb2053a1",
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
        "encryptedSelf": "o4BKrDuWLHQaqgijYDnpi0pXPjQ41A6DNPxw6c9uBvrd1hC3Qr5iyMyA/blLe99K4m4vB+vK4l7Ppr5v9gcRc70xAsTNRIE/o+vsJ+YgCYk="
      }
    },
    {
      "id": "07d0aefb-ee2e-4733-b07c-27f2ecb6f52b",
      "rev": "1-e63d26fb7c01a79766a0597115f7aba9",
      "healthcareElementId": "07d0aefb-ee2e-4733-b07c-27f2ecb6f52b",
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
        "encryptedSelf": "av0b+sVl+bKDktOeQX/3KQ1Mbt6j3cGuLPAqqZmVLgwPk8nzM5rD/PkL1/LahhfqERqQv5D+RytrH44DB+4N9OpFojgDbBabqOyhV+yXSAk="
      }
    }
  ],
  "nextKeyPair": {
    "startKey": "09c8f062-be13-441f-9403-50f040ad3511",
    "startKeyDocId": "09c8f062-be13-441f-9403-50f040ad3511"
  }
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
  "totalSize": 161,
  "rows": [
    {
      "id": "09c8f062-be13-441f-9403-50f040ad3511",
      "rev": "2-3b5d69918bb096651e1ff85f439daeaa",
      "created": 1679991706452,
      "modified": 1679991706452,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "09c8f062-be13-441f-9403-50f040ad3511",
      "valueDate": 20230328102146,
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
        "encryptedSelf": "RSyvLJNIUjYXFzkFLo9S6ZK5ROCaoVRSq76E9+9NINbkw+aNCougAJjnVPyY56iAcN5pClraX1S/IS3j7Q3MOVl/YE2sf/uillh5bnXVMRY="
      }
    },
    {
      "id": "0c3d2d4a-4ebc-486d-aacd-d264a2a18df4",
      "rev": "2-07d8b751b9bac924c509535bd1926b00",
      "created": 1679927905027,
      "modified": 1679927905027,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "0c3d2d4a-4ebc-486d-aacd-d264a2a18df4",
      "valueDate": 20230327163825,
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
        "encryptedSelf": "k2Rx+/mcAiiU2x0Y20kG6of8aVPc1UzpGl+ZRf8c9vFOFB9G0ZWY5TbJVLajDJmyf44M6+j3jeX6Y/MFfewx4As8Hr+RFkizywGJ76sKvkw="
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
      "description": "My diagnosis is that the patient has Hay Fever",
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
        "encryptedSelf": "idhr76046wN1wJ0s5dyXzMwkkkQaCZs5ogFkuqSnxa6c2PVAFNbWSlpd7Vbx3tU/vta1r9jXEo1+Ubdqqn8WoA=="
      }
    },
    {
      "id": "11467e98-e552-4bd4-b5b7-a20c2ebc78a3",
      "rev": "2-91a0792e89b7e71b355d104a34295ea6",
      "created": 1680074908455,
      "modified": 1680074908455,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "11467e98-e552-4bd4-b5b7-a20c2ebc78a3",
      "valueDate": 20230329072828,
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
        "encryptedSelf": "oljJgmFEEZOc++XH1kCFjqhxp6e2odmne/qp2IT7k8wwkp9cbvIShb0pvJWHEdhaAYeh/X5hKq/DR+AyXsPmEJW3+ymh6lN4xcT/Xef5LX8="
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
        "encryptedSelf": "xq4ChOklbxF8UCyo1/ewpbUIbi5cvjJ6qQRlMvxEeER4hxbtw/lB4xOILJAQSrjsyH8KmuHgrANPh99w91BVhg5mO0llafm3z6sRO4VkKkc="
      }
    },
    {
      "id": "11d90f74-6d8e-4c2d-9cee-31020532569e",
      "rev": "1-3161492bf65f24da602a0f54c368ad65",
      "created": 1679929448999,
      "modified": 1679929448999,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "11d90f74-6d8e-4c2d-9cee-31020532569e",
      "valueDate": 20230327170408,
      "openingDate": 1679929448916,
      "description": "The patient is pregnant",
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
        "encryptedSelf": "Irgz9gFLZM96aUg9naLszcflAd3JlgquA4szClQomV2sIYnTFKhqDxnF8lUeJUwWkLSb3jZcKgWAFogZoikHtw=="
      }
    },
    {
      "id": "122795fc-4670-4b34-9874-bd3abd311bb3",
      "rev": "1-fcae4f64808c28e2636beb81f5696ef8",
      "created": 1680507279120,
      "modified": 1680507279120,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "122795fc-4670-4b34-9874-bd3abd311bb3",
      "valueDate": 20230403073439,
      "openingDate": 20230403073439,
      "description": "My diagnosis is that the patient has Hay Fever",
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
        "encryptedSelf": "ueqpVp9HgjKxVjSZa4WI/VGqPfAfU8+GUbTF6ZE2HiCZsW8fejUo5H1gse2H7X7obubpfxVv9ogbjR/FATAWPBcZUR3D7QZjM3duEygkI3s="
      }
    },
    {
      "id": "1249ab05-9a1a-48e5-bf78-a22807fa1191",
      "rev": "2-9a4faf59059d047664c54bb7a484e8a1",
      "created": 1679928188681,
      "modified": 1679928188681,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "1249ab05-9a1a-48e5-bf78-a22807fa1191",
      "valueDate": 20230327164308,
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
        "encryptedSelf": "El87q4RBmtkqAZ4cTLfM29mnxRHSHXK83onXModaFHHb1NOhG1xF/7kcot/hBmgCqCKkc8TGjTIssjj/GY/Zmw=="
      }
    },
    {
      "id": "15c26ab9-3591-4ba5-923e-9b10b2032643",
      "rev": "1-a3eedcacad2f76328c04e1fc12cd7a8b",
      "created": 1679929562983,
      "modified": 1679929562983,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "healthcareElementId": "15c26ab9-3591-4ba5-923e-9b10b2032643",
      "valueDate": 20230327170602,
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
        "encryptedSelf": "VQmrZzUGzDVAQrUL21msZ82+jnavv2sEP48TRGaf2N47mxujndXr2b+PCMlBD9vMM2FGMalq/4mQTseahaF6N6XFlmNAZ7WKyyDUiahIS/c="
      }
    }
  ],
  "nextKeyPair": {
    "startKey": "15cefa68-325e-4e40-85af-1c78f99cb121",
    "startKeyDocId": "15cefa68-325e-4e40-85af-1c78f99cb121"
  }
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
  "00577c6a-512d-4b8c-8a25-09bae8a22b69",
  "00a6241a-015e-4db3-923c-628bf3b1acd0",
  "018bae52-1304-47c5-9612-55a1adf21530",
  "0263ddb6-5a8d-4c12-b206-6ffa40b8d568",
  "02ff28de-9130-4dee-bfff-ac7b9c42b078",
  "04a5bae9-06af-4030-b20f-1ba24c775c27",
  "05a887d7-7ccf-4234-a308-22fa9740f260",
  "06bdea2b-f5b4-42b5-b6fd-1050d052bee4",
  "06ce559d-1547-49cb-86ac-610efb2053a1",
  "07d0aefb-ee2e-4733-b07c-27f2ecb6f52b",
  "09c8f062-be13-441f-9403-50f040ad3511",
  "0c3d2d4a-4ebc-486d-aacd-d264a2a18df4",
  "0e0c21d0-c08b-4493-9aed-67a1f14f6ae1",
  "0ecb5315-2511-406a-91ec-fbf137584ac1",
  "11467e98-e552-4bd4-b5b7-a20c2ebc78a3",
  "11a257cc-7ba2-4051-8ced-e52d34d2b14c",
  "11d90f74-6d8e-4c2d-9cee-31020532569e",
  "122795fc-4670-4b34-9874-bd3abd311bb3",
  "1249ab05-9a1a-48e5-bf78-a22807fa1191",
  "15c26ab9-3591-4ba5-923e-9b10b2032643",
  "15cefa68-325e-4e40-85af-1c78f99cb121",
  "1609cffb-3f27-4011-a56f-b0de870c8de9",
  "162a3124-5d18-4376-926b-bb55ee712a1d",
  "214a2aa7-4c82-435d-89af-c903e04f4ff9",
  "250bb146-f58b-4b4b-835d-15e97f03b611",
  "2544c3be-662f-4c6d-b773-c692125b7ca1",
  "26d0b00d-06e1-447a-94dd-91bf548dff56",
  "27b4a00a-2feb-4dd6-8fea-a23fb0ffe68c",
  "2956779a-240e-4d14-8229-38ee7bbe00d1",
  "296d6079-a8bf-424e-8c40-17b610613230",
  "2a74d815-734d-4658-95d1-1944a65a4cfd",
  "2ba7c970-5432-452d-939f-c155a5111487",
  "2d998b7f-ea7a-4c33-b0bb-291edd385473",
  "3159d705-0fa6-4b0f-9998-054d47eb3b52",
  "32fa8e3d-aa6f-4cd4-b83a-2b55cb657de3",
  "3581880d-fcc1-4803-a4e4-64e585e863ef",
  "3d62e848-1973-4f91-9a5f-7e7ba06365bc",
  "3f5e9daa-122d-4dcf-a7c3-b6b12c69ae4d",
  "41927424-b3f9-44d7-8eca-eef5b280285c",
  "43d77a42-cc42-40b5-b707-1cef789b4d70",
  "442c2628-d9cc-4c95-9c21-6cc3ffead2d5",
  "45d9abcc-d17e-427b-a2ce-7a82b0b74588",
  "4622c11e-69fe-42e2-a64e-55b4e79f2f91",
  "46c5dabf-0116-4ad4-bc7d-75701e54d0e8",
  "4a7e0cd8-eba5-4dd9-9d05-ce77efde7d56",
  "4db6be85-da39-4bd8-8906-4cf9df26fac0",
  "4e3a98ce-c3db-4097-8783-7cfab1a74cd2",
  "4fa1574c-59cf-41bb-ba0d-853fa6a223ce",
  "538ceecd-bf6f-4145-969a-84ff671ac573",
  "539d8fed-30c7-46b5-93dc-6383124468be",
  "53c6e17c-afda-414b-b33a-8b79df2428ca",
  "548f54b1-eeb0-4b41-bde5-36549a273bb8",
  "54a48393-dcd8-4d9b-8ee5-eb2d4810c7a2",
  "561cd236-55a6-48f5-9213-44f236899f2a",
  "57245ebb-39f5-4860-a93a-42f54009bee9",
  "572b0640-3bdd-4ef4-b9fd-70eea2ada2a8",
  "58054161-0505-43f5-b7b0-3c745c145318",
  "58b5cde4-d2b3-4352-868d-3c7bd0586211",
  "5b0ce445-cf45-4224-861d-19f924e61bde",
  "5b8a3a7f-0d50-453f-b36f-617ab4d2c908",
  "5c20018b-36cc-4a76-bdb6-dfc71c66a57b",
  "5cce7f64-edba-41b9-bf7f-d902f453f129",
  "5dba54c5-942c-48c1-9cfd-4acfcb249b19",
  "5dca19aa-8a16-4ed5-af68-254bd94b8d6f",
  "5e60035a-7996-48b2-bd94-37efab32ab71",
  "5f2a0cf8-6242-405c-bbaa-6731d3637a50",
  "60280f87-93bb-40d1-8089-347b88554b1c",
  "61c74c60-42f0-4ad5-b119-d8b25e3fda0e",
  "638e134c-0c91-4a25-9c4a-32aaa3bdc6a1",
  "6423b921-033c-43b1-ab51-7473ec86243b",
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
  "74679ab7-69d2-4288-b065-688429e8096a",
  "752fbc60-3ee9-4648-b694-d9f488843311",
  "7a48c343-691c-4895-8464-e080f9c46ae7",
  "7acb7226-cbcc-4c1f-be53-78b86da6167d",
  "7d2465e9-3926-4bfc-81bd-4924f826e449",
  "7d967b50-b49c-49b4-984a-f8c568833aa8",
  "7eb81d0e-b11a-4886-b5cc-fcc64d482d7b",
  "7fdabc38-fa93-47db-abe4-287ac7777abe",
  "80c9c84a-1376-4995-8247-0e0f7554c5e6",
  "812a330e-27ee-4360-a8cf-0eb549b95af8",
  "83f4c43f-07d1-4689-8b27-6be038be777d",
  "843ef730-a644-45e6-ace4-5678cf3835ca",
  "84c0573a-7901-4f29-a648-f3b56bc9c06e",
  "85d75e4a-0868-43d8-a95c-88725d291db9",
  "86d9a0b1-0e7d-4498-b0e5-052b9eac3b7b",
  "8920bd76-7879-4f44-912e-3bbf34343551",
  "893335b7-661c-40b6-8f3d-2482c6ce790e",
  "9246add6-374e-4ba5-b0df-fe4a698af748",
  "92864247-24e8-454b-bd9c-46cdffa95768",
  "94df5c18-95f2-466c-8a9b-ce46c83fd85c",
  "952e4666-7aef-4556-848e-6fd4cae72a3b",
  "95b4c161-6089-464a-b0f6-5f618ee4852e",
  "96180498-b7a0-4a3c-a04d-9e554a58e80f",
  "9a5e1fc3-2156-4480-a4a9-7168a0056867",
  "9aa6b89f-47c0-43ab-a39f-3d288174cd45",
  "9af1af1d-57fa-4ea5-9280-ca8cdef06b97",
  "9d65c82d-af20-4019-bab7-5aeb3c507e4a",
  "9dbd065e-a219-49b7-86de-2edadc8e7573",
  "9e763ba6-3c0c-4cef-a427-ea43071aca17",
  "9e92765f-7d5a-41d5-9357-1b82f6f022f1",
  "9f4f7bc3-d659-4582-acc3-8cbf216051b3",
  "a012496a-3779-4fe0-9111-324e92c5d0e1",
  "a13ced82-5090-4199-b93b-f955e73458a6",
  "a4950397-bf9b-4d7c-96c4-ff130f0f76b8",
  "abf689b3-e9ff-42d3-a6cb-288f84d513fa",
  "b0c77c02-5408-4d5f-b2f1-bceeb45971c8",
  "b1945529-5297-4268-b766-2e54c23fd9cd",
  "b2c05187-f8e7-4c13-9fb6-49808659d271",
  "b39658db-c8b7-453f-a8d0-eeb2addf4802",
  "b60d7298-147c-4c7b-890d-d8a41ac8dcea",
  "b6348f01-523f-40ea-a29f-80dba72d8c55",
  "b6721071-2b7f-435a-8523-1e62bdc4c9ca",
  "b6fcb433-0628-4bf9-8c80-ee22af0e68d3",
  "b8d200ad-c2ab-4914-8a5c-5c48b456a894",
  "b922cdb0-a420-4efa-96ec-f6b9cfa8951f",
  "ba5dce37-59f2-4c34-bb70-9096ecafb01d",
  "bb22d4a6-dd4d-48af-ab3b-cfde60d7a458",
  "bbf3494d-9fcc-4bb9-b867-aa8f435b086c",
  "bcf8e2bd-c205-488b-82b0-4d628d13910e",
  "bdd30325-0aeb-4a4d-9bd3-13d02ab296f6",
  "bdfda04c-8e72-4690-bb5f-2af1bdc453a4",
  "bfdcdb8c-803a-4fd4-a1ee-6625c7ef7315",
  "c2176548-0496-4ff2-91f0-5f67b7b0079a",
  "c271f3f1-0a3a-42ad-9dd5-8055919ec4b2",
  "c2c41d3e-b002-46b7-b500-b1a7b1dcd3e3",
  "c4d49c8e-0b8b-4087-bcc5-c004d2021535",
  "c8965679-b88c-4138-ba1a-c32678886b5b",
  "ca3c4a58-2c1c-4472-8ccd-901341604966",
  "cbacf43a-91d5-471d-932b-d0dae5e67403",
  "cbd88c2b-4dfd-4d92-863e-6f402bd597f3",
  "cc08f9e3-db2a-44ae-8bb5-b80f0a62710e",
  "ce9b7e2f-37ef-4ef7-8fd5-295d36201f80",
  "ceeda6a0-4cdb-407c-b092-b757d593f3d9",
  "cf048447-a91d-4ed2-8801-2be3e201fe64",
  "cf4d2b5e-8191-4997-9e2f-69f2e5b11d17",
  "d79ed178-c3ca-47a6-b0b9-ea52bd57a07d",
  "d89aa316-b4af-406f-8b2b-848aad75a769",
  "db13490a-a5f0-4dc4-bb57-8319b28e029e",
  "dcecd029-a957-47be-b950-5493dc66b886",
  "ddae4b09-068e-40d8-b540-0d38154fe711",
  "df498876-bad8-463d-99dd-198c62d6051b",
  "e1b992ee-61e1-4123-853b-a62396f3bb6c",
  "e3be5de1-3d73-486a-8c90-a61d5bda1bfb",
  "e41b2f2c-899d-4f8d-810b-0971b29f9bd2",
  "eddce246-d4ca-4cc8-ad41-6365a1004c1d",
  "efe79fdf-3fd9-4aa3-bd47-30417f2ba828",
  "f066171b-4ea2-4d77-8eae-2573f2bd89b0",
  "f099bdcc-cd09-48e6-a16e-dfe928236ff0",
  "f5b238b3-9441-4abc-9ba7-7bddc73fda11",
  "f666d19d-c6bd-456b-b92c-50d6f7087ec8",
  "f97401aa-22b7-42fd-8f0b-fe5b5f42ef5d"
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
    "id": "fcb7d16c-f3ab-4715-acdd-e47c16d95479",
    "rev": "1-4b8380cc627ff3497834ed40f2c51bcf",
    "created": 1682493622631,
    "modified": 1682493622631,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "healthcareElementId": "fcb7d16c-f3ab-4715-acdd-e47c16d95479",
    "valueDate": 20230426072022,
    "openingDate": 20230426072022,
    "description": "To modify, I must create",
    "identifiers": [],
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "8ff1245f-d830-419e-bcaf-64836fd9b473"
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
      "encryptedSelf": "kcZWLL5vhkRAJnoFFDAfAGqNGnYvyjZQfmx4OOvN6+1qjprQqFQuEf+6LiWvba8K6y93oCx/WlscCDKSn5O9yw=="
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
  "id": "c65a0e6b-ebe7-44b3-af42-2a4b6df72c54",
  "rev": "1-fe2ebc812c80b4d73f50ed017154a65f",
  "created": 1682493625934,
  "modified": 1682493625933,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "healthcareElementId": "c65a0e6b-ebe7-44b3-af42-2a4b6df72c54",
  "valueDate": 20230426072025,
  "openingDate": 20230426072025,
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
    "encryptedSelf": "DI76+QwzMvwung3HrpCW6d7dBMv0JbJq5pxP42rMa5EFHsoI91+VW8xJl+APoLIC"
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-healthcare-elements/deletedHealthcareElement.txt -->
<details>
<summary>deletedHealthcareElement</summary>

```text
2-5e7b328c28b7634bcffcfb00f301c64e
```
</details>
