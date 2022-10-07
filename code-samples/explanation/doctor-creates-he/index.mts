import 'isomorphic-fetch'
import { CodingReference, HealthcareElement, medTechApi } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import { hex2ua } from '@icure/api'
import { LocalStorage } from 'node-localstorage'
import { host, password, patientId, privKey, userName } from '../../utils/index.mjs'
import os from 'os'
import { expect } from 'chai'

const tmp = os.tmpdir()
;(global as any).localStorage = new LocalStorage(tmp, 5 * 1024 ** 3)
;(global as any).Storage = ''

const api = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .build()

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
