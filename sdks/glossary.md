---
sidebar_position: 6
---
# Glossary

## Data Owner

The _data owner_ is an entity that can create and manipulate data. In iCure, it can be a _patient_, a _healthcare professional_ or a _device_. 
The _data owner_ is also responsible for encrypting the data it creates and making sure it can only be decrypted by _data owners_ that should be able to access it.

* **Patient**: The _patient_ is the recipient of care. Nearly all medical information inside iCure is linked directly or indirectly to a patient. The _patient_ entity is usually created during the first contact of a patient with a healthcare party. The administrative information of the patient can be partially or totally encrypted before being saved inside the _patient_ entity.

* **Healthcare** professional: A _healthcare professional_ is someone who is recognized to provide care or services for a patient. A _healthcare professional_ is either an individual _healthcare professional_ (a doctor, a nurse, a physiotherapist, etc…) or an organization (a clinic, a hospital, a government authority, etc…). A _healthcare professional_ includes anyone who is a stakeholder for the patient health and can access and manage the patient's file.

* **Device**: A _device_ is a piece of hardware that can be used to collect data. A _device_ can be a medical device (a blood pressure monitor, a glucometer, a pacemaker, etc…) or a non-medical device (a smartphone, a tablet, a computer, etc…). A _device_ can be used by a _healthcare professional_ or a _patient_.

### Data Sample
A _Data sample_ can be any piece of information related to the health of a patient. This includes subjective information provided by the patient, such as complaints, reason for visit, feelings, etc… or objective information like bio-metric measures (blood pressure, temperature, heart beat, etc…), or physical exam description, diagnosis, prescription, integration of lab reports from another healthcare party, action plan, etc…;

Any action performed by a _healthcare professional_ which is relevant for the healthcare element of a patient should be encoded as a _data sample_.

## Terminologies
Most of the entities in iCure have labels and codes attributes. The codes are based on standard terminology systems used in the healthcare industry.

### SNOMED CT
Snomed CT is a terminology system that contains medical concepts and their relationships. It is used to describe medical concepts in iCure like diseases, symptoms, procedures, etc…

### LOINC
Logical Observation Identifiers Names and Codes (LOINC) is a standard for identifying medical observations and measurements. It is used to describe medical concepts in iCure like lab results, vital signs, etc…

### ATC
Anatomical Therapeutic Chemical Classification System (ATC) is a standard for classifying drugs. It is used to describe medical concepts in iCure like drugs, etc…

### ICD-10
International Classification of Diseases version 10 (ICD-10) is a standard for classifying diseases. It is used to describe medical concepts in iCure like diseases, etc…
