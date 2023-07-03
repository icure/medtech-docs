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
  "id": "0157c23c-b939-4bd1-af4f-aba2558db04e",
  "qualifiedLinks": {},
  "batchId": "88eee822-a2f3-40d5-842b-924c450f9ed1",
  "index": 0,
  "valueDate": 20230703111323,
  "openingDate": 20220929083400,
  "created": 1688375603347,
  "modified": 1688375603347,
  "author": "c2625efc-8141-4839-b324-42e91e8da2c0",
  "responsible": "fa3c69fe-b87d-457f-8423-f673288d9336",
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
    "encryptedSelf": "O4DEp5EhkaQ1yBUMaNuEoRoeI6xNK9JrGPMShT8e6cKUlUQ5ggxqpQ7MzxcWNQtSy/IivusJDUqq/tkCk7uMxiRTrROqwJWgGNc7rVS+qjhCZncDAeSf8iiUqB4tJegKJBnEc6Hrgx5Oz6QjtiMGVA==",
    "secretForeignKeys": [
      "3996bc94-3a74-48aa-a396-554fd247c2a2"
    ],
    "cryptedForeignKeys": {
      "fa3c69fe-b87d-457f-8423-f673288d9336": {},
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "delegations": {
      "fa3c69fe-b87d-457f-8423-f673288d9336": {},
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "fa3c69fe-b87d-457f-8423-f673288d9336": {},
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "publicKeysForOaepWithSha256": {}
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
    "id": "bffa2e46-9224-4564-a630-8ff24ff38b45",
    "rev": "1-e473380542e284d82065146fade5432a",
    "created": 1688375603146,
    "modified": 1688375603146,
    "author": "c2625efc-8141-4839-b324-42e91e8da2c0",
    "responsible": "fa3c69fe-b87d-457f-8423-f673288d9336",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "fa3c69fe-b87d-457f-8423-f673288d9336",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a028201010098d95fb9f61dc9598ef3614919d004ede8dab5e548ce100d3e923b2c3b05cc3baa103e8868d8e01283d6fdd842f86045b3bc69480fd2ca013a9a200b84409cbed2eba18f0779b7d47b3c431f8666bed3987020be4745be013464ee78c389e67e243c02b590c199ae9e8e417ef899a374a60d67130f009ee0924d3163f72fd152fc3e0dceb3d31a1896140f610ac66d18223637b1dd81d57903b0ab61babda6df83c53cb801939cfe57dee1b5646f6770313de7f820a833fd2a46c2b4dcd74d132801d32eee770733d3e2c706e9e6813fd2daafba11be7485e1f3076b0cb0ed62e8c5481734e094dc6b82b893408a26226470e08199597ed87b022ba2ad1632d50203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "fa3c69fe-b87d-457f-8423-f673288d9336": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptionKeys": {
        "fa3c69fe-b87d-457f-8423-f673288d9336": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptedSelf": "Lg8FcFIFmRf47hK3Ur7mf24Vfb5n5cNA2b2mAc/ZbiQr65y+8ncGdtKbKVc/5Rp7X8KC7OsKW8q49k0/431ppiRd8f6CD/RB8qekDXtU77OGBM+lEjaJEei7Pz8DRk9I2IvnzJ7rF+j0+pcT6gAI7doDFoLVOxF1v+g03xCXuWVKJj7zYcVhHeeUORXg9Ofg1W8ULEQpNKvh5fy2u3GGa8cF95ISWUcoyM3yi9dpNC5MRE1/L71VUotfAiZeO0kz1YwpskIUKNXsVqXugKvUTZ/UwAy83ZbPx9LT9aWgUNh2UD9oFQAS3c7ebpa4M5seKCsjAKBLU8xK4N0YwF5QFCy7ZDWBFkGTtjARbEjqi9PBS6NuygTaKjXikLlnJ18T0LuFXzKslpQaPXkJ9FM33XDVzeO0vzh24fVYxqgSg5OaucvZLGabjq7Qc9S7qscMcbXLiHveTzQWviRO/EnLqPVr0CXtO9uVJ4b2Qnv9DFMFtGOyZliwlrg/fp4elrvL9lS9oijYoxACSjm9AtWhtiPRHEsBpqDiMZfmnIF+V/QDO9omwlu68ewC+879yBwEwiTk0smfiyQeUgOW1oNrfuWeAflhe+03pYyQ4OSf5sl0aXCQS3HLRa1tV5D38JMlgqe7RjnGaruhtSSMNsd1oXQVv/59Kjr5o3WFHOdhe8boqDZvYVlwJJ7OjkwGSJ0L2YHulPdDwJNzh1AQVK8G0wc4S7byYnBS68Ls/217y1Wq3ZvoVJEyW+bCq5+aFCUMQcVCMYH7h6+SayUN9gsY5mS7GbobQueUrd9H3KGiRb5MLWhiM3t9KYpr1qPxzDujLPjye/UBapu7tXyD0athhGHz36/xRofD5MaGcY/f6T/w468MQUKH1AncLcuaWPpLo1Ua2T4hL6GyHSH9ML/Ft/u2jWmAUXG9P/RODAD8LKUL2OzlWbkvD5JtljOu40oM8hBD4y9aVZo4w7kqsYRPDygWvY1s6c92QVldBnATzFbUfIAOwTF15jG+k8D7EO7Glgxc+gsCTHm2bE5YDToTyQP7olxsuBBWLStLEcKv/yXJPOYRJTEQqfKvClkTlGDixxtGg1Jp751Mb8DYHQnvQagEzMLk4AoTyOAAXYB3+nOBRAk7ZTz76vOVRt8wsYxhIePs/0Jy2mmXs5QQA39bbA=="
    }
  },
  {
    "id": "37ca63a5-ffc7-4191-8a23-e7aa20b99e24",
    "rev": "1-229ca8ec95fd5280fe6ea9325c1a4f59",
    "created": 1688375601457,
    "modified": 1688375601457,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "64738f29-9344-4a05-bbd6-29d897977748": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "64738f29-9344-4a05-bbd6-29d897977748": {}
      },
      "encryptedSelf": "0cNiqQdFYifihqX/DsztAtxP6C9r4mUzRpGljW6IzoyE/6KOW7TJST1M12KythFJIKTlY5ek9JXKl4cQeWDw2xgUz4GQ5rFi9EGmc9QAWyzUBWBCHlIKI89zsZfuxBK4CZ/yLu29DoKz3LhXeJc53CxM9ON+6LbOxsOr+ZdntCIyk6VmMSLyq5lBKdcmZIW943dM7FocI2VE/4N0aNAE77FiPzA+Wnx/irf5AY040qHezPYyOrckuzYcrCPzpWyK20Q1Uk54JQUvGxmMyrel8PRazsINrRE6RxW/LjMFJzmWzrjk4S+SQBVZNE2TbY6vUQCav0SCVNIZBpSHuJkorSQpUyxzeoKTvmcL+0CI1iJ2hdbbMdylMOKkSbgld3y6DM4GemgMPQKesCSdeaT0nFs68U1yydvayCiOM9rsx1PumVlXqmBpcob5c+HzHFOK7X0NiC64sfjHae3+3bqtSZn7uWBXeQPVBc6q80m0vgz505+Lley6RHvbPHTIX44tQWfI3y3Jete+03VCqHMugpezetC6CqIxwU1OseuJ2AtTVU4mVjB5QZPdrG+KTILXrfAFnFR0ZQ3cNSof6b61QMISGlM3iKBSfehXO2dcuBMLM0bPSNrsiIpuqugQwvhM+oPxdiBUl9cqCmVnWK+z2qokXQUTuuM1Ctd/+qoixxO3Ga99jBZbp4/eXJIa3vVtohMV36h2uuN9BlVf/JCVehgf1o/7YhZnChXgLGxuJN0dbNlEgGusOWoqsz+M6fvSSA94/i3GjX6YXK1Ko2GiZvQpk/XSi2LmIOszMWleyKvzdHvnCsOKaOoYoWRUfY7SvCJPDA2YEzuIZkx2rIXsCrTMfMn5EqZP7qi2pflVUsiF1umC7t3BOaUsr7STVWWZnclicNYOH0fR/jCE5LO9NaqlmxHdyL6P2CAPJqD4yvmh+ezYDJ9199HBEmxf+RDWSQ4GzkJ6OoIaz6/pigHrv4KPZK/IJycNhPb6inPaBRDmFxpEyU4fO2vRE/40txv+EffDtUHM92lpWCHMPeb9zyLHnWlFi7NGV1mJKhdlqFwFXrLdtscXbXKbPpmG8tWm2Wgfy1rwnSNBSZfv2wnk3c6fAictvKLBXZACrqeO3a951z0MhQLmguPBJF2946dg8D1nWxZcD6qvXA+nygHn3w=="
    }
  },
  {
    "id": "62fea0fa-081f-492a-bb55-c51e8a86767c",
    "rev": "1-262844385c25265a4142789c0ee3294a",
    "created": 1688375601382,
    "modified": 1688375601382,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "b69cd784-cafe-4631-bbcd-5d8a357d7f47": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "b69cd784-cafe-4631-bbcd-5d8a357d7f47": {}
      },
      "encryptedSelf": "TttTALw6Gvi0jrpRuciK87FXAwC52HCcLO8zYrDq6RWGfEfeKBPoh7bqKdV5zPFsDiT0uW7CnbmGxaiuJZ5zf1qFRP7M7HOKFPQlCBxX1efH5swl1ymDAwV/zxvYRunSrHRyTFng/PWr/mruUUN6EGDQvwuuO3yfh0rNOTmeaAW6N3N0cTiynoUbRTZmIyqvv6z78Q5pzvXkC9Tsa5rPYzdI/b8YVety/7O5axnY8c1jTj2vWAxv+yn70DVl5zUSKobwMsztBb2Xhbo4V7yyI1qr7tPImV9xUh8hTP01hw9IaJQPYEJADqC1GHdjwivX3U9jzPR8VJyy4ebY+jvv0iGDYJarbgnSE3kU647CblpJmQbsOr3M6jA8IRLEYHQIiX8EaTyX9SEIutdmcW0ZEnFOy8/EUMlNDcPGDgiWcPqyFbVZx5Mv0lr0O5AqnrWUeNJHtX3mKwVSyEZCiYIGKeoOubco0d1UzeefmoCp1Lg023Ie9+Tg78xOw4byC0jQqbG8kSMqgnRewrzDWvOBGhRg8BUxho8yzeBMlv0wxEljWB8QFOdUaA4xkSBQ7GcgUiEbjuKs86iJGHZilaU8xYQ7xnO2R2RyIltD6tg+GNdT4LGJIzzDAH6QS97tjx4IebppLnnq/hs4ByB4N4RsUafwEuliWYX0VcOP3SXHxQpMigW7bb486vCFkA4CSaqk/DvD9zoXrW/fFVuYvX75B3rPy8khgsS2hbXTkIv3GDWnJHYrdLxi94P+suYn4B36hMLShkZBXRKOqlQDtYJY0ahAJ4AGaCG71fnsqLkpZqrTYkiArulTUvrm3QpogjDwG0pPB2JbcdvKdXGyoS18azW+LvyexGOHHgfD0fEu6gJXCtUMjMpCtTb62FykH8uSg76Kp/kb0NYvUVlUnPqdfOi0ZSqBMoWfPzkmeYn8nIcZWSAhro80fLufVoG8XVYXGXnuMOXL+r4fMGTM8Gacursx5vA84Xg/qrYdA53CAgu17UrFqEaWfWzvryYxbJrIbcXUMHfdc6/aziPGk2QwTPGLN5pU3hHS+4O2xK66WS0b+KANbpaEujXJR0zF3TY6eBMZWEjNVmvdJk8fqFg5mhlJ4CEToZcsuDUweapB6RMNGL3AULVOXYZyDokcxytmWlFbV8enY6dO98iRiC+hkg=="
    }
  },
  {
    "id": "6049f6d1-a4bb-41ee-baa0-a3db87c26bcf",
    "rev": "1-d14712e0f2261f4ff4f3bc7cfd6054e5",
    "created": 1688375601303,
    "modified": 1688375601303,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "c3a36b79-4332-4881-b5a1-615de69fce49": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "c3a36b79-4332-4881-b5a1-615de69fce49": {}
      },
      "encryptedSelf": "NR6V17IrsTy7pFX0eCT00MC7ujzzOzPJuplai4bT/sUwV8nPPYG//cPXoOf63UHDEZwS7/HU/+6KUJbs4pg0gwS/Hd2nmFiP18XeiCUFsHnt456Zm791CowjS+JMo697EYgrLp5r3YqcSC31rYYFjHg/GAE+u8fCTVFyUg2CVlbqHWaqEwTYS7R2A4cMuDchD6dPJRjZHa4AvKQ6j9b5t3iJsa9lNwIZXmgOf43QKHpjVp4FjSV1pQpc1pUJrwtToHBSZLdXsLrNFu9AAd6zPrFT1pN5DqcO4x4mqt8u3bRTiWwjustS8ZhiQ6+scpIGy6VKmcnI6UhTP3DYfsOmxgzam+4prrEGCy8shtqqpzEi68K+NB/TVdi4eJszuoUVBP6pj4rdrY+88Cj2KsYcEXTxJbixMtb4NVo3zsCgNAMh0K8nzZ3ah/ZrfTsGZAOWo2NhNr2jffYbqydDUYgS+tC32dwhi4QXVvIINFS2DbH01lbnkj+scIs5yY6aIfp0g9C2XiC/HDATjnZUwiN6Dk8eBXMV+WAtmIKImdmJtroG8fWTKkcW8TLMcEL+b0LdgbOKA4/i87eHkBVScW9Sci3eaSWNdd2/JcXHu6s8cOa3mAnRmzRmqVlBTytAQ/KDvsUg2ct9XOx7uC/bKoYhR9z2C6f6n02RYQG9nr5SOd+sn2jV44eumkJpaXQgiNmu2JvjXyMMvkckKlH9inXrTJ0+a21OoHLkOPT++XBwzAoZJE+37PL5SR+8hMaWwV5muLMnZ3QyVEgfQ4tVPaFVXCNc464hXLGJISlO1U5MDx5LmHv8Ij85XM/EutoOSfebfWHoHlngmw0Utyj6ZNIs4LUUsw+t019TGJ1blCoB/8dgYqGYoxdGUFMbYTb1oETZ1QzRtWlUasriw3CEbqv/R4BPQpX+DpLcwP+7b2NZv0YuiqUvES/PzdMBmrPUWKHTG9SDx7bkO/SyUrvjRRU6vA5euJIzNZ+p98v88y6MsE7Y8VFdx1P3EIgl50YqOvGtr99PcQH2dJiXXgj3AbKe+lOQrOWmlmob1FCzyUKm30IlMZlXRBAiuCbL+WBxM/6giNGOPKghb9hiksXZ59OYyVcowwcx86BuRuf0DMt7GGF0Me2GPdsnVBks3d9LYGL/7pCARN+jsEDA2FXE4029oA=="
    }
  },
  {
    "id": "24b43d02-90c7-4109-95bf-9564c53446ff",
    "rev": "1-ea5cd59de79b6db3cde0cc856c401828",
    "created": 1688375601222,
    "modified": 1688375601222,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "80078469-1e1a-4c93-8690-dba0876b6ae9": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "80078469-1e1a-4c93-8690-dba0876b6ae9": {}
      },
      "encryptedSelf": "ddrIW2WIehZliOD0BCHZj5g2Di5CNOGIGvNVDu7jMtwEMerxISa6z1n9KNNOi9jDBnRrxbVK5vHLHe8q9gi8L8klcvAkJn7AWl0uGLM6fDdZixadh+pJvlgri5gDbOrmMYOoaxPf+lLeyIpEJrSrcTAT2QWbidIbg+KTTGMJrRBf2FRuh4V1K7v52+yGpBZKQi/QgnMjArENhC9S8pcjStN0GY9kmsya2HKk5lwNy4viTYTo25jfghV0txksNLoranNfZie0R9rwRdHSW98yJnBqzyk7vuaxmDDX2xQaz0dtt8k8osFHwcJUjzNYvgiecC/rwCwmDh9D1McC/K39IPbcRNX3IsG5H2tMNK9pLBRw3A8fIxAyeL7e9XgF4LroN2RM+23kkZSrHBwQlTuopRKDv+EQioRRU8bvHSpl0IXL85bO5jGbNScVF07leYnbAz4DgdQaPNCmc6GVkzOq/B23Zf9RWYQQOE+YDSP7vQhc0vOZVm3VFGBXMVBTR/IZOA4sKQKfjhQrDMDnzIKxQRhr35vNIFlMUNug6FMLy8kC2LteGYN3nlEUDljsNWBRGBOn0nDpyA+5UrSiPvKySRnOGeOVMumoOKg+7NB492yoln1UqastZAKWjdoBPUvrjlAnK9HmfljzglUd3Yc0JFi3I06eiNvD02g0Azwc/v8x3f6a6xCcydBU3fuzl4L7srFw6zmi2ZLW6opKTU3ewNhrABMS35qO/kqSGnhOG8JZY5PsSJqBL6YhSkiy6hCnG6slq3GBmIFu0mzFqRABlAmp6YFAv7kuxirJjjglpMRnx9sYLDy4vU+q20rBD7dwSTH2fdsyMCKK1bCGVG//S6Gk5b4NB0+x7KTiw/owE8XMWubZ0eax9Wi9hOMXToBUH2bjoDPzUiuLVOSC+JY+izf3DvfkqGJNjKxFLT8ZBfLWpIW8HtcpRa9XXf6Hi+VYdsVOQHL+h7SygfNpvNYA+L5+65DDIjQVW2DZH6TWrehhy633yMMbqe1tNlpdLJMK5YWrNfJKoLkpjHfD67pgLmD7r0vkxNI79bKMgkBko/K3bfy1YD1zFK7wqrl6C5mWXc7YF6U9iCfIWGrQwCa+IjKiX3o4Zg+cDNzIs7vy59dmWRB4NdQ1ab5nK7+UEkxrcBIWYqw+XVX9cTBRbmsXjA=="
    }
  },
  {
    "id": "42ce0b35-2bcf-4468-8b73-81fe891c1cc9",
    "rev": "1-06ba77bf730a89353dd2cda58211a8e6",
    "created": 1688375601136,
    "modified": 1688375601136,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "c53dbdcc-4394-4179-8c68-15d3a45a1bff": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "c53dbdcc-4394-4179-8c68-15d3a45a1bff": {}
      },
      "encryptedSelf": "y/Qqs2hqy4mZzVkHvSA8sI6zquCn42k9phISWpjbmqcLFii5U+8nB27BpUohUPQMWZtKDawd4w75vld3Ow1EXCOSIMPbQe4Zd6cyhAa1F+4bNUyO223KjjNuQzI6U4yNGBZEu868oxGKYcBwN91PB6dLj4vsJ3QxiOCcMSHGkUs6yI6nEL5fD8DzuACcyl248PAOTh13TxrIf/VoEtBshc2H1YsepUYV5zV/DyubFEWTTooCzaK+jDm/AxcXSTK9L9nGcAhmcX9qxRUGVdCSZNfx0CbIcJkCv+/LtGiH3QQucNeyTY2vmj+wYE0JWOUxvdyFDln0EHj0n3rv5g5kJ11Gwql6TDOFz+ph2zYMl783j+eS3Ti9tfjTmYs8qGsw+xyASoDzBAlcO4do7nt1KWsXYnU/+Uzbk0isyOWXoLJ6/6YPn3apK0EDb7grhfpfwjjwkusHkZmEsbydqV3Yszrw83Ve544AyJWtFkIYvgIyLgx1g77Ir+8xn+Y0hZnnlL1X24gij2JDskc5IBN1oPYzpgdtDJ0ms3p4JfM7NVgl3/haZBPPg+d+QlYcFcU38w+JtiBRhXSnmpVttm6VrQZmSNb8x9c3a4YhvxJ4ItU4jVVzu6Twf8BEs/C/rkhwb2pgijJBLVB4Jzkvrg9mzdD+7Jy3RMb52g9A8H60WWqfxRTm1Cll1YRLDp37VmH4rO6RZtINha4TjMUF5hpvd5QzSU/RFRTeLuMS1D932nTsvIzlFWKImWb5CVbVLmrNxCmH2yIxxmWxVktEhxu/ZuVxyNpi65LqBQpZMHi1EcckwwZdtUMFmN1Gik/tUBOUX3O4XhLsue7TE2gAGz3gmwYV2nebLwrs8Y6+RLsWdfhZFeuv68F+GVN9Hnq8xRLOEMxG+bNe3AwwdpveNAwbnmcFb0sNuA3uH4+C4iQ4TRSuijbkjpolyBOsNmbb+5bXsQfOOyOmB4rySQwBzKoIyAsmLFVHXc4Mx0nH9mFjg1bJZas2b3MqBd8MbGXQuPhWwpUj7KX3oWP1dzbwbarbEbo4mIHtySTqEquseBObiRxNPELmtLk8x43U4lCRYPas36Kv1k0KETARqxbX29QRGb4/PodQK9F9idkAW8ms9ORMLyN5T5HNAaKGo8W50xmsGtBslSF5QQveQ+I2q+3v9w=="
    }
  },
  {
    "id": "f6059ce4-1e2a-4068-b3e9-0a9dce93d9b4",
    "rev": "1-cf9e9c9ee5834299872a457b5583ca22",
    "created": 1688375601061,
    "modified": 1688375601061,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "cfae4c06-25cc-4bb9-9e16-27b11a60246a": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "cfae4c06-25cc-4bb9-9e16-27b11a60246a": {}
      },
      "encryptedSelf": "apwKrIJBbJBEzXP4ooDV1YL1jwvYiAg/6iQdW5UmtyN7qN49j6yI+sVglrgXLnDCl9rRW101VHfr0q3fbHYiQ6FklmCkYnG6d98hGBtzwYFbWtCJoxvl7fHDMixq8O1Ok7Q2qXypY8pY6euwMM7/561bsMP3eJFznGhywy8VuRpX3+CJSywRzpK8nUD4nFHoV+1uQiEs7fVdodK60vReOWBiQcNwTmIm6/dVZQVwryD1D4zwQkQ2UtXxQhhSHwwKLjhMle89mjSe+F5Z1haBuCFNFiNpzjAINSaEYkyKOT6xhMgW/HRk9EK4fCEd2NMeEp+cdo+1QYEumD8IEUWxJTEuT9xBNP0t5Yag5zIAtg7Bavsz6m6IIiS5RQ3GPaec64z8T+p3kPn1Ulx4U7vIPgJEAevnx7B1wMTwN7uhV2KjUDLQfSfxxAlWxbpNNfJjJVKKYbtsxhnf6mFJgz8R3ZpFxINTXLbUqsLTDTWPR3VoM/ZEEjV9OcV+jjhr9T8Mase3TnYnQVkiqOtcaZAfnBOeJljJyS+IhnvQ0uvmadaHGvZqy2PrGPM501+m48Jtpp1xgWWMqT+FkOMzYvp9WyCEmm08pxEWAW9SMCECJNULdQQVapiPlnTm6sE1lkq4b1qHMYmLY1kEuevrdT5qn5s3rdUWdC+jYjY/CE6e7BbcRlvp8JNyeH2nlHpiwNzccJBlqV/PaJudFvTClLRwhvAf7QZsHPhJnGrIAFpk0OgQPYcVxLlqJEi4IMstw42yc34JmW6MQQyupeEMia296ktIcTHdqhGgE4Un2iwF8VZf0HmZj4N1GkwCSbkHIpWXQnASbvMWOWJYffbpVA3uwWh+SNtmW6FUJeBZfvgNH203xI/2h8AKR6rIaBPR7P8jLg/jJ/HhtWNFlErG5qsz5WFvpUm20Hf+MR+nwsPKf3TW1Q9F6WBNJUAXA6aFkFPTyI5YfJuBM4t+8NbD8gTbrt0sAXf2ImkuJoo1M1AGQ0cB+agzMBBO4DiUTgEyGZ/Yto14yOC6i/buGdU0FVIxUzuU0sNZDY/QMEX4q/JHx3d/agoaHtBQ4GEbIDfPocVJbfB06bN/kibxHwfXm9Y1/c81HiF6gf77ZTjgln6MuIMpCqdP+Cfxdv7jUkkoQM4bTMuNXxEjht3vvZGqaLkTsQ=="
    }
  },
  {
    "id": "c56cbd88-af7e-4bb4-87c3-1c7a3efa5c89",
    "rev": "1-853904f0b719fa04fa9ec7f0d11b9600",
    "created": 1688375600981,
    "modified": 1688375600981,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "07ab3ea0-ce01-4800-81ef-efae440357fb": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "07ab3ea0-ce01-4800-81ef-efae440357fb": {}
      },
      "encryptedSelf": "hWwDv/H3/mdXyYh3YEY2X7kjw8XtHZR3p+Mu3nBb+BBEjxCVff4nkIe9L7w5QUFtH+KGfemDy1SCYP/G+B37YdeOy5cZEPCO+PwKZQOu91Ceh0+2R4RrqyIImDeHWmbDHkCOQoEePoDmqygvXQpMsAVHcWAZLRHC1oHeb9jV78ORHIY0YpucqthJ2aX0bGK/6LH7qDMynriqNrm0Db9gWJn/8bsSueJg9ni98dRiFw7EbhoNQjH+nwxDJUpam1iuqdLItBzXFGL2u83+HKTjnXvNc5uswARtvxgsC12cain+/FUz6We+Ti1hGtJKJKFF5YCZKIXA+NfzULIMvGBLVyFxk1QwIy29K58SwTs58lcZ9xG/jQcpCedsRuBnyqq4xdZ10Yjip7tddgjo7IAsmnZZ3gcF67sw6sUIXVaA0j9oqyTxngXuY4FmPQG48kTLeaxhmkYlOMLoec908SH5ZqjtaLjkHefr65mPgft+Pz8ELcZFBMBe7ctVmxRBLxpPasw81baMgWneeyERvdG4DeB8fxGmDPdsYVgIAqxerO/rVeT4DpGhh1as+AqVxCVcV5XuvtmBjglwx3fT56Pa8yQB4gsU9LtgvVkINYBLqc6ig5QUo0g2ijR3BRsVv23PKm3jSfDi8SSDNDDD95Qg2kECg4Ib6L9Z3UcgEjNynT11zzhkV8tc3wFd7tLwg8aYpNid9+mZ8WOUTjGnhaNyNDVKahmjmGsDNu2iIaJizi87RnnXTrIqVaGdlaFOtPKIQP9kd7Po+aT0R+tBXVsfZXrQL4fWaltyCEX7PCr0S2i+QJkmvTUctVDoCtOZe2NKIdpZOwahWMtiWAN46moHlngrXaGGPwwQeME4aFqrVX+cnFfXfRkNlmCf+7VEqaGzKcBSmSt5WsliWkSSZ83m+rZn5nkFrKsygTZ4XEbNI19calbBYwzx8APTaHm4DRf+rriggOoPTiwH0w76ivVKaWAvZ3Q5wNc3dMFCk7vmbNj3RP4YADx3/+0EVS+3c8l+jWN9O7YPJtiI0NdnhnfBnLVIGZXDxRiW5LR0oDSsOssAglzsHxaKU4bEOqgpjLGccS9/AThU6OU20uBON0tLF0rMiM3DJ8ZE3kRBgnlC4HAOCGK19HfYxmxbnz2qNdRDPx9g5IEHORCymnKLC4HnEQ=="
    }
  },
  {
    "id": "8db88cfa-1649-4ced-b6f2-5a02d1343cd6",
    "rev": "1-fb664d60c8784b2602473dbf3e6d2814",
    "created": 1688375600906,
    "modified": 1688375600906,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "fc6fb8bc-6497-4723-b1c4-cfba4ab80bd4": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "fc6fb8bc-6497-4723-b1c4-cfba4ab80bd4": {}
      },
      "encryptedSelf": "MEs+4Llk3YCo8STz+1JmUDWvgCwQ7rdA1EcMF5vJRJpVNLMicA+UFgBZHP0MvsaM3uRJ2Ud7AsafDuiyYC+s+Ej2/N4b1tvIwmdCwGJU2wnhHY9+seU9RwUdth/3yRMmOGP0N80Xs2c+TthAGvy0NWFjL7YTlKGYiuWQeCOL499WIxgOid8ZShbs3TiA38AMYSvGUOypc6DtVex3jBZjmlqNZGf0qyk8EJ65o3FsnmBHL09nedvuh/uX0W0lmtJf5cCdP0tnA9EMsAmNRwwlF3Augee8SNygkSXZPDqXjrducLThCtiDZVdJ2GYffsxyYkzuyuP7BO3Lf8oEazxJfcab4pfFkEq94Fp7mRD1TEUSjSNxLfhNbJsngI70pARWuaxtE2oaCuxXp4VBOog/fBG9S2TkDIhALlWRE/hzu/YGDa3AfByyDcs3xr22OxpkVWHljthVADB523fJf+Y0GV3O7Y8iQAHnyvVyP03cSVQPRbP1WEDflm3yDDyBHS1WBR+ALmhZ4JWEkgMkGSoUjuWExt78/qiNXecRDxM6zLFpV+M7xyoNeVVOTPPg7VPhNX4KROGLeEgEyeGQBiaQ7JlCpqkhTrByQuTAT4cQTNGCc7FmrFCxFK+MeHTACCStlwXTFJk+zSXHLTCZeiByhb1yBEMp4gGy4nW9R0s388Us/w16qLXYNfGXKcMUVDoCRMQ5ncTLXSAbgnffPz33sSv0ozRz9Y9TYh42D97R2W0NMPr8Vgh5aKn0gDiYfPXGWKWB8fB0ebB/GnRJpuZ4X9PeEESrDJ/QOpe5M7oW067Mh/gRx6wdA56cMwfZb7ZmfAHngHxPNF12U6UPlDthZ/3QPKxr4q6F/h+TmtpJGnJ0B4D306RcNNfpspC0LF754ehWic40lLA9o1LtT7jAC28pJwagzj5fkMw50WBcckguC2Dwyt2ynLr1q94ER4fhiuu/ABLfvgtykQJRyXkHnqJzDFdSn/lZfU3Xrp+NJs9gEe6PDe3z+cbpSIim3mQmG5YAMK7WN1qsisIKYbVhmsJdxf4T/bpd4PTS9P2VgVF5iA/ob9nM8GUEELOk3osIzT51eVf34IWzE/zBa0G/G3S/g+ajtjgCc4JiBKVssc65CALzuLaPgJQavh2qQZfKeoXv1GCJrtCMuOtfKRHc9w=="
    }
  },
  {
    "id": "d0de54b8-8ae3-4b99-951f-4251fa615778",
    "rev": "1-5364625b9b8a1e6fab8b6d9c05f49d11",
    "created": 1688375600824,
    "modified": 1688375600824,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "05098221-8e46-4a79-aa29-2a877f981de0": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "05098221-8e46-4a79-aa29-2a877f981de0": {}
      },
      "encryptedSelf": "TOPtvbwWdO+XEGQjUAvUxCVEsgn/BVh4J5/fX721NqZ8jVPKOHuJDHFbG6V4sm80XkBGBHRz+wn+s/G9Qjlj5P14jbqrmDr66PAQc9zW7AemJqKfK2qy0UJ9kt8MZ2Vzqq2QwZCcT6wPT0XhlTy/bbUO+s2o1i8RY8wCDdACiyCIalg14nU5Mi/f51yn9pkdJRHUcITD5wlS7WF9SMgPPDZktdF5eymwpQJ838y7H79OQwtXMU+lCDEW2xdE3j8Nkaj59Ew5v1sj+hopgt9k0SBLH+d2XK5hcxIuq0UmEawH0WXEIM2udNtSt7dUphCDEUB+NH922fjKZsu7GYMgtlljz9a3Fncl6mED0wPiFvcf+6z7NcT0KHeBn26gqPANMknj+iHknoR2x5PANmi9TeihkdsVSDeUiM1nLg1zseiL5Mofz8dg7Fgal2VNgsdvBjQZqDnIN22O8qBpnIA2KWTqHLniaL/4EFyekomtv7gAVa2lhCS6/8VTZJ6elIBN9+0yjhLdNXpYrpCz1WIAl9BmCjr9fG57Ue3zZu+SKowYdC7rBiKf3LtYZ91uVqlCHszI4/yp3USHP5qm1HhdSLGbnkOJRp3rKtnKIBSpD+QORE6H4LyUYgAalflSGb11iwreZ9K8Di1by4lKrDtNbyukdRNM0DRtkQzu3Vujdbmzr5rvBWG/xXsNOlaaRfiaZHhkNtmVGQclmPQ8XpWWg0zHikT6nBH20mAbxIhb7eKoyMleu0842zDtM8aujGRLt9wVNO2JH/rMzCYfTGwdd4YNa6bXXJRSe9LT05InRh/ppBOS26zgnLlUbumrA1mehk8W306agM7xsNbhb8cJh+KcVlubaLyDMSFk4L8YcEpP1gFeBdg/IafhB5y35+UQnTCtQbG/DMDRK+YZ192P/nTyN6hMGv6LCigJFP4G0jqCYppuQhazO3phrhdkGmVz3nRYdcDO4nQT5i34c8z8jeA2IDu5wwotfBnnERUEp2GkjqeQWen7J2Gg2bTEnR4eFKS9tl1xQ0+jlrUb4JQlTiTAPdgFRcSlDZQntOTFLGk+oIYDIL0QGQXiAPKm9KUdgYxJA6tvUlLlSg/J6wirIhfnOUZ8zJIuTg+CssHUWWtJbPj7QpkJHQNDu4NNjL+z1RxBm03NB7Flbpqj0AUA/Q=="
    }
  },
  {
    "id": "b107e781-82c5-47c8-86cd-3ef6fdf0b2eb",
    "rev": "1-54b997be0fd2f9352925351b5fa32c63",
    "created": 1688375600745,
    "modified": 1688375600745,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "bba6a6db-ea35-4784-93e6-98bc50a980a6": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "bba6a6db-ea35-4784-93e6-98bc50a980a6": {}
      },
      "encryptedSelf": "gFTr3hnU5+QX1q8/HQgoy/Eo6MLQkX6H4W3OuOFXOXJn9IHs4ImuTneAIZwDBZ/S9NO1p8LjcdmyMGDcoD0mFXT6qz/y3WnyGmegABbQEt3Lk9cXDBt2wkrdyeVdENYI+MN710OZSryI4kzoM1gXFePSUX7Q9ZOsLasmu5XpHr/fB7yIltrr0Lzk9RC/68sKb+dYXbNsTI28Iwp9vj6NS99SovtEiTjTblxF4gGvfnhH1QocSaBn95nqN8PrAhy8IIIjdgvn4PfHnEmgQgz1ZN8Q9s9aeEq/yX2fR7DChrlAMRTyE8eKx5p3d+w/E6FVsHd5jpJgyQHW/LdOAqMjCpZM7+0HTys2CWOlZWIsTh1NHPEP1zSBpTZEWTLjA2OpJYuuGrp75fb9L+qSwC5J2DwVQbvwG/8i5gSW+Sfhv6RsN1IEynav8VqZKBRFtUp9iB27mdQO9tYywaO52I1WEOnol4J9G6nN4MYTEhjqRlalT29wOewylZQDxLfZw+pWuMOKJ7q8TEVOVopEHrJWYgw/n5BVWebP9UtjcQ3Qcx1tg9UKWmL7wr+pKMvO1fLdM/9We23WFneCWPt65efDaFgEKVf+OME2lAfTp2mFQ8aoTNlqCfLslQuU7kssPWzG4BKcDzfCCbpFISGQqVkeByAeMXbFomNwU1u0wHxc8vIeatFKPRfmHKdjX22QeoVZyoetKqTgKQrgjUwlDxOyuOSYQkAjqcg+Ua176asyswxWmIvO4bq8/4LY3gUGYy99hAzBTXi9RIunKFMWcJtAB1rgYW31wrBBiWdfddMhfnW4qZzt7d8ifR+is63Q5v2cQEPL6BkTFHnCePNN9Ckoy0zb4BMFcizJBYoQ/ysIHs8Z6Rk92/BJiX8CzxRRxP8+ofFDrBZfoqIz/aICYjyrcaxlVxNfiHc83G2K9Xi9ngTiGZMDDwcYQdo5sCrNg8JU3203ledmkKf860VlXHa+XgElhbcD2M/eE/ZRjFONKiLoMl/PGU5j7M5XUWDbeN9Fa6JHFvD+ysREHL8joPObeHFZIi/+Qf5IRt6IZFaluW2jv8VCt41NJq0dayRYNIZQnUt0iG+lptsJgUpK+xAG77IfRtuyGI3W+obRiame7VUBFi/nmkUaEji5vETAy/r4wH3zvv21/2FpqOMwjHIOFA=="
    }
  },
  {
    "id": "12b2cdc3-e7f7-4896-b9ec-e0b25ef9794e",
    "rev": "1-1a3cd6d28a427dbadb9bb22caaa40d9f",
    "created": 1688375600664,
    "modified": 1688375600664,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "f221497f-5e8a-4d4c-bf2e-8441784aa8d6": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "f221497f-5e8a-4d4c-bf2e-8441784aa8d6": {}
      },
      "encryptedSelf": "a2yRrjIBvzhPx3Cscxv9spUXLOyBbRBet+rTWdFdln3b3ma3HliUSgkgSdE5eUq6oxZnnUxsPwx+qsm47WDdvYPsAx/wxfu3L1GWqi7RP5ZOFS1yVlvlJrUWDIE2CsFJJGQQMW6YYTe65shN+ERYA4of+5TjVf5hWeXG/NpvhHEWtYszPrpXk6QBeywsx+lhghDtIokGzihY8Rs0E+C6EkqggAkNUNl8Vyjwk3A+gsXlKJVxnyOewEjkB9b01OMWH3WtLb1RDUNwDq9aT4QYdcxn7ylD+MkYSt6GO/7vTnSJM2c544gfpO13TZkq3hHTTxC8ai4iKnRE2Zr2g5NJwwLG3KoL8R3Yx80zmdz5u+CUwK+Oj/ih/SB92ESZhEsMEVybkW/qUDdb3FPe+vigFy44Y0/pY5nnXM7i1Grz259kFPqDfPgvDxaEdFqPeaeBlxk2ZgQJp0TLFqJ9v8nZIvgTPNxq0f+vIytU/+wfUH0u0KG3fKEiFA7ki/7Ms8XjIWBv1DBZaV1SYSJGzJTFI9s/IkKmOXWLb3EQ4zToVFe7IzWn+D9v/B6MptYYJPbOY7MSTLV9OiHP0/euyEoyYQP0cdnzQubxNBcxh6+sbGKMcBW+dF5QN1rK8g0q7mgkMw0DS6tSoLEwV+9VrEJNcKozE7ASxJztfjTSLbAPwyKQtA+Ai9Ew7+rcYYqhHCGXHxaYbjn4WN0/3fVcfZOUavZ9x703LStRMx8xsx0q1BtNJXcOxNC+xrYCOkcUxsANl1R2AwT8Fzl8u2fU8EAyBGGwF4IcqewRLAtFkqR6YMix5vJGONfYIXczPIFsctEAh1JOkt97DwTMaLNQVXNb/sIXJXTzQfDMmKV24YrMU8Qrk0UTu3xjcJW2so+MoP99N7eu2KrAm+b6wqD5CEKqBmAv8qSedm/pABecqKUbiwErmmoWcHIwF0DZrWPi2uuYmdDhembrRXcQuuPB8ujnYbGE9VXpx1m0S7Eicq2yOA3L6gDu5wRHxd7MYeUokQTFVJqQwrawzK+LV+hSgIL8k5yDwuHNWd30KCRYgphMS++nbdXRq1Z/Cw4XC0VHW+YTT4EAX4diOKjxqA4OOn8SP2pFwM2TTaNcPjZYN/9/EdVE/nDg2RqSUiQraueJEttVUIdZYelReBRquScCYE/n4g=="
    }
  },
  {
    "id": "810daf12-0ecb-4058-9148-41feb30d4cdc",
    "rev": "1-af64ad77c158f96fb4aefa893ee39a8f",
    "created": 1688375600588,
    "modified": 1688375600588,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "850d78be-757a-4753-b93e-6464c72376e4": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "850d78be-757a-4753-b93e-6464c72376e4": {}
      },
      "encryptedSelf": "CYtJ0pPRAyQS102sQxPAEI3hkFvI2vYxM5vnChwTVDPYIv1qLPsqGVBdDHWOrDQolAqef+jr0d9+dp/o2y1qk2b3YBZG7pNM3rVzP+St0HD4avQjujwLPGZsxrnSfPskJSq7zCuBH3t+xloi9nCMj/OMG+1EMBpUHMuMCCO1hMFDiPDrRVXE3K81p7sloMp6+/35/pVBhyThHrU2MvV4Z03YXQGUtd/SDZuy2llGv60RPL7ksZWvJ5Hn9zseSHnvxMnVVTXOlEvU5J9S6hCa99h+IddTRIJiBQvEG5WPf+msmkzbenCCfUSCu4uO6Py2oSCseGFhtEC2j7Kq0hatibiPNvUBxGSogLRGcjljKLf6TGGXUBgCobofllUt+pIzsQsiXS0bv96nRIGAJJrS4gapu5I8Ez0EpzCyTaXqnO+Arfl6Tt2F2O/vM/xuguZaFOXMMAlqap/4ogDa/K2XCWLxFuhdKfLGO8lmBYlny/hrN9ld//XbzWwQQFfXYqzBpq+keFAluxBI29LEwQEgBCuF17uGYqdTs/jsuWfef8oMfgYA1z72gKw1STVK8OIVa9qeoukXL+UxITr0YtH4rOkQFv60y2UZ9uBKU8on6PuTKPym7df8iAmPz7s8RYtWR5Ah1HttMzB5OIZZ4REqY3GnWVigNDSvPM3C+9gXWds5AnSxzNITaCylr3sO0xmH4NLmQCzHr+aNXvsz0F1Ww47FDTtfpoJMHKhzQsfju8o7g51aqPUK5To8VrvZ2lMJ6v4M/bZC/ug9dygGRV6sZJsfntF5TPl6lC/MJ0qe7j8bpbzWs4lmnqKRfrpFIMzTAbwJGGKHm7IlebRDZLLWtIJYv0RpSKAieGwPrfkRAePTiDdr3OyTa703JEiag7pejVV3tbjzVaiH0LWXDdIqM/kUCnop42cVzJi6xBDuJ1QHB4sKEOJYC0Cwp9WQDSuCy5GXvlEaLFunVIBMP6PyRENhybVp+TgxgGeU32wEy34CoX7msd/y2wIr2sjoH2oQuLSIh2y/e8+R03NdDZ1X6qC6F+F2n3SCRW1cNIO4vEIkv9GOZxJYWSX92v9LauNotxUWlfTZhGMjm+1ehPKtZKjcmn5qL0wp7G4/jAzCEf0ZCwa+qFlmmZ+MCnIudD5al5cy1T286gEdlqYV0fD0GA=="
    }
  },
  {
    "id": "77ea37c7-4c5b-4667-bfe2-ecdbf63d32bd",
    "rev": "1-6eb82e01022c9f3924ccdfb3924eee74",
    "created": 1688375600487,
    "modified": 1688375600487,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "0a769c19-adb0-4908-9d71-5ef116f60e30": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "0a769c19-adb0-4908-9d71-5ef116f60e30": {}
      },
      "encryptedSelf": "EltFWwnxlZwQYPqE/MuAB+CM+6Bl3KrN+415ISDXJDP5OFZ5VnAvtGmjye+8THAjCLfmfqH+6GkTyI1v+HepzIhMcAx2HaQ+aXvHOpVHi8QpEqxMwR0EzRZ21KspU+iwniqS3h4qnYj0fOEozXFe1cAgoT3JexaPYV/nh2pom4Uvlbks3Om2x0mi3pv9ymNnD6CdyILlN9QO0Ot6lHVCg92lm5mxsyjUHO9MGp52yKmKawEtWI34+8+5zeYQSqN4FXZRjWhgut9R+Zm1U5csY9irE+4gfwdIT4ls5u41HsHI44QEedMj6QKLZ4c+Fn8DJd52cZolBGutExaqWMhgME8gsce6l/wcTl7RhwBAwkFNH21PtMkt4UWthh/4OjHZ/DvE3yj1U0+thGUPwznUN3vob8zrZMNuuq4uGwCrGJN2lDFHlbvXxwxtcP1y5DqV7UrFHCpQR6JbiAWFn9Ouq7uSjwLZLMAtOO3cKGwQwsHKuv+pOl3xGu28aMC6JzR7WsCsCD5s6lPMxDImR85jOwrp5sbsUDddBUnZeqsnwZumTB9vtD5KYowUuARGX+ORM+RToyREd/zog9rjCWAam2UP554vn24I0pZO4o8sefIAzBh7qoVFjbQxdQ72if9dL7pZbi0+FDpBIeHeIhIvuRtl+WtuP2CxissLUwP9vZf2tSNy+pSWk8twxLjkTU+ENQZf5vYxN0AM7MV/XLZoaDF/Lte6ENnuCTW5+vtGPyp9Nuxf1G++dW0GH/DrsMMqXqfcmgbUIcnR7iAeI4H49dHgDIaFmMPtRupXR+gMX5JUhVGhjUhdPSycsSaQsVtqRkM2QxZnR8EmkV52KfOK4r2eutz+k3Pe8GiiTyUfVRdjeTLX5O7J9KDvuxsULw7Va5iBLKB/hs3aJdopMx+6jyKRJLG3Q4ufErdBoVh6An1sV6KdZG4Eh+X09pwMYwzygkFoay9rY8b1ZQPtOYPp49TqaWRUzuhm3KFIli/qij0SMEVoMPnmP+c4s+ujmbmRDO6IykTJ4+OrSmQxAz5eIJDVMBj9Xs6xABWc1KXBFGpXK3wIE1ChaAh92QQMZ9W4K4q2P+iA1dXsb88aPWKcS93vb5tWj4EBQqEN7f8K1bYTynMxbbpM2gR3LGjLe5lm6gmlYTtWlqFbrRNezRBfnw=="
    }
  },
  {
    "id": "1ac83f51-3a2a-45ff-bbc6-60c42f3b17cc",
    "rev": "1-6235260ba3ce3483b6c58345d6795581",
    "created": 1688375520876,
    "modified": 1688375520876,
    "author": "54dd4958-b313-4a2a-bcda-420cbf3a7b3d",
    "responsible": "e43e1e3f-cbdf-4dec-af94-766a7378c3a2",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "e43e1e3f-cbdf-4dec-af94-766a7378c3a2",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ec27e1ef3080332b2a2ba9f8be20493e43d5f368e04d1a7793294f13c73f8aef2e89bfa23feebf803742c80b39f957a388931eba1b16f6d7e95dd5b0421152f3e24a6b79ad648347af8f77d5c56f81ef3f22a23207b5400f47b251b09799bac578f1f633209395add0d506f9b83ee7b1e4f24813240a2df220fd13eb3a3dd1e00652090db5ccfd25c865cc64731ce2ad7f45236d73ba1fd7e88af7c9208c56a0f4c06ccebaec98b190148994824a2d4d56374894b998fbb490ff8a780840ff4079bf9f1f0c6f5f0752fd9cf9eea9595774f13217139a313e12fd0eb496d2d5db5deaf41e0731bfed9a040635fab27a7c85394f49b53559891f441ef84957e4ab0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e43e1e3f-cbdf-4dec-af94-766a7378c3a2": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptionKeys": {
        "e43e1e3f-cbdf-4dec-af94-766a7378c3a2": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptedSelf": "gQ/GE6RRHLHbcrprh7lRSjYOMYiC9PsEKSO7WgqUUylKKM1EpCBCb8Ak5feRskfKRJQ9TEHCvFeasIIQJl06403Jx7IOTlSOzSTimEK+pm2x8cNKF/SpTBoWCkyzIkEpwlKC4RnmiBFWUwyuiX3yBN07AUtATRPjVRqgIdbJo8pootJC+nek0dy5QewZDjACskSXES25x9+K4r11vzH8f9laM8E/X2fiUOGzeXGcLi0QlNsqGO49PTUIa/EM1KeeP08dXuwlUBUr/fx8pNgXRjYeiK3Wpci6fuih0e5QLr7SmCe12HY8rOJa9Wvc6bQpplOMtgWOs2UEFkp4xJIc1g9WrhuVlfnDfqkCzwjzFWkZfp12tNVZz5afAk8z5cXwnX6dZA2oaGhEsNsVoaKdz/C/xahJxbiHFyr7l42RwIUEIvmCxULdCPBjKzX8DKuG040BbiQt3B4BSItwshyGS/tEJtHWidZkP1meHPVpUpG3PCXt4MbC/l5z9DxFxw8blVoXtGiBgrKtY3YRp1mF7mRecJpTHxVe1aP6Z5/HCcqLVYTtAjqervWtXydyrP35v0dFCUE8sCP/DGF+cz2as+ck2klfYJppZO813d4HJ/N47ko0uhPkBbWhw6nyMPXCehFvxmCgfAHsx8kbrGyd/gJqXh1Dgt6a6yUTg27+4PcNOi1UvwiTq6lyS8fL5XB3w2ZMwq+13/iRg49fGMsP2tubZQpTJ9EaHp+p2Y5QrZcxnIDRpQUAHvAcrUENiMAdlTyZyDLiNYU7pbouGOca91FvXMVXfI9AqsbbDnJ19NBMk6jEUxHxz5U91v2mzq+ZllctCQgvx4gWM1p7LhxmfLa/+6/2GEbYs57sFXRscUU0sMW9p6pkczx1470k+8Wa29gRU2alZhVndH8BaKjebw3aCfv6isGAhfwzvKYPT6VS6PulrpgpM38uBNSKD5FexVkfv7wdlx5CgLKI73KksOHuWKdjcSxiDvb5dCE6jTXxwx04yzqRxq///9KT+kmNYo880ODGi7eSYNOsua9f8CdYEf7KIOrxOBFrYNnHEdWFU/GisHeKz4SSNyt9p1lqHC9Uulw/71fQG9l1pJAvtup2YiHNRbmeC9aqLH7xyVwBAek6taoyhTSfFQTu2sqACrUcQ0wE/+j0p/rYO04vmg=="
    }
  },
  {
    "id": "6fff4214-64e7-4f52-b4b5-dcf0590bf906",
    "rev": "1-d1e9ae083e757c4fc0b041c4c884eb52",
    "created": 1688375519160,
    "modified": 1688375519160,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "b69cd784-cafe-4631-bbcd-5d8a357d7f47": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "b69cd784-cafe-4631-bbcd-5d8a357d7f47": {}
      },
      "encryptedSelf": "fwF6O6MtMDnXrVJMQ1Ix6BVMThni/BjghhjBsNzhzijtpAxNdBVEo60xCmCcAMCxAXkFS9LtrXqUUzfnzmUzBfRgNXFGoIWgk4U4mO/2uXYCZyG2hwu5ilZPU+MMV5vmp1tZ5oHDFiaOkUwTZSWeE/MaFetdxq133ZGQS98n0ACvvTmS5K2yw6KlEa3u+uyygUR+eIxS/3In4X/KBKxCe6CKVYh+vP+qh19DQzjJjNtt+PCQfCNlkNj5SbhkS4sRfqizzI+XBUls6GvPwtHCnVzRWTCDMnkgN4CcoxkYFIgxUo+cObS7ilCv4O34FBuh9KbTRNW/zLTYXa0CPh3PIpPsZtZT1C36EerZmghz1FOwqAPYP4zGLCiAHlxMxV+urH82dkm3KJNOsd4M+4jRi/sQArL7NHzvyhoCY6NUVyV5/B+SILvScc82vX0QhzKAqvq5IJk6TMtcPfbOrGnmNcVi63B50xhazX2CMObQj1GADkYvCKb1jvatMFAK9K3pHEJVLxLRbwE0R2/3pGf9eC+F9ZwlMp0iOMShO1xYrB7qWvyo+9jhGD4wRd/aHrbCdZAwNWAXeKbqHvmMxpKdy9JDy/O6ECqn12TNzONVrcHIWotiDK0jmp87APz00oxkY+0BXMx+eUf82ABxw2ELz0V5nmTtMlFGbyBr4sNLm67q29X5VOAne+2v9uI84t4DyUTXUL+NsAoPw9jUheFSrFisfZy2u1kPb44D6+1oBRgnMcGjbaOTj5KMjr7wdi8IPQCW1sGavirjzGqbXr4lubm1mtGdtv8kaO7bQkTCwnDIC/21oadmJjNR4O3UpJ6mXmjbx9tjn014lm2Aco3d64H7VVGSWJAKrB9Ky0BjIHneGq7q5BlvBjUxnLsaJczmkLm+C5KSIG0O4GJgjYilLHYpBAmRAGzKN7GoM+k+Bk3VLLAPlod1Mv+QDQ95glnGApVBeUw4E4vARwLqFfrU0Qk/JGW96C69lK8MYq9QtVT2rxxFVxyQVEgbNuj0t0LdyZGdBR0eaSXQWn+xt50rMFuKQuAWYJlBJGuqrcrlAMZwe37d3hQDuMEv08mSb5QUcNlJAc/RKLZoi9dn3w/uPbQB7oxv/MI59+m4ha6QT3UUBub6Yun7hN3XJJGajsHFh+NK40gRUaq8Cutp4HNabg=="
    }
  },
  {
    "id": "9359e453-1b60-409f-ad87-34b35c4604bd",
    "rev": "1-dcce59f7bcce8b058aa2537e14e68948",
    "created": 1688375519084,
    "modified": 1688375519084,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "c3a36b79-4332-4881-b5a1-615de69fce49": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "c3a36b79-4332-4881-b5a1-615de69fce49": {}
      },
      "encryptedSelf": "MNjzPDeIs9VkxJADPHYh29tSQQ90FokeveT7Vc/PtRFejLSrhNJcuCFTbt77LU1rUOaQGP0I/N0MBhNM3skPN07J8K/iIQsotYQ9VRM/IFUsiQnssmic1ubTurmW34etQWJNk5uOzgd7M89NZoH2kJlYGSNVLl9mHr3mMCf3yFN18riUlIgkxhxwUYIT2iS0f2Z3XF4VPuekWuhEr7yDfROQ9HSjR6CvU/3Jjn2HF1E/HsigrnZgvdoqLYUJjeQzuAl/X/He3XQi50KZa3qH7y5npLW6glpUQy2VkdNOkFkBY7qNfPTD0/Y3SXUMig5InQJMVPY7MuLsGN1baj+yc33mKdZuFsgmwBI/3BOQIwfnWk1End5oYUhTGkpgvgvFoX+OGVC9PEj2LuS1au0CkAVIi+zravYnNgn5mZ/WaaN8914pcMV9A2lu98t3eF0MVpcTAFL0PFoZ000Dr8J6E4gduYYM8lQqoT1/ZUVhOfnxzzqendlQ5mHseTnyrFScTGzVesjIpiWyRKH0jQRJn3mI1QONxWA48bVuK4MEXtSYAP+bUb+jj6S9e1wolsO8Vs27pznuunSL5+IJ8+HUGqFf5xEYneC+jEiafn4P112G1VeI5ty3zTuWv59mS3lqHUoMvVEtYsF6TiBLqCrm/P8wlF8kClZ3aFFO7hwHE0NCJRALA7MNJb9ZaqnyBodbnXzgzmogwaI4SJW41o8UA8C8GKwHsCASS+JlV5XTYsi1mFrPP8yGO0MXSIcByVoYW4Tp+ncmcCJNSznk4u9heK8W6Hzvj9e9CeC+7+gYsyKmTEcN2OdUI7KukbuDhyVlYavq2fmYP0Ns6HtXFrtiFwmiPT15JqixeFrj8dQpoG0lKYFAO3ua9qoXVGdaoAWbRotIHkbLrhoyIFJhadrky+vYcGiqIauwJzRxBJZh2wItClPqKvNWXsprCVip7Vw0iZo+ji2MMzbFmgVHv+OfFhyed6DKnbSNgBkHtvXOJpAqn6dLqmsjixEzvtTmZs612R7/iQLFrdMfOEtNs7qkt55eDwsbKpnjoVQa9nVALNqhttkSBA7eDJFScuO3dB3hpBYEG0OYtcINeQ6niTeKZ/5TtzeEbtgUvA10mUfYi9PX05OamQWFPscjzP5rqoHNvtSN1rRkpbwnSvHWwqNp0A=="
    }
  },
  {
    "id": "8e9bf323-f2c4-41f6-b09f-e5aa2183fc54",
    "rev": "1-02c6bb58bc6ab200128d8c70ff835b95",
    "created": 1688375519008,
    "modified": 1688375519008,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "80078469-1e1a-4c93-8690-dba0876b6ae9": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "80078469-1e1a-4c93-8690-dba0876b6ae9": {}
      },
      "encryptedSelf": "LH/SY5qqc5zPBG2LzaRM86Zd3Dm6Sw3lJfrcQuVeF2ARQwnr2s7qp3Q6d1O01WWWxmRmMYTDkqu4/Lwl+rDRLvTzpcE3L0qsQQRzDXiCIPiLlKa2BY/+e5H8PcwUNTlouGqjzbOVkeuZha1dz1941vIsBKm1AA2G0m/FdE2dSpOMVvKeCxt7HOmsguOCsk5I10+OP3Nim9z6ruL6NFx3cHCcqX+dtAfJ3xCRylrgAeZYkhl/AGt/LBbKjGRmKg/9Pmnqux1IVVI074ipiM2yqJCL026NA9PCldvSjehAV4yW9AmssNOq4OCS+OfunqZFInr72q/ToSFfSxGby2QxO1sIuxp9B3bC4XCUXE+fUm45tc8oRe8Dt2Li39NErDIqcu15YcYRgPNYpirryH/TiIUFPwKWq4vsFETgb2o0hZysJ+Yz/QjhqT3ouZAMsfn6mPoUmXv9haeK3EdusQcxd+CBNo9JU5S6Lt3fZiSbnwnFU9hMxTuN8AD35w7Ak2lBOUZob3Rk00FZPfBTRGW9eef5JZZwucGs36s5111iYd2u+oQTKu81SldJekKoGuw6vdUxAA28csOODXQQtfgpFcWhqDjiJBzSbn6aOMPa93jPt60JVWEag7ziEbLH1f9iYFM9OzDgl3LyeAmMcfVB5i877LuDFZpNqLgC04+K4W+TA5NH7eNga9BJxP5heun2zb9fYEcbbzw6pEL6fmRGSAnduzFecNJGXxVs45bJhmNjMA/WJTgi4aEBlttH79fRbNcRsct1QRaYQs/bZ+7/AhcGL1i4wQj9GJI25ZhHfGSJUo0OA4mNgzBAak4MBlDIcULDfY4MEryS6PHR3BRc7JzvFS73Fl3yNRpR4gqjQWgPDaNBg0TwMPVbUJiha+syX/JWmjbyEdZtoM5sGUkgtO4ByoUbJXno7Iwt/Plv8RU/Y+kLCEH6cZrmtfH0c6Y1GmM1p5idNkWtY8xJbdgC1BFFaFrwbGDYFI18/N65ENQwUEjRqCDvjuI8eOr1hbCFwta2NJT3EIUT3HbwrFhTsZZFZd5khWYAcEH39KZUvLrKk8Fv8JkORW78Aoz6dB+ikWDVSi6dIMIcp2A913QNQ3tMMKR1c9SO3dvXduEMc3JcDP4bfxr61ehVX4RZl6G+q+VXcf1hvRSSNsC1lpIDrQ=="
    }
  },
  {
    "id": "a66d2606-4107-479a-97bd-874bf84f023f",
    "rev": "1-8670ab2f3b910202cd2d6926a8fda1d5",
    "created": 1688375518927,
    "modified": 1688375518927,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "c53dbdcc-4394-4179-8c68-15d3a45a1bff": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "c53dbdcc-4394-4179-8c68-15d3a45a1bff": {}
      },
      "encryptedSelf": "+sMscq4g3XxF2IOVTHe3m4QsYCU33LYaZUNlEOGSg6lV9NmAtolzW379crqM7nZU5jZIxKS0xPwXfoqn83y6oKRm6IizvdLBaIfgqlpd1gXDhmRfad1NhNHkVkwP+Xppc8UwygL8TEsDdqUgd6noaSSWsEGuIfrjD9sNsfJqr7B5TL+iXYfc4l1yM1kXIPh1NbORfK8+90wDMlppngly5FJ6UmkyJ7UeoCt2EnmPnZSNZpxhZAgrWGhDgD4miYtEKSE8fO0A63cnQxvu10xPVe1uPwFUI2rQsrPCAYdcaX5hqHGPMmS2r3WxFGOvy27OH5FP/z4IIy7g2YrUIO6000Jvuv6mSyTWMYrOrlZCqGyKvLBY3hiPaHnzMVwITfpy7SIerdWXnbJidLTlaraLoXvLXrvtIJnD+ycwUfbpeLDAO5ZvWtyb6j5doXHdDNFUECvcvNipUykKD4U3TeW22nKJQnnYYRgFpmO6bWMNi0s/M5aDUsOMMMpKGhT0khxCww86TKbX5xD2F5ylQ6JC487KxLUeM5zd0JM5dYVGaFxuWcBBb+y7zFvXgWixSGsFfclWVfGWpP/DDe9T9ysLlXfbzI75zJlznNiAJGse3tcDdI3tdB4D205Jl+df3B7K+D8IhOyUA0/aVeWSORZfDD3rVFlCrnK/UCSm1n4oiW4PpFzSP/htD/1TUvU4cj8usJQJjlFkrG5x2waszj3wB0lcUz1A7BOmf4Xnl/QDjx9geg4Hj224g+JpNmoIV05UpGSWU0OB5pWr/n0f4I15X3yC5a/y4iJ5Cqk8IxyCwI5nAMIhrME7sfCdl9U3v2uBhfOTPpJVgP7EgFTlBH83913gLkqNCKj4qarD4LBBqyMeccMmapNPxqO3cp9MM3dk0MsTnmkUSEIQsJtSGl/gk79qG/JV6yD33ufPXr9nT8CylhYvDPceZ/S5wG3VEljpoPUVsp4WBmd0IJ+dRj1ST8EbuAUgnSKn9yuvC0lheC+NJJS8WqhmepvUvF2mH6APXTS87NXyGOHIZ98zZzZHwSou4bOp2Vtxzvlnf5AfjZDBldOo6WJd3HMHtBfJ7fMVkTEVEhNjR1N4wy127CDV9J/Rd3sI3SstxUV7bsVJiSSluBxe2qnw1YC/Go0wg9Rv5c59IsWsIltqPWdFJrbdIg=="
    }
  },
  {
    "id": "69652890-7bfb-40f9-8936-e6600735afdb",
    "rev": "1-668db9c57689d050b7f12908df19c6a1",
    "created": 1688375518853,
    "modified": 1688375518853,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "cfae4c06-25cc-4bb9-9e16-27b11a60246a": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "cfae4c06-25cc-4bb9-9e16-27b11a60246a": {}
      },
      "encryptedSelf": "YwzvnIacwru9mD59iCZI9a3GPjbqOTmfGuInXnZjvPLb2RXHci9e3f4kFKt4Y8nt7JpTH+gxCpdSLzYwEUWg6+IWQAcj9EtAA9u80NTP0GMtHP51VKFmlrcHdSqcpXZroKm/YAKBJKOvS7SqTM3SljtNJt+CllBTwFoBVS+lGLayrvV14+8zbq9oCtdYTl1rhdnWx0fAauCAWuOfKukQR6KZngWjueUr5H0Ax0lYrmHy/nmb+nwlnNQKhv2CtzubAia1UekcJu1RFYvk3MS5AEgXNrAFZn30YBvjXp7iSYMsGQDrb/JFtM+z8P3yBSp21gXXql89sSgF6YWWtc0ykXjkbUU/9vCWgnHA9cdUnkNRm77GbFP+amLG+9trCd/j74Y6YhbrtVCArMcQdTDLqxG+t8ZHAjVip0SilqPI2DrtzBvHHMFbvENA+VovJxjTNz2+p2KkQ5gJirWkPmK+R7EvOkZ+zIVsb458ExmFVp1uDjPaVeRobonNQNdZdYEgvm2hBfplWhc8E3wWWM+U7U9xlPBc/wjDHIVBWxjTwE0iabyCoLhLm+QBAnRGvEH5Hjl9WrZLanXgOEXWCyBU8k0K1azu2F2HX494732pw9QRZdjBhcxjkHSMaAVWWS6DHAKUoG61kpXUFjpOzYmqIoxLND9SLSLYZ3CxCzP5Qc7sMF6R/9DS5z5S66yxTeFxwC3AzQ1t6g9g/KwJIYEu3VE13WmxAEXKL8E/Dvtldp2KiNeZVq0SD8Q4htS+bKsUtXXIywKgi/6tSsR/Sdc2hQMo81oBn5A0qJwcdTD34J049I/juk36/GIU0ooucRohiP0fQGezLOU54tL4CGTAm/IV69/Uny89rPKnVqRJFZ2RBDWVPdg1bAvZApywZWcrLYghD4JxpUnks07tUsDjSs1CYETx7UJOgu/VHeNtVV7oO7iv9ooW9K278GOkoECKzzQXbDfoAsqmmRohrfMcsUYhMBe/8mDfSzB66TX3CQZA2Gz6SlTQUXc5IItn5wQ6pBwifn5yzj/7llaYitpUHVdPNUKZ5B6R9CytUKqaG22q0BfwN+H4j6MNOdJMv1l++luSNrz1Us+p4X/tfjCGFAFAKI1M3WwvPBa1wY5clH2AMsXzI8grKuypFBq0lV0W7vDYp2evk4n2KWOm2NlG5Q=="
    }
  },
  {
    "id": "3879eb4f-d18a-4da0-84ed-e04ad5df27fb",
    "rev": "1-3da1459235e199f6725b8a25f7798947",
    "created": 1688375518782,
    "modified": 1688375518782,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "07ab3ea0-ce01-4800-81ef-efae440357fb": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "07ab3ea0-ce01-4800-81ef-efae440357fb": {}
      },
      "encryptedSelf": "szHB3g01fmFOudObmLOOB95figsdR6U2qlyKuyaBmeeF2iLfxuh1WqmRjJScZUKeb5z8WGlnIA6ugyeUMxMpD5Fe3xHDk3WuBc25PxNUH6dcrjbWdYv0tplcaYTRwnQgJthFvAHQXPEpdw/9ZPbJKnM30Cc1UgOmPPjro20N2aJyzMHUDpjmR/jOAiETYQqAUu9Yuylh1E23N+Ng2nLLO1RQnJlwMxEXpUZZOBK6f99LWsSZ+8JNORVMpuzkRbyQ4LqrtHbBSODYW9r6r3dshSomGyvbov5VSq+h7fzdgFkuFMKBUL1r7831NZoQEQxax65f8lxztA2Xb5bV5m7xEkn1dcg7eeA9Ma8n9FNV5VgTHeoWv+cpv6jeoL+ZCkkpYx+FQ5OcARqOLK3d1pycR+GT4QeyuDCwTN1YyTQ4v1Wd7mahQ0oRb4tvnETqqqQ2nlhgr9JdGkV8S4d2jrnKYnMKBSoZWMUOHpn8giaaj24GG28L0SFcFgM/eDiQI7verU0mfNJPiF9y3ABXGNj+sUh6rIwMe6nsnd+BA52J/zlbNLcnm1NMOGbGcRX87V/V6d0JiAr/3Kbw99y334+yFMwc1GLDAjit6HdKQr7mEUqIPzYSe/Pq0FmD0SMmpxeFqSycl2LMS+ROm+spgiAnxREI1297YWbojTIksKSwjsb4ybUT+k3FbxycmWWXlnqm7XB3+2Hyr9z5jbPKb6mJW88MqpMxCsSmmR9UsL9H6oCtkD5CLsZ1CIlsDktckj8fuXrIr7oCvSwc4hfY5IGfF3gRZtRu8lHTJ7kSQJj06HR6V0Bf/ew5XJsiLuasT8nKUBtAsd+hLiyNPe7FjUT51gvbvCZSL6KjaWPqHEd3S17+/LGfd3zHRgF96r/n0uju8fDV9I3ljxY8Qq5NJzE70YpW+RETilnw8JfsumX9WVzJSZaSGi9mMbVjt/RiGL7a0zsJzrTQW3ycqyv2RaOO/ypoZR2y29LEDqWCE9syN8aZq0wmQafY3dcbcN/m+sbZqh3A2ViSTpecN9F3cVmpbeZX6kbC+LuPaYrsnWmwxWJoCuukcDBbZu7WqfME4dEkjPPbo0TG00j/VNTTsYl+XgO2Ca3kCgwWKLimoUccWZH6rOUlGBDogT/2EEMNEG6I+MtR0Kch26qob/jUAic5FA=="
    }
  },
  {
    "id": "c63b5c53-50ba-4a4f-b909-e77b4f5c10d2",
    "rev": "1-37153d3fb060319f7b9fa440da1bad42",
    "created": 1688375518704,
    "modified": 1688375518704,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "fc6fb8bc-6497-4723-b1c4-cfba4ab80bd4": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "fc6fb8bc-6497-4723-b1c4-cfba4ab80bd4": {}
      },
      "encryptedSelf": "KY69iziqazGILKaumSabyUdWe4Pj11Mb8M6gvmhKuh84R6eEEaMjqJnusWlUGQSOuDqhAH5hMdMOnjkuXdYl9Bn8wHztYfuNw2A4LnorhZU1e7kKvg2tC2+4aO1Hl1nE3X7M85QP/RtQV9fUbcY0l48RbVB50aW05z4uOMe++OjfvKVkzcyXxw+tGX8Vv8N6E816tR+1iQPGuBdBcXqV1Cg3hH0gNRncYFL2wpEgBpjyPiL6UIIHLswOLwR3/5hWKHWyC95DFIE1mw41lmhl5wajjDRcwncxKnJGjZK0ELAwK3nCWh65Q8gTG3t1AtilJCBVrxo23GkIBW2oc99QAcX7BTmHTelQVhR2jvPigIVmV6aOEtiO4k+SHgPzWDqxjvl84pnrA+rsjv7TjO80wL/uIlIrpHT3fiyRmJGAS+Hprldf2NoLXzv2TxIsejKEQ+BPgcXd16Q9AHCSZjtZG9YwoeolpRMLlISMVDsQ/3INO5f9GydEPLmwXrTxOkh/pyHw849Q9WLwDS593e8GJlN/UkFLXPT3S4XNJjD5n8fc3y5r61WaKAamoH8NCYm4rxVhP1KEXZxS54OPLd6r5Lsw4os+Ml9jBuHX70CIb5aNoh5Q3fJSytqnbM/rpQC5AGjFHEZU0Kghqf3NLqc0l28kHc7f4cV7OyPZyTVQlhWzRBquG0RaTcDBhM0fLW01gUYOV2Gjf9UhwlbJm+U69tRLVVIjGV9LmV2MK+eqpVUtSlAUDE8FH72gU+pVx2AjM9VZQnkokL+23OB3pa9vKZQaBw3M1wzaoPPWQ1rlFPbM3eQszRiT08YkU3Cs2k6WCPN6jq2U3Lo2V3diai3CXyGtHpn0bWnYduzw0hHhgqcb2+33lJKH2gpxeJjyKv+FkLpp+D46yzKksNm05WPiyHK8J7CQQ5f4kmFb63KSiU7AIVRvomq1MXfSZsepUQS+XgZcPzqvhkXJR2GesNR8vNL+D//ndZd9ZxPpkm19TQus1KrJSGSrBm1iDDBjigJAspyq/KCAmINL87I7j+ARV7TubAP3lRpjgvHcqyhWjArOSwfu6dM4+0FNtf47qGel1qlZ2C82n84OBf7czLSvDV6pcoZQETs01hZyniLxs5U+wjLsXa63C2EBhVdX0tvmj4QsRt8sZ9ojLGCB8mjZHQ=="
    }
  },
  {
    "id": "7bd0ad91-7ebd-4f93-936e-e9544e061ed2",
    "rev": "1-1e34002f6e46fa551c767b6fbcb57be4",
    "created": 1688375518625,
    "modified": 1688375518625,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "05098221-8e46-4a79-aa29-2a877f981de0": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "05098221-8e46-4a79-aa29-2a877f981de0": {}
      },
      "encryptedSelf": "+wuRGOvhxwQCJhD23xM9QBrjQqBNus0lmNhPLDA94bxmDbN3lh/D35snG9zuOB99TzxnA2GGql1TJhvio1LmC1kb3aFdQ1boMmbncOnJ8NZ2azUru2564bwBhb8URiwwRAQwaaClRgmhvg7COqwXhj2T7pa5fBurZEwPG49MIhJSvPz/cA7dfzkIMCtuzLytTSdirP/egWOihoZ8EB1h9e8gam5GlAHhlDca6BXrGboh6CXWCVHH7Y7lu4j6bJIJtN5MQ/8rvikNKuLIW9ei0SqeHAXMiktUI28f5wL0uzJS+w+D8wfv35cS+ONr6x2Axy1BtQMlas4ICSJKqaa3eVkiaTXVGGn53mQ9g/BSGhLBoG4J+5RH/SZ/9XdXaPVV/ALpjsg5DfIvShPdUwX26ahazh6pv99SD4fJtBRN5nBDJuTA1hiG5FPFldL3jSgnXx4DmRFcOFlG2Qkm0hj1rdwd2W6HehHKmWtDPZmbuaRixLl+IL35OF7kipfo5Y3ib2JCN3sju8glCj8O+v6hilYlaz5TTA7KN7s7MBXGpGH2nsJQ1qKBdVNxD304Bic15wKRWJx/S4l9YvfGXNjn2QOINvbvOJ3YkdXN51X95SaWA8vK/f3Sts3HlacJF+S0LH2a71Xwj86WlQ8ZjC1I9zY6BjM9KaxIGm18Iqjoazw9bRbIf7C/wIhmC8R3afQViN6cMaG78twao54LN+STyqwouN6g18Lm7YvwIl0s+O4u21uFblQdrwvxasaFC9L4yBOokHqqq4WuI6RIS509H/KFkzzBEGXcdQ+zeqHjMASG5YAjKxPla6TB+rG9rgAgVJs1WsWpAr/wKn0TEB+JVKio96FFGEN38OeUM+6jHA9jp1tleabqGuABi2KE5IsWbYGPcaXiBWqJjGJmxeNIDboGWPBnM5kPL7tuVWOphgYGhsRoj9A+dxxXmuRKEHiV3VzKUGkyn17CaS6OdZxgySQ+2WndvNzTnDuHeDBvN4IA28KRY1xzfqSUBQInxCzzr30tF+2Do0zLABAr1Snp3ovue8dmp5cpQi5na58vvOB1zajGJM5hCHxGTyNzSlrdFzq8uGyWxjb4HvDa09w8p5CPlgo3IOJzIU17glVelDwTM3QL58lg1svKUuPF27HhbUrzgNCC82JsgzRbEV/HKQ=="
    }
  },
  {
    "id": "9e5d74cd-7696-4e6e-8740-6b8837992c3a",
    "rev": "1-e2ef865d947569b96cae1c44a2a98320",
    "created": 1688375518549,
    "modified": 1688375518549,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "bba6a6db-ea35-4784-93e6-98bc50a980a6": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "bba6a6db-ea35-4784-93e6-98bc50a980a6": {}
      },
      "encryptedSelf": "uWOsIcyVbVDcDF077jZnVhRuFRCVgkBxJFv+nDKxy1A38N9qDq85RDCADKQqKFSnC0s+XTf/KXYvPK1Ne+JV+dfeWfETS+EgFVXq/RBhJSqBnCAjgJT6pyHg4USY4qB5tB80npXS4iPOs8zAVTGj1gnsduT9hNdAumFjbAAWtTbFTc2xdJtwmMyLRCfTfgyWh4lWVF+fPEAdKiTrCJQ3TRm6IRdshEmemeRmLYtJZJRJjwi/hoEohr7E2hz2b2jVxfONJEousccLohILIxfocFHrDlyjepimyxg63EavO1kcXEWOVvNx7vG+jBnlxHO3xnjJmIor4t32VY2Uzq7EBOL9bAkTfUek5fix6bV38rUN3AhVrghrlRsYvwgctHuwVMJOVFaoH3Dp5J9OBOEA7VQ6rwqxukD4r2aDAp6aNcpRP8+TKvR2JMtsOsCUO53JgyHJH5sygVZX8Dqf53CPjRy8NPErw3Oq1kbZ2p7nPuUba4LbicKEMdhy96vhL3O0msRrEhUciTebQSmv91t1lO1Y0MU70CXo4HKb6LQg3Zmkfm8CUqhIF50aM5oLw0GcWE1HlxOuk3p/MuEpLooFK5i250YNaM3tngggtjMyJqf7BNUxWx3zrlArrdxHzsu7MNIUcS07Psqsvb1pcsr3IgdgX2Xhh9PSxVSYihwKpTC+jjLjPHS0Cm+0wOzOVF/yZirJOgwJxuVpDhmVldHmTt1BRyDne9+ZgFn+IR7bld5gwKFdN5S6wknGfnQ7JSB/mjA1+591sv7vgoaiXtJ+YM+Obgshg9nv93KBdNDzzFgwUnmJAyezz8L7+2Ut12pKWjz0f4y0/udb9VTaA/rho5zZv6eXh2QPm5DZIzXbd/Y+w+JB1s6i31MVDofLVUc3C9bXEkWOq0QfM1ymxjtrnhMRH6GH1lJBo7Bc7P6qwVh1HmWRjsm/GNiQ9xWkW5XD3OHtO/3nIisfTb9L0Q2VQsY44sOjgJPjiu7pWMlh0oF8QfDHNJw4an0rIfRj//pejEkGx4PHUBKcN+NG8o7xZaAZFvEKa6tIfiWabvrZXZAj3FFuK54gCTZ60/dYfD6cWgwfMaOzMExzpu9CKHDHLPQEC34MHEqnV1E86YYwsmarMMYTN3welnG5wN2RjCnvagJloH784Pk51DqYmyLy4g=="
    }
  },
  {
    "id": "ff44de18-5fd0-4f59-96cc-ea643fd8c53d",
    "rev": "1-44f1436fdfd0ebcf0db8c382ce1ced5e",
    "created": 1688375518470,
    "modified": 1688375518470,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "f221497f-5e8a-4d4c-bf2e-8441784aa8d6": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "f221497f-5e8a-4d4c-bf2e-8441784aa8d6": {}
      },
      "encryptedSelf": "FU+Lv/7l4OTszQqAD71Fj5tgwKyQndidZBFkMINatp0R6zBlIxfSRRfcs8oQPNpgBKWWsUbHzTl7LpGoBtxMxebAK4fAVp95d8mKxagNeT0YxZtJyPAEEXk4nmZ8LunP9QyC3xuWtQPs2/scc9aRCJ7NafTEj4ydUwZb5HM1R3Z/Z4MDN4bHf4XV7UGhVFOf2vHMgtpNBrK+6y96B8L8Woj0oThTWwpLoi/sEHWZTmnBPSdSQGywI4Ydne9xPilQfUcjNxLF4CtvRkqlsLJgF+FLaehzQFmFSx8tDr6kldUVObNHmZdilPbZGZvaKxa5LmszGxMKHQB5Y6+FNhm47VGdoOsRFgoanDq3hO9B6UgEVclZVdHuEuLSkn3tDQR9NOsiPWB/nWKhkA1YDcF6wKRvFgqT3ChpUnlrUM/KAtw7WUIL+B4/p+RlA/rl6gSKxLU1JlaFr7IjdqQ4VCDpMRUsU0NXSoNFgj+zAtguOUmfhnqbieAfu+qg0/sZqzM5/SMH0PB/UF9KBuVmZvq1MPo/qJJEnW6fNMK3vv16BCxemXq1yWg6LfUBc0861GQJ/omwnBYdQGBK+ietSMlMBjtjjMRlqUYvhlg7/arNamvYi/aA16TvqA99+0vDAKde8Y4n/DVOS0FBtiUU2M25svxOWOR2k3qvH81lh+qXAd6ql6GK12OGgaQyWFkwxk61jPf2Pp9ndJKbfnQUSakYWYyMm6l7QfNPFTEKJC+qV2+EXLVxZ5WHMd678DOrxNx24rV9Hb8dw0cgh/o1h6bjoK6wFbEgb9OCuws9dPr+R2/qWVoMCOCOxv2NEivvXDaboxe+hM+FiaTNkM25SBANEQMk3psM+X1yhzsWSZ767PFGmh9vI45T/UOLmRGfBlMPBHMZfDh/CybLbNTqWmYEizvSKOC2y8OQTGmKaxl2SvNKAvM2Zj+0jGYXSxllClhRkigkgEn+77RbZquV5S9ho3nQvnRgRL2PJNuv2K8dRxSpCwAHSf+AChOo4Juvj7DJEr4QiMSqdPD8zAWy1WQhgRTEKIJ0pde2CUgAqty4pW7H1ar2Ivob+JSRXhQ0tm+ZgzlbB/CipoXHxQvFq00UYB9vZdjji3iaJ4IQUKanVzRr74Is4eTttMVXUuSHrmxHKdKNkqgMC3QZNwst+mFODA=="
    }
  },
  {
    "id": "cab9a5be-bd47-4f9b-828a-6225134afdb2",
    "rev": "1-ac97e8adcfbfaecb7426701c1bf98d56",
    "created": 1688375518392,
    "modified": 1688375518392,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "850d78be-757a-4753-b93e-6464c72376e4": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "850d78be-757a-4753-b93e-6464c72376e4": {}
      },
      "encryptedSelf": "tr+Y2IhpA/USlwN9mg6qLHGtixG89i6JAJVVPkwNgVSz2zFb2+Dzy8YcBbNYYshCcp1fuF2vn4Yf0rvnEL2x2IjUP0Go/ceKb4rsNqb6U26FARKWw9I8mkI8aj6a1AuOWtLeqXE4Qf+P5Uo9nllypiwCMvzyHuhro6wCPX568q+N+VFO/9kD2dmzznta7THdSMwOxSN/AfucoA2+WnRxO5d5vqnXhp357U4J9Ww/8ZndwOiw7Vq8yLk2qq6sE/elTOVEDvrhx1EvNCCYBS5ZiChrMpDkIcGZ3XGoPexU7waMlTELBlcnmwjMnGJ25sAn7iYtHS7/+S9AMVcsDJVY5MOHs4zSpnVd7xDA+hI/kzA8hqHWfRaxmZdkiYhSKt+XH6QUSBGJIDQT4Xytmpo6k9bjleBrNyjY4knpE6mFakBzHs9mGt+Pv/T1tpjQDu5Bdba3dUznk+g/mEQCpRKngRMfwtOZlSnLcKXICPi9C5H5PH3RRTJeCxHHMxIHPNCJRuDKD5BOfS5oVpe7tvfESDXUv5USlRy2dewB3+U2VYN2a9shHXZw6nbDg2R9a2JA/C6P7iG0/qy+YuBGcsmipGTg4x6E43A/qXC2awd2ncJX/7NeaMowUDNQ/V+9kvZOiR97plNhe9jLNGQyxRi/2VH7hpzWElocpcwb+s0RGZz3DGGBev+yo/lciWo4pdsfmHJgwenhGt8zCTYywXbrWUvMoJ3fslrE9imFgT97L9d3goWpgoBWwgJi0jMJfiP4x09N19wy2r+gZAzImqeYbiaDcOJS2Ir144MFTefZ29p3hTC268b++VBYzur56WvIYHlgfSaj6dwfqDn7I2tSHJ0oiV/OH7KxtC7GOfe3jEp9oUz9lIwYtycSLjFeZBA7EhWAkm2zVNrnA16O3fhF7+oUCldFlDj6SPSCFq80h6OyPUFOlFXMDNR04fsuB0fVvhlA99tPdeZONtijXb7dwABcuMA7aO5fuW4q4LkpMYmMWBwMNFnJzKFQjg65TYoqV0+7wK+XJMldJvzqMVgJ4VzwHU4pjCQoZkIfD5LFECaYxCLC3ppLXBf9G7JD/Hp3AB6aEeU5aoxddUt2s4a+RG6BUgAgGnxBPSYjXK2/Pr7/5pbIO53CaQUooj7rOYAdBzvKw1jQckkbm0iYGszV6g=="
    }
  },
  {
    "id": "bd86e0de-0c67-44ce-867f-6b479cca241b",
    "rev": "1-1ff3277dd63425f2244aca6d6b6aebbb",
    "created": 1688375518296,
    "modified": 1688375518296,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "0a769c19-adb0-4908-9d71-5ef116f60e30": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "0a769c19-adb0-4908-9d71-5ef116f60e30": {}
      },
      "encryptedSelf": "kju603wfRs7suNFWXlcoWI+Q6H/+9F9Odl0t6qkRIrfVZfmmOpiLWVPRbrfZXpuQRxdriqs0IrvR5u1hFPYIdse2Oh7Q9mGy/18CLkoam+dgz3Jc4wlLAhez0QGFj1BqrU1pxoHRQtlwkkZ6NVqM+jFBLCau4CKHfyITyc587O1Rpo7W0qic1Q8GDB3l8LhQhRqcJGQdgYa6czBT2Nv4D9M1p98UPjwwru4PeEjBpcAzEmt3WZ++7PkaZ8va07Df6fE0GCuX6pVny9dqHRKUQUCY/addMihMTKsvHU0pnWd4rU1UsyuBtdnRzRWi+HWFJtSGQwTiexk0wXb49iOJPqvjF1SSBg94j4elmVXW0amtaNRU35wSqTlFyhpLovXFyURpxWdc+Mcsr4lxmTq+cE5eeEngDjLAr/mb+PKYTnl3CWNKPQhBPfB4UpkSNxc3b3ZTIyK5tO7sTdkhjrPwQ8We0JyBX6362JtNZcoYaDU9VHfiZFpbPlpDx+kPDy2zvUN8R7BPZe89FlzvnGX07julto1HMQmPQkDkKqt2mSejLfrFQnlDlKSktOyq6YJULVq8ZN6uMLmrb3sdtuJX+3Uc2eS24dk27wAxhriccnjbSMWaVHHmvs/pMqKsDfBAeq8InFLnGFWh3rC4jD8MhFzH9ZeviRYpy2IM/qS/y0wER7ysqMD1WdutUEbXztA4Rw2O69bKqRhRr3wMg5E9GRhrBLC7C7I4m0j1JaClo0dfcxMDpB04vtkh7i89MF1zqZTpW974xg8b4ox5rMl3J5qrXIGZwbNCCERJ4BROmPOXb+9HxT3EEp+64mxVdkh0HYm1TY/aCBcR1mRnU6KDD8h7lXQgVXU+HplkZ5UR3EPV0zg3lvScXPysDILi59OLnrQDuNjYG38drub2WHcC3g1mUIXd/URNo0RxcJeKOOhrjEErQLeeJiRcOQKauUWnNWwksGBuNzrmwytu+XSsUOdLeymHr+UDvbXQZRdrx2JISQ8VcAUcQzpY+pBCb/S5VLdUl2XskPHB5LKmrdd4VvMma4nHsvjQukGKQRmf0afdtiR0lHDhuNlzWhmriYgavSopCFmXHa8sjQcNFSCp8zno/R2YTf8XtoBdxXMuNEM6K4QZ9d/cRmsFoSfue2EDchFfDB+t2pA6Ubw/I3Rs6w=="
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

await hcpApi.dataOwnerApi.giveAccessBackTo(
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
    "stringValue": "fa3c69fe-b87d-457f-8423-f673288d9336",
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
    "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a028201010098d95fb9f61dc9598ef3614919d004ede8dab5e548ce100d3e923b2c3b05cc3baa103e8868d8e01283d6fdd842f86045b3bc69480fd2ca013a9a200b84409cbed2eba18f0779b7d47b3c431f8666bed3987020be4745be013464ee78c389e67e243c02b590c199ae9e8e417ef899a374a60d67130f009ee0924d3163f72fd152fc3e0dceb3d31a1896140f610ac66d18223637b1dd81d57903b0ab61babda6df83c53cb801939cfe57dee1b5646f6770313de7f820a833fd2a46c2b4dcd74d132801d32eee770733d3e2c706e9e6813fd2daafba11be7485e1f3076b0cb0ed62e8c5481734e094dc6b82b893408a26226470e08199597ed87b022ba2ad1632d50203010001",
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
