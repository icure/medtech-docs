import 'isomorphic-fetch'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import { initEHRLiteApi, initEHRLiteApi2 } from '../../utils/index.mjs'
import {
  Annotation,
  Component,
  Condition,
  Observation,
  Patient,
  TopicRole,
  CodingReference,
  Measure,
  TopicFilter,
  Topic,
} from '@icure/ehr-lite-sdk'

initLocalStorage()

const api = await initEHRLiteApi(true)
const api2 = await initEHRLiteApi2(true)

const user1 = await api.userApi.getLogged()
const user2 = await api2.userApi.getLogged()

const user1DataOwnerId = api.dataOwnerApi.getDataOwnerIdOf(user1)
const user2DataOwnerId = api2.dataOwnerApi.getDataOwnerIdOf(user2)

const newPatientInstance = async () =>
  await api.patientApi.createOrModify(
    new Patient({
      firstName: 'Bender',
      lastName: 'Bending Rodríguez',
    }),
  )

const newObservationInstance = async (patient: Patient) => {
  return await api.observationApi.createOrModifyFor(
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
            }),
          ],
        }),
      }),
    }),
  )
}

const newConditionInstance = async (patient: Patient) => {
  return await api.conditionApi.createOrModify(
    new Condition({
      notes: [
        new Annotation({
          markdown: new Map([
            ['en', 'The patient has been diagnosed African Hydraulic Fever'],
            ['fr', 'Le patient a été diagnostiqué fièvre hydraulique africaine'],
          ]),
        }),
      ],
    }),
    patient.id!,
  )
}

//tech-doc: create topic
const participants = [
  {
    participant: user1DataOwnerId,
    role: TopicRole.OWNER,
  },
  {
    participant: user2DataOwnerId,
    role: TopicRole.PARTICIPANT,
  },
]

const patient = await newPatientInstance()
const condtition = await newConditionInstance(patient)
const observation = await newObservationInstance(patient)

const sharedPatient = await api.patientApi.giveAccessTo(patient, user2DataOwnerId)
const sharedCondition = await api.conditionApi.giveAccessTo(condtition, user2DataOwnerId)
const sharedObservation = await api.observationApi.giveAccessTo(observation, user2DataOwnerId)

const newTopic = await api.topicApi.create(
  participants,
  'Topic name',
  sharedPatient,
  new Set([sharedCondition]), // This could also be a Set of Condition ids
  new Set([sharedObservation]), // This could also be a Set of Observation ids
  undefined, // Tags
  undefined, // Codes
)
//tech-doc: STOP HERE
output({
  newTopic: JSON.stringify(newTopic, null, 2),
})

//tech-doc: add participant to topic
// Initial context
const patient2: Patient = await newPatientInstance()
const condition2: Condition = await newConditionInstance(patient)
const observation2: Observation = await newObservationInstance(patient)

const topicToAddNewParticipant: Topic = await api.topicApi.create(
  [
    {
      participant: user1DataOwnerId,
      role: TopicRole.OWNER,
    },
  ],
  'Topic name',
  patient2,
  new Set([condition2]),
  new Set([observation2]),
)

const newParticipant = {
  ref: user2DataOwnerId,
  role: TopicRole.PARTICIPANT,
}

const updatedTopicWithNewParticipant = await api.topicApi.addParticipant(
  topicToAddNewParticipant,
  newParticipant,
)
//tech-doc: STOP HERE

output({
  updatedTopicWithNewParticipant,
})

//tech-doc: share linked health element and service with the new participant
const updatedPatient = await api.patientApi.giveAccessTo(patient2, user2DataOwnerId)
const updatedCondition = await api.conditionApi.giveAccessTo(condition2, user2DataOwnerId)
const updatedObservation = await api.observationApi.giveAccessTo(observation2, user2DataOwnerId)
//tech-doc: STOP HERE

//tech-doc: remove participant from topic
const participantToRemove = user2DataOwnerId

const updatedTopicWithRemovedParticipant = await api.topicApi.removeParticipant(
  updatedTopicWithNewParticipant,
  participantToRemove,
)
//tech-doc: STOP HERE

output({
  updatedTopicWithRemovedParticipant,
})

//tech-doc: leave topic
const topicThatWillBeLeft = await api.topicApi.create(participants, 'Topic that will be left')

const updatedTopicThatHaveBeenLeftByUser2 = await api2.topicApi.leave(topicThatWillBeLeft) // user2 leaves the topic
//tech-doc: STOP HERE

output({
  updatedTopicThatHaveBeenLeftByUser2,
})

//tech-doc: add observations to topic
const patient3: Patient = await newPatientInstance()

const topicToShareServices = await api.topicApi.create(
  participants,
  'Topic to share services',
  patient3,
)

const observations = [await newObservationInstance(patient3)]

const sharedObservations = [
  ...(await Promise.all(
    participants.map(async ({ participant: dataOwnerId }) => {
      return await api.observationApi.giveAccessToMany(observations, dataOwnerId)
    }),
  )),
].flat()

const topicWithNewlySharedObs = await api.topicApi.addObservations(
  topicToShareServices,
  sharedObservations,
)
//tech-doc: STOP HERE

output({
  topicWithNewlySharedObs,
})

//tech-doc: remove observations from topic
const topicWithRemovedObs = await api.topicApi.removeObservations(
  topicWithNewlySharedObs,
  sharedObservations,
)
//tech-doc: STOP HERE

output({
  topicWithRemovedObs,
})

//tech-doc: add conditions to topic
const topicToShareHealthElements = await api.topicApi.create(
  participants,
  'Topic to share health elements',
  patient, // Patient created on the create topic step
)

const condition3 = await newConditionInstance(patient)
const newlySharedCondition = await api.conditionApi.giveAccessTo(condition3, user2DataOwnerId)

const topicWithNewlySharedConditions = await api.topicApi.addConditions(
  topicToShareHealthElements,
  [newlySharedCondition],
)
//tech-doc: STOP HERE

output({
  topicWithNewlySharedConditions,
})

//tech-doc: remove conditions from topic
const topicWithRemovedConditions = await api.topicApi.removeConditions(
  topicWithNewlySharedConditions,
  [newlySharedCondition],
)
//tech-doc: STOP HERE

output({
  topicWithRemovedConditions,
})

//tech-doc: get topic by id
const topicToBeFetched = await api.topicApi.create(participants, 'Topic to be fetched')

const topicId = topicToBeFetched.id!

const topicById = await api.topicApi.get(topicId)
//tech-doc: STOP HERE

output({
  topicById,
})

//tech-doc: get topics using filter
const filter = await new TopicFilter(api).forSelf().byParticipant(user1DataOwnerId).build()

const paginatedList = await api.topicApi.filterBy(filter)
//tech-doc: STOP HERE

output({
  paginatedList,
})

//tech-doc: get topic ids using match
const topicIds = await api.topicApi.matchBy(filter)
//tech-doc: STOP HERE

output({
  topicIds,
})
