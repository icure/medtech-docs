---
slug: how-to-manage-users
description: Learn how to manage users
tags:
  - User
---

# Handling users

## Creating a user

To create a user, you first need to create a [User](../references/classes/User.md) object and call the `createUser` method on the `UserService` object.

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Create a user-->
```typescript
import { User } from '@icure/medical-device-sdk'
import { ICureRegistrationEmail } from '@icure/medical-device-sdk'

//4 random characters to guarantee login uniqueness
const uniqueId = Math.random().toString(36).substring(4)

const userToCreate = new User({
  login: `john${uniqueId}`,
  email: `john${uniqueId}@hospital.care`,
  passwordHash: 'correct horse battery staple',
})

const createdUser = await api.userApi.createOrModifyUser(userToCreate)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/createdUser.txt -->
<details>
<summary>createdUser</summary>

```json
{
  "id": "8a87f8c9-7175-41ed-86e8-180708abc758",
  "rev": "1-ea64d488f765933925ea0460fed2ca80",
  "created": 1679926553666,
  "login": "john+fpou08319",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+fpou08319@hospital.care",
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

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Create a token-->
```typescript
const token = await api.userApi.createToken(createdUser.id, 3600)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/token.txt -->
<details>
<summary>token</summary>

```text
d771202a-5a67-49ab-8f01-1b46649cbffa
```
</details>

Now it will be possible for the user to log in using the newly created token, that will expire after 1 hour.

:::note

A User can always create an authentication token for themself, 
but only Admins and Healthcare Professionals from create authentication tokens for other users.  


:::

### Creating a user associated to a patient

The user you just created will be able to connect to the application but will not be able to manage data because it is not connected to a data owner.

You will often need to create a patient that can connect to iCure. In that case you can use [createAndInviteUser](/{{sdk}}/references/apis/UserApi#createandinviteuser):

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Create a patient user-->
```typescript
import { Patient, Address, Telecom } from '@icure/medical-device-sdk'

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
          telecomNumber: `hcp${uniqueId}@hospital.care`,
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
          telecomNumber: `argan${uniqueId}@moliere.fr`,
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

<!-- output://code-samples/{{sdk}}/how-to/manage-users/createdPatient.txt -->
<details>
<summary>createdPatient</summary>

```json
{
  "id": "a2bf8e81-0155-465c-8eef-7ef68b510daa",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-4ab0a19c997a92ab9f2ef2fa30eb48e7",
  "created": 1679926554832,
  "modified": 1679926554832,
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
          "telecomNumber": "argan+fpou08319@moliere.fr",
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
    "encryptedSelf": "pUfGQ5W6qBKcfNto4B7tZHMNfoim0auje5P/g/Kste4=",
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

<!-- output://code-samples/{{sdk}}/how-to/manage-users/createdPatientUser.txt -->
<details>
<summary>createdPatientUser</summary>

```json
{
  "id": "7af73f15-f16d-46f1-9437-89a676192032",
  "rev": "1-c930b4b0e7f2942cc6af7c4317fd54dd",
  "created": 1679926555303,
  "name": "argan+fpou08319@moliere.fr",
  "login": "argan+fpou08319@moliere.fr",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "a2bf8e81-0155-465c-8eef-7ef68b510daa",
  "email": "argan+fpou08319@moliere.fr",
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
* the {{hcp}} and the patient must have an email address or a mobile phone number.
* the email address or the phone number of the patient must not be in use by another user in the database.

:::

## Loading a user by id

To load a user by id, you can use the `getUser` method on the `userApi`:

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Load a user-->
```typescript
const loadedUser = await api.userApi.getUser(createdUser.id)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/loadedUser.txt -->
<details>
<summary>loadedUser</summary>

```json
{
  "id": "8a87f8c9-7175-41ed-86e8-180708abc758",
  "rev": "1-ea64d488f765933925ea0460fed2ca80",
  "created": 1679926553666,
  "login": "john+fpou08319",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+fpou08319@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {}
}
```
</details>

## Loading a user by email

To load a user by email, you can use the `getUserByEmail` method on the `userApi`:

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Load a user by email-->
```typescript
const loadedUserByEmail = await api.userApi.getUserByEmail(createdUser.email)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/loadedUserByEmail.txt -->
<details>
<summary>loadedUserByEmail</summary>

```json
{
  "id": "8a87f8c9-7175-41ed-86e8-180708abc758",
  "rev": "1-ea64d488f765933925ea0460fed2ca80",
  "created": 1679926553666,
  "login": "john+fpou08319",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+fpou08319@hospital.care",
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

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Filter users-->
```typescript
const users = await api.userApi.filterUsers(
  await new UserFilter(api).byPatientId(createdPatient.id).build(),
)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/users.txt -->
<details>
<summary>users</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 257,
  "rows": [
    {
      "id": "7af73f15-f16d-46f1-9437-89a676192032",
      "rev": "2-c9f65e910e7aedb1044bd24451285dd6",
      "created": 1679926555303,
      "name": "argan+fpou08319@moliere.fr",
      "login": "argan+fpou08319@moliere.fr",
      "groupId": "ic-e2etest-medtech-docs",
      "patientId": "a2bf8e81-0155-465c-8eef-7ef68b510daa",
      "email": "argan+fpou08319@moliere.fr",
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

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Update a user-->
```typescript
const userToModify = await api.userApi.getUser(createdUser.id)
const modifiedUser = await api.userApi.createOrModifyUser(
  new User({ ...userToModify, passwordHash: 'wrong horse battery staple' }),
)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/modifiedUser.txt -->
<details>
<summary>modifiedUser</summary>

```json
{
  "id": "8a87f8c9-7175-41ed-86e8-180708abc758",
  "rev": "2-3c7c6231fb5c338ceea419751e79374a",
  "created": 1679926553666,
  "login": "john+fpou08319",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+fpou08319@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {}
}
```
</details>

## Delete a user

To delete a user, you call the `deleteUser` method on the `userApi` and pass the id of the user to be deleted.

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Delete a user-->
```typescript
const deletedUserId = await api.userApi.deleteUser(createdUser.id)
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/deletedUserId.txt -->
<details>
<summary>deletedUserId</summary>

```text
3-0a0a726e42f631f0a5067892648963e3
```
</details>

For the gory details of all you can do with users using the SDK, check out the [UserApi](/{{sdk}}/references/apis/UserApi) documentation.
