---
sidebar_position: 1
---

# Introduction

{{#medtech}}
## What is iCure for Medtech ?
{{/medtech}}
{{#ehrlite}}
## What is iCure for EHR Lite ?
{{/ehrlite}}

*iCure* is a trustable service ensuring the privacy of your patient medical data thanks to [end-to-end encryption](explanations/encryption/introduction.mdx), 
meaning your users are the only ones who decide who can access their data.

{{#medtech}}
iCure lets you focus on the core features that are going to make your medical device solution successful: the user experience of your app, your algorithm, … while offloading to us the management of your data store, the monitoring of your solution, the release management of the apis, the security of the data.
{{/medtech}}
{{#ehrlite}}
iCure acts as a complete backend for your EHR solution and provides you with a very flexible data model that provides a high level of customisation while guaranteeing that interoperability in standard formats like FHIR will be straightforward.
{{/ehrlite}}


iCure helps you manage the encrypted data by providing a series of easy-to-use tools :   
- The **iCure API** allows you to save your data into the databases and manage the access control to it based on the access 
rules you defined in your app.
- The [**iCure Cockpit Web Portal**](../cockpit/intro) allows you to create your solutions, your databases and 
your admin users in your iCure environment.
- The **iCure Client SDKs** takes care of the [end-to-end encryption / decryption](explanations/encryption/introduction.mdx) 
of your data and proposes you a series of easy-to-use medical-oriented services.
- The **Interoperability components** helps you to connect with external services by mapping the iCure Data Model to 
standard models like FHIR.

## iCure {{ Sdk }}
{{#medtech}}
This documentation is focusing on the **iCure {{ Sdk }}**, tailored for medical device manufacturers and for the 
development teams responsible for the software of medical devices.
{{/medtech}}
{{#ehrlite}}
This documentation is focusing on the **iCure {{ Sdk }}**, tailored for the creation of EHR (Electronic Health Record) solutions.
{{/ehrlite}}

The SDK provides you a series of services and functionalities to help you manage medical information gathered 
from doctors, medical devices or provided by the patient himself, and store it encrypted in our cloud or on your premises.

## Supported development platforms

For now, iCure {{ Sdk }} can be used with Node, React and React Native.

Experimental versions of the SDKs are available for Flutter and native Android/iOS development. You can request access 
to them by contacting us through our [support portal](https://icure.atlassian.net/servicedesk/customer/portal/3).

## Starting to use iCure

To hit the ground running, you can head to our [quick-start](./quick-start/index.md) or our [tutorials](./tutorial/index.md) section.

In the [how-to](/{{sdk}}/how-to/index) section, you will find more detailed information on how to use the SDKs to perform the most common tasks.

The [explanation](/{{sdk}}/explanations) section contains more in-depth information on how iCure works and how data is organised, secured and stored.

The [reference](/{{sdk}}/references/modules.md) section contains the full documentation of the SDKs and the API.
