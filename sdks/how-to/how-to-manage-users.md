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
  "id": "aa2b997f-4940-47ce-9db4-bf424964c348",
  "rev": "1-f754b92c9c89dc85bf10a5ba40473b75",
  "created": 1682493643604,
  "login": "john+csez0lmfp",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+csez0lmfp@hospital.care",
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
f7b331b7-75de-4cc3-b5e1-fae71113fa9a
```
</details>

Now it will be possible for the user to log in using the newly created token, that will expire after 1 hour.

:::note

A User can always create an authentication token for themself, 
but only Admins and Healthcare Professionals from create authentication tokens for other users.  


:::

### Creating a user associated to a patient

The user you just created will be able to connect to the application but will not be able to manage data because it is not connected to a data owner.

You will often need to create a patient that can connect to iCure. In that case you can use [createAndInviteUser](/sdks/references/apis/UserApi#createandinviteuser):

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
  "id": "daf57bd4-a644-41e2-a724-8c1cb7f4e6d4",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-bcdfeb220845201e66854df3502862d0",
  "created": 1682493646024,
  "modified": 1682493646024,
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
          "telecomNumber": "argan+csez0lmfp@moliere.fr",
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
    "encryptedSelf": "IrjAPabEzVuLOUCvphbHD6T8ewqDep3xLaSD4heT1uU=",
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
  "id": "d68e5e3f-8c23-407d-b636-a4e40047435f",
  "rev": "1-a0b50780da20bb277033d48eaaf56081",
  "created": 1682493646532,
  "name": "argan+csez0lmfp@moliere.fr",
  "login": "argan+csez0lmfp@moliere.fr",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "daf57bd4-a644-41e2-a724-8c1cb7f4e6d4",
  "email": "argan+csez0lmfp@moliere.fr",
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
  "id": "aa2b997f-4940-47ce-9db4-bf424964c348",
  "rev": "2-8b59bd5a79b9abb5348861747824b972",
  "created": 1682493643604,
  "login": "john+csez0lmfp",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+csez0lmfp@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {
    "d14075cc-313d-4962-a171-d3c9a53afa18": {
      "creationTime": 1682493643814,
      "validity": 3600
    }
  }
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
  "id": "aa2b997f-4940-47ce-9db4-bf424964c348",
  "rev": "2-8b59bd5a79b9abb5348861747824b972",
  "created": 1682493643604,
  "login": "john+csez0lmfp",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+csez0lmfp@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {
    "d14075cc-313d-4962-a171-d3c9a53afa18": {
      "creationTime": 1682493643814,
      "validity": 3600
    }
  }
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
  "totalSize": 721,
  "rows": [
    {
      "id": "d68e5e3f-8c23-407d-b636-a4e40047435f",
      "rev": "2-c1500155eaaf2365b47c7ce547fa10f9",
      "created": 1682493646532,
      "name": "argan+csez0lmfp@moliere.fr",
      "login": "argan+csez0lmfp@moliere.fr",
      "groupId": "ic-e2etest-medtech-docs",
      "patientId": "daf57bd4-a644-41e2-a724-8c1cb7f4e6d4",
      "email": "argan+csez0lmfp@moliere.fr",
      "properties": {},
      "roles": {},
      "sharingDataWith": {},
      "authenticationTokens": {
        "41af21ed-435c-4834-ab78-6269f4a6e4ec": {
          "creationTime": 1682493647069,
          "validity": 172800
        }
      }
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
  "id": "aa2b997f-4940-47ce-9db4-bf424964c348",
  "rev": "3-52538bab5460d34442f3615529dab1cd",
  "created": 1682493643604,
  "login": "john+csez0lmfp",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+csez0lmfp@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {
    "d14075cc-313d-4962-a171-d3c9a53afa18": {
      "creationTime": 1682493643814,
      "validity": 3600
    }
  }
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
4-32eecf82638266eba206c43122c6a6c6
```
</details>

For the gory details of all you can do with users using the SDK, check out the [UserApi](/sdks/references/apis/UserApi) documentation.
