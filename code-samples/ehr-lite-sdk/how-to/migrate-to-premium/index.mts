import 'isomorphic-fetch'
import { host, initLocalStorage, password, userName } from '../../../utils/index.mjs'
import { webcrypto } from 'crypto'
import { EHRLiteApi } from '@icure/ehr-lite-sdk'
import { SimpleEHRLiteCryptoStrategies } from '@icure/ehr-lite-sdk/services/EHRLiteCryptoStrategies.js'

initLocalStorage()

//tech-doc: instantiate the api
const medtechApi = await new EHRLiteApi.Builder()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
  .build()
//tech-doc: end
