import 'isomorphic-fetch'
import { medTechApi, SimpleMedTechCryptoStrategies } from '@icure/medical-device-sdk'
import { host, initLocalStorage, password, userName } from '../../utils/index.mjs'
import { webcrypto } from 'crypto'

initLocalStorage()

//tech-doc: instantiate the api
const medtechApi = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
//tech-doc: end
