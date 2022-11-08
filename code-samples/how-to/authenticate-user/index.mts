import 'isomorphic-fetch'
import { initLocalStorage, initMedTechApi } from '../../utils/index.mjs'
import { AnonymousMedTechApiBuilder, MedTechApiBuilder, DataSample, CodingReference, medTechApi } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import * as process from 'process'
import { getLastEmail } from '../../utils/msgGtw.mjs'
import { expect } from 'chai';
import { NotificationTypeEnum } from '@icure/medical-device-sdk/src/models/Notification.js';

const cachedInfo = {} as { [key: string]: string }
const uniqueId = Math.random().toString(36).substring(4)
const userEmail = `${uniqueId}-dt@got.com`

function saveSecurely(
  userLogin: string,
  userToken: string,
  userId: string,
  groupId: string,
  keyPair: { privateKey: string; publicKey: string },
) {
  console.log(`Saving user ${userLogin} info`)
  cachedInfo['login'] = userLogin
  cachedInfo['token'] = userToken
  cachedInfo['userId'] = userId
  cachedInfo['groupId'] = groupId
  cachedInfo['pubKey'] = keyPair.publicKey
  cachedInfo['privKey'] = keyPair.privateKey
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

initLocalStorage()

//tech-doc: Get master Hcp Id
const masterHcpApi = await initMedTechApi()
const masterUser = await masterHcpApi.userApi.getLoggedUser()
const masterHcpId = masterHcpApi.dataOwnerApi.getDataOwnerIdOf(masterUser)
//tech-doc: STOP HERE

//tech-doc: Instantiate AnonymousMedTech API
const iCureUrl = process.env.ICURE_URL
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
  .build()
//tech-doc: STOP HERE

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

const validationCode = (await getLastEmail(userEmail)).subject!
console.log('Validation code is ', validationCode)

//tech-doc: Complete authentication process
const authenticationResult = await anonymousApi.authenticationApi.completeAuthentication(
  authProcess!,
  validationCode,
  () => anonymousApi.generateRSAKeypair(), // Generate an RSA Keypair for the user
)

const authenticatedApi = authenticationResult.medTechApi

console.log(`Your new user id: ${authenticationResult.userId}`)
console.log(`Database id where new user was created: ${authenticationResult.groupId}`)
console.log(`Your initialised MedTechAPI: ***\${authenticatedApi}***`)
console.log(`RSA keypair of your new user: ***\${authenticationResult.keyPair}***`)
console.log(`Token created to authenticate your new user: ***\${authenticationResult.token}***`)
//tech-doc: STOP HERE

//tech-doc: Save credentials
// saveSecurely does not exist: Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(
  userEmail,
  authenticationResult.token,
  authenticationResult.userId,
  authenticationResult.groupId,
  authenticationResult.keyPair,
)
//tech-doc: STOP HERE

//tech-doc: Get logged user info
const loggedUser = await authenticatedApi.userApi.getLoggedUser()
//tech-doc: STOP HERE

console.log('Logged User: ', JSON.stringify(loggedUser))

//tech-doc: Create encrypted data
const createdDataSample = await authenticatedApi.dataSampleApi.createOrModifyDataSampleFor(
  loggedUser.patientId,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: 'Hello world' } },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)
//tech-doc: STOP HERE

console.log('Created data sample: ', JSON.stringify(createdDataSample))

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
  .build()

await reInstantiatedApi.initUserCrypto(false, { publicKey: pubKey, privateKey: privKey })
//tech-doc: STOP HERE

//tech-doc: Get back encrypted data
const foundDataSampleAfterInstantiatingApi = await reInstantiatedApi.dataSampleApi.getDataSample(createdDataSample.id)
//tech-doc: STOP HERE

console.log(
  'Found patient after re-instantiating api',
  JSON.stringify(foundDataSampleAfterInstantiatingApi),
)

//tech-doc: Login
const anonymousApiForLogin = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .build()

const authProcessLogin = await anonymousApiForLogin.authenticationApi.startAuthentication(
  recaptcha,
  userEmail, // The email address used for user registration
)
//tech-doc: STOP HERE

const validationCodeForLogin = (await getLastEmail(userEmail)).subject!
console.log('Validation code is ', validationCodeForLogin)

