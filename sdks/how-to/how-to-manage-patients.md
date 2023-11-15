---
slug: how-to-manage-patients
description: Learn how to manage patients
tags:
- Patient
---

# Handling patients

In this section, we will learn how to manage patients. [Patient](/{{sdk}}/references/classes/Patient) is a class that represents a patient in the system. It contains all the information about the patient.

## How to create a patient&#8239;?

To create a patient, we can use the `createOrModify` method on the `PatientApi` object. This method takes one parameter: the Patient object.

<!-- file://code-samples/{{sdk}}/how-to/patients/index.mts snippet:create a patient-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/patients/createdPatient.txt -->
<details>
<summary>createdPatient</summary>

```json
```
</details>

## How to update a patient&#8239;?

To update a patient, we can use the `createOrModify` method on the `PatientApi` object. This method takes one parameter: the Patient object.

<!-- file://code-samples/{{sdk}}/how-to/patients/index.mts snippet:update a patient-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/patients/updatedPatient.txt -->
<details>
<summary>updatedPatient</summary>

```json
```
</details>


## How to get a patient&#8239;?

To get a patient, we can use the `get` method on the `PatientApi` object. This method takes one parameter: the patient id.

<!-- file://code-samples/{{sdk}}/how-to/patients/index.mts snippet:get a patient-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/patients/patient.txt -->
<details>
<summary>patient</summary>

```json
```
</details>


## How to delete a patient&#8239;?

To delete a patient, we can use the `delete` method on the `PatientApi` object. This method takes one parameter: the patient id.

<!-- file://code-samples/{{sdk}}/how-to/patients/index.mts snippet:delete a patient-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/patients/deletedPatientId.txt -->
<details>
<summary>deletedPatientId</summary>

```text
```
</details>

## How to filter patients&#8239;?

To filter patients, we can use the `filterBy` method on the `PatientApi` object. This method takes one parameter: the filter.

<!-- file://code-samples/{{sdk}}/how-to/patients/index.mts snippet:get a list of patient-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/patients/patients.txt -->
<details>
<summary>patients</summary>

```json
```
</details>



### Filter builder

To create a filter, we can use the [`PatientFilter`](/{{sdk}}/references/filters/PatientFilter#methods-1) builder methods. This builder allows us to create complex filter object.

In the example above, we created the filter this way:

<!-- file://code-samples/{{sdk}}/how-to/patients/index.mts snippet:filter builder-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/patients/patientFilter.txt -->
<details>
<summary>patientFilter</summary>

```json
{}
```
</details>


The resulting filter object will create a filter that allows us to get all `Patient` that satisfy all the following requirements:

- The `Patient` can be accessed by the logged user healthcare party
- The `Patient` gender is `male`
- The `Patient` is born between January 1st 2800 and January 1st 2900

## How to get a list of Patient ids&#8239;?

In some circumstances, you might want to get a list of `Patient` ids instead of the `Patient` entities themselves. To do so, you can use the `matchBy` method on the `PatientApi`. This method takes one parameter: the filter object.

<!-- file://code-samples/{{sdk}}/how-to/patients/index.mts snippet:get a list of patient ids-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/patients/patientIds.txt -->
<details>
<summary>patientIds</summary>

```text
```
</details>


## How to get and modify your information as a patient

If you are building a "patient application", where patients can join by invitation from an {{Hcp}} you may incur in a 
problem with the decryption of the data of the `Patient` entity for the user of the application. 

This is because when the {{Hcp}} invites the patient to the application he can't share any existing data with him until the
patient logs in for the first time and creates a public key. Therefore, the patient will not be able to decrypt any 
data, including his administrative information stored on the patient entity, and for this reason methods like 
`getPatient` will fail.

However, you can still access and modify any unencrypted data using the methods `getAndTryDecrypt` and 
`modifyPotentiallyEncryptedPatient` of the `PatientApi`. The method `getPatientAndTryDecrypt` returns a 
`PotentiallyEncryptedPatient`, which is either a normal `Patient` if the encrypted data could be decrypted, or an 
`EncryptedPatient` if only the unencrypted data is available. The method `modifyEncryptedPatient` instead takes in 
input an `EncryptedPatient` and allows you to modify any non-encrypted field of the `Patient` entity.

You can see an example on how to use these methods in the tutorial [Inviting an existing patient to become a user](/{{sdk}}/how-to/how-to-invite-existing-patient-as-a-user).
