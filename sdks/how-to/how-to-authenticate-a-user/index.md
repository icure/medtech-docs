---
slug: how-to-authenticate-a-user
---
# Authenticating a user

When using your solution, your users will need to be authenticated to iCure in order to access their data.
Therefore, you will need to integrate iCure's user authentication process into your product.

When starting your app, the users may be in different situations: 
- They start it for the first time and need to register (autonomously)
- They already registered and need to log in
- Their latest login session is still valid, and you can reuse the corresponding authentication token 

This guide will show you how to authenticate into iCure for these situations. 

## Register a user

In this section we will show you how you can implement autonomous user registration in your app. You can also check
the [react-native boilerplate](/{{sdk}}/quick-start/react-js-quick-start), which provides an implementation of the
registration and passwordless login process. 

:::note

This section is only relevant if your application allows users to register autonomously. If instead you want users to be
able to access your application by invite only:

- You can use the [Cockpit](/cockpit/intro) to create admin users.
- You can create new {{hcp}} users using an admin account, or an account with the HCP_USER_MANAGER permission.
- You can create new patient users using an admin account, or an account with the PATIENT_USER_MANAGER permission.
  You can follow the [create a user from an existing patient](/{{sdk}}/how-to/how-to-create-a-user-from-a-patient.md) guide to learn 
  more about this.

:::

### Prerequisites

To implement the registration process in your app you need the following information:
- The reCAPTCHA v3 or Friendly Captcha site key to use with iCure
- Your `specId`
- Your `hcpAuthProcessByEmailId` and/or `hcpAuthProcessBySmsId` if you want to register {{hcps}} users
- Your `patientAuthProcessByEmailId` and/or `patientAuthProcessBySmsId` identifiers if you want to register patient users

If you followed the [quickstart](../../../cockpit/how-to/how-to-start) process with the cockpit using the demo setup you should have received this 
information the `specId`, Friendly Captcha site key and a `patientAuthProcessByEmailId` at the end of the walkthrough. 
Otherwise, you can always create more authentication processes using the `Processes` tab in the cockpit, and you can refer 
[this guide](/cockpit/how-to/how-to-start#configuration-details-shortcuts) to learn about where you can find these 
information. 

:::warning

You will have to embed these information in your app in order to use them. However, make sure to not include the 
processes identifiers for hcp users in apps for patients: this could  allow patients to register as {{hcps}}, which
usually have more privileges and could be a security issue.

:::

### Initialise an anonymous instance of the Api

Let's say your patient John uses your app for the first time, so he will have to sign up.
During this procedure, John is not known by iCure system yet, therefore, you can't use the `{{CodeSdkName}}Api` directly.
You will have to create an `Anonymous{{CodeSdkName}}Api` instead.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Instantiate anonymous API-->
```typescript
```

The [Anonymous{{CodeSdkName}}Builder](/{{sdk}}/references/entrypoints/AnonymousMedTechApi) asks you to provide multiple information. You can learn more about them in
the [Instantiation How-To](/{{sdk}}/how-to/how-to-instantiate-the-sdk), but here is a quick summary:

| Argument             | Description                                                                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| iCureUrlPath         | The URL to contact the iCure API (default https://api.icure.cloud).                                                                              |
| msgGtwUrl            | The URL to contact the iCure Message Gateway API (default https://msg-gw.icure.cloud).                                                           |
| specId               | Your iCure Message Gateway Identifier, obtained through the cockpit.                                                                             |
| authProcessByEmailId | Identifier of the authentication by email process.                                                                                               |
| authProcessBySmsId   | Identifier of the authentication by SMS process.                                                                                                 |
| cryptoStrategies     | Customizes the behaviour for operations related to cryptography. See [crypto strategies](/{{sdk}}/explanations/crypto-strategies) for more info. |

:::info

On node.js or React Native, two extra parameters are required to set the way the SDK will handle the internal storage of keys and additional data.
The `withStorage` method allows you to provide a custom implementation of the [Storage](/{{sdk}}/references/interfaces/StorageFacade) interface.
This implementation is used by the SDK to store generic data in platform specific storage facilities.
The `withKeyStorage` method allows you to provide a custom implementation of the [KeyStorage](/{{sdk}}/references/interfaces/KeyStorageFacade) interface.
This implementation is used by the SDK for storing cryptographic keys in platform specific secure storage facilities.

In the browser, default implementations are used that store data and keys in the browser's local storage.

:::

### Starting the authentication process - requesting an OTP
The registration process of iCure uses a one-time password (OTP) sent by email or sms, depending on the type of process
used.
Therefore, John will need to provide at least an email or mobile phone number to register or login.

You will also have to implement a captcha mechanism and provide us the computed score during the startAuthentication 
process. You can use either [reCAPTCHA](https://developers.google.com/recaptcha/docs/v3) (default) or [FriendlyCaptcha](https://friendlycaptcha.com/).
If you want to use friendly captcha the `recaptchaType` parameter of the `startAuthentication` method must be set to
`"friendly-captcha"`.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Start Authentication Process By Email-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/authProcess.txt -->
<details>
<summary>authProcess</summary>

```json
```
</details>

This method will cause the message gateway to send an email (or sms, depending on the process type) to John containing 
the OTP needed to complete the registration. 
As an output, you also receive an `AuthenticationProcess` object, which you will need for next steps of the procedure.

#### Completing the authentication process
To complete the registration, you will have to call the `authenticationApi.completeAuthentication` service, 
by providing two arguments: 
- The previous `AuthenticationProcess`
- The validation code John received by email

This method will also generate the public and private key for the user, saving them in the `keyStorage` of the 
newly created MedTechAPI.
 
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Complete authentication process-->
```typescript
```

As a result, you receive : 
- The MedTechApi instance to use for John (properly initialised);
- The `userId`, identifying John user uniquely;
- The `groupId`, identifying the database in which John was created;
- The `keyPair`, the RSA keypair generated for the patient; 
- The `token`, the time-limited token created for John, to authenticate her; 

Make sure to save these elements to be able to authenticate John again when she'll come back on your app.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
```

Now that her authentication is completed, John may manage data with iCure.  

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Create encrypted data-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user/createdDataSample.txt -->
<details>
<summary>createdDataSample</summary>

```json
```
</details>

But what do you have to do when the authentication token of John expires, and she needs to log in again?

## Logging in with  existing credentials
Each time you complete the registration or login process, you can save the credentials you receive
in a secured place.
We symbolised it through the `saveSecurely` method.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Save credentials-->
```typescript
```

The first thing you have to do is to retrieve John credentials and her RSA Keypair
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Get back credentials-->
```typescript
```

And then, initialise a MedTechApi, authenticating John directly.
<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Instantiate back a MedTechApi-->
```typescript
```
The MedTech API will automatically load the keys for that user from the local storage, but you can also pass them
explicitly through the `withCryptoStrategies` method of the builder.

:::info

You can learn more about the Crypto Strategies [here](/{{sdk}}/explanations/crypto-strategies).

:::

John can finally manage her data again.
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

Once John's token is expired, she will need to authenticate again to iCure by starting the login process. 
This flow is similar to the one of the registration phase.

As John is not authenticated anymore, you have to create a new AnonymousMedTechApi instance. 

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user/index.mts snippet:Login-->
```typescript
```

John then receives a new validation code by email.

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

And John may manage her data again :
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
Some specific use cases can bring you some questions: what happens if John lost her RSA Keypair?
What happens if John would like to start your app on another device?

All those questions are answered in the children pages of this tutorial. 
