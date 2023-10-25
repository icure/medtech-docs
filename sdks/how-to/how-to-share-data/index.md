---
slug: how-to-share-data
---

# Sharing data between data owners

One of the core features of iCure is data sharing. 

By default, patients information and medical data (`Patient`, `DataSample` and `HealthcareElement`) are accessible only
to the data owner who created the data.

However, it is possible for a data owner to share an entity he created with any other data owner (`delegate`) by using 
the `giveAccessTo` method of the api for that entity.
This allows selected data owners to retrieve the entity and decrypt its content.

:::note

Admins may be able to access some data even if it is not shared with them, but they will not be able to read the 
encrypted content of the entity.

:::

## Entity-level sharing

When you share an iCure entity with a delegate data owner, you are giving them access only to that specific entity, and 
not to any other entity that could be related to it. A data owner can share each entity he creates with a completely 
different set of delegate data owners.

For example if Dr Bob visits patient Charlie and creates two `DataSample`s *md1* and *md2*, he can decide to share
only *md1* with Dr Alice and not *md2* nor the `Patient` information of Charlie.

In some applications you may need to always share data created by a data owner with another specific data owner (for
example a patient may want to share all their data with their doctor). iCure provides a way to do this using the
[automatic sharing feature](how-to-share-data-automatically.md).

## Modifying shared data

A data owner can modify any entity that has been shared with him through the appropriate entity-specific api methods, 
and the other data owners with access to the original entity will be able to see the changes. 
There is no need to re-share the entity after a modification.

## Recovering of shared data

`Patient`s, `HealthcareElement`s and `DataSample`s are encrypted end-to-end.
This means that if a data owner loses their private key they will not be able to access the encrypted entities
anymore, and not even iCure can help to recover this data, since iCure can never access the encrypted content of
entities.
There are various mechanisms in place to mitigate this issue, and data sharing is central to one of them.

If Alice has shared an entity with Bob both Alice and Bob can access the encrypted content of the entity.
This means that if Alice loses her private key she can ask Bob to share with her all entities she shared with him in
the past, allowing her to regain access to these entities ([related how-to](../how-to-authenticate-a-user/my-user-lost-their-key.md)).

On the contrary, if Alice never shared the entity with any other data owner and she loses her private key, no one will
be able to access the content of the entity anymore.

You can learn more about how this and other data recovery methods in iCure work by heading to the
[Explanations](../../explanations)

## Non-revokeable sharing

Currently, the iCure SDK does not allow to easily revoke access to a shared entity, so you will have to be careful when 
sharing data and ensure that you're actually sharing data with the people you intend to.

The only way you can achieve something similar to revoking access to an entity is by the following process:

1. Create a copy of the entity
2. Share the copy with all delegates of the original entity EXCEPT for the data owner for which you want to revoke access
3. Delete the original entity

This will ensure that data owner with revoked access will not be able to access the entity anymore and will not be able
to read any updated version of the entity. However, you should still consider the last version before the revoke as
compromised, since the data owner may have already read the entity before his access was revoked.

## Examples

:::note

In the following examples we will use three different instances of `MedTechApi`s, to perform the requests as different
users.
The api we use are `hcp1Api` and `hcp2Api` to act as two different healthcare practitioners data owners (`hcp1` and 
`hcp2`, respectively) and `pApi` to act as a patient data owner (`p`).

:::

### Sharing data with other users

First create a new entity, in this example `hcp1` creates a patient:

<!-- file://code-samples/{{sdk}}/how-to/sharing-data/index.mts snippet:create a patient-->
```typescript
// hcp1 creates a new patient
const note = 'Winter is coming'
const patient = await hcp1Api.patientApi.createOrModifyPatient(
  new Patient({ firstName: 'John', lastName: 'Snow', note }),
)
```

`hcp1` can now share the newly created patient with other data owners, no matter if they are other healthcare 
practitioners, patients or devices.

To do this `hcp1` simply has to use `giveAccessTo` method from the `patientApi`.
This method takes two parameters: the entity that will be shared (in the example `patient`), and the id of the data
owner with whom the entity will be shared.

<!-- file://code-samples/{{sdk}}/how-to/sharing-data/index.mts snippet:share a patient-->
```typescript
// hcp1 shares the information of `patient` with hcp2
const updatedPatient = await hcp1Api.patientApi.giveAccessTo(
  patient,
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User),
)
// hcp1 shares the information of `patient` with p (a different patient that is also a data owner)
await hcp1Api.patientApi.giveAccessTo(updatedPatient, hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser))
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

### Sharing data created by someone else

Users are allowed to share any entity to which they have access, even if they were not the original creators.
In this example `hcp1` creates a {{healthcareElement}} and shares it with `p`.

<!-- file://code-samples/{{sdk}}/how-to/sharing-data/index.mts snippet:create a {{healthcareElement}}-->
```typescript
// hcp1 creates a new {{healthcareElement}}
const description = 'The patient has been diagnosed Pararibulitis'
const healthcareElement = await hcp1Api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: description,
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|617|20020131',
        type: 'SNOMEDCT',
        code: '617',
        version: '20020131',
      }),
    ]),
    openingDate: new Date('2019-10-12').getTime(),
  }),
  patient.id,
)
expect(
// hcp1 shares `healthcareElement` with p
await hcp1Api.healthcareElementApi.giveAccessTo(
  healthcareElement,
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(pUser),
)
```

Now also `p` can share the {{healthcareElement}} with other data owners.

<!-- file://code-samples/{{sdk}}/how-to/sharing-data/index.mts snippet:share a {{healthcareElement}}-->
```typescript
// p retrieves `healthcareElement` and shares it with hcp2
await pApi.healthcareElementApi.giveAccessTo(
  await pApi.healthcareElementApi.getHealthcareElement(healthcareElement.id),
  pApi.dataOwnerApi.getDataOwnerIdOf(hcp2User),
)
```

### Sharing data as a patient

Patient data owners can create entities and share them with other data owners.
In this example `p` creates a {{service}} and shares it with `hcp1`, then `hcp1` shares it also with `hcp2`. 

<!-- file://code-samples/{{sdk}}/how-to/sharing-data/index.mts snippet:create and share a {{service}}-->
```typescript
// p creates a {{service}}
const contentString = 'Hello world'
const dataSample = await pApi.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: new Content({ stringValue: contentString }) },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
expect((await pApi.dataSampleApi.getDataSample(dataSample.id)).content['en'].stringValue).to.equal(
// p shares the {{service}} with hcp1
await pApi.dataSampleApi.giveAccessTo(dataSample, pApi.dataOwnerApi.getDataOwnerIdOf(hcp1User))
// hcp1 shares the {{service}} with hcp2
await hcp1Api.dataSampleApi.giveAccessTo(
  await hcp1Api.dataSampleApi.getDataSample(dataSample.id),
  hcp1Api.dataOwnerApi.getDataOwnerIdOf(hcp2User),
)
```
