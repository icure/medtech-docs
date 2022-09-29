---
slug: patient
tags:
    - data model
    - data owner
    - patient
---
# Patient

A Patient is the subject of all the medical processes. They can be invited by Healthcare Professionals, who can also 
associate Data Samples and Healthcare Elements to them.
As a [Data Owner](/sdks/glossary#data-owner), a Patient can ask to access those data as well as creating Data Samples and
Healthcare Elements by themselves.

## When to Use a Patient?

You should use a Patient when you need to represent the recipient of the medical care in your application.

## How a Patient is Related to Other Entities?

A Healthcare Professional can create a Patient.  
A Patient can create Data Samples and Healthcare Elements.  
A Patient can ask to access a Data Sample or a Healthcare Element by creating a Notification to a Healthcare Professional.  

## Examples

### A Patient Registering Their Symptoms

A Patient wants to add some symptoms she is experiencing (headache) by adding a new Data Sample.
Then, she adds the information that her period started as a Healthcare Element associated to the Data Sample.

<!-- file://code-samples/explanation/patient-creates-data-sample/index.mts snippet:patient can create DS and HE-->
```typescript
const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
    new HealthcareElement({
        description: 'My period started'
    }),
    patient.id
)

await api.dataSampleApi.createOrModifyDataSampleFor(
    patient.id,
    new DataSample({
        content: { 'en': new Content({
                stringValue: 'I have a headache'
            })},
        healthcareElementIds: new Set([healthcareElement.id])
    })
)
```

### A Patient Asking a Doctor to Access Their Own Data

A Patient goes for a first visit to a Doctor. The Doctor registers them and, after the visit, the Patient creates a 
Notification to ask the Doctor to access the outcome of the visit.

<!-- file://code-samples/explanation/doctor-shares-data-with-patient/index.mts snippet:patient sends notification-->
```typescript
const accessNotification = await patientApi.notificationApi.createOrModifyNotification(
    new Notification({
        id: uuid(),
        status: "pending",
        author: patientUser.id,
        responsible: patientUser.patientId,
        type: NotificationTypeEnum.OTHER
    }),
    user.healthcarePartyId
);
```


