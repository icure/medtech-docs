---
sidebar_position: 5
---

# Glossary

## Solution
A **Solution** represents a **medical system, software or platform** in which users' medical data are potentially managed through multiple IT stakeholders. 

A Solution can contain several databases that are used to store your data. 

In general, you'll create a solution on Cockpit for each of your distincted products, for which no data should be common. 

## Database
A **Database** is part of a Solution and will contain the medical data of your patients. A Solution can contain several databases. 

A Database will be installed on a chosen **cluster**, to allow you guarantying the presence of your data in a certain location. 

In general, you'll create a new database in your Solution if some of your clients need to use your product in a isolated environment (data kept inside a country, in-house solution, ...). 

## Parent organisation
The **parent organisation** identifies your company inside a database and will be considered as the responsible of the users created in your database.

If your product needs to process some of your patients data to create additional medical data, your patients will have to share their data with your parent organisation. 
You can find how configure your parent organisation to allow patients sharing data with it [here](../ehr-lite-sdk/quick-start#optional-configure-your-parent-organization-to-allow-patients-to-share-data-with-it). 

## External Service
An **External Service** is a service not directly managed by iCure but needed to guarantee the functioning of your whole solution. 

When creating your product, you'll need to use some services next to iCure to manage other aspects than the security of your data (communication with the clients, ...). 

iCure already manages for you certain functionalities of those services and lets you choose which provider you would like to use by providing the information of your selected external services. 

## Environment
An **Environment** groups a series of solutions, databases, ... that your Cockpit account can access. 

A Cockpit account can access multiple environments, in case an email was used to create multiple users (One to create a global organisation and one to be the administrator of a database for example). 

You can change the environment you're working on Cockpit at anytime by clicking on **Hey, YOUR_USER_NAME !** **Change Environment**. 

## Authentication Process
An **Authentication Process** is a communication template you will use to communicate the 6-digits code to your users during their registration / login flows. You can create a process to communicate either by email either by SMS with your users. 
