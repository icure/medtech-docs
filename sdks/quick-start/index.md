---
sidebar_position: 2
---
# Quick Start

Welcome to iCure!
In this iCure Quick Start guide, you will learn how to initialize your iCure environment and begin working with the MedTech SDK. The process involves several steps:
- Create your iCure account by registering on the [Cockpit Web Portal](https://cockpit.icure.dev).
- Configure an iCure environement on the [Cockpit Web Portal](https://cockpit.icure.dev).
- Configure your parent organization to allow patients to share data with it (Optional).

Before moving on to your dedicated Technology page, ensure that you have completed all the necessary steps. Additional resources and detailed procedures are available throughout the guide for more information.

## Create your iCure account 
Visit our [Cockpit Web Portal](https://cockpit.icure.dev) and fill in the registration form. 
After providing all the required information, click on **Register**. 

Within a few seconds, you will receive an invitation at the email address you provided in the form. In the email, click on **Verify** to validate your email address and finalize your iCure account creation.

## Configure your Environment

When you log in to the Cockpit for the first time, we propose you to create your first Solution using a 5 steps process.

The 5 steps are self-explanatory and well documented. Go through each of them and provide the needed information.

At the end of the process, you will receive a series of information :
- the **EXTERNAL_SERVICES_SPEC_ID**, identifying your Solution in our Authentication component;
- the **EMAIL_AUTHENTICATION_PROCESS_ID**, identifying the email template to send to your users during their registration or login;
- the **PARENT_ORGANISATION_ID**, identifying your organization as the responsible of the created users.
- the **FRIENDLY_CAPTCHA_SITE_KEY**, if you chose to use the Friendly-Captcha temporarily provided by iCure.

Please note the value of all the above items as you will need them later.

### What is a solution ? 
In iCure, a **Solution** represents a **medical system, software or platform**. 

A Solution can contain several databases that are used to store your data. 

:::info
When using the free version of iCure, you are limited to creating a single solution.  
:::

If you would like to learn more about solutions and how to fully manage them, go [here](../../cockpit/how-to/how-to-manage-solutions)

### What is the parent organisation ? 
The parent organization represents your company and will be considered as the responsible of the users created in your database. 

Also, if your app needs to create some additional medical data based on your patient data, your patients will have to share some data with a healthcare party you possess. A possibility will be to share their data with your parent organization. More information about this in the section [Configure your parent organization to allow patients to share data with it](index.md#optional-configure-your-parent-organization-to-allow-patients-to-share-data-with-it).

### How to update my external services information ? 
If you chose to use the temporary iCure External Services DEMO Setup, you'll have to provide your own external services information after 20 user authentications (register and/or login). 

Go to the Cockpit dedicated documentation to check [how to manage your external services](/cockpit/how-to/how-to-manage-your-account#external-services). 


## (Optional) Configure your parent organization to allow patients to share data with it
Some apps will require patients to share medical data with a parent organization, so that the app can create some additional medical data, derived from the patients data. 
This might be the case for example if your app needs to run an algorithm to detect certain symptoms, diseases, malformations, ... 
Your app is maybe one of those. 

Therefore, your patients will need to share their data with your organization; They'll do it by sharing their data with your parent organization that you created during your iCure solution creation.


### Create an authentication token for your parent organisation
Go to your [Cockpit Dashboard](https://cockpit.icure.dev/dashboard) and select your Solution.

Click on the database in which your patients will need to share information with your parent organisation. 

Go to the **HCP** tab and find your parent organisation thanks to the Search Bar. When you found it, show its detailed information and click on the **+** button to add an authentication token. 

You should now see a modal to create a new authentication token. In this modal, fill in the value of your token key and its expiration date. Once you're done, click on **Submit token**. 

The value of your newly created token should be displayed. 

:::danger
For security reasons, the token value is only showed at its creation and not anymore. Make sure to copy and save it as you won't be able to find it back !
:::

:::caution
For security reasons, we need to make sure a token doesn't have an infinite timelife. When your token is about to expire, make sure to create another one to avoid any issues while using your services. 
:::

:::tip
If you have multiple solutions or databases, don't forget to repeat this operation for each parent organisations you created. 
:::

In the next sections of this quick start, the email of your parent organisation will be referenced as the **PARENT_ORGANISATION_USERNAME** and the token you just created as the **PARENT_ORGANISATION_TOKEN**.


### Generate the cryptographic keys of your Parent Organisation
When a patient or a doctor wants to share their medical data with you, they will need to use the public key of your parent {{hcp}}. That's why, in order to complete the previous step, you need to generate the cryptographic keys of your parent organisation.

The Node.JS Boilerplate App is already doing it for you. Have a look at its [Quick Start](node-js-quick-start.md) to know more about it. 

### Share patient data with your parent organisation
To allow your patients to share data with your parent organisation, you have two options: 
- [Share new data created by a data owner automatically](../how-to/how-to-share-data/how-to-share-data-automatically.md) with your parent organisation. 
- [Share a specific medical data](../how-to/how-to-share-data/index.md) with your parent organisation. 

Go check the dedicated How-To's to know how to implement these functionalities in your code. 


## What's next ?
At the end of this Quick Start, you have successfully set up your iCure environment and are now ready to explore the full potential of the MedTech SDK. 

You can now head to the Technology page concerning you ([React Native](./react-native-quick-start.md), [React JS](./react-js-quick-start.md) or [Node JS](./node-js-quick-start.md)). In those, you will need a few information that we asked you to keep during the previous steps, which were: 
- the **EXTERNAL_SERVICES_SPEC_ID**, identifying your Solution in our Authentication component;
- the **EMAIL_AUTHENTICATION_PROCESS_ID** or the **SMS_AUTHENTICATION_PROCESS_ID**, identifying the email / sms template to send to your users during their registration or login;
- the **PARENT_ORGANISATION_ID**, identifying your organization as the responsible of the created users.
- the **FRIENDLY_CAPTCHA_SITE_KEY**, if you chose to use the Friendly-Captcha temporarily provided by iCure.
- Possibly the **PARENT_ORGANISATION_USERNAME** and **PARENT_ORGANISATION_TOKEN** if you created an authentication token for your parent organisation. 
