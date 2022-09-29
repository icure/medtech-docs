---
slug: coding
tags:
    - coding
    - code
    - data model
---

# Coding

A Coding represents a code of a [Terminology](http://localhost:3000/sdks/glossary#terminologies) (such as SNOMED CT or LOINC).  
A Coding is uniquely identified by its type (the Terminology it belongs to, eg. SNOMED CT), its code (the unique code in the 
Terminology, eg. 84229001), and its version (the version in the Terminology, eg. 2021031).

## When to Use a Coding?

You should use a Coding when a Data Owner wants to define the medical information of other entities, such as Data 
Samples or Healthcare Elements, using standards that are widely used in the medical field rather than in natural language.

## How a Coding is Related to Other Entities?

A Coding can be added to Healthcare Elements and Data Samples.

:::note

To add a Coding to a Healthcare Element or a Data Sample, you just need to add its CodingReference, that contains the 
type, code, and version of the coding.

:::

## Examples

### A Doctor Registering a Diagnosis

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new Data Sample.  
Then, they add the diagnosis (hay fever) as associated Healthcare Element.
Instead of using the natural language description for both, the application allows the Doctor to select the proper 
SNOMED CT terms using Codings.

```typescript
const promise = "HERE I WILL PUT THE CODE EXAMPLE, I SWEAR";
```

