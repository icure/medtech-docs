import 'isomorphic-fetch'
import { initMedTechApi, output, password } from '../../../utils/index.mjs'
import {
  DataSample,
  CodingReference,
  medTechApi,
  Content,
  MedTechApi,
  AnonymousMedTechApi,
} from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import * as process from 'process'
import { getLastEmail } from '../../../utils/msgGtw.mjs'
import { expect, use as chaiUse } from 'chai'
import { NotificationTypeEnum } from '@icure/typescript-common'
import { username } from '../../quick-start/index.mjs'
import chaiAsPromised from 'chai-as-promised'
import { MemoryKeyStorage, MemoryStorage } from '../../../utils/memoryStorage.mjs'
import { mapOf } from '@icure/typescript-common'
import { SimpleMedTechCryptoStrategies } from '@icure/medical-device-sdk/src/services/MedTechCryptoStrategies.js'
chaiUse(chaiAsPromised)

const cachedInfo = {} as { [key: string]: string }
let cachedKeys: { privateKey: string; publicKey: string }[] = []
const uniqueId = Math.random().toString(36).substring(4)
const userEmail = `${uniqueId}-dt@got.com`

function saveSecurely(
  userLogin: string,
  userToken: string,
  userId: string,
  groupId: string,
  keyPairs: { privateKey: string; publicKey: string }[],
) {
  console.log(`Saving user ${userLogin} info`)
  cachedInfo['login'] = userLogin
  cachedInfo['token'] = userToken
  cachedInfo['userId'] = userId
  cachedInfo['groupId'] = groupId
  cachedKeys = keyPairs
}

function getBackCredentials(): {
  login: string
  token?: string
  keys: { privateKey: string; publicKey: string }[]
} {
  return {
    login: cachedInfo['login'],
    token: cachedInfo['token'],
    keys: cachedKeys,
  }
}

//tech-doc: Get master Hcp Id
const iCureUrl = process.env.ICURE_URL
const masterHcpApi = await new MedTechApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withUserName(username)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .withStorage(new MemoryStorage()) //skip
  .withKeyStorage(new MemoryKeyStorage()) //skip
  .build()
const masterUser = await masterHcpApi.userApi.getLoggedUser()
const masterHcpId = masterHcpApi.dataOwnerApi.getDataOwnerIdOf(masterUser)
//tech-doc: STOP HERE
output({ masterHcpId, masterUser })

const memoryStorage = new MemoryStorage()
const memoryKeyStorage = new MemoryKeyStorage()

//tech-doc: Instantiate AnonymousMedTech API
const msgGtwUrl = process.env.ICURE_MSG_GTW_URL
const specId = process.env.SPEC_ID
const authProcessByEmailId = process.env.AUTH_BY_EMAIL_PROCESS_ID
const authProcessBySmsId = process.env.AUTH_BY_SMS_PROCESS_ID
const recaptcha = process.env.RECAPTCHA

const anonymousApi = await new AnonymousMedTechApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .withStorage(memoryStorage) //skip
  .withKeyStorage(memoryKeyStorage) //skip
  .build()
//tech-doc: STOP HERE
output({
  anonymousApi:
    'An initialized AnonymousMedTechApi instance. ' +
    'This instance contains a authenticationApi property that can be used to start the authentication process.',
})

//tech-doc: Start Authentication Process By Email
const authProcess = await anonymousApi.authenticationApi.startAuthentication(
  recaptcha,
  userEmail, // Email address of the user who wants to register
  undefined,
  'Daenerys',
  'Targaryen',
  masterHcpId,
)
//tech-doc: STOP HERE
output({ authProcess })

const validationCode = (await getLastEmail(userEmail)).subject!

//tech-doc: Complete authentication process
const authenticationResult = await anonymousApi.authenticationApi.completeAuthentication(
  authProcess!,
  validationCode,
)

const authenticatedApi = authenticationResult.medTechApi

