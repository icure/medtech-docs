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
  "id": "699a74a0-1cdf-4af0-b31a-753bc7c6b3ef",
  "qualifiedLinks": {},
  "batchId": "851458c4-378a-4788-837c-59232d4b771a",
  "index": 0,
  "valueDate": 20230703120919,
  "openingDate": 20220929083400,
  "created": 1688378959380,
  "modified": 1688378959380,
  "author": "059e61dc-6191-4972-8463-7c1f4c86b888",
  "responsible": "e972645d-6cf7-4927-97cf-dfd5684a651d",
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
    "encryptedSelf": "MvAs3Bmye2aqH6E2x5vyVRNrSpZVbDJpue2X2qEWIsu1p/j1KTlq2Uly0ieJujRvv0WwylAk2z178gwlIcDqso61qKMF8KjDnfv8oXsSn6+8AIE/2BKc80pWv749OiJOhqeaiNw7EexrqP2VITFkiA==",
    "secretForeignKeys": [
      "06b516a4-ff2f-45bc-9fe0-dffb919e4e32"
    ],
    "cryptedForeignKeys": {
      "e972645d-6cf7-4927-97cf-dfd5684a651d": {},
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "delegations": {
      "e972645d-6cf7-4927-97cf-dfd5684a651d": {},
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "e972645d-6cf7-4927-97cf-dfd5684a651d": {},
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
    "id": "227d4ab4-6203-456d-afb0-1ca91b29adcd",
    "rev": "1-b55f914c0088727eb7f72c84b161846b",
    "created": 1688378959167,
    "modified": 1688378959167,
    "author": "059e61dc-6191-4972-8463-7c1f4c86b888",
    "responsible": "e972645d-6cf7-4927-97cf-dfd5684a651d",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "e972645d-6cf7-4927-97cf-dfd5684a651d",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d337ab5696392ff2917383ea719f8befddca81587a0951b7c725eb55db997d9317ab7898b2577964697b522f175762bd25ea34ecc499607fa4b88f62dc05205b695aa6a63729d0384b144fb62aee6553ba0bd396f5f61560b3a0a598ddb39cc43550e8bd18271001330b0395d66d0b22777714e8d3d7b24c0295d1d42e3a7c0fafb375afd223e1650977f2fb825ada314ec087b259bcb635d5b43c06d0a6e4ba0e08119159713da75210b9d416679e7a9e1d211ac3f0034c39389d476fae03bac3aea376c94f85536ad48a7c643aa8bc9014c60e6bfa944c6133d229a49c90e46318091094650317cde650eeae3167ca71f553645d9854c8298800d8e78ae6ef0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e972645d-6cf7-4927-97cf-dfd5684a651d": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptionKeys": {
        "e972645d-6cf7-4927-97cf-dfd5684a651d": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptedSelf": "dnWeB/wFywylhjR63q4czj2KSYUDooUgsqqeSzNiz++ynX673eMzr+1twOg55Utw3nEKIUhzfX5YTshc8Mke2vuCXNIrcRxBoEui5AvwxIzVX3kP4f0UUSNPi7gD/fUm0QzD4U3dkTG/tGf5WMJgliDxEX+rZIzqeA7uxQfwuFQYwke8zr6c53C0vV8y+c57HFeQfkWT+zOE2aZ4yWRaXE+NxojKW3+jqaQO7+IIS29rjF+Vx2pE3Dxrn4Q2a91SrPZdIltYxX01c74ZoWGPmRgJLozclJVm/XSWJ1scJNS1+g78B4+EXS38D2SvQvJQ5UOUKlwWvykWE34EOOQoT/4tXTCPpf27iUMPPi4WeArskIju95Nt5zqg7+auYP7CKM5tBcQuSZs3lWwYyBQ4uMXFVtezqnx523tdiLBNriKcPCNKyeQ2ZUpkwbq1O8bwWO6juxWnZYjhZUsnr9QyPBzSCPSyohYqavkqxfbzNUcISxS1dVcPlglibBKIcNFxzw9frU4tbYIuzb7X9ccCbIkFxnz8nCv98d7lRQlQpDUx2e/TrxZ8IEkBun9JqRdY0TaigeqBHJBGAN3NhoJ01EPfvn5X93dhjxQEePc7K20nE4P4Fj5bJuRTcPOf16rwOv9Z7IfnIMmfyi3LH68ak1J+gFWcyt6BKzu8K+rtmaO4nnlTEZ+Ld6V8idjlKFRHwrLY9GDyWM1Mq9YV7jLbtIYG5dZavjaCoa0k5zMl95zXkgEWASo9n38eeO04Fczxp1ENtuACcaAO9o6aL1Lsh6lR3HAZOFw7qpl/AgfcTNL+JpgtJqXeS224vxjoYA3ecqK9L9x/YgJRUaDDEGNriaV9dGrzx1p8lwzLPotlk9NhWgcwsgXrmy3SM/gm9stY80eCZqvfQo4K9M3m9ZBmGy8mBWCwwLPOhcNlxJ6ETuofROTOlirelipTVpfEdj5omI110PLebCS49zVtqXWktMEqMETulMlv6zZF9vkEH6HmVyUHh2NhS+ywqM+5tWk2BGd583QDp6MklBRVd4MyN13p0nZQ+Ls6eG3HTRWm58Q/qyvVofxe8fGqMXxuEsNdTf1oxqrNx/QI95OW1oi+PQokK27I1QKqhqwPzPcOdmg1uV4RxvlGVohr16nuvqsexXKEuT3nVV39qqX8g+dPIw=="
    }
  },
  {
    "id": "793c538e-ad5e-441a-ad6a-3163ae4847c4",
    "rev": "1-3c61c5f25b56d427dedcf383b1271d71",
    "created": 1688378957374,
    "modified": 1688378957374,
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
        "950898e3-4cee-4228-a609-f08606f680e5": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "950898e3-4cee-4228-a609-f08606f680e5": {}
      },
      "encryptedSelf": "FeKtE4Dz5CB04p3b7iQ2HRxi66xDpp/tU23pFUOQebkzbKsUlp7Ex1vREd4ajjVwqBmdTNXDgTYWvI8LMPhIdyDO45Y9OjB31HknbHjaZiVug2mvWsTzVJ1uvoldCnsAomyQNImk8x3mNR+tpVWSYiAsCH448z522RKEtVaX45VX1GSkqvIrUSOQBvmssWrpvH6dohGMEEdkMv42Hdd7o7v/U4IfCc2BfEV7dPKzSCQGn5vxTfsRH064Pbjf4FGmUuu84fbwwkugpa3//KTh8NIdTi4TqccikVNNRQc+6UciGnFrOpyvvaMA3Y+6paZpLFPKLEJ4trvl2NrgSejkPl9jTISJyGFuePMHVr2dLZMyHN1XV0f7iRiPflZueaKK/D0PaNr1z6ywR5mhHhO5/KTP852g/HiFUNCOagP+75wFpIWCJpN+SULGeWtPzxraFVEabCHPM6y8RG32/vafAvUrx4ePuVs7+tX5ivA47BSTRHaahAjgiJhsM1sJ6Tu35wCodWT6NydaHqrtNkuvxovzMZ5BefPXbt5Rq+ZTWtvQ/imnYGyZfCdN8UDKFBMtSDvrSVG7DRPIgwaAlkIwuDghjI2R93ciKFBA5RHDfA0TugaftbVpCyT5XVFmBHJq5E9hGWjbCbt/k/qXlpxWdP4hbL9f0GnTtlGqb5st6ho6Lmx4+1d8vk3kzJEUp8+X3164mRHjCuvNKQskjml3AmvcsEnosBKZdpJ9rwlJ/+m8yZsI1lk/9JPIpksf8ErmW36Cod2g/npRB9yIhryLZh0eGOTd0CX5flYxVXr4Ya0MuWp1KHz1ZSviXUm5RlgnOBAzXfPJFROBEm2DijF3+1kvhm5oftXCcKlhgkT5ZHtKFNShJiTrLUFOZdmf2eN2OsVokV4WtTWZXZd7R2xGT36iwOTNY9LyQPeWZVKPYXDgS0d2FWz6P0w5S5LX5LfMLTkS5LRBt73FSgm89mXFFduGn+szfPLhHrjZcVsUDfc0/HrCOvPJaE0c81mFCCIsgkJmWB7BkScnNe1N0HnQlnQd44OwjXyv2bBWudtWu4r1ELA1Brx2dUHNbFpjSl0xJq5Jh0XWW6CAWB5mHQCiXkmvKbn40wAB55kMYVph0hIOcZDMCZSrUItfsNCYfr61PNpFJ+e2de6SHsC8jbx8vA=="
    }
  },
  {
    "id": "606151d5-73b9-40bf-86b0-752fb2a51c57",
    "rev": "1-f19d54557093b42068b26aeaa025b0ec",
    "created": 1688378957284,
    "modified": 1688378957284,
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
        "18ec80bd-079c-4888-807a-a7014f150c60": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "18ec80bd-079c-4888-807a-a7014f150c60": {}
      },
      "encryptedSelf": "SxXN/b1xpSVbZ3XjKHK8pG4RmxtOSfHEpOblBqRvl67vcnbjyyEWPUTCk3/H2s1ZiilqIwXPn/z0CVcEOR49sIt/GhGhC8tpIVInb3qXIytEj1kLx0hHfltpAlwSxrus0vYnMCuTGm1UuVRSkB19e0SS8p9lbkK2oPiOPip63b41GrWvyrW2GO7REZCuQYnfm7VY6bpaKVNTYrnlIx9xQqNZ9iiS1O5PS6T97raBB9fkzy4R8ePTHyBmc5YLXwu3O0K9q2Y2q3mZk3Rr9Cb/SLe4vy7VAsIw1q+drAkS+vjHDbQE3VChlCYZmUJAhuz/9yne6bM6mFOhQfN1GU5DdQqmhOTB0pk2fkvakYJG/EZ+aGCPBMt1TEAVJkN1uX8V1ZwDm13nQ3grJXb+/zJ1F0y0EMxN4FzwznMrozAzU53nED9Y9OoInwAU1kQc0Y/fQ6G31FAxj1nkGJkWEGBaJid/apI/DmNT81xNorjZu77IqSlDNeqLyESAeYaW5ZAQFov7vZNa4QNQznp/psQcXBW/A14u6VcLSwpOtZfbWMrUX2sPGzEOmZPq+wEtO1SE1yvMRQvmWCU3TtNEwFXjjmmEFj4r1XGERXb6mymDKlNfOANBe92lIfJ1/ziwR2GonBUwE9MnQikgM5jtxhX+Kwfnobk9xmT1Aj+hW2eaQrxuC+GJ2fJxAf+gKHTbmTpUVh+HwMMq320FnkMWZdPpjMWIFUwPnG6t+865DdzYTHW73iMKO24nS6pbcv8LOL7DqkHgVx3QHrC/gfa7zdGwE7szJinP+EZ4qpYemS0OhYlXdJqt+0klJ0jU5qRro6zyXBLHgRbpSFup3qofFcPhYBFZsHldFNCN4ihpCoZzX5qQWYtQvLnqm9H1anyM1HGcYR0jieJIifebC6Dt3J3fXhkpz4horrF7IpjuOdaNNNJI1m1Hh2DR1ldzjKf6DQpsUgmcpWfj5ZcMV42By05bvKRWHDCIRSA2ChnPf7qa2Bq5POYUA28xYecmHFaDwW+Krp4yhOIOo8mjB078rGXzqDF8yafoelKG2ZGnHCUrnLGgZgWcbo+U6Kg7ryAwqBrw/yS9wrfBVID/u5PRL29UawdqyjCgFajp4u3D9FePn3LVOBHfp3njVvJcvAxJxTDDQwvxPK/CaxJXzbraGPCCvA=="
    }
  },
  {
    "id": "6bf28545-20b6-4e9b-aedc-af9005635d3b",
    "rev": "1-8db29681ddcdb4874bb0bf397b103b29",
    "created": 1688378957192,
    "modified": 1688378957192,
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
      "encryptedSelf": "eqoTFJroP3MSERaTCcxMUyB3JSuEq/0XAseDuEqEYC63jKvKY6s4t/di7tLTBjJgoO7jPJIvPGhlWTppo569f3g0RsfmSbPJhHyt5cd2z3MucXaWuxUF4URJA3jiWdMGu5AbULqduq4fOibfNsLZ7P3I/cuwKS5qRIdLOOTt7kjQPeQh4KnLbqS5hRuZSDy/Nc2Hx8hREC3crHEoHjEtBnoRnDpF4q/KG7oa/o+RWr1EM7iERycqpBhOpLX6O63zS75xjtBVEAYQkwTFdfHf8OOVf0A4sS8xtLVZAYpnCNtf/OhaEUWYXYGZWVv7Jpg98aEDPQxdyedMDi1kSDdBxj7cK6du1u3+Lqu1oFROjV4xJt2+ty6ENLKdJO8jMwWTgLWHgm7/hX9XD2v0h55kuMEngtN3rZAXGb/3HexjAe/i9C7leCB0gXzwFCPl++iD8zbSBZFDplXua1RWCXpVGxNnVN5BL4MBjfcLjc2+UsDEGzqIn2OlVr2sVe4t1bxiWfjN3mTFx73i1pR8OGUhaN+HRA+TDY7pT2oIK/Iw4WwWF0I01C35cqslkab7rNaaxbQhxaXrI3YpR2ewltLqZq/zxuX0LIEBvyAY9mINvUGNuCTYfEDjltKCJD4yQQHKzes3zEU3scxSIX5Xo5uTCnFfxBKaXH/vOPAoIwJtydJ1yVjj/inc6NHSST3fx2vSNpJi8Ut5orJUlK3I6usSJZhFfPfq5k1ngOi4R5OjIoT4jbEzl23Kusadtc/GhWpWQuSM8+DEyvdIfs/HWPD0CJEbrrJtX+T6vd/rpgp2RiA04lEZ13QBX05+UrEjN5vFtF5qym9u69LQNX8IAtV8ZiHM9aw6l+uCSLIhJgDHXMzmG2K32Y1/OI84WdzLHcvqC/3M2ceDi8m13n/c56H+fT5jJiyfZ6PuidSXUL3BygB/kupRyVeCjC+qJDi4U7zDoSnqFTzRJNkv7dx7lnD1lRUmHEMCl8WjinF0pzMVNFOz38foP5dXcXSokyfxYdSWpQ4aWrL76DEfI7ssxA3aeLmOrY0ikefnmLGnMbOpLt8IG+U6ZKP9F0e7XlDGUnAlXcLwR8mReZaGDQZ9Ws3D/WI5Z5WKoBXAwQeoboOhfNqQR940ylkWQeNLfYjr1dFkuXdXBPbkolbA4DPLI/LtZg=="
    }
  },
  {
    "id": "94aedaf5-7daa-43d6-bced-35af4c12af3d",
    "rev": "1-d14a74b02af687cd3ee4a1dcbb8113a1",
    "created": 1688378957102,
    "modified": 1688378957102,
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
      "encryptedSelf": "cVCxJEJ0XMoystgvZ2AYdMPhlZBgN8LRE5KqnEiM7rQIQEO8P6qAoYRfbX6lDLUBHF8fR84FbqunBdkO4NqX5PtHcRGVQP3mDwGiPe3eqKGBlEzBKK6B1JYmK/TuiVP6KhCjazcLhlYQxPkNbuLn2KpAFpXcQ2h7ujzunoPnjMo20HVk8GOH2fuRei4WvA9z4JEpeNHsiLcZw88IdwBDRN7pEpvqlBKQaILqYrBNCAdnDKP4Swvcyr05VZ2QG+dlplMLMy+XCw8a9ii1tRl+io9egaGcunUnYYXr5g4hy39O9RLpIFu5X9RXAGbJ3kjDCWnnYQ4ai1B3lWxFUFZ1vVDjKU81FQ4P8McjRZiFzYaOKVinwYZaBOeFcKgdL4+mVO+11GUPVTQucSvot+nRo5BZOQkKjJs1+g3qUoEiIDFUVtk4jMJEBAmHz3xU81NbrMDRyY4rboOGJFTZZLF8JXifUhlkiXUdrSNTIKEDRChChgbU3122RjtvnYMe++IhTMpN+YlOe1FNe8FXu3RxZ7PDjuH4n3RizKEYbzrX2whmiSh1Sv5jpqNt2RNlDHfzdTALA6/fUrmimH9IbABs6GUP2RCQo3p86w70WL6Lv25vTRckdHNO5TpmrusHmIzBfyoHeQo1XYOaTknyPJiD6q9mptMq3SE9pHZQSkE8IClk3e+t+/Jzfaao07mIQ5eFNMIgN8mR8kNf6Qe+/6qKprSapyLJe23GQ+cAPbnmcO9qYmMLEBXRiVfVQPyHRy12nvadTrNhAetZcd2CTRzF4sOnMyoTeO8fDuQ37SvO9zAF81WwwKP9qnmJxgA5AjtwOchuttrUEDMgE6M08K8E97U6A5fugHQcJhOVmCSiONfgCluLZjkG/wy2yqV5kdDPb6Rf3wJYaENYgHjcjSMn9XJqI0mplQBEku3E7r2VClsVu9kN0qNNxpoeQ3jWQxvEgVgY5MskUO6RgbmF0blg2F7kDn08qNBSfwjQ8OkV3bQTlYWYiLcsj9lvpc9GIf+mqLdZvOzcbiSfB5bxMaXjEXlFFD7MZp0HMo5v76JYxoWqQoC1ml5Uouh7oVe2m2q9UDnbYAaNDVdt+Inu7h1NJNbiwrs742JndGziqN3plmnWFEIppQkDQQPSKwrWM8wNDvFvFsphzg+erXB+/dw7UA=="
    }
  },
  {
    "id": "5818d60c-ac74-4b54-b93b-d6da8441cf1b",
    "rev": "1-1cc630bafbe10b46d80aa9474b775cd7",
    "created": 1688378957010,
    "modified": 1688378957010,
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
      "encryptedSelf": "Y8y1xPHRc7vsiehfEd08FM9EVgSYZZQwm5MWF3w9rHWOq0tKcW9ya7Eoevj/FRs/RUGHmh1hWujLjtrDH1UlKy8AApas3f9CHq3AZ/cI40zJG+q+W6WqgSnSo14iwxSYkizSWdudK8qHjzJVrU/gXiC2/Ih6X2X8Z61U8Pfj/Iwar7rijtcS/AiQET3eMRzy/tEMblgL8iPb1WEK8MplW8UJcfY1cEkKiSDDKsTEvblOxWXwUonQ9EpXHEbH9hgop+sZpBIwU60ieGbhy1fdOZ9EBInYH8f5n49T+LnISccJuYE3/rzTjET+Lc/r1RpzI1/58UKqN+zpfAmcaDbXhPY8WsF44f7A4Ykcfj5B6iTf9oTIx5X263QgI62n1In3m4CSYuMSiR4J145Qq+Xm9MV8vPlhbzvqSHq8M2b1B+Mi7DB7RGJ1ovor0tRPL3zZoZKW3cmyGbC7xmEovR+CvUhP9XxmUNfPV88eXMXt+OOCKov3SASUh62Mhwpr6DsETfDy/uwDAIonXfkFHaRRusgCSSBUHwpuMGPhpW9ohi6amEJtO17WhRJqw+OOCJFcIHuskIAzMpV3CqVQaZbiEEFA7zfu2nkE1GcRkMaqfNkXpBiS5mC+8gjxOqnDEQDe6lRL+q7qa+bD1W6Fvl0KnKKu6TUBXRcyDUA35foUARF+Fhi+qsTPj3UnrSuiADXZPGVq7Y5kij+6Spz0F6Wr7yUTTjy5jrNV8iDdJ8a6yMadAJXuOgfPzDgjkrDxYhXV/OYX1hHTOEc1Rtjo0EgKdqtAjKKRwmMfv+IhvBnRF/YIvQ/UVGV2QVUj3Jk/MDzMPkn5kPQS33vtl+4hAKLqzvGfcR3Pb4YOLQGnTrXTHQOtOGaSJHLsAAeRZoGu6UYUENQiOOCAoAHB9AZXOtuCsX/SItVickbBjOOFBQE1nDYVTHMhgIMjDgRv67SybFtzyERYV6st/ruuASSdtn+v/3nJye0IVp76PVd6qY6auPGSwdn9kTQVbMsCy82sNTE2rVdKvvTuG429o1KSN+XI6pblQ6ERoS5T2IYY+wzRKrdzzkYn9tN7NmveGUzVBVvNDMpGK+nqFm74j1ZJOF631aMdQElJgf9L8/P27RhwVV+PgJHq7ZlUI3cGm22y7nHx7Q7DH5PPU/E1mbilJAOU9A=="
    }
  },
  {
    "id": "3172a1fd-123b-4103-b3b0-4bcb969fda7f",
    "rev": "1-44a0279185c6901e8d3dfeaa93e4bfbf",
    "created": 1688378956923,
    "modified": 1688378956923,
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
      "encryptedSelf": "HDJf+NFBFe17oDcZwq89s0/AzQUvdTkLDy6AM+2/Zp4y38JYM/tXBr1vMiIZ3uYFdv9qMoPf8efO6dJl6Ndm6O92cZwNogn9zxqFURqSkABz1YKiSNR9zmL9GpiiviXyaJ3fQvYbs9aPzFFoDrR0vGG2L9L9MFQ/itNDK6eoiZ4UptAVmYUAxs0o+YuZDGZ0J5v4aZD+3F1m74DH4G1QH0W6yP6uiEIrMqS3AxScZ3gma5PE9T/HIVeBy4kHpvt2LV4hBkLTFgGLEcblCtE6X/4EO4hD7m3B31pCLkVWsD/X1YSpNyna5l1AcMCdRSPNB9/KbvOrKs2KaYIERU2h/utd+6y7br1BmtvjeuGitOMOKv94f3yrpldi79pMqnamQhn0eF+ggWUNXcutlE3PpJqqPOMbjQuIkdmJj/meyFgF4aaiAliGqU+5jenFuenEMnjmskc8g42kEc47HZ7nMyKho0YlVXF5y03kz+A9aCI94gzdua7McawD7RUiIYbTPFi8yahXlmX7cBpNf642KN8lH39ETElSbkPC/UeInOKQLfCIjRNhGS8lvW8fYw49BOvYLbpt8qZGMWASrBdeTXqKgIKWnjQb1qCgYlRpZVnwo6sApgko52OG/3Er2d4ko+jUKDrmkXcTFwoy3G+ygLesTXYsg2YjAOwpDJ6esluYJckm1LzXU/3V2W/vbr6cfH65dy3d2L2NlhozaRqrWE1FytPojrIw0wk/KjP2gBVLFX9aQvGUH31UCVESND8ws5+Aun7R9xcBTG+KICLKoIktOghaXjZMXq4g+d0dTVh+y1s/J5Zrc+CQYOjr1iZj1T4NpOgfzCtyoLSZDPstxyt5pzddHg7t1JvYzzQ8uv6QpOP33xjIdfFVXafEb1YVzg+0rQ71Jc5EhP1LgNDiZg+qmksrJATdcgXgWPS8Jvi1+3qQZFne6Uooet2pKwWlgnSUZluXrU5w0JKQodKBb3Wd1sfPvvsAwHW+QWEQ8i/S1QWhztvTeVkyST1sXm9/0a0AAT/pNz829x6vje61vMMj3Ouk2mH+qzn/UVCvcxgl3umHDlpqAPycmDYQ63sD4hXnGggkvg/sU7YzWCggep7y0V2Bf2zr6mpU147wy/4zh9wE8bwtLqsw+wiEtZKg9vNDNvUKUxo2NrTAdH/arQ=="
    }
  },
  {
    "id": "aacc739d-030d-4438-b7d7-5f0df2712a38",
    "rev": "1-69ac30478cf58c78d00553b890b4aa17",
    "created": 1688378956835,
    "modified": 1688378956835,
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
      "encryptedSelf": "tsd+0fBkOXgtMIZrA5HuzxbBPxcjR79mArBmlAX1OTjTScKrmY7Hzo9fwhV9uDC+3kkpv4QAckMNj0PsSS4SlPNg6554nsFYGCz2fiTfBDvC2B7YsF9JEUDBSkLtrFjk7lpFNlWV9g2zKXY0Cu9kkf2h+mNT7rr85GWCSos1PclO9MfYj90u5FgXNqYnuAfOBbTq3ZjdGbuQ7C9b5OSUNf1NhkxKJ9EmL2Xf8eFWQaeQuoZViHAf5mPOhczldK1XTAldeH0MItyalgAr12TPJARfbIOQLsDysfAjQeBUhlEe9J+p4D+YefmPER/iytSU5dQq1iL/iIwaDeKcv8Wb+dcQHfZ95FsKTLCaawDT81iDGwNuAXiWc6pE39ZJlwTV+O5JKbnF11P7qKW3fJu89Ff7woMxnctelnOGDrYVs2PEWGNwoWdUmlmKGRQdNtjqzooFWXg6gy/iSQUo5GmJFHQOfjAu2kQRERxNK9yaCNgai/tkqx91nIaDUfppvXBGz3BCykG3pEdiNAVdo3GWr7tGsTJFzfFBg2r3adZxNRImGXk5t47B/+gleVKt7p7hVuSN7yf3RjGnI+KcZD/FAnZClVshijwJ03lg8fYxmlah5fzF/xfS3ibXmmyQK+Z4m+8x1llOYR1R76j+BfTki7TNOa0dS7oxk4wUiLj5GIdDgaM+CMViE1pLZ9y936EB/m1lj2oV867BrkGSA6QSqVQf5BxxYEb1YeR2dLusegSRTQ3fIf6edHA/r/euRaNwBLaPwTr8seFyl6KYtWhUAn8iU0+P52p6YcqPZoYJwCEvpMkyc83nlsMz/HwyP6xzeJwQrWUJyteq0cRjgrjhKBw9McRZc/R1Npudeemt092/UD1EBM4jKb32PBjuMGdgAPVC+VLHhfFR9oKf3dw6x6xSNfIKIt2oymUf4zRUsMiBYlIeWZHyLT87ZOTXbFOB/7EuIB/l4OJyM8CNJeov2OjPAC556RLVzrt5tzChFYvo079W7k+MyaN4iZwzNwiE+Y3qpzL1uolnCnlgKODX+AoZDkP6q31K4L3nwPom9LB2HaeokZ9AqSCzwl/iRFDHX8ytxSwdFkflBBpqVtNq6sqK5UJKatTxUSizC48xKExiX9TOxRGlaHutkxg4r4vYnHjsX5K4eq1y6P7HHNFAtA=="
    }
  },
  {
    "id": "025efb23-7863-4161-90ba-2e83b7506a6b",
    "rev": "1-a04445363a7ae9ffb7bb459ebdffdf3d",
    "created": 1688378956746,
    "modified": 1688378956746,
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
      "encryptedSelf": "71r1WlxV5XuXj0fXeIjPgWtm6jCHsYY0+5PCvwFaXy8KfvSGYJnorz0Mfe1N50fAYAtmiCI1KnC6zMi/rZ9QLeqXR76GdG0ne0i0m1vc8EuvodC+EvIp9awR6xV2Wl13egvrEVO7JRtH4NFCxa4xoNm0+9ku1V0BP5amIDl/psEufO8FiQZ8BEbPKQKI1OIXvgvrsH0XGrYFTWGKQAMSRWCk8UTbHVtSXfW0Bdt3kmpmb1YH1rRO8eDE/7L928HchogqWL5XQ39eayItSU9Z9234yQ5sDLxN8KCa9Qu6INHWd4L0oXPWnQNonIxsFOjJHpda8A9irK89EyMo1nl6PudTIdZxS2BjN1qfeN6wD5+kqO7ECJF0sgnZ9aZMaIxIbzkxoaq74t9eP5L04iGIzrYCMkByY6QHqvw0FWQH4sPNCwIvYo6nEFBvxUgnCRaXx7WO7R8FBFrYTktZwEmIJcXloWEAgeV0CcNks7i73JuqvIMJDC4ZlmWFfWMNKRkXdNzzNgMf6LJIX1G53cEDz6QPRsYPPQo5QsgP9MtoDq0BA3R48VksISpi4eU1H7Yav8V//AYom4Z1dVbY0wriWnIwA0K0EPOsorAcIj3OZEBIfa8tvhbIOklzaoTvHPVjJ3if59UK/HZm1wDkS0MH1IQTuXVkdQcHFKcinCAvNTiEf9yOqqQHvbuZLWjV8EPptQm9P9WiQaXrKRRPQIy7NF8c7foZFgBuThFf8/IoITOQ37kR7+H5hK5CevBds9o1hU3KT0DSlWTOOuqLH5Zy5VzME09uNZcNZYxdiQa2ioDf6OeoB2oqNSAvEwe7qEW5Vmc2t4w0OQTVX88peDI8/1L03wkpmslWFq6klkaVROqm66qqkCCCjKcPRquoyGCMS2hsmTt24jAD1UUIXhFHf4BmvzTsbDF42djqXuSpP1v3O7PCnSPG8cXPeVs+YxoVvjN4hr86+QPCvllA9RHzeCLAhUa7kVShZ1xrszchH6430Dh7lZ83HuNUTw8NSLoY1UW3WF86RYWWbx00A+lFxqgl6ZK6JHQ32fIifYB72wuTacpv3PMCzMqR+HLzFikHJVHROiB74PaRaB+M2xdloEVurS3bKsZeL+UqvhJQhnaVHk8zzzcNUBAncVFKEkkeehyB8PRDnQLZMG5o08ORTA=="
    }
  },
  {
    "id": "66a25c34-5327-4c8e-affe-b7a1b7b66f46",
    "rev": "1-f3b8bc1fa759e0bdfc385fa5fc23b0aa",
    "created": 1688378956648,
    "modified": 1688378956648,
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
      "encryptedSelf": "gEeWvCkusZNYVbKA9H8Tz3fX2BO/OQSOzKckAZMHQfqwzgvHCM1MHcP78G5PDWMNDx7uDdNr52kTRLJqPH+hVyprifo6oXVCOJiNy+XcFQF+56+ZG7n81CeleKpUdWJQCEPpkPzPEnyAOkreUHJLCJsex2fT4TAFK5msRr0TvPFPXrxgazzVkgrBpTyIk/aPdwhhOrAmYdgN1V2S2czoS+uFAUgK/izV9NGtLAGWyMFakCCRrH/1CbGQVHoH6xgCEgEVrdryfMHmKopYwckBKU+TameNx1h9ZTI91mRCAb0bPC8ZCTNs3KaEd+ULdTtAiEkhtBdQ+4Sy/t2WKDiQMTw9zLKekNBYFaxac6LeHZKWCLdDc/jVruXXbIYqKPnRgjmcK+VCl1t+UiCX78ez4brtpWr7uw63MNIOCs8OqpdQ8a7DkJB4S8hcEpbMMBgMD/buPXv3MsB1HncCami2xkgBXpVohC+iR09WdU5qOMrYBWldk+/dzjKQyXgOJZIu3fMhSHApQIbgOTjlDc6ZBAJXPqfQvbS84Ld7Bk4ztnve+QPYUua1p8lQQEEUlI3Upq787SBIWORj9w6ITlp3X0aD7QuYXLL0tdecpkEXV8J3EZYPj8YvcdWWE8zqnxV+d6AK1KqI8HoXcTTZOJzqQ+LjgBOAMrNrB4/omKbZ5Vb0TXNHxiwN6gtGLiW1vsRlajgCFdTakziLGGaXZlyyPb+c/rMamqmh0EioOJnZNbP8C4C7PzPco0VylDaSKkJyq4Ye0ZQTt5c6kWsIO9aeaXNpwUU9qrHUj/2rbIca8HYTy2nya0//UkvK86Bf8+vaMzETbzh/LoAMqjlxilqMQwCEqMxZ6aqymtmoizxgmV8FgynOYW+N5KNuZcDsqjdP3Qu/PaHFeoxEeYkD6fgZwz0pSLhzpl15NDH9FWlxpoL2SjMl6DhmDzPDUiBV/7vii76zf4+gA38N6dypWp2eEBhwyedn3JXJwdPLN7cJN6FBy9QwZtMcoRkkeG2HO/oOWTy0Od+1OqKay3aSz6TK3neuefp2RMMPgenvmrcis9sPC6zJgHw4ga8plEXbFDFrVB7Z/Nhzr+xglfovXpZrT96tDl/2NpcqokMuqoSV5l8vrq6LthKMswb0cMxG0SIEXGIGhRKgN/CahoA/Uu7K/A=="
    }
  },
  {
    "id": "cf4ba77b-a6f7-4ccc-a3cd-bf75179bd6b5",
    "rev": "1-42d896e1611d2ec16061ee238aafa3fc",
    "created": 1688378956559,
    "modified": 1688378956559,
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
      "encryptedSelf": "VY2gj2wmtxrrfjumoeAka6VcJDuMYuEx9RYdbxEfGdC93dTKJkxegEA45NvYd8nVVtKxQ3DOZjZ/XxlapRkdwLqfD72IGg3pJy2ylQQscu2PcykHztdScVr7GY3stl/9AaYX2ydW4ie7IsT8+FpdIJz+iCCRFskDfh2QfPM9aSEPkImnwPM3J+y0k6BKyyJHVNX7TkLziXY77EbZ3TDBBs+ZzsqqiwzCrcdigz/gthuKzXDUit4iO6q9M3NR+G+M8euSTThZXl6MppdphYLNm8ARwOqGQdP9yC6/ol86H7WA4MZxhIvpNB2Z1EYUJrvI21q3ipp/K9jEhbPS2F8LRjWr5cvTQXWBlaL1u4ZbVvHWoG1+BD6TKegREe6K+BxrXF1WiTUVC9EcxpIzffuAgzm2NsbDRip5xJgKLpvtH6sozNNHrQ0axUgYYQZ+FV0nPxaeSASYuw7rPQHklAddTiyc8yTKpKPmi4NAF1uQsnot9v95VSPZ5i8QlgHg8K1BwmuoybtpIZGDgpMyh2fb08Vb8Qi9phkERA6EYiwdmD4CW56E34n7dDaDA2R1uAwulJNZmGijssUGsntSZuXA+420EXfJoGiyK6cA4/RZW1aLjt3NPTpbIcp39T1rkgMRlhev9Rq7mKNYRdMxsMaN46T+2NkTlmI2Tmb8dmiOzWCvMtUyXyXP1fZiJhNUTQUJyBR6eHmc2Nh0Y7cI0zhRM748/GbuUJIHHB0C/YoFLzfEaN8XAMQ9dieYBJ5SAt0mbdOTGGN1LUKO/wcailcOjqQUfE+cvFyy+uGtbJglr7EvhsvnuEe7dwJbFWecASdrkz6MFW/9E+FTA2AXDW+YzYk9wA5Pbef2buSWMEVQVCWilQTSDHsLzJyTWAhwzXrcgLj8/xGSxWt4PZxVj1ifUeaGCaJaPV9TAAGeX4bh3P3+Jv5qn3rIJArSHHzrCUAW60ehtpIcvBPd2WMcoGla4jlVRbn8qQy9aZsSyKiklkWpSKsi6Brt5SpLaBl4rJHWXNoLRoUpscYltEQgRPOUxHI9uE+cAQPRiplUtzNXBhOb6oxNm7AkDu/+OOiY/6fETIHORdI21UlD54fFtmPCjavi43gz5NEJPIBKOrT4lHWQ7LOwCE6BNoCXixYoivKNa9WXtgWaWe9zmdGW/rNIPQ=="
    }
  },
  {
    "id": "b19d3a41-b0f5-4f8d-abdf-fda2f1bda288",
    "rev": "1-2a0ff32a4de1d7185ac7a16671ee57d8",
    "created": 1688378956470,
    "modified": 1688378956470,
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
      "encryptedSelf": "Ow1a45094IjEix57KCcReyYpYr52IQ3uSJw6gbToO2Hs5RIjdLokzSvNXa5NhdrSSfTpTEmwq8oF8b7CkDB6jH+8D0SuMoRLzpUnXEFay9FoPpMcn6a2myDlMskWxncgeYyzcWGDrjIAwcwFvog1YLYCLNzYMeilWY1DtFcBwajo0FYJCvFovP3NzNKSXQ/mxNqBEDtMTsBeq2dDAr9itHQd3cQM6EaAytA7nNnD8o3stFHRWsdxLK6TwywyTiYjbGgASTMwkqNDAfo7Q/AvO4IAbaQbs6LXkCaJkb66aLHLFcEtl6Z3BAztfJ8mqO48/UQNqgGsGZUVGXC5Is0MSNPeFcRcPGgnHMjab+/cABM1MTnVnxpUvX54+hibRrH5vqerZMPgTOxCyqMQn1P1txAbTySQO9uupOoohwUqOmUWOZg8N+4WJp6TaASWYKNrMDzT0anAV6Q6ozt0t3Fj+vb4GY+m79l7U7Y7SzxJhFGU01/mLkSk842pim0IE+/gwd1tkA0p10lsDGbBhnCwXX8WTVdyoO5q8fbJhzbTB4XjM+qaNXUSpOdP7PjmyrVxPBpbKFCVA8+wrEPGlOze+jPCrVFn4LaT6X3XoPPShJKA+sVNlngMxUIba6PK+mFtcaaEw5CDNUd3sSOD+Y1AWUpg/yDMUMII+kOeCXd2JqrAhGFXxNedKogTWIsdzZZ7z/awihnWsVrNShbAzdbLTbGfL7IOLGO1C5CMon2vwMi3Poe4vbzlnFdcO1PnrDLm/brKmZFLEwqqKOV2i6J+S1762/vwWV5hU3E/Z08Mzb5vdytbKB6zAmLGWUo2io0qider/uYRPdiSvy7bHDA3vlqfALUrRV2g5h5FMsPWuTkjtMJveX93wnosWi+LUnEgJbxtow0OlbJMQ5BZ7c9di22riuwtVfw+EYtSnHLfevk2kjYWbWQxNRnjLZk5iQcZY3+eiDYGgiCZPRq2WA2/GadtJBeAKmdLF2kO8HnAzk0eD8mQclOfgtyZS/reDm4YBhvB9RMYD4NPQWfZEY+/jXpkYlIT6NZ1vddqlEBt6uYWjgSQ2yL2F72fAeuDk9CPwZj2xzA1/u9K+Jtw3U1IHXFsMcsfA/hYverIbg8uymUVZRBSyKJtUTMNgBwv5d0sj9LJzzlzRPy/x5qBy5RTTA=="
    }
  },
  {
    "id": "e157faa6-ae85-415a-9351-897ad2b81951",
    "rev": "1-1c6e6d737af57dd325d0ca4f7b9e3b55",
    "created": 1688378956381,
    "modified": 1688378956381,
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
      "encryptedSelf": "UsQdIWbqM+a9nwVAbU9lqjcS7ivOC1Y9aU4Va6SXhFOpGGb8qeiU5K95ZLW435wslkMnw7Nv9mABo9ZdC6EmHw4FrhduWtlmXgv7EEEEhsLFBrwHslcQMFjqTgNtwt73fJvZ1YNaiATQpbBgnLOW++Qa0WZeqfq3m3JWSiEOi5StY8bl99u7zYyZvq5bwckp3RZUDv5es/bgOLtfFuakMFrz2rY+0GThKqSdeOlRGP8V9GOxAibrXGmSWWBTiYUnnW+DP9+Bd8L5C5EOh+yPbs88QhgCRN5yZdIKmZLyepMpxnOPabefOToonh6rZzluuqL2wyzb7oyAWoUg6LcPMOIjnRQYnVyLck8o2cueP2SKeQ2GYgIm2BUsakJA/R6fyPta8OIdVWGGacRXwyMpbaGv7YogRaypa/5E9owhs+HPJISVSPhr2jyaOvoXA0VcZxib5ZRCsTbG9nZQoIgfXYE4uPmydwhveXnzxecBaFbJYQ06fYZxErGH2Jwejs3SJOQ2ufjSigvjtaf9srpGfjK1w1AdaVqtO6XJZGOVLWzBNupACYrY2pttUnTHH+qP30i6MuH6N8fJpNQ1D2RRsCGY30qJlDzlZQeeGuOc1b+sUnubRuBaiK9P+S2JUvsJN/lC0BPYKj6KvNz5p4JW6zSHAz4o2+5aAzDOHFBwzjoFG0nbbL/pynQzYCznn+jp5P7XKECjHsr7WQcgi0aarp2hTEMq9nWbGRzuqVQqM2NoTjXdfdxZXhW4AVKVcbX+KeMtFJ6oYvz2eqEq18IfmMEL6WwTIxeZxy5pVkqfIJnaZLH8idbytMdFncq0q8XNqOLAtJAHruPgrqwbAOOgD7mgEkB6JBedCQm4BUlCzeA3M01X0Ie8wD3pTL84aFSXX1md25fC5Usu0Qa6COhhd/a2VZQ1KZqgxP+/sfYn2CaYhWLhxOypGMTZGsAoZ/4Rwsf/u60RKQRsdTXRitZwqgCCvztPPxUxygs6rKNUW1J+jvzokeKfTpE/qcZ0+Xj2GNVr2u6u1s5VJXK6TItp7kk6erjyEzW/uPWM1b3NCsJg0RBZXOz+9qlK3QRfnGkhUzrChXeP8lY8JFCKn+tHSKXtQghDPlE4V9HwQP19+D7VuVusALjHf5X2uOzd4fS2Q4hFbRnCVhz/5Rx8TlHwdA=="
    }
  },
  {
    "id": "a31978ec-9103-4f56-a576-0dd777bd7327",
    "rev": "1-30adc4eeea9a729d9105b9a8bed15f1d",
    "created": 1688378956293,
    "modified": 1688378956293,
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
      "encryptedSelf": "W3gwfSGslNl3abLy1/WOOvg2ey1xgKApbx8D4tZcxCpxKYk9zlRLJBTXBCSKNnR+xKd2fZxH+PqyQTd7Ste60hbQfPz0LKbDacktRxtq3cB0COVn9PZkZXZhncyAh0NLLcEC+sCGcAy0I+zHEVPp9v57fhgAtN9Dg5ZTomjTNyBSoLCXsOZVF7xZfjDIBpHyC6unJjcIuKcQNxOuySIaQDl80DXQOOtjm3wPcCGmbn9DVWPkBknnaZjfttnW/oDabxg82w+Ouw2TFJC7TMjhN0jV6YH2u9seZD8WwL+/f3SzORb6k6n3kD2PGZZBYnxn1uqDyaHh0+xzqGmFkpim2oTrShRK/M39gaIJxz3UQ/87wNbS9k1kmEauUg7TRMg0y7pcyDyRA464jgris5NIib5FVl5kpsoTeiLdKyQC2qvgCXYld5NdmKS9IKlM8HWMChSAhiRm7wyy/u0eDb+/swKlPXe6/EGZUzlXdxfNnieEdDK/a/NeLGi2ZYHL5Ax1F4Fdp5d5t+YokP2XkIbMzT3WiCqNOMnQXTPj9MOhtlFt8eLYJRalwGl5YJMPLL2OaclXT9ClAVLlUu4WgdZj9lSvvpOAjt6A+P9++58CwXIMm081lhl7E7XsROwj7lGZoU6XpWIPbg6+7QTA/uqQ+/ULvBpRhVAEfE1WpVqz+QuaM5zbHC1/buqWmZdt0tonbkj/4rpghOBu2cekNXDxTWA3jerDiNs+VFczLTAxKHG7DO+4JGgJnh3lqon6whSUBW+AAcNLwktt6vB2nqcMYkAxJthdsp6PIZprtfUPx7bKGDX+xVBIsXfNwi+LrEJmat/N2vwyD+pp51dH7jOvVnIxhQdNz4g7Q32tQbnhzVvJF1AXQZX/QuaWnDdXtAJBr2Jm4D0suvi+gYCb/Y0DTzRp9JGqIYFXJ9UwSPhxK+yQGlCEmKqaheGppADPezzH+kcdX6vdhXVEr34XATWM9ct3j1M1zz+Q0C5aTmJ0zk4+GY/CugiEalMxLmnJkGy2T+SDtSTgyoDZudBHGfCkkEmf+bVKPlaqAy8TFYgPq8rFOwzm/u3XY/aTeaZxDoUYLoxExS6VLucSff8VMQpxIsUzAtPxhrITrDMjUvDpaO8F9UUNVDUELeskIoobiYdfNG/PZ5uloZniRhegBJ/Emg=="
    }
  },
  {
    "id": "1688725c-dc8f-4c29-be2d-a3944089a267",
    "rev": "1-55e39e84a594b5e96c23d40afb9732d8",
    "created": 1688378956203,
    "modified": 1688378956203,
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
      "encryptedSelf": "EmFcewDW3D4W4YLTowzIoicg+hpzPbe4f//eKAJ9YVxP3WPHs0ArnIKrkPNVoPboQy9uYEJvNJb4l4mEFAguYYu/v1wJi15Sw/UItRH8NadcNNbW43kmx/f3T5qjzbU147eSSX4Dst8dtYrH1Ds8h0meZyYmI6JpRhRLqn60N7U9oHyFRyUJmI4+yx4UX5VIMxCALSf54zHdoYdUng5gxBHRk4RH1cl5GlK+zNwKVlxHaV5DMs4V6TBOLEg6XPd6FLrkZlTYZsohUuI9UhR2hjNiZ4/6uOARWinUbTdvhLKqb18LTu5VaC6mdMCRLTcLhVYMUjMCb7r0n0Zd4dsCTFvX/2eDyrqKc0KYysxjXIvRQZGZuN8xC/E4Wa+4D0152aqmvDoC5mRJbB7A0MYufFoK3u5KYXUg29kWySk54x+AQ+fHOCjfYDprayYYRFTqXmVdbeX38CTig17D8VBsCQhjRIF4oa5Z+Zf1LeRmYksYDMFsVFqSScF17qghp+DadKqm3rplTvy+nsMDsvc9iFEOZa2QlOR/RBeUe//5qPRL0uD7XFym2jM8FKssY4S/gR5JihFb8aJiJdL5+76HaMTbfMnPy/QG05+IrtNoV9fnsTqOVI2hQjAa3QzGKD8dT1nQFF+60Is8cNKsd5omQsvELjlt0p6g540Xk8e8fmEGjJAif7Mk4c/t+GgHLJV2FmDhlRKJLISqnkurPpbJYouCsUvJpMXK1Yttmv0TRsYvxrZjORXdBgATAG8KpmFQ/ZsDtlCExJ8DafhZxe0tGIN0H83HsrNebLqlFaL2UmS7xBS9uM07qQYwJkBnN4F8YCkvM3toOY1VeEfGhBfCDnLSomdRjlZegwH63VhTZ23LbfrmelvKeV0hnitLacFfCnLKD0ijspm1GMDV8qIn03GPCA+9zTqFHtCBXvdmODlHLH0hCcafaQexI/4NdHWcqJUjydtOSMqTkQYUnmmtpk/vcEsqI4e8Uf1yRzquwu9985muerZTsd/65KfvgoyTAGW2fWf/JINHqKorZUFuN5J4353esUP/A20J+22mo4r74e7tw4ttM2qlzHgVMQvKlE4+v+6JuQRZFnFhtA5E4fHLWa3CZMlkzJ9s/aISQMSFtvQNO0cMTIUNjO22gNRO6T4XhVp1C5xBy9bwjz6Gkw=="
    }
  },
  {
    "id": "5adb496b-df90-4f4e-b319-f4683fa9ae14",
    "rev": "1-546b960516afe21c8691be381cf594f0",
    "created": 1688378956077,
    "modified": 1688378956077,
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
      "encryptedSelf": "aHvOBTAfS6/bvimpnMAYQ3NtANi7P8VPKM8MJKOGMlVTtdO2mvngYWhocGW9qzjtsZi5Y6PSXMGUI9gbksDoopj2ePwl+4yescoOIJUJsu7WVTZjo3vKCXKzktW2kG+t1WzYJ7PM8YiPOBux4Achab5VCMrZuBTgHPkZmbZC82WCaW9/tw6QjVAOQlBTExpnx/HLwaFhpIKL/ZXrWgDwU4sNdBzi2U2FroVuALPfMYoXcYQ9FIVHrCPVtTiTuHmK/PTLnN/q6FKmlMfgziT5N/q8NRnyt8BFsrlUyVKyoeOMsMgBc6hPFPnSZs/YDkgaKsTg1lZwAVfV0pMYA/fSv8EQeHN71DCKpyhqg+pyRRLD0I7ZmfW4bUXkpkw6wdh/3UGqA2QF/v3ZCON410GTWYoTSLDChlJvJolcEOTx1UOftn48Wwr0bEfIKA9WScOqgJk/o/sN3WlQG+Dp57yYeW/mRFmv1E2u9PUwiY/MxXZZNVSqY3Gju04e1v3CeSTbyOYlsSPuJaPzdL2AjZw0nOmezOVPIjexgsic6YPZT/+xLOLiMcpa1Hwtt6yodC0N8l2y+UO+ik+H5E3XVcsZJ77NkK84oSyhYzwgDP1fH5S1YBqKsni4VgHFCpeaun1gLA+SDvNHu1izm13cuPlZ5tk+fzmWKjy5pkJgb+fmIFFgRH90WESsaTWE/kri1QiJWF82CCqO67XwQCqUwUZmOkgmwjarVQHG0qDiNDqGT1RAp0b9LfEFl84B/4zyiiAoSCahaVJKogr8ulzYjZy68Qk3oOcUuAmyS4wPnmVf23hFApbsb9wH1EeyxVvmSxeosccnMpAY5IjhfdFZSRVWfxjI/qE+3yGiqsYQFz7zXhK+p0nidZu5Lf44dCNRz7lOFDHh6G7cm1uw9MnI8XM0h5aCxLtHSVgJXFO7bf+/dyg3KrZGNlv1GrBl9g5OZaRdzD+A2Hy1MsT+BDyjUrmfQ6SQp8d7SOx8RMyDw04mozikeXpK8fTmmqKVfG99qIRgRhJQ3siovDxtjUcZaw/AMUCmtlVf+o+E3mva+yRVmJxhd/Jb4CEJ9xQYhEIbBUM/WNvssAriTZM5ajpVQJ6cztVjnN5YK0+HzeWhD9Bs148IPSTnrl909LxpoxEh/PfdfyTgBiY0/uLHSNE0YBDRJA=="
    }
  },
  {
    "id": "7c71fd79-3cd9-4106-86e6-80162cc83558",
    "rev": "1-4c557c471e7cf7b1f793aa984634298e",
    "created": 1688378871180,
    "modified": 1688378871180,
    "author": "929be43e-2450-4bb1-8296-2bfa8c41185a",
    "responsible": "8ca6fc0a-58c0-4ea7-a1f3-7d01155c5c84",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "8ca6fc0a-58c0-4ea7-a1f3-7d01155c5c84": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptionKeys": {
        "8ca6fc0a-58c0-4ea7-a1f3-7d01155c5c84": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptedSelf": "SMV0ONmC2e971je6L8EDXn86ZLtudlxhNpII5o+EiCs="
    }
  },
  {
    "id": "154a3648-c049-449a-90e9-773a9a22ccf4",
    "rev": "1-0f1a6d8d63870a07399c68837ea0d6ec",
    "created": 1688378866189,
    "modified": 1688378866189,
    "author": "8c99de92-3708-4b83-be06-dc4fa9d0e7d7",
    "responsible": "1308c4e4-ded7-4231-942b-f4b2809ab75f",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "1308c4e4-ded7-4231-942b-f4b2809ab75f",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b38d9e01c78515a1213a97218bddec6c9c62897de2a95c5f0ef85360c06757b20e876aeae64fe3ca490767e00798804586aa463077b4ff9e1ac03cb15a3aea185394f9dff2869b5527a52ed602b47ee774ab2a4f5e8b6f8173104c87c58e1d2cf8245dcc8e72ec525b21992851a0b0203dc138db4f230d70f37f51c81968882f657b3b8c1cb4bb74d5bb7b89ee7bd63116f0ed7faafbe9ae0814486ec5565bbac2968f06e4dcbe1c2f9ccce71763fc74ea72c88804fdfbdc361c526735937f18321ac94eaeeb0b813bf7d15edcf83034acf970634cc4bc1c9a1d2f7e9f3cd275e48a2199a6631feac42b47ef3e84796e5da6fd2fbb221dfb86d5d789f74975930203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "1308c4e4-ded7-4231-942b-f4b2809ab75f": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptionKeys": {
        "1308c4e4-ded7-4231-942b-f4b2809ab75f": {},
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptedSelf": "QAH3EQb114VtkHYzmnDrOflfVSVqPyF3vJBOnvobv+ULz0WWJVyPQ6SJBQBx1VdQ9H041eJgomJ1QVBIS7SNraTZYkdmuLUnsd73XpESL9OAA2SRp9pXvFBJbSZIM8fcc9bMo+8HDUp7hbYGbFYf17zc18kcCtZaYs3OKSHgeK/aAZ3BENL3rZbByANuRPk+fLnVwR27ZraD3JIpTmxxYNjvD/FZBWl0NeyIFuHXUYFijq9onhFYKnw9+Er6HqbRAYAMeesB1zehgm8W2Nmgbe9McPoVin1aZV4kRReDBxA0UBrXNRUCEPIAj1o5DTimLj2CuSw7Al5VmHdZcmafOEpVHiaU1djwmTv6zi1hOkR9kqhJRNT/Ft36pvCfqIPCzU+b2pi1Vfhg73ly9Fg+pcOxbwn6Fxt0JtdFOqJAwt9MnOQKmt/r2EneZ3D5O+UrNalH7A6UDxuns2BovPIoqmmk4MLzARQYaMmnoWeK/hXjQ+GpIbRXMEmSN05gJ5BNMrd0gfZItGFUHhW2qQmhENgimEgB6NkEf/Mqbjq+ktAjwRJwpxXkfsUhuvDz60QPcQOgOQbf3HgPyjVuYl2Cs8MuL9gYSxsDtAsSl11QAnVqEv2l8HhgJ+HDEzk21SuXdzUycyOT97AGdencmoc6055IOiCKbxcBAnpxqnoJFxREfiFvs9sPPiXWTXBAe9Z9MnlLdWh7gR23+/+HFyDbB7003EqyDRcTl+DxvPGaVzux9b4O2q+pJH8djofVLfKfgrWk21Q8rRJrz/4146exAu7rigHjUK+JncklCGfX+qGkZVPcP/dJInevgrbovLaAmsLuShQcjlhWiWy+PH5mo/uK60qwJLMoZuC1CgEwMDQSXCkUOGyxbQhlbJ1psQ7TEr66lO0WPRMgD5WwEpdX9uw0fq5xf1WDz6QBqHUz4wPF0FKJ4wzkVrt8PHuDq7Ryn/jr5SR7U9vHtuDH0haHikc3z1uiEWP1PS+hQvIvfOcMJqdDuhgDXvDLAvk2+IzvQwbDF+TPBsBIypsi3LCU91Oqm/9Fq/xD/zR5lzJkuzWJJH7mEUmFi1JzvoVd4zUTkLNB8vPQSTXOGQ0J+RBcuj0EsZfa7UE9nqMl/V6/kFjx8VEu0KhgA/WvaW3ucvX7Tche8+ZJOq0pr6w/OjE/ZQ=="
    }
  },
  {
    "id": "6a1db724-ee04-4b0a-80be-741517e04d81",
    "rev": "1-a200a2e7a11477eb80ee69cb9b491fa9",
    "created": 1688378864314,
    "modified": 1688378864314,
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
        "18ec80bd-079c-4888-807a-a7014f150c60": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {},
        "18ec80bd-079c-4888-807a-a7014f150c60": {}
      },
      "encryptedSelf": "7fmppg88oj1UPMj1rvc4Rcn0YG2FVB72QziqyapeI00XV9r0fmT9equAjLcoEWLCXq99UUJ3J2Nps82MTNjFYTZkBxKYxD1K5rPmHUC5oTel/wWPMJ1Pk+bgYWdUbtGCu8rwLPObJD8yxvLY7O2H3t5vb4scId2xEnycOa6et8Ueaw2tzO0dBwoRzN0dVDYLx2WUb427TgBT+ra56RSi5CDKCM0A3ejN1YYK2QMD/9a0nKkkWxg2eIaUmSB7qarev1PwPmzz1rske2/pXegMVddccw86F6VkUpZ8T5z16ifyAKlQ5xq/eICaPIw3TsD8DMss/daNUwFVAU6KqLdnglZ+w6nj8S4IAOt3SEm5A/t8NI7ER90RvxaeR4W9R+/1gPTjltPKZabgYOx1iis4/hzen1iTRGyNtxBu650ON5d+sIlgjMrLB5aEnbIgTsfXd1OGFPFqaJRDvkk/sqyZmsqLD8e9vIDbhlEG/9SvVIJVEQAHBpmVNvmQl+IYqhd2dqBoLYahA5qUGvL1i5IRXHPfjZ9mGU915yMFS+wk2yMdwAsjV2wSlof1ThV5lLOb2qtvYHAowNNsd774hOA6TN6AnzQDLsLEzBDmr13+blbQMtAd0SMOFswyHHRZwoq8tjfA14RGLCtwuKedmQoLJgxr9hUL4dG1FXC7uJm542/IKKPUyuVasCHNpQGt89aDLkupocMn/EEua5mjkvNOnBzgMe4mCbXgyYmK9FedwTxsmI+qaIk6npTzYIAIGyIIBXknZ2/5AuGvmBaq+WMDOAeP9JOOqW6MZtwBaKrXJhBdpCc64lvDXJPJD+E0kP1fu9603q57pj9ijBN9Ez4SYLx9HboLBrkJACIRdoNtCuTfpQ8GkfI8/kMtaaQb4FE6W/lh9lSY4OQ7/01hY+jyWRiHAVPJeXUHD/p3v9MTlL8Xqq4S0bsEFiKxhZHmpu9v23HgiVXHQUnovE3GTASZKLIDqXipoWN0vqaz+TBRYEXUkj00ZorHkYnGUcBosqoXGPGPSef8dY4sKPgfeE0FbXBobR15zhRnP5nTHaCcP/a6Tib80miehzGOlkdAxXuwTpmEbXtAs3KtBR9AkArlHgV/hCAKWQl64GsFtHXoWKKKq5TddR12IE3FS5H8UyFM3YcZHVNoGEwuYxMc7SVqqQ=="
    }
  },
  {
    "id": "20ae7a81-6053-4a1e-b1ac-e72abad8c1ae",
    "rev": "1-1d340f285f1a4a7d1ff45d87729e21fa",
    "created": 1688378864226,
    "modified": 1688378864226,
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
      "encryptedSelf": "ftHO6LRGrOGZIu3GCxcS0EVzTJYdrXSjkWMceMne817rVDeCGRY4D7V8KxG3m3GVX0VYGOkP8V/vGNHr3Kqyc71qAqmCXhxNz79s19+qnz8gK4VujgkitUqqgsCk7ZXSUozNiSaxNTF+8jQZnKfQWVitgCqDnDclgnvbf4FLSfLh7AZvDCP00OQUo4Lt9/b5U4pqBMFJ6p7VnHS6y5CpU9ltOz2aIFhuq0Wr+OHlw2wJqwDNmpVONGVIFbITdunyvw9HnITWI78X4Db2PP+RVqUthUZyu5AHyo79u3raDWD3HuQt+0/byW+1aZX6z6EoUgrId+IGpHP4ZgENuSBkvuR8crmu7NVYgkMBz8FcO4+Yp+omwS4aSqvg7+Tb7THd19sIKWxcWn/5g8fKSwJng9o6YKTx8cwSuu8xu/o5Vg/IZMZjPFZ5OKCFNtMY3Ct3LC3aOYZUo78KqKz9uJHKax2+IlTtP/PiG08n6LbaZ3BRa6vRP0BezUD00QBXzE1bBs8QFi9KqNNOrkQYoWtw94YW3TUaY78oNQh2c7O0FvFwf1EB3ofX+wUVCvGfKrR58StPe7eHc1Uxi8Eq/iefCa4gV5B3eF8XzMBYp4Nu5a4S2pTjG7Yo/4OtoVO4d1rQmEMSqg9PpEnHXi0HtB3RVxmc4kGSQduahLb5NmA/N6vFSHPMNbt5w6ZjHbyY5WE8fhFYcQhDNTcsKIbwltqzLkyhbz3R5lZ90JU3yYfm7qCm1jBEb0Q73DSbMryfD2HEw47yTQpNtGIWsRRdy2yA6jTNFTnniK196zgdmv7vYQLgccc5bwATLkIAYvvY+vRRnPLMbgyuXMrQiYfmF5fDBdfpOLw6/pa1P6sQXcXFaoaO22iAObMwnNlDXEM9lK0EGPKeUfPRf5WmxpWwRsThgX2RoRp6FV78pMmx/0zkrPx7J4FX+07UQwj9USXNj+kGqyef50oQKnFvDWfUYbI7oPDMI86u5a+/ZOU6Ezu9Y2LH3YESTGlDeepKw14R+f36HdTGYHNR/hSA09qWq0cqGkSzuxMO/rJ8zt21+5CSalBSAyx931zYgN6JzWgFF/D96HPmJvw+lU8YF06wYQ3ws2lYG87Pp/8bHqsdDFNmBsOleL1oQSTmo0M7+Al/lsx5rH43wZ1nEG2lWeK6P7wR+w=="
    }
  },
  {
    "id": "45234f98-0b68-46df-855b-41d5ec4f57d8",
    "rev": "1-408f561a7c74d00c66c3def9c496da89",
    "created": 1688378864136,
    "modified": 1688378864136,
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
      "encryptedSelf": "0TDA1J0pY6lZUGIdc+L84EWBwEguI1XwrUQoGVzmvYCgdo3wdT+7/q0CkIqLE0GHKQUKSYR2kwPSEBw4xHfx5tRUGYsKuTQ6dMeFSnu5XTdYjJexnr1SE2TB0HEbY3xg9q4SVWPUsfJE08BsQAVrx93lV1Fk1PM3umfQ5tLzJFN/CoR253BEaGwTGXoX4S0nKIRSmbtDDYpwPkNi3lMVFWjuyh7NrG+w3WLcSgMzJV40vwhsCCgzbX5ebAfF12V3LISoo1B1oIyXYXtnpEUQ0XgRCPgLD+IcSzOesNfUxgRy5Q7TqNmD7jUqTIo0Msu+f6up5fUfnc0M4MWEm5Ave0J9X6EQmHdODmVhsBE6jcU+fxWKFniqsBGTpuigCCI0og83bUtXj/qNgNQC+cRhV3LwN0Pprc7JgwpN0X2fviGkuSgTuZzWj0w88Q33l6ciBRQ3YY8/tuSmKe2m+tKzV4D8SoAPu/jgnQ05MLLoQ833uf//QCOsoTpIUt6vZNuolCXU+NC+CuxddaprbArWsLndVbDl88mtsxwLtdFgguBztr7GTlzPTcCGu8qro/FNMyQtuvMf/gRy/HxBNxQQvrMIdnd1tKa/PaJmwPfGtselvZ/vIu6iur84yUZubx8jC2110N1anT80Krhs6Qz0ZbGfbcnWS/UZS9GVCNAKeoao6p+4p5z/ZyeVq2hKFlmoM21sPx+fxyPuhBlO4jS8cRZ2D6omidLxNbueXj9In/hxB34xsI9+cPoJ2s9yt6fUwLyf5KHDKwsgCoCvZUa60D+QJQp+SKGuUKLxJA00iYjWpIrlnCTlbqhWWTjcj+GNv4Tr+CoruArP/8SYVJlT6+5yKKTe2gxp/Bj6FN8bbCRDRwpKLNSxhFIRyzjRNz5h1L2ZVdeXzqHpTdtXoMZpKizsQyNcqb43UwIefRamUflg0wLEaoK3KYng2CKtskz5t7aJ4V2Wh2Jfh8O9LrCgZdh9Jp6s+T43y/9+qgBtcmpXKIqKu90+WfiI+9CSTKND9/ohqIF5rOhPH4QAnNHKiUCi2wuWfiYJTSVNWA3UEt2PxPqPswQ3G1sxBZC+EqDQJwV61wZprU2iZHLbRgE0lIAQLTNCi1GHDlR34cvbQI/H5xwIZS6YIMbioHm+FoVNzBM95QUDE1VfZZVHZU+1IQ=="
    }
  },
  {
    "id": "94afdf1a-661f-4b48-bf12-d79c04d724b8",
    "rev": "1-729fb6b72504a34390e0fbfea4e0f81e",
    "created": 1688378864048,
    "modified": 1688378864048,
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
      "encryptedSelf": "hgUmfbg5aYaQniCBe6rVWz94YzGewz5brEiX2EtxVE/lGONbSgGz1jp9lux8mHPIg25vzoYmnCJLDkQCZqgfICkHBsTa3DgBVf92kDuf9A3ZgoxmrP5q0mneYMWNK3v9tEbyxpJcfEswsP21BX78ry8cR1hAMUEg8BwByesyKkJQREPG2rOBWD2kcQmSYKrO92htNrvgx6dGm6mWRKJGbUd+8+tQBgRUxOmdKtdNmlyybmq3NkuVzIyuqdU79eZDCBoPkfuENuqMsed133UvLVTNXCvCI27Xya4QIYeOrJREjbvAGvdBe3TB6C1PfhoOO7dfNgSVjyizcaLBooiskaChNfo2pO6IvXqx/ZdaDlKY0QaKSx6nqa6iie2NKuTD2G+MUtYuEWlKRoLYe1jk6dA1V2f9RwsnnPKmX+ihGK8PIGKDK/C2TsoXPs/5YG3Ygw6f7DDJ36f6ZxhQfHBHaEXFJY5lYJEOe7tAHc2R1WBgSgeAy8ZPhjlGA9B9l8/BfXUDipldO58i86vu1bZFu/0dO1L8nUkgR8dsXHsJmD6VCE82sjpbdBRvfmHLReE3R/M0GmmdS3Tw6fdR1RL3Brj0jg4uNwOu8jLVFIUBAku7QLZBV9irVSVR54d333LTzRzVyogF4dFOec7nslNGZ/4QxSvzyAdJAlIDCpcEeq3EdwVl3lJzhFB4YvrRGXQyQ3yxtNskv4kqeJGbdn0mt0d+KR0E3cXqF1okZMM1xxDiKRWrdG2xTq6xvXvub///XxvRQch1MG8ouYtc5JNl6gUT7NZr0UhqnpmDUjiHkqdbdL/fR9UtP8CeTglIXr7GRPjvFS927WCwFI+AMVubR7WOmyAUSvFrQwrm70WWPhMLkpVLKj4swpYez7EmAV2kxu/6hK3FPtZyHZPMVUmOHv3iRXO2ZB0sX2rkmajIRQ98HIZcSDz8DX1iKtb6j65wZDjAtUrRjfNxnlh62vVy3n5eQn1HlDGr2mw6rFRwqnW+Swa0V+6/AZgDtm2xQZ54s0s2k39C3yo7Eu5uqoFHUfk/WkNZD6Ed88c1jYfxNvoZ5OrBaBsyXp58ve6wL38fnIu71lvkMYf+0OES9IHziDsNqrQ9wao8z8K0iPV5IiCm8iT99P1ybATgblkhrudxCzwZWpugFqiSTkACZ1B1hg=="
    }
  },
  {
    "id": "e9e89984-9017-4392-bca5-a6891356994f",
    "rev": "1-e3477bb0f2db9d90908089cea9dce261",
    "created": 1688378863961,
    "modified": 1688378863961,
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
      "encryptedSelf": "V/j9gOQX/mefDP346s0BxAOK7swD69rxn9rDujWlPAKkAZkMCZTLzeut0dwF0VViaaL1NAIXHoCCZN/7FvlBXodYt6v+OjnLwo1YGCyP7UIBvSEcZh0t6IsM1zjJzxkS2Yqkrvyq5dH5Ywy6MrZFuh0bdZ85+JxjWF9mvbixJN4vJIUujTq3Xu4diSpFaVIAao0GZTZTaVY4X17ogtOwZFiUlZvESjQHJdGSA8ud4LrVYQdDqQjq1W6gLg1LbGmDlf66QAXcLY45yQG1UIXnzdCCfEuQ60JyXL35ifi730xAZ9VaJ1rsEuwosCReQE+C4VMCKHGEkoqBv2x/dsYScj3v+eN33Vwcq+ME0WRU8Kk5rLrFBuSTlh4rQeWhkR3j66ujZ1ddoOCH2QO7EPT9TFdFwL9807nHlYRawSdVycutkELry94lunxmgH8hTuNGj2w49+eTtiCiRwpRNMkZhQWxO1Hm4wOWPZ6qr5MetNy4Y1J8HUAjYdXD5sPlm2AKtM3vkq6kisUl2wT/46MkPIpzBdr7CJXb6s1jZO18VAY79kJibrW96VPajBIedOTkqu3IXNwfJ5nEkVMDO8rI02EALc/jBBtI67i61F5qujrIjMBKv3s0TFQISEue8nwye7O4eqsbFAIwEzuWJfcjaMK+WaVcY4xox/+/X3DOc3pz84MCAd/NijKcQUcI7Xb3Gq/Metp2+AIn8vd7uefYPHmTaNdypWiw4AJbTRBB3jVQEERKm63Rfx+pX4vVmX/VKRiGdqpu3xOHCX/mgPEWDcBsv1zLF+NZmXJA5ME3hHTrj3lGjAEGMlB6l5Kt5jcZOw3EYVBvyXX5yry6Kid3euUJGd3fxt6OsmMt0BP/qcQMZSKBDZkZlU3XY9d3O/EGE6VgkO/C3Uve5CFSrI4jwr9cbmwSYaNshmkWtp4dtS45WFNttCF/C+etp94r3ZPsGzNMqH9bCrG4U3KINee5kxi5sh1c1Saed2+564/E5y6e+03jY7fEVBWARVcZBWZNEx6Z3TVB+1oHog1tSjKk6J6KLLXvVv8768KkZYaZbCldgmsK0uR4S3WPPsEmmrHRP08pGk4cdfEVVebNNqbFg1UQgvgwvIBTM7fjz/BDK0/IOQfAtxP3v6NChbOGNQQFHVaot1ImpPK7MO7Kz2Tovw=="
    }
  },
  {
    "id": "1fa7819c-0b96-4abe-bf82-cda6239a7b65",
    "rev": "1-a93155ee3f6a21de4dd41693d9f25f36",
    "created": 1688378863875,
    "modified": 1688378863875,
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
      "encryptedSelf": "glyiqoo/QzyD7GMC8rv0mtVh2+RTfk6ReM+yDV12NNorg2N9sSDP+OfUIU26poSdd3EVYXbzugm14qc0th4ifoCc0EIExIL/PLtO0Ac6jBFWCQWJTBIoN4jfwM4JjPVTMJF1q6b7ufXD6fUeKu1eg2+f7fuu7dxMjvYVFbhLd56x6XNtrE6RTZLgqEknLLfteAjBvq3O90sM2Kn5iBbXhIb3b8NmunfOTC+qs1w11nRTmyam8kWG+V4UGTIXgK7g1gEyvomEPbU7Qq2QHCdLhNN9prcgQulcsSkiu/Cs6rMfn21M5SiTBo43/eotkpYd+ts/BgwUY5EP9l+uRlbcty/PRZmXVLKDVdYZsFOoX7zG3FPIdgcwAyyhyKO/ZTRkWW7AYq/CkccvEltta/rx70KSXjhujKfOaZqkhnnMQELBsB9mbGD/YoeualZrQFVaJqyid9eH8hhu1DpFoJ1MzV60LMuolCk0kRg6l/U+88c2NiCscP4IZsjBsbuCWYrxl2BeaLl1jB5/1ao3H8FxBu4RLQMCs3Lu2L1WQ8bui20XK2BC5AZPtpdeqT/6jh2n992x1EH6qotoprEHc4eB3ZR36NMNi2skAZV0fmjSERtj5C/xadamaIqlNlqFO+xXYl0oPeTHcigYAWIDJ+GHdjD6m4QEZGV/qAJDYAMb0qmdDJKxQ9/1KkkB61295aXB7DmOji5chK3imJQ7A5GJbZUhbrFdoFaETmmQJTOhjvayk1hgr91yVOb2vwF8Dp62sByNnaHOf3ZKvwTWldeNQ6cDiahPTGT3ooeTBP3Kw4XOe14ZycQJ+2LJjeMTKv5ns/I0/xzLIvSnUc53Oty/bJe/nT1gvURG84M//miJL0W+tu22F6qL58s1emPh1eE7Iw/Z+k6OQ6L3OSxgwO0PXe4y68d0MMNJGKPBZWoqpTPfm+Ntre62EOBbwY2Q0NBaiovjlY+usnUgYqKT7HuGa8N43gs0eWi5wj12eJezfC2Kgat7ATNwdkITgZanMIKISI4h+awju0WI3Ly5F0W2wnc40hHPtV/RvM9iGmCE6zzlWmxJmIyWZXLWENwowlDE1Av9haUXUUuT6TjtFFimYLP+ur75biWUAgi56disqmrrYuN6PeA92gFgZQv7MZpLjslJvXmWZjmhdvbnj+kNSA=="
    }
  },
  {
    "id": "58010044-4cf8-4387-a7d9-6095f7389eb5",
    "rev": "1-57b6bc3320f299c877c372a1030d189f",
    "created": 1688378863785,
    "modified": 1688378863785,
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
      "encryptedSelf": "uiGJkVZi/+OGLCyAiz5z9D2NYH7k7Be2CuH7aZMnH6rsxSNrhfyn6twfUzVewHemDCHg1FOIkzHZQTh6bajqfzfWpmfcGub7lB8uxz0diMXvjQxwk//T363tzIky5WslkH1C7tCoZz4pEaVckn1rYXND94S3GWET82eRg/3xQVvm3ETp5HbvnDh6QQHFkhwqE1ZHUSPtqwaro5iRFXFyjsO3WTjN5EBwdfm8rvV8Dumr4J/yHy2YfhLVDFxIXFv9/ycDVh9MnYYmSWy0oVL+XB2iYGyd+U5zCYbFe1HYXEEsCqUxpDmenRI6Eqrf7j8edC1YqhgQlvfaUQZW32s+hYPmNAu503Jyrk4Gv46j7qfwXwbDqokhUqZBTtkxw+vWN1YE6kqIgftOyDdaYVy4aWUvtg5DGMXP9C+3Ur3IbVVwFLf9Ti8/YbQEj4Ydim3+lonhSvdFguDaPRIvIBOS/XqOBuBJvK6vYZa0EjKpOeI8LhYLHJv50QRQB4n2DwQaaCsAg4X27TWjjKG0Imj2kUwTlYIPxzxkNMPI25am6fzX6tSqnJ4/HwsFuulKFQBhcxucmnlQJira6GbKM2HzR0dWuMKi3D2ucwwKYziFA5+a5p3NXqkU0K1ccSRDKWK2++SXSQnMBrqhCeAHYi2ui9NLtv3JvFhOdKabIoNjOgI71WX9opjfzU9NxWpI9EVp3YhkxSPBuwfVZ0Ny1PxM0YbH/nspp7q9hJ1A7iGndfO9ykigH7ebdXDlgpbq7q80V5zx0IkymjEuOVBuVlD0jd5J/VL/ugdSP5JKg7zm+6tljnVqQn/lJLVLgQRaxE/XMz4tkfP9oJ3BddY/xQTsLUo0V/ZnUznZ4EsTY5ocpWkfajocs6RdsCYxU8zPo60V90F3X37eMFDWBWhcbh+Lgb9UXnUq3P8mmwlaRfq/BL/18vCqyU5z1W7ywd6dWOEEmxl593d7r0FXty5XMDnOkbg1GWcjeM/DJvadxLosOpW12S/pGwyL+MJS9yEHShZnN/BC2Ez2yCDW9WSJ3jP9QmaWLgzl+HNCRRXpdk7bzR8VFliPhigZBGGS9q65WwAWwPmmpE15H0BN7D5XmvSR7M/AzSAJ1m5H1zExiA9/2ApRh1KrZXISIm/FHc0pRjq9A5s7s39PF219zOo8YcsZbA=="
    }
  },
  {
    "id": "c7a82369-4a74-4321-bfbd-d4ab66523591",
    "rev": "1-99ddf9df99c7d157ecca7b4f57629528",
    "created": 1688378863693,
    "modified": 1688378863693,
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
      "encryptedSelf": "qQisltYua/kj6H+zDIAzm0ZEjL/0qfOb1Q0DK7Pd46JGxv1zJ43mPyMMLf2/bZhTEuUy/F6WwTesy8nAb9xW3kS4MaG42WjDRHRsgsjdULzb9byGXNP8OckwWGbqeDJprWjvTwL/qLVjcxwZTcfoh1PHCy0M+NwvWY1mgFLzRjf9KVgiIm5/BYl7a6UAzFPBM60wezHOY6mKhTr4x82w6y3Zjwv7M6Hu3s1j8OxAMYwDQZWw2WJqTfj4E/QdppkxvFFXILe/Y7e9ZOCWZuU9RK2R+mzUU2Vn7CujM73tv0gFeyxwhj1CmWis/TQdkBV82oGszsrvjKp3ixr6znn3HwnIJSZRtdSH+S9W8oAnvq9NLJ5D4W55A9yifIJ7Mhjfxo4RdPB62Sy7ooutH4yyYbq18BBVUY5wilHHR2MMKlKoBodI4vCN0KExTPieJ9Bsd2XiZjhfAjj9uhN+AnYjR8mCpGvTpVzBA9i3Zy3oLh0DuGS3CeVdOVzQ2+FkqlbuBoEaQQjCDZYnl4KV3YebKmZYiLJ09nXDU9d5v6RvamfrqLWNm2dxvAdXGyrD9aUhogxXQVJgaTJINZxiv8cMoUMieEBNrO+AdXsbCy4s1BYYyxhcFMST9Gtd8g8bmRy65DxzizqC8IoCJjsYFwvCnCjOJ+3rkP/8BmXoHTFNBzLlSHiCGRlzcIxyG9AB7p4Uc5bWBRSIvtYM/S61Fh/8fJd2inueEgC49iS6gdT/F6qAtPA/do3XtwzVV0eaXbMzY/YxF3M+4+A0pP/JgEPKkmlQ21NAgHkjMPSjSzbvXv8atp6jabhXKdKNToDO9VnMXatbwubocjWWB1NiP//l009PksqSzk4QZCwo1eKQgkLR/TTnkPcrMu6ROoaMwQKKeMeo3Io2FoHpoCqrftCfDJ5pLqSqmNzVQgVgzCHAAFQN9S9JZsv0386COqTkvOEGmlzvYUcA0Ikwqf0PzMUHrIrNSA6mLiBbGSoHL/s6UrUZzzFMpNp3mjCGGOBTeLydEt5zrBNK1K9HMQ9ryrnq+JNzMuAMsCF5P9fd9BbaAIbK7EMcPEcbmZ3eIT2wzRmsv0j+eeqPWRPt9Ufn/r0P+l4WR2IfE1WkzvsupAdDEh2pauokX7N1ybUeAa7C20wEFX7GjhPkUA4sE1+tmbueew=="
    }
  },
  {
    "id": "bbb3557e-e581-4904-a324-40ea9619bdd0",
    "rev": "1-f8b1ab17959bb5b3fb9c953fedcb9609",
    "created": 1688378863599,
    "modified": 1688378863599,
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
      "encryptedSelf": "ZWTFJIRvZ+T5IGgKPXuCm+jx7w9Peaw6inHr41/PJpdG7djQn+X6/74tu2jEkWO7OUGJ5m08DEhOHWm0Mi4GoAGbMMaZhzsfs8ATZpNcCWfPXgplEdEW6h5RNSWi1c0S/xAELyNpIpS+K5DZ/MzdWvPsUNPywjPPDRIv4Nur33zT2EOkB8CpHh07MXb1C+OX0xHOtPWq/AC6frEoGlWT/06gNuohFynKBxKRfp80WTFTQduRVQGDczz5NrvsXLaGPv3iuJFFmIioTnh4t1iTFSLgHXAGlt+XiM8hx2/Lpj66f1Hvp0FEV3yKdtMS17Sk2O174K7EYv37Jci6vwP+Q1gdHBJUo3qtOjcFqs8gmSrcqys98qrfIzpnP07Q1y7kprz9NGWbvXDUKSc+i7KfZ1kxhGKLWyoyU2ZTO0glHk+chvN0+3fwdbFQ0SLQaU1NPf+f4zVvFTehmYPPvHOeEuO60J3VnXLT99ToYcbbIR+swkw1+0RbRcKizVHtU/6QJGzhTb3Ac5hXD6CNHTPoHvywROJ7AE6miS2KUDoQv2iCh64TQBMsmoylUiWXdoAEpC/9vbHWMT8RMv7s+3JCXTHvb8eon9dyVR7AFaLINQcjACrGb9Z3IRHbk5ejNPfdmqwEI8SyDy51qWNRcYRl6G14LbZCdnTQuoiXVJA+1HaZHsLa6Ur84Ask0KeP6u4oBP0/evPAgCONTgo14xELvEsUcUwuSgiXZrBhHnWqewhEcx6QeEkbuIHC4w29SU68tnOR0Z6O4f7nVotP5bMU1scUU+k1twTTxPwlokZ7qOvjWoW5CXGZ7+3R+3LI0NjONAOAOhxbvZXFewAwHjpdqissL2hTq2iZDcyM5M8+/5Fd7uJHJrhgfS2lSIDluq39uxm2Xf6uLcyE2II0z+gSTpvZsuCWM8K+MLCA5mePOszEQ/8puiOAlgCDHCBZixsQ6LHXKgtK9vkLGD2KIOwBuBcDgDA1V3xAQ9D/ZF/suIja/CBTn4ywkOVahsWQ0knr2w892FNLddXF162/ahfcQGx3+TxOxQ3Oxne94LJCibWuFNZ/EugsddwtmEFhE4v1ZHZSA6U+TZZXoLeHsFrxHTcUfunOltw3uOH5SYGK8u8J7UWvSLx8JnvIQ3mNZ7Kv++8U5xgqWQ4FXVkrWicgmA=="
    }
  },
  {
    "id": "6bc3aecc-d8e6-463e-b56d-a5f73182ed5d",
    "rev": "1-447500afa82bf70c6e30f559194a7ccb",
    "created": 1688378863508,
    "modified": 1688378863508,
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
      "encryptedSelf": "Nz3Ja13AVASdS+X6KfM8BVzAzytQCHQqNllYT/+D9yI70xg3HPq1lHDL4E1xFtNzzw94U2VB386lKRkDSM5RN7eWSPKM52oqgIWgIlyg/dUnF0qyItS5u/P3oXc49zS6bRTUKu+YETumUD4C/wziBixdrUy7qvItcOrbB/7EWbPn7LwTY9s0n4lTrtdZEonPKltOlx/xXAfbgzu7wgJ9uTnRHB8BuNfxxztMSZwKeJmijC1Ojawx7epPqsXPRYd7K683kdpmEXRcaRfMHDcQ9NpWyfcu2RK9GGZ2h9NZ/pQpH26BlF3lr69qM8+uDi5oBavF11i8T8jBaV/AX6joX4YTlzR1HrP39PYccBOmw9nZUHKr5QbQQdUXLzAZtuSMARf2h7ui/pyUfWBq1f2nS3oc/20lV5KVH0Mx4q/JCM4KBbMgm391Ru2pym/130MtYSujjKRac6HE9rmsAJAcH5BUkYITsGP/CZYmM4h94iJBMUBeIzVK+CGrxinP9Bjx7dXV6a7jpp/RARR3WCCDXKOtqzcVXy6klipCQzpx9Ois1xRi/pHC8gcO2PokmDwiMGqERaOqbSsgh7VdkysacWhMGR3wc/qN2ZJcQr++THQdTk0vsqmphdKLmWiTaQqkKS30CHcIReGm/C5m04q0PjaQqtBPdZ5ceC0eFL2Gvb82VVhlXDM+C82gdjolT7UO84WiLeFyW5MrmkBq1D/JE57dTVAtEcIrpauuTYc3nREQcB8Ux98uqJPoJbE/104JnVYsOhbPlVIdkPD4msfETYAxcBmMhHREmxLtmeEPTUDQ3qSKuR2YUK89OSxxw2c6wKUyJtO2wRUAl8SYSEdryaKF+KIgJpmRBhLoYkTlt90Cdyr7amVMZB8aqws8qNH7/4E+6uo4+oZedRECCIOxNHAafwVF1Tfq28FkHKpG92VBGKHYCnp4AYOsRzH1/rtEu6CR+zI/FX5Cta+Eg7C8l8KzJW4edRGKtQgmEXSfDqP+3rTz8852eLsnSGi4PDScXwI1+sVfrzmnNI6UbzvnN6B1hojUm2GaULyFnFF6J+P6LZpM4vqTVx10yjFSjFkWEwQp5OAhsI9/osZEy8P49dGhJAuwbnwKAMJmIGC10vwMTyMOhUGCIZaTDewYcdtsI/BoIDMFplyHNAKfZv5ORg=="
    }
  },
  {
    "id": "39ac1fe5-fd9d-48c1-9f26-b92e80c7fbb3",
    "rev": "1-9134568b5c666ef712d97fc9ed2197b5",
    "created": 1688378863410,
    "modified": 1688378863410,
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
      "encryptedSelf": "KP4hyVs1dUbp2+gB+VuYSLaI/D8tCZLqwUQ2a8IdxoFastdnYn3THs3ryvekZlRmQu8E798oUeXga66xFMJnNXWxv/ixs6733ekqCxDUXfoKs0oayFrzYLlVqF2FiyzxaOOL9Q4qwti86q4MG7H6EsXPj+wI6YU5hq2400w/SbwKGOlDGUIf2k7dmostjoVV5vLyoZWFEVgXbSC+O1HzcbDeppj5/jggWzv3rr5G9AZXtQjuozW4MbzlG5RJNUbNLUEf6BNcSxWZCP9gmXdYvI8BVERgV95R5WAKTmA8iFYfdLX+eDLQV2winrmpi7qhsNg9xIPZLUE7y9ERq+IaQLN78nOrDUj+nQVO1ROCPQCn6VlqXsqwEW4ahjxJFaesy1SgfdUAgJJZ821nktqlLw0+TdtmiRZleLzW+2m+JvxLqAeODPK3Uka8yeoB5nuk0trhdT4arQm2esnaCriHgg2R9WTtteiDWiJyPowWYANfrYi31niTWQymW+K/KG2vImlibDPlnPQucZoZjq+FCEUueaCLBzQoCga8TflJwpSikuRwyegubHiBsRHZaqchq4cS7hlGM56aThSYyUCTddnh/J0JmBFn7FlxcmtjMdNDbwK0fGH35ToOHU8xGFsMLiUxWIzLQVUxUYaulHNhfGDPLx1Po8L6NMDL8XPfk+A32uvGNqN7hpGHBXqkUZKYwdhv9Hw4wI3sp5yoWRt0i9jyvEYSRpLWcQpNLhdt+g6tmYfh8Z/sBQyzW18EQkSFIOj1rVgUVkgnl/JVMUEbLWAbfzB2osgPw9RfQCMP1j/JU9p+Fjw+W38Km15yljE3REkVYeul2aLkm1JKwHvHFzsGjuLUpID9ye/nQvQjwaj1StLsQPA6G0BoBcp5Nu2s29JcE/HYK7/Vj0Ps1NlHn5PCobChNNuwuI2koGaaDzqzvXfiZdYUpy21E5QhppkHgsGZvSpzKTbZY7hZbNUgZp+iA+lAgAStUVOmesapmmY3RdkgJGnaucpqcyJ98GzkUXCEx9IcGnsbEBh+UEf38lOUj9xdmnPmokFgPEPVOvm37uOqpNWYVHx1SCxTD60PhiPYcfEGu5e1r3gsY9NcQ5yEYR5c4PdkkGPfaXHwSlXfO9CtPs1+7Yo7y/Fgm7mQsPpH74yek2dbkdevcEpuCA=="
    }
  },
  {
    "id": "42805be4-1fe4-4699-ba34-5fffdb27587e",
    "rev": "1-a67fc0577cd58e725a353db040234b73",
    "created": 1688378863302,
    "modified": 1688378863302,
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
      "encryptedSelf": "zAQGa6k+xBe4W3pqqlnWmuXQguxLgltF1lx+Z1hO/GUcfA5ygOS9KAycgoldcj2WWVC11+lcKI+RVEOkkqz4hl0G+lo6rnSqlYoMSFoQkQp9Ri5a/6sdmhDQJrPV914IKgGgKYktz7cQGS2+DcPhwDZ1QRI/9KYP665uc3UHxmKJroOLXvBtPzi2FTLkGy8duSKe/mFXBDtfuX9PBXK4zkt8CPQx7bRzIs3gskl+zCPSN2taCeXFlnWkgnox+H4Rm4/kaWAA3m2qrOaFxsBTaAgzfm/mLqxHHRkAQJJe1ib7AizhPHzMcESf/yXqw87OGCUOONSZntZKaTXZHCQEAVf/VjPYiO34TWF93PboGmH4YlV0E3jSp/WiJg6VgFkErp48bz1v7E5MCtxcwylkTFOgkAp2FSTbmIAswBqnTB46UHkbG/g4EBxlONvdAGmgrkM4PUDZso7c0gAKSDRZkh6xHyK+iR+7teJTLwel/ILqZIALfnZZbW/lZJxtWiQXbvDG7W83UKd6LrTfMlSIkNI+Zo+omP+ri0lBClaj7q3BZLOV9qi8lOll/WzhRngCN/XPmwf5Dj76G07PS0NiFm2BGPGSncTYhMyMeMiaSX6J/EwDtnRgZ9JwqxvNRfIJQHqWTofINvECCuoUTlJqp5loh+Ibf7NB2zt8tAPSFe2MpFWhB643Ao1KOxMU23WbpKgMNsQ3ZslQQR9yLXaPdBucYT4T6VYWyg4mY8kKqdIwothQo972PM3+cWLVYvDxHW3DfclpvyE+hdUjC8WEWl0VkTSgY7zNRz2aJ+FcqYGJZVML8CIZnKzcaNub0t7yDDD9aZ8SjmGgRCaB8+pJ4dD50j4CfGSdVsUKnHpyOeoR5jgZe/uJmeEwKJaEdhaHTTsWu0Q+wCt95bBVyzevkwq25lBWEePFhZVCxr4Ydwwv+J+vpND+Ac19EpmMw+X/YCuaqa4NTlTu7Xi+na6vmNZTMbaEtPZvaJ7ntJWAmcfk4NAhGw/+7hzn8pDTPHbrQSorlEmvwYWhFEabB5pynPX/hAco/1wpxyS5H5zjbi+PzDpq/RUbryNzASxSM31BlAFmVkceENtiOmpPf/+dYh3javlRZp56y8Ljr3GXha807BOQfk8K4vjLY/B09kmsJqZKKKizjd3u+v97nT7mCg=="
    }
  },
  {
    "id": "17217867-d9ba-428f-a811-fb8dae79f78f",
    "rev": "1-456686872ebfcf2c99db417dbd3a9bd0",
    "created": 1688378863213,
    "modified": 1688378863213,
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
      "encryptedSelf": "m93W4NacufIKFdFxpEA/8sxgcw/bjTuUX7SD2yKk4Ze+IAaNEeEcYYADYTuFGmJIUO6CxeUQjat5IdEfW2zAz8LQYQo6SFjOdoM7Tn+J96f3kXdkR9Rpo++Tle2/OUCyKAMjbQpofXwki3nYiewiRFu3uQQlj4hRAjjr/4SBppmTalZlbVu/n+O/NOVze1pFsAJadywsnU3WywFCZbEVAjjDM+7sVnb42kNN/YrvSfpQW1cS7mpC5QNlVoZMWGoH8LureHmf8h+0Ua7lzi3G5YlYS41YWeCNlaWUWsB46l+FiSnnq+0onjVmHOWZKb740cgDdKI3shL9ZzvQs4sdGvSrvTxfQVBDY2qqSAE6opHp7gUUoXcv05tShEVO2pV99UxP3PH6AAXqhXMg3IkuPO3xLDPZ5b1irEJQtZX8rEEyRk9S7D3QYU3n8iPfV4qTYjNpvghwU/M3YcN0JbJ0UPFCDcxH/H4tYinl5YzjTtP31SLniPbr10rGYhtAkNg2RfiZQALuiQQSr2YnveR0eQ8L4w92N98yAjMaNwTGzibon7KwkbqCRSLj4e5kr52Oxp2sGNUJI/I096DO5AwE2iqkvTnX4RxetniC67X/o+ONVoaeLsHERy0KA8cmLQ8SEfbH3P7fmIEia9RC8/rpQtc2YAZYIvWbGGN9IU8dn8MxAyVSGAJ2TFn0b3e6X8TQCvg0HVf+IFY9EGSnNWa3jGvRAaWTf1IHPo4qElgMlZcC++o4TyUuHaTcZ4bU8y2kYxZ+exOWhIWuQCDBHdzcD14up3NDVqBai0W1JD15K7TSqZmKDT+XZPnxjjP6ihtPkP/xw2jjcvSnE59IkNQR9y1yGo79N3IBST9IYbBDoAKQneWahHY0aLHZ9cWeEW7EEYvlX3eMj+/FFnNdw5mzpEzUt6lQBoPhwu4CNUkmUQn5cM4mViGpJrvJ+jMke/CpxJ4KsMUFpltD5HiTMkxWAVXhZFf+/X68YuH8wju/W19OQKPUlvUf+lZgikBatDnhxWWjpnbuH+8cqry/L0qkU3YaeC8rFHuviV5KHkcd30A0sVbHa7UsAgEHu2qAiWb5rXqrtjqqIwxdsxoXu2A0wtyp1QrANT3hADaneZI1T3AvJoy4k+zkhMzFctovCgHdaNbHmaIC9JgR/ORVunKQ3Q=="
    }
  },
  {
    "id": "4a08666d-015a-4ba0-9134-28cbc47360c8",
    "rev": "1-7a3467c43809d36b86dc865472ef3cb7",
    "created": 1688378863099,
    "modified": 1688378863099,
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
      "encryptedSelf": "b6pI2xWqnRiqnWHp6IndmTTe7eUtsdUJbI7CMKfXXeJ1l3d06BzPvvV3Y4e7dDHUv0ty55C/mQYC4oL49i/z1X3XZvXkacy6nf3pHBeoZ5m7nhb6+PLeD9s7yj7ipd6+r0FxmtTszfReQeyvHQA1lh4a8vvxYRl3iPxn7QSrzFiNaJ3iHti72RDlekV/9GSnXklqf7FRZ9ZInohiEDZvqa8KBbWgSKNvEBAVeFlLoWeLbIruf5bgE7FxfD8HZl8Rzo3861ldS6LazODrxctLs3SN2atBKnyIMlwnn1/dgk5FHxEg12cCHxicrGb/5xSdImmgOOQcGIdqAHJMhGN2lrowTXAfBufvf7kdOa4f5kUsjQMDEvckXVceK9aJHxIbi2A0EoQWhaCcy0MylYqyMWWigKTifINYbhqeKyVTjwraIbkOJ7RLI+kqUMMeHAIiLUHXC1H9FzxuarS1gz6mpUjihSG2e4wOG1ef4xv+7lY4uV5eRktFjJy23ASeI6g7sYBrWICCoIB5YaKEALUDzeqzVdFXIpvhifINhxmntU39g36H6H2bXHB0FbcSklTejPs6xNAPfo79XNsjXu/GorSZG7sCC60mFXFx/Oivu+Ao58DqISe4bJTp6FwClRG2O4zNYkWLwEtNcUA8DaKy5ubqcUbA9whEV94bvL5jP0YH/zWgw7kYaGxeB0J1x7wMLCdq8RbxE4WaALkR+zS6FBRB/6Zx84OjUEj8olSYbz00+1QWDEuKtuvCD9X/vWf6/tpL6IShOlZ8akI7sSDF/4F1t8s9nRBs5u7xRjx3sMyDDg1DZ2w07xwd09rsOkbNpaEmKrcyRcIq5a2bpzWAODooFtRzhKr7745my9xBIiwQLaZRK95FNVWxnbo3aT4HGF0BRWjvnM0nFDKPiT4Ea9W8KTtjR1kSVzNoQL9+zgqpGTQG/TWBalan/xWtLCoRdhAO3fQmx+i59JDtt+Z0bsPlHSyqVnH8J2Rx37ZmmxS96DkZQZYvUdNtIbcAO0dS44Emw4m00sLKfTtdQVdbTxjBtOAojA99opnPtoca0lLFRoSYxQHU4wXvZl9dh5MGQsbhg84IBg9hla+Y5KaQlWhLXOXhx10bH33oi2fL03uLAVZI6J5GfgEEOvoWflAbZBSbORp1BzVuiGSb2aQu8Q=="
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
    "stringValue": "e972645d-6cf7-4927-97cf-dfd5684a651d",
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
    "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d337ab5696392ff2917383ea719f8befddca81587a0951b7c725eb55db997d9317ab7898b2577964697b522f175762bd25ea34ecc499607fa4b88f62dc05205b695aa6a63729d0384b144fb62aee6553ba0bd396f5f61560b3a0a598ddb39cc43550e8bd18271001330b0395d66d0b22777714e8d3d7b24c0295d1d42e3a7c0fafb375afd223e1650977f2fb825ada314ec087b259bcb635d5b43c06d0a6e4ba0e08119159713da75210b9d416679e7a9e1d211ac3f0034c39389d476fae03bac3aea376c94f85536ad48a7c643aa8bc9014c60e6bfa944c6133d229a49c90e46318091094650317cde650eeae3167ca71f553645d9854c8298800d8e78ae6ef0203010001",
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
