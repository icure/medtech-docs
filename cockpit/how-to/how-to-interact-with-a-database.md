---
slug: how-to-interact-with-a-database
---

# How to interact with a database

## View the list of databases

Each app has a list of databases. 
From the Cockpit [dashboard screen](https://cockpit.icure.cloud/dashboard), click on the 'Manage' button of the app 
of your choice. You will then see all existing databases linked to this app.

![Manage app btn](./img/database-interactions/manage-app-btn.png)
![Databases list](./img/database-interactions/databases-list.png)

## Create a database

To create a new database, click on 'Add database' button on the App Details screen.

![Add database](./img/database-interactions/add-databases.png)

Write the name of your database, choose the cluster hosting it and click on the 'Add' button.

![Add database modal](./img/database-interactions/add-databases-modal.png)

## Manage database

To see the detailed information of your database, click on its card.

![Database card](./img/database-interactions/database-card.png)

![Database details](./img/database-interactions/database-details.png)

### Custom property

#### Add custom property

At some point, you may want to add custom properties to your database.
For this, click on the 'Add custom property' button.

![Add custom property](./img/database-interactions/custom-property/add-custom-property.png)

Fill your property identifier, its value and its type field and click on the 'Add' button.

![Custom property modal](./img/database-interactions/custom-property/custom-property-modal.png)

#### Edit a custom property

Click on the pencil icon next to the property you want to change.

![Edit custom property](./img/database-interactions/custom-property/edit-custom-property.png)

Fill the changes and click on the 'Save' button.

![Edit custom property modal](./img/database-interactions/custom-property/edit-custom-property-modal.png)

#### Delete a custom property

Click on the pencil icon next to the property you want to change.

![Custom property edit](./img/database-interactions/custom-property/edit-custom-property.png)

If you are absolutely sure you want to delete this custom property, click the 'Delete' button.

![Custom property delete](./img/database-interactions/custom-property/delete-custom-property-modal.png)

### Database Administrator

#### Add a database Administrator

In the Database details, you are able to see: 
- who can access it
- who are its administrators

You can also add a new administrator by clicking on the 'Add an administrator' button.
A modal will appear.

![Modal](./img/database-interactions/database-administrator/modal.png)

Fill in the form inputs and click on the 'Add' button.

Also, you can send an invitation to the administrator by clicking on the 'Invite' button. The invitation will be sent to the 
email provided in the form earlier.

![Invite](./img/database-interactions/database-administrator/invite.png)

<!-- This fuctional currently doesn't works on the site -->

<!--  #### Edit database Administrator

Click on the card of the administrator you want to edit.

![Database administrator edit](./img/database-interactions/database-administrator-edit.png)

Make changes and click on the 'Save' button.

![Database administrator add](./img/database-interactions/database-administrator-add.png) -->

### Edit a database
Editing the database only permits you to update its name. To do so, choose the 'Edit' option from the overflow menu 
of the database you want to edit.

![Edit database option](./img/database-interactions/edit-database-option.png)

Fill in the new database name and click on the 'Save' button.

![Edit database modal](./img/database-interactions/edit-database-modal.png)

### Delete a database

Deleting a database is a dangerous functionality. 
Therefore, you will find it in the Danger Zone.
Once you delete a database, there is no going back. Once you're sure, click on the 'Delete' button.

![Delete database](./img/database-interactions/delete-database.png)

To confirm database deletion, write back its name into the dedicated field. Then click on 'Delete' button.

![Delete database modal](./img/database-interactions/delete-database-modal.png)
