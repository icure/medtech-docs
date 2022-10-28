---
slug: how-to-migrate-to-icure-premium-features
description: How to Migrate to iCure Premium Features
tags:
- Open Source
- Migration
- Premium Features
---

# How to Migrate to iCure Premium Features

:::note

This how-to assumes that you have been using the iCure Medical Device SDK in your application with the open-source version
 of the iCure backend and that, after creating an application, a database, and a suer using the iCure Cockpit, you now
 want to use the cloud version of iCure.

:::

If you were using the open source version of the iCure backend, and you now are migrating to the cloud version, there are
some things that you have to take into account. You will have access to additional features available only in the cloud version,
but you will also have to make some changes in your code.

## Changes

The following steps are mandatory changes that you must perform to ensure that your application will work as intended.

### iCure URL

First, you will have to change the URL used to instantiate the MedTech API to allow you application to contact the iCure
 Cloud Backend:
```typescript
const medtechApi = await medTechApi()
    .withICureBaseUrl("https://kraken.svc.icure.cloud")
    .withUserName(username)
    .withPassword(password)
    .withCrypto(webcrypto as any)
    .build()
```

### Access Control

Another important thing that you have to keep in mind is that the cloud version of the iCure backend applies a permission-based
 access control on its endpoints.  
Because of this, you may experience some `403 - FORBIDDEN` errors on calls that worked on the open source version of the
 iCure backend, where all the types of user (Healthcare Professional, Patient, or Device) can access all the endpoints.

## Additional Features

By subscribing to the cloud version of the iCure backend, you will have access to features not available in the open source
 version.

### User Invitation

By using the cloud version of the iCure backend, you will be able to invite user by sending them an email or an SMS message
 containing an invitation link.  
The process is detailed in the [How to register a user](./how-to-register-a-user.md) and
 [How to Create a User for an Existing Patient](./how-to-create-a-user-from-a-patient.md) how-tos.

### Event Subscription

If you use the cloud version of the iCure backend, you will also have the possibility of subscribing to events
 concerning several types of entities. Through this mechanism, you will be able to receive a real-time notification when
 an entity is created, updated, or deleted.  
This process is detailed in the [Listening to iCure events](./listen-to-icure-events.md) how-to.