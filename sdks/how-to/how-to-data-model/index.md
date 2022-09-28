---
slug: index
tags:
 - data model
---
# What is the iCure Data Model?

The iCure Data Model is an abstraction of the most common concepts in the medical domain. Also, they represent how data are organized in the database.  
The iCure Data Model is designed to organize encrypted data while also optimizing conflict resolution. In addition, it is compatible with other medical Data Models such as Open EHR and FHIR and, in its inner workings, supports SNOMED CT and ICPC-2 terminologies as well as ICD-10, LOINC, and ATC classifications.

## Actors

### Patient
A Patient is an actor that uses the iCure platform to manage they own medical data.  
Their personal data are encrypted, and they can decide to share them with other actors, or forbid other actors to access them, at any time.

### Medical Device
A Medical Device is an actor that can represent any device used by patients or doctors to acquire data.  
It can upload medical data to the iCure platform and share them.

### Healthcare Professional
A Healthcare Professional is an actor that is responsible for Patients, Medical Devices as well as other Healthcare Professionals.
They can invite them to the iCure Platform and, if allowed, manage their data.

### User 
A User is an actor that can log in to the iCure platform.  
They can be related to a Patient, a Healthcare Professional, or a Medical Device.

## Medical Data

### Data Sample
A Data Sample is a piece of medical information acquired at a certain point of time.  
It can be created by any Data Owner and 

### Healthcare Element
A Healthcare Element 