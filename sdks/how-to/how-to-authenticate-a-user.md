---
slug: how-to-authenticate-a-user
---
# How to manage user authentication
When using your solution, your users will have to identify themselves to access their data. 
For this, you will need to integrate the authentication of your users into your product. 

When starting your app, the users may be in different situations : 
- They start it for the first time and need to register;
- They already registered and need to login again; 
- They asked you to remember them and you need to authenticate them using their valid credentials; 

At the end of this guide, you will be able to implement authentication for those 3 use cases using iCure 
MedTech SDK. 

# Pre-requisites 
Make sure to have the following elements in your possession :
- The iCure reCAPTCHA v3 SiteKey; 
- Your msgGtwSpecId; 
- Your patientAuthProcessByEmailId and patientAuthProcessBySmsId identifiers to authenticate your patient users;
- Your hcpAuthProcessByEmailId and hcpAuthProcessBySmsId identifiers to authenticate your healthcare party users;

:::caution

You will be able to get this information in a next [Cockpit](../../cockpit/intro.md) version. However for now, you can 
ask those ids to the iCure Support Team via support@icure.com

:::



# Register a user 
Let's say your patient Daenaerys uses your app for the first time. You will ask her to sign up.
During this procedure, Daenaerys is not known by iCure system yet. Therefore, you can't use the MedTechApi directly. 
You will have to create an `AnonymousMedTechApi` instead.

## Init AnonymousMedTechApi
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Instantiate AnonymousMedTech API-->
```typescript
const iCureUrl = process.env.ICURE_URL
const msgGtwUrl = process.env.ICURE_MSG_GTW_URL
const specId = process.env.SPEC_ID
const authProcessByEmailId = process.env.AUTH_BY_EMAIL_PROCESS_ID
const authProcessBySmsId = process.env.AUTH_BY_SMS_PROCESS_ID
const recaptcha = process.env.RECAPTCHA_ID

const anonymousApi = await new AnonymousMedTechApiBuilder()
  .withICureUrlPath(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGtwUrl(msgGtwUrl)
  .withMsgGtwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .build()
```

The [AnonymousMedTechApi](../references/classes/AnonymousMedTechApi.md) asks you to provide multiple information. Here 
are their details :

| Argument             | Description                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------|
| iCureUrlPath         | The URL to contact the iCure API. By default, https://api.icure.cloud is used                    |
| msgGtwUrl            | The URL to contact the iCure Message Gateway API. By default, https://msg-gw.icure.cloud is used |
| msgGtwSpecId         | Your iCure Message Gateway Identifier. See next section to know more about it                    |
| authProcessByEmailId | Identifier of the authentication by email process. See next section to know more about it        |
| authProcessBySmsId   | Identifier of the authentication by SMS process. See next section to know more about it          |

As Daenaerys needs to be identified as a patient, you will have to provide the `patientAuthProcessByEmailId` as a 
authProcessByEmailId and `patientAuthProcessBySmsId` as a authProcessBySmsId. 

:::info

If Daenaerys was a doctor, you would instead provide the `hcpAuthProcessByEmailId` as a
authProcessByEmailId and `hcpAuthProcessByEmailId` as a authProcessBySmsId.

:::


## Starting the authentication process
In iCure, you can authenticate either by email, either by SMS.
Therefore, you will have to ask Daenaerys to provide at least an email or a mobile phone when authenticating.

You will also have to implement the ReCAPTCHA mechanism and provide us the corresponding to found key during the startAuthentication
process.

:::info

