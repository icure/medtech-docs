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

you can learn more about these methods, their parameter and their return type in the [reference](/{{sdk}}/references/apis/PatientApi).
As for now, let us focus on the `filter` parameter.

## The Filter DSL

### Simple Queries

You can instantiate a filter for the Patient entity using the `Filter` builder class.

:::note

There is a filter class for each entity, the full list is available below

:::

The Filter exposes some methods that let you define a query to filter your entity.  
In the following example we will get all the Patients that a Healthcare Professional can access.

<!-- file://code-samples/{{sdk}}/how-to/use-complex-search-criteria/index.mts snippet:filter patients for hcp-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/use-complex-search-criteria/patientsForHcpFilter.txt -->
<details>
<summary>patientsForHcpFilter</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/use-complex-search-criteria/patientsForHcp.txt -->
<details>
<summary>patientsForHcp</summary>

```json
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

<!-- file://code-samples/{{sdk}}/how-to/use-complex-search-criteria/index.mts snippet:filter patients with implicit intersection filter-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/use-complex-search-criteria/ageGenderFilter.txt -->
<details>
<summary>ageGenderFilter</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/use-complex-search-criteria/ageGenderPatients.txt -->
<details>
<summary>ageGenderPatients</summary>

```json
```
</details>

In this case, the method will return all the patients that the hcp with id `healthcarePartyId` can access, bborn between the
11th of December 1951 and the 3rd of February 1952, and whose gender is `female`.

### Sorting Filters

When defining a filter with more than one condition, you can also set one of them as the sorting key of the final result:

<!-- file://code-samples/{{sdk}}/how-to/use-complex-search-criteria/index.mts snippet:filter patients with implicit intersection filter with sorting-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/use-complex-search-criteria/ageGenderSortedFilter.txt -->
<details>
<summary>ageGenderSortedFilter</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/use-complex-search-criteria/ageGenderSortedPatients.txt -->
<details>
<summary>ageGenderSortedPatients</summary>

```json
```
</details>

In this case, the method will return all the patients that the hcp with id `healthcarePartyId` can access, born between the
11th of December 1939 and the 3rd of February 1952, and whose gender is `female`. The result will be sorted by date of 
birth in ascending order. If you don't specify the sorting key the data may still be ordered according to some field, but we do not guarantee that this will be a consistent behaviour. 

:::info

In complex situations sorted filters may be less efficient than unsorted filters. You should not request sorting unless you really need sorted data. 

:::

### Combining Filters

If you have more than one filter for the same entity, you can create a new filter that will return the intersection of their results
using the `intersection()` static method of the `FilterComposition` class:

<!-- file://code-samples/{{sdk}}/how-to/use-complex-search-criteria/index.mts snippet:filter patients with explicit intersection filter-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/use-complex-search-criteria/ageGenderExplicitPatients.txt -->
<details>
<summary>ageGenderExplicitPatients</summary>

```json
```
</details>

:::note

This is equivalent to specify all the conditions in a single filter, as shown in the previous section.

:::

Similarly, you can create a new filter that will return the union of more filters for the same entity using the 
`union()` static method of the `FilterComposition` class:

<!-- file://code-samples/{{sdk}}/how-to/use-complex-search-criteria/index.mts snippet:filter patients with union filter-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/use-complex-search-criteria/filterFemaleOrIndeterminate.txt -->
<details>
<summary>filterFemaleOrIndeterminate</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/use-complex-search-criteria/unionFilterPatients.txt -->
<details>
<summary>unionFilterPatients</summary>

```json
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

### {{Service}}

* `forDataOwner(dataOwnerId: string)`: all the {{Services}} that the Data Owner passed as parameter can access.
* `forSelf()`: all the {{Services}} that the logged-in Data Owner.
* `byIds(byIds: string[])`: all the {{Services}} corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the {{Services}} that have the identifier passed as parameter.
* `byLabelCodeDateFilter(tagType?: string, tagCode?: string, codeType?: string, codeCode?: string, startValueDate?: number, endValueDate?: number, descending: boolean?)`: all the {{Services}} that matches one of his labels or codes, or created in the provided date interval.
* `forPatients(crypto: IccCryptoXApi, patients: Patient[])`: all the {{Services}} related to a certain Patient.
* `byHealthElementIds(byHealthElementIds: string[])`: all the {{Services}} that have the Healthcare Element specified as parameter.

### Healthcare Element

* `forDataOwner(dataOwnerId: string)`: all the {{HealthcareElements}} that the Data Owner passed as parameter can access. 
* `forSelf()`: all the {{Services}} that the logged-in Data Owner.
* `byIds(byIds: string[])`: all the {{HealthcareElements}} corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the {{HealthcareElements}} that have the identifier passed as parameter.
* `byLabelCodeFilter(tagType?: string, tagCode?: string, codeType?: string, codeCode?: string)`: all the {{HealthcareElements}} that matches one of his labels or codes.
* `forPatients(crypto: IccCryptoXApi, patients: Patient[])`: all the {{HealthcareElements}} related to a certain Patient.

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
* `forSelf()`: all the {{Services}} that the logged-in Data Owner.
* `byIds(byIds: string[])`: all the Notifications corresponding to the ids passed as parameter.
* `withType(type: NotificationTypeEnum)`: all the Notifications that are of the type passed as parameter.
* `afterDate(fromDate: number)`: all the Notifications created after the timestamp passed as parameter.

### Patient

* `forDataOwner(dataOwnerId: string)`: all the Patients that the Data Owner passed as parameter can access.
* `forSelf()`: all the {{Services}} that the logged-in Data Owner.
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
