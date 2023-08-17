import 'isomorphic-fetch'
import { initLocalStorage, initMedTechApi, output, password } from '../../utils/index.mjs'
import {
  AnonymousMedTechApiBuilder,
  MedTechApiBuilder,
  DataSample,
  CodingReference,
  medTechApi,
  Content,
} from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import * as process from 'process'
import { getLastEmail } from '../../utils/msgGtw.mjs'
import { expect, use as chaiUse } from 'chai'
import { NotificationTypeEnum } from '@icure/medical-device-sdk/src/models/Notification.js'
import { SimpleMedTechCryptoStrategies } from '@icure/medical-device-sdk'
import { username } from '../../quick-start/index.mjs'
import chaiAsPromised from 'chai-as-promised'
import { MemoryKeyStorage, MemoryStorage } from '../../utils/memoryStorage.mjs'
chaiUse(chaiAsPromised)

const cachedInfo = {} as { [key: string]: string }
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
  cachedInfo['pubKey'] = keyPairs[0].publicKey
  cachedInfo['privKey'] = keyPairs[0].privateKey
}

function getBackCredentials(): {
  login?: string
  token?: string
  pubKey?: string
  privKey?: string
} {
  return {
    login: cachedInfo['login'],
    token: cachedInfo['token'],
    pubKey: cachedInfo['pubKey'],
    privKey: cachedInfo['privKey'],
  }
}

//tech-doc: Get master Hcp Id
const iCureUrl = process.env.ICURE_URL
const masterHcpApi = await medTechApi()
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

const anonymousApi = await new AnonymousMedTechApiBuilder()
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
output({ authenticationResult })

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
    content: { en: new Content({ stringValue: 'Hello world' }) },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
//tech-doc: STOP HERE
output({ createdDataSample })

//tech-doc: Get back credentials
// getBackCredentials does not exist: Use your own way of storing the following data securely
// One option is to get them back from the localStorage
const { login, token, pubKey, privKey } = getBackCredentials()
//tech-doc: STOP HERE

//tech-doc: Instantiate back a MedTechApi
const reInstantiatedApi = await new MedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withUserName(login)
  .withPassword(token)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(
    new SimpleMedTechCryptoStrategies([{ publicKey: pubKey, privateKey: privKey }]),
  )
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
const anonymousApiForLogin = await new AnonymousMedTechApiBuilder()
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
output({ loginResult })

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
cachedInfo['pubKey'] = undefined
cachedInfo['privKey'] = undefined
await memoryKeyStorage.clear()

// User lost his key and logs back
const anonymousMedTechApi = await new AnonymousMedTechApiBuilder()
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

const newValidationCode = (await getLastEmail(userEmail)).subject!

//tech-doc: Complete user lost key authentication
const loginAuthResult = await anonymousMedTechApi.authenticationApi.completeAuthentication(
  loginProcess!,
  newValidationCode,
)
//tech-doc: STOP HERE

const foundUser = await loginAuthResult.medTechApi.userApi.getLoggedUser()

saveSecurely(
  userEmail,
  loginAuthResult.token,
  loginAuthResult.userId,
  loginAuthResult.groupId,
  loginAuthResult.keyPairs,
)

//tech-doc: User can create new data after loosing their key
const newlyCreatedDataSample =
  await loginAuthResult.medTechApi.dataSampleApi.createOrModifyDataSampleFor(
    foundUser.patientId,
    new DataSample({
      labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
      content: { en: new Content({ stringValue: 'Hello world' }) },
      openingDate: 20220929083400,
      comment: 'This is a comment',
    }),
  )
//tech-doc: STOP HERE
output({ newlyCreatedDataSample })

expect(newlyCreatedDataSample).to.not.be.undefined //skip

// Can access previous ones but cannot decrypt them
const oldCreatedDataSample = await loginAuthResult.medTechApi.dataSampleApi.getDataSample(
  createdDataSample.id!,
)
expect(Object.entries(oldCreatedDataSample.content ?? {})).to.be.empty

// When the delegate gave him access back
// Hcp checks dedicated notification
const hcpApi = await initMedTechApi(true)

const startTimestamp = new Date().getTime() - 100000

//tech-doc: Data owner gets all their pending notifications
const hcpNotifications = await hcpApi.notificationApi
  .getPendingNotificationsAfter(startTimestamp)
  .then((notifs) => notifs.filter((notif) => notif.type === NotificationTypeEnum.KEY_PAIR_UPDATE))
//tech-doc: STOP HERE
output({ hcpNotifications })

expect(hcpNotifications.length).to.be.greaterThan(0)

const daenaerysNotification = hcpNotifications.find(
  (notif) =>
    notif.type === NotificationTypeEnum.KEY_PAIR_UPDATE &&
    notif.properties?.find((prop) => prop.typedValue?.stringValue == daenaerysId) != undefined,
)

expect(daenaerysNotification).to.not.be.undefined //skip

//tech-doc: Give access back to a user with their new key
const daenaerysPatientId = daenaerysNotification!.properties?.find(
  (prop) => prop.id == 'dataOwnerConcernedId',
)
expect(daenaerysPatientId).to.not.be.undefined //skip
const daenaerysPatientPubKey = daenaerysNotification!.properties?.find(
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

const previousDataSample = await updatedApi.dataSampleApi.getDataSample(createdDataSample.id!)
expect(previousDataSample).to.not.be.undefined //skip
//tech-doc: STOP HERE

output({ previousDataSample })
