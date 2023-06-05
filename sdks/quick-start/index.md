---
sidebar_position: 2
---
# Quick Start

Welcome to iCure!
In this iCure Quick Start guide, you will learn how to initialize your iCure environment and begin working with the MedTech SDK. The process involves several steps:
- Create your iCure account by registering on the Cockpit Web Portal.
- Create a Solution, which represents a medical system, software or platform, in the Cockpit Dashboard.
- Create a Database within your Solution to store medical data.
- Choose the CAPTCHA provider you will use and provide your CAPTCHA secret key.
- Create your authentication email and SMS templates and get their ids. 
- Create extra entities: organisations, healthcare professionals, devices, and users that your project requires.

Before moving on to your dedicated Technology page, ensure that you have completed all the necessary steps. Additional resources and detailed procedures are available throughout the guide for more information.

## Create your iCure account 
Visit our [Cockpit Web Portal](https://cockpit.icure.cloud) and fill in the registration form. 
After providing all the required information, click on **Register**. 

Within a few seconds, you will receive an invitation at the email address you provided in the form. In the email, click on **Verify** to validate your email address and finalize your iCure account creation.

## Configure your Environment

When you log in to the cockpit for the first time, we propose you to create your first Solution using a 5 steps process.

The 5 steps are self-explanatory and well documented. At the of the process, you will have created your first Solution and your first Database. 

Please note the CAPTCHA client key that is displayed at the end of the process if you have chosen to use the demo version as well as the process id information. You will need it later.

### What is a solution ? 
In iCure, an **App** represents a **medical system, software or platform**. 

A Solution can contain several databases that are used to store your data. 

:::info
When using the free version of iCure, you are limited to creating a single solution.  
:::

If you would like to learn more about solutions and how to fully manage them, go [here](../../cockpit/how-to/how-to-manage-solutions)

## Create a Database
To add medical data to your App, you need to create a **Database**.

While completing the 5 steps process, a database is automatically created for you. However, you can create as more databases if you want.

To do this, click on the App you just created in the [Cockpit Dashboard](https://cockpit.icure.cloud/dashboard). Then, click on **Add database** and fill in all the required information.

:::info
When using the free version of iCure, you are limited to creating two databases.  
:::

If you would like to learn more about databases and how to fully manage them, go [here](../../cockpit/how-to/how-to-manage-databases).

## Get your authentication process ids



## Create a parent Healthcare Professional (Optional)
If you don't need your patients' to share medical data with your organisation, you should skip this step.

Using iCure, the patient remains the owner of its medical data. However sometimes, your organisation will need to access them in order to create some additional medical data, derived from the ones of the patient. 
Therefore, you'll need the patient to share some information with you. To do so, you'll need to create a parent healthcare professional representing your organisation, that will be considered as the responsible Healthcare Party of your Patients. 

When configuring the authentication of your users, the id of your parent healthcare professional will be referenced as the **PARENT_HEALTHCARE_PROFESSIONAL_ID**. That way, every new user will automatically share their created medical data with you as well.

:::info
This feature can also be added or removed for existing users. Go and check our dedicated page on [How to share data automatically with other data owners](../how-to/how-to-share-data-automatically.md)
:::

In the Cockpit [Healthcare team panel](https://cockpit.icure.cloud/users), select your database if you haven't done so already, and click on Add user.

Click on the **Organisation** panel and complete the required information for your parent healthcare professional.
Once you're ready, click on **Add**. 

You should now see your newly created healthcare professional. Copy its id and keep it safe, as it will be used in the next steps of the Quick Start. It will be referenced as the **PARENT_HEALTHCARE_PARTY_ID**.

![Parent HCP created](./img/parent_hcp_created.png)


### What is a healthcare professional ? 

A **healthcare professional** is someone who is recognized to provide care or services for a patient. A healthcare professional is either an individual healthcare professional (a doctor, a nurse, a physiotherapist, etc…) or an organization (a clinic, a hospital, a government authority, etc…).

## Generate the cryptographic keys of your Parent Healthcare Professional (Optional)
If you didn't complete the previous step, this one does not apply to you either.

When a patient or a doctor wants to share their medical data with you, they will need to use the public key of your parent healthcare professional. That's why, in order to complete the previous step, you need to generate the cryptographic keys of your parent healthcare professional.

**!!!TO DO!!! NOT PART OF COCKPIT YET!!**

## What's next ?
At the end of this Quick Start, you have successfully set up your iCure environment and are now ready to explore the full potential of the MedTech SDK. 

You can now head to the Technology page concerning you ([React Native](./react-native-quick-start.md), [React JS](./react-js-quick-start.md) or [Node JS](./node-js-quick-start.md)). In those, you will need a few information that we asked you to keep during the previous steps, which were: 
- the **MSG_GW_SPEC_ID**, identifying your App in our Authentication component; 
- the **EMAIL_AUTHENTICATION_PROCESS_ID**, identifying the email template to send to your users during their registration or login;
- the **SMS_AUTHENTICATION_PROCESS_ID**, identifying the SMS template to send to your users during their registration or login;
- the **PARENT_HEALTHCARE_PROFESSIONAL_ID** (optional), identifying your organization as a healthcare professional, to let your users (patients or doctors) share medical data with you automatically. 

