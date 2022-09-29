---
slug: index
tags:
 - data model
---
# What is the iCure Data Model?

The iCure Data Model is an abstraction of the most common concepts in the medical domain. 
Also, it represents how data are stored in the database.  

The iCure Data Model is designed to organize encrypted data while also optimizing conflict resolution. 
In addition, it is compatible with other medical Data Models such as Open EHR and FHIR and, in its inner workings, supports 
terminologies such as SNOMED CT, ICD-10, and LOINC.

## Actor Entities
This section describes the different actors that can operate on the iCure platform.  
Patient, Medical Device, and Healthcare Professional belong to the [Data Owner](/sdks/glossary#data-owner) category.

### [Patient](/sdks/explanations/explaination-data-model/patient)
A Patient is an actor that uses the iCure platform to manage they own medical data.  
Their sensible data are encrypted, and they can decide to share them with other actors, or forbid other actors to access them, at any time.

### [Medical Device](/sdks/explanations/explaination-data-model/medical-device)
A Medical Device is an actor that can represent any device used by patients or doctors to acquire data.  
It can upload medical data to the iCure platform and share them.

### [Healthcare Professional](/sdks/explanations/explaination-data-model/healthcare-professional)
A Healthcare Professional is an actor that is responsible for Patients, Medical Devices as well as other Healthcare Professionals.
They can invite them to the iCure Platform and, if allowed, manage their data.

### [User](/sdks/explanations/explaination-data-model/user)
A User is an actor that can log in to the iCure platform.  
They can be related to a Patient, a Healthcare Professional, or a Medical Device.

## Medical Data Entities
This section describes the different medical data types managed by the iCure platform.

### [Data Sample](/sdks/explanations/explaination-data-model/data-sample)
A Data Sample is a piece of medical information acquired at a certain point of time. 
It can be created by a Data Owner, and its encrypted data can be shared with other Data Owners.

### [Healthcare Element](/sdks/explanations/explaination-data-model/healthcare-element)
A Healthcare Element is a piece of medical information that can provide a context to a set of medical measurements.
It can be associated to Patients and Data Samples and, as such, it is encrypted.

### [Coding](/sdks/explanations/explaination-data-model/coding)
A Coding represents a code of a [Terminology](/sdks/glossary#terminologies) (such as SNOMED CT or LOINC).  
It is used by Data Samples and Healthcare Elements to describe the different pieces of medical information. 

## Support Entities
This section describes all the entities used in the several data management processes of the iCure platform.

### [Notification](/sdks/explanations/explaination-data-model/notification)
A Notification is a request by a Data Owner for a Healthcare Professional to perform a particular action, such as sharing a piece of information.  
The type of action and the status of the request are encoded in the Notification itself.