import { initLocalStorage, output } from '../../utils/index.mjs'
import { expect } from 'chai'

initLocalStorage()

//tech-doc: instantiate the api
import 'isomorphic-fetch'
import { medTechApi } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'

const iCureHost = process.env.ICURE_URL!
const iCureUserPassword = process.env.ICURE_USER_PASSWORD!
const iCureUserLogin = process.env.ICURE_USER_NAME!

const api = await medTechApi()
  .withICureBaseUrl(iCureHost)
  .withUserName(iCureUserLogin)
  .withPassword(iCureUserPassword)
  .withCrypto(webcrypto as any)
  .build()
//tech-doc: STOP HERE

//tech-doc: init user crypto
await api.initUserCrypto()
//tech-doc: STOP HERE

//tech-doc: init user crypto with existing key
const iCureUserPubKey = process.env.ICURE_USER_PUB_KEY!
const iCureUserPrivKey = process.env.ICURE_USER_PRIV_KEY!
await api.initUserCrypto({ publicKey: iCureUserPubKey, privateKey: iCureUserPrivKey })
//tech-doc: STOP HERE

//tech-doc: get current user
const loggedUser = await api.userApi.getLoggedUser()
expect(loggedUser.login).to.be.equal(iCureUserLogin)
//tech-doc: STOP HERE
output({ loggedUser })

//tech-doc: create your first patient
import { Patient } from '@icure/medical-device-sdk'

const createdPatient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    gender: 'male',
    note: 'Winter is coming',
  }),
)
console.log(`Your new patient id : ${createdPatient.id}`)
//tech-doc: STOP HERE
output({ createdPatient })

//tech-doc: get your patient information
const johnSnow = await api.patientApi.getPatient(createdPatient.id)
expect(createdPatient.id).to.be.equal(johnSnow.id)
//tech-doc: STOP HERE
output({ johnSnow })

//tech-doc: create your patient first medical data
import { CodingReference, Content, DataSample } from '@icure/medical-device-sdk'

const createdData = await api.dataSampleApi.createOrModifyDataSamplesFor(johnSnow.id, [
  new DataSample({
    labels: new Set([new CodingReference({ type: 'LOINC', code: '29463-7', version: '2' })]),
    content: { en: new Content({ numberValue: 92.5 }) },
    valueDate: 20220203111034,
    comment: 'Weight',
  }),
  new DataSample({
    labels: new Set([new CodingReference({ type: 'LOINC', code: '8302-2', version: '2' })]),
    content: { en: new Content({ numberValue: 187 }) },
    valueDate: 20220203111034,
    comment: 'Height',
  }),
])
//tech-doc: STOP HERE
output({ createdData })

//tech-doc: Find your patient medical data following some criteria
import { DataSampleFilter } from '@icure/medical-device-sdk'

const johnData = await api.dataSampleApi.filterDataSample(
  await new DataSampleFilter()
    .forDataOwner(api.dataOwnerApi.getDataOwnerIdOf(loggedUser))
    .forPatients(api.cryptoApi, [johnSnow])
    .byLabelCodeDateFilter('LOINC', '29463-7')
    .build(),
)

expect(johnData.rows.length).to.be.equal(1)
expect(johnData.pageSize).to.be.equal(1)
expect(johnData.rows[0].content['en'].numberValue).to.be.equal(92.5)
expect(johnData.rows[0].comment).to.be.equal('Weight')
//tech-doc: STOP HERE
output({ johnData })

//tech-doc: get specific medical data information
const johnWeight = await api.dataSampleApi.getDataSample(johnData.rows[0].id)
expect(johnData.rows[0].id).to.be.equal(johnWeight.id)
expect(johnWeight.content['en'].numberValue).to.be.equal(92.5)
expect(johnWeight.comment).to.be.equal('Weight')
//tech-doc: STOP HERE
output({ johnWeight })
