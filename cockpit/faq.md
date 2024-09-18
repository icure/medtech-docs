---
sidebar_position: 6
---
# FAQ

## Where can I find the information displayed at the end of a solution creation ?
When you create a solution on Cockpit through a step-by-step process, the last step displays a series of information that you'll need when you will be starting the code of your project. 

This FAQ section explains where you can find back those information in Cockpit once you closed the create solution process window. 

### Find my EXTERNAL_SERVICES_ID

Go to the details of your account by clicking on the button on the top right of your screen, mentioning **Hey, YOUR_USER_NAME !**.

Click on **Manage account**. 

Go to the **External Services** tab. 

Your **EXTERNAL_SERVICES_ID** is displayed there, along with your external services settings. 

### Find the iCure Demo FRIENDLY_CAPTCHA_SITE_KEY
Go to the details of your account by clicking on the button on the top right of your screen, mentioning **Hey, YOUR_USER_NAME !**.

Click on **Manage account**. 

Go to the **External Services** tab. 

The **FRIENDLY_CAPTCHA_SITE_KEY** is displayed there, **only** if you're using the DEMO Setup. If you don't see it, make sure you didn't put any value inside the external services fields underneath. 

### Find my EMAIL_AUTHENTICATION_PROCESS_ID or SMS_AUTHENTICATION_PROCESS_ID

Go to the [Cockpit Dashboard](https://cockpit.icure.dev/dashboard) and click on your solution. 

Click afterwards on your database. 

Go to the **Authentication processes** tab. Pick the authentication process you need and check its **EMAIL_AUTHENTICATION_PROCESS_ID** column. 

:::tip 
You always have the possibility to edit the process or to create a new one if you have different authentication use cases. 
:::

### Find my PARENT_ORGANISATION_ID
Go to the [Cockpit Dashboard](https://cockpit.icure.dev/dashboard) and click on your solution. 

Click afterwards on your database. 

Go to the **HCP** tab. Click on your parent organisation (you can find it more easily using the searchbar) to show its detailed information and check its **Organisation ID** column. 

### Find my PARENT_ORGANISATION_USERNAME
Go to the [Cockpit Dashboard](https://cockpit.icure.dev/dashboard) and click on your solution. 

Click afterwards on your database. 

Go to the **HCP** tab. Pick your parent organisation (you can find it more easily using the searchbar)  and check its **Email address** column.

### Find my PARENT_ORGANISATION_TOKEN
**You can't find back your PARENT_ORGANISATION_TOKEN** ! 

The token value is showed only at its creation, for security reasons. If you lost the value of your PARENT_ORGANISATION_TOKEN, you need to create a new token. 

For this, go to the [Cockpit Dashboard](https://cockpit.icure.dev/dashboard) and click on your solution. 

Click afterwards on your database. 

Go to the **HCP** tab. Click on your parent organisation (you can find it more easily using the searchbar) to show its detailed information and click on the **+** button to add an authentication token. 

You should now see a modal to create a new authentication token. In this modal, fill in the name of your token key and its expiration date. Once you're done, click on **Submit token**. 

The value of your newly created token should be displayed. 

:::danger
Make sure to copy and save it as you won't be able to find it back later ! 
:::