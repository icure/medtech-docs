import { initLocalStorage, output } from '../../../utils/index.mjs'
//tech-doc: instantiate the api
import 'isomorphic-fetch'
import { webcrypto } from 'crypto'
import * as process from 'process'
import { expect } from 'chai'
import { EHRLiteApi } from '@icure/ehr-lite-sdk'
import { SimpleEHRLiteCryptoStrategies } from '@icure/ehr-lite-sdk/services/EHRLiteCryptoStrategies'
import { User } from '@icure/ehr-lite-sdk'

initLocalStorage() //skip

export const host = process.env.ICURE_URL ?? 'https://api.icure.cloud/rest/v1'
export const username = process.env.ICURE_USER_NAME
export const password = process.env.ICURE_USER_PASSWORD

const api = await new EHRLiteApi.Builder()
  .withICureBaseUrl(host)
  .withUserName(username)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
  .build()

//tech-doc: marshal and unmarshal the currently logged user
const user = await api.userApi.getLogged()
const marshalledUser = User.toJSON(user)
const unmarshalledUser = User.fromJSON(marshalledUser)

//tech-doc: STOP HERE
output({ user, marshalledUser, unmarshalledUser })

expect(user).to.deep.equal(unmarshalledUser)
