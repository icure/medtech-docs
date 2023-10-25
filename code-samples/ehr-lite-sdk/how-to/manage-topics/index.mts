import 'isomorphic-fetch'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import { initEHRLiteApi, initEHRLiteApi2 } from '../../utils/index.mjs'
import { Annotation, Component, Condition, Observation, Patient, TopicRole, CodingReference, Measure, TopicFilter } from '@icure/ehr-lite-sdk'

initLocalStorage()

const api = await initEHRLiteApi(true)
const api2 = await initEHRLiteApi2(true)

const user1 = await api.userApi.getLogged()
const user2 = await api2.userApi.getLogged()

const user1DataOwnerId = api.dataOwnerApi.getDataOwnerIdOf(user1)
const user2DataOwnerId = api2.dataOwnerApi.getDataOwnerIdOf(user2)

// tech-doc: create topic

const patient = await api.patientApi.createOrModify(
  new Patient({
    firstName: 'Bender',
    lastName: 'Bending Rodríguez',
  }),
)

const participants = [
  {
    participant: user1DataOwnerId,
    role: TopicRole.PARTICIPANT,
  },
]

const condtition = await api.conditionApi.createOrModify(
  new Condition({
    notes: [
      new Annotation({
        markdown: new Map([
          ['en', 'The patient has been diagnosed African Hydraulic Fever'],
          ['fr', 'Le patient a été diagnostiqué fièvre hydraulique africaine'],
        ]),
      }),
    ],
  })
)

const observation = await api2.observationApi.createOrModifyFor(
  patient.id!,
  new Observation({
    component: new Component({
      measureValue: new Measure({
        value: 75,
        unit: '°C',
        unitCodes: [
          new CodingReference({
            type: 'UCUM',
            code: 'Cel',
            version: '2.1',
          })
        ]
      })
    })
  }),
)
// highlight-start
const newTopic = await api.topicApi.create(
  participants,
  'Topic name',
  patient,
  new Set([condtition]), // This could also be a Set of Condition ids
  new Set([observation]), // This could also be a Set of Observation ids
  undefined, // Tags
  undefined, // Codes
)
// highlight-end
// tech-doc: STOP HERE
output({
  newTopic,
})

const topic = await api.topicApi.create(
  [],
  'Topic name',
  patient,
  new Set([condtition]),
  new Set([observation]),
)

// tech-doc: add participant to topic

const newParticipant = {
  ref: user2DataOwnerId,
  role: TopicRole.PARTICIPANT,
}

// highlight-start
const updatedTopic = await api.topicApi.addParticipant(topic, newParticipant)
// highlight-end

// tech-doc: STOP HERE

output({
  updatedTopic,
})

// tech-doc: share linked health element and service with the new participant

const updatedPatient = await api.patientApi.giveAccessTo(patient, user2DataOwnerId)
const updatedCondition = await api.conditionApi.giveAccessTo(condtition, user2DataOwnerId)
const updatedObservation = await api2.observationApi.giveAccessTo(observation, user2DataOwnerId)

// tech-doc: STOP HERE

// tech-doc: remove participant from topic

const participantToRemove = user2DataOwnerId

// highlight-start
const updatedTopic2 = await api.topicApi.removeParticipant(topic, participantToRemove)
// highlight-end
// tech-doc: STOP HERE

output({
  updatedTopic2,
})

// tech-doc: leave topic

const updatedTopic3 = await api.topicApi.leave(topic)

// tech-doc: STOP HERE

output({
  updatedTopic3,
})

// tech-doc: add observations to topic

const topicToShareServices = await api.topicApi.create(
  participants,
  'Topic to share services',
  patient, // Patient created on the create topic step
)

const observations = [observation] // Observation created on the create topic step

const sharedObservations = await api.observationApi.giveAccessToMany(observations, user2DataOwnerId)

// highlight-start
const topicWithNewlySharedObs = await api.topicApi.addObservations(topicToShareServices, sharedObservations)
// highlight-end

// tech-doc: STOP HERE

output({
  topicWithNewlySharedObs,
})

// tech-doc: remove observations from topic

const topicWithRemovedObs = await api.topicApi.removeObservations(topicWithNewlySharedObs, sharedObservations)

// tech-doc: STOP HERE

output({
  topicWithRemovedObs,
})

// tech-doc: add conditions to topic

const topicToShareHealthElements = await api.topicApi.create(
  participants,
  'Topic to share health elements',
  patient, // Patient created on the create topic step
)

const sharedCondition = await api.conditionApi.giveAccessTo(condtition, user2DataOwnerId)

// highlight-start
const topicWithNewlySharedConditions = await api.topicApi.addConditions(topicToShareHealthElements, [sharedCondition])
// highlight-end

// tech-doc: STOP HERE

output({
  topicWithNewlySharedConditions,
})


// tech-doc: remove conditions from topic

const topicWithRemovedConditions = await api.topicApi.removeConditions(topicWithNewlySharedConditions, [sharedCondition])

// tech-doc: STOP HERE

output({
  topicWithRemovedConditions,
})

// tech-doc: get topic by id

const topicId = topic.id!

// highlight-start
const topicById = await api.topicApi.get(topicId)
// highlight-end

// tech-doc: STOP HERE

output({
  topicById
})

// tech-doc: get topics using filter

const filter = await new TopicFilter(api).forSelf().byParticipant(user1DataOwnerId).build()

const paginatedList = await api.topicApi.filterBy(filter)

// tech-doc: STOP HERE

output({
  paginatedList,
})

// tech-doc: get topic ids using match

const topicIds = await api.topicApi.matchBy(filter)

// tech-doc: STOP HERE

output({
  topicIds,
})
