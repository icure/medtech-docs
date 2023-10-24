import 'isomorphic-fetch'
import { host, msgGtwUrl, password, specId, userName } from '../../../utils/index.mjs'
import { webcrypto } from 'crypto'
import { initLocalStorage } from '../../../utils/index.mjs'
import { MemoryStorage, MemoryKeyStorage } from '../../../utils/memoryStorage.mjs'
import { AnonymousEHRLiteApi, EHRLiteApi } from '@icure/ehr-lite-sdk'
import { SimpleEHRLiteCryptoStrategies } from '@icure/ehr-lite-sdk/services/EHRLiteCryptoStrategies.js'

initLocalStorage()

const storage = new MemoryStorage()
const keyStorage = new MemoryKeyStorage()
const authProcessEmailId = 'AUTH_PROCESS_EMAIL_ID'
const authProcessSMSId = 'AUTH_PROCESS_SMS_ID'

//tech-doc: doctor can create api
const api = await new EHRLiteApi.Builder()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessEmailId)
  .withAuthProcessBySmsId(authProcessSMSId)
  .withStorage(storage)
  .withKeyStorage(keyStorage)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
  .build()
//tech-doc: STOP HERE

//tech-doc: doctor can create anonymous api
const anonymousApi = await new AnonymousEHRLiteApi.Builder()
  .withICureBaseUrl(host)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessEmailId)
  .withAuthProcessBySmsId(authProcessSMSId)
  .withStorage(storage)
  .withKeyStorage(keyStorage)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
  .build()
//tech-doc: STOP HERE
