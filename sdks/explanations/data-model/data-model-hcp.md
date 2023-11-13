---
slug: healthcare-professional
tags:
    - data model
    - data owner
    - {{hcp}}
---
# Healthcare Professional

A Healthcare Professional is an actor that can manage and is responsible for Patients, Medical Devices and other 
Healthcare Professionals.  
As [Data Owners](/{{sdk}}/glossary#data-owner) they can create medical information and share it with other Data Owners.
Other Data Owner can decide to share their medical information with them.

## When Should I Use a Healthcare Professional?

You should use a Healthcare Professional when you need to represent a Doctor, or another actor responsible for patients,
medical data, and treatments, in your application.

## How is a Healthcare Professional Related to Other Entities?

A Healthcare Professional can:
- create Users for other Patients, Medical Devices, and Healthcare Professionals.  
- manage other Users, by changing their passwords or deactivating them.  
- create {{Services}} and {{HealthcareElements}} for Patients.  
- share {{Services}} and {{HealthcareElements}} with other Data Owners.  
- create Notifications and  update the ones shared with them.

## Examples

### A Doctor Inviting a Patient

A Doctor (Healthcare Professional) visits for the first time a Patient. After the visit, they invite the patient
to the iCure platform.

<!-- file://code-samples/{{sdk}}/explanation/doctor-invites-a-patient/index.mts snippet:doctor invites user-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/doctor-invites-a-patient/createdUser.txt -->
<details>
<summary>createdUser</summary>

```json
```
</details>

### A Doctor Registering a Visit and Sharing the Outcome with the Patient

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new {{Service}}.  
Then, they add the diagnosis (hay fever) as associated Healthcare Element.

<!-- file://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/index.mts snippet:doctor shares medical data-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
```
</details>

After that, the Doctor checks if there are new Notifications from the Patient and shares the data with them.

<!-- file://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/index.mts snippet:doctor receives notification-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/newPatientNotifications.txt -->
<details>
<summary>newPatientNotifications</summary>

```text
```
</details>

### A Doctor Updating the Status of a Patient

A Doctor (Healthcare Professional) discovers that their Patient is pregnant. Therefore, they update her condition in the
application.

<!-- file://code-samples/{{sdk}}/explanation/doctor-creates-he/index.mts snippet:doctor can create HE-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/doctor-creates-he/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
```
</details>
