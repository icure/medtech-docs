---
slug: how-to-filter-data-with-advanced-search-criteria
description: Learn how to filter data using advanced search criteria
tags:
- Filter
- Entities
---

# How to Filter Data Using Advanced Search Criteria

All the services in the iCure MedTech SDK offer the `filter` and the `match` methods. They allow you to use complex search
criteria to get entities and id of entities, respectively.  
We can take as example the two method defined in the `PatientAPI`:

```typescript
function filterPatients(filter: Filter<Patient>, nextPatientId?: string, limit?: number): Promise<PaginatedListPatient> { /*...*/ }
function matchPatients(filter: Filter<Patient>): Promise<Array<string>> { /*...*/ }
```

you can learn more about these methods, their parameter and their return type in the [reference](/sdks/references/apis/PatientApi).
As for now, let us focus on the `filter` parameter.

## The Filter DSL

### Simple Queries

You can instantiate a filter for the Patient entity using the `Filter` builder class.

:::note

There is a filter class for each entity, the full list is available below

:::

The Filter exposes some methods that let you define a query to filter your entity.  
In the following example we will get all the Patients that a Healthcare Professional can access.

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients for hcp-->
```typescript
const patientsForHcpFilter = await new PatientFilter(api).forDataOwner(healthcarePartyId).build()
const patientsForHcp = await api.patientApi.filterPatients(patientsForHcpFilter)
```
<!-- output://code-samples/how-to/use-complex-search-criteria/patientsForHcpFilter.txt -->
<details>
<summary>patientsForHcpFilter</summary>

```json
{
  "healthcarePartyId": "7793239c-c682-4b41-9790-d2a4a0177fd7",
  "$type": "PatientByHealthcarePartyFilter"
}
```
</details>

