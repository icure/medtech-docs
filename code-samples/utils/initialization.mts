import os from 'os'
import console from 'console'
import { LocalStorage } from 'node-localstorage'
import { medTechApi, MedTechApi } from '@icure/medical-device-sdk'
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
    const loggedDataOwner = await api.cryptoApi.getDataOwner(api.dataOwnerApi.getDataOwnerIdOf(loggedUser))
    const pubKey = api.cryptoApi.getPublicKeyFromPrivateKey(pkcs8ToJwk(hex2ua(privatekey)), loggedDataOwner.dataOwner)
    await api.initUserCrypto(false, { publicKey: pubKey, privateKey: privatekey})
  }
  return api
}
