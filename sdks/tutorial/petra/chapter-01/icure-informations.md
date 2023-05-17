# Init your iCure solution
In order to be able to register users through Petra, you will need to create an iCure solution in [Cockpit](https://cockpit.icure.cloud/dashboard).

It's in this solution and its dedicated database(s) that the data created with Petra will be stored.

:::tip
In this section, we'll only cover the most important steps / information of the create solution process. You can find the detailed procedure [here](../../../quick-start/index.md).
:::

## Create an iCure solution for Petra
After you registered or signed in on [Cockpit](https://cockpit.icure.cloud), go to the [Dashboard page](https://cockpit.icure.cloud/dashboard). 

Click on "Create a Solution". You should now see a series of steps to complete. 

Go through each of them, providing the mandatory information, and make sure in this process to: 
- Provide a Friendly-Captcha Secret Key (or use the DEMO Setup provided temporarily by iCure);
- Create an **EMAIL** authentication template (or use the DEMO Setup proposed by iCure);

:::tip 
To run Petra, you don't have to complete the optional steps of the Quick-Start. 
:::

Once it's done, you will receive a series of information on the Recap screen:
- the **EXTERNAL_SERVICES_SPEC_ID**, identifying your App in our Authentication component;
- the **EMAIL_AUTHENTICATION_PROCESS_ID**, identifying the email template to send to your users during their registration or login;
- the **PARENT_ORGANISATION_ID**, identifying your organization as the responsible of the created users.
- the **FRIENDLY_CAPTCHA_SITE_KEY**, if you chose to use the Friendly-Captcha temporarily provided by iCure.

We'll now integrate those in the Petra App. 

## Provide your iCure solution information in Petra
Go to the root of your project and create a `.env` file where you will include the following environment variables: 
- **EXTERNAL_SERVICES_SPEC_ID**
- **EMAIL_AUTHENTICATION_PROCESS_ID**
- **PARENT_ORGANISATION_ID**
- **FRIENDLY_CAPTCHA_SITE_KEY**

with the information you received during the initialization of your iCure solution on Cockpit. 

:::info
If you provided your own Friendly-Captcha, just update the value of the FRIENDLY_CAPTCHA_SITE_KEY with the site key of your own Friendly-Captcha. 
:::

We can now head to the next chapter of our tutorial, focusing on Authentication ! 