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
- [Data sharing](../how-to-share-data/index.md) or [Automatically share data with other data owners](../how-to-share-data/how-to-share-data-automatically.md)

At this stage, you should : 
- Have a patient user
- Have a {{hcp}} user
- Have some data created by your patient and shared with your {{hcp}} user

## Login and create a new RSA Keypair
You can't find back Daenaerys's private key. Depending where you saved her private key, it could be because:
- she lost her computer
- she started the app on another browser
- she reset her computer
- she cleared her cache 
- ...

Anyway, if you want her to continue using your app, you need to create her a new RSA Keypair. 
For this, start a new authentication process as usual: 

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Complete user lost key authentication-->
```typescript
const loginAuthResult = await anonymousMedTechApi.authenticationApi.completeAuthentication(
  loginProcess!,
  newValidationCode,
)
```

The `completeAuthentication` will create autonomously a new key pair for the User if an existing one is not found.  
At this stage, Daenaerys will be able to create new data using her new RSA keypair : 

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:User can create new data after loosing their key-->
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
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/newlyCreatedDataSample.txt -->
<details>
<summary>newlyCreatedDataSample</summary>

```json
{
  "id": "213aa3db-25ed-4fba-8f7a-e4e2360ce287",
  "qualifiedLinks": {},
  "batchId": "f6859a6c-cc3e-490b-bf1d-580f717ee4b2",
  "index": 0,
  "valueDate": 20230328100123,
  "openingDate": 20220929083400,
  "created": 1679997683150,
  "modified": 1679997683150,
  "author": "d4ed8d59-bf6a-42cb-9d25-25f861b56f28",
  "responsible": "df18183f-fabf-4f13-b204-0650dc68c7c6",
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
      "df18183f-fabf-4f13-b204-0650dc68c7c6": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "df18183f-fabf-4f13-b204-0650dc68c7c6": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "df18183f-fabf-4f13-b204-0650dc68c7c6": {},
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

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Data owner gets all their pending notifications-->
```typescript
const hcpNotifications = await hcpApi.notificationApi
  .getPendingNotificationsAfter(startTimestamp)
  .then((notifs) => notifs.filter((notif) => notif.type === NotificationTypeEnum.KEY_PAIR_UPDATE))
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/hcpNotifications.txt -->
<details>
<summary>hcpNotifications</summary>

```text
[
  {
    "id": "e41382a3-c508-44ed-b204-211c14e3ce89",
    "rev": "1-986a6a5caa1b3c90f53b3f0f5824dae5",
    "created": 1679997681218,
    "modified": 1679997681218,
    "author": "d4ed8d59-bf6a-42cb-9d25-25f861b56f28",
    "responsible": "df18183f-fabf-4f13-b204-0650dc68c7c6",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "df18183f-fabf-4f13-b204-0650dc68c7c6",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100db36eb19d1d91fb09f892a9c6246768053d0307eb361f5c48f2ff63e7c5a5a0860ebcfd996ae4c432215fc7263b64251445f488c3ac22d55b7a661fce523832c775292d39420b72b855d8acb3c2226de7e021618f92c61bd97cd4c5c1c3f0a82fcf309bce96db112b69ae116d479c98d23b86a78d192dd7575a2bdeb9c689135b5cc1d8b2b082a59e4b04db056a9b4af81b2585e31492c8e353a81232efbb9a8c4f500478a3b8084d9d44c50c1cd67ab67fc4e482a0d54c62ce0232ef0db65275bf369a9df570560cc9c87e4d67dc46a68d96c44178e9c5643acb2af6a6d38b00591b1b949257abd45882af9955157b48a2743623aa18e9caadf3c9a2749f84f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {},
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

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Give access back to a user with their new key-->
```typescript
const daenaerysPatientId = daenaerysNotification!.properties?.find(
  (prop) => prop.id == 'dataOwnerConcernedId',
)
const daenaerysPatientPubKey = daenaerysNotification!.properties?.find(
  (prop) => prop.id == 'dataOwnerConcernedPubKey',
)

await hcpApi.dataOwnerApi.giveAccessBackTo(
  daenaerysPatientId!.typedValue!.stringValue!,
  daenaerysPatientPubKey!.typedValue!.stringValue!,
)
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/daenaerysPatientId.txt -->
<details>
<summary>daenaerysPatientId</summary>

```json
{
  "id": "dataOwnerConcernedId",
  "type": {
    "type": "STRING"
  },
  "typedValue": {
    "stringValue": "df18183f-fabf-4f13-b204-0650dc68c7c6",
    "type": "STRING"
  }
}
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/daenaerysPatientPubKey.txt -->
<details>
<summary>daenaerysPatientPubKey</summary>

```json
{
  "id": "dataOwnerConcernedPubKey",
  "type": {
    "type": "STRING"
  },
  "typedValue": {
    "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100db36eb19d1d91fb09f892a9c6246768053d0307eb361f5c48f2ff63e7c5a5a0860ebcfd996ae4c432215fc7263b64251445f488c3ac22d55b7a661fce523832c775292d39420b72b855d8acb3c2226de7e021618f92c61bd97cd4c5c1c3f0a82fcf309bce96db112b69ae116d479c98d23b86a78d192dd7575a2bdeb9c689135b5cc1d8b2b082a59e4b04db056a9b4af81b2585e31492c8e353a81232efbb9a8c4f500478a3b8084d9d44c50c1cd67ab67fc4e482a0d54c62ce0232ef0db65275bf369a9df570560cc9c87e4d67dc46a68d96c44178e9c5643acb2af6a6d38b00591b1b949257abd45882af9955157b48a2743623aa18e9caadf3c9a2749f84f0203010001",
    "type": "STRING"
  }
}
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/accessBack.txt -->
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
but not only: she receives a notification as well. 

Therefore, the procedure stays the same, except that instead of waiting all data owners to give access back to her data, 
Daenaerys can get all her pending notifications, and give access back to all her data using her "previous" key.  
