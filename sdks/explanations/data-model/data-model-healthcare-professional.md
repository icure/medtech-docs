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

### A Doctor Registering a Visit and Sharing the Outcome with the Patient

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new Data Sample.  
Then, they add the diagnosis (hay fever) as associated Healthcare Element.

<!-- file://code-samples/explanation/doctor-shares-data-with-patient/index.mts snippet:doctor shares medical data-->
```typescript
const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
    new HealthcareElement({
        description: 'My diagnosis is that the patient has Hay Fever',
        codes: new Set([
            new CodingReference({
                id: 'SNOMEDCT|21719001|20020131',
                type: 'SNOMEDCT',
                code: '21719001',
                version: '20020131'
            })
        ])
    }),
    patient.id
)
const dataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
    patient.id,
    new DataSample({
        content: { 'en': new Content({
                stringValue: 'The patient has fatigue'
            })},
        codes: new Set([
            new CodingReference({
                id: 'SNOMEDCT|84229001|20020131',
                type: 'SNOMEDCT',
                code: '84229001',
                version: '20020131'
            })
        ]),
        healthcareElementIds: new Set([healthcareElement.id])
    })
)
```

After that, the Doctor checks if there are new Notifications from the Patient and shares the data with them.

<!-- file://code-samples/explanation/doctor-shares-data-with-patient/index.mts snippet:doctor receives notification-->
```typescript
const newNotifications = await api.notificationApi.getPendingNotifications();
const newPatientNotifications = newNotifications.filter( notification => notification.type === NotificationTypeEnum.OTHER && notification.responsible === patientUser.patientId);

if (!!newPatientNotifications && newPatientNotifications.length > 0) {
    await api.healthcareElementApi.giveAccessTo(healthcareElement, patient.id)
    await api.dataSampleApi.giveAccessTo(dataSample, patient.id)
    await api.notificationApi.updateNotificationStatus(newPatientNotifications[0], "completed")
}
```

### A Doctor Updating the Status of a Patient

A Doctor (Healthcare Professional) discovers that their Patient is pregnant. Therefore, it updates her condition in the
application.

<!-- file://code-samples/explanation/doctor-creates-he/index.mts snippet:doctor can create HE-->
```typescript
const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
    new HealthcareElement({
        description: 'The patient is pregnant',
        codes: new Set([
            new CodingReference({
                id: 'SNOMEDCT|77386006|20020131',
                type: 'SNOMEDCT',
                code: '77386006',
                version: '20020131'
            })
        ]),
        openingDate: new Date().getTime()
    }),
    patient.id
)
```




