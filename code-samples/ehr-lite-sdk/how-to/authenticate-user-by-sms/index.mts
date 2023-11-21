import 'isomorphic-fetch'
import { password } from '../../../utils/index.mjs'
import { webcrypto } from 'crypto'
import * as process from 'process'
import { getLastSMS } from '../../../utils/msgGtw.mjs'
import { username } from '../../quick-start/index.mjs'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import { AnonymousEHRLiteApi, EHRLiteApi, Patient } from '@icure/ehr-lite-sdk'
import { SimpleEHRLiteCryptoStrategies } from '@icure/ehr-lite-sdk/services/EHRLiteCryptoStrategies.js'
import { GenderEnum } from '@icure/ehr-lite-sdk/models/enums/Gender.enum.js'

const cachedInfo = {} as { [key: string]: string }
let cachedKeys: { privateKey: string; publicKey: string }[] = []
const userPhoneNumber = `+24${Math.floor(Math.random() * 1000000000)}`

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
  login?: string
  token?: string
  keys: { privateKey: string; publicKey: string }[]
} {
  return {
    login: cachedInfo['login'],
    token: cachedInfo['token'],
    keys: cachedKeys,
  }
}

initLocalStorage()

//tech-doc: Get master Hcp Id
const iCureUrl = process.env.ICURE_URL

const masterHcpApi = await new EHRLiteApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withUserName(username)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
  .build()
const masterUser = await masterHcpApi.userApi.getLogged()
const masterHcpId = masterHcpApi.dataOwnerApi.getDataOwnerIdOf(masterUser)
//tech-doc: STOP HERE
output({ masterUser, masterHcpId })

//tech-doc: Instantiate AnonymousMedTech API
const msgGtwUrl = process.env.ICURE_MSG_GTW_URL
const specId = process.env.SPEC_ID
const authProcessByEmailId = process.env.AUTH_BY_EMAIL_HCP_PROCESS_ID
const authProcessBySmsId = process.env.AUTH_BY_SMS_PRACTITIONER_PROCESS_ID
const recaptcha = process.env.RECAPTCHA

const anonymousApi = await new AnonymousEHRLiteApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
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

const validationCode = (await getLastSMS(userPhoneNumber)).message as string
console.log('SMS Validation code for number', userPhoneNumber, ' is ', validationCode)

//tech-doc: Complete authentication process
const authenticationResult = await anonymousApi.authenticationApi.completeAuthentication(
  authProcess,
  validationCode,
)

const authenticatedApi = authenticationResult.api

// saveSecurely does not exist: Use your own way of storing the following data securely
// One option is to put these elements into the localStorage
saveSecurely(
  userPhoneNumber,
  authenticationResult.token,
  authenticationResult.userId,
  authenticationResult.groupId,
  authenticationResult.keyPairs,
)

const createdPatient = await authenticatedApi.patientApi.createOrModify(
  new Patient({
    firstName: 'Robb',
    lastName: 'Stark',
    gender: GenderEnum.MALE,
  }),
)
//tech-doc: STOP HERE
output({ createdPatient })

//tech-doc: Instantiate back a MedTechApi
// getBackCredentials does not exist: Use your own way of storing the following data securely
// One option is to get them back from the localStorage
const { login, token, keys } = getBackCredentials()

const reInstantiatedApi = await new EHRLiteApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withUserName(login)
  .withPassword(token)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies(keys))
  .build()

const foundPatientAfterInstantiatingApi = await reInstantiatedApi.patientApi.get(createdPatient.id)
//tech-doc: STOP HERE
output({ foundPatientAfterInstantiatingApi })

//tech-doc: Login by SMS
const anonymousApiForLogin = await new AnonymousEHRLiteApi.Builder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
  .build()

const authProcessLogin = await anonymousApiForLogin.authenticationApi.startAuthentication(
  recaptcha,
  undefined,
  userPhoneNumber, // The phone number used for user registration
)
//tech-doc: STOP HERE

const validationCodeForLogin = (await getLastSMS(userPhoneNumber)).message as string
console.log('SMS Validation code is ', validationCodeForLogin)

//tech-doc: Complete login authentication process
const loginResult = await anonymousApiForLogin.authenticationApi.completeAuthentication(
  authProcessLogin,
  validationCodeForLogin,
)

const loggedUserApi = loginResult.api

const foundPatientAfterLogin = await loggedUserApi.patientApi.get(createdPatient.id)
//tech-doc: STOP HERE
output({ foundPatientAfterLogin })
