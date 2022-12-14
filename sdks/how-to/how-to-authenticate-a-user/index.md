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
- Your `patientAuthProcessByEmailId` and `patientAuthProcessBySmsId` identifiers to authenticate your patient users
- Your `hcpAuthProcessByEmailId` and `hcpAuthProcessBySmsId` identifiers to authenticate your healthcare professionals users

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
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Instantiate AnonymousMedTech API-->
```typescript
const iCureUrl = process.env.ICURE_URL
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
  .build()
```

The [AnonymousMedTechApi](sdks/references/classes/AnonymousMedTechApi.md) asks you to provide multiple information. Here 
are their details :

| Argument             | Description                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------|
| iCureUrlPath         | The URL to contact the iCure API. By default, https://api.icure.cloud is used                    |
| msgGtwUrl            | The URL to contact the iCure Message Gateway API. By default, https://msg-gw.icure.cloud is used |
| msgGtwSpecId         | Your iCure Message Gateway Identifier. See next section to know more about it                    |
| authProcessByEmailId | Identifier of the authentication by email process. See next section to know more about it        |
| authProcessBySmsId   | Identifier of the authentication by SMS process. See next section to know more about it          |

Since Daenaerys is a patient, you will have to provide the `patientAuthProcessByEmailId` as a 
authProcessByEmailId and `patientAuthProcessBySmsId` as a authProcessBySmsId. 

:::info

If Daenaerys was a doctor, you would instead provide the `hcpAuthProcessByEmailId` as
authProcessByEmailId and `hcpAuthProcessByEmailId` as authProcessBySmsId.

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


<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Start Authentication Process By Email-->
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


As an output, you receive an `AuthenticationProcess` object, which you will need for next steps of the procedure.

:::info

The `masterHcpId` represents the identifier of the dataOwner that will be responsible of Daenaerys user creation.
This `masterHcpId` is optional for healthcare professionals registration but mandatory for patients. 

It's good to know that after their registration, user will share all their future data with this responsible. The user may decide to stop
sharing their data with this responsible by using the `userApi.stopSharingDataWith` service. For more information, 
go to the [How-to: Automatically share data with other data owners](../how-to-share-data-automatically.md).

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
by providing three arguments: 
- The previous `AuthenticationProcess`
- The validation code Daenaerys received by email
- A lambda providing the RSA Keypair Daenaerys should use. For this last point, you may use the dedicated 
service `anonymousMedTechApi.generateRSAKeypair()`
 
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Complete authentication process-->
```typescript
const authenticationResult = await anonymousApi.authenticationApi.completeAuthentication(
  authProcess!,
  validationCode,
  () => anonymousApi.generateRSAKeypair(), // Generate an RSA Keypair for the user
)

const authenticatedApi = authenticationResult.medTechApi

console.log(`Your new user id: ${authenticationResult.userId}`)
console.log(`Database id where new user was created: ${authenticationResult.groupId}`)
console.log(`Your initialised MedTechAPI: ***\${authenticatedApi}***`)
console.log(`RSA keypair of your new user: ***\${authenticationResult.keyPair}***`)
console.log(`Token created to authenticate your new user: ***\${authenticationResult.token}***`)
```

As a result, you receive : 
- The MedTechApi instance to use for Daenaerys (properly initialised);
- The `userId`, identifying Daenaerys user uniquely;
- The `groupId`, identifying the database in which Daenaerys was created;
- The `keyPair`, the RSA keypair you provided for Daenaerys through the lambda; 
- The `token`, the time-limited token created for Daenaerys, to authenticate her; 

Make sure to save these elements to be able to authenticate Daenaerys again when she'll come back on your app.

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
// saveSecurely does not exist: Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(
  userEmail,
  authenticationResult.token,
  authenticationResult.userId,
  authenticationResult.groupId,
  authenticationResult.keyPair,
)
```

Now that her authentication is completed, Daenaerys may manage data with iCure.  

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Create encrypted data-->
```typescript
const createdDataSample = await authenticatedApi.dataSampleApi.createOrModifyDataSampleFor(
  loggedUser.patientId,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: 'Hello world' } },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