console.log(`Your new user id: ${authenticationResult.userId}`)
console.log(`Database id where new user was created: ${authenticationResult.groupId}`)
console.log(`Your initialised MedTechAPI: ***\${authenticatedApi}***`)
console.log(`RSA key pairs of your new user: ***\${authenticationResult.keyPairs}***`)
console.log(`Token created to authenticate your new user: ***\${authenticationResult.token}***`)
//tech-doc: STOP HERE
output({
  authenticationResult: {
    api: 'AN_INSTANCE_OF_MEDTECH_LITE_API',
    groupId: authenticationResult.groupId,
    userId: authenticationResult.userId,
    keyPairs: authenticationResult.keyPairs,
    token: authenticationResult.token,
  },
})

//tech-doc: Save credentials
// saveSecurely does not exist: Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(
  userEmail,
  authenticationResult.token,
  authenticationResult.userId,
  authenticationResult.groupId,
  authenticationResult.keyPairs,
)
//tech-doc: STOP HERE

//tech-doc: Get logged user info
const loggedUser = await authenticatedApi.userApi.getLoggedUser()
//tech-doc: STOP HERE
output({ loggedUser })

//tech-doc: Create encrypted data
const createdDataSample = await authenticatedApi.dataSampleApi.createOrModifyDataSampleFor(
  loggedUser.patientId,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: mapOf({ en: new Content({ stringValue: 'Hello world' }) }),
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
//tech-doc: STOP HERE
output({ createdDataSample })

//tech-doc: Get back credentials
// getBackCredentials does not exist: Use your own way of storing the following data securely
// One option is to get them back from the localStorage
const { login, token, keys } = getBackCredentials()
//tech-doc: STOP HERE

//tech-doc: Instantiate back a MedTechApi
const reInstantiatedApi = await new MedTechApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withUserName(login)
  .withPassword(token)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies(keys))
  .withStorage(memoryStorage) //skip
  .withKeyStorage(memoryKeyStorage) //skip
  .build()
//tech-doc: STOP HERE

//tech-doc: Get back encrypted data
const foundDataSampleAfterInstantiatingApi = await reInstantiatedApi.dataSampleApi.getDataSample(
  createdDataSample.id,
)
//tech-doc: STOP HERE
output({ foundDataSampleAfterInstantiatingApi })

//tech-doc: Login
const anonymousApiForLogin = await new AnonymousMedTechApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .withStorage(memoryStorage) //skip
  .withKeyStorage(memoryKeyStorage) //skip
  .build()

const authProcessLogin = await anonymousApiForLogin.authenticationApi.startAuthentication(
  recaptcha,
  userEmail, // The email address used for user registration
)
//tech-doc: STOP HERE
const validationCodeForLogin = (await getLastEmail(userEmail)).subject!

//tech-doc: Complete login authentication process
const loginResult = await anonymousApiForLogin.authenticationApi.completeAuthentication(
  authProcessLogin!,
  validationCodeForLogin,
)

console.log(`Your new user id: ${loginResult.userId}`)
console.log(`Database id where new user was created: ${loginResult.groupId}`)
console.log(`Your new initialised MedTechAPI: ***\${loginResult.medTechApi}***`)
console.log(`RSA key pairs of your user stays the same: ***\${loginResult.keyPairs}***`)
console.log(`The token of your user will change: ***\${loginResult.token}***`)
//tech-doc: STOP HERE
output({
  loginResult: {
    api: 'AN_INSTANCE_OF_MEDTECH_LITE_API',
    groupId: authenticationResult.groupId,
    userId: authenticationResult.userId,
    keyPairs: authenticationResult.keyPairs,
    token: authenticationResult.token,
  },
})

//tech-doc: Access back encrypted data
const loggedUserApi = loginResult.medTechApi

const foundDataSampleAfterLogin = await loggedUserApi.dataSampleApi.getDataSample(
  createdDataSample.id,
)
//tech-doc: STOP HERE
output({ foundDataSampleAfterLogin })

