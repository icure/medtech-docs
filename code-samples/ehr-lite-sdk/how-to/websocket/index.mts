import { sleep } from '@icure/api'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import 'isomorphic-fetch'
import { initEHRLiteApi } from '../../utils/index.mjs'
import {
  Observation,
  ObservationFilter,
  Patient,
  CodingReference,
  LocalComponent,
} from '@icure/ehr-lite-sdk'
import { mapOf } from '@icure/typescript-common'

initLocalStorage()

const api = await initEHRLiteApi(true)
const loggedUser = await api.userApi.getLogged()

//tech-doc: can listen to dataSample events
const events: Observation[] = []
const statuses: string[] = []

const connection = (
  await api.observationApi.subscribeToEvents(
    ['CREATE'], // Event types to listen to
    await new ObservationFilter(api)
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

//tech-doc: STOP HERE

//tech-doc: create a patient for websocket
const patient = await api.patientApi.createOrModify(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
  }),
)
//tech-doc: STOP HERE
output({ patient })

//tech-doc: create a dataSample for websocket
const dataSample = await api.observationApi.createOrModifyFor(
  patient.id!,
  new Observation({
    tags: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    localContent: mapOf({ en: new LocalComponent({ stringValue: 'Hello world' }) }),
  }),
)
//tech-doc: STOP HERE
output({ dataSample })

await sleep(2000)
//tech-doc: close the connection
connection.close()
//tech-doc: STOP HERE
await sleep(5000)
output({ statuses, events })
