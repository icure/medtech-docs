import 'isomorphic-fetch'
import { Content, DataSample, HealthcareElement, medTechApi } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import { hex2ua } from '@icure/api'
import {
  host,
  initLocalStorage,
  output,
  patientId,
  patientPassword,
  patientPrivKey,
  patientUserName,
} from '../../utils/index.mjs'

initLocalStorage()

//tech-doc: patient logs in
const api = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(patientUserName)
  .withPassword(patientPassword)
  .withCrypto(webcrypto as any)
  .build()

const user = await api.userApi.getLoggedUser()
await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(user.patientId, hex2ua(patientPrivKey))
//tech-doc: STOP HERE

const patient = await api.patientApi.getPatient(patientId)
//tech-doc: patient can create DS and HE
const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'My period started',
  }),
  patient.id,
)

const dataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id,
  new DataSample({
    content: {
      en: new Content({
        stringValue: 'I have a headache',
      }),
    },
    healthcareElementIds: new Set([healthcareElement.id]),
  }),
)
//tech-doc: STOP HERE
output({ healthcareElement, dataSample })
