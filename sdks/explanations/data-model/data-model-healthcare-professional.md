---
slug: healthcare-professional
tags:
    - data model
    - data owner
    - healthcare professional
---
# Healthcare Professional

A Healthcare Professional is an actor that can manage and is responsible for Patients, Medical Devices and other 
Healthcare Professionals.  
As a [Data Owner](/sdks/glossary#data-owner) they can create medical information and share them with other Data Owners.
Other Data Owner can decide to share their medical information with them.

## When to Use a Healthcare Professional?

You should use a Healthcare Professional when you need to represent a Doctor, or another actor responsible for patients,
medical data and treatments, in your application.

## How a Healthcare Professional is Related to Other Entities?

A Healthcare Professional can create Users for other Patients, Medical Devices, and Healthcare Professionals.  
A Healthcare Professional can manage other Users, by changing their passwords or deactivating them.  
A Healthcare Professional can create Data Samples and Healthcare Elements for Patients.  
A Healthcare Professional can share Data Samples and Healthcare Elements with other Data Owners.  
A Healthcare Professional can create Notifications and can update the ones shared with them.

## Examples

### A Doctor Inviting a Patient

A Doctor (Healthcare Professional) visits for the first time a Patient. After the visit, it invites them to the iCure
platform.

```typescript
const promise = "I WILL DO IT";
```

### A Doctor Registering a Visit and Sharing the Outcome with the Patient

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new Data Sample.  
Then, they add the diagnosis (hay fever) as associated Healthcare Element.
After that, the doctor and shares the data with them.

```typescript
```

### A Doctor Updating the Status of a Patient

A Doctor (Healthcare Professional) discovers that their Patient is pregnant. Therefore, it updates her condition in the
application.

```typescript
const promise = "SAME AS HEALTHCARE ELEMENT";
```