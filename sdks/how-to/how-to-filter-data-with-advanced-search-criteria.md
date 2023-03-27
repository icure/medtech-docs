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
filterPatients(filter: Filter<Patient>, nextPatientId?: string, limit?: number): Promise<PaginatedListPatient>
matchPatients(filter: Filter<Patient>): Promise<Array<string>>
```

you can learn more about these methods, their parameter and their return type in the [reference](../references/interfaces/PatientApi.md).
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
const patientsForHcpFilter = await new PatientFilter().forDataOwner(healthcarePartyId).build()
const patientsForHcp = await api.patientApi.filterPatients(patientsForHcpFilter)
```

### Intersection Queries

You can define more complex queries by adding more parameters. The results will be the set of entities which satisfy
all the constraints at the same time.

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients with implicit intersection filter-->
```typescript
const ageGenderImplicitFilter = await new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .ofAge(42)
  .byGenderEducationProfession('female')
  .build()

const ageGenderImplicitPatients = await api.patientApi.filterPatients(ageGenderImplicitFilter)
```

In this case, the method will return all the patients that the hcp with id `hcpId` can access, whose age is `42`, and whose gender is `female`.
You can also explicitly intersect simple filters using the `intersection()` method:

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients with explicit intersection filter-->
```typescript
const filterByAge = new PatientFilter().forDataOwner(user.healthcarePartyId!).ofAge(42)

const filterByGenderAndAge = await new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('female')
  .intersection([filterByAge])
  .build()

const ageGenderExplicitPatients = await api.patientApi.filterPatients(filterByGenderAndAge)
```

:::note

The Data Owner Id is a mandatory parameter in filtering patients. Therefore, it must be added to all the filters of the intersection.

:::

### Union Queries

To apply a filter that returns entities which satisfy at least one of multiple criteria, you can use the `union()` function.

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients with union filter-->
```typescript
const filterFemales = new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('female')

const filterFemaleOrIndeterminate = await new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('indeterminate')
  .union([filterFemales])
  .build()

const unionFilterPatients = await api.patientApi.filterPatients(filterFemaleOrIndeterminate)
```

In this case, the method will return all the patients that the hcp with id `hcpId` can access and whose gender is `indeterminate` or
whose gender is `female`.

## Base Query Methods

In the following list, you will find all the simple queries for each type of entity filter.

### Coding

* `byIds(byIds: string[])`: all the Codings corresponding to the ids passed as parameter.
* `byRegionLanguageTypeLabel(region?: string, language?: string, type?: string, label?: string)`: all the Codings that have the provided region, language, type, and label
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Data Sample

* `forDataOwner(dataOwnerId: string)`: all the Data Samples that the Data Owner passed as parameter can access. **Note:** this field must be specified in all the queries.
* `byIds(byIds: string[])`: all the Data Samples corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the Data Samples that have the identifier passed as parameter.
* `byLabelCodeFilter(tagType?: string, tagCode?: string, codeType?: string, codeCode?: string)`: all the Data Samples that matches one of his labels or codes.
* `forPatients(crypto: IccCryptoXApi, patients: Patient[])`: all the Data Samples related to a certain Patient.
* `byHealthElementIds(byHealthElementIds: string[])`: all the Data Samples that have the Healthcare Element specified as parameter.
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Healthcare Element

* `forDataOwner(dataOwnerId: string)`: all the Healthcare Elements that the Data Owner passed as parameter can access. **Note:** this field must be specified in all the queries.
* `byIds(byIds: string[])`: all the Healthcare Elements corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the Healthcare Elements that have the identifier passed as parameter.
* `byLabelCodeFilter(tagType?: string, tagCode?: string, codeType?: string, codeCode?: string)`: all the Healthcare Elements that matches one of his labels or codes.
* `forPatients(crypto: IccCryptoXApi, patients: Patient[])`: all the Healthcare Elements related to a certain Patient.
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Healthcare Professional

* `byIds(byIds: string[])`: all the Healthcare Professionals corresponding to the ids passed as parameter.
* `byLabelCodeFilter(labelType?: string, labelCode?: string, codeType?: string, codeCode?: string)`: all the Healthcare Professionals whose label or code matches the one passed as parameter.
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Medical Device

* `byIds(byIds: string[])`: all the Medical Devices corresponding to the ids passed as parameter.
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Notification

* `forDataOwner(dataOwnerId: string)`: all the Notifications that the Data Owner passed as parameter can access. **Note:** this field must be specified in all the queries.
* `byIds(byIds: string[])`: all the Notifications corresponding to the ids passed as parameter.
* `withType(type: NotificationTypeEnum)`: all the Notifications that are of the type passed as parameter.
* `afterDate(fromDate: number)`: all the Notifications created after the timestamp passed as parameter
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Patient

* `forDataOwner(dataOwnerId: string)`: all the Patients that the Data Owner passed as parameter can access. **Note:** this field must be specified in all the queries.
* `byIds(byIds: string[])`: all the Patients corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the Patients that have the identifier passed as parameter.
* `byGenderEducationProfession(gender: PatientGenderEnum, education?: string, profession?: string)`: all the Patients that matches the gender, the education, or the profession passed as parameters.
* `withSsins(withSsins: string[])`: all the Patients corresponding to the SSIN numbers passed as parameters.
* `ofAge(age: number)`: all the Patients of the age passed as parameter.
* `dateOfBirthBetween(from: number, to: number)` all the Patients whose birthdate is between the ones passed as parameters.
* `containsFuzzy(searchString: string)`:
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### User

* `byIds(byIds: string[])`: all the Users corresponding to the ids passed as parameter.
* `byPatientId(patientId: string)`: the User that has the patient id passed as parameter.
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.
