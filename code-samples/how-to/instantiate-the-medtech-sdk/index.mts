import 'isomorphic-fetch'
import {
  AnonymousMedTechApiBuilder,
  KeyStorageImpl,
  LocalStorageImpl,
  medTechApi,
} from '@icure/medical-device-sdk'
import {
  host,
  initLocalStorage,
  msgGtwUrl,
  password,
  specId,
  userName,
} from '../../utils/index.mjs'
import { webcrypto } from 'crypto'
import { SimpleMedTechCryptoStrategies } from '@icure/medical-device-sdk'

initLocalStorage()

const storage = new LocalStorageImpl()
const keyStorage = new KeyStorageImpl(storage)
const authProcessEmailId = 'AUTH_PROCESS_EMAIL_ID'
const authProcessSMSId = 'AUTH_PROCESS_SMS_ID'

//tech-doc: doctor can create api
const api = await medTechApi()
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
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
//tech-doc: STOP HERE

//tech-doc: doctor can create anonymous api
const anonymousApi = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(host)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessEmailId)
  .withAuthProcessBySmsId(authProcessSMSId)
  .withStorage(storage)
  .withKeyStorage(keyStorage)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
//tech-doc: STOP HERE
