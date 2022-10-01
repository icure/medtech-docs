import { medTechApi, MedTechApi } from '@icure/medical-device-sdk'
import { host, password, password2, privKey, privKey2, userName, userName2 } from './endpoint.mjs'
import { webcrypto } from 'crypto'
import { hex2ua } from '@icure/api'
import os from 'os'
import console from 'console'
import { LocalStorage } from 'node-localstorage'

export function initLocalStorage() {
  const tmp = os.tmpdir()
  console.log('Saving keys in ' + tmp)
  ;(global as any).localStorage = new LocalStorage(tmp, 5 * 1024 * 1024 * 1024)
  ;(global as any).Storage = ''
}

export async function initMedTechApi(initCrypto = false) {
  return await initAnyMedTechApi(userName, password, privKey, initCrypto)
}

export async function initMedTechApi2(initCrypto = false) {
  return await initAnyMedTechApi(userName2, password2, privKey2, initCrypto)
}

async function initAnyMedTechApi(
  userName: string,
  password: string,
  privKey: string,
  initCrypto = false,
): Promise<MedTechApi> {
  const api = await medTechApi()
    .withICureBasePath(host)
    .withUserName(userName)
    .withPassword(password)
    .withCrypto(webcrypto as any)
    .build()
  if (initCrypto) {
    const loggedUser = await api.userApi.getLoggedUser()
    await api!.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
      api.dataOwnerApi.getDataOwnerIdOf(loggedUser),
      hex2ua(privKey),
    )
  }
  return api
}
