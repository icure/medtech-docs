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
- They already registered and need to log in
- Their latest login session is still valid, and you can reuse the corresponding authentication token 

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
```

The [Anonymous{{CodeSdkName}}Builder](/{{sdk}}/references/entrypoints/AnonymousMedTechApi) asks you to provide multiple information. You will learn more about them in
the Here are some details [Instantiation How-To](/{{sdk}}/how-to/how-to-instantiate-the-medtech-sdk), but for now, here is a quick summary:

| Argument             | Description                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------|
| iCureUrlPath         | The URL to contact the iCure API. By default, https://api.icure.cloud is used                    |
| msgGtwUrl            | The URL to contact the iCure Message Gateway API. By default, https://msg-gw.icure.cloud is used |
| msgGtwSpecId         | Your iCure Message Gateway Identifier. See next section to know more about it                    |
| authProcessByEmailId | Identifier of the authentication by email process. See next section to know more about it        |
| authProcessBySmsId   | Identifier of the authentication by SMS process. See next section to know more about it          |
| cryptoStrategies     | Customizes cryptographical operations. For now you can use the provided `Simple` implementation. |
=======

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
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/authProcess.txt -->
<details>
<summary>authProcess</summary>

```json
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
```

Now that her authentication is completed, Daenaerys may manage data with iCure.  

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Create encrypted data-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/createdDataSample.txt -->
<details>
<summary>createdDataSample</summary>

```json
```
</details>

But what do you have to do when the authentication token of Daenaerys expires, and she needs to log in again?

## Logging in with  existing credentials
Each time you complete the registration or login process, you can save the credentials you receive
in a secured place.
We symbolised it through the `saveSecurely` method.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
```

The first thing you have to do is to retrieve Daenaerys credentials and her RSA Keypair
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Get back credentials-->
```typescript
```

And then, initialise a MedTechApi, authenticating Daenaerys directly.
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Instantiate back a MedTechApi-->
```typescript
```
The MedTech API will automatically load the keys for that user from the local storage, but you can also pass them
explicitly through the `withCryptoStrategies` method of the builder.

:::info

You can learn more about the Crypto Strategies [here](/{{sdk}}/explanations/crypto-strategies/crypto-strategies).

:::

Daenaerys can finally manage her data again.
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Get back encrypted data-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/foundDataSampleAfterInstantiatingApi.txt -->
<details>
<summary>foundDataSampleAfterInstantiatingApi</summary>

```json
```
</details>

## Regenerate the credentials for a User

Once Daenaerys's token is expired, she will need to authenticate again to iCure by starting the login process. 
This flow is similar to the one of the registration phase.

As Daenaerys is not authenticated anymore, you have to create a new AnonymousMedTechApi instance. 

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Login-->
```typescript
```

Daenaerys then receives a new validation code by email.

Since you already created an RSA keypair for her, you just need to retrieve it from where you stored it previously
and provide it to the `completeAuthentication` method.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Complete login authentication process-->
```typescript
```

Do not forget to save these new credentials :
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
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
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/foundDataSampleAfterLogin.txt -->
<details>
<summary>foundDataSampleAfterLogin</summary>

```json
```
</details>

## What's next? 
Some specific use cases can bring you some questions: what happens if Daenaerys lost her RSA Keypair?
What happens if Daenaerys would like to start your app on another device?

All those questions are answered in the children pages of this tutorial. 
