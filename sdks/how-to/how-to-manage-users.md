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
  "id": "3e878611-4663-49fc-a78b-8b4aefadd7fd",
  "rev": "1-341a8003f294e52f30a3f06a180aa046",
  "created": 1680075120693,
  "login": "john+rje98ah4k",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+rje98ah4k@hospital.care",
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
  "id": "f5df11a4-fb4b-4958-b480-8e63b7d231d9",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-c51a24a6bac9f5acbf2f3b1cc5bfc8b8",
  "created": 1680075121918,
  "modified": 1680075121918,
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
          "telecomNumber": "argan+rje98ah4k@moliere.fr",
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
    "encryptedSelf": "odK1PPEtjrzymLcxKSajdbzeeUembjBHXRaciNyN4z4=",
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
  "id": "93977e47-9c93-467d-811c-2e6afce42f84",
  "rev": "1-1cada17c034cdca02f154e92a52b17b8",
  "created": 1680075122248,
  "name": "argan+rje98ah4k@moliere.fr",
  "login": "argan+rje98ah4k@moliere.fr",
  "groupId": "ic-e2etest-medtech-docs",
  "patientId": "f5df11a4-fb4b-4958-b480-8e63b7d231d9",
  "email": "argan+rje98ah4k@moliere.fr",
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
  "id": "3e878611-4663-49fc-a78b-8b4aefadd7fd",
  "rev": "1-341a8003f294e52f30a3f06a180aa046",
  "created": 1680075120693,
  "login": "john+rje98ah4k",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+rje98ah4k@hospital.care",
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
  "id": "3e878611-4663-49fc-a78b-8b4aefadd7fd",
  "rev": "1-341a8003f294e52f30a3f06a180aa046",
  "created": 1680075120693,
  "login": "john+rje98ah4k",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+rje98ah4k@hospital.care",
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
  "totalSize": 440,
  "rows": [
    {
      "id": "93977e47-9c93-467d-811c-2e6afce42f84",
      "rev": "2-01b1f74c4644d3bae2b5312569fe748b",
      "created": 1680075122248,
      "name": "argan+rje98ah4k@moliere.fr",
      "login": "argan+rje98ah4k@moliere.fr",
      "groupId": "ic-e2etest-medtech-docs",
      "patientId": "f5df11a4-fb4b-4958-b480-8e63b7d231d9",
      "email": "argan+rje98ah4k@moliere.fr",
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
  "id": "3e878611-4663-49fc-a78b-8b4aefadd7fd",
  "rev": "2-edc543fe8a667b0ca05cfe72a78264e1",
  "created": 1680075120693,
  "login": "john+rje98ah4k",
  "passwordHash": "*",
  "groupId": "ic-e2etest-medtech-docs",
  "email": "john+rje98ah4k@hospital.care",
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
3-7a58578c79f62dd4267d83efe00cf557
```
</details>

For the gory details of all you can do with users using the SDK, check out the [UserApi](/sdks/references/apis/UserApi.md) documentation.
