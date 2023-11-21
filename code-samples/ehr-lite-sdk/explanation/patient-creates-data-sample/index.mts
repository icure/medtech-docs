import 'isomorphic-fetch'
import { webcrypto } from 'crypto'
import { host, patientId, patientPassword, patientUserName } from '../../../utils/index.mjs'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import { SimpleEHRLiteCryptoStrategies } from '@icure/ehr-lite-sdk/services/EHRLiteCryptoStrategies.js'
import { Condition, EHRLiteApi, LocalComponent, Observation } from '@icure/ehr-lite-sdk'
import { mapOf } from '@icure/typescript-common'

initLocalStorage()

//tech-doc: patient logs in
const api = await new EHRLiteApi.Builder()
  .withICureBaseUrl(host)
  .withUserName(patientUserName)
  .withPassword(patientPassword)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
  .build()
//tech-doc: STOP HERE

const patient = await api.patientApi.get(patientId)
//tech-doc: patient can create DS and HE
const condition = await api.conditionApi.createOrModify(
  new Condition({
    description: 'My period started',
  }),
  patient.id,
)

const observation = await api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    localContent: mapOf({
      en: new LocalComponent({
        stringValue: 'I have a headache',
      }),
    }),
    healthcareElementIds: [condition.id],
  }),
)
//tech-doc: STOP HERE
output({ healthcareElement: condition, dataSample: observation })
