import { CodingReference, DataSample, DataSampleFilter, medTechApi, Patient, TimeSeries } from '@icure/medical-device-sdk'
import { hex2ua, sleep } from '@icure/api'
import 'isomorphic-fetch'
import * as console from 'console'

import { initLocalStorage, initMedTechApi, privKey } from '../../utils/index.mjs'

initLocalStorage()

const api = await initMedTechApi()

const loggedUser = await api.userApi.getLoggedUser()
await api!.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(loggedUser.healthcarePartyId!, hex2ua(privKey))

//tech-doc: create a patient for datasample
const patient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    note: 'Winter is coming',
  }),
)
//tech-doc: STOP HERE

//tech-doc: create children dataSample one hour mean
const oneHourMeanDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '41920-0', version: '2.73' })]),
  comment: 'Heart rate 1 hour mean',
  openingDate: 20220929083400,
  content: {
    en: {
      measureValue: {
        value: 72,
        unit: '{beats}/min',
        unitCodes: new Set([new CodingReference({ type: 'UCUM', code: '{beats}/min', version: '1.2' })]),
      },
    },
  },
})
//tech-doc: create children dataSample eight hour mean
const eightHourMeanDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '41921-8', version: '2.73' })]),
  comment: 'Heart rate 8 hour mean',
  openingDate: 20220929083400,
  content: {
    en: {
      measureValue: {
        value: 63,
        unit: '{beats}/min',
        unitCodes: new Set([new CodingReference({ type: 'UCUM', code: '{beats}/min', version: '1.2' })]),
      },
    },
  },
})
//tech-doc: create children dataSample temperatures
const temperaturesDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '8310-5', version: '2.73' })]),
  comment: 'Body temperature',
  openingDate: 20220929083400,
  content: {
    en: {
      // highlight-start
      timeSeries: new TimeSeries({
        samples: Array.apply(null, { length: 60 }).map(Function.call, () => Array.apply(null, { length: 1 }).map(Function.call, () => Math.random() + 36.2)), // Simulate 60 random values for temperature between 36.2 and 37.2 (e.g. [[36.5], [37.0], [36.8], ...])
        fields: ['C°'],
      }),
      // highlight-end
    },
  },
})
//tech-doc: create heart rate datasample
const meanHeartRateDataSample = new DataSample({
  labels: new Set([
    new CodingReference({ type: 'LOINC', code: '43149-4', version: '2.73' }),
    // highlight-start
    new CodingReference({ type: 'LOINC', code: '41920-0', version: '2.73' }),
    new CodingReference({ type: 'LOINC', code: '41921-8', version: '2.73' }),
    // highlight-end
  ]),
  openingDate: 20220929083400,
  content: {
    en: {
      compoundValue: [
        // highlight-start
        oneHourMeanDataSample,
        eightHourMeanDataSample,
        temperaturesDataSample,
        // highlight-end
      ],
    },
  },
})

const createdDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(patient.id!, meanHeartRateDataSample)
//tech-doc: STOP HERE

console.log(JSON.stringify(createdDataSample))
