---
slug: coding
tags:
    - coding
    - code
    - data model
---

# Coding

A Coding represents a code of a [Terminology](/{{sdk}}/glossary#terminologies) (such as SNOMED CT or LOINC).  
A Coding is uniquely identified by:
- **Type**: the Terminology it belongs to (e.g. SNOMED CT)
- **Code**: the unique code in the Terminology (e.g. 84229001)
- **Version**: the version of the Terminology (e.g. 20220901)

## When Should I Use a Coding?

You should use a Coding when a Data Owner wants to define the medical information of other entities, such as Data 
Samples or {{HealthcareElements}}, using standards that are widely used in the medical field rather than in natural language.

## How is a Coding Related to Other Entities?

You can add a Coding to {{HealthcareElements}} and {{Services}}.

:::note

To add a Coding to a Healthcare Element or a {{Service}}, you just need to add its CodingReference, that contains the 
type, code, and version of the coding.

:::

## Examples

### A Doctor Registering a Diagnosis

After a visit, a Doctor register the symptoms the Patient is experiencing ([fatigue](https://snomedbrowser.com/Codes/Details/84229001)) as a new {{Service}}.  
Then, they add the diagnosis ([hay fever](https://snomedbrowser.com/Codes/Details/21719001)) as associated {{HealthcareElement}}.
Instead of using the natural language description for both, the application allows the Doctor to select the proper 
SNOMED CT terms using Codings.

<!-- file://code-samples/{{sdk}}/explanation/data-sample-w-coding/index.mts snippet:doctor can create DS and HE-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/data-sample-w-coding/healthcareElement.txt -->
<details>
<summary>{{healthcareElementNoSpace}}</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/explanation/data-sample-w-coding/dataSample.txt -->
<details>
<summary>{{dataSampleNoSpace}}</summary>

```json
```
</details>
