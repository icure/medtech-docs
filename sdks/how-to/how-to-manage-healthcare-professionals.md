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
const healthcareProfessional: HealthcareProfessional = new HealthcareProfessional({
  firstName: 'John',
  lastName: 'Keats',
  speciality: 'Psychiatrist',
  codes: new Set([
    new CodingReference({ type: 'practitioner-specialty', code: healthcareProfessionalCode }),
  ]),
  addresses: [
    new Address({
      telecoms: [
        new Telecom({
          telecomType: 'email',
          telecomNumber: `jk@hospital.care`,
        }),
      ],
    }),
  ],
})

const createdHcp = await api.healthcareProfessionalApi.createOrModifyHealthcareProfessional(
  healthcareProfessional,
)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/createdHcp.txt -->
<details>
<summary>createdHcp</summary>

```json
{
  "id": "885de220-ed2d-45eb-af8c-70dde427b679",
  "languages": [],
  "rev": "1-51f36dc600b3a7814e1fc33ea19b9bda",
  "name": "Keats John",
  "lastName": "Keats",
  "firstName": "John",
  "speciality": "Psychiatrist",
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "John"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Keats",
      "text": "Keats John",
      "use": "official"
    }
  ],
  "addresses": [
    {
      "telecoms": [
        {
          "telecomNumber": "jk@hospital.care",
          "telecomType": "email"
        }
      ]
    }
  ],
  "properties": {},
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {},
    "transferKeys": {}
  }
}
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
{
  "id": "885de220-ed2d-45eb-af8c-70dde427b679",
  "languages": [],
  "rev": "1-51f36dc600b3a7814e1fc33ea19b9bda",
  "name": "Keats John",
  "lastName": "Keats",
  "firstName": "John",
  "speciality": "Psychiatrist",
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "John"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Keats",
      "text": "Keats John",
      "use": "official"
    }
  ],
  "addresses": [
    {
      "telecoms": [
        {
          "telecomNumber": "jk@hospital.care",
          "telecomType": "email"
        }
      ]
    }
  ],
  "properties": {},
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {},
    "transferKeys": {}
  }
}
```
</details>

## Filter {{hcps}}

You can build complex queries and use them to retrieve [{{Hcps}}](../references/classes/HealthcareProfessional.md) using the filterHealthcareProfessionals method of the healthcareProfessionalApi.

You can build filters by hand or use the DSL provided by the HealthcareProfessionalFilter class.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/index.mts snippet:Filter {{hcps}}-->
```typescript
const hcps = await api.healthcareProfessionalApi.filterHealthcareProfessionalBy(
  await new HealthcareProfessionalFilter(api)
    .byLabelCodeFilter(undefined, undefined, 'practitioner-specialty', healthcareProfessionalCode)
    .build(),
)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/hcps.txt -->
<details>
<summary>hcps</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 250,
  "rows": [
    {
      "id": "885de220-ed2d-45eb-af8c-70dde427b679",
      "languages": [],
      "rev": "1-51f36dc600b3a7814e1fc33ea19b9bda",
      "name": "Keats John",
      "lastName": "Keats",
      "firstName": "John",
      "speciality": "Psychiatrist",
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Keats",
          "text": "Keats John",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "telecoms": [
            {
              "telecomNumber": "jk@hospital.care",
              "telecomType": "email"
            }
          ]
        }
      ],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {}
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

## Delete a {{hcp}}

The deleteHealthcareProfessional method of the healthcareProfessionalApi allows you to delete a [{{Hcp}}](../references/classes/HealthcareProfessional.md) by id.

<!-- file://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/index.mts snippet:Delete a {{hcp}}-->
```typescript
const deletedHcp = await api.healthcareProfessionalApi.deleteHealthcareProfessional(createdHcp.id)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-healthcare-professionals/deletedHcp.txt -->
<details>
<summary>deletedHcp</summary>

```text
3-ced7d11ed93a65d8d1d32f12358ce9fe
```
</details>
