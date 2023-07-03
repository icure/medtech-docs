import 'isomorphic-fetch'
import * as process from 'process'
import { initLocalStorage, initMedTechApi } from './initialization.mjs'
import {
  HealthcareProfessional,
  Patient,
  SystemMetaDataOwner,
  ua2hex,
  User,
} from '@icure/medical-device-sdk'
import { CryptoStrategies, DataOwnerWithType, IcureApi } from '@icure/api'
import { CryptoPrimitives } from '@icure/api/icc-x-api/crypto/CryptoPrimitives'
import { KeyPair } from '@icure/api/icc-x-api/crypto/RSA'
import { CryptoActorStubWithType } from '@icure/api/icc-api/model/CryptoActorStub'
import { webcrypto } from 'crypto'
import { v4 as uuid } from 'uuid'

function requireDefined(s: string, name: string): string {
  if (!s) {
    throw Error(`${name} is not defined or empty.`)
  }
  return s
}

export async function createPatientUser() {
  initLocalStorage()
  const hcpApi = await initMedTechApi(true)
  const userLogin = `pat-${uuid().substring(0, 6)}@icure.com`
  const rawPatient = new Patient({
    id: uuid(),
    firstName: uuid().substring(0, 6),
    lastName: uuid().substring(0, 6),
  })
  const patient = await hcpApi.patientApi.createOrModifyPatient(rawPatient)
  const patientUser = await hcpApi.userApi.createOrModifyUser(
    new User({
      id: uuid(),
      name: uuid().substring(0, 6),
      login: userLogin,
      email: userLogin,
      patientId: patient.id,
    }),
  )
  const token = await hcpApi.userApi.createToken(patientUser.id!, 365 * 24 * 60 * 60)

  const { publicKey: newPublicKey, privateKey: newPrivateKey } =
    await hcpApi.cryptoApi.primitives.RSA.generateKeyPair()

  const publicKeyHex = ua2hex(await hcpApi.cryptoApi.primitives.RSA.exportKey(newPublicKey, 'spki'))
  const privateKeyHex = ua2hex(
    await hcpApi.cryptoApi.primitives.RSA.exportKey(newPrivateKey, 'pkcs8'),
  )
  const cryptoStrategies: CryptoStrategies = {
    generateNewKeyForDataOwner(
      self: DataOwnerWithType,
      cryptoPrimitives: CryptoPrimitives,
    ): Promise<KeyPair<CryptoKey> | boolean> {
      return Promise.resolve({ publicKey: newPublicKey, privateKey: newPrivateKey })
    },
    recoverAndVerifySelfHierarchyKeys(
      keysData: {
        dataOwner: DataOwnerWithType
        unknownKeys: string[]
        unavailableKeys: string[]
      }[],
      cryptoPrimitives: CryptoPrimitives,
    ): Promise<{
      [p: string]: {
        recoveredKeys: { [p: string]: KeyPair<CryptoKey> }
        keyAuthenticity: { [p: string]: boolean }
      }
    }> {
      return Promise.resolve(
        Object.fromEntries(
          keysData.map((x) => [
            x.dataOwner.dataOwner.id!,
            { recoveredKeys: {}, keyAuthenticity: {} },
          ]),
        ),
      )
    },
    verifyDelegatePublicKeys(
      delegate: CryptoActorStubWithType,
      publicKeys: string[],
      cryptoPrimitives: CryptoPrimitives,
    ): Promise<string[]> {
      return Promise.resolve(publicKeys)
    },
  }

  await IcureApi.initialise(
    host,
    { username: userLogin, password: token },
    cryptoStrategies,
    webcrypto as any,
  ) // Initializes keys for the patient
  const updatedPatient = await hcpApi.patientApi.getPatient(patient.id!)
  await hcpApi.patientApi.giveAccessTo(updatedPatient, updatedPatient.id!)
  return {
    user: patientUser.login!,
    dataOwnerId: patient.id!,
    password: token,
    publicKey: publicKeyHex,
    privateKey: privateKeyHex,
  }
}

export async function createHcpUser() {
  const hcpApi = await initMedTechApi(true)
  const userLogin = `hcp-${uuid().substring(0, 6)}@icure.com`
  const { publicKey: newPublicKey, privateKey: newPrivateKey } =
    await hcpApi.cryptoApi.primitives.RSA.generateKeyPair()

  const publicKeyHex = ua2hex(await hcpApi.cryptoApi.primitives.RSA.exportKey(newPublicKey, 'spki'))
  const privateKeyHex = ua2hex(
    await hcpApi.cryptoApi.primitives.RSA.exportKey(newPrivateKey, 'pkcs8'),
  )

  const hcp = await hcpApi.healthcareProfessionalApi.createOrModifyHealthcareProfessional(
    new HealthcareProfessional({
      id: uuid(),
      firstName: uuid().substring(0, 6),
      lastName: uuid().substring(0, 6),
      systemMetaData: new SystemMetaDataOwner({
        publicKey: publicKeyHex,
      }),
    }),
  )
  const hcpUser = await hcpApi.userApi.createOrModifyUser(
    new User({
      id: uuid(),
      name: userLogin,
      login: userLogin,
      email: userLogin,
      healthcarePartyId: hcp.id,
    }),
  )
  const token = await hcpApi.userApi.createToken(hcpUser.id!, 365 * 24 * 60 * 60)
  return {
    user: hcpUser.login!,
    dataOwnerId: hcp.id!,
    password: token,
    publicKey: publicKeyHex,
    privateKey: privateKeyHex,
  }
}

export const password = requireDefined(process.env.ICURE_USER_PASSWORD, 'ICURE_USER_PASSWORD')
export const userName = requireDefined(process.env.ICURE_USER_NAME, 'ICURE_USER_NAME')
export const privKey = requireDefined(process.env.ICURE_USER_PRIV_KEY, 'ICURE_USER_PRIV_KEY')
export const host = requireDefined(process.env.ICURE_URL, 'ICURE_URL')
export const msgGtwUrl = requireDefined(process.env.ICURE_MSG_GTW_URL, 'ICURE_MSG_GTW_URL')
export const specId = requireDefined(process.env.SPEC_ID, 'SPEC_ID')
export const authProcessId = requireDefined(process.env.AUTH_PROCESS_ID, 'AUTH_PROCESS_ID')

let patientIdFallback = process.env.ICURE_PATIENT_ID
let patientUsernameFallback = process.env.ICURE_PATIENT_USER_NAME
let patientPasswordFallback = process.env.ICURE_PATIENT_PASSWORD
let patientPrivateKeyFallback = process.env.ICURE_PATIENT_PRIV_KEY

if (
  !patientIdFallback ||
  !patientUsernameFallback ||
  !patientPasswordFallback ||
  !patientPrivateKeyFallback
) {
  const user = await createPatientUser()
  patientIdFallback = user.dataOwnerId
  patientUsernameFallback = user.user
  patientPasswordFallback = user.password
  patientPrivateKeyFallback = user.privateKey
}

export const patientId = patientIdFallback
export const patientUserName = patientUsernameFallback
export const patientPassword = patientPasswordFallback
export const patientPrivKey = patientPrivateKeyFallback

let hcp2UsernameFallback = process.env.ICURE_USER2_NAME
let hcp2PasswordFallback = process.env.ICURE_USER2_PASSWORD
let hcp2PrivateKeyFallback = process.env.ICURE_USER2_PRIV_KEY

if (!hcp2UsernameFallback || !hcp2PasswordFallback || !hcp2PrivateKeyFallback) {
  const user = await createHcpUser()
  hcp2UsernameFallback = user.user
  hcp2PasswordFallback = user.password
  hcp2PrivateKeyFallback = user.privateKey
}

export const password2 = hcp2PasswordFallback
export const userName2 = hcp2UsernameFallback
export const privKey2 = hcp2PrivateKeyFallback
