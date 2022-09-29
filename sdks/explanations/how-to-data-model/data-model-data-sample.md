---
slug: data-sample
tags:
    - data model
    - data sample
---
# Data Sample

A Data Sample represents a piece of medical information related to a Patient provided by a Data Owner at a defined
moment of time.  
According to the Data Owner that created it, a Data Sample can contain either biometric measurements or other type of 
unstructured medical data, or both.  

## When to Use a Data Sample?

You should use a Data Sample when a Data Owner wants to register some kind of objective or subjective medical data 
related to a Patient.

## How a Data Sample is Related to Other Entities?

A Data Sample can be linked to a Healthcare Element, that can provide a context for its measure.  
A Coding can be used in a Data Sample to classify its content.  
A Data Sample is always associated to a Patient.  

## Examples

### A Medical Device Registering Data

A smartwatch (Medical Device) is connected to the application and registers the heart rate of the Patient during period.
Each minute, it measures the value and stores it as a new Data Sample.

```typescript
const promise = "HERE I WILL PUT THE CODE EXAMPLE, I SWEAR";
```

### A Patient Registering Their Symptoms

A User of the application (Patient) wants to add some symptoms she is experiencing (headache) by adding a new Data Sample.
Then, she adds the information that her period started as a Healthcare Element associated to the Data Sample.
```typescript
const promise = "I THINK THIS OVERLAPS WITH CODING";
```

### A Doctor Registering a Visit

A Gynaecologist (Healthcare Professional) wants to update the status of one of their patients. After a visit, they 
create a new Data Sample to register the outcome of the visit in the application.
```typescript
const promise = "HERE I WILL PUT THE CODE EXAMPLE, I SWEAR";
```