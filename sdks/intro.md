---
sidebar_position: 1
---

# Introduction

## What is iCure ?

*iCure* is a trustable service ensuring the privacy of your patient medical data thanks to [end-to-end encryption](explanations/encryption/introduction.mdx), 
meaning your users are the only ones who decide who can access their data. 

iCure helps you to manage the encrypted data by providing a series of easy-to-use tools :   
- The **iCure Back-End** allows you to save your data into the databases and manage the access control to it based on the access 
rules you defined in your app.
- The [**iCure Cockpit Web Portal**](../cockpit/intro) allows you to create your apps, your databases and 
your admin users in your iCure environment.
- The **iCure Client SDKs** takes care of the [end-to-end encryption / decryption](explanations/encryption/introduction.mdx) 
of your data and proposes you a series of easy-to-use medical-oriented services.
- The **Interoperability components** helps you to connect with external services by mapping the iCure Data Model to 
standard models like FHIR.

## iCure for MedTech
This documentation is focusing on the **iCure MedTech SDK**, tailored for medical device manufacturers and for the 
development teams responsible for the software of medical devices.

The SDK provides you a series of services and functionalities to help you manage medical information gathered 
from medical devices or provided by the patient himself, and store it encrypted in our cloud or on your premises.

## Supported development platforms

For now, iCure MedTech can be used with Node, React and React Native.

Experimental versions of the SDKs are available for Flutter and native Android/iOS development. You can request access 
to them by contacting us through our [support portal](https://icure.atlassian.net/servicedesk/customer/portal/3).

## Starting to use iCure

To hit the ground running, you can head to our [quick-start](./quick-start/index.md) or our [tutorials](./tutorial/index.md) section.

In the [how-to](/sdks/how-to/index) section, you will find more detailed information on how to use the SDKs to perform the most common tasks.

The [explanation](/sdks/explanations) section contains more in-depth information on how iCure works and how data is organised, secured and stored.

The [reference](/sdks/references/modules.md) section contains the full documentation of the SDKs and the API.
