---
slug: how-to-use-icure-premium-features
description: How to Migrate to iCure Premium Features
tags:
- Open Source
- Migration
- Premium Features
---

# Starting using cloud version and premium features

:::note

This how-to assumes that until now, you have been using the iCure Medical Device SDK in your application with the open-source
 version of iCure. You now want to start using the iCure Cloud version, including all premium features.

:::

If you were using the open source version of the iCure backend, and you now are migrating to the cloud version, there are
some things that you have to take into account. You will have access to additional features available only in the cloud version,
but you will also have to make some changes in your code.

## Create your Cloud iCure account

In order to use the Cloud iCure version, you first need to create an account on the 
 [Cockpit platform](https://cockpit.icure.cloud). For this, check the tutorial [How to register on Cockpit]

## Code Changes

To migrate properly to the Cloud version, you must apply the following changes to your code.

### iCure URL

First, you will have to change the URL used to instantiate the MedTech API to allow you application to contact the iCure
 Cloud Backend:

<!-- file://code-samples/how-to/migrate-to-premium/index.mts snippet:instantiate the api-->
```typescript
const medtechApi = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .build()
```

### Access Control

While testing your app, you could experience some `403 - FORBIDDEN` errors on iCure Backend requests.
 This is because the cloud version applies a permission-based access control on its endpoints, which is useless for the iCure free version.
To resolve those issues, make sure your data owner may access the requested data. 
 If not, give him access through the [giveAccessTo service](GIVE ACCESS TO DOC) first, or [share of all future data](AUTO DELEGATIONS DOC) with another user.

## Additional Features

By subscribing to the cloud version of the iCure backend, you will have access to features not available in the open source
 version.

### User Creation

You are now able to register new users by sending them an email or an SMS message to invite them. For more information, 
 go to [How to register a user](./how-to-register-a-user.md).
You now also have the possibility to create users for existing patients, still by email or SMS. For this process, you can 
 head to [How to Create a User for an Existing Patient](./how-to-create-a-user-from-a-patient.md).

### Event Subscription

Now, you also may use iCure WebHook, in order to subscribe to events concerning several types of entities. 
 Through this mechanism, you will be able to receive real-time notifications when an entity is created, updated, or deleted.
This process is detailed in the [Listening to iCure events](./listen-to-icure-events.md) how-to.
