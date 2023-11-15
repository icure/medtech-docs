---
slug: service
tags:
    - data model
    - {{service}}
---
# {{Service}}

A {{Service}} represents a piece of medical information related to a Patient provided by a [Data Owner](/{{sdk}}/glossary#data-owner) 
at a defined moment of time.  
According to the Data Owner that created it, a {{Service}} can contain either biometric measurements or other type of 
unstructured medical data, or both.  

## When Should I Use a {{Service}}?

You should use a {{Service}} when a Data Owner wants to register some kind of objective or subjective medical data 
related to a Patient.

## How is a {{Service}} Related to Other Entities?

A {{Service}}:
- Is always associated to a Patient.
- May be linked to one or more {{HealthcareElements}}, in order to provide a context for its measure.
- May have a Coding, which associates the medical information or the measurement to the code of a
[Terminology](/{{sdk}}/glossary#terminologies).

## Examples

### A Patient Registering Their Symptoms

A Patient has a period tracking app and wants to add some symptoms she is experiencing (headache) by adding a new {{Service}}.
Then, she adds the information that her period started as a {{HealthcareElement}} associated to the {{Service}}.

<!-- file://code-samples/{{sdk}}/explanation/patient-creates-data-sample/index.mts snippet:patient can create DS and HE-->
```typescript
```

### A Doctor Registering a Visit

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new {{Service}}.  
Then, they add the diagnosis (hay fever) as associated {{HealthcareElement}}.

<!-- file://code-samples/{{sdk}}/explanation/data-sample-w-coding/index.mts snippet:doctor can create DS and HE-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/data-sample-w-coding/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/explanation/data-sample-w-coding/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
```
</details>
