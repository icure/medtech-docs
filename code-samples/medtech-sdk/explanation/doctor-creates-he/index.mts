import 'isomorphic-fetch'
import { CodingReference, HealthcareElement } from '@icure/medical-device-sdk'
import { initLocalStorage, initMedTechApi, output, patientId } from '../../utils/index.mjs'
import { expect } from 'chai'

initLocalStorage()

const api = await initMedTechApi(true)

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
output({ healthcareElement, patient })
expect(!!healthcareElement).to.eq(true) //skip
expect(healthcareElement.description).to.eq('The patient is pregnant') //skip
