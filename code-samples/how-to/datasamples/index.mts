import { CodingReference, DataSample, DataSampleFilter, Patient } from '@icure/medical-device-sdk'
import { hex2ua, sleep } from '@icure/api'
import 'isomorphic-fetch'
import * as console from 'console'

import { initLocalStorage, initMedTechApi, privKey } from '../../utils/index.mjs'

initLocalStorage()

const api = await initMedTechApi()

const loggedUser = await api.userApi.getLoggedUser()
await api!.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  loggedUser.healthcarePartyId!,
  hex2ua(privKey),
)

//tech-doc: create a patient for datasample
const patient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    note: 'Winter is coming',
  }),
)
//tech-doc: STOP HERE

//tech-doc: create a dataSample
const createdDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id!,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: 'Hello world' } },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
//tech-doc: STOP HERE

console.log('Create: ', JSON.stringify(createdDataSample))

//tech-doc: get a dataSample
const dataSample = await api.dataSampleApi.getDataSample(createdDataSample.id!)
//tech-doc: STOP HERE

console.log('Get', JSON.stringify(dataSample))

//tech-doc: update a dataSample
const updatedDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(patient.id!, {
  ...createdDataSample,
  // highlight-start
  content: { en: { stringValue: 'Hello world updated' } },
  comment: 'This is a updated comment',
  modified: undefined,
  // highlight-end
})
//tech-doc: STOP HERE

console.log('Update: ', JSON.stringify(updatedDataSample))
await sleep(5000)

//tech-doc: get a list of dataSamples
const filter = await new DataSampleFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byLabelCodeFilter('IC-TEST', 'TEST')
  .forPatients(api.cryptoApi, [patient])
  .build()

const filteredDataSamples = await api.dataSampleApi.filterDataSample(filter)
//tech-doc: STOP HERE

console.log('Filter: ', JSON.stringify(filteredDataSamples))

//tech-doc: get a list of dataSamples ids
const matchFilter = await new DataSampleFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)
  .forPatients(api.cryptoApi, [patient])
  .build()

const matchedDataSampleIds = await api.dataSampleApi.matchDataSample(matchFilter)
//tech-doc: STOP HERE

console.log('Matched dataSample ids: ', JSON.stringify(matchedDataSampleIds))

// THIS SHOULD WORK, BUT DOESN'T (We need to merge the PR about RSocket)
//tech-doc: delete a dataSample
const deletedDataSample = await api.dataSampleApi.deleteDataSample(updatedDataSample.id!)
//tech-doc: STOP HERE

console.log('Delete: ', JSON.stringify(deletedDataSample))

//tech-doc: filter builder
new DataSampleFilter()
  .forDataOwner(loggedUser.healthcarePartyId!)
  .byLabelCodeFilter('IC-TEST', 'TEST')
  .forPatients(api.cryptoApi, [patient])
  .build()
