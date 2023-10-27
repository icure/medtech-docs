import {
  CodingReference,
  Content,
  DataSample,
  DataSampleFilter,
  Patient,
} from '@icure/medical-device-sdk'
import { sleep } from '@icure/api'
import { initLocalStorage, output, initMedTechApi } from '../../../utils/index.mjs'
import 'isomorphic-fetch'
import { mapOf } from '@icure/typescript-common'

initLocalStorage()

const api = await initMedTechApi(true)
const loggedUser = await api.userApi.getLoggedUser()

//tech-doc: can listen to dataSample events
const events: DataSample[] = []
const statuses: string[] = []

const connection = (
  await api.dataSampleApi.subscribeToDataSampleEvents(
    ['CREATE'], // Event types to listen to
    await new DataSampleFilter(api)
      .forDataOwner(loggedUser.healthcarePartyId)
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
const patient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    note: 'Winter is coming',
  }),
)
//tech-doc: STOP HERE
output({ patient })

//tech-doc: create a dataSample for websocket
const dataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: mapOf({ en: new Content({ stringValue: 'Hello world' }) }),
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
