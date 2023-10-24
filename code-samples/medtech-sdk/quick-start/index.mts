import 'isomorphic-fetch'
import { initLocalStorage, output } from '../../utils/index.mjs'

initLocalStorage()

//tech-doc: instantiate the api
import 'isomorphic-fetch'
import { webcrypto } from 'crypto'
import * as process from 'process'
import { MedTechApi, SimpleCryptoStrategies } from '@icure/medical-device-sdk'
import { SimpleMedTechCryptoStrategies } from '@icure/medical-device-sdk/src/services/MedTechCryptoStrategies.js'

export const host = process.env.ICURE_URL ?? 'https://kraken.icure.cloud'
export const username = process.env.ICURE_USER_NAME
export const password = process.env.ICURE_USER_PASSWORD

const api = await new MedTechApi.Builder()
  .withICureBaseUrl(host)
  .withUserName(username)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()

//tech-doc: get the currently logged user
const user = await api.userApi.getLoggedUser()
//tech-doc: STOP HERE
output({ user })