```

<details>
    <summary>Output</summary>

```json
{
  "id": "48e571a0-ac5f-47b3-8e25-16f5e78b50c9",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "John"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Snow",
      "text": "Snow John",
      "use": "official"
    }
  ],
  "languages": [],
  "addresses": [],
  "mergedIds": {},
  "active": true,
  "deactivationReason": "none",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "parameters": {},
  "properties": {},
  "rev": "1-8e3ad0d7e3179188dcd95f186f78b68d",
  "created": 1664552695128,
  "modified": 1664552695128,
  "author": "3363719b-579e-4640-ac62-13e608e69395",
  "responsible": "d6c8dbc7-eaa8-4c95-b9b3-920fb70ce59b",
  "firstName": "John",
  "lastName": "Snow",
  "gender": "male",
  "birthSex": "unknown",
  "personalStatus": "unknown",
  "note": "Winter is coming",
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "d6c8dbc7-eaa8-4c95-b9b3-920fb70ce59b": {}
    },
    "encryptionKeys": {
      "d6c8dbc7-eaa8-4c95-b9b3-920fb70ce59b": {}
    },
    "aesExchangeKeys": {},
    "transferKeys": {}
  }
}
```

</details>

But what do you have to do when the authentication token of Daenaerys expires and she needs to login again?

## Login a user
In iCure, the login flow is similar to the registration.
Once Daenaerys's token is expired, she will need to authenticate again to iCure by starting the login process.

As Daenaerys is not authenticated anymore, you have to create a new AnonymousMedTechApi instance. 

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Login-->
```typescript
const anonymousApiForLogin = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .build()

const authProcessLogin = await anonymousApiForLogin.authenticationApi.startAuthentication(
  recaptcha,
  userEmail, // The email address used for user registration
)
```

<details>
    <summary>Output</summary>

```json

```

</details>

Daenaerys then receives a new validation code by email.

Since you already created an RSA keypair for her, you just need to retrieve it from where you stored it previously
and provide it to the `completeAuthentication` method.

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Complete login authentication process-->
```typescript
const loginResult = await anonymousApiForLogin.authenticationApi.completeAuthentication(
  authProcessLogin!,
  validationCodeForLogin,
  () => {
    const userInfo = getBackCredentials()
    if (userInfo.pubKey != undefined && userInfo.privKey != undefined) {
      return Promise.resolve({ privateKey: userInfo.privKey, publicKey: userInfo.pubKey })
    } else {
      // You can't find back the user's RSA Keypair: You need to generate a new one
      return anonymousApiForLogin.generateRSAKeypair()
    }
  },
)

console.log(`Your new user id: ${loginResult.userId}`)
console.log(`Database id where new user was created: ${loginResult.groupId}`)
console.log(`Your new initialised MedTechAPI: ***\${loginResult.medTechApi}***`)
console.log(`RSA keypair of your user stays the same: ***\${loginResult.keyPair}***`)
console.log(`The token of your user will change: ***\${loginResult.token}***`)
```

Do not forget to save these new credentials :
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
// saveSecurely does not exist: Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(
  userEmail,
  authenticationResult.token,
  authenticationResult.userId,
  authenticationResult.groupId,
  authenticationResult.keyPair,
)
```

:::danger

If you are building a web app and store the private key only in your user's browser local storage, you should
consider that if the user deletes their browser data, they will lose access to the data they created in iCure.
After completing their registration, it might be a good idea to ask your user to store their private key
in a safe place in their filesystem, possibly encrypting it with a password.

Make sure your users understand they should never share this file with anyone.

For more information check the In-Depth Explanation [What happens if my user loses his private key ?](sdks/explanations.md)  

:::

And Daenaerys may manage her data again :
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Access back encrypted data-->
```typescript
const loggedUserApi = loginResult.medTechApi

const foundDataSampleAfterLogin = await loggedUserApi.dataSampleApi.getDataSample(createdDataSample.id)
```
<details>
    <summary>Output</summary>

