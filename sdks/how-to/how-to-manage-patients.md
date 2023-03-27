---
slug: how-to-manage-patients
description: Learn how to manage patients
tags:
- Patient
---

# Handling patients

In this section, we will learn how to manage patients. [Patient](/sdks/references/classes/Patient) is a class that represents a patient in the system. It contains all the information about the patient.

## How to create a patient&#8239;?

To create a patient, we can use the `createOrModifyPatient` method on the `PatientApi` object. This method takes one parameter: the Patient object.

<!-- file://code-samples/how-to/patients/index.mts snippet:create a patient-->
```typescript
const createdPatient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Hubert',
    lastName: 'Farnsworth',
    dateOfBirth: 28410409,
    birthSex: 'male',
    gender: 'male',
    profession: 'CEO/Owner of Planet Express, Lecturer at Mars University',
    names: [
      new PersonName({
        firstNames: ['Hubert', 'J'],
        lastName: 'Farnsworth',
        use: 'official',
      }),
      new PersonName({
        firstNames: ['Professor'],
        use: 'nickname',
      }),
    ],
    nationality: 'American',
  }),
)
```

<!-- output://code-samples/how-to/patients/createdPatient.txt -->
<details>
<summary>createdPatient</summary>

```json
{
  "id": "2ede7bc3-0d5c-43a2-8ebf-9582eb738201",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-c0950cac9d68cfe2b7bb4579db48466a",
  "created": 1679929572654,
  "modified": 1679929572654,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "firstName": "Hubert",
  "lastName": "Farnsworth",
  "dateOfBirth": 28410409,
  "profession": "CEO/Owner of Planet Express, Lecturer at Mars University",
  "nationality": "American",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "Hubert",
        "J"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Farnsworth",
      "use": "official"
    },
    {
      "firstNames": [
        "Professor"
      ],
      "prefix": [],
      "suffix": [],
      "use": "nickname"
    }
  ],
  "addresses": [],
  "gender": "male",
  "birthSex": "male",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {},
    "transferKeys": {},
    "encryptedSelf": "bn2dmoqPNq7VndwlRHCO2UZTM+NxMFPS9wiDJOlP+fg=",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>

## How to update a patient&#8239;?

To update a patient, we can use the `createOrModifyPatient` method on the `PatientApi` object. This method takes one parameter: the Patient object.

<!-- file://code-samples/how-to/patients/index.mts snippet:update a patient-->
```typescript
const updatedPatient = await api.patientApi.createOrModifyPatient(
  new Patient({
    ...createdPatient,
    // highlight-start
    modified: undefined,
    note: 'Good news everyone!',
    // highlight-end
  }),
)
```

<!-- output://code-samples/how-to/patients/updatedPatient.txt -->
<details>
<summary>updatedPatient</summary>

```json
{
  "id": "2ede7bc3-0d5c-43a2-8ebf-9582eb738201",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "2-ac99e07c82fd6fa68b52d3647e8e2246",
  "created": 1679929572654,
  "modified": 1679929572710,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "firstName": "Hubert",
  "lastName": "Farnsworth",
  "dateOfBirth": 28410409,
  "profession": "CEO/Owner of Planet Express, Lecturer at Mars University",
  "note": "Good news everyone!",
  "nationality": "American",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "Hubert",
        "J"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Farnsworth",
      "use": "official"
    },
    {
      "firstNames": [
        "Professor"
      ],
      "prefix": [],
      "suffix": [],
      "use": "nickname"
    }
  ],
  "addresses": [],
  "gender": "male",
  "birthSex": "male",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {},
    "transferKeys": {},
    "encryptedSelf": "2zjG9XnKuDxNSN4pYmyKO+7PXpeqMh7Pj0GW06+FTpE7PseyYLZZZ6IAuoED7SXQ",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>


## How to get a patient&#8239;?

To get a patient, we can use the `getPatient` method on the `PatientApi` object. This method takes one parameter: the patient id.

<!-- file://code-samples/how-to/patients/index.mts snippet:get a patient-->
```typescript
const patient = await api.patientApi.getPatient(updatedPatient.id!)
```

<!-- output://code-samples/how-to/patients/patient.txt -->
<details>
<summary>patient</summary>