<!-- output://code-samples/how-to/use-complex-search-criteria/patientsForHcp.txt -->
<details>
<summary>patientsForHcp</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 3,
  "rows": [
    {
      "id": "12b750cf-73be-405d-bd5c-ec31358a6057",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-4413c9ee5c2ea6270ea3771af06b2cab",
      "created": 1688378976351,
      "modified": 1688378976351,
      "author": "5c74f585-2d56-495a-81c4-d87be4130c1a",
      "responsible": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19520101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "aesExchangeKeys": {},
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "transferKeys": {},
        "encryptedSelf": "X5RBnLefDkaWvz7MQiCDbOyfOPN2xWyE3YbXOj1xsYw=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "encryptionKeys": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "publicKeysForOaepWithSha256": {}
      }
    },
    {
      "id": "1e0f4040-45b4-428d-ae1f-dcc2ae735ed5",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-2a30ae1c0365b9be461be1a295849b10",
      "created": 1688378976364,
      "modified": 1688378976364,
      "author": "5c74f585-2d56-495a-81c4-d87be4130c1a",
      "responsible": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19520101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "aesExchangeKeys": {},
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "transferKeys": {},
        "encryptedSelf": "1MW/XlI1vfLQ6BS3fWnPzFUmBPYX5L121LGkzZZr4AU=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "encryptionKeys": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "publicKeysForOaepWithSha256": {}
      }
    },
    {
      "id": "c1aa3cf3-9a7d-4d50-ab1e-2514eff52240",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-5d557ae60c0a812804dd4ea8d8ba69c0",
      "created": 1688378976377,
      "modified": 1688378976377,
      "author": "5c74f585-2d56-495a-81c4-d87be4130c1a",
      "responsible": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "dateOfBirth": 19420101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "aesExchangeKeys": {},
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "transferKeys": {},
        "encryptedSelf": "W9LjeXv4auBiqiPMVyVcwwXYnJtzlxQd7pGMemWcu0Q=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "encryptionKeys": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "publicKeysForOaepWithSha256": {}
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

:::info

Some filters require you to specify a Data Owner in order to filter the results. You can either use the `forDataOwner()` 
method, passing as parameter the id of the Data Owner you want filter the entities for, or the `forSelf()` method that 
will filter the entities for the current logged-in user.

:::

:::caution

You must have access to an entity in order to retrieve it by any means, filtering included.

:::

### Specifying More Conditions

You can define more complex queries by adding more parameters. The results will be the set of entities which satisfy
all the constraints at the same time.

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients with implicit intersection filter-->
```typescript
const ageGenderFilter = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId!)
  .dateOfBirthBetween(19511211, 19520203)
  .byGenderEducationProfession('female')
  .build()

const ageGenderPatients = await api.patientApi.filterPatients(ageGenderFilter)
```
<!-- output://code-samples/how-to/use-complex-search-criteria/ageGenderFilter.txt -->
<details>
<summary>ageGenderFilter</summary>

```json
{
  "filters": [
    {
      "healthcarePartyId": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "minDateOfBirth": 19511211,
      "maxDateOfBirth": 19520203,
      "$type": "PatientByHealthcarePartyDateOfBirthBetweenFilter"
    },
    {
      "healthcarePartyId": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "gender": "female",
      "$type": "PatientByHealthcarePartyGenderEducationProfessionFilter"
    }
  ],
  "$type": "IntersectionFilter"
}
```
</details>

<!-- output://code-samples/how-to/use-complex-search-criteria/ageGenderPatients.txt -->
<details>
<summary>ageGenderPatients</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 1,
  "rows": [
    {
      "id": "1e0f4040-45b4-428d-ae1f-dcc2ae735ed5",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-2a30ae1c0365b9be461be1a295849b10",
      "created": 1688378976364,
      "modified": 1688378976364,
      "author": "5c74f585-2d56-495a-81c4-d87be4130c1a",
      "responsible": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19520101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "aesExchangeKeys": {},
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "transferKeys": {},
        "encryptedSelf": "1MW/XlI1vfLQ6BS3fWnPzFUmBPYX5L121LGkzZZr4AU=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "encryptionKeys": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "publicKeysForOaepWithSha256": {}
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

In this case, the method will return all the patients that the hcp with id `healthcarePartyId` can access, bborn between the
11th of December 1951 and the 3rd of February 1952, and whose gender is `female`.

### Sorting Filters

When defining a filter with more than one condition, you can also set one of them as the sorting key of the final result:

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients with implicit intersection filter with sorting-->
```typescript
const ageGenderSortedFilter = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId!)
  .sort.dateOfBirthBetween(19391211, 19520203)
  .byGenderEducationProfession('female')
  .build()

const ageGenderSortedPatients = await api.patientApi.filterPatients(ageGenderFilter)
```

<!-- output://code-samples/how-to/use-complex-search-criteria/ageGenderSortedFilter.txt -->
<details>
<summary>ageGenderSortedFilter</summary>

```json
{
  "filters": [
    {
      "healthcarePartyId": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "minDateOfBirth": 19391211,
      "maxDateOfBirth": 19520203,
      "$type": "PatientByHealthcarePartyDateOfBirthBetweenFilter"
    },
    {
      "healthcarePartyId": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "gender": "female",
      "$type": "PatientByHealthcarePartyGenderEducationProfessionFilter"
    }
  ],
  "$type": "IntersectionFilter"
}
```
</details>

<!-- output://code-samples/how-to/use-complex-search-criteria/ageGenderSortedPatients.txt -->
<details>
<summary>ageGenderSortedPatients</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 1,
  "rows": [
    {
      "id": "1e0f4040-45b4-428d-ae1f-dcc2ae735ed5",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-2a30ae1c0365b9be461be1a295849b10",
      "created": 1688378976364,
      "modified": 1688378976364,
      "author": "5c74f585-2d56-495a-81c4-d87be4130c1a",
      "responsible": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19520101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "aesExchangeKeys": {},
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "transferKeys": {},
        "encryptedSelf": "1MW/XlI1vfLQ6BS3fWnPzFUmBPYX5L121LGkzZZr4AU=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "encryptionKeys": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "publicKeysForOaepWithSha256": {}
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

In this case, the method will return all the patients that the hcp with id `healthcarePartyId` can access, born between the
11th of December 1939 and the 3rd of February 1952, and whose gender is `female`. The result will be sorted by date of 
birth in ascending order. If you don't specify the sorting key the data may still be ordered according to some field, but we do not guarantee that this will be a consistent behaviour. 

::: info

In complex situations sorted filters may be less efficient than unsorted filters. You should not request sorting unless you really need sorted data. 

:::

### Combining Filters

If you have more than one filter for the same entity, you can create a new filter that will return the intersection of their results
using the `intersection()` static method of the `FilterComposition` class:

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients with explicit intersection filter-->
```typescript
const filterByAge = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId!)
  .dateOfBirthBetween(19511211, 19520203)
  .build()

const filterByGender = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('female')
  .build()

const filterByGenderAndAge = FilterComposition.intersection(filterByAge, filterByGender)

const ageGenderExplicitPatients = await api.patientApi.filterPatients(filterByGenderAndAge)
```
<!-- output://code-samples/how-to/use-complex-search-criteria/ageGenderExplicitPatients.txt -->
<details>
<summary>ageGenderExplicitPatients</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 1,
  "rows": [
    {
      "id": "1e0f4040-45b4-428d-ae1f-dcc2ae735ed5",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-2a30ae1c0365b9be461be1a295849b10",
      "created": 1688378976364,
      "modified": 1688378976364,
      "author": "5c74f585-2d56-495a-81c4-d87be4130c1a",
      "responsible": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19520101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "aesExchangeKeys": {},
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "transferKeys": {},
        "encryptedSelf": "1MW/XlI1vfLQ6BS3fWnPzFUmBPYX5L121LGkzZZr4AU=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "encryptionKeys": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "publicKeysForOaepWithSha256": {}
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

Similarly, you can create a new filter that will return the union of more filters for the same entity using the 
`union()` static method of the `FilterComposition` class:

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients with union filter-->
```typescript
const filterFemales = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('female')
  .build()

const filterIndeterminate = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('indeterminate')
  .build()

const filterFemaleOrIndeterminate = FilterComposition.union(filterFemales, filterIndeterminate)

const unionFilterPatients = await api.patientApi.filterPatients(filterFemaleOrIndeterminate)
```
<!-- output://code-samples/how-to/use-complex-search-criteria/filterFemaleOrIndeterminate.txt -->
<details>
<summary>filterFemaleOrIndeterminate</summary>

```json
{
  "filters": [
    {
      "healthcarePartyId": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "gender": "female",
      "$type": "PatientByHealthcarePartyGenderEducationProfessionFilter"
    },
    {
      "healthcarePartyId": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "gender": "indeterminate",
      "$type": "PatientByHealthcarePartyGenderEducationProfessionFilter"
    }
  ],
  "$type": "UnionFilter"
}
```
</details>

<!-- output://code-samples/how-to/use-complex-search-criteria/unionFilterPatients.txt -->
<details>
<summary>unionFilterPatients</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 2,
  "rows": [
    {
      "id": "1e0f4040-45b4-428d-ae1f-dcc2ae735ed5",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-2a30ae1c0365b9be461be1a295849b10",
      "created": 1688378976364,
      "modified": 1688378976364,
      "author": "5c74f585-2d56-495a-81c4-d87be4130c1a",
      "responsible": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19520101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "aesExchangeKeys": {},
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "transferKeys": {},
        "encryptedSelf": "1MW/XlI1vfLQ6BS3fWnPzFUmBPYX5L121LGkzZZr4AU=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "encryptionKeys": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "publicKeysForOaepWithSha256": {}
      }
    },
    {
      "id": "c1aa3cf3-9a7d-4d50-ab1e-2514eff52240",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-5d557ae60c0a812804dd4ea8d8ba69c0",
      "created": 1688378976377,
      "modified": 1688378976377,
      "author": "5c74f585-2d56-495a-81c4-d87be4130c1a",
      "responsible": "7793239c-c682-4b41-9790-d2a4a0177fd7",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "dateOfBirth": 19420101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "aesExchangeKeys": {},
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "transferKeys": {},
        "encryptedSelf": "W9LjeXv4auBiqiPMVyVcwwXYnJtzlxQd7pGMemWcu0Q=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "encryptionKeys": {
          "7793239c-c682-4b41-9790-d2a4a0177fd7": {}
        },
        "publicKeysForOaepWithSha256": {}
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

In this case, the method will return all the patients that the hcp with id `hcpId` can access and whose gender is `indeterminate` or
whose gender is `female`.

:::caution

The sorting order of the results of a composition of filter created using one of those two methods is never guaranteed,
even if one of the filter you used was sorted.

:::

## Base Query Methods

In the following list, you will find all the simple queries for each type of entity filter.

### Coding

* `byIds(byIds: string[])`: all the Codings corresponding to the ids passed as parameter.
* `byRegionLanguageTypeLabel(region?: string, language?: string, type?: string, label?: string)`: all the Codings that have the provided region, language, type, and label

:::info

If no condition is specified, the generated filter will return all the Coding in your database.

:::

### Data Sample

* `forDataOwner(dataOwnerId: string)`: all the Data Samples that the Data Owner passed as parameter can access.
* `forSelf()`: all the Data Samples that the logged-in Data Owner.
* `byIds(byIds: string[])`: all the Data Samples corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the Data Samples that have the identifier passed as parameter.
* `byLabelCodeDateFilter(tagType?: string, tagCode?: string, codeType?: string, codeCode?: string, startValueDate?: number, endValueDate?: number, descending: boolean?)`: all the Data Samples that matches one of his labels or codes, or created in the provided date interval.
* `forPatients(crypto: IccCryptoXApi, patients: Patient[])`: all the Data Samples related to a certain Patient.
* `byHealthElementIds(byHealthElementIds: string[])`: all the Data Samples that have the Healthcare Element specified as parameter.

### Healthcare Element

* `forDataOwner(dataOwnerId: string)`: all the Healthcare Elements that the Data Owner passed as parameter can access. 
* `forSelf()`: all the Data Samples that the logged-in Data Owner.
* `byIds(byIds: string[])`: all the Healthcare Elements corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the Healthcare Elements that have the identifier passed as parameter.
* `byLabelCodeFilter(tagType?: string, tagCode?: string, codeType?: string, codeCode?: string)`: all the Healthcare Elements that matches one of his labels or codes.
* `forPatients(crypto: IccCryptoXApi, patients: Patient[])`: all the Healthcare Elements related to a certain Patient.

### Healthcare Professional

* `byIds(byIds: string[])`: all the Healthcare Professionals corresponding to the ids passed as parameter.
* `byLabelCodeFilter(labelType?: string, labelCode?: string, codeType?: string, codeCode?: string)`: all the Healthcare Professionals whose label or code matches the one passed as parameter.

:::info

If no condition is specified, the generated filter will return all the Healthcare Professionals in your database.

:::

### Medical Device

* `byIds(byIds: string[])`: all the Medical Devices corresponding to the ids passed as parameter.

:::info

If no condition is specified, the generated filter will return all the Medical Devices in your database.

:::

### Notification

* `forDataOwner(dataOwnerId: string)`: all the Notifications that the Data Owner passed as parameter can access. **Note:** this field must be specified in all the queries.
* `forSelf()`: all the Data Samples that the logged-in Data Owner.
* `byIds(byIds: string[])`: all the Notifications corresponding to the ids passed as parameter.
* `withType(type: NotificationTypeEnum)`: all the Notifications that are of the type passed as parameter.
* `afterDate(fromDate: number)`: all the Notifications created after the timestamp passed as parameter.

### Patient

* `forDataOwner(dataOwnerId: string)`: all the Patients that the Data Owner passed as parameter can access.
* `forSelf()`: all the Data Samples that the logged-in Data Owner.
* `byIds(byIds: string[])`: all the Patients corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the Patients that have the identifier passed as parameter.
* `byGenderEducationProfession(gender: PatientGenderEnum, education?: string, profession?: string)`: all the Patients that matches the gender, the education, or the profession passed as parameters.
* `withSsins(withSsins: string[])`: all the Patients corresponding to the SSIN numbers passed as parameters.
* `ofAge(age: number)`: all the Patients of the age passed as parameter.
* `dateOfBirthBetween(from: number, to: number)` all the Patients whose birthdate is between the ones passed as parameters.
* `containsFuzzy(searchString: string)`: all the patients which first name, last name, maiden name or spouse name matches, even partially, the string passed as parameter.

### User

* `byIds(byIds: string[])`: all the Users corresponding to the ids passed as parameter.
* `byPatientId(patientId: string)`: the User that has the patient id passed as parameter.

:::info

If no condition is specified, the generated filter will return all the Users in your database.

:::
