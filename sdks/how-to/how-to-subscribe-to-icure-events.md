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

<!-- file://code-samples/how-to/rsocket/index.mts snippet:can listen to dataSample events-->
```typescript
const events: DataSample[] = []
const statuses: string[] = []

const connection = (
  await api.dataSampleApi.subscribeToDataSampleEvents(
    ['CREATE'], // Event types to listen to
    await new DataSampleFilter()
      .forDataOwner(loggedUser.healthcarePartyId!)
      .byLabelCodeFilter('IC-TEST', 'TEST')
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

<!-- file://code-samples/how-to/rsocket/index.mts snippet:create a patient for rsocket-->
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

:::

<!-- file://code-samples/how-to/rsocket/index.mts snippet:create a dataSample for rsocket-->
```typescript
await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id!,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: 'Hello world' } },
  }),
)
```

## How to stop listening to events&#8239;?

To stop listening to events, you can call the `close` method on the `Connection` object.

<!-- file://code-samples/how-to/rsocket/index.mts snippet:close the connection-->
```typescript
connection.close()
```
