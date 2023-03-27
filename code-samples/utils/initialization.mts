import os from 'os'
import console from 'console'
import { LocalStorage } from 'node-localstorage'
import { AnonymousMedTechApiBuilder, medTechApi, MedTechApi, User } from '@icure/medical-device-sdk'
import {
  host,
  password,
  password2,
  patientPassword,
  patientPrivKey,
  patientUserName,
  privKey,
  privKey2,
  userName,
  userName2,
} from './endpoint.mjs'
import { webcrypto } from 'crypto'
import { hex2ua, pkcs8ToJwk } from '@icure/api'
import { assert } from 'chai'
import { v4 as uuid } from 'uuid'
import { getLastEmail } from './msgGtw.mjs'

export function initLocalStorage() {
  const tmp = os.tmpdir()
  console.log('Saving keys in ' + tmp)
  ;(global as any).localStorage = new LocalStorage(tmp, 5 * 1024 * 1024 * 1024)
  ;(global as any).Storage = ''
}

export async function initMedTechApi(initCrypto?: boolean): Promise<MedTechApi> {
  return await initAnyMedTechApi(userName, password, privKey, initCrypto)
}

export async function initMedTechApi2(initCrypto?: boolean): Promise<MedTechApi> {
  return await initAnyMedTechApi(userName2, password2, privKey2, initCrypto)
}

export async function initPatientMedTechApi(initCrypto?: boolean): Promise<MedTechApi> {
  return await initAnyMedTechApi(patientUserName, patientPassword, patientPrivKey, initCrypto)
}

async function initAnyMedTechApi(
  username: string,
  password: string,
  privatekey: string,
  initcrypto: boolean | undefined,
): Promise<MedTechApi> {
  const api = await medTechApi()
    .withICureBaseUrl(host)
    .withUserName(username)
    .withPassword(password)
    .withCrypto(webcrypto as any)
    .build()
  if (initcrypto) {
    const loggedUser = await api.userApi.getLoggedUser()
    const loggedDataOwner = await api.cryptoApi.getDataOwner(
      api.dataOwnerApi.getDataOwnerIdOf(loggedUser),
    )
    const pubKey = api.cryptoApi.getPublicKeyFromPrivateKey(
      pkcs8ToJwk(hex2ua(privatekey)),
      loggedDataOwner.dataOwner,
    )
    await api.initUserCrypto({ publicKey: pubKey, privateKey: privatekey })
  }
  return api
}

export async function signUpUserUsingEmail(
  iCureUrl: string,
  msgGtwUrl: string,
  msgGtwSpecId: string,
  authProcessId: string,
  hcpId: string,
): Promise<{ api: MedTechApi; user: User; token: string }> {
  const builder = new AnonymousMedTechApiBuilder()
    .withICureBaseUrl(iCureUrl)
    .withMsgGwUrl(msgGtwUrl)
    .withMsgGwSpecId(msgGtwSpecId)
    .withCrypto(webcrypto as any)
    .withAuthProcessByEmailId(authProcessId)
    .withAuthProcessBySmsId(authProcessId)

  const anonymousMedTechApi = await builder.build()

  const email = `${uuid().substring(0, 8)}@icure.com`
  const process = await anonymousMedTechApi.authenticationApi.startAuthentication(
    uuid(),
    email,
    undefined,
    'Antoine',
    'Duchâteau',
    hcpId,
    false,
    8,
    'recaptcha',
  )

  const emails = await getLastEmail(email)
  const subjectCode = emails.subject!

  const result = await anonymousMedTechApi.authenticationApi.completeAuthentication(
    process!,
    subjectCode,
  )

  if (result?.medTechApi == undefined) {
    throw Error(`Couldn't sign up user by email for current test`)
  }

  const foundUser = await result.medTechApi.userApi.getLoggedUser()
  await result.medTechApi.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
    foundUser.healthcarePartyId ?? foundUser.patientId ?? foundUser.deviceId!,
    hex2ua(result.keyPairs[0].privateKey),
  )
  assert(result)
  assert(result!.token != null)
  assert(result!.userId != null)

  return { api: result.medTechApi, user: foundUser, token: result.token }
}
