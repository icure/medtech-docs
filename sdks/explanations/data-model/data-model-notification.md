---
slug: notification
tags:
    - data model   
    - notification
---
# Notification

A Notification is a request by a [Data Owner](/{{sdk}}/glossary#data-owner) for a Healthcare Professional to perform a 
particular action, such as sharing a piece of information.  
Since the Notification is encrypted, only the responsible Healthcare Professional can see its content.

## When Should I Use a Notification?

You should use a Notification when a Data Owner needs a Healthcare Professional to perform an action and wants to 
be sure that no one else can access to the request.

## How a Healthcare Professional is Related to Other Entities?

Any Data Owner can create a Notification.  
A Notification will be shared with a Healthcare Professional.  
A Healthcare Professional can modify a Notification shared with them.

## Examples

### A Doctor Receives a Data Sharing Request

After a visit, a Doctor register the symptoms the Patient is experiencing (fatigue) as a new {{Service}}.  
Then, they add the diagnosis (hay fever) as associated Healthcare Element.

<!-- file://code-samples/{{sdk}}/explanation/notification/index.mts snippet:doctor shares medical data-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/notification/healthcareElement.txt -->
<details>
<summary>healthcareElement</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/explanation/notification/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
```
</details>

Then, the Patient sends a Notification to the doctor to ask for access to the data.

<!-- file://code-samples/{{sdk}}/explanation/notification/index.mts snippet:patient sends notification-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/notification/notification.txt -->
<details>
<summary>notification</summary>

```json
```
</details>

After that, the Doctor receives a notification from the Patient and shares the data with them.

<!-- file://code-samples/{{sdk}}/explanation/notification/index.mts snippet:doctor receives notification-->
```typescript
```
<!-- output://code-samples/{{sdk}}/explanation/notification/newPatientNotifications.txt -->
<details>
<summary>newPatientNotifications</summary>

```text
```
</details>
