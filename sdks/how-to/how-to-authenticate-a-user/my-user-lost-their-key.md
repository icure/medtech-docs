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
  "id": "127bd5e9-48b9-4e0f-8de1-b13734a28a0f",
  "qualifiedLinks": {},
  "batchId": "816e3e57-435e-4ec6-8b42-5e947047dcaa",
  "index": 0,
  "valueDate": 20230327142746,
  "openingDate": 20220929083400,
  "created": 1679927266338,
  "modified": 1679927266338,
  "author": "ebe4c24a-a717-4a79-b1a2-982db6ce96b7",
  "responsible": "9af2ac37-edc3-4dde-b1eb-9362892f6167",
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
      "9af2ac37-edc3-4dde-b1eb-9362892f6167": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "9af2ac37-edc3-4dde-b1eb-9362892f6167": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "9af2ac37-edc3-4dde-b1eb-9362892f6167": {},
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
    "id": "ea8112f3-bd11-44c2-bd01-337ee6687317",
    "rev": "1-a31d8937a73fd0df4a804aeb0c050b7d",
    "created": 1679927264812,
    "modified": 1679927264812,
    "author": "ebe4c24a-a717-4a79-b1a2-982db6ce96b7",
    "responsible": "9af2ac37-edc3-4dde-b1eb-9362892f6167",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "9af2ac37-edc3-4dde-b1eb-9362892f6167",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b19c234107a6bff5d98f5940a8f9af44ac7078a3ecb7c9257444f615bacb260e79ca80d94c85cac601b9e98e85238a63bc6d3983787841d74b2dc6f6cac0e6e6b3369e4cca21be9f373814527ffd789219023ea9d450adba417fb2f1687e8380c1a927b4ee5222db83e93b0bb7eb875a7616afa78ebdd3956bee7ee49edd76225d506c0780e46f98998f52409dc29b09be7e3958b2efecca2d676617a42676ae7db63131c082354e2a97a67dd0fd173db6d57d88e7602d3a46f07d0f707f224305fb568388ce49125072a2f8aa757da0a996d75641eacec8bda31f3119e5c915ddd2b94493c370aee3ea648ed27e0366a2d1f7526b8eb62a6b14a3e938a35a850203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "bf6ee14c-857c-4c87-b914-f2d12a48ebd2",
    "rev": "1-b1ce2fe68062c96c6c5965ce671bf084",
    "created": 1679927178323,
    "modified": 1679927178323,
    "author": "18373c7b-2285-4544-84bf-aef3a324c9d8",
    "responsible": "26e0959f-775b-4572-9b40-4c60b1fda72d",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "26e0959f-775b-4572-9b40-4c60b1fda72d",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d3cc6ef61bcb6becfe49090bee4b0749d89fcc886537c6092e9131fcc29a55c037642a08945748515d5b64cc86bd62772777b4d35d570d60bc56adcbcf2079a90004fbd87da29415a142ba09388d5d624456ebe0738ac907667fb413ee83ed926b1ad7bc9a728fc313b8ac56bf85748502437ad78d5beca0888c3e81f86c6f3b508feb9c2556fc25d08151d576898b0a8fe47d05311b7ac0f7123f15f1dca87e35c75a726ef2aa0ee6baa408b7b4864407b5b623f03847a42463499dfb226fdb541f80ba840c4b9ebf8d49c79de791a0cb93dfeb3d562f156c0f5c239001005843a85939f06bf09212e0ec7f70ac05568a2a35fec23cb719d49f8adca7798e410203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {},
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
    "stringValue": "9af2ac37-edc3-4dde-b1eb-9362892f6167",
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
    "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b19c234107a6bff5d98f5940a8f9af44ac7078a3ecb7c9257444f615bacb260e79ca80d94c85cac601b9e98e85238a63bc6d3983787841d74b2dc6f6cac0e6e6b3369e4cca21be9f373814527ffd789219023ea9d450adba417fb2f1687e8380c1a927b4ee5222db83e93b0bb7eb875a7616afa78ebdd3956bee7ee49edd76225d506c0780e46f98998f52409dc29b09be7e3958b2efecca2d676617a42676ae7db63131c082354e2a97a67dd0fd173db6d57d88e7602d3a46f07d0f707f224305fb568388ce49125072a2f8aa757da0a996d75641eacec8bda31f3119e5c915ddd2b94493c370aee3ea648ed27e0366a2d1f7526b8eb62a6b14a3e938a35a850203010001",
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
