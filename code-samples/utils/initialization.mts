import os from 'os'
import console from 'console'
import { LocalStorage } from 'node-localstorage'
import { medTechApi, MedTechApi } from '@icure/medical-device-sdk'
import { host, password, userName } from './endpoint.mjs'
import { webcrypto } from 'crypto'

export function initLocalStorage() {
  const tmp = os.tmpdir()
  console.log('Saving keys in ' + tmp)
  ;(global as any).localStorage = new LocalStorage(tmp, 5 * 1024 * 1024 * 1024)
  ;(global as any).Storage = ''
}

export async function initMedTechApi(): Promise<MedTechApi> {
  return await medTechApi()
    .withICureBasePath(host)
    .withUserName(userName)
    .withPassword(password)
    .withCrypto(webcrypto as any)
    .build()
}
