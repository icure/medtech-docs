---
slug: patient
tags:
    - data model
    - data owner
    - patient
---
# Patient

A Patient is the subject of all the medical processes. They can register to iCure autonomously or be invited by {{Hcps}}.
{{Hcps}} can associate {{Services}} and {{HealthcareElements}} to Patients.
Additionally, as [Data Owners](/{{sdk}}/glossary#data-owner) Patients can also ask to access this data or create
{{Services}} and {{HealthcareElements}} by themselves.

## When Should I Use a Patient?

You should use a Patient when you need to represent the recipient of the medical care in your application.

## How is a Patient Related to Other Entities?

A {{Hcps} can create a Patient.  
A Patient can create {{Services}} and {{HealthcareElements}}.  
A Patient can ask to access a {{Service}} or a {{HealthcareElement}} by creating a Notification to a {{Hcp}}.  

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

### A Patient Asking a Doctor to Access Their Own Data

A Patient goes for a first visit to a Doctor. The Doctor registers them and, after the visit, the Patient creates a 
Notification to ask the Doctor to access the outcome of the visit.

<!-- file://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/index.mts snippet:patient sends notification-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/doctor-shares-data-with-patient/notification.txt -->
<details>
<summary>notification</summary>

```json
```
</details>
