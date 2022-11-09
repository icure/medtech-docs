import 'isomorphic-fetch'
import { CodingReference, HealthcareElement } from '@icure/medical-device-sdk'
import { hex2ua } from '@icure/api'
import { initLocalStorage, initMedTechApi, patientId, privKey } from '../../utils/index.mjs'
import { expect } from 'chai'

initLocalStorage()

const api = await initMedTechApi()

const user = await api.userApi.getLoggedUser()
await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  user.healthcarePartyId ?? user.patientId ?? user.deviceId,
  hex2ua(privKey),
)

const patient = await api.patientApi.getPatient(patientId)

//tech-doc: doctor can create HE
const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
  new HealthcareElement({
    description: 'The patient is pregnant',
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|77386006|20020131',
        type: 'SNOMEDCT',
        code: '77386006',
        version: '20020131',
      }),
    ]),
    openingDate: new Date().getTime(),
  }),
  patient.id,
)

//tech-doc: STOP HERE
expect(!!healthcareElement).to.eq(true) //skip
expect(healthcareElement.description).to.eq('The patient is pregnant') //skip
