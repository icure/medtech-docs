---
slug: user
tags:
    - data model
    - user
---
# User

A User represents an actor that can log in to the iCure platform and instantiate the MedTech API. It can be associated 
to a Healthcare Professional, to a Patient, or to a Device.  
A Healthcare Professional can create and invite a new User, as well as modifying or deactivating an existing one.
A [Data Owner](/sdks/glossary#data-owner) without a User cannot access the iCure Platform.

## When to Use a User?

You should use a User when you want to allow a Healthcare Professional, a Patient, or a Device to access the iCure 
platform.

## How a User is Related to Other Entities?

A User can log in and instantiate the MedTech API.
A Healthcare Professional can create and invite a User.
A User can be associated to a Healthcare Professional, a Patient, or a Medical Device.

## Examples

### A User Logging In

A Patients wants to log in to iCure to use its functionalities. To do so, it uses their User credentials to instantiate
the MedTech API.

<!-- file://code-samples/explanation/patient-creates-data-sample/index.mts snippet:patient logs in-->
```typescript
const api = await medTechApi()
    .withICureBasePath(host)
    .withUserName(patientUserName)
    .withPassword(patientPassword)
    .withCrypto(webcrypto as any)
    .build()

const user = await api.userApi.getLoggedUser()
await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
    user.patientId,
    hex2ua(patientPrivKey)
);
```

### A Doctor Inviting a Patient

A Doctor (Healthcare Professional) visits for the first time a Patient. After the visit, it invites them to the iCure
platform.

<!-- file://code-samples/explanation/doctor-invites-a-patient/index.mts snippet:doctor invites user-->
```typescript
const messageFactory = new ICureRegistrationEmail(
    hcp,
    "test",
    "iCure",
    existingPatient
)
const createdUser = await api.userApi.createAndInviteUser(existingPatient, messageFactory);
expect(createdUser.patientId).to.eq(createdUser.id); // skip
```


