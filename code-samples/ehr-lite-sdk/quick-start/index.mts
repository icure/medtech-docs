import 'isomorphic-fetch'
import { initLocalStorage, output } from '../../utils/index.mjs'

initLocalStorage()

//tech-doc: instantiate the api
import 'isomorphic-fetch'
import { webcrypto } from 'crypto'
import * as process from 'process'
import { EHRLiteApi } from '@icure/ehr-lite-sdk'
import { SimpleEHRLiteCryptoStrategies } from '@icure/ehr-lite-sdk/services/EHRLiteCryptoStrategies.js'

export const host = process.env.ICURE_URL ?? 'https://kraken.icure.cloud'
export const username = process.env.ICURE_USER_NAME
export const password = process.env.ICURE_USER_PASSWORD

const api = await new EHRLiteApi.Builder()
  .withICureBaseUrl(host)
  .withUserName(username)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
  .build()

//tech-doc: get the currently logged user
const user = await api.userApi.getLogged()
//tech-doc: STOP HERE
output({ user })
