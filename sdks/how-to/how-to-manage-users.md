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

<!-- output://code-samples/how-to/manage-users/createdUser.txt -->
<details>
<summary>createdUser</summary>

```json
{
  "id": "744c8b6f-c299-43a6-9926-b773a2ee2d90",
  "rev": "1-cb8d2dfe526297c49121644ebb5bf4ef",
  "created": 1680263967084,
  "login": "john+8fy2x3tv8",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+8fy2x3tv8@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {}
}
```
</details>


:::caution

The `login` and `email` fields must be unique. If you try to create a user with a login or email that already exists, the API will return a 400 error.

:::

### Creating a temporary authentication token for a User

Sometimes, you may want to create a temporary authentication token for a user that will expire in a fixed amount of time. 
You can do that using the `createToken` method, that takes as parameters the id of the user for which create the token 
and the duration of the token, in seconds.

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Create a token-->
```typescript
const token = await api.userApi.createToken(createdUser.id, 3600)
```

<!-- output://code-samples/how-to/manage-users/token.txt -->
<details>
<summary>token</summary>
```text
b7016fd4-9153-4523-a7a0-add4b74c5e89
```
</details>

Now it will be possible for the user to log in using the newly created token, that will expire after 1 hour.

:::note

A User can always create an authentication token for themself, 
but only Admins and Healthcare Professionals from create authentication tokens for other users.  


:::

### Creating a user associated to a patient

The user you just created will be able to connect to the application but will not be able to manage data because it is not connected to a data owner.

You will often need to create a patient that can connect to iCure. In that case you can use [createAndInviteUser](/sdks/references/apis/UserApi.md#createandinviteuser):

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
<summary>createdPatient</summary>

```json
{
  "id": "93b7b51b-f1b0-46f8-8029-cdb4c46f7316",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-89100da2e888dce6977050aa04e896e1",
  "created": 1680263968766,
  "modified": 1680263968766,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "firstName": "Argan",
  "lastName": "Poquelin",
  "ssin": "1973021014722",
  "dateOfBirth": 19730210,
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "Argan"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Poquelin",
      "text": "Poquelin Argan",
      "use": "official"
    }
  ],
  "addresses": [
    {
      "addressType": "home",
      "telecoms": [
        {
          "telecomNumber": "argan+8fy2x3tv8@moliere.fr",
          "telecomType": "email"
        }
      ]
    }
  ],
  "gender": "unknown",
  "birthSex": "unknown",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {},
    "transferKeys": {},
    "encryptedSelf": "E3uJlRc5UK4QVrt+6bO3awPqyvDNnel7smSsqmkY0CM=",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-users/createdPatientUser.txt -->
<details>
<summary>createdPatientUser</summary>

```json
{
  "id": "78eaabf3-ccac-416a-9063-7ef2d6cbb4a6",
  "rev": "1-a5756aba8def48a40613fe255f81fb41",
  "created": 1680263968925,
  "name": "argan+8fy2x3tv8@moliere.fr",
  "login": "argan+8fy2x3tv8@moliere.fr",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "93b7b51b-f1b0-46f8-8029-cdb4c46f7316",
  "email": "argan+8fy2x3tv8@moliere.fr",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {}
}
```
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
<summary>loadedUser</summary>

```json
{
  "id": "744c8b6f-c299-43a6-9926-b773a2ee2d90",
  "rev": "2-00a8d4727a8070cbfcac5896e4210870",
  "created": 1680263967084,
  "login": "john+8fy2x3tv8",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+8fy2x3tv8@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {}
}
```
</details>

## Loading a user by email

To load a user by email, you can use the `getUserByEmail` method on the `userApi`:

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Load a user by email-->
```typescript
const loadedUserByEmail = await api.userApi.getUserByEmail(createdUser.email)
```

<!-- output://code-samples/how-to/manage-users/loadedUserByEmail.txt -->
<details>
<summary>loadedUserByEmail</summary>

```json
{
  "id": "744c8b6f-c299-43a6-9926-b773a2ee2d90",
  "rev": "2-00a8d4727a8070cbfcac5896e4210870",
  "created": 1680263967084,
  "login": "john+8fy2x3tv8",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+8fy2x3tv8@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {}
}
```
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
<summary>users</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 500,
  "rows": [
    {
      "id": "78eaabf3-ccac-416a-9063-7ef2d6cbb4a6",
      "rev": "2-5a32941014cfe043e2bf96f1b663bec3",
      "created": 1680263968925,
      "name": "argan+8fy2x3tv8@moliere.fr",
      "login": "argan+8fy2x3tv8@moliere.fr",
      "groupId": "ic-e2etest-medtech-docs",
      "patientId": "93b7b51b-f1b0-46f8-8029-cdb4c46f7316",
      "email": "argan+8fy2x3tv8@moliere.fr",
      "properties": {},
      "roles": {},
      "sharingDataWith": {},
      "authenticationTokens": {}
    }
  ],
  "nextKeyPair": {}
}
```
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
<summary>modifiedUser</summary>

```json
{
  "id": "744c8b6f-c299-43a6-9926-b773a2ee2d90",
  "rev": "3-e142062dada16ce3cf85dbc1c66f7890",
  "created": 1680263967084,
  "login": "john+8fy2x3tv8",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+8fy2x3tv8@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {}
}
```
</details>

## Delete a user

To delete a user, you call the `deleteUser` method on the `userApi` and pass the id of the user to be deleted.

<!-- file://code-samples/how-to/manage-users/index.mts snippet:Delete a user-->
```typescript
const deletedUserId = await api.userApi.deleteUser(createdUser.id)
```

<!-- output://code-samples/how-to/manage-users/deletedUserId.txt -->
<details>
<summary>deletedUserId</summary>

```text
4-86d268d64c96c62465606ebf5fdda6e2
```
</details>

For the gory details of all you can do with users using the SDK, check out the [UserApi](/sdks/references/apis/UserApi.md) documentation.
