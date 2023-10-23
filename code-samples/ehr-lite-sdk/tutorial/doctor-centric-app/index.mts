import {initLocalStorage, output} from '../../../utils/index.mjs'
import {expect} from 'chai'
//tech-doc: instantiate the api with existing keys
import 'isomorphic-fetch'
import {webcrypto} from 'crypto'
//tech-doc: create your first patient
import {EHRLiteApi, LocalComponent, Observation, Patient, CodingReference, ObservationFilter} from '@icure/ehr-lite-sdk'
//tech-doc: create your patient first medical data
//tech-doc: Find your patient medical data following some criteria
import {SimpleEHRLiteCryptoStrategies} from "@icure/ehr-lite-sdk/services/EHRLiteCryptoStrategies";
import {GenderEnum} from "@icure/ehr-lite-sdk/models/enums/Gender.enum";
import {mapOf} from "@icure/typescript-common";

initLocalStorage()

const iCureHost = process.env.ICURE_URL!
const iCureUserPassword = process.env.ICURE_USER_PASSWORD!
const iCureUserLogin = process.env.ICURE_USER_NAME!
const iCureUserPubKey = process.env.ICURE_USER_PUB_KEY!
const iCureUserPrivKey = process.env.ICURE_USER_PRIV_KEY!

const apiWithKeys = await new EHRLiteApi.Builder()
  .withICureBaseUrl(iCureHost)
  .withUserName(iCureUserLogin)
  .withPassword(iCureUserPassword)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(
    new SimpleEHRLiteCryptoStrategies([
      { publicKey: iCureUserPubKey, privateKey: iCureUserPrivKey },
    ]),
  )
  .build()
//tech-doc: STOP HERE

//tech-doc: instantiate api without keys
const apiWithoutKeys = await new EHRLiteApi.Builder()
  .withICureBaseUrl(iCureHost)
  .withUserName(iCureUserLogin)
  .withPassword(iCureUserPassword)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
  .build()
//tech-doc: STOP HERE

const api = apiWithKeys

//tech-doc: get current user
const loggedUser = await api.userApi.getLogged()
expect(loggedUser.login).to.be.equal(iCureUserLogin)
//tech-doc: STOP HERE
output({ loggedUser })

const createdPatient = await api.patientApi.createOrModify(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    gender: GenderEnum.MALE
  }),
)
console.log(`Your new patient id : ${createdPatient.id}`)
//tech-doc: STOP HERE
output({ createdPatient })

//tech-doc: get your patient information
const johnSnow = await api.patientApi.get(createdPatient.id)
expect(createdPatient.id).to.be.equal(johnSnow.id)
//tech-doc: STOP HERE
output({ johnSnow })

const createdData = await api.observationApi.createOrModifyManyFor(johnSnow.id, [
  new Observation({
    tags: new Set([new CodingReference({ type: 'LOINC', code: '29463-7', version: '2' })]),
    localContent: mapOf({ en: new LocalComponent({ numberValue: 92.5 }) }),
    valueDate: 20220203111034,
  }),
  new Observation({
    tags: new Set([new CodingReference({ type: 'LOINC', code: '8302-2', version: '2' })]),
    localContent: mapOf({ en: new LocalComponent({ numberValue: 187 }) }),
    valueDate: 20220203111034
  }),
])
//tech-doc: STOP HERE
output({ createdData })

const johnData = await api.observationApi.filterBy(
  await new ObservationFilter(api)
    .forDataOwner(api.dataOwnerApi.getDataOwnerIdOf(loggedUser))
    .forPatients([johnSnow])
    .byLabelCodeDateFilter('LOINC', '29463-7')
    .build(),
)

expect(johnData.rows.length).to.be.equal(1)
expect(johnData.rows[0].localContent['en'].numberValue).to.be.equal(92.5)
//tech-doc: STOP HERE
output({ johnData })

//tech-doc: get specific medical data information
const johnWeight = await api.observationApi.get(johnData.rows[0].id)
expect(johnData.rows[0].id).to.be.equal(johnWeight.id)
expect(johnWeight.localContent['en'].numberValue).to.be.equal(92.5)
//tech-doc: STOP HERE
output({ johnWeight })