// User lost his key section
const daenaerysId = loggedUser.patientId
const currentPatient = await loggedUserApi.patientApi.getPatient(daenaerysId)
await loggedUserApi.patientApi.giveAccessTo(currentPatient, masterHcpId)
await loggedUserApi.dataSampleApi.giveAccessTo(createdDataSample, masterHcpId)

cachedInfo['login'] = undefined
cachedInfo['token'] = undefined
cachedInfo['userId'] = undefined
cachedInfo['groupId'] = undefined
cachedKeys = []
await memoryKeyStorage.clear()

// User lost his key and logs back
const anonymousMedTechApi = await new AnonymousMedTechApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .withStorage(new MemoryStorage()) //skip
  .withKeyStorage(new MemoryKeyStorage()) //skip
  .build()

const loginProcess = await anonymousMedTechApi.authenticationApi.startAuthentication(
  recaptcha,
  userEmail,
)

const newValidationCode = (await getLastEmail(userEmail)).subject

//tech-doc: Complete user lost key authentication
const loginAuthResult = await anonymousMedTechApi.authenticationApi.completeAuthentication(
  loginProcess,
  newValidationCode,
)
//tech-doc: STOP HERE

const foundUser = await loginAuthResult.medTechApi.userApi.getLogged()

saveSecurely(
  userEmail,
  loginAuthResult.token,
  loginAuthResult.userId,
  loginAuthResult.groupId,
  loginAuthResult.keyPairs,
)

//tech-doc: User can create new data after losing their key
const newlyCreatedDataSample = await loginAuthResult.medTechApi.dataSampleApi.createOrModifyFor(
  foundUser.patientId,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: mapOf({ en: new Content({ stringValue: 'Hello world' }) }),
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
//tech-doc: STOP HERE
output({ newlyCreatedDataSample })

expect(newlyCreatedDataSample).to.not.be.undefined //skip

// Cannot access previous ones
const retrieveOldObservationPromise = loginAuthResult.api.dataSampleApi.get(createdDataSample.id)
await expect(retrieveOldObservationPromise).to.be.rejected

// When the delegate gave him access back
// Hcp checks dedicated notification
const hcpApi = await initMedTechApi(true)

const startTimestamp = new Date().getTime() - 100000

//tech-doc: Data owner gets all their pending notifications
const hcpNotifications = await hcpApi.notificationApi
  .getPendingAfter(startTimestamp)
  .then((notifs) => notifs.filter((notif) => notif.type === NotificationTypeEnum.KeyPairUpdate))
//tech-doc: STOP HERE
output({ hcpNotifications })

expect(hcpNotifications.length).to.be.greaterThan(0)

const daenaerysNotification = hcpNotifications.find(
  (notif) =>
    notif.type === NotificationTypeEnum.KeyPairUpdate &&
    Array.from(notif.properties ?? []).find(
      (prop) => prop.typedValue?.stringValue == daenaerysId,
    ) != undefined,
)

expect(daenaerysNotification).to.not.be.undefined //skip

//tech-doc: Give access back to a user with their new key
const daenaerysPatientId = Array.from(daenaerysNotification!.properties ?? []).find(
  (prop) => prop.id == 'dataOwnerConcernedId',
)
expect(daenaerysPatientId).to.not.be.undefined //skip
const daenaerysPatientPubKey = Array.from(daenaerysNotification!.properties ?? []).find(
  (prop) => prop.id == 'dataOwnerConcernedPubKey',
)
expect(daenaerysPatientPubKey).to.not.be.undefined //skip

await hcpApi.dataOwnerApi.giveAccessBackTo(
  daenaerysPatientId!.typedValue!.stringValue!,
  daenaerysPatientPubKey!.typedValue!.stringValue!,
)
//tech-doc: STOP HERE
output({ daenaerysPatientId, daenaerysPatientPubKey })

// Then
const updatedApi = await medTechApi(loginAuthResult.medTechApi).build()

const previousDataSample = await updatedApi.dataSampleApi.get(createdDataSample.id!)
expect(previousDataSample).to.not.be.undefined //skip
//tech-doc: STOP HERE

output({ previousDataSample })
