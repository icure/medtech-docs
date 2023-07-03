---
slug: how-to-subscribe-to-icure-events
---

# Subscribing to iCure events

At some point, you may want to listen to iCure events. For example, you may want to be notified when a patient is created or modified. This is possible with the iCure Medtech SDK.

## What is an event&#8239;?

An event is a message sent by iCure to notify that something has happened. For example, when a new patient is created, iCure sends an event to all the users that are listening to this event.

Currently, iCure supports the following event types for the following entities:

|                   | CREATE | UPDATE | DELETE |
| ----------------- | ------ | ------ | ------ |
| Patient           | ✅     | ✅     | ✅     |
| DataSample        | ✅     | ❌     | ✅     |
| HealthcareElement | ✅     | ✅     | ✅     |
| Notification      | ✅     | ✅     | ✅     |
| User              | ✅     | ✅     | ✅     |

## How to listen to events&#8239;?

:::note

We assume that you already know the [How to authenticate a user](sdks/how-to/how-to-authenticate-a-user/index.md) guide.

:::

As an example, we will listen to `CREATE` events for `DataSample` objects. This methodology can be applied to any other type of event and objects.

<!-- file://code-samples/how-to/websocket/index.mts snippet:can listen to dataSample events-->
```typescript
const events: DataSample[] = []
const statuses: string[] = []

const connection = (
  await api.dataSampleApi.subscribeToDataSampleEvents(
    ['CREATE'], // Event types to listen to
    await new DataSampleFilter(api)
      .forDataOwner(loggedUser.healthcarePartyId!)
      .byLabelCodeDateFilter('IC-TEST', 'TEST')
      .build(),
    async (ds) => {
      events.push(ds)
    },
    {}, // Options
  )
)
  .onConnected(() => statuses.push('CONNECTED'))
  .onClosed(() => statuses.push('CLOSED'))
```

The `subscribeToDataSampleEvents` method takes 4 parameters:

- The first parameter is an array of event types. In this example, we only listen to `CREATE` events (see the table above for the full list of event types).
- The second parameter is a filter. In this example, we only listen to events that are created by the logged user and that have the `IC-TEST` tag code and `TEST` tag type.
- The third parameter is a callback that is called when an event is received. In this example, we push the received event in an array called `events`.
- The fourth parameter is an options object. In this example, we don't use any options.

The `subscribeToDataSampleEvents` method returns a `Connection` object. This object has 2 methods:

- `onConnected` is called when the connection is established
- `onClosed` is called when the connection is closed

:::caution

If you subscribe to multiple event types, you will not have access to the event type that triggered the callback. You may want to use a different connection for each event type if you need to distinguish them.

:::

### Example

To test this example, we will create a `DataSample` object with the `IC-TEST` tag code and `TEST` tag type.

:::note

We assume that you already have a patient created. If not, you can add the following code below before the DataSample creation.

<details>
  <summary>Create a patient</summary>

<!-- file://code-samples/how-to/websocket/index.mts snippet:create a patient for websocket-->
```typescript
const patient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    note: 'Winter is coming',
  }),
)
```

</details>

<!-- output://code-samples/how-to/websocket/patient.txt -->
<details>
<summary>patient</summary>

```json
{
  "id": "a083d257-bda7-4c92-ab49-effe1293c48d",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-8d164b273bbbd6d935a7c31407d25f3f",
  "created": 1688375627182,
  "modified": 1688375627182,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "firstName": "John",
  "lastName": "Snow",
  "note": "Winter is coming",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "John"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Snow",
      "text": "Snow John",
      "use": "official"
    }
  ],
  "addresses": [],
  "gender": "unknown",
  "birthSex": "unknown",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "aesExchangeKeys": {},
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "transferKeys": {},
    "encryptedSelf": "NDRtOR6NiQ1chu0yQFLzawO7qXY3HHSZUoPH0z5Xgu/6OWFmTy4EObSIxwCruW25",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

:::

<!-- file://code-samples/how-to/websocket/index.mts snippet:create a dataSample for websocket-->
```typescript
const dataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id!,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: new Content({ stringValue: 'Hello world' }) },
  }),
)
```

<!-- output://code-samples/how-to/websocket/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
{
  "id": "886f4279-15f2-47c7-8648-42e5c3f5f5d7",
  "qualifiedLinks": {},
  "batchId": "53cbc7cf-87ae-41fc-9085-59626acc827c",
  "index": 0,
  "valueDate": 20230703111347,
  "openingDate": 20230703111347,
  "created": 1688375627220,
  "modified": 1688375627220,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "stringValue": "Hello world",
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "encryptedSelf": "v6AITGZWxM8JaF0Jtn6lqkL+xk1aiE6aFdmGm64eprUUz2iohkLKUR10N7iZdT7jq2Z1gQQeqnpaxwNcz+oTO9I2nYZxQfhPNaikUGprI6TNkx0R+2GuBAGqZD1CIJQmMg++rHquvIrscEctpckBZg==",
    "secretForeignKeys": [
      "b3784ca3-c454-4435-812b-8c1a88878dcc"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

## How to stop listening to events&#8239;?

To stop listening to events, you can call the `close` method on the `Connection` object.

<!-- file://code-samples/how-to/websocket/index.mts snippet:close the connection-->
```typescript
connection.close()
```

<!-- output://code-samples/how-to/websocket/events.txt -->
<details>
<summary>events</summary>

```text
[]
```
</details>

<!-- output://code-samples/how-to/websocket/statuses.txt -->
<details>
<summary>statuses</summary>

```text
[
  "CONNECTED",
  "CLOSED"
]
```
</details>
