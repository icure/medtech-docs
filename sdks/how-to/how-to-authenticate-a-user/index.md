---
slug: how-to-authenticate-a-user
---
# Authenticating a user

:::caution

This tutorial only applies to the Cloud version: you can't register new users in the free version of iCure.

:::

When using your solution, your users will need to be authenticated to iCure in order to access their data.
Therefore, you will need to integrate iCure's user authentication process into your product.

When starting your app, the users may be in different situations: 
- They start it for the first time and need to register
- They already registered and need to login
- Their latest login session is still valid and you can reuse the corresponding authentication token 

At the end of this guide, you will be able to implement authentication for those 3 use cases using the iCure 
MedTech SDK. 

## Pre-requisites 
Make sure to have the following elements in your possession:
- The iCure reCAPTCHA v3 SiteKey
- Your `msgGtwSpecId`
- Your `patientAuthProcessByEmailId` and/or `patientAuthProcessBySmsId` identifiers to authenticate your patient users
- Your `hcpAuthProcessByEmailId` and/or `hcpAuthProcessBySmsId` identifiers to authenticate your {{hcps}} users

:::info

Currently, you need to contact us at support@icure.com to get this information. However, you
you will be able to retrieve it autonomously from the [Cockpit](../../../cockpit/intro)
in a future release.

:::


## Register a user 
Let's say your patient Daenaerys uses your app for the first time. You will ask her to sign up.
During this procedure, Daenaerys is not known by iCure system yet. Therefore, you can't use the MedTechApi directly. 
You will have to create an `AnonymousMedTechApi` instead.

### Init AnonymousMedTechApi
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Instantiate AnonymousMedTech API-->
```typescript
const msgGtwUrl = process.env.ICURE_MSG_GTW_URL
const specId = process.env.SPEC_ID
const authProcessByEmailId = process.env.AUTH_BY_EMAIL_PROCESS_ID
const authProcessBySmsId = process.env.AUTH_BY_SMS_PROCESS_ID
const recaptcha = process.env.RECAPTCHA

const anonymousApi = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
```

The [AnonymousMedTechApi](/{{sdk}}/references/entrypoints/AnonymousMedTechApi) asks you to provide multiple information. Here 
are their details :

| Argument             | Description                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------|
| iCureUrlPath         | The URL to contact the iCure API. By default, https://api.icure.cloud is used                    |
| msgGtwUrl            | The URL to contact the iCure Message Gateway API. By default, https://msg-gw.icure.cloud is used |
| msgGtwSpecId         | Your iCure Message Gateway Identifier. See next section to know more about it                    |
| authProcessByEmailId | Identifier of the authentication by email process. See next section to know more about it        |
| authProcessBySmsId   | Identifier of the authentication by SMS process. See next section to know more about it          |

You can learn about all the options you have when instantiating the MedTech API and the AnonymousMedTech API in the [Instantiation How-To](/{{sdk}}/how-to/how-to-instantiate-the-sdk). 

Since Daenaerys is a patient, you will have to provide the `patientAuthProcessByEmailId` as a 
authProcessByEmailId or `patientAuthProcessBySmsId` as a authProcessBySmsId. 

:::info

If Daenaerys was a doctor, you would instead provide the `hcpAuthProcessByEmailId` as
authProcessByEmailId or `hcpAuthProcessByEmailId` as authProcessBySmsId.

:::

:::info

On node.js or React Native, two extra parameters are required to set the way the SDK will handle the internal storage of keys and additional data.
The `withStorage` method allows you to provide a custom implementation of the [Storage](/{{sdk}}/references/interfaces/StorageFacade) interface.
This implementation is responsible for storing data in platform specific storage facilities.
The `withKeyStorage` method allows you to provide a custom implementation of the [KeyStorage](/{{sdk}}/references/interfaces/KeyStorageFacade) interface.
This implementation is responsible for storing cryptographic keys in platform specific secure storage facilities.

You can find more information about this in the [AnonymousMedTechApiBuilder](/{{sdk}}/references/builders/AnonymousMedTechApiBuilder) documentation.

In the browser, default implementations are used that store data and keys in the browser's local storage.

:::

### Starting the authentication process
The registration process of iCure uses a one-time password (OTP) sent by email or [sms](my-user-authenticates-by-sms.md).
Therefore, Daenaerys will need to provide at least an email or mobile phone number to register or login.

You will also have to implement the ReCAPTCHA mechanism and provide us the computed score during the startAuthentication 
process.

:::info

