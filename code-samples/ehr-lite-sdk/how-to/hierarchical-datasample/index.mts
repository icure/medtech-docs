import 'isomorphic-fetch'

import { initLocalStorage, output } from '../../../utils/index.mjs'
import { initEHRLiteApi } from '../../utils/index.mjs'
import {
  Component,
  LocalComponent,
  Observation,
  Patient,
  Measure,
  TimeSeries,
} from '@icure/ehr-lite-sdk'
import { CodingReference, mapOf } from '@icure/typescript-common'

initLocalStorage()

const api = await initEHRLiteApi(true)

//tech-doc: create a patient for datasample
const patient = await api.patientApi.createOrModify(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
  }),
)
//tech-doc: STOP HERE
output({ patient })

//tech-doc: create children dataSample one hour mean
const oneHourMeanObservation = new Observation({
  tags: new Set([new CodingReference({ type: 'LOINC', code: '41920-0', version: '2.73' })]),
  localContent: mapOf({ en: new LocalComponent({ stringValue: 'Heart rate 1 hour mean' }) }),
  openingDate: 20220929083400,
  component: new Component({
    measureValue: new Measure({
      value: 72,
      unit: '{beats}/min',
      unitCodes: [new CodingReference({ type: 'UCUM', code: '{beats}/min', version: '1.2' })],
    }),
  }),
})
//tech-doc: create children dataSample eight hour mean
const eightHourMeanObservation = new Observation({
  tags: new Set([new CodingReference({ type: 'LOINC', code: '41921-8', version: '2.73' })]),
  localContent: mapOf({ en: new LocalComponent({ stringValue: 'Heart rate 8 hour mean' }) }),
  openingDate: 20220929083400,
  component: new Component({
    measureValue: new Measure({
      value: 63,
      unit: '{beats}/min',
      unitCodes: [new CodingReference({ type: 'UCUM', code: '{beats}/min', version: '1.2' })],
    }),
  }),
})
//tech-doc: STOP HERE
output({
  oneHourMeanDataSample: oneHourMeanObservation,
  eightHourMeanDataSample: eightHourMeanObservation,
})

//tech-doc: create children dataSample temperatures
const temperaturesObservation = new Observation({
  tags: new Set([new CodingReference({ type: 'LOINC', code: '8310-5', version: '2.73' })]),
  localContent: mapOf({ en: new LocalComponent({ stringValue: 'Body temperature' }) }),
  openingDate: 20220929083400,
  component: new Component({
    // highlight-start
    timeSeries: new TimeSeries({
      samples: new Array<number>(60).map(Function.call, () =>
        new Array<number>(1).map(Function.call, () => Math.random() + 36.2),
      ), // Simulate 60 random values for temperature between
      // 36.2 and 37.2 (e.g. [[36.5], [37.0], [36.8], ...])
      fields: ['C°'],
    }),
    // highlight-end
  }),
})
//tech-doc: STOP HERE
output({ temperaturesDataSample: temperaturesObservation })

//tech-doc: create heart rate datasample
const meanHeartRateObservation = new Observation({
  tags: new Set([
    new CodingReference({ type: 'LOINC', code: '43149-4', version: '2.73' }),
    // highlight-start
    new CodingReference({ type: 'LOINC', code: '41920-0', version: '2.73' }),
    new CodingReference({ type: 'LOINC', code: '41921-8', version: '2.73' }),
    // highlight-end
  ]),
  openingDate: 20220929083400,
  component: new Component({
    compoundValue: [
      // highlight-start
      oneHourMeanObservation,
      eightHourMeanObservation,
      temperaturesObservation,
      // highlight-end
    ],
  }),
})

const createdObservation = await api.observationApi.createOrModifyFor(
  patient.id,
  meanHeartRateObservation,
)
//tech-doc: STOP HERE
output({ meanHeartRateDataSample: meanHeartRateObservation, createdDataSample: createdObservation })
