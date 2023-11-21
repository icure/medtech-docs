---
slug: how-to-manage-healthcare-professionals
description: Learn how to manage {{hcps}}
tags:
- {{HcpNoSpace}}
---
# Handling {{hcps}}

[{{Hcps}}](/{{sdk}}/glossary#data-owner) are doctors, nurses, physiotherapists, etc. They are the 
people who are going to use the medical device to take care of patients.  
{{Hcps}} can also in certain cases be a healthcare organizations.  
The healthcareProfessionalApi allows you to manage [{{Hcps}}](../references/classes/HealthcareProfessional.md).

## Create a {{hcp}}

You first need to instantiate a [{{Hcp}}](../references/classes/HealthcareProfessional.md) object.
Pass the `{{Hcp}}` to the `create` method of the `{{hcpNoSpace}}Api` to create it in the database.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/index.mts snippet:Create a healthcare professional-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/createdHcp.txt -->
<details>
<summary>createdHcp</summary>

```json
```
</details>

## Load a {{hcp}} by id

The `get` method of the `{{hcpNoSpace}}Api` allows you to load a [{{Hcp}}](../references/classes/HealthcareProfessional.md) by id.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/index.mts snippet:Load a healthcare professional by id-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/loadedHcp.txt -->
<details>
<summary>loadedHcp</summary>

```json
```
</details>

## Filter {{hcps}}

You can build complex queries and use them to retrieve [{{Hcps}}](../references/classes/HealthcareProfessional.md) using the `filterBy` method of the `{{hcpNoSpace}}Api`.

You can build filters by hand or use the DSL provided by the `{{HcpNoSpace}}Filter` class.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/index.mts snippet:Filter healthcare professionals-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/hcps.txt -->
<details>
<summary>hcps</summary>

```json
```
</details>

## Delete a {{hcp}}

The `delete` method of the `{{hcpNoSpace}}Api` allows you to delete a [{{Hcp}}](../references/classes/HealthcareProfessional.md) by id.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/index.mts snippet:Delete a healthcare professional-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/deletedHcp.txt -->
<details>
<summary>deletedHcp</summary>

```text
```
</details>
