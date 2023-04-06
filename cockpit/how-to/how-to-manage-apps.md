---
slug: how-to-manage-your-apps
---

# Handling your apps
In iCure, an **App** represents a **medical solution / eco-system** in which the medical data of the users are potentially managed through multiple IT services. It is NOT representing an IT service or a specific Technology App. 

For example, let's take Petra Corp, developing solutions to help patients follow their menstruation cycle and share medical information linked to it with their gynecologist. 

Petra Corp proposes to their patients the React Native App **Petra**, which allows them to encode their menstruation cycle data. 
The enterprise also has a second product called **Petra Doc**, allowing the gynecologists to follow the data their patients shared with them, and potentially make a diagnosis. 

Petra Corp invoices the gynecologists and the **Petra users** who are using their solution using a monthly subscription. 

Here is an example of Apps Petra Corp could want to create: 


| Apps created on Cockpit | Valid | Remarks |
|-------------------------|------|---------------|
| Petra, Petra Doc        |  ❌  | This scheme is inefficient, as patient data will have to be duplicated between Petra and Petra Doc. Moreover, as iCure allows you to share or not data with other actors, it will be easy in one App to define who can access which data |
| Petra, Petra Invoicing | ✅   | This scheme seems efficient, as Petra Corp doesn't need medical data to create its invoices. Therefore, medical data can be isolated in one App, and invoicing information in another | 
| Petra, Petra Invoicing, Hospital ABC | ✅ | In case a hospital would like to work with Petra Corp and have a dedicated environment for their patients, Petra Corp could create a dedicated App for Hospital ABC |

Of course, there are a lot more possible scenarios depending on the business needs of your solution. The most important to remember is that the choice is yours in the organisation of your environment, thanks to the Apps. 

:::info
Be aware that users of one app will never be able to see the data of another app, __except__ if you added this user specifically into your other apps as well. 
:::



## Create an app

From the Cockpit [dashboard screen](https://cockpit.icure.cloud/dashboard), click on the **Create app** card.

![Create app card](./img/app-interactions/create-app-card.png)

Fill in the app name and chose the cluster which should host the data of your app. 
Then, click on the **Create** button.

![Create button](./img/app-interactions/create-button.png)


## Edit an app

To edit an existing app, click on the **overflow menu**, on the top-right of your 
app card. Click afterwards on the **Edit** button.

![Edit app option](./img/app-interactions/edit-app-option.png)

For now, you may only edit the name of your app.

![Save editing btn](./img/app-interactions/save-editing-btn.png)

Fill in the new app name and click on the **Save** button.

## Delete an app

To delete an app, click on the **overflow menu**, on the top-right of your
app card. Click afterwards on **Danger Zone** > **Delete**.

![Delete app option](./img/app-interactions/delete-app-option.png)

A modal appear.

![Delete btn](./img/app-interactions/delete-btn.png)

To definitely delete the app, write back its name into the dedicated input and click on **Delete** button.

:::warning

Once you delete an app, there is no going back: You won't be able to access the data contained in all databases of this app anymore.
Be aware that all children databases of this app will also be affected by this operation. 

:::
