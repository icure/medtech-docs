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

When a Data Owner wants to define the medical information of other entities, such as Data Samples or Healthcare Elements, 
using  standards that are widely used in the medical field rather than in natural language.

## Examples

### A Doctor Registering a Diagnosis

A User of the application (Patient) wants to add some symptoms she is experiencing (headache) by adding a new Data Sample.
Then, she adds the information that her period started as a Healthcare Element associated to the Data Sample. 
Instead of using the natural language description for both, the application allow the patient
to select the proper Coding to use the SNOMED CT terms instead.

:::note

We assume that you have already read the [How to register a user](/sdks/how-to/register-a-user) and [How to login as a user](/sdks/how-to/login-as-a-user) guides and that the SNOMED-CT codes are already present in the database.

:::

```typescript
const promise = "HERE I WILL PUT THE CODE EXAMPLE, I SWEAR";
```

