import 'isomorphic-fetch'
import { initLocalStorage, output, password } from '../../../utils/index.mjs'
import { AnonymousMedTechApi, MedTechApi, Patient } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import * as process from 'process'
import { getLastSMS } from '../../../utils/msgGtw.mjs'
import { username } from '../../quick-start/index.mjs'
import { SimpleMedTechCryptoStrategies } from '@icure/medical-device-sdk/src/services/MedTechCryptoStrategies.js'

const cachedInfo = {} as { [key: string]: string }
const userPhoneNumber = `+24${Math.floor(Math.random() * 1000000000)}`

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
const iCureUrl = process.env.ICURE_URL

const masterHcpApi = await new MedTechApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withUserName(username)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
const masterUser = await masterHcpApi.userApi.getLogged()
const masterHcpId = masterHcpApi.dataOwnerApi.getDataOwnerIdOf(masterUser)
//tech-doc: STOP HERE
output({ masterUser, masterHcpId })

//tech-doc: Instantiate AnonymousMedTech API
const msgGtwUrl = process.env.ICURE_MSG_GTW_URL
const specId = process.env.SPEC_ID
const authProcessByEmailId = process.env.AUTH_BY_EMAIL_HCP_PROCESS_ID
const authProcessBySmsId = process.env.AUTH_BY_SMS_HCP_PROCESS_ID
const recaptcha = process.env.RECAPTCHA

const anonymousApi = await new AnonymousMedTechApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
//tech-doc: STOP HERE

//tech-doc: Start Authentication Process By SMS
const authProcess = await anonymousApi.authenticationApi.startAuthentication(
  recaptcha,
  undefined,
  userPhoneNumber, // Phone number of the user who wants to register
  'Ned',
  'Stark',
  masterHcpId,
)
//tech-doc: STOP HERE
output({ authProcess })

const validationCode = (await getLastSMS(userPhoneNumber)).message
console.log('SMS Validation code for number', userPhoneNumber, ' is ', validationCode)

//tech-doc: Complete authentication process
const authenticationResult = await anonymousApi.authenticationApi.completeAuthentication(
  authProcess,
  validationCode,
)

const authenticatedApi = authenticationResult.medTechApi

// saveSecurely does not exist: Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(
  userPhoneNumber,
  authenticationResult.token,
  authenticationResult.userId,
  authenticationResult.groupId,
  authenticationResult.keyPairs[0],
)

const createdPatient = await authenticatedApi.patientApi.createOrModify(
  new Patient({
    firstName: 'Robb',
    lastName: 'Stark',
    gender: 'male',
    note: "You must keep one's head",
  }),
)
//tech-doc: STOP HERE
output({ createdPatient })

//tech-doc: Instantiate back a MedTechApi
// getBackCredentials does not exist: Use your own way of storing the following data securely
// One option is to get them back from the localStorage
const { login, token, pubKey, privKey } = getBackCredentials()

const reInstantiatedApi = await new MedTechApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withUserName(login)
  .withPassword(token)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(
    new SimpleMedTechCryptoStrategies([{ publicKey: pubKey, privateKey: privKey }]),
  )
  .build()

const foundPatientAfterInstantiatingApi = await reInstantiatedApi.patientApi.get(createdPatient.id)
//tech-doc: STOP HERE
output({ foundPatientAfterInstantiatingApi })

//tech-doc: Login by SMS
const anonymousApiForLogin = await new AnonymousMedTechApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()

const authProcessLogin = await anonymousApiForLogin.authenticationApi.startAuthentication(
  recaptcha,
  undefined,
  userPhoneNumber, // The phone number used for user registration
)
//tech-doc: STOP HERE

const validationCodeForLogin = (await getLastSMS(userPhoneNumber)).message
console.log('SMS Validation code is ', validationCodeForLogin)

//tech-doc: Complete login authentication process
const loginResult = await anonymousApiForLogin.authenticationApi.completeAuthentication(
  authProcessLogin,
  validationCodeForLogin,
)

const loggedUserApi = loginResult.medTechApi

const foundPatientAfterLogin = await loggedUserApi.patientApi.getPatient(createdPatient.id)
//tech-doc: STOP HERE
output({ foundPatientAfterLogin })
