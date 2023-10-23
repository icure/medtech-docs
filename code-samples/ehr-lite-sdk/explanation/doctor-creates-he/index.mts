import 'isomorphic-fetch'
import { initEHRLiteApi, patientId } from '../../utils/index.mjs'
import { expect } from 'chai'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import { Condition } from '@icure/ehr-lite-sdk'
import { CodingReference } from '@icure/typescript-common'

initLocalStorage()

const api = await initEHRLiteApi(true)

const patient = await api.patientApi.get(patientId)

//tech-doc: doctor can create HE
const condition = await api.conditionApi.createOrModify(
  new Condition({
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
output({ condition: condition, patient })
expect(!!condition).to.eq(true) //skip
expect(condition.description).to.eq('The patient is pregnant') //skip
