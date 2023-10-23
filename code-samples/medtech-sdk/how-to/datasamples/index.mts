import {
  CodingReference,
  Content,
  DataSample,
  DataSampleFilter,
  Patient,
} from '@icure/medical-device-sdk'
import { sleep } from '@icure/api'
import 'isomorphic-fetch'

import { initLocalStorage, initMedTechApi, output } from '../../../utils/index.mjs'
import { mapOf } from '@icure/typescript-common'

initLocalStorage()

const api = await initMedTechApi(true)

const loggedUser = await api.userApi.getLoggedUser()

//tech-doc: create a patient for datasample
const patient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    note: 'Winter is coming',
  }),
)
//tech-doc: STOP HERE
output({ patient })

//tech-doc: create a dataSample
const createdDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id!,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: mapOf({ en: new Content({ stringValue: 'Hello world' }) }),
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
//tech-doc: STOP HERE
output({ createdDataSample })

//tech-doc: get a dataSample
const dataSample = await api.dataSampleApi.getDataSample(createdDataSample.id!)
//tech-doc: STOP HERE
output({ dataSample })

//tech-doc: update a dataSample
const updatedDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id!,
  new DataSample({
    ...createdDataSample,
    // highlight-start
    content: mapOf({ en: new Content({ stringValue: 'Hello world updated' }) }),
    comment: 'This is a updated comment',
    modified: undefined,
    // highlight-end
  }),
)
//tech-doc: STOP HERE
output({ updatedDataSample })
await sleep(5000)

//tech-doc: get a list of dataSamples
const filter = await new DataSampleFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byLabelCodeDateFilter('IC-TEST', 'TEST')
  .forPatients([patient])
  .build()

const filteredDataSamples = await api.dataSampleApi.filterDataSample(filter)
//tech-doc: STOP HERE
output({ filteredDataSamples })

//tech-doc: get a list of dataSamples ids
const matchFilter = await new DataSampleFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId!)
  .forPatients([patient])
  .build()

const matchedDataSampleIds = await api.dataSampleApi.matchDataSample(matchFilter)
//tech-doc: STOP HERE
output({ matchedDataSampleIds })

// THIS SHOULD WORK, BUT DOESN'T (We need to merge the PR about RSocket)
//tech-doc: delete a dataSample
const deletedDataSample = await api.dataSampleApi.deleteDataSample(updatedDataSample.id!)
//tech-doc: STOP HERE
output({ deletedDataSample })

//tech-doc: filter builder
const dataSampleFilter = new DataSampleFilter(api)
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byLabelCodeDateFilter('IC-TEST', 'TEST')
  .forPatients([patient])
  .build()
//tech-doc: STOP HERE
output({ dataSampleFilter })
