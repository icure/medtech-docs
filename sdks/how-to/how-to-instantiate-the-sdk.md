---
slug: how-to-instantiate-the-sdk
description: Learn the various option you have to instantiate the {{SdkName}}
tags:
- API
- SDK
---
# Instantiate the {{SdkName}} using the asynchronous DSL
You can obtain an instance of the MedTech SDK by either using the [{{CodeSdkName}}ApiBuilder]({{sdk}}/references/entrypoints/MedTechApi.md) or the 
[Anonymous{{CodeSdkName}}ApiBuilder]({{sdk}}/references/entrypoints/AnonymousMedTechApi.md). You should use the former when you have
the username and the password of the user you want to authenticate and the latter when you want to register a new user 
or generate a temporary authentication token for an existing user. All these procedures are described more in details in 
the [user authentication how to]({{sdk}}/how-to/how-to-authenticate-a-user/index.md).

## Instantiate the SDK using the {{CodeSdkName}}ApiBuilder
The following code snippet shows an example of the MedTech SDK instantiation using the `{{CodeSdkName}}ApiBuilder` with all the 
available options.

<!-- file://code-samples/{{sdk}}/how-to/instantiate-the-medtech-sdk/index.mts snippet:doctor can create api-->
```typescript
```

* `.withICureBaseUrl(host)`: sets the url of the local or cloud instance of iCure the SDK will connect to. By default, https://kraken.icure.cloud is used.
* `.withUserName(userName)`: sets the username, email, phone number, or id of the user to log in. **This parameter is mandatory**.
* `.withPassword(password)`: sets the password of the user to log in. **This parameter is mandatory**.
* `.withMsgGwUrl(msgGtwUrl)`: sets the url of the Message Gateway instance that will be used to send email and SMS messages to the users. By default, https://msg-gw.icure.cloud. **Only needed in Cloud version**
* `.withMsgGwSpecId(specId)`: your iCure Message Gateway identifier. **Only needed in Cloud version**
* `.withCryptoStrategies(cryptoStrategy)`: sets the Crypto Strategy for the API. You can learn more about the Crypto Strategies in the [following section](#crypto-strategies). **This parameter is mandatory**.
* `.withCrypto(webcrypto as any)`: an instance of the [Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto).
* `.withAuthProcessByEmailId(authProcessEmailId)`: your iCure Message Gateway identifier used to register new user by their email.
* `.withAuthProcessBySmsId(authProcessSMSId)`: your iCure Message Gateway identifier used to register new user by their phone number.
* `.withStorage(storage)`: an object that implements the [StorageFacade]({{sdk}}/references/entrypoints/MedTechApi.md) interface. Will be used to store locally the private key of the user through the key storage. By default, it will use an implementation based on the browser local storage, so you must implement a custom version if your app is based on NodeJS or React Native.
* `.withKeyStorage(keyStorage)`: an object that implements the [KeyStorageFacade]({{sdk}}/references/interfaces/KeyStorageFacade.md) interface. Will be used to store locally the private key of the user. By default, it will use an implementation based on the default local storage.

## Instantiate the SDK using the Anonymous{{CodeSdkName}}ApiBuilder
The following code snippet shows an example of the MedTech SDK instantiation using the `Anonymous{{CodeSdkName}}ApiBuilder` with all the
available options.

<!-- file://code-samples/{{sdk}}/how-to/instantiate-the-medtech-sdk/index.mts snippet:doctor can create anonymous api-->
```typescript
```

* `.withICureBaseUrl(host)`: sets the url of the local or cloud instance of iCure the SDK will connect to. By default, https://kraken.icure.cloud is used.
* `.withMsgGwUrl(msgGtwUrl)`: sets the url of the Message Gateway instance that will be used to send email and SMS messages to the users. By default, https://msg-gw.icure.cloud. **Only needed in Cloud version**
* `.withMsgGwSpecId(specId)`: your iCure Message Gateway identifier. **This parameter is mandatory**.
* `.withCryptoStrategies(cryptoStrategy)`: sets the Crypto Strategy for the API. You can learn more about the Crypto Strategies in the [following section](#crypto-strategies). **This parameter is mandatory**.
* `.withCrypto(webcrypto as any)`: an instance of the [Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto).
* `.withAuthProcessByEmailId(authProcessEmailId)`: your iCure Message Gateway identifier used to register new user by their email.
* `.withAuthProcessBySmsId(authProcessSMSId)`: your iCure Message Gateway identifier used to register new user by their phone number.
* `.withStorage(storage)`: an object that implements the [StorageFacade]({{sdk}}/references/entrypoints/MedTechApi.md) interface. Will be used to store locally the private key of the user through the key storage. By default, it will use an implementation based on the browser local storage, so you must implement a custom version if your app is based on NodeJS or React Native.
* `.withKeyStorage(keyStorage)`: an object that implements the [KeyStorageFacade]({{sdk}}/references/interfaces/KeyStorageFacade.md) interface. Will be used to store locally the private key of the user. By default, it will use an implementation based on the default local storage.

An API instantiated in this way can only be used to sign up or log in a user. To do so, you will first need to call the 
`startAuthentication` method of the Authentication API and then the `completeAuthentication` method. The latter will also
provide you an instance of the MedTechApi for the newly authenticated user. You will be able to use this instance to access
all the API methods, and it will have all the parameters that you specified in the anonymous api.  
To successfully instantiate the AnonymousMedTechApi, you have to pass an `authProcessByEmailId` or an `authProcessBySmsId`. 
Also, you cannot authenticate a user by email if you do not pass the `authProcessByEmailId` and, similarly, you cannot authenticate
a user by SMS if you do not pass the `authProcessBySmsId`.
This procedure is described in more detail in the [user authentication how to]({{sdk}}/how-to/how-to-authenticate-a-user/index.md).

## Crypto strategies

The Crypto Strategies are used by the iCure SDK in the execution of various operations revolving data encryption and sharing.
This includes key recovery/verification, zero-trust encryption, and anonymous data sharing.

The iCure SDK comes with a basic implementation of the Crypto Strategies, the `Simple{{CodeSdkName}}CryptoStrategies`, to 
help jump right into using iCure. 
This implementation, however, does not support proper key recovery/verification and zero-trust encryption, so you should
not use it in your final application.

When instantiating the `Simple{{CodeSdkName}}CryptoStrategies` you can pass the following parameters:   
- `availableKeys`: an array of key pairs that allows you to simulate key recovery, intended for testing purposes. If one
  or more key-pairs for the current user are not available in the key storage of the SDK, the SDK will check if the pair
  is available here, and if yes it will load it in the storage.
- `anonymousDataOwnerTypes`: the types of data owner types which should remain "anonymous" in the sharing metadata of 
  entities (by default only Patient data owners). You can learn about why this is needed and what anonymous data sharing
  implies by reading the [corresponding section in the in-depth crypto strategies documentation](/{{sdk}}/explanations/crypto-strategies#anonymous-data-sharing).  

To learn more about the Crypto Strategies, their purpose and how to implement them for your own application you can read 
the [dedicated page](/{{sdk}}/explanations/crypto-strategies).


