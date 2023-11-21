---
slug: user
tags:
    - data model
    - user
---
# User

A User represents an actor that can log in to the iCure platform and instantiate the MedTech API. It can be associated 
to a {{Hcp}}, to a Patient, or to a Device.  
A {{Hcp}} can create and invite a new User, as well as modifying or deactivating an existing one.
A [Data Owner](/{{sdk}}/glossary#data-owner) without a User cannot access the iCure Platform.

## When Should I Use a User?

You should use a User when you want to allow a {{Hcp}}, a Patient, or a Device to access the iCure 
platform.

## How is a User Related to Other Entities?

A User can log in and instantiate the MedTech API.
A {{Hcp}} can create and invite a User.
A User can be associated to a {{Hcp}}, a Patient, or a Medical Device.

## Examples

### A User Logging In

A Patients wants to log in to iCure to use its functionalities. To do so, they use their User credentials to instantiate
the {{CodeSdkName}} API.

<!-- file://code-samples/{{sdk}}/explanation/patient-creates-data-sample/index.mts snippet:patient logs in-->
```typescript
```

### A Doctor Inviting a Patient

A Doctor ({{Hcp}}) visits for the first time a Patient. After the visit, they invite the patient 
to the iCure platform.

<!-- file://code-samples/{{sdk}}/explanation/doctor-invites-a-patient/index.mts snippet:doctor invites user-->
```typescript
```
