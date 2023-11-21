!!ehrlite
---
slug: how-to-manage-topics
description: Learn how to manage Topics
tags:
  - Topic
  - Chat
  - Messaging
  - Channel
---
# Handling topics

In this section, we will learn how to manage Topics. A `Topic` is similar to a chat channel and establishes the link between the `activeParticipants` involved in the text exchange. A `Topic` can reference a `Patient`, one or more `Observation`(s) (optional), and/or one or more `Condition`(s) (optional).

## Roles

There are 3 levels of roles available for participants of a `Topic`:

- PARTICIPANT
- ADMIN
- OWNER

### Participant

A `PARTICIPANT` is a user who has access to the `Topic` and can write messages. They can also read messages from other participants.

### Admin

An `ADMIN` is a user who has access to the `Topic` and can write messages. They can also read messages from other participants. Additionally, they can add or remove participants to/from the `Topic`.

### Owner

An `OWNER` is a user who has access to the `Topic` and can write messages. They can also read messages from other participants. Additionally, they can add or remove participants to/from the `Topic` and change the roles of other participants.

There is a special aspect to the `OWNER` role. The user who creates the `Topic` have to be assigned with the `OWNER` role. The `OWNER` is the only level of participant who cannot leave the `Topic`. They must assign the `OWNER` role to another participant in order to leave the `Topic`.

## Creating a Topic

To create a `Topic`, you must use the `create` function. To do this, you will need to provide the following information:

- `participants`, the participants of the `Topic`. Do not include the user creating the `Topic` in this list.
- `description`, a description of the `Topic`. Can be considered as a title.
- `patient`, the `Patient` related to the `Topic`. Optional.
- `observations`, the `Observations` related to the `Topic`. Optional. You must provide the `patient` if you are providing `observations`.
- `conditions`, the `Conditions` related to the `Topic`. Optional. You must provide the `patient` if you are providing `conditions`.
- `tags`, the `Tags` related to the `Topic`. Optional.
- `codes`, the `Codes` related to the `Topic`. Optional.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:create topic-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/newTopic.txt -->
<details>
<summary>newTopic</summary>
</details>

## Managing Participants

### Adding a Participant

To add a participant to a `Topic`, you must use the `addParticipant` function. To do this, you'll need to provide the following information:

- `topic`, a reference to the `Topic` to which you wish to add a participant.
- `participant`, a reference to the participant you want to add to the `Topic`, along with their role.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:add participant to topic-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/updatedTopicWithNewParticipant.txt -->
<details>
<summary>updatedTopicWithNewParticipant</summary>
</details>

You'll also need to manually share access to the different entities referenced in the `Topic`:

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:share linked health element and service with the new participant-->
```typescript
```

### Removing a Participant

To remove a participant from a `Topic`, you must use the `removeParticipant` function. To do this, you'll need to provide the following information:

- `topic`, a reference to the `Topic` from which you wish to remove a participant.
- `participant`, a reference to the participant you want to remove from the `Topic`.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:remove participant from topic-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/updatedTopicWithRemovedParticipant.txt -->
<details>
<summary>updatedTopicWithRemovedParticipant</summary>
</details>


#### Leaving a Topic

To leave a `Topic`, you can use the `removeParticipant` function. However, there's a shortcut through the `leave` function. To do this, you'll need to provide the following information:

- `topic`, a reference to the `Topic` you wish to leave.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:leave topic-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/updatedTopicThatHaveBeenLeftByUser2.txt -->
<details>
<summary>updatedTopicThatHaveBeenLeftByUser2</summary>
</details>

:::info

You'll still be able to read messages already received from the `Topic` after leaving it. However, new messages will no longer be accessible to you.

:::

## Managing Observations and Conditions Linked to a Topic

You can manage the `Observations` and `Conditions` linked to a `Topic` at any time. For this, you must use the `addObservations`, `removeObservations`, `addConditions`, and `removeConditions` functions.

### Adding Observations

To add `Observations` to a `Topic`, you must use the `addObservations` function. You will need to provide the following information:

- `topic`, a reference to the `Topic` to which you want to add `Observations`.
- `observations`, a list of references to the `Observations` you want to add to the `Topic`.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:add observations to topic-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/topicWithNewlySharedObs.txt -->
<details>
<summary>topicWithNewlySharedObs</summary>
</details>

As you can see, you will need to manually share access to the `Observations` with the `Topic` participants before being able to add them to the `Topic`.

### Removing Observations

To remove `Observations` from a `Topic`, you must use the `removeObservations` function. You will need to provide the following information:

- `topic`, a reference to the `Topic` from which you want to remove `Observations`.
- `observations`, a list of references to the `Observations` you want to remove from the `Topic`.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:remove observations from topic-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/topicWithRemovedObs.txt -->
<details>
<summary>topicWithRemovedObs</summary>
</details>


:::warning

The `Observations` are not deleted from the platform. They are simply unlinked from the `Topic`. However, the sharing of access to the `Observations` is not removed.

:::

### Adding Conditions

To add `Conditions` to a `Topic`, you must use the `addConditions` function. You will need to provide the following information:

- `topic`, a reference to the `Topic` to which you want to add `Conditions`.
- `conditions`, a list of references to the `Conditions` you want to add to the `Topic`.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:add conditions to topic-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/topicWithNewlySharedConditions.txt -->
<details>
<summary>topicWithNewlySharedConditions</summary>
</details>


As you can see, you will need to manually share access to the `Conditions` with the `Topic` participants before being able to add them to the `Topic`.

### Removing Conditions

To remove `Conditions` from a `Topic`, you must use the `removeConditions` function. You will need to provide the following information:

- `topic`, a reference to the `Topic` from which you want to remove `Conditions`.
- `conditions`, a list of references to the `Conditions` you want to remove from the `Topic`.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:remove conditions from topic-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/topicWithRemovedConditions.txt -->
<details>
<summary>topicWithRemovedConditions</summary>
</details>

:::warning

The `Conditions` are not deleted from the platform. They are simply unlinked from the `Topic`. However, the sharing of access to the `Conditions` is not removed.

:::

## Retrieving Topics

### Retrieve a Topic by Its ID

To retrieve a `Topic` by its ID, you must use the `get` function. For this, you will need to provide the following information:

- `id`, the ID of the `Topic` you wish to retrieve.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:get topic by id-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/topicById.txt -->
<details>
<summary>topicById</summary>
</details>

### Filtering Topics

To filter `Topics`, you must use the `filterBy` function. For this, you will need to provide the following information:

- `filter`, an object of type `Filter<Topic>` that will allow you to filter `Topics` based on various criteria.

You can use the `TopicFilter` builder to construct your filter.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:get topics using filter-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/paginatedList.txt -->
<details>
<summary>paginatedList</summary>
</details>

#### Getting IDs of Filtered Topics

You can also just get the IDs by applying the same filter using a call to `matchBy`. For this, you will need to provide the following information:

- `filter`, an object of type `Filter<Topic>` that will allow you to filter `Topics` based on various criteria.

<!-- file://code-samples/{{sdk}}/how-to/manage-topics/index.mts snippet:get topic ids using match-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-topics/topicIds.txt -->
<details>
<summary>topicIds</summary>
</details>