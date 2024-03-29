import 'isomorphic-fetch'
import { Content, DataSample, HealthcareElement, medTechApi } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import {
  host,
  initLocalStorage,
  output,
  patientId,
  patientPassword,
  patientUserName,
} from '../../../utils/index.mjs'
import { mapOf } from '@icure/typescript-common'
import { SimpleMedTechCryptoStrategies } from '@icure/medical-device-sdk/src/services/MedTechCryptoStrategies.js'

initLocalStorage()

//tech-doc: patient logs in
const api = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(patientUserName)
  .withPassword(patientPassword)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
//tech-doc: STOP HERE

const patient = await api.patientApi.getPatient(patientId)
//tech-doc: patient can create DS and HE
const healthcareElement = await api.healthcareElementApi.createOrModify(
  new HealthcareElement({
    description: 'My period started',
  }),
  patient.id,
)

const dataSample = await api.dataSampleApi.createOrModifyFor(
  patient.id,
  new DataSample({
    content: mapOf({
      en: new Content({
        stringValue: 'I have a headache',
      }),
    }),
    healthcareElementIds: new Set([healthcareElement.id]),
  }),
)
//tech-doc: STOP HERE
output({ healthcareElement, dataSample })
