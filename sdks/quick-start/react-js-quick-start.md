---
slug: react-js-quick-start
description: Start your React JS App
---

# Start your React JS App
Now your iCure environment is successfully set up, you will be able to start the creation of your React JS App. 

To make it easier for you, we created a [React JS Template Repository](https://github.com/icure/icure-medical-device-react-js-boilerplate-app-template), that includes: 
- All the needed dependencies to work with iCure in a React JS app;
- A fully implemented [authentication flow](https://docs.icure.com/{{sdk}}/how-to/how-to-authenticate-a-user/how-to-authenticate-a-user), to allow you to directly start working with medical data. 

:::info
We use [Friendly-Captcha](https://friendlycaptcha.com/) as our CAPTCHA solution in the template's authentication implementation, as we consider it more privacy friendly than Google reCaptcha. If you would like to use Google reCAPTCHA in your React JS solution, you will have to implement your own reCAPTCHA component first. 
:::

## Requirements
To work with our React JS Template, make sure the following tools are installed on your machine: 
- [NodeJS](https://nodejs.org/en) (Node 16 + at least)
- [Yarn](https://yarnpkg.com/getting-started/install)

## Create your project
Create your React JS App by executing the following command in a terminal: 
```
yarn create react-app <your-icure-medtech-react-app> --template @icure/cra-template-icure-medtech
```

Once your project is created and `yarn` installed the needed dependencies, you should see a similar entry: 
```
✨  Done in 6.16s.

Created git commit.

Success! Created <your-icure-medtech-react-app> at /...
Inside that directory, you can run several commands:

  yarn start
    Starts the development server.

  yarn build
    Bundles the app into static files for production.

  yarn test
    Starts the test runner.

  yarn eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd <your-icure-medtech-react-app>
  yarn start

Happy hacking!
✨  Done in 68.47s.
```

Your React App created, let's add the missing information to complete an authentication process successfully in your app. 

## Add the authentication information in .env
While you initialized your environment in [Quick Start](./index.md), we asked you to keep a series of information: 
- the **EXTERNAL_SERVICES_SPEC_ID**, identifying your solution in our Authentication component; 
- the **EMAIL_AUTHENTICATION_PROCESS_ID** or **SMS_AUTHENTICATION_PROCESS_ID**, identifying the email / SMS template to send to your users during their registration or login;
- the **PARENT_ORGANISATION_ID**, identifying your organization as the responsible of the users created through your solution.
- possibly the **FRIENDLY_CAPTCHA_SITE_KEY**, in case you decided to use the DEMO Friendly-Captcha temporarily provided by iCure. 

You need to add these information in your newly created React.JS App. 
For this, rename the `.env.default` file to `.env` and complete the values of the corresponding variables.

:::caution
If you decided to use the iCure DEMO Friendly-Captcha, don't forget this is a **TEMPORARY** solution. Make sure to create your own Google ReCaptcha v3 or Friendly-Captcha Secret Key, as you will have a limited number of allowed authentications before the DEMO key expires. 
:::

:::caution
As explained earlier, if you're using the Google reCAPTCHA instead of the Friendly-Captcha, you'll need to do some changes in the project. 
After you created your Google reCAPTCHA component, include it in the `pages/LoginPage/index.tsx` and `pages/RegisterPage/index.tsx` instead of the FriendlyCaptcha component. Go afterwards to the `services/auth.api.ts` file and replace any reference to `friendly-captcha` by `recaptcha`. 
:::


## Launch your app
Once you completed all the environment variables needed in the `.env` file, execute the following command in the terminal to launch your app in the browser: 
```
cd <your-icure-medtech-react-app> && yarn start
```


## Congratulations !
You're fully ready to start creating medical data inside your React App ! Time to have a look to our various [How To's pages](../how-to/index) and start implementing the functionalities of your choice. 
