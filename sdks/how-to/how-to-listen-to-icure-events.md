---
slug: listen-to-icure-events
---

# How to listen to iCure events ?

At some point, you may want to listen to iCure events. For example, you may want to be notified when a new patient is created. This is possible with the iCure Medtech SDK.

## What is an event ?

An event is a message sent by iCure to notify that something has happened. For example, when a new patient is created, iCure sends an event to all the users that are listening to this event.

Currently, iCure supports the following events for the following entities:

|                   | CREATE | UPDATE | DELETE |
|-------------------|--------|--------|--------|
| Patient           | ✅      | ✅      | ✅      |
| DataSample        | ✅      | ❌      | ✅      |
| HealthcareElement | ✅      | ✅      | ✅      |
| Notification      | ✅      | ✅      | ✅      |
| User              | ✅      | ✅      | ✅      |

## How to listen to events ?

:::note

We assume that you have already read the [How to register a user](/sdks/how-to/register-a-user) and [How to login as a user](/sdks/how-to/login-as-a-user) guides.

:::

As an example, we will listen to `CREATE` events for `DataSample` objects. This methodology can be applied to any other type of event and objects.

<!-- file://code-samples/rsocket/index.mts snippet:can listen to dataSample events-->
```typescript
const events: DataSample[] = [];
const statuses: string[] = [];

const connection = (
	await api.dataSampleApi.subscribeToDataSampleEvents(
		["CREATE"], // Event types to listen to
		await new DataSampleFilter()
			.forDataOwner(loggedUser.healthcarePartyId!)
			.byTagCodeFilter("IC-TEST", "TEST")
			.build(),
		async (ds) => {
			events.push(ds);
		},
		{} // Options
	)
)
	.onConnected(() => statuses.push("CONNECTED"))
	.onClosed(() => statuses.push("CLOSED"));
```

The `subscribeToDataSampleEvents` method takes 4 parameters:
- The first parameter is an array of event types. In this example, we only listen to `CREATE` events.
- The second parameter is a filter. In this example, we only listen to events that are created by the logged user and that have the `IC-TEST` tag code and `TEST` tag type.
- The third parameter is a callback that is called when an event is received. In this example, we push the received event in an array called `events`.
- The fourth parameter is an options object. In this example, we don't use any options.

The `subscribeToDataSampleEvents` method returns a `Connection` object. This object has 2 methods:
- `onConnected` is called when the connection is established
- `onClosed` is called when the connection is closed

:::caution

As you can subscribe to multiple event types, unfortunately for now you don't have the information of which event type triggered the callback. You may want to use a different connection for each event type.

:::

### Example

To be able to test this example, you need to create a `DataSample` object with the `IC-TEST` tag code and `TEST` tag type.

:::note

We assume that you already have a patient created. If not, you can add the following code below before the DataSample creation.
<details>
  <summary>Create a patient</summary>

<!-- file://code-samples/rsocket/index.mts snippet:create a patient for rsocket-->
```typescript
const patient = await api.patientApi.createOrModifyPatient(
	new Patient({
		firstName: "John",
		lastName: "Snow",
		note: "Winter is coming",
	})
);
```

</details>

:::

<!-- file://code-samples/rsocket/index.mts snippet:create a dataSample for rsocket-->
```typescript
await api.dataSampleApi.createOrModifyDataSampleFor(
	patient.id!,
	new DataSample({
		labels: new Set([
			new CodingReference({type: "IC-TEST", code: "TEST"}),
		]),
		content: {en: {stringValue: "Hello world"}},
	})
);
```


## How to stop listening to events ?

To stop listening to events, you can call the `close` method on the `Connection` object.

<!-- file://code-samples/rsocket/index.mts snippet:close the connection-->
```typescript
connection.close();
```














