---
slug: node-js-quick-start
description: Start your Node JS App
---

# Start your Node.JS App
Now your iCure environment is successfully set up, you will be able to start the creation of your Node.JS Server App. 

To make it easier for you, we created a [Node.JS Template Repository](https://github.com/icure/icure-medical-device-node-js-boilerplate-app-template), that includes: 
- All the needed dependencies to work with iCure in a Node.JS app;
- The cryptographic keys creation of your parent organisation (See [Quick Start - Create your parent Organisation](./index.md#create-a-parent-healthcare-professional-optional) for more information), to allow you to directly start working with medical data.

## Create your project
### Clone the template repository
Open a terminal and clone the template repository using the following command: 
```
git clone git@github.com:icure/icure-medical-device-node-js-boilerplate-app-template.git <your-icure-nodejs-app>
```

### Fill the .env file
While you initialized your environment in [Quick Start](./index.md), we asked you to keep a series of information including: 
- the **PARENT_HEALTHCARE_PROFESSIONAL_USERNAME**, the username of your parent organisation. 
- the **PARENT_HEALTHCARE_PROFESSIONAL_TOKEN**, the application token of your parent organisation. 

You need to add these information in your newly created Node.JS Server App. 
For  this, rename the `.env.default` file to  `.env` and complete the values of the corresponding variables.

You may also provide a few other environment variables which are all optional: 
- the **PARENT_HEALTHCARE_PARTY_PUBLIC_KEY**, RSA public key of your parent organisation, in case you already generated cryptographic keys for your parent organisation in the past. 
- the **PARENT_HEALTHCARE_PARTY_PRIVATE_KEY**, RSA private key of your parent organisation, in case you already generated cryptographic keys for your parent organisation in the past 
- the **HOST**, host to use to start your Node.JS server (127.0.0.1 by default),
- the **PORT** , the port to use to start your Node.JS server (3000 by default),
- the **LOCAL_STORAGE_LOCATION**, the path to your local storage file (./scratch/localStorage by default)


### Start your Node.JS Server
Once you provided the needed environment variables, start your Node.JS server: 
```
cd <your-icure-nodejs-app> && yarn && yarn start
```

Go to `http://127.0.0.1:3000/` (except if you updated the HOST & PORT environment variables) and you'll see the information of your parent Healthcare Professional. 

And that's it ! You're now all set to add new functionalities in your Node.JS Server using the iCure MedTech SDK. 

## What about the creation of my parent organisation cryptographic keys ?
When you call `http://127.0.0.1:3000/`, as we saw, the information of your parent healthcare professional will be displayed. 

These information are requested to iCure, using a `ICureMedTechApi` instance. And to create this instance, we need to provide the cryptographic keys to it, to be able to encrypt / decrypt the medical data we may access.

The first time you called the root of the Node.JS server, as the endpoint didn't detect any existing cryptographic keys, neither in the localStorage location, neither in the `.env` file, it launched the creation and the saving of these keys (in both localStorage location & .env file).

You can find the details of this implementation in the file `services/ICureApi.ts`. 

When you'll call `http://127.0.0.1:3000/` a second time, the keys being already created, the endpoint will just create the ICureMedTechApi instance without additional operation and return you the information of your healthcare professional. 

### My Node.JS Server stopped with the error `Aborting Cryptographic Keys creation: Current HCP already has cryptographic keys`, what happened ? 
This error means you already created cryptographic keys for your parent healthcare professional and the template can't find them back. 

Check if the location of your localStorage didn't change. 
If it has been erased, check if you didn't delete the `PARENT_HEALTHCARE_PARTY_PUBLIC_KEY` and `PARENT_HEALTHCARE_PARTY_PRIVATE_KEY` from the `.env` file. 

:::warning
If you really wish to force the re-creation of your parent healthcare professioonal cryptographic keys, you can call `http://127.0.0.1:3000?forceKeysCreation=true`. Be aware you will not be able to decrypt the data shared with your previous RSA key anymore ! You should do this operation for tests purpose-only.  
:::

## Congratulations !
You're fully ready to start managing medical data inside your Node.JS App ! Time to have a look to our various [How To's pages](../how-to/index) and start implementing the functionalities of your choice. 