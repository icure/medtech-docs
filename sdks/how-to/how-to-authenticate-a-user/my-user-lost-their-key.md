---
slug: how-to-manage-lost-key
---
# What if my user lost their private key ?

One day, one of your user will lose their private key. In order for them to have access back to their data, you will
have to put a few actions in place.

## Pre-requisites
In this tutorial, we will only focus on the additional steps related to a lost key pair : We won't cover the User 
authentication and data sharing services.  

Therefore, we assume that you're already familiar with : 
- [The user authentication](index.md)
- [Data sharing](../how-to-share-data.md) or [Automatically share data with other data owners](../how-to-share-data-automatically.md)

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
)
```

At this stage, Daenaerys will be able to create new data, using her new RSA keypair : 

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:User can create new data after loosing their key-->
```typescript
const newlyCreatedDataSample =
  await loginAuthResult.medTechApi.dataSampleApi.createOrModifyDataSampleFor(
    foundUser.patientId,
    new DataSample({
      labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
      content: { en: new Content({ stringValue: 'Hello world' }) },
      openingDate: 20220929083400,
      comment: 'This is a comment',
    }),
  )
```
<!-- output://code-samples/how-to/authenticate-user/newlyCreatedDataSample.txt -->
<details>
<summary>newlyCreatedDataSample</summary>

```json
{
  "id": "37e3525b-2269-42f5-9c11-2bab170673ff",
  "qualifiedLinks": {},
  "batchId": "5f9ee3bd-d375-4b1b-9e86-92f5bf64e832",
  "index": 0,
  "valueDate": 20230329073056,
  "openingDate": 20220929083400,
  "created": 1680075056249,
  "modified": 1680075056249,
  "author": "f4c7dd4e-e7c9-4419-8dc1-eb6217654134",
  "responsible": "59b5a1d8-46a6-429f-9b41-005925c8afd5",
  "comment": "This is a comment",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "Hello world",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [],
    "cryptedForeignKeys": {
      "59b5a1d8-46a6-429f-9b41-005925c8afd5": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "59b5a1d8-46a6-429f-9b41-005925c8afd5": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "59b5a1d8-46a6-429f-9b41-005925c8afd5": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>


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
const hcpNotifications = await hcpApi.notificationApi
  .getPendingNotificationsAfter(startTimestamp)
  .then((notifs) => notifs.filter((notif) => notif.type === NotificationTypeEnum.KEY_PAIR_UPDATE))
```
<!-- output://code-samples/how-to/authenticate-user/hcpNotifications.txt -->
<details>
<summary>hcpNotifications</summary>

```text
[
  {
    "id": "84440ac1-4d17-4f80-a27b-859e0cf81af2",
    "rev": "1-3a55504f4fe5efe2642b6ada57077058",
    "created": 1680075052724,
    "modified": 1680075052724,
    "author": "f4c7dd4e-e7c9-4419-8dc1-eb6217654134",
    "responsible": "59b5a1d8-46a6-429f-9b41-005925c8afd5",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "59b5a1d8-46a6-429f-9b41-005925c8afd5",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d0921d7b18d8341444130f89d215d83800db65373d21a036c3f3c840f824b4fc4723024599438105f38106d2ffd7173b8291478c02334cab84e213a9fd9d24f7508e2468b18bdf3db59df9f2fd908082ce6e1aea60bee23fde6efeb500d7911f38bf451e38f4084ed3c8bb794b7b1c768d3756a353822a372029b1959527fa47d951c6c64231d050b3480443b6c82389e12fcc34d844401e06932479a32db49618ef18a1dd63a29cd321a2c4deb62170eb74bf9d243a766de5b0b97e57bae84b0cc4f55bacb6d6245912409703f37fb2a45af5d63d888c233698307ae2234e872e4b425042957ede9a1f5b0ad543c685775a35328a0468691cd0a0c136a9edbb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  }
]
```
</details>

Once Jorah has the list of notifications, he will treat them one by one, deciding to give access back to the 
provided user or not. 

### Give access back to another data owner
:::warning

Before giving access back to a user, the data owner must ensure that the user is really who they meant to be.

:::

Let's say Jorah decides to give Daenaerys access back to her previous data using her new keypair : 

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Give access back to a user with their new key-->
```typescript
const daenaerysPatientId = daenaerysNotification!.properties?.find(
  (prop) => prop.id == 'dataOwnerConcernedId',
)
const daenaerysPatientPubKey = daenaerysNotification!.properties?.find(
  (prop) => prop.id == 'dataOwnerConcernedPubKey',
)

const accessBack = await hcpApi.dataOwnerApi.giveAccessBackTo(
  daenaerysPatientId!.typedValue!.stringValue!,
  daenaerysPatientPubKey!.typedValue!.stringValue!,
)
```
<!-- output://code-samples/how-to/authenticate-user/daenaerysPatientId.txt -->
<details>
<summary>daenaerysPatientId</summary>

```json
{
  "id": "dataOwnerConcernedId",
  "type": {
    "type": "STRING"
  },
  "typedValue": {
    "stringValue": "59b5a1d8-46a6-429f-9b41-005925c8afd5",
    "type": "STRING"
  }
}
```
</details>

<!-- output://code-samples/how-to/authenticate-user/daenaerysPatientPubKey.txt -->
<details>
<summary>daenaerysPatientPubKey</summary>

```json
{
  "id": "dataOwnerConcernedPubKey",
  "type": {
    "type": "STRING"
  },
  "typedValue": {
    "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d0921d7b18d8341444130f89d215d83800db65373d21a036c3f3c840f824b4fc4723024599438105f38106d2ffd7173b8291478c02334cab84e213a9fd9d24f7508e2468b18bdf3db59df9f2fd908082ce6e1aea60bee23fde6efeb500d7911f38bf451e38f4084ed3c8bb794b7b1c768d3756a353822a372029b1959527fa47d951c6c64231d050b3480443b6c82389e12fcc34d844401e06932479a32db49618ef18a1dd63a29cd321a2c4deb62170eb74bf9d243a766de5b0b97e57bae84b0cc4f55bacb6d6245912409703f37fb2a45af5d63d888c233698307ae2234e872e4b425042957ede9a1f5b0ad543c685775a35328a0468691cd0a0c136a9edbb0203010001",
    "type": "STRING"
  }
}
```
</details>

<!-- output://code-samples/how-to/authenticate-user/accessBack.txt -->
<details>
<summary>accessBack</summary>

```text
true
```
</details>


After restarting her app, Daenaerys will be able to access her previous data back. 

:::tip 

Once a notification is treated, do not forget to update its status. (See more in [How to manage notifications](../how-to-manage-notifications.md))

:::


## What if the user wants to authenticate on another device but didn't lose their previous key ?
When a new RSA keypair is generated for Daenaerys, a notification is sent to all data owners she shared data with, 
but not only : She receives a notification as well. 

Therefore, the procedure stays the same, except that instead of waiting all data owners to give access back to her data, 
Daenaerys can get all her pending notifications, and give access back to all her data using her "previous" key.  
