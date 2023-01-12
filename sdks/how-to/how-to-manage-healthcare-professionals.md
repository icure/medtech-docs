---
slug: how-to-manage-healthcare-professionals
description: Learn how to manage healthcare professionals
tags:
- HealthcareProfessional
---
# Handling healthcare professionals

[Healthcare professionals](../glossary.md#Data owner) are either doctors, nurses, physiotherapists, etc. They are the 
people who are going to use the medical device to take care of patients.

Healthcare professionals can also in certain cases be a healthcare organization.

The healthcareProfessionalApi allows you to manage [Healthcare professionals](../references/classes/HealthcareProfessional.md).

## Create a healthcare professional

You first need to instantiate a [Healthcare professional](../references/classes/HealthcareProfessional.md) object.
Pass the `healthcareProfessional` to the createHealthcareProfessional method of the healthcareProfessionalApi to create it in the database.

<!-- file://code-samples/how-to/manage-healthcare-professionals/index.mts snippet:Create a healthcare professional-->
```typescript
import { User } from '@icure/medical-device-sdk'

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

## Load a healthcare professional by id

The getHealthcareProfessional method of the healthcareProfessionalApi allows you to load a [Healthcare professional](../references/classes/HealthcareProfessional.md) by id.

<!-- file://code-samples/how-to/manage-healthcare-professionals/index.mts snippet:Load a healthcare professional by id-->
```typescript
const loadedHcp = await api.healthcareProfessionalApi.getHealthcareProfessional(createdHcp.id)
```

## Filter healthcare professionals

You can build complex queries and use them to retrieve [Healthcare professionals](../references/classes/HealthcareProfessional.md) using the filterHealthcareProfessionals method of the healthcareProfessionalApi.

You can build filters by hand or use the DSL provided by the HealthcareProfessionalFilter class.

<!-- file://code-samples/how-to/manage-healthcare-professionals/index.mts snippet:Filter healthcare professionals-->
```typescript
const hcps = await api.healthcareProfessionalApi.filterHealthcareProfessionalBy(
  await new HealthcareProfessionalFilter()
    .byLabelCodeFilter(undefined, undefined, 'practitioner-specialty', healthcareProfessionalCode)
    .build(),
)
```


## Delete a healthcare professional

The deleteHealthcareProfessional method of the healthcareProfessionalApi allows you to delete a [Healthcare professional](../references/classes/HealthcareProfessional.md) by id.

<!-- file://code-samples/how-to/manage-healthcare-professionals/index.mts snippet:Delete a healthcare professional-->
```typescript
await api.healthcareProfessionalApi.deleteHealthcareProfessional(createdHcp.id)
```
