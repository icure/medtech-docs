---
slug: how-to-share-data
---

# Sharing data between data owners

In iCure it is possible to allow multiple data owners to access specific instances of `Patient`, `DataSample` and 
`HealthcareElement`.

By default, the data owner who creates an entity is the only one that has access to it. 
However, it is possible for the creator to share the entity with others by using the `giveAccessTo` methods in the 
respective apis.
This allows selected data owners to retrieve the entity and decrypt its content.

:::note

In the following examples we will use three different instances of `MedTechApi`s, to perform the requests as different
users.
The api we use are `hcp1Api` and `hcp2Api` to act as two different healthcare practitioners data owners (`hcp1` and 
`hcp2`, respectively) and `pApi` to act as a patient data owner (`p`).

:::

## Sharing data with other users

First create a new entity, in this example `hcp1` creates a patient:

<!-- file://code-samples/{{sdk}}/how-to/sharing-data/index.mts snippet:create a patient-->
```typescript
```

`hcp1` can now share the newly created patient with other data owners, no matter if they are other healthcare 
practitioners, patients or devices.

To do this `hcp1` simply has to use `giveAccessTo` method from the `patientApi`.
This method takes two parameters: the entity that will be shared (in the example `patient`), and the id of the data
owner with whom the entity will be shared.

<!-- file://code-samples/{{sdk}}/how-to/sharing-data/index.mts snippet:share a patient-->
```typescript
```

:::caution

The `giveAccessTo` method **modifies** the shared entity and will fail if the version of the input entity doesn't 
match the latest version.

In the previous example we shared the new `patient` first with `hcp2`, then with `p`.
Since the first call modifies the patient entity, we cannot pass again `patient` to the second invocation of 
`giveAccessTo`, but we have to pass the `updatedPatient` we received from the first invocation. 
Failing to do so will trigger a conflict in the database and the invocation will return an error.

:::

:::note

A patient is treated as any other data owner, and can also get access to data of other patients.
This can be useful for example in situations where a patient wants to share their medical information with a close
relative.

:::

## Sharing data created by someone else

Users are allowed to share any entity to which they have access, even if they were not the original creators.
In this example `hcp1` creates a {{healthcareElement}} and shares it with `p`.

<!-- file://code-samples/{{sdk}}/how-to/sharing-data/index.mts snippet:create a {{healthcareElement}}-->
```typescript
```

Now also `p` can share the {{healthcareElement}} with other data owners.

<!-- file://code-samples/{{sdk}}/how-to/sharing-data/index.mts snippet:share a {{healthcareElement}}-->
```typescript
```

## Sharing data as a patient

Patient data owners can create entities and share them with other data owners.
In this example `p` creates a {{service}} and shares it with `hcp1`, then `hcp1` shares it also with `hcp2`. 

<!-- file://code-samples/{{sdk}}/how-to/sharing-data/index.mts snippet:create and share a {{service}}-->
```typescript
```

## Recovering shared data

`Patient`s, `HealthcareElement`s and `DataSample`s are encrypted end-to-end. 
This means that if a data owner loses their private key they will not be able to access the encrypted entities 
anymore, and not even iCure can help to recover this data, since iCure can never access the encrypted content of 
entities.
There are various mechanisms in place to mitigate this issue, and data sharing is central to one of them. 

If Alice has shared an entity with Bob both Alice and Bob can access the encrypted content of the entity.
This means that if Alice loses her private key she can ask Bob to share with her all entities she shared with him in
the past, allowing her to regain access to these entities.

You can learn more about how this and other data recovery methods in iCure work by heading to the 
[Explanations](../explanations)
