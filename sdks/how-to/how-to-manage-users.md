---
slug: how-to-manage-users
description: Learn how to manage users
tags:
  - User
---

# Handling users

## Creating a user

To create a user, you first need to create a [User](../references/classes/User.md) object and call the `createUser` method on the `UserService` object.

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Create a user-->
```typescript
import { User } from '@icure/medical-device-sdk'
import { ICureRegistrationEmail } from '@icure/medical-device-sdk'

//4 random characters to guarantee login uniqueness
const uniqueId = Math.random().toString(36).substring(4)

const userToCreate = new User({
  login: `john+${uniqueId}`,
  email: `john+${uniqueId}@hospital.care`,
  passwordHash: 'correct horse battery staple',
})

const createdUser = await api.userApi.createOrModifyUser(userToCreate)
```

<!-- output://code-samples/how-to/manage-users/userToCreate.txt -->
<details>
</details>


:::caution

The `login` and `email` fields must be unique. If you try to create a user with a login or email that already exists, the API will return a 400 error.

:::

The user you just created will be able to connect to the application but will not be able to manage data because it is not connected to a data owner.

You will often need to create a patient that can connect to iCure. In that case you can use [createAndInviteUser](../references/interfaces/UserApi.md#createandinviteuser):

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Create a patient user-->
```typescript
import { Patient, Address, Telecom } from '@icure/medical-device-sdk'
import { hex2ua } from '@icure/api'

const loggedUser = await api.userApi.getLoggedUser()
const loggedHcp = await api.healthcareProfessionalApi.getHealthcareProfessional(
  loggedUser.healthcarePartyId,
)

if (
  !loggedHcp.addresses.find((a) =>
    a.telecoms.some((t) => t.telecomType === 'email' && !!t.telecomNumber),
  )
) {
  //An email address is required for the healthcare professional to send the invitation
  loggedHcp.addresses.push(
    new Address({
      telecoms: [
        new Telecom({
          telecomType: 'email',
          telecomNumber: `hcp+${uniqueId}@hospital.care`,
        }),
      ],
    }),
  )
}

const patientToCreate = new Patient({
  firstName: 'Argan',
  lastName: 'Poquelin',
  addresses: [
    new Address({
      addressType: 'home',
      telecoms: [
        new Telecom({
          telecomType: 'email',
          telecomNumber: `argan+${uniqueId}@moliere.fr`,
        }),
      ],
    }),
  ],
  dateOfBirth: 19730210,
  ssin: '1973021014722',
})
const createdPatient = await api.patientApi.createOrModifyPatient(patientToCreate)

const createdPatientUser = await api.userApi.createAndInviteUser(
  createdPatient,
  new ICureRegistrationEmail(
    loggedHcp,
    'https://myapplication.care/login',
    'My application',
    createdPatient,
  ),
)
```

<!-- output://code-samples/how-to/manage-users/createdPatient.txt -->
<details>
</details>

<!-- output://code-samples/how-to/manage-users/createdPatientUser.txt -->
<details>
</details>


:::note

The `createAndInviteUser` method will send the patient an email with the link to the application.
The email will contain the username and a temporary password.

:::

:::caution

For this process to succeed the following conditions must be met: 
* the healthcare professional and the patient must have an email address or a mobile phone number.
* the email address or the phone number of the patient must not be in use by another user in the database.

:::

## Loading a user by id

To load a user by id, you can use the `getUser` method on the `userApi`:

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Load a user-->
```typescript
const loadedUser = await api.userApi.getUser(createdUser.id)
```

<!-- output://code-samples/how-to/manage-users/loadedUser.txt -->
<details>
</details>

## Loading a user by email

To load a user by email, you can use the `getUserByEmail` method on the `userApi`:

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Load a user by email-->
```typescript
const loadedUserByEmail = await api.userApi.getUserByEmail(createdUser.email)
```

<!-- output://code-samples/how-to/manage-users/loadedUserByEmail.txt -->
<details>
</details>

## Filtering users

To filter users, you can use the `filterUsers` method on the `userApi`.

The following filters are available:
* Filtering on a collection of ids
* Filtering by patient id

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Filter users-->
```typescript
const users = await api.userApi.filterUsers(
  await new UserFilter().byPatientId(createdPatient.id).build(),
)
```

<!-- output://code-samples/how-to/manage-users/users.txt -->
<details>
</details>

## Update a user

To update a user, you first need to load the user you want to update, then modify the fields you want to update and call the `createOrModifyUser` method on the `userApi`.

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Update a user-->
```typescript
const userToModify = await api.userApi.getUser(createdUser.id)
const modifiedUser = await api.userApi.createOrModifyUser(
  new User({ ...userToModify, passwordHash: 'wrong horse battery staple' }),
)
```

<!-- output://code-samples/how-to/manage-users/modifiedUser.txt -->
<details>
</details>

## Delete a user

To delete a user, you call the `deleteUser` method on the `userApi` and pass the id of the user to be deleted.

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Delete a user-->
```typescript
const deletedUserId = await api.userApi.deleteUser(createdUser.id)
```

<!-- output://code-samples/how-to/manage-users/deletedUserId.txt -->
<details>
</details>

For the gory details of all you can do with users using the SDK, check out the [UserApi](../references/interfaces/UserApi.md) documentation.
