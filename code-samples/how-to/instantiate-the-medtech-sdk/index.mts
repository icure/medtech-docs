import {
  AnonymousMedTechApiBuilder,
  KeyStorageImpl,
  LocalStorageImpl,
  medTechApi,
} from '@icure/medical-device-sdk'
import { host, msgGtwUrl, password, specId, userName } from '../../utils/index.mjs'
import { webcrypto } from 'crypto'

const storage = new LocalStorageImpl()
const keyStorage = new KeyStorageImpl(storage)
const authProcessEmailId = 'AUTH_PROCESS_EMAIL_ID'
const authProcessSMSId = 'AUTH_PROCESS_SMS_ID'

//tech-doc: MedTechApi
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
  .preventCookieUsage()
  .build()
//tech-doc: STOP HERE

//tech-doc: Anonymous API
const anonymousApi = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(host)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessEmailId)
  .withAuthProcessBySmsId(authProcessSMSId)
  .withStorage(storage)
  .withKeyStorage(keyStorage)
  .preventCookieUsage()
  .build()
//tech-doc: STOP HERE
