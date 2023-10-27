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

This how-to assumes that until now, you have been using the {{SdkName}} in your application with the open-source
 version of iCure. You now want to start using the iCure Cloud version, including all premium features.

:::

If you were using the open source version of the iCure backend, and you now are migrating to the cloud version, there are
some things that you have to take into account. You will have access to additional features available only in the cloud version,
but you will also have to make some changes in your code.

## Create your Cloud iCure account

In order to use the Cloud iCure version, you first need to create an account on the 
 [Cockpit platform](https://cockpit.icure.dev). For this, check the tutorial [How to register on Cockpit](/cockpit/how-to/how-to-create-your-account)

## Code Changes

To migrate properly to the Cloud version, you must apply the following changes to your code.

### iCure URL

First, you will have to change the URL used to instantiate the MedTech API to allow you application to contact the iCure
 Cloud Backend:

<!-- file://code-samples/{{sdk}}/how-to/migrate-to-premium/index.mts snippet:instantiate the api-->
```typescript
const medtechApi = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
```

### Access Control

While testing your app, you could experience some `403 - FORBIDDEN` errors on iCure Backend requests.
 This is because the cloud version applies a permission-based access control on its endpoints, which is useless for the iCure free version.
To resolve those issues, make sure your data owner may access the requested data. 
 If not, give him access through the [giveAccessTo service](/{{sdk}}/how-to/how-to-share-data) first, 
or [share of all future data](/{{sdk}}/how-to/how-to-share-data-automatically) with another user.

## Additional Features

By subscribing to the cloud version of the iCure backend, you will have access to features not available in the open source
 version.

### User Creation

You are now able to register new users by sending them an email or an SMS message to invite them. For more information, 
 go to [How to register a user](/{{sdk}}/how-to/how-to-authenticate-a-user/how-to-authenticate-a-user).
You now also have the possibility to create users for existing patients, still by email or SMS. For this process, you can 
 head to [How to Create a User for an Existing Patient](/{{sdk}}/how-to/how-to-invite-existing-patient-as-a-user).

### Event Subscription

Now, you also may use iCure WebHook, in order to subscribe to events concerning several types of entities. 
 Through this mechanism, you will be able to receive real-time notifications when an entity is created, updated, or deleted.
This process is detailed in the [Listening to iCure events](/{{sdk}}/how-to/how-to-subscribe-to-icure-events) how-to.
