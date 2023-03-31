//tech-doc: instantiate the api
import 'isomorphic-fetch'
import { medTechApi, User } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import * as process from 'process'
import { output } from '../../utils/index.mjs'
import { expect } from 'chai'

export const host = process.env.ICURE_URL ?? 'https://api.icure.cloud/rest/v1'
export const username = process.env.ICURE_USER_NAME
export const password = process.env.ICURE_USER_PASSWORD

console.log(host) //skip

const api = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(username)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .build()

//tech-doc: marshal and unmarshal the currently logged user
const user = await api.userApi.getLoggedUser()
const marshalledUser = user.marshal()
const unmarshalledUser = new User(marshalledUser)

//tech-doc: STOP HERE
output({ user, marshalledUser, unmarshalledUser })

expect(user).to.deep.equal(unmarshalledUser)
