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
For this, start a new authentication process as usual: 

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Complete user lost key authentication-->
```typescript
const loginAuthResult = await anonymousMedTechApi.authenticationApi.completeAuthentication(
  loginProcess!,
  newValidationCode,
)
```

The `completeAuthentication` will create autonomously a new key pair for the User if an existing one is not found.  
At this stage, Daenaerys will be able to create new data using her new RSA keypair : 

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
  "id": "8db8dbc9-7047-4939-94ad-95168aaa5a04",
  "qualifiedLinks": {},
  "batchId": "aa49ecd4-5786-4419-a1fc-5f6bd4ec8c5f",
  "index": 0,
  "valueDate": 20230426071903,
  "openingDate": 20220929083400,
  "created": 1682493543362,
  "modified": 1682493543362,
  "author": "cd103856-44d3-43b7-b1bb-9e017834d4bc",
  "responsible": "fe1a337f-0019-4270-a40b-cbe4791d9cc3",
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
      "fe1a337f-0019-4270-a40b-cbe4791d9cc3": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "fe1a337f-0019-4270-a40b-cbe4791d9cc3": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "fe1a337f-0019-4270-a40b-cbe4791d9cc3": {},
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
    "id": "ccfd971c-3eda-4559-924c-e0f2f2e955be",
    "rev": "1-fd4834a4455de28eefa71ff6ac9f8a1c",
    "created": 1682493540541,
    "modified": 1682493540541,
    "author": "cd103856-44d3-43b7-b1bb-9e017834d4bc",
    "responsible": "fe1a337f-0019-4270-a40b-cbe4791d9cc3",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "fe1a337f-0019-4270-a40b-cbe4791d9cc3",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a02820101009e0ef3c4332f072dce171429ea0f8c9ba6804b2db8dd27006304b44f75583e3d83159de73c47c5061e1a117f4ecb1e3c331419d203ae64d854563596a846f4a9dc216933a672d08a98e5526f7551872c04cfd83bf7f02d22c4ad44d105b05dc7d8ebc30faeedce7822eb9ba63d321b6419dec5aaf83b630d538e5cc862c0373b7922978a7e589984da25ce60f340430286455eba428b1645b4843d3f66b94c34eaccc8770a959492f2188c1ecf2cf1e747e0f9a5b5bbc5bd02d027544f53d6aedc56d713a1369d266fa8f18f563cc8dc7a77ba38095747797d1418d5356755d3e642c5c14436e9482eaf736ee542f3c8454a0416424c217ac7e13dde44ce935f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "fe1a337f-0019-4270-a40b-cbe4791d9cc3": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "fe1a337f-0019-4270-a40b-cbe4791d9cc3": {},
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
    "stringValue": "fe1a337f-0019-4270-a40b-cbe4791d9cc3",
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
    "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a02820101009e0ef3c4332f072dce171429ea0f8c9ba6804b2db8dd27006304b44f75583e3d83159de73c47c5061e1a117f4ecb1e3c331419d203ae64d854563596a846f4a9dc216933a672d08a98e5526f7551872c04cfd83bf7f02d22c4ad44d105b05dc7d8ebc30faeedce7822eb9ba63d321b6419dec5aaf83b630d538e5cc862c0373b7922978a7e589984da25ce60f340430286455eba428b1645b4843d3f66b94c34eaccc8770a959492f2188c1ecf2cf1e747e0f9a5b5bbc5bd02d027544f53d6aedc56d713a1369d266fa8f18f563cc8dc7a77ba38095747797d1418d5356755d3e642c5c14436e9482eaf736ee542f3c8454a0416424c217ac7e13dde44ce935f0203010001",
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
but not only: she receives a notification as well. 

Therefore, the procedure stays the same, except that instead of waiting all data owners to give access back to her data, 
Daenaerys can get all her pending notifications, and give access back to all her data using her "previous" key.  
