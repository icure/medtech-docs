import 'isomorphic-fetch'
import { host, initLocalStorage, password, userName } from '../../../utils/index.mjs'
import { webcrypto } from 'crypto'
import { MedTechApi } from '@icure/medical-device-sdk'
import { SimpleMedTechCryptoStrategies } from '@icure/medical-device-sdk/src/services/MedTechCryptoStrategies.js'

initLocalStorage()

//tech-doc: instantiate the api
const medtechApi = await new MedTechApi.Builder()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
//tech-doc: end
