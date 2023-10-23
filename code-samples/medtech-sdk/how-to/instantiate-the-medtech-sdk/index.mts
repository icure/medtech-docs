import 'isomorphic-fetch'
import {
  AnonymousMedTechApi,
  KeyStorageImpl,
  LocalStorageImpl,
  MedTechApi,
  SimpleCryptoStrategies,
} from '@icure/medical-device-sdk'
import {
  host,
  initLocalStorage,
  msgGtwUrl,
  password,
  specId,
  userName,
} from '../../../utils/index.mjs'
import { webcrypto } from 'crypto'

initLocalStorage()

const storage = new LocalStorageImpl()
const keyStorage = new KeyStorageImpl(storage)
const authProcessEmailId = 'AUTH_PROCESS_EMAIL_ID'
const authProcessSMSId = 'AUTH_PROCESS_SMS_ID'

//tech-doc: doctor can create api
const api = await new MedTechApi.Builder()
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
  .withCryptoStrategies(new SimpleCryptoStrategies([]))
  .build()
//tech-doc: STOP HERE

//tech-doc: doctor can create anonymous api
const anonymousApi = await new AnonymousMedTechApi.Builder()
  .withICureBaseUrl(host)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessEmailId)
  .withAuthProcessBySmsId(authProcessSMSId)
  .withStorage(storage)
  .withKeyStorage(keyStorage)
  .withCryptoStrategies(new SimpleCryptoStrategies([]))
  .build()
//tech-doc: STOP HERE
