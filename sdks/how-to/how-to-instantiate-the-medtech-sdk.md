---
slug: how-to-instantiate-the-medtech-sdk
description: Learn the various option you have to instantiate the MedTech SDK
tags:
- API
- SDK
---
# Instantiate the MedTech SDK using the asynchronous DSL
You can obtain an instance of the MedTech SDK by either using the [MedTechApiBuilder](sdks/references/classes/MedTechApiBuilder.md) or the 
[AnonymousMedTechApiBuilder](sdks/references/classes/AnonymousMedTechApiBuilder.md). You should use the former when you have
the username and the password of the user you want to authenticate and the latter when you want to register a new user 
or generate a temporary authentication token for an existing user. All these procedures are described more in details in 
the [user authentication how to](sdks/how-to/how-to-authenticate-a-user/index.md).

## Instantiate the SDK using the MedTechAPiBuilder
The following code snippet shows an example of the MedTech SDK instantiation using the `MedTechApiBuilder` with all the 
available options.

<!-- file://code-samples/how-to/instantiate-the-medtech-sdk/index.mts snippet:MedTechApi-->

* `.withICureBaseUrl(host)`: sets the url of the local or cloud instance of iCure the SDK will connect to. By default, https://kraken.icure.cloud is used.
* `.withUserName(userName)`: sets the username, email, phone number, or id of the user to log in. **This parameter is mandatory**.
* `.withPassword(password)`: sets the password of the user to log in. **This parameter is mandatory**.
* `.withMsgGwUrl(msgGtwUrl)`: sets the url of the Message Gateway instance that will be used to send email and SMS messages to the users. By default, https://msg-gw.icure.cloud. **Only needed in Cloud version**
* `.withMsgGwSpecId(specId)`: your iCure Message Gateway identifier. **Only needed in Cloud version**
* `.withCrypto(webcrypto as any)`: an instance of the [Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto).
* `.withAuthProcessByEmailId(authProcessEmailId)`: your iCure Message Gateway identifier used to register new user by their email.
* `.withAuthProcessBySmsId(authProcessSMSId)`: your iCure Message Gateway identifier used to register new user by their phone number.
* `.withStorage(storage)`: an object that implements the StorageFacade interface. Will be used to store locally the private key of the user through the key storage. By default, it will use an implementation based on the browser local storage, so you must implement a custom version if your app is based on NodeJS or React Native.
* `.withKeyStorage(keyStorage)`: an object that implements the KeyStorage Facade interface. Will be used to store locally the private key of the user. By default, it will use an implementation based on the default local storage.
* `.preventCookieUsage()`: if set, all the API calls will rely on cookieless authentication methods.

## Instantiate the SDK using the AnonymousMedTechApiBuilder
The following code snippet shows an example of the MedTech SDK instantiation using the `AnonymousMedTechApiBuilder` with all the
available options.

<!-- file://code-samples/how-to/instantiate-the-medtech-sdk/index.mts snippet:Anonymous API-->

* `.withICureBaseUrl(host)`: sets the url of the local or cloud instance of iCure the SDK will connect to. By default, https://kraken.icure.cloud is used.
* `.withMsgGwUrl(msgGtwUrl)`: sets the url of the Message Gateway instance that will be used to send email and SMS messages to the users. By default, https://msg-gw.icure.cloud. **Only needed in Cloud version**
* `.withMsgGwSpecId(specId)`: your iCure Message Gateway identifier. **This parameter is mandatory**.
* `.withCrypto(webcrypto as any)`: an instance of the [Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto).
* `.withAuthProcessByEmailId(authProcessEmailId)`: your iCure Message Gateway identifier used to register new user by their email. **This parameter is mandatory**.
* `.withAuthProcessBySmsId(authProcessSMSId)`: your iCure Message Gateway identifier used to register new user by their phone number. **This parameter is mandatory**.
* `.withStorage(storage)`: an object that implements the StorageFacade interface. Will be used to store locally the private key of the user through the key storage. By default, it will use an implementation based on the browser local storage, so you must implement a custom version if your app is based on NodeJS or React Native.
* `.withKeyStorage(keyStorage)`: an object that implements the KeyStorage Facade interface. Will be used to store locally the private key of the user. By default, it will use an implementation based on the default local storage.
* `.preventCookieUsage()`: if set, all the API calls will rely on cookieless authentication methods.

An API instantiated in this way can only be used to sign up or log in a user. To do so, you will first need to call the 
`startAuthentication` method of the Authentication API and then the `completeAuthentication` method. The latter will also
provide you an instance of the MedTechApi for the newly authenticated user. You will be able to use this instance to access
all the API methods, and it will have all the parameters that you specified in the anonymous api.  
This procedure is described in more detail in the [user authentication how to](sdks/how-to/how-to-authenticate-a-user/index.md).