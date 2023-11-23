---
sidebar_position: 2
---

# iCure API version 202311.0.0

This iCure release is a long term support release. It is going to be available at https://v202311.api.icure.cloud for at least 30 months, from the 15th of November 2023 to the 15th of March 2026.
This version has the commit code 4.0.489-g3c3d708f38. 

### Breaking Changes

- This release introduces stricter control accesses on endpoints that have a security impact or can affect destructively the data (e.g. deleting all data of a group). The iCure API will respond with a 401 if the level of authentication is not high enough.
- This release supports a new format for the storage of encrypted keys in shareable entities (Patient, Health Elements, Contacts, …) that allows for anonymous sharing of data with patients. When a piece of data is created with this new format it will not be available from previous versions of the API.

### New Features

- Agenda : New anonymous endpoints for the collection of public agenda information
- Agenda : Support of RRule format for the definition of the time slots
- Messaging : Support for Sendgrid, Google, FriendlyCaptcha & Twilio accounts setup in messaging gateway
- Searching and querying : new filters for Contacts, Healthcare Elements, Patients and Messages
- Terminologies and codifications: Support for Snomed CT
- Terminologies and codifications: Support for LOINC
- Terminologies and codifications: Support for the querying of codes per version
- Cryptographic model : Support for secure delegations that allows for anonymized sharing of information to the patient
- Cryptographic model : Exchange keys are now signed to ensure that they are not tampered
- Cryptographic model : New entitites to simplify recovery of lost keys
- Authentication and Authorisation: JWT tokens support
- Authentication and Authorisation: Authentication with OAuth
- Authentication and Authorisation: Authentication by email or SMS tokens
- Authentication and Authorisation: Control of accesses through role system
- Authentication and Authorisation: Support for database quotas

### Bug Fixes

- Websockets connections for real time communications hang and stop relaying messages
- Garbage injected in the database can cause a suspension of automated replication of user accounts
- Terminologies and codifications: a corner case in pagination can cause a code to be sent twice

### Improvements

- Filters for data samples can now return information sorted by descending creation order 

### Other Changes

- The API has been modularised to allow for better management of the changes included in the OSS version and for better handling of local (per country) feature requests.  
