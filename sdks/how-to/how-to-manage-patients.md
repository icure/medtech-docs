---
slug: how-to-manage-patients
description: Learn how to manage patients
tags:
- Patient
---

# Handling Patients

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

<details>
    <summary>Output</summary>

```json
{
	"id": "aff58060-8802-4f1a-91a6-e8bb9a343544",
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
	"languages": [],
	"addresses": [],
	"mergedIds": {},
	"active": true,
	"deactivationReason": "none",
	"partnerships": [],
	"patientHealthCareParties": [],
	"patientProfessions": [],
	"parameters": {},
	"properties": {},
	"rev": "1-26940e83585225c4a919e8dac2241e90",
	"created": 1664530613307,
	"modified": 1664530613307,
	"author": "b36fa6cb-d7a8-40f0-bcf6-af6ce0decb78",
	"responsible": "ab623d88-baed-40b9-91b7-ab26e9a08db5",
	"firstName": "Hubert",
	"lastName": "Farnsworth",
	"gender": "male",
	"birthSex": "male",
	"personalStatus": "unknown",
	"dateOfBirth": 28410409,
	"profession": "CEO/Owner of Planet Express, Lecturer at Mars University",
	"nationality": "American",
	"systemMetaData": {
		"hcPartyKeys": {},
		"privateKeyShamirPartitions": {},
		"secretForeignKeys": [],
		"cryptedForeignKeys": {},
		"delegations": {
			"ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
		},
		"encryptionKeys": {
			"ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
		},
		"aesExchangeKeys": {},
		"transferKeys": {}
	}
}
```

</details>

## How to update a patient&#8239;?

To update a patient, we can use the `createOrModifyPatient` method on the `PatientApi` object. This method takes one parameter: the Patient object.

<!-- file://code-samples/how-to/patients/index.mts snippet:update a patient-->
```typescript
const updatedPatient = await api.patientApi.createOrModifyPatient({
  ...createdPatient,
  // highlight-start
  modified: undefined,
  note: 'Good news everyone!',
  // highlight-end
})
```

<details>
    <summary>Output</summary>

```json
{
	"id": "aff58060-8802-4f1a-91a6-e8bb9a343544",
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
	"languages": [],
	"addresses": [],
	"mergedIds": {},
	"active": true,
	"deactivationReason": "none",
	"partnerships": [],
	"patientHealthCareParties": [],
	"patientProfessions": [],
	"parameters": {},
	"properties": {},
	"rev": "2-9da777d089dc3a159d76ab29fff2acd2",
	"created": 1664530613307,
	"modified": 1664530613678,
	"author": "b36fa6cb-d7a8-40f0-bcf6-af6ce0decb78",
	"responsible": "ab623d88-baed-40b9-91b7-ab26e9a08db5",
	"firstName": "Hubert",
	"lastName": "Farnsworth",
	"gender": "male",
	"birthSex": "male",
	"personalStatus": "unknown",
	"dateOfBirth": 28410409,
	"profession": "CEO/Owner of Planet Express, Lecturer at Mars University",
	"note": "Good news everyone!",
	"nationality": "American",
	"systemMetaData": {
		"hcPartyKeys": {},
		"privateKeyShamirPartitions": {},
		"secretForeignKeys": [],
		"cryptedForeignKeys": {},
		"delegations": {
			"ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
		},
		"encryptionKeys": {
			"ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
		},
		"aesExchangeKeys": {},
		"transferKeys": {}
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

<details>
    <summary>Output</summary>

```json
{
	"id": "aff58060-8802-4f1a-91a6-e8bb9a343544",
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
	"languages": [],
	"addresses": [],
	"mergedIds": {},
	"active": true,
	"deactivationReason": "none",
	"partnerships": [],
	"patientHealthCareParties": [],
	"patientProfessions": [],
	"parameters": {},
	"properties": {},
	"rev": "2-9da777d089dc3a159d76ab29fff2acd2",
	"created": 1664530613307,
	"modified": 1664530613678,
	"author": "b36fa6cb-d7a8-40f0-bcf6-af6ce0decb78",
	"responsible": "ab623d88-baed-40b9-91b7-ab26e9a08db5",
	"firstName": "Hubert",
	"lastName": "Farnsworth",
	"gender": "male",
	"birthSex": "male",
	"personalStatus": "unknown",
	"dateOfBirth": 28410409,
	"profession": "CEO/Owner of Planet Express, Lecturer at Mars University",
	"note": "Good news everyone!",
	"nationality": "American",
	"systemMetaData": {
		"hcPartyKeys": {},
		"privateKeyShamirPartitions": {},
		"secretForeignKeys": [],
		"cryptedForeignKeys": {},
		"delegations": {
			"ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
		},
		"encryptionKeys": {
			"ab623d88-baed-40b9-91b7-ab26e9a08db5": {}
		},
		"aesExchangeKeys": {},
		"transferKeys": {}
	}
}
```
</details>

## How to delete a patient&#8239;?

To delete a patient, we can use the `deletePatient` method on the `PatientApi` object. This method takes one parameter: the patient id.

<!-- file://code-samples/how-to/patients/index.mts snippet:delete a patient-->
```typescript
const deletedPatient = await api.patientApi.deletePatient(patient.id!)
```

<details>
    <summary>Output</summary>

```json
// TODO Add output
```
</details>

## How to filter patients&#8239;?

To filter patients, we can use the `filterPatients` method on the `PatientApi` object. This method takes one parameter: the filter.

<!-- file://code-samples/how-to/patients/index.mts snippet:get a list of patient-->
```typescript
const filter = await new PatientFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byGenderEducationProfession('male')
  .dateOfBirthBetween(28000101, 29000101)
  .build()

const patients = await api.patientApi.filterPatients(filter)
```

<details>
    <summary>Output</summary>

```json
```
</details>

### Filter builder

To create a filter, we can use the [`PatientFilter`](/sdks/references/classes/PatientFilter#methods-1) builder methods. This builder allows us to create complex filter object.

In the example above, we created the filter this way:

<!-- file://code-samples/how-to/patients/index.mts snippet:filter builder-->
```typescript
new PatientFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byGenderEducationProfession('male')
  .dateOfBirthBetween(28000101, 29000101)
  .build()
```

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
  .byGenderEducationProfession('male')
  .dateOfBirthBetween(28000101, 29000101)
  .build()

const patientIds = await api.patientApi.matchPatients(filterForMatch)
```

<details>
    <summary>Output</summary>

```json
["aff58060-8802-4f1a-91a6-e8bb9a343544"]
```
</details>
