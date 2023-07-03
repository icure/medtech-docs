---
slug: how-to-manage-healthcare-professionals
description: Learn how to manage healthcare professionals
tags:
- HealthcareProfessional
---
# Handling healthcare professionals

[Healthcare professionals](/sdks/glossary#data-owner) are doctors, nurses, physiotherapists, etc. They are the 
people who are going to use the medical device to take care of patients.  
Healthcare professionals can also in certain cases be a healthcare organizations.  
The healthcareProfessionalApi allows you to manage [Healthcare professionals](../references/classes/HealthcareProfessional.md).

## Create a healthcare professional

You first need to instantiate a [Healthcare professional](../references/classes/HealthcareProfessional.md) object.
Pass the `healthcareProfessional` to the createHealthcareProfessional method of the healthcareProfessionalApi to create it in the database.

<!-- file://code-samples/how-to/manage-healthcare-professionals/index.mts snippet:Create a healthcare professional-->
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

<!-- output://code-samples/how-to/manage-healthcare-professionals/createdHcp.txt -->
<details>
<summary>createdHcp</summary>

```json
{
  "id": "07bda9b6-b70b-4c08-9841-f0d8aa15208c",
  "languages": [],
  "rev": "1-9b135fd45393e8e5a3d3b63bcbfab447",
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
    "aesExchangeKeys": {},
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "transferKeys": {},
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

## Load a healthcare professional by id

The getHealthcareProfessional method of the healthcareProfessionalApi allows you to load a [Healthcare professional](../references/classes/HealthcareProfessional.md) by id.

<!-- file://code-samples/how-to/manage-healthcare-professionals/index.mts snippet:Load a healthcare professional by id-->
```typescript
const loadedHcp = await api.healthcareProfessionalApi.getHealthcareProfessional(createdHcp.id)
```

<!-- output://code-samples/how-to/manage-healthcare-professionals/loadedHcp.txt -->
<details>
<summary>loadedHcp</summary>

```json
{
  "id": "07bda9b6-b70b-4c08-9841-f0d8aa15208c",
  "languages": [],
  "rev": "1-9b135fd45393e8e5a3d3b63bcbfab447",
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
    "aesExchangeKeys": {},
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "transferKeys": {},
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

## Filter healthcare professionals

You can build complex queries and use them to retrieve [Healthcare professionals](../references/classes/HealthcareProfessional.md) using the filterHealthcareProfessionals method of the healthcareProfessionalApi.

You can build filters by hand or use the DSL provided by the HealthcareProfessionalFilter class.

<!-- file://code-samples/how-to/manage-healthcare-professionals/index.mts snippet:Filter healthcare professionals-->
```typescript
const hcps = await api.healthcareProfessionalApi.filterHealthcareProfessionalBy(
  await new HealthcareProfessionalFilter(api)
    .byLabelCodeFilter(undefined, undefined, 'practitioner-specialty', healthcareProfessionalCode)
    .build(),
)
```

<!-- output://code-samples/how-to/manage-healthcare-professionals/hcps.txt -->
<details>
<summary>hcps</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 441,
  "rows": [
    {
      "id": "07bda9b6-b70b-4c08-9841-f0d8aa15208c",
      "languages": [],
      "rev": "1-9b135fd45393e8e5a3d3b63bcbfab447",
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
        "aesExchangeKeys": {},
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "transferKeys": {},
        "publicKeysForOaepWithSha256": {}
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

## Delete a healthcare professional

The deleteHealthcareProfessional method of the healthcareProfessionalApi allows you to delete a [Healthcare professional](../references/classes/HealthcareProfessional.md) by id.

<!-- file://code-samples/how-to/manage-healthcare-professionals/index.mts snippet:Delete a healthcare professional-->
```typescript
const deletedHcp = await api.healthcareProfessionalApi.deleteHealthcareProfessional(createdHcp.id)
```

<!-- output://code-samples/how-to/manage-healthcare-professionals/deletedHcp.txt -->
<details>
<summary>deletedHcp</summary>

```text
3-a2c6eb49f60a29190496bec0ea27c306
```
</details>
