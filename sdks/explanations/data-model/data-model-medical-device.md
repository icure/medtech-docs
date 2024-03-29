---
slug: medical-device
tags:
    - data model
    - data owner
    - medical device
---
# Medical Device

A Medical Device is an actor that can register into the iCure platform medical data about a Patient.
As a [Data Owner](/{{sdk}}/glossary#data-owner) they can create medical information and share them with other Data Owners.

## When to Use a Medical Device?

You should use a Medical Device when you need to represent a hardware device, both medical (pulse oximeter, glucometer...) 
and non-medical (smartwatch, tablet...), which acquires medical data.  
A Medical Device could be used both by a Patient and by a {[Hcp}}.

## How a Medical Device is Related to Other Entities?

A Medical Device can:
- create {{Services}} and {{HealthcareElements}}.
- share {{Services}} with other Data Owners.