Check the official [reCAPTCHA v3 documentation](https://developers.google.com/recaptcha/docs/v3) for more information.
Also, do not forget to contact the iCure team to get our ReCAPTCHA SiteKey that you will need to implement the reCAPTCHA

:::


<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Start Authentication Process By Email-->
```typescript
const authProcess = await anonymousApi.authenticationApi.startAuthentication(
  masterHcpId,
  'Daenerys',
  'Targaryen',
  recaptcha,
  false,
  userEmail // Email address of the user who wants to register
)
```

As an output, you receive an `AuthenticationProcess object, which is important to keep for the 
next steps of the procedure. 

Calling `authenticationApi.startAuthentication` will send a validation code of 6 digits to Daenaerys, ensuring iCure
she is who she pretends to be. 

## Getting the validation code
The validation code is sent to the user by the iCure Message Gateway, to identify the user properly. As Daenaerys decided 
to authenticate by email, she can now check her emails to get this code.

:::info

In a future version of Cockpit, you will be able to edit the email and SMS templating for the authentication process. 
For now, these have all a default template. 

:::

Once Daenaerys got her validation code, she can come back to your app and continue the process. 

### Completing the authentication process
First, create a RSA KeyPair for Daenaerys, to let her protect her data :
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Generate an RSA Keypair for the user-->
```typescript
const keyPair = await anonymousApi.cryptoApi.RSA.generateKeyPair()
const userPublicKey = ua2hex(await anonymousApi.cryptoApi.RSA.exportKey(keyPair.publicKey, 'spki'))
const userPrivateKey = ua2hex(await anonymousApi.cryptoApi.RSA.exportKey(keyPair.privateKey, 'pkcs8'))
```

Once it's done, to complete the Daenaerys authentication, call the next service providing the previous 
`AuthenticationProcess` the validation code Daenaerys received by email and the keypair you just created : 
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Complete authentication process-->
```typescript
const authenticationResult = await anonymousApi.authenticationApi.completeAuthentication(
  authProcess!,
  validationCode,
  [userPrivateKey, userPublicKey],
  () => undefined
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
- The `keyPair`, the RSA keypair you created for Daenaerys; 
- The `token`, the time-limited token created for Daenaerys, to authenticate her; 

Make sure to save these elements to be able to authenticate Daenaerys again when she'll come back on your app.

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
// saveSecurely does not exist : Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(userEmail, authenticationResult.token, authenticationResult.userId, authenticationResult.groupId, authenticationResult.keyPair)
```


Now that her authentication is completed, Daenaerys may manage data with iCure.  

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Create encrypted data-->
```typescript
const createdPatient = await authenticatedApi.patientApi.createOrModifyPatient(new Patient({
  firstName: 'John',
  lastName: 'Snow',
  gender: 'male',
  note: 'Winter is coming'
}))
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


But what do you have to do when Daenaerys will need to login again in a few days ?

# Login a user
In iCure, the login flow is extremely similar to the registration.
Once Daenaerys token is expired, she will need to identify herself again by starting a new authentication process. 

As Daenaerys is not authenticated anymore, you have to create a new AnonymousMedTechApi instance. 

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Login-->
```typescript
const anonymousApiForLogin = await new AnonymousMedTechApiBuilder()
  .withICureUrlPath(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGtwUrl(msgGtwUrl)
  .withMsgGtwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .build()

const authProcessLogin = await anonymousApiForLogin.authenticationApi.startAuthentication(
  masterHcpId,
  'Daenerys',
  'Targaryen',
  recaptcha,
  false,
  userEmail // The email address used for user registration
)
```

<details>
    <summary>Output</summary>

```json

```

</details>

Daenaerys then receives a new validation code by email.

As you already created an RSA keypair for her, you just need to provide it into the `completeAuthentication` service, 
getting it back from where you stored it previously. 

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Complete login authentication process-->
```typescript
const loginResult = await anonymousApiForLogin.authenticationApi.completeAuthentication(
  authProcessLogin!,
  validationCodeForLogin,
  [userPrivateKey, userPublicKey],
  () => undefined
)

console.log(`Your new user id: ${authenticationResult.userId}`)
console.log(`Database id where new user was created: ${authenticationResult.groupId}`)
console.log(`Your new initialised MedTechAPI: ***\${loginResult.medTechApi}***`)
console.log(`RSA keypair of your user stays the same: ***\${authenticationResult.keyPair}***`)
console.log(`The token of your user will change: ***\${authenticationResult.token}***`)
```

Do not forget to save these new credentials :
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
// saveSecurely does not exist : Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(userEmail, authenticationResult.token, authenticationResult.userId, authenticationResult.groupId, authenticationResult.keyPair)
```

And Daenaerys may manage her data again :
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Access back encrypted data-->
```typescript
const loggedUserApi = loginResult.medTechApi

const foundPatientAfterLogin = await loggedUserApi.patientApi.getPatient(createdPatient.id)
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

Last thing you need to know is what to do when Daenaerys credentials are still valid. 
You don't want her to go through an email / SMS process each time she uses your app. Therefore, you have to re-use her 
existing token and RSA keypair. 

# Reusing existing credentials
Each time you complete an authentication process (Register or login), you have to save the credentials you receive
in a secured place.
We symbolized it through the `saveSecurely` method.

<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
// saveSecurely does not exist : Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(userEmail, authenticationResult.token, authenticationResult.userId, authenticationResult.groupId, authenticationResult.keyPair)
```

First thing you have to do is to retrieve Daenaerys credentials and her RSA Keypair 
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Get back credentials-->
```typescript
// getBackCredentials does not exist : Use your own way of storing the following data securely
// One option is to get them back from the localStorage
const { login, token, pubKey, privKey } = getBackCredentials()
```

And then, initialize a MedTechApi, authenticating Daenaerys directly. 
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Instantiate back a MedTechApi-->
```typescript
const reInstantiatedApi = await new MedTechApiBuilder()
  .withICureBasePath(iCureUrl)
  .withUserName(login)
  .withPassword(token)
  .withCrypto(webcrypto as any)
  .build()

await reInstantiatedApi.initUserCrypto(false, { publicKey: pubKey, privateKey: privKey})
```

Daenaerys can finally manage her data again. 
<!-- file://code-samples/how-to/authenticate-user/index.mts snippet:Get back encrypted data-->
```typescript
const foundPatientAfterInstantiatingApi = await reInstantiatedApi.patientApi.getPatient(createdPatient.id)
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

# What's next ? 
Some specific use cases can bring you some questions : What happens if Daenaerys lost her RSA Keypair ? 
What happens if Daenaerys would like to start your app on another terminal ? 

Those questions will be answered in the [In-Depth Explanations](../explanations.md), in a future version of the documentation. 
