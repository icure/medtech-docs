import 'isomorphic-fetch'
import { initLocalStorage, initMedTechApi } from '../../utils/index.mjs';
import { Patient, AnonymousMedTechApiBuilder, ua2hex, MedTechApiBuilder } from '@icure/medical-device-sdk';
import { webcrypto } from 'crypto';
import * as process from 'process';
import { getLastEmail } from '../../utils/msgGtw.mjs';

const cachedInfo = {} as { [key: string]: string }
const uniqueId = Math.random().toString(36).substring(4)
const userEmail = `${uniqueId}-dt@got.com`

function saveSecurely(userLogin: string, userToken: string, userId: string, groupId: string, keyPair: [string, string]) {
  console.log(`Saving user ${userLogin} info`)
  cachedInfo['login'] = userLogin
  cachedInfo['token'] = userToken
  cachedInfo['userId'] = userId
  cachedInfo['groupId'] = groupId
  cachedInfo['pubKey'] = keyPair[1]
  cachedInfo['privKey'] = keyPair[0]
}

function getBackCredentials(): { login: string, token: string, pubKey: string, privKey: string } {
  return {
    login: cachedInfo['login'],
    token: cachedInfo['token'],
    pubKey: cachedInfo['pubKey'],
    privKey: cachedInfo['privKey']
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
const recaptcha = process.env.RECAPTCHA_ID

const anonymousApi = await new AnonymousMedTechApiBuilder()
  .withICureUrlPath(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGtwUrl(msgGtwUrl)
  .withMsgGtwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .build()
//tech-doc: STOP HERE

//tech-doc: Start Authentication Process By Email
const authProcess = await anonymousApi.authenticationApi.startAuthentication(
  masterHcpId,
  'Daenerys',
  'Targaryen',
  recaptcha,
  false,
  userEmail // Email address of the user who wants to register
)
//tech-doc: STOP HERE

const validationCode = (await getLastEmail(userEmail)).subject!
console.log('Validation code is ', validationCode)

//tech-doc: Generate an RSA Keypair for the user
const keyPair = await anonymousApi.cryptoApi.RSA.generateKeyPair()
const userPublicKey = ua2hex(await anonymousApi.cryptoApi.RSA.exportKey(keyPair.publicKey, 'spki'))
const userPrivateKey = ua2hex(await anonymousApi.cryptoApi.RSA.exportKey(keyPair.privateKey, 'pkcs8'))
//tech-doc: STOP HERE

//tech-doc: Complete authentication process
const authenticationResult = await anonymousApi.authenticationApi.completeAuthentication(
  authProcess!,
  validationCode,
  [userPrivateKey, userPublicKey],
  () => undefined
)

const authenticatedApi = authenticationResult.medTechApi

console.log(`Your new user id: ${authenticationResult.userId}`)
console.log(`Database id where new user was created: ${authenticationResult.groupId}`)
console.log(`Your initialised MedTechAPI: ***\${authenticatedApi}***`)
console.log(`RSA keypair of your new user: ***\${authenticationResult.keyPair}***`)
console.log(`Token created to authenticate your new user: ***\${authenticationResult.token}***`)
//tech-doc: STOP HERE

//tech-doc: Save credentials
saveSecurely(userEmail, authenticationResult.token, authenticationResult.userId, authenticationResult.groupId, authenticationResult.keyPair)
//tech-doc: STOP HERE

//tech-doc: Get logged user info
const loggedUser = await authenticatedApi.userApi.getLoggedUser()
//tech-doc: STOP HERE

console.log('Logged User: ', JSON.stringify(loggedUser))

//tech-doc: Create encrypted data
const createdPatient = await authenticatedApi.patientApi.createOrModifyPatient(new Patient({
  firstName: 'John',
  lastName: 'Snow',
  gender: 'male',
  note: 'Winter is coming'
}))
//tech-doc: STOP HERE

console.log('Created patient: ', JSON.stringify(createdPatient))


//tech-doc: Instantiate back a MedTechApi
const { login, token, pubKey, privKey } = getBackCredentials()
const reInstantiatedApi = await new MedTechApiBuilder()
  .withICureBasePath(iCureUrl)
  .withUserName(login)
  .withPassword(token)
  .withCrypto(webcrypto as any)
  .build()

await reInstantiatedApi.initUserCrypto(false, { publicKey: pubKey, privateKey: privKey})
//tech-doc: STOP HERE

//tech-doc: Get back encrypted data
const foundPatientAfterInstantiatingApi = await reInstantiatedApi.patientApi.getPatient(createdPatient.id)
//tech-doc: STOP HERE

console.log('Found patient after reinstantiating api', JSON.stringify(foundPatientAfterInstantiatingApi))



//tech-doc: Login
const anonymousApiForLogin = await new AnonymousMedTechApiBuilder()
  .withICureUrlPath(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGtwUrl(msgGtwUrl)
  .withMsgGtwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .build()

const authProcessLogin = await anonymousApiForLogin.authenticationApi.startAuthentication(
  masterHcpId,
  'Daenerys',
  'Targaryen',
  recaptcha,
  false,
  userEmail // The email address used for user registration
)
//tech-doc: STOP HERE

const validationCodeForLogin = (await getLastEmail(userEmail)).subject!
console.log('Validation code is ', validationCodeForLogin)

//tech-doc: Complete authentication process
const loginResult = await anonymousApiForLogin.authenticationApi.completeAuthentication(
  authProcessLogin!,
  validationCodeForLogin,
  [userPrivateKey, userPublicKey],
  () => undefined
)

console.log(`Your new user id: ${authenticationResult.userId}`)
console.log(`Database id where new user was created: ${authenticationResult.groupId}`)
console.log(`Your new initialised MedTechAPI: ***\${loginResult.medTechApi}***`)
console.log(`RSA keypair of your user stays the same: ***\${authenticationResult.keyPair}***`)
console.log(`The token of your user will change: ***\${authenticationResult.token}***`)
//tech-doc: STOP HERE

//tech-doc: Access back encrypted data
const loggedUserApi = loginResult.medTechApi

const foundPatientAfterLogin = await loggedUserApi.patientApi.getPatient(createdPatient.id)
//tech-doc: STOP HERE

console.log('Found Patient after login: ', JSON.stringify(foundPatientAfterLogin))