```json
{
  "id": "48e571a0-ac5f-47b3-8e25-16f5e78b50c9",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "John"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Snow",
      "text": "Snow John",
      "use": "official"
    }
  ],
  "languages": [],
  "addresses": [],
  "mergedIds": {},
  "active": true,
  "deactivationReason": "none",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "parameters": {},
  "properties": {},
  "rev": "1-8e3ad0d7e3179188dcd95f186f78b68d",
  "created": 1664552695128,
  "modified": 1664552695128,
  "author": "3363719b-579e-4640-ac62-13e608e69395",
  "responsible": "d6c8dbc7-eaa8-4c95-b9b3-920fb70ce59b",
  "firstName": "John",
  "lastName": "Snow",
  "gender": "male",
  "birthSex": "unknown",
  "personalStatus": "unknown",
  "note": "Winter is coming",
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "d6c8dbc7-eaa8-4c95-b9b3-920fb70ce59b": {}
    },
    "encryptionKeys": {
      "d6c8dbc7-eaa8-4c95-b9b3-920fb70ce59b": {}
    },
    "aesExchangeKeys": {},
    "transferKeys": {}
  }
}
```

</details>

The last thing you need to know is what to do when Daenaerys credentials are still valid: if you saved
the result from the login (or registration) process, the token may still be valid the next time Daenaerys
accesses your application.
In this case, you can reuse the existing token and avoid having Daenaerys go through the login process
with email or SMS OTP every time she opens your application.


## Reusing existing credentials
Each time you complete the registration or login process, you can save the credentials you receive
in a secured place.
We symbolised it through the `saveSecurely` method.

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
// saveSecurely does not exist: Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(
  userEmail,
  authenticationResult.token,
  authenticationResult.userId,
  authenticationResult.groupId,
  authenticationResult.keyPair,
)
```

The first thing you have to do is to retrieve Daenaerys credentials and her RSA Keypair 
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Get back credentials-->
```typescript
// getBackCredentials does not exist: Use your own way of storing the following data securely
// One option is to get them back from the localStorage
const { login, token, pubKey, privKey } = getBackCredentials()
```

And then, initialise a MedTechApi, authenticating Daenaerys directly. 
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Instantiate back a MedTechApi-->
```typescript
const reInstantiatedApi = await new MedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withUserName(login)
  .withPassword(token)
  .withCrypto(webcrypto as any)
  .build()

await reInstantiatedApi.initUserCrypto(false, { publicKey: pubKey, privateKey: privKey })
```

Daenaerys can finally manage her data again. 
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Get back encrypted data-->
```typescript
const foundDataSampleAfterInstantiatingApi = await reInstantiatedApi.dataSampleApi.getDataSample(createdDataSample.id)
```

<details>
    <summary>Output</summary>

```json
{
  "id": "48e571a0-ac5f-47b3-8e25-16f5e78b50c9",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "John"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Snow",
      "text": "Snow John",
      "use": "official"
    }
  ],
  "languages": [],
  "addresses": [],
  "mergedIds": {},
  "active": true,
  "deactivationReason": "none",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "parameters": {},
  "properties": {},
  "rev": "1-8e3ad0d7e3179188dcd95f186f78b68d",
  "created": 1664552695128,
  "modified": 1664552695128,
  "author": "3363719b-579e-4640-ac62-13e608e69395",
  "responsible": "d6c8dbc7-eaa8-4c95-b9b3-920fb70ce59b",
  "firstName": "John",
  "lastName": "Snow",
  "gender": "male",
  "birthSex": "unknown",
  "personalStatus": "unknown",
  "note": "Winter is coming",
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "d6c8dbc7-eaa8-4c95-b9b3-920fb70ce59b": {}
    },
    "encryptionKeys": {
      "d6c8dbc7-eaa8-4c95-b9b3-920fb70ce59b": {}
    },
    "aesExchangeKeys": {},
    "transferKeys": {}
  }
}
```

</details>


## What's next? 
Some specific use cases can bring you some questions: what happens if Daenaerys lost her RSA Keypair?
What happens if Daenaerys would like to start your app on another device?

All those questions are answered in the children pages of this tutorial. 
