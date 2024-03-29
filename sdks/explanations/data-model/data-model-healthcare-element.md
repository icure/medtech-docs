---
slug: healthcare-element
tags:
    - data model
    - {{healthcareElement}}
---
# {{HealthcareElement}}

A {{HealthcareElement}} is a piece of medical information that can give some context about the status of a Patient or to a
series of measurements. 

## When Should I Use a {{HealthcareElement}}?

You should use a {{HealthcareElement}} when a [Data Owner](/{{sdk}}/glossary#data-owner) wants to specify an underlying 
condition related to a Patient, to a visit or to a set of measurements associated to a Patient.

## How is a {{HealthcareElement}} Related to Other Entities?

A {{HealthcareElement}}:
- may be associated to one or more {{Services}} to give a context to their measurements.  
- may use Codings to associate its medical information to the codes of a [Terminology](/{{sdk}}/glossary#terminologies).

## Examples

### A Patient Registering Their Symptoms

A Patient has a period tracking app and wants to register that her period started and that she is experiencing a headache.
She will create a {{HealthcareElement}} to register that her period started, then she will create a {{Service}} associated to the {{HealthcareElement}} to register the headache.

<!-- file://code-samples/{{sdk}}/explanation/patient-creates-data-sample/index.mts snippet:patient can create DS and HE-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/patient-creates-data-sample/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/explanation/patient-creates-data-sample/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
```
</details>

### A Doctor Updating the Status of a Patient

A Doctor ({{Hcp}}) discovers that their Patient is pregnant. Therefore, they update her condition.

<!-- file://code-samples/{{sdk}}/explanation/doctor-creates-he/index.mts snippet:doctor can create HE-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/doctor-creates-he/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
```
</details>
