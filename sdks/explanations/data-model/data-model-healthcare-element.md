---
slug: healthcare-element
tags:
    - data model
    - healthcare element
---
# Healthcare Element

A Healthcare Element is a piece of medical information that can give some context about the status of a Patient or to a
series of measurements. 

## When to Use a Healthcare Element?

You should use a Healthcare Element when a [Data Owner](/sdks/glossary#data-owner) wants to specify an underlying 
condition related to a Patient, to a visit or to a set of measurements associated to a Patient.

## How a Healthcare Element is Related to Other Entities?

The medical information contained in the Healthcare Element can be specified using a standard terminology, such as 
SNOMED CT, by means of a Coding.  
A Healthcare Element can be associated to one or more Data Samples to give a context to their measurements.  
A Healthcare Element can use a Coding to associate its medical information to the codes of a [Terminology](http://localhost:3000/sdks/glossary#terminologies).

## Examples

### A Patient Registering Their Symptoms

A Patient has a period tracking app and wants to add some symptoms she is experiencing (headache) by adding a new Data Sample.
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

### A Doctor Updating the Status of a Patient

A Doctor (Healthcare Professional) discovers that their Patient is pregnant. Therefore, it updates her condition.

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









