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

let userToCreate = new User({login: 'john', email: 'john@hospital.care', passwordHash: 'correct horse battery staple'});
const newUser = await api.userApi.createOrModifyUser(userToCreate)
```

