---
slug: my-user-lost-their-key
---
# What if my user lost their private key ?

One day, one of your user will lose their private key. In order for them to have access back to their data, you will
have to put a few actions in place.

## Pre-requisites
In this tutorial, we will only focus on the additional steps related to a lost key pair : We won't cover the User 
authentication and data sharing services.  

Therefore, we assume that you're already familiar with : 
- [The user authentication](index.md)
- [Data sharing](../how-to-share-data.md) or [Automatically share data with other data owners](../how-to-auto-share-data.md)

At this stage, you should : 
- Have a patient user
- Have a healthcare professional user
- Have some data created by your patient and shared with your healthcare professional user

## Login and create a new RSA Keypair
You can't find back Daenaerys's private key. Depending where you saved her private key, it could be because:
- she lost her computer
- she started the app on another browser
- she reset her computer
- she cleared her cache 
- ...

Anyway, if you want her to continue using your app, you need to create her a new RSA Keypair. 
For this, start a new authentication process as usually, and complete it by providing a userKeypair lambda generating 
a new RSA Keypair in case you can't find it back : 

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Complete user lost key authentication-->
```typescript
const loginAuthResult = await anonymousMedTechApi.authenticationApi.completeAuthentication(
  loginProcess!,
  newValidationCode,
  () => {
    const userInfo = getBackCredentials()
    if (userInfo.pubKey != undefined && userInfo.privKey != undefined) {
      return Promise.resolve({ privateKey: userInfo.privKey, publicKey: userInfo.pubKey })
    } else {
      // You can't find back the user's RSA Keypair: You need to generate a new one
      return anonymousApiForLogin.generateRSAKeypair()
    }
  }
)
```

At this stage, Daenaerys will be able to create new data, using her new RSA keypair : 

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:User can create new data after loosing their key-->
```typescript
const newlyCreatedDataSample = await loginAuthResult.medTechApi.dataSampleApi.createOrModifyDataSampleFor(
  foundUser.patientId,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: 'Hello world' } },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
```

However, she still won't be able to access the data she created with her previous key.
To get access back to it, Daenaerys will need the help of people with whom she shared those data.

## Get access back to previous data 
The previous key of Daenaerys is lost, meaning she shouldn't be able to access her data anymore.
However, thanks to iCure advanced cryptography, she can still hope to find it back, by asking the data 
owners with whom she shared her data to give her access back.

:::warning

Of course, if Daenaerys didn't share her data with anyone, it is definitely lost. She won't be able to access it 
again. 

:::

When Daenarys created a new RSA Keypair, the MedTech SDK sent a [notification](../how-to-manage-notifications.md) to 
all data owners she shared data with in the past, to warn them she has a new keypair and needs them to re-share her data 
using the new keypair and not only the previous keypair anymore. 

Once the data owners will treat this notification and decide or not to give access back to Daenaerys, she will be able 
to see her previous data again. 

For the next steps of this tutorial, we'll consider that Daenaerys shared some of her medical data with her doctor, 
Jorah Mormont.


### Get notifications related to updated keypairs
When Jorah will start your app, he will have to retrieve all recent notifications he needs to treat. 
The ones that are interesting us here are the notifications related to updated keypairs : 

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Data owner gets all their pending notifications-->
```typescript
const hcpNotifications = await hcpApi.notificationApi.getPendingNotificationsAfter(startTimestamp)
  .then((notifs) => notifs.filter((notif) => notif.type === NotificationTypeEnum.KEY_PAIR_UPDATE))
```

Once Jorah has the list of notifications, he will treat them one by one, deciding to give access back to the 
provided user or not. 

### Give access back to another data owner
:::warning

Before giving access back to a user, the data owner must ensure that the user is really who they meant to be.

:::

Let's say Jorah decides to give Daenaerys access back to her previous data using her new keypair : 

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Give access back to a user with their new key-->
```typescript
const daenaerysPatientId = daenaerysNotification!.properties?.find((prop) => prop.id == 'dataOwnerConcernedId')
const daenaerysPatientPubKey = daenaerysNotification!.properties?.find((prop) => prop.id == 'dataOwnerConcernedPubKey')

const accessBack = await hcpApi.dataOwnerApi.giveAccessBackTo(
  daenaerysPatientId!.typedValue!.stringValue!,
  daenaerysPatientPubKey!.typedValue!.stringValue!
)
```

After restarting her app, Daenaerys will be able to access her previous data back. 

:::tip 

Once a notification is treated, do not forget to update its status. (See more in [How to manage notifications](../how-to-manage-notifications.md))

:::


## What if the user wants to authenticate on another device but didn't lose their previous key ?
When a new RSA keypair is generated for Daenaerys, a notification is sent to all data owners she shared data with, 
but not only : She receives a notification as well. 

Therefore, the procedure stays the same, except that instead of waiting all data owners to give access back to her data, 
Daenaerys can get all her pending notifications, and give access back to all her data using her "previous" key.  
