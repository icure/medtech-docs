---
slug: data-sample
tags:
    - data model
    - data sample
---
# Data Sample

A Data Sample represents a piece of medical information related to a Patient provided by a [Data Owner](/sdks/glossary#data-owner) 
at a defined moment of time.  
According to the Data Owner that created it, a Data Sample can contain either biometric measurements or other type of 
unstructured medical data, or both.  

## When to Use a Data Sample?

You should use a Data Sample when a Data Owner wants to register some kind of objective or subjective medical data 
related to a Patient.

## How a Data Sample is Related to Other Entities?

A Data Sample can be linked to a Healthcare Element, that can provide a context for its measure.  
A Coding can be used in a Data Sample to associate the medical information or the measurement to the code of a
[Terminology](http://localhost:3000/sdks/glossary#terminologies)
A Data Sample is always associated to a Patient.  

## Examples

### A Patient Registering Their Symptoms

A Patient has a period tracking app and wants to add some symptoms she is experiencing (headache) by adding a new Data Sample.
Then, she adds the information that her period started as a Healthcare Element associated to the Data Sample.

<!-- file://code-samples/explanation/patient-creates-data-sample/index.mts snippet:patient can create DS and HE-->
```typescript
// const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
//     new HealthcareElement({
//         description: 'My period started'
//     }),
//     patient.id
// )
//
// await api.dataSampleApi.createOrModifyDataSampleFor(
//     patient.id,
//     new DataSample({
//         content: { 'en': new Content({
//                 stringValue: 'I have a headache'
//             })},
//         healthcareElementIds: new Set([healthcareElement.id])
//     })
// )
// ```

### A Doctor Registering a Visit

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new Data Sample.  
Then, they add the diagnosis (hay fever) as associated Healthcare Element.

<!-- file://code-samples/explanation/data-sample-w-coding/index.mts snippet:doctor can create DS and HE-->
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

await api.dataSampleApi.createOrModifyDataSampleFor(
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








