import { User } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import { hex2ua, jwk2spki, pkcs8ToJwk } from '@icure/api'
import { assert } from 'chai'
import { v4 as uuid } from 'uuid'
import { getLastEmail } from '../../utils/msgGtw.mjs'
import { AnonymousEHRLiteApi, EHRLiteApi } from '@icure/ehr-lite-sdk'
import { SimpleEHRLiteCryptoStrategies } from '@icure/ehr-lite-sdk/services/EHRLiteCryptoStrategies.js'
import {
  authProcessId,
  host,
  msgGtwUrl,
  password,
  password2,
  password3,
  patientPassword,
  patientPrivKey,
  patientUserName,
  privKey,
  privKey2,
  privKey3,
  specId,
  userName,
  userName2,
  userName3,
} from '../../utils/endpoint.mjs'

export async function initEHRLiteApi(initCrypto?: boolean): Promise<EHRLiteApi> {
  return await initAnyEHRApi(userName, password, privKey, initCrypto)
}

export async function initEHRLiteApi2(initCrypto?: boolean): Promise<EHRLiteApi> {
  return await initAnyEHRApi(userName2, password2, privKey2, initCrypto)
}

export async function initEHRLiteApi3(initCrypto?: boolean): Promise<EHRLiteApi> {
  return await initAnyEHRApi(userName3, password3, privKey3, initCrypto)
}

export async function initPatientEHRLiteApi(initCrypto?: boolean): Promise<EHRLiteApi> {
  return await initAnyEHRApi(patientUserName, patientPassword, patientPrivKey, initCrypto)
}

async function initAnyEHRApi(
  username: string,
  password: string,
  privatekey: string,
  initcrypto: boolean | undefined,
): Promise<EHRLiteApi> {
  const api = await new EHRLiteApi.Builder()
    .withICureBaseUrl(host)
    .withUserName(username)
    .withPassword(password)
    .withCrypto(webcrypto as any)
    .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
    .withMsgGwUrl(msgGtwUrl)
    .withMsgGwSpecId(specId)
    .withAuthProcessByEmailId(authProcessId)
    .build()
  if (initcrypto) {
    const loggedUser = await api.userApi.getLogged()
    const loggedDataOwner = await api.dataOwnerApi.getDataOwner(
      api.dataOwnerApi.getDataOwnerIdOf(loggedUser),
    )

    const publicKeyFromPrivateKey = jwk2spki(pkcs8ToJwk(hex2ua(privatekey)))
    const foundPublicKey = [
      loggedDataOwner.dataOwner.systemMetaData.publicKey,
      ...Object.keys(loggedDataOwner.dataOwner.systemMetaData.aesExchangeKeys ?? {}),
      ...loggedDataOwner.dataOwner.systemMetaData.publicKeysForOaepWithSha256,
    ].find((x) => x === publicKeyFromPrivateKey)

    if (!!foundPublicKey) {
      return await new EHRLiteApi.Builder()
        .withICureBaseUrl(host)
        .withUserName(username)
        .withPassword(password)
        .withCrypto(webcrypto as any)
        .withCryptoStrategies(
          new SimpleEHRLiteCryptoStrategies([
            { privateKey: privatekey, publicKey: foundPublicKey },
          ]),
        )
        .withMsgGwUrl(msgGtwUrl)
        .withMsgGwSpecId(specId)
        .withAuthProcessByEmailId(authProcessId)
        .build()
    } else return api
  } else {
    return api
  }
}

export async function signUpUserUsingEmail(
  iCureUrl: string,
  msgGtwUrl: string,
  msgGtwSpecId: string,
  authProcessId: string,
  hcpId: string,
): Promise<{ api: EHRLiteApi; user: User; token: string }> {
  const builder = new AnonymousEHRLiteApi.Builder()
    .withICureBaseUrl(iCureUrl)
    .withMsgGwUrl(msgGtwUrl)
    .withMsgGwSpecId(msgGtwSpecId)
    .withCrypto(webcrypto as any)
    .withAuthProcessByEmailId(authProcessId)
    .withAuthProcessBySmsId(authProcessId)
    .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))

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
    process,
    subjectCode,
  )

  if (result?.api == undefined) {
    throw Error(`Couldn't sign up user by email for current test`)
  }

  const foundUser = await result.api.userApi.getLogged()

  assert(result)
  assert(result!.token != null)
  assert(result!.userId != null)

  return { api: result.api, user: foundUser, token: result.token }
}
