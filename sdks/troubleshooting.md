---
sidebar_position: 6
---
# Troubleshooting

In this page, you will find the most common issues encountered by our users and the approaches to solve them.

## Could not decrypt X with user Y
If you happen to get this error while getting an entity with encrypted information, such as a `Patient` or a `DataSample`,
this means that your current user does not have a delegation for it. You can add a delegation for a user following the 
steps described in [Sharing data between data owners](/sdks/how-to/how-to-share-data). You may also be interested in 
[Sharing data automatically with other data owners](/sdks/how-to/how-to-share-data-automatically).

## I cannot create an entity
The creation of some types of entities, such as `Patients`, `Codings`, or `HealthcareParties` is restricted to users that
are either Admins or HealthcareParties. Please consult our [References](/sdks/references/interfaces) and check that your 
current user has the correct permissions.

## I want my user to access from another device
The procedure to allow a user to log in from a device where they do not have their private key is analogous to the one to
follow when [the user lost their private key](/sdks/how-to/how-to-authenticate-a-user/my-user-lost-their-key.md).

## My user lost his private key
The private key of the user is not stored anywhere in the iCure solution. So, if the user loses it, there are no means 
to recover it. However, it is possible to create a new key for the user and give them access back to their data. The whole
 procedure is explained in the [What if my user lost their private key?](/sdks/how-to/how-to-authenticate-a-user/my-user-lost-their-key.md)
 page.

## Useful links
You did not find the solution to your problem? You can open an issue on our [GitHub repository](https://github.com/icure/icure-medical-device-js-sdk)
or open a ticket on our [CSM](https://icure.atlassian.net/servicedesk/customer/portal/3).