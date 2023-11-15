import {
  CodingReference,
  Content,
  DataSample,
  Patient,
  TimeSeries,
  Measure,
} from '@icure/medical-device-sdk'
import 'isomorphic-fetch'

import { initLocalStorage, initMedTechApi, output } from '../../../utils/index.mjs'
import { mapOf } from '@icure/typescript-common'

initLocalStorage()

const api = await initMedTechApi(true)

//tech-doc: create a patient for datasample
const patient = await api.patientApi.createOrModify(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    note: 'Winter is coming',
  }),
)
//tech-doc: STOP HERE
output({ patient })

//tech-doc: create children dataSample one hour mean
const oneHourMeanDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '41920-0', version: '2.73' })]),
  comment: 'Heart rate 1 hour mean',
  openingDate: 20220929083400,
  content: mapOf({
    en: new Content({
      measureValue: new Measure({
        value: 72,
        unit: '{beats}/min',
        unitCodes: [new CodingReference({ type: 'UCUM', code: '{beats}/min', version: '1.2' })],
      }),
    }),
  }),
})
//tech-doc: create children dataSample eight hour mean
const eightHourMeanDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '41921-8', version: '2.73' })]),
  comment: 'Heart rate 8 hour mean',
  openingDate: 20220929083400,
  content: mapOf({
    en: new Content({
      measureValue: new Measure({
        value: 63,
        unit: '{beats}/min',
        unitCodes: [new CodingReference({ type: 'UCUM', code: '{beats}/min', version: '1.2' })],
      }),
    }),
  }),
})
//tech-doc: STOP HERE
output({ oneHourMeanDataSample, eightHourMeanDataSample })

//tech-doc: create children dataSample temperatures
const temperaturesDataSample = new DataSample({
  labels: new Set([new CodingReference({ type: 'LOINC', code: '8310-5', version: '2.73' })]),
  comment: 'Body temperature',
  openingDate: 20220929083400,
  content: mapOf({
    en: new Content({
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
  }),
})
//tech-doc: STOP HERE
output({ temperaturesDataSample })

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
  content: mapOf({
    en: new Content({
      compoundValue: [
        // highlight-start
        oneHourMeanDataSample,
        eightHourMeanDataSample,
        temperaturesDataSample,
        // highlight-end
      ],
    }),
  }),
})

const createdDataSample = await api.dataSampleApi.createOrModifyFor(
  patient.id!,
  meanHeartRateDataSample,
)
//tech-doc: STOP HERE
output({ meanHeartRateDataSample, createdDataSample })
