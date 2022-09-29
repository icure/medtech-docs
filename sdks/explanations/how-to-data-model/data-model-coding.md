---
slug: coding
tags:
    - coding
    - code
    - data model
---

# Coding

A Coding represents a code of a terminology (such as SNOMED CT or LOINC).

## When to Use a Coding?

You should use a Coding when a Data Owner wants to define the medical information of other entities, such as Data 
Samples or Healthcare Elements, using standards that are widely used in the medical field rather than in natural language.

## Examples

### A Patient Registering Their Symptoms

A User of the application (Patient) wants to add some symptoms she is experiencing (headache) by adding a new Data Sample.
Then, she adds the information that her period started as a Healthcare Element associated to the Data Sample. 
Instead of using the natural language description for both, the application allows the patient to select the proper 
SNOMED CT terms using Codings.

```typescript
const promise = "HERE I WILL PUT THE CODE EXAMPLE, I SWEAR";
```