Check the official [reCAPTCHA v3 documentation](https://developers.google.com/recaptcha/docs/v3) for more information.
Also, do not forget to contact the iCure team to get our ReCAPTCHA SiteKey that you will need to implement the reCAPTCHA

:::

As an alternative, you can use [FriendlyCaptcha](https://friendlycaptcha.com/). In this case, the `recaptchaType` property
of the `startAuthentication` method should be `"friendly-captcha"`.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Start Authentication Process By Email-->
```typescript
const authProcess = await anonymousApi.authenticationApi.startAuthentication(
  recaptcha,
  userEmail, // Email address of the user who wants to register
  undefined,
  'Daenerys',
  'Targaryen',
  masterHcpId,
)
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/authProcess.txt -->
<details>
<summary>authProcess</summary>

```json
{
  "requestId": "8785543d-490c-44d4-95e9-ab4d97edf888",
  "login": "1iu03ja0a-dt@got.com",
  "bypassTokenCheck": false
}
```
</details>

As an output, you receive an `AuthenticationProcess` object, which you will need for next steps of the procedure.

:::info

The `masterHcpId` represents the identifier of the dataOwner that will be responsible of Daenaerys user creation.
This `masterHcpId` is optional for {{hcps}} registration but mandatory for patients. 

It's good to know that after their registration, user will share all their future data with this responsible. The user may decide to stop
sharing their data with this responsible by using the `userApi.stopSharingDataWith` service. For more information, 
go to the [How-to: Automatically share data with other data owners](../how-to-share-data/how-to-share-data-automatically.md).

:::

### Getting the validation code (OTP)
The iCure Message Gateway will send the validation code to the user. Since Daenaerys decided  
to authenticate by email, she can now check her emails to get this code.

:::info

In a future version of Cockpit, you will be able to edit the email and SMS templating for the authentication process. 
For now, these have all a default template. 

:::

Once Daenaerys retrieves her validation code, she can come back to your app and continue the process. 

#### Completing the authentication process
To complete Daenaerys registration, you will have to call the `authenticationApi.completeAuthentication` service, 
by providing two arguments: 
- The previous `AuthenticationProcess`
- The validation code Daenaerys received by email

This method will also generate the public and private key for the user, saving them in the `keyStorage` of the 
newly created MedTechAPI.
 
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Complete authentication process-->
```typescript
const authenticationResult = await anonymousApi.authenticationApi.completeAuthentication(
  authProcess!,
  validationCode,
)

const authenticatedApi = authenticationResult.medTechApi

console.log(`Your new user id: ${authenticationResult.userId}`)
console.log(`Database id where new user was created: ${authenticationResult.groupId}`)
console.log(`Your initialised MedTechAPI: ***\${authenticatedApi}***`)
console.log(`RSA key pairs of your new user: ***\${authenticationResult.keyPairs}***`)
console.log(`Token created to authenticate your new user: ***\${authenticationResult.token}***`)
```

As a result, you receive : 
- The MedTechApi instance to use for Daenaerys (properly initialised);
- The `userId`, identifying Daenaerys user uniquely;
- The `groupId`, identifying the database in which Daenaerys was created;
- The `keyPair`, the RSA keypair generated for the patient; 
- The `token`, the time-limited token created for Daenaerys, to authenticate her; 

Make sure to save these elements to be able to authenticate Daenaerys again when she'll come back on your app.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
// saveSecurely does not exist: Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(
  userEmail,
  authenticationResult.token,
  authenticationResult.userId,
  authenticationResult.groupId,
  authenticationResult.keyPairs,
)
```

Now that her authentication is completed, Daenaerys may manage data with iCure.  

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Create encrypted data-->
```typescript
const createdDataSample = await authenticatedApi.dataSampleApi.createOrModifyDataSampleFor(
  loggedUser.patientId,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: new Content({ stringValue: 'Hello world' }) },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/createdDataSample.txt -->
<details>
<summary>createdDataSample</summary>

```json
{
  "id": "c4b044a9-5c68-4fc8-b2e2-0cb94cdb3f56",
  "qualifiedLinks": {},
  "batchId": "ab12417b-e415-488b-a0be-295387d5f993",
  "index": 0,
  "valueDate": 20230328100113,
  "openingDate": 20220929083400,
  "created": 1679997673343,
  "modified": 1679997673343,
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
    "secretForeignKeys": [
      "3fa16d0e-4d39-4f4b-a412-439bdf100f02"
    ],
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

But what do you have to do when the authentication token of Daenaerys expires and she needs to login again?

## Logging in with  existing credentials
Each time you complete the registration or login process, you can save the credentials you receive
in a secured place.
We symbolised it through the `saveSecurely` method.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
// saveSecurely does not exist: Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(
  userEmail,
  authenticationResult.token,
  authenticationResult.userId,
  authenticationResult.groupId,
  authenticationResult.keyPairs,
)
```

The first thing you have to do is to retrieve Daenaerys credentials and her RSA Keypair
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Get back credentials-->
```typescript
// getBackCredentials does not exist: Use your own way of storing the following data securely
// One option is to get them back from the localStorage
const { login, token, pubKey, privKey } = getBackCredentials()
```

And then, initialise a MedTechApi, authenticating Daenaerys directly.
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Instantiate back a MedTechApi-->
```typescript
const reInstantiatedApi = await new MedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withUserName(login)
  .withPassword(token)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(
    new SimpleMedTechCryptoStrategies([{ publicKey: pubKey, privateKey: privKey }]),
  )
  .build()
```
The MedTech API will automatically load the keys for that user from the local storage, but you can also pass them
explicitly through the `.withCryptoStrategies` method of the builder.

:::info

You can learn more about the Crypto Strategies [here](/{{sdk}}/explanations/crypto-strategies/crypto-strategies).

:::

Daenaerys can finally manage her data again.
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Get back encrypted data-->
```typescript
const foundDataSampleAfterInstantiatingApi = await reInstantiatedApi.dataSampleApi.getDataSample(
  createdDataSample.id,
)
```

<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/foundDataSampleAfterInstantiatingApi.txt -->
<details>
<summary>foundDataSampleAfterInstantiatingApi</summary>

```json
{
  "id": "c4b044a9-5c68-4fc8-b2e2-0cb94cdb3f56",
  "qualifiedLinks": {},
  "batchId": "ab12417b-e415-488b-a0be-295387d5f993",
  "index": 0,
  "valueDate": 20230328100113,
  "openingDate": 20220929083400,
  "created": 1679997673343,
  "modified": 1679997673343,
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
    "secretForeignKeys": [
      "3fa16d0e-4d39-4f4b-a412-439bdf100f02"
    ],
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

## Regenerate the credentials for a User

Once Daenaerys's token is expired, she will need to authenticate again to iCure by starting the login process. 
This flow is similar to the one of the registration phase.

As Daenaerys is not authenticated anymore, you have to create a new AnonymousMedTechApi instance. 

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Login-->
```typescript
const anonymousApiForLogin = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()

const authProcessLogin = await anonymousApiForLogin.authenticationApi.startAuthentication(
  recaptcha,
  userEmail, // The email address used for user registration
)
```

Daenaerys then receives a new validation code by email.

Since you already created an RSA keypair for her, you just need to retrieve it from where you stored it previously
and provide it to the `completeAuthentication` method.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Complete login authentication process-->
```typescript
const loginResult = await anonymousApiForLogin.authenticationApi.completeAuthentication(
  authProcessLogin!,
  validationCodeForLogin,
)

console.log(`Your new user id: ${loginResult.userId}`)
console.log(`Database id where new user was created: ${loginResult.groupId}`)
console.log(`Your new initialised MedTechAPI: ***\${loginResult.medTechApi}***`)
console.log(`RSA key pairs of your user stays the same: ***\${loginResult.keyPairs}***`)
console.log(`The token of your user will change: ***\${loginResult.token}***`)
```

Do not forget to save these new credentials :
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
// saveSecurely does not exist: Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(
  userEmail,
  authenticationResult.token,
  authenticationResult.userId,
  authenticationResult.groupId,
  authenticationResult.keyPairs,
)
```

:::danger

If you are building a web app and store the private key only in your user's browser local storage, you should
consider that if the user deletes their browser data, they will lose access to the data they created in iCure.
After completing their registration, it might be a good idea to ask your user to store their private key
in a safe place in their filesystem, possibly encrypting it with a password.

Make sure your users understand they should never share this file with anyone.

For more information check the In-Depth Explanation [What happens if my user loses his private key ?]({{sdk}}/explanations)  

:::

And Daenaerys may manage her data again :
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Access back encrypted data-->
```typescript
const loggedUserApi = loginResult.medTechApi

const foundDataSampleAfterLogin = await loggedUserApi.dataSampleApi.getDataSample(
  createdDataSample.id,
)
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/foundDataSampleAfterLogin.txt -->
<details>
<summary>foundDataSampleAfterLogin</summary>

```json
{
  "id": "c4b044a9-5c68-4fc8-b2e2-0cb94cdb3f56",
  "qualifiedLinks": {},
  "batchId": "ab12417b-e415-488b-a0be-295387d5f993",
  "index": 0,
  "valueDate": 20230328100113,
  "openingDate": 20220929083400,
  "created": 1679997673343,
  "modified": 1679997673343,
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
    "secretForeignKeys": [
      "3fa16d0e-4d39-4f4b-a412-439bdf100f02"
    ],
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

## What's next? 
Some specific use cases can bring you some questions: what happens if Daenaerys lost her RSA Keypair?
What happens if Daenaerys would like to start your app on another device?

All those questions are answered in the children pages of this tutorial. 
