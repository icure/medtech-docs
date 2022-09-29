---
slug: how-to-manage-users
description: Learn how to manage users
tags:
  - User
---

# How to manage users

## Creating a user

To create a user, you first need to create a [User](../references/classes/User.md) object and call the `createUser` method on the `UserService` object.

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Create a user-->
```typescript
import { User } from '@icure/medical-device-sdk'
import { ICureRegistrationEmail } from '@icure/medical-device-sdk'

const userToCreate = new User({
  login: 'john',
  email: 'john@hospital.care',
  passwordHash: 'correct horse battery staple',
})

const createdUser = await api.userApi.createOrModifyUser(userToCreate)
```

The user you just created will be able to connect to the application but will not be able to manage data because it is not connected to a data owner.

You will often need to create a patient that can connect to iCure. In that case [createAndInviteUser](../references/interfaces/UserApi.md#createandinviteuser) can be used:

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Create a patient user-->
```typescript
import { Patient, Address, Telecom } from '@icure/medical-device-sdk'

const loggedUser = await api.userApi.getLoggedUser()
const loggedHcp = await api.healthcareProfessionalApi.getHealthcareProfessional(loggedUser.healthcarePartyId)
const patientToCreate = new Patient({
  firstName: 'Argan',
  lastName: 'Poquelin',
  addresses: [new Address({ addressType: 'home', telecoms: [new Telecom({ telecomType: 'email', telecomNumber: 'argan@moliere.fr' })] })],
  dateOfBirth: 19730210,
  ssin: '1973021014722',
})
const createdPatient = await api.patientApi.createOrModifyPatient(patientToCreate)

const createdPatientUser = await api.userApi.createAndInviteUser(
  createdPatient,
  new ICureRegistrationEmail(loggedHcp, 'https://myapplication.care/login', 'My application', createdPatient),
)
```

For the gory details of all you can do with users using the SDK, check out the [UserApi](../references/interfaces/UserApi.md) documentation.



