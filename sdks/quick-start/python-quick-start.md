---
slug: python-quick-start
description: Start your Python App
---

# Start your Python App
Now that your iCure environment is successfully set up, you will be able to start the creation of your Python Server App.

The typical use case for creating a Python application is to build a service, that will process the records created by your users and compute advanced statistics/analysis on them.

All medical data is encrypted by default inside iCure. This is why you need to be able to decrypt it in your Python app before being able to process it. In the following Quick Start, *you* are connecting using the credentials of the parent organization.

In this Quick Start, we assume you already followed the [Quick Start - Set up your environment](/{{sdk}}/quick-start/index.md) including the [Quick Start - Configure your parent Organisation](/{{sdk}}/quick-start/index.md#optional-configure-your-parent-organization-to-allow-patients-to-share-data-with-it) step.

We also assume that you already have a frontend web application, that you have connected to iCure. Two other quick starts are available to help you with this: [Quick Start - Connect your React.JS App](/{{sdk}}/quick-start/react-js-quick-start.md) and [Quick Start - Connect your React Native App](/{{sdk}}/quick-start/react-native-quick-start.md). In this App you will have to set up sharing of encrypted information with the parent organization.

To make it easier for you, we created a [Python Template Repository](https://github.com/icure/icure-sdk-python-boilerplate-app-template), that includes: 
- All the needed dependencies to work with iCure in a Python app;

## Before starting
Make sure you [generated an authentication token](/{{sdk}}/quick-start/index.md#create-an-authentication-token-for-your-parent-organisation) for your parent organisation, in order to allow it to connect to the iCure API. 

You should now be in possession of your **PARENT_ORGANISATION_USERNAME** and your **PARENT_ORGANISATION_TOKEN**. 


## Create your project
### Create a new repository from the template
Head to our [Python app template](https://github.com/icure/icure-sdk-python-boilerplate-app-template) and click on `Use this template` to create a new repository
initialised with the essential files for a node-js icure app ([more on github templates](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)).
You can also initialise the repository using the GitHub CLI:
```bash
gh repo create <your-icure-nodejs-app> --private --clone --template icure/icure-sdk-python-boilerplate-app-template
```

Alternatively you can also clone the Python template project: 
```bash
git clone git@github.com:icure-sdk-python-boilerplate-app-template.git <your-icure-python-app>
```
Beware that if you do this your repository will be initialised with the history from the template repository and the `origin` remote pointing to it. You may want to delete the `.git` folder and
re-initialise the repository to achieve an effect similar to the github template.

### Fill the config file
While you initialized your environment in [Quick Start](/{{sdk}}/quick-start/index.md), we asked you to keep a series of information including: 
- the **parent_organization_username**, the username of your parent organisation (Generally its email). 
- the **parent_organization_token**, the authentication token of your parent organisation. 

You need to add these information in your newly created Python Server App. 
For  this complete the values of the corresponding variables in the `config.ini` file, under the `["icure"]` section.

Here is the list of a few other optional environment variables you can configure: 
- the **parent_organization_public_key**, RSA public key of your parent organisation, in case you already generated cryptographic keys for your parent organisation in the past. 
- the **parent_organization_private_key**, RSA private key of your parent organisation, in case you already generated cryptographic keys for your parent organisation in the past 
- the **host**, host to use to start your Python server (Default is 127.0.0.1),
- the **port** , the port to use to start your Python server (Default is 3000),
- the **local_storage_location**, the path to your local storage file (Default is ./scratch/localStorage)


### Start your Python Server
Once you provided the needed environment variables, install the provided dependencies using the `requirements.txt` file. You can also use a [virtual environment](https://docs.python.org/3/library/venv.html#creating-virtual-environments) to keep the dependencies of your different projects separate:

```bash
cd <your-icure-nodejs-app>
python3 -m venv icure-sdk
source icure-sdk/bin/activate
pip install -r requirements.txt
```

Once these commands complete successfully, you can start your Python server.

```bash
python3 src/server.py
```

Go to `http://127.0.0.1:3000/` (except if you updated the `host` & `port` configuration). You should see the information of your parent Healthcare Professional. 
All the functionalities in our SDK come both in a blocking and async version. You can go to `http://127.0.0.1:3000/async` to test the retrieval of your parent Healthcare Professional using the async version of the function.

And that's it ! You're now all set to add new functionalities in your Python Server using the iCure SDK. 

## What about the creation of my parent organisation cryptographic keys ?
When you called `http://127.0.0.1:3000` for the first time, as no cryptographic keys could be detected, neither in the localStorage location, neither in the `config.ini` file, 
the `IcureSDk` logic created a new keypair for your parent organisation and saved them in the localStorage folder.

You can find the details of this implementation in the file `src/sdk.py`, in the `MyCryptoStrategies` class. You can learn more about how to customize this behaviour in the [CryptoStrategies explanation](../explanations/crypto-strategies).

Calling `http://127.0.0.1:3000/` a second time, the keys being already created, no additional operation is needed and the information of your {{hcp}} are directly returned. 

### Special case: The HCP already created some keys in the past
In cascade, the `IcureSDK` will try to: 
- Get the keys from the localStorage location; 
- If the {{hcp}} has some keys that are not in the local storage, then load it from the pair defined in the `config.ini`;
- If there is no key pair in the `config.ini`, try to create a new keypair and add the public key to your {{hcp}} in iCure;

## Congratulations!
You are ready to start managing medical data inside your Python App ! Time to have a look to our various [How To's pages](../how-to/index) and start implementing the functionalities of your choice. 