//tech-doc: Complete login authentication process
const loginResult = await anonymousApiForLogin.authenticationApi.completeAuthentication(
  authProcessLogin!,
  validationCodeForLogin,
  () => {
    const userInfo = getBackCredentials()
    if (userInfo.pubKey != undefined && userInfo.privKey != undefined) {
      return Promise.resolve({ privateKey: userInfo.privKey, publicKey: userInfo.pubKey })
    } else {
      // You can't find back the user's RSA Keypair: You need to generate a new one
      return anonymousApiForLogin.generateRSAKeypair()
    }
  },
)

console.log(`Your new user id: ${loginResult.userId}`)
console.log(`Database id where new user was created: ${loginResult.groupId}`)
console.log(`Your new initialised MedTechAPI: ***\${loginResult.medTechApi}***`)
console.log(`RSA keypair of your user stays the same: ***\${loginResult.keyPair}***`)
console.log(`The token of your user will change: ***\${loginResult.token}***`)
//tech-doc: STOP HERE

//tech-doc: Access back encrypted data
const loggedUserApi = loginResult.medTechApi

const foundDataSampleAfterLogin = await loggedUserApi.dataSampleApi.getDataSample(createdDataSample.id)
//tech-doc: STOP HERE

console.log('Found Data Sample after login: ', JSON.stringify(foundDataSampleAfterLogin))


// User lost his key section
const daenaerysId = loggedUser.patientId
const currentPatient = await loggedUserApi.patientApi.getPatient(daenaerysId)
await loggedUserApi.patientApi.giveAccessTo(currentPatient, masterHcpId)
await loggedUserApi.dataSampleApi.giveAccessTo(createdDataSample, masterHcpId)

//tech-doc: User lost their private key
// User lost his key and logs back
const anonymousMedTechApi = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .build()

const loginProcess = await anonymousMedTechApi.authenticationApi.startAuthentication(
  recaptcha,
  userEmail
)

const subjectCode = (await getLastEmail(userEmail)).subject!
const loginAuthResult = await anonymousMedTechApi.authenticationApi.completeAuthentication(loginProcess!, subjectCode, () =>
  anonymousMedTechApi.generateRSAKeypair()
)

const foundUser = await loginAuthResult.medTechApi.userApi.getLoggedUser()

saveSecurely(
  userEmail,
  loginAuthResult.token,
  loginAuthResult.userId,
  loginAuthResult.groupId,
  loginAuthResult.keyPair,
)

// User can create new data
const newlyCreatedDataSample = await loginAuthResult.medTechApi.dataSampleApi.createOrModifyDataSampleFor(
  foundUser.patientId,
  new DataSample({
    labels: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    content: { en: { stringValue: 'Hello world' } },
    openingDate: 20220929083400,
    comment: 'This is a comment',
  }),
)

expect(newlyCreatedDataSample).to.not.be.undefined // skip

// But can't access previous ones
try {
  await loginAuthResult.medTechApi.dataSampleApi.getDataSample(createdDataSample.id!)
  expect(true).to.be.equal(
    false,
    "Patient should not be able to get access to his previous data, as his new key can't decrypt corresponding AES Exchange keys"
  )
} catch (e: any) {
  expect(e.message).to.not.be.empty
}

// When the delegate gave him access back
// Hcp checks dedicated notification
const hcpApi = await initMedTechApi(true)

const startTimestamp = new Date().getTime() - 100000
const hcpNotifications = await hcpApi.notificationApi.getPendingNotificationsAfter(startTimestamp)
expect(hcpNotifications.length).to.not.be.undefined

const hcpNotification = hcpNotifications.find(
  (notif) =>
    notif.type === NotificationTypeEnum.KEY_PAIR_UPDATE &&
    notif.properties?.find((prop) => prop.typedValue?.stringValue == daenaerysId) != undefined
)

expect(hcpNotification).to.not.be.undefined // skip

const patientId = hcpNotification!.properties?.find((prop) => prop.id == 'dataOwnerConcernedId')
expect(patientId).to.not.be.undefined // skip
const patientPubKey = hcpNotification!.properties?.find((prop) => prop.id == 'dataOwnerConcernedPubKey')
expect(patientPubKey).to.not.be.undefined // skip

const accessBack = await hcpApi.dataOwnerApi.giveAccessBackTo(
  patientId!.typedValue!.stringValue!,
  patientPubKey!.typedValue!.stringValue!
)
expect(accessBack).to.be.true // skip

// Then
const updatedApi = await medTechApi(loginAuthResult.medTechApi).build()
await updatedApi.initUserCrypto(false, loginAuthResult.keyPair)

const previousDataSample = await updatedApi.dataSampleApi.getDataSample(createdDataSample.id!)
expect(previousDataSample).to.not.be.undefined // skip
//tech-doc: STOP HERE
