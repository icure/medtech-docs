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
  login: `john${uniqueId}`,
  email: `john${uniqueId}@hospital.care`,
  passwordHash: 'correct horse battery staple',
})

const createdUser = await api.userApi.createOrModifyUser(userToCreate)
```

<!-- output://code-samples/how-to/manage-users/createdUser.txt -->
<details>
<summary>createdUser</summary>

```json
{
  "id": "e3615060-f659-4e3d-81ab-7f9925b0b2d7",
  "rev": "1-8f1a358ed184a1dadf26afd1906752a4",
  "created": 1688375624991,
  "login": "johno7r8on9m",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "johno7r8on9m@hospital.care",
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
7aae3aab-4ad1-48aa-a3ad-4cf3c614401a
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

<!-- output://code-samples/how-to/manage-users/createdPatient.txt -->
<details>
<summary>createdPatient</summary>

```json
{
  "id": "5a66c5c7-cf14-42c6-b271-43ba4771e5d1",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-f6f64641467a9ef4bab5408df5a9fdf1",
  "created": 1688375625056,
  "modified": 1688375625056,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
          "telecomNumber": "argano7r8on9m@moliere.fr",
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
    "aesExchangeKeys": {},
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "transferKeys": {},
    "encryptedSelf": "M5vpVJqHYKBtDKcpIWD/b7Lgc9Umlh+Rnl2HN3Ob2mA=",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

<!-- output://code-samples/how-to/manage-users/createdPatientUser.txt -->
<details>
<summary>createdPatientUser</summary>

```json
{
  "id": "5b051d2d-4a1a-4707-a24b-b3d3ca1143ae",
  "rev": "1-f328ab564e8fe3c332ec77feeee7060c",
  "created": 1688375625117,
  "name": "argano7r8on9m@moliere.fr",
  "login": "argano7r8on9m@moliere.fr",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "5a66c5c7-cf14-42c6-b271-43ba4771e5d1",
  "email": "argano7r8on9m@moliere.fr",
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
  "id": "e3615060-f659-4e3d-81ab-7f9925b0b2d7",
  "rev": "2-6bd37618105cccdcc7529897b08574b6",
  "created": 1688375624991,
  "login": "johno7r8on9m",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "johno7r8on9m@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {
    "a50e5a58-128b-4ec2-938a-80a7d0986c77": {
      "creationTime": 1688375625006,
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
  "id": "e3615060-f659-4e3d-81ab-7f9925b0b2d7",
  "rev": "2-6bd37618105cccdcc7529897b08574b6",
  "created": 1688375624991,
  "login": "johno7r8on9m",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "johno7r8on9m@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {
    "a50e5a58-128b-4ec2-938a-80a7d0986c77": {
      "creationTime": 1688375625006,
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
  await new UserFilter(api).byPatientId(createdPatient.id).build(),
)
```

<!-- output://code-samples/how-to/manage-users/users.txt -->
<details>
<summary>users</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 367,
  "rows": [
    {
      "id": "5b051d2d-4a1a-4707-a24b-b3d3ca1143ae",
      "rev": "2-2b285a7e4b06f1645c82e249b1de38af",
      "created": 1688375625117,
      "name": "argano7r8on9m@moliere.fr",
      "login": "argano7r8on9m@moliere.fr",
      "groupId": "ic-e2etest-medtech-docs",
      "patientId": "5a66c5c7-cf14-42c6-b271-43ba4771e5d1",
      "email": "argano7r8on9m@moliere.fr",
      "properties": {},
      "roles": {},
      "sharingDataWith": {},
      "authenticationTokens": {
        "acec275e-2e70-4af6-a8e8-e06bae26252f": {
          "creationTime": 1688375625137,
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
  "id": "e3615060-f659-4e3d-81ab-7f9925b0b2d7",
  "rev": "3-2f0ce3f43e35f48a53b058214d2a8488",
  "created": 1688375624991,
  "login": "johno7r8on9m",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "johno7r8on9m@hospital.care",
  "properties": {},
  "roles": {},
  "sharingDataWith": {},
  "authenticationTokens": {
    "a50e5a58-128b-4ec2-938a-80a7d0986c77": {
      "creationTime": 1688375625006,
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
4-ab07685eeaa4a314d225e37677c21915
```
</details>

For the gory details of all you can do with users using the SDK, check out the [UserApi](/sdks/references/apis/UserApi) documentation.
