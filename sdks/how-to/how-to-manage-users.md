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
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/createdUser.txt -->
<details>
<summary>createdUser</summary>

```json
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
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/token.txt -->
<details>
<summary>token</summary>

```text
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
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/createdPatient.txt -->
<details>
<summary>createdPatient</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/manage-users/createdPatientUser.txt -->
<details>
<summary>createdPatientUser</summary>

```json
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
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/loadedUser.txt -->
<details>
<summary>loadedUser</summary>

```json
```
</details>

## Loading a user by email

To load a user by email, you can use the `getUserByEmail` method on the `userApi`:

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Load a user by email-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/loadedUserByEmail.txt -->
<details>
<summary>loadedUserByEmail</summary>

```json
```
</details>

## Filtering users

To filter users, you can use the `filterUsers` method on the `userApi`.

The following filters are available:
* Filtering on a collection of ids
* Filtering by patient id

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Filter users-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/users.txt -->
<details>
<summary>users</summary>

```json
```
</details>

## Update a user

To update a user, you first need to load the user you want to update, then modify the fields you want to update and call the `createOrModifyUser` method on the `userApi`.

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Update a user-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/modifiedUser.txt -->
<details>
<summary>modifiedUser</summary>

```json
```
</details>

## Delete a user

To delete a user, you call the `deleteUser` method on the `userApi` and pass the id of the user to be deleted.

<!-- file://code-samples/{{sdk}}/how-to/manage-users/index.mts snippet:Delete a user-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-users/deletedUserId.txt -->
<details>
<summary>deletedUserId</summary>

```text
```
</details>

For the gory details of all you can do with users using the SDK, check out the [UserApi](/{{sdk}}/references/apis/UserApi) documentation.
