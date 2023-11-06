---
slug: how-to-manage-messages
description: Learn how to manage Messages
tags:
  - Message
  - Chat
  - Messaging
  - Channel
---
{{#ehrlite}}
# Handling messages

In this section, we will learn how to manage Messages. A `Message` is a text exchange between `activeParticipants` of a `Topic`.

## Creating a Message

To create a `Message`, you must use the `create` function. To do this, you will need to provide the following information:

- `topic`, a reference to the `Topic` to which you wish to add a message.
- `content`, the content of the `Message`. (optional)
- `attachments`, the attachments of the `Message`. (optional)
- `tags`, the `Tags` related to the `Message`. (optional)
- `codes`, the `Codes` related to the `Message`. (optional)

`content` and `attachments` are optional but you must provide at least one of them.

The result of the `create` function is a `MessageCreationResult` object. To get the `Message` object, you must use the `getMessage` function and provide the `MessageCreationResult` object.

This function may return the created `Message` or `null` if the `Message` is not yet created and needs to be resumed.

<!-- file://code-samples/{{sdk}}/how-to/manage-messages/index.mts snippet:create message-->
```typescript
```

## Get a Message

To retrieve a `Message`, you must use the `get` function and provide the `Message`'s `id`.

<!-- file://code-samples/{{sdk}}/how-to/manage-messages/index.mts snippet:get message-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-messages/createdMessage.txt -->

## Creating a long Message

You're able to send a long Message, a long message is considered a message that is longer than 2000 characters.
Long Message content are stored in a attachment and the truncated content is stored in the content field of the `Message`.

The process to create a long Message is the same as creating a regular Message. You must provide the following information:

- `topic`, a reference to the `Topic` to which you wish to add a message.
- `content`, the content of the `Message`. (optional)
- `attachments`, the attachments of the `Message`. (optional)
- `tags`, the `Tags` related to the `Message`. (optional)
- `codes`, the `Codes` related to the `Message`. (optional)

<!-- file://code-samples/{{sdk}}/how-to/manage-messages/index.mts snippet:create long message-->
```typescript
```

## Get a long Message

Retrieving a long Message is the same as retrieving a regular Message with an extra step. You must use the `get` function and provide the `Message`'s `id`.

Then you can check if the `Message` is a long Message by checking the `isTruncated` property (meaning the current `Message` instance is truncated). If it's a long Message, you must use the `loadMessageWithContent` function and provide the `Message`'s instance.

<!-- file://code-samples/{{sdk}}/how-to/manage-messages/index.mts snippet:get long message-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-messages/longMessage.txt -->

<!-- output://code-samples/{{sdk}}/how-to/manage-messages/fullLongMessage.txt -->

## Resume creating a Message

Sometimes something goes wrong when creating a Message, and you need to resume the creation of the Message.

To resume the creation of a Message, you must use the `resumeMessageCreation` function. To do this, you will need to provide the following information:

- `messageCreationResult`, the `MessageCreationResult` object returned by the `create` function.

<!-- file://code-samples/{{sdk}}/how-to/manage-messages/index.mts snippet:resume create message-->
```typescript
```

## Create a Message with attachments

To create a `Message` with attachments, you must use the `create` function. To do this, you will need to provide the following information:

- `topic`, a reference to the `Topic` to which you wish to add a message.
- `content`, the content of the `Message`. (optional)
- `attachments`, the attachments of the `Message`.
- `tags`, the `Tags` related to the `Message`. (optional)
- `codes`, the `Codes` related to the `Message`. (optional)

<!-- file://code-samples/{{sdk}}/how-to/manage-messages/index.mts snippet:create message with attachments-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-messages/createdMessageWithAttachments.txt -->

## Get a Message with attachments

To retrieve a `Message` with attachments, you must use the `get` function and provide the `Message`'s `id`.

Then, to get the attachments, you must use the `getAttachments` function and provide the `Message`'s instance.

<!-- file://code-samples/{{sdk}}/how-to/manage-messages/index.mts snippet:get message with attachments-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-messages/createdMessageWithAttachments.txt -->

## Set a Message as read

To set a `Message` as read, you must use the `read` function and provide some `Message` references in an array.

<!-- file://code-samples/{{sdk}}/how-to/manage-messages/index.mts snippet:set read status-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-messages/readMessages.txt -->

## Filter Messages

To filter `Messages`, you must use the `filter` function and then provide the `Filter` object.

To build a `Filter` object, you must use the `MessageFilter` and provide the information you want to filter on.

E.G.: To filter latest `Messages` of a `Topic`, you must use the `MessageFilter` and provide the `Topic`'s `id` and set the latest property to `true` to `byTransportGuid` builder function.

<!-- file://code-samples/{{sdk}}/how-to/manage-messages/index.mts snippet:filter messages-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-messages/paginatedList.txt -->

## Filter Message ids

To filter `Messages` ids, you must use the `match` function and then provide the `Filter` object.

<!-- file://code-samples/{{sdk}}/how-to/manage-messages/index.mts snippet:filter message ids-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/manage-messages/messageIds.txt -->

{{/ehrlite}}
