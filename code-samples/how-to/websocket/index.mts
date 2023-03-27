import {
  CodingReference,
  Content,
  DataSample,
  DataSampleFilter,
  medTechApi,
  Patient,
} from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import { hex2ua, sleep } from '@icure/api'
import { host, userName, password, privKey, initLocalStorage } from '../../utils/index.mjs'
import 'isomorphic-fetch'

initLocalStorage()

const api = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .build()

const loggedUser = await api.userApi.getLoggedUser()
await api!.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  loggedUser.healthcarePartyId!,
  hex2ua(privKey),
)

//tech-doc: can listen to dataSample events
const events: DataSample[] = []
const statuses: string[] = []

const connection = (
  await api.dataSampleApi.subscribeToDataSampleEvents(
    ['CREATE'], // Event types to listen to
    await new DataSampleFilter()
      .forDataOwner(loggedUser.healthcarePartyId!)
      .byLabelCodeDateFilter('IC-TEST', 'TEST')
      .build(),
    async (ds) => {
      events.push(ds)
    },
    {}, // Options
  )
)
  .onConnected(() => statuses.push('CONNECTED'))
  .onClosed(() => statuses.push('CLOSED'))

//tech-doc: STOP HERE

//tech-doc: create a patient for websocket
const patient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    note: 'Winter is coming',
  }),
)
//tech-doc: STOP HERE

//tech-doc: create a dataSample for websocket
await api.dataSampleApi.createOrModifyDataSampleFor(
  patient.id!,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: new Content({ stringValue: 'Hello world' }) },
  }),
)
//tech-doc: STOP HERE

await sleep(2000)
//tech-doc: close the connection
connection.close()
//tech-doc: STOP HERE
await sleep(5000)