---
slug: node-js-quick-start
description: Start your Node JS App
---

# Start your Node.JS App
Now your iCure environment is successfully set up, you will be able to start the creation of your Node.JS Server App. 

To make it easier for you, we created a [Node.JS Template Repository](https://github.com/icure/icure-medical-device-node-js-boilerplate-app-template), that includes: 
- All the needed dependencies to work with iCure in a Node.JS app;
- The cryptographic keys creation of your parent organisation (See [Quick Start - Configure your parent Organisation](./index.md#optional-configure-your-parent-organization-to-allow-patients-to-share-data-with-it) for more information), to allow you to directly start working with medical data.

## Before starting
Make sure you [generated an authentication token](index.md#create-an-authentication-token-for-your-parent-organisation) for your parent organisation, in order to allow it to connect to the iCure Back-End. 

You should now be in possession of your **PARENT_ORGANISATION_USERNAME** and your **PARENT_ORGANISATION_TOKEN**. 


## Create your project
### Clone the template repository
Clone the Node.JS template project: 
```
git clone git@github.com:icure/icure-medical-device-node-js-boilerplate-app-template.git <your-icure-nodejs-app>
```

### Fill the .env file
While you initialized your environment in [Quick Start](./index.md), we asked you to keep a series of information including: 
- the **PARENT_ORGANISATION_USERNAME**, the username of your parent organisation (Generally its email). 
- the **PARENT_ORGANISATION_TOKEN**, the authentication token of your parent organisation. 

You need to add these information in your newly created Node.JS Server App. 
For  this, rename the `.env.default` file to  `.env` and complete the values of the corresponding variables.

Here is the list of a few other optional environment variables you can configure: 
- the **PARENT_ORGANISATION_PUBLIC_KEY**, RSA public key of your parent organisation, in case you already generated cryptographic keys for your parent organisation in the past. 
- the **PARENT_ORGANISATION_PRIVATE_KEY**, RSA private key of your parent organisation, in case you already generated cryptographic keys for your parent organisation in the past 
- the **HOST**, host to use to start your Node.JS server (Default is 127.0.0.1),
- the **PORT** , the port to use to start your Node.JS server (Default is 3000),
- the **LOCAL_STORAGE_LOCATION**, the path to your local storage file (Default is ./scratch/localStorage)


### Start your Node.JS Server
Once you provided the needed environment variables, start your Node.JS server: 
```
cd <your-icure-nodejs-app> && yarn && yarn start
```

Go to `http://127.0.0.1:3000/` (except if you updated the HOST & PORT environment variables). You should see the information of your parent Healthcare Professional. 

And that's it ! You're now all set to add new functionalities in your Node.JS Server using the iCure MedTech SDK. 

## What about the creation of my parent organisation cryptographic keys ?
When you called `http://127.0.0.1:3000` for the first time, as no cryptographic keys could be detected, neither in the localStorage location, neither in the `.env` file, 
the `ICureApi` logic created a new keypair for your parent organisation and saved them (both in localStorage location & .env file).

You can find the details of this implementation in the file `services/ICureApi.ts`. 

Calling `http://127.0.0.1:3000/` a second time, the keys being already created, no additional operation is needed and the information of your healthcare professional are directly returned. 

### Special case: The HCP already created some keys in the past
In cascade, the `ICureApi` will try to: 
- Get the keys from the localStorage location; 
- If it can't find them, get them from the `.env` file and save them back into the localStorage; 
- If it can't find them in the `.env` file as well, try to create a new keypair and add the public key to your healthcare professional in iCure; 

If you started your Node.JS server and got the error `Aborting Cryptographic Keys creation: Current HCP already has cryptographic keys` when calling `http://127.0.0.1:3000/`, it means you already created cryptographic keys for your parent healthcare 
professional. Therefore, creating a new keypair will override your previous key and you'll not be able to access the data shared with your previous keypair anymore. 

Check if the location of your localStorage didn't change or if your .env file is complete. 

:::warning
If you really wish to force the re-creation of your parent healthcare professioonal cryptographic keys, you can call `http://127.0.0.1:3000?forceKeysCreation=true`. Be aware you will not be able to decrypt the data shared with your previous RSA key anymore ! You should do this operation for tests purpose-only.  
:::


## Congratulations !
You are ready to start managing medical data inside your Node.JS App ! Time to have a look to our various [How To's pages](../how-to/index) and start implementing the functionalities of your choice. 