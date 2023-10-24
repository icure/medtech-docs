import { sleep } from '@icure/api'
import 'isomorphic-fetch'

import { initLocalStorage, output } from '../../../utils/index.mjs'
import { initEHRLiteApi } from '../../utils/index.mjs'
import { LocalComponent, Observation, ObservationFilter, Patient } from '@icure/ehr-lite-sdk'
import { CodingReference, mapOf } from '@icure/typescript-common'

initLocalStorage()

const api = await initEHRLiteApi(true)

const loggedUser = await api.userApi.getLogged()

//tech-doc: create a patient for datasample
const patient = await api.patientApi.createOrModify(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
  }),
)
//tech-doc: STOP HERE
output({ patient })

//tech-doc: create a dataSample
const createdObservation = await api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    tags: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    localContent: mapOf({ en: new LocalComponent({ stringValue: 'Hello world' }) }),
    openingDate: 20220929083400,
  }),
)
//tech-doc: STOP HERE
output({ createdObservation: createdObservation })

//tech-doc: get a dataSample
const dataSample = await api.observationApi.get(createdObservation.id)
//tech-doc: STOP HERE
output({ dataSample })

//tech-doc: update a dataSample
const updatedObservation = await api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    ...createdObservation,
    // highlight-start
    localContent: mapOf({ en: new LocalComponent({ stringValue: 'Hello world updated' }) }),
    modified: undefined,
    // highlight-end
  }),
)
//tech-doc: STOP HERE
output({ updatedObservation })
await sleep(5000)

//tech-doc: get a list of dataSamples
const filter = await new ObservationFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId)
  .byLabelCodeDateFilter('IC-TEST', 'TEST')
  .forPatients([patient])
  .build()

const filteredObservations = await api.observationApi.filterBy(filter)
//tech-doc: STOP HERE
output({ filteredObservations })

//tech-doc: get a list of dataSamples ids
const matchFilter = await new ObservationFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId)
  .forPatients([patient])
  .build()

const matchedObservationIds = await api.observationApi.matchBy(matchFilter)
//tech-doc: STOP HERE
output({ matchedObservationIds })

// THIS SHOULD WORK, BUT DOESN'T (We need to merge the PR about RSocket)
//tech-doc: delete a dataSample
const deletedObservation = await api.observationApi.delete(updatedObservation.id)
//tech-doc: STOP HERE
output({ deletedObservation })

//tech-doc: filter builder
const dataSampleFilter = new ObservationFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId)
  .byLabelCodeDateFilter('IC-TEST', 'TEST')
  .forPatients([patient])
  .build()
//tech-doc: STOP HERE
output({ dataSampleFilter })
