import 'isomorphic-fetch'
import { CodingReference, mapOf } from '@icure/typescript-common'
import { initEHRLiteApi } from '../../utils/index.mjs'
import { patientId } from '../../../utils/index.mjs'
import { expect } from 'chai'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import { Condition, LocalComponent, Observation } from '@icure/ehr-lite-sdk'

initLocalStorage()

const api = await initEHRLiteApi(true)
const patient = await api.patientApi.get(patientId)

//tech-doc: doctor can create DS and HE
const condition = await api.conditionApi.createOrModify(
  new Condition({
    description: 'My diagnosis is that the patient has Hay Fever',
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|21719001|20020131',
        type: 'SNOMEDCT',
        code: '21719001',
        version: '20020131',
      }),
    ]),
  }),
  patient.id,
)
expect(!!condition).to.eq(true) //skip
expect(condition.description).to.eq('My diagnosis is that the patient has Hay Fever') //skip
const observation = await api.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    localContent: mapOf({
      en: new LocalComponent({
        stringValue: 'The patient has fatigue',
      }),
    }),
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|84229001|20020131',
        type: 'SNOMEDCT',
        code: '84229001',
        version: '20020131',
      }),
    ]),
    healthcareElementIds: [condition.id],
  }),
)

//tech-doc: STOP HERE
output({ healthcareElement: condition, dataSample: observation })
expect(!!observation).to.eq(true) //skip