```json
{
  "id": "2ede7bc3-0d5c-43a2-8ebf-9582eb738201",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "2-ac99e07c82fd6fa68b52d3647e8e2246",
  "created": 1679929572654,
  "modified": 1679929572710,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "firstName": "Hubert",
  "lastName": "Farnsworth",
  "dateOfBirth": 28410409,
  "profession": "CEO/Owner of Planet Express, Lecturer at Mars University",
  "note": "Good news everyone!",
  "nationality": "American",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "Hubert",
        "J"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Farnsworth",
      "use": "official"
    },
    {
      "firstNames": [
        "Professor"
      ],
      "prefix": [],
      "suffix": [],
      "use": "nickname"
    }
  ],
  "addresses": [],
  "gender": "male",
  "birthSex": "male",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {},
    "transferKeys": {},
    "encryptedSelf": "2zjG9XnKuDxNSN4pYmyKO+7PXpeqMh7Pj0GW06+FTpE7PseyYLZZZ6IAuoED7SXQ",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>


## How to delete a patient&#8239;?

To delete a patient, we can use the `deletePatient` method on the `PatientApi` object. This method takes one parameter: the patient id.

<!-- file://code-samples/how-to/patients/index.mts snippet:delete a patient-->
```typescript
const deletedPatientId = await api.patientApi.deletePatient(patient.id!)
```

<!-- output://code-samples/how-to/patients/deletedPatientId.txt -->
<details>
<summary>deletedPatientId</summary>

```text
2ede7bc3-0d5c-43a2-8ebf-9582eb738201
```
</details>

## How to filter patients&#8239;?

To filter patients, we can use the `filterPatients` method on the `PatientApi` object. This method takes one parameter: the filter.

<!-- file://code-samples/how-to/patients/index.mts snippet:get a list of patient-->
```typescript
const filter = await new PatientFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)

  .dateOfBirthBetween(28000101, 29000101)
  .build()

const patients = await api.patientApi.filterPatients(filter)
```

<!-- output://code-samples/how-to/patients/patients.txt -->
<details>
<summary>patients</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 1,
  "rows": [
    {
      "id": "2ede7bc3-0d5c-43a2-8ebf-9582eb738201",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "2-ac99e07c82fd6fa68b52d3647e8e2246",
      "created": 1679929572654,
      "modified": 1679929572710,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Hubert",
      "lastName": "Farnsworth",
      "dateOfBirth": 28410409,
      "profession": "CEO/Owner of Planet Express, Lecturer at Mars University",
      "nationality": "American",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Hubert",
            "J"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Farnsworth",
          "use": "official"
        },
        {
          "firstNames": [
            "Professor"
          ],
          "prefix": [],
          "suffix": [],
          "use": "nickname"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "male",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "2zjG9XnKuDxNSN4pYmyKO+7PXpeqMh7Pj0GW06+FTpE7PseyYLZZZ6IAuoED7SXQ",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>



### Filter builder

To create a filter, we can use the [`PatientFilter`](/sdks/references/classes/PatientFilter#methods-1) builder methods. This builder allows us to create complex filter object.

In the example above, we created the filter this way:

<!-- file://code-samples/how-to/patients/index.mts snippet:filter builder-->
```typescript
const patientFilter = new PatientFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)

  .dateOfBirthBetween(28000101, 29000101)
  .build()
```

<!-- output://code-samples/how-to/patients/patientFilter.txt -->
<details>
<summary>patientFilter</summary>

```json
{}
```
</details>


The resulting filter object will create a filter that allows us to get all `Patient` that satisfy all the following requirements:

- The `Patient` is owned by the logged user healthcare party
- The `Patient` gender is `male`
- The `Patient` is born between January 1st 2800 and January 1st 2900

## How to get a list of Patient ids&#8239;?

In some circumstances, you might want to get a list of `Patient` ids instead of the `Patient` entities themselves. To do so, you can use the `matchPatients` method on the `PatientApi`. This method takes one parameter: the filter object.

<!-- file://code-samples/how-to/patients/index.mts snippet:get a list of patient ids-->
```typescript
const filterForMatch = await new PatientFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)

  .dateOfBirthBetween(28000101, 29000101)
  .build()

const patientIds = await api.patientApi.matchPatients(filterForMatch)
```

<!-- output://code-samples/how-to/patients/patientIds.txt -->
<details>
<summary>patientIds</summary>

```text
[
  "2ede7bc3-0d5c-43a2-8ebf-9582eb738201"
]
```
</details>


## How to get and modify your information as a patient

If you are building a "patient application", where patients can join by invitation from an HCP you may incur in a 
problem with the decryption of the data of the `Patient` entity for the user of the application. 

This is because when the HCP invites the patient to the application he can't share any existing data with him until the
patient logs in for the first time and creates a public key. Therefore, the patient will not be able to decrypt any 
data, including his administrative information stored on the patient entity, and for this reason methods like 
`getPatient` will fail.

However, you can still access and modify any unencrypted data using the methods `getPatientAndTryDecrypt` and 
`modifyPotentiallyEncryptedPatient` of the `PatientApi`. The method `getPatientAndTryDecrypt` returns a 
`PotentiallyEncryptedPatient`, which is either a normal `Patient` if the encrypted data could be decrypted, or an 
`EncryptedPatient` if only the unencrypted data is available. The method `modifyEncryptedPatient` instead takes in 
input an `EncryptedPatient` and allows you to modify any non-encrypted field of the `Patient` entity.

You can see an example on how to use these methods in the tutorial [Inviting an existing patient to become a user](/sdks/how-to/how-to-invite-existing-patient-as-a-user).
