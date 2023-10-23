import 'isomorphic-fetch'
import { host, initLocalStorage, password, userName } from '../../../utils/index.mjs'
import { webcrypto } from 'crypto'
import { MedTechApi, SimpleCryptoStrategies } from '@icure/medical-device-sdk'

initLocalStorage()

//tech-doc: instantiate the api
const medtechApi = await new MedTechApi.Builder()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleCryptoStrategies([]))
  .build()
//tech-doc: end
