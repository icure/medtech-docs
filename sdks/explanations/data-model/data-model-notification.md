---
slug: notification
tags:
    - data model   
    - notification
---
# Notification

A Notification is a request by a [Data Owner](/sdks/glossary#data-owner) for a Healthcare Professional to perform a 
particular action, such as sharing a piece of information.  
Since the Notification is encrypted, only the responsible Healthcare Professional can see its content.

## When to Use a Notification?

You should use a Notification when a Data Owner needs a Healthcare Professional to perform an action and wants to 
be sure that no one else can access to the request.

## How a Healthcare Professional is Related to Other Entities?

Any Data Owner can create a Notification.  
A Notification can be shared with a Healthcare Professional.  
A Healthcare Professional can modify a Notification shared with them.

## Examples

### A Doctor Registering a Visit and Sharing the Outcome with the Patient

A Gynaecologist (Healthcare Professional) wants to update the status of one of their patients. After a visit, they
create a new Data Sample to register the outcome of the visit in the application.  
After that, the Patient asks to access their medical data using a Notification.
The doctor receives the Notification and shares the data with the Patient.

```typescript
const promise = "SAME AS HEALTHCARE PROFESSIONAL";
```