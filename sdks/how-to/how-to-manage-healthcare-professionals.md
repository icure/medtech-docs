---
slug: how-to-manage-healthcare-professionals
description: Learn how to manage {{hcps}}
tags:
- HealthcareProfessional
---
# Handling {{hcps}}

[{{Hcps}}](/{{sdk}}/glossary#data-owner) are doctors, nurses, physiotherapists, etc. They are the 
people who are going to use the medical device to take care of patients.  
{{Hcps}} can also in certain cases be a healthcare organizations.  
The healthcareProfessionalApi allows you to manage [{{Hcps}}](../references/classes/HealthcareProfessional.md).

## Create a {{hcp}}

You first need to instantiate a [{{Hcp}}](../references/classes/HealthcareProfessional.md) object.
Pass the `healthcareProfessional` to the createHealthcareProfessional method of the healthcareProfessionalApi to create it in the database.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/index.mts snippet:Create a {{hcp}}-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/createdHcp.txt -->
<details>
<summary>createdHcp</summary>

```json
```
</details>

## Load a {{hcp}} by id

The getHealthcareProfessional method of the healthcareProfessionalApi allows you to load a [{{Hcp}}](../references/classes/HealthcareProfessional.md) by id.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/index.mts snippet:Load a {{hcp}} by id-->
```typescript
const loadedHcp = await api.healthcareProfessionalApi.getHealthcareProfessional(createdHcp.id)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/loadedHcp.txt -->
<details>
<summary>loadedHcp</summary>

```json
```
</details>

## Filter {{hcps}}

You can build complex queries and use them to retrieve [{{Hcps}}](../references/classes/HealthcareProfessional.md) using the filterHealthcareProfessionals method of the healthcareProfessionalApi.

You can build filters by hand or use the DSL provided by the HealthcareProfessionalFilter class.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/index.mts snippet:Filter {{hcps}}-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/hcps.txt -->
<details>
<summary>hcps</summary>

```json
```
</details>

## Delete a {{hcp}}

The deleteHealthcareProfessional method of the healthcareProfessionalApi allows you to delete a [{{Hcp}}](../references/classes/HealthcareProfessional.md) by id.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/index.mts snippet:Delete a {{hcp}}-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/deletedHcp.txt -->
<details>
<summary>deletedHcp</summary>

```text
```
</details>
