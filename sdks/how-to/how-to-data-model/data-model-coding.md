---
slug: coding
tags:
    - coding
    - code
    - data model
---

# Coding

A Coding represents a code of a terminology (such as SNOMED CT or LOINC).  
The purpose of this entity is to add medical information to other entities, such as Data Samples or Healthcare Elements,
using standards that are widely used in the medical field.  

## Example 

A doctor wants to update the status of one of their patients. After a visit, they create a new Data Sample to register 
the symptom the patient is experiencing (congestion). Then, they want to link a Healthcare Element to the Data Sample to
put the symptom in the context of a diagnosis (hay fever).  
Instead of using the natural language description for both the symptom and the diagnosis, the doctor uses a Coding to
put the SNOMED CT terms instead.

```typescript
const promise = "HERE I WILL PUT THE CODE EXAMPLE, I SWEAR";
```

