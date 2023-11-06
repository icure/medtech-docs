import 'isomorphic-fetch'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import { initEHRLiteApi, initEHRLiteApi2 } from '../../utils/index.mjs'
import {
  AccessLevelEnum,
  Binary,
  mapTopicToTopicDto,
  Message,
  MessageCreationProgress,
  MessageCreationResult,
  MessageCreationStep,
  MessageFilter,
  TopicRole,
} from '@icure/ehr-lite-sdk'

initLocalStorage()

const api = await initEHRLiteApi(true)
const api2 = await initEHRLiteApi2(true)

const user1 = await api.userApi.getLogged()
const user2 = await api2.userApi.getLogged()

const user1DataOwnerId = api.dataOwnerApi.getDataOwnerIdOf(user1)
const user2DataOwnerId = api2.dataOwnerApi.getDataOwnerIdOf(user2)

// tech-doc: create message
const topic = await api.topicApi.create(
  [
    {
      participant: user1DataOwnerId,
      role: TopicRole.OWNER,
    },
    {
      participant: user2DataOwnerId,
      role: TopicRole.PARTICIPANT,
    },
  ],
  'Planet Express Delivery Company',
)

const messageCreationResult: MessageCreationResult<Message> = await api.messageApi.create(
  topic,
  'Fry, it’s been years since medical school, so remind me. Disemboweling in your species, fatal or non-fatal?',
)

const createdMessage = api.messageApi.getMessage(messageCreationResult)

// tech-doc: STOP HERE

output({
  createdMessage,
})

// tech-doc: create message long message
const longContent = Array.from({ length: 2500 })
  .map(() => Math.random().toString(36).substring(2))
  .join('')

const longMessageCreationResult = await api.messageApi.create(topic, longContent)

const createdLongMessage = api.messageApi.getMessage(longMessageCreationResult)
// tech-doc: STOP HERE

output({
  createdLongMessage,
})

const unfinishedMessage = {
  step: MessageCreationStep.MESSAGE_INITIALISATION,
  topic: mapTopicToTopicDto(topic),
  content: 'Bite my shiny metal ass!',
  attachments: [],
  delegates: {
    [user2DataOwnerId]: AccessLevelEnum.READ,
  },
} satisfies MessageCreationProgress

// tech-doc: resume create message
const resumedMessage = await api2.messageApi.resumeMessageCreation(unfinishedMessage)
// tech-doc: STOP HERE

// tech-doc: get message
const shortMessage = await api.messageApi.get(createdMessage.id)
// tech-doc: STOP HERE

output({ shortMessage })

// tech-doc: get long message
const longMessage = await api.messageApi.get(createdLongMessage.id)

let fullLongMessage = longMessage
if (longMessage.isTruncated) {
  fullLongMessage = await api.messageApi.loadMessageWithContent(fullLongMessage)
}
// tech-doc: STOP HERE

output({
  longMessage,
  fullLongMessage,
})

// tech-doc: create message with attachments

const attachments: Binary[] = [
  new Binary({
    contentType: 'text/plain',
    data: new ArrayBuffer(200),
    filename: 'importantText.txt',
  }),
]

const createdMessageWithAttachmentsResult = await api.messageApi.create(
  topic,
  "Here's a message with an attachment",
  attachments,
)

const createdMessageWithAttachments = api.messageApi.getMessage(createdMessageWithAttachmentsResult)

// tech-doc: STOP HERE

output({
  createdMessageWithAttachments,
})

// tech-doc: get message with attachments
const messageWithAttachments = await api.messageApi.get(createdMessageWithAttachments.id)

const messageAttachments = await api.messageApi.getAttachments(messageWithAttachments.id)
// tech-doc: STOP HERE

output({
  messageWithAttachments,
  messageAttachments,
})

// tech-doc: set read status
const readMessages = await api2.messageApi.read([createdMessage.id, messageWithAttachments])
// tech-doc: STOP HERE

output({
  readMessages,
})

// tech-doc: filter messages
// Filter latest message of a topic
const filter = await new MessageFilter(api2).forSelf().byTransportGuid(topic.id, true).build()

const paginatedList = await api2.messageApi.filterBy(filter)
// tech-doc: STOP HERE

output({
  paginatedList,
})

// tech-doc: match messages
const messageIds = await api2.messageApi.matchBy(filter)
// tech-doc: STOP HERE

output({
  messageIds,
})
