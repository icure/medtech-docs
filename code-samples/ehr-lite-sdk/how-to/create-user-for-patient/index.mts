import 'isomorphic-fetch'

import { authProcessId, host, initEHRLiteApi, msgGtwUrl, specId } from '../../utils/index.mjs'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import {
  AnonymousEHRLiteApi,
  Condition,
  ConditionFilter,
  ContactPoint,
  LocalComponent,
  Location,
  Observation,
  Patient,
} from '@icure/ehr-lite-sdk'
import { MaintenanceTask, sleep } from '@icure/api'
import { assert, expect } from 'chai'
import { v4 as uuid } from 'uuid'
import { webcrypto } from 'crypto'
import { getLastEmail } from '../../../utils/msgGtw.mjs'
import { LocationAddressTypeEnum } from '@icure/ehr-lite-sdk/models/enums/LocationAddressType.enum'
import { CodingReference, mapOf, NotificationTypeEnum } from '@icure/typescript-common'
import { SimpleEHRLiteCryptoStrategies } from '@icure/ehr-lite-sdk/services/EHRLiteCryptoStrategies.js'
import { ContactPointTelecomTypeEnum } from '@icure/ehr-lite-sdk/models/enums/ContactPointTelecomType.enum'
import { PatientPersonalStatusEnum } from '@icure/ehr-lite-sdk/models/enums/PatientPersonalStatus.enum'

initLocalStorage()

const apiAsDoctor = await initEHRLiteApi(true)

const loggedUser = await apiAsDoctor.userApi.getLogged()

const hcp = await apiAsDoctor.practitionerApi.get(loggedUser.healthcarePartyId)

hcp.addresses = [
  new Location({
    addressType: LocationAddressTypeEnum.HOME,
    description: 'London',
    telecoms: [
      new ContactPoint({
        system: ContactPointTelecomTypeEnum.EMAIL,
        value: 'email@example.com',
      }),
    ],
  }),
]

const email = `${uuid().substring(0, 8)}@icure.com`
const patient = await apiAsDoctor.patientApi.createOrModify(
  new Patient({
    firstName: 'Marc',
    lastName: 'Specter',
    addresses: [
      new Location({
        addressType: LocationAddressTypeEnum.HOME,
        description: 'London',
        telecoms: [
          new ContactPoint({
            system: ContactPointTelecomTypeEnum.EMAIL,
            value: email,
          }),
        ],
      }),
    ],
  }),
)
assert(!!patient)

const observation = apiAsDoctor.observationApi.createOrModifyFor(
  patient.id,
  new Observation({
    tags: new Set([new CodingReference({ type: 'IC-TEST', code: 'TEST' })]),
    localContent: mapOf({ en: new LocalComponent({ stringValue: 'Hello world' }) }),
  }),
)
assert(!!observation)

//tech-doc: doctor invites user
await apiAsDoctor.userApi.createAndInviteFor(patient, 3600)
//tech-doc: STOP HERE

const loginAndPasswordRegex = new RegExp(': ([^ &]+) & (.+)')
const emailBody = (await getLastEmail(email)).html
const loginAndPassword = loginAndPasswordRegex.exec(emailBody)
const patientUsername = loginAndPassword[1]
const patientToken = loginAndPassword[2]

await sleep(5000)

//tech-doc: user logs in
const anonymousMedTechApi = await new AnonymousEHRLiteApi.Builder()
  .withICureBaseUrl(host)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessId)
  .withAuthProcessBySmsId(authProcessId)
  .withCryptoStrategies(new SimpleEHRLiteCryptoStrategies([]))
  .build()

const authenticationResult =
  await anonymousMedTechApi.authenticationApi.authenticateAndAskAccessToItsExistingData(
    patientUsername,
    patientToken,
  )
const apiAsPatient = authenticationResult.api
//tech-doc: STOP HERE

//tech-doc: get patient details
const patientUser = await apiAsPatient.userApi.getLogged()
// apiAsPatient.patientApi.getPatient would fail
const patientDetails = await apiAsPatient.patientApi.getAndTryDecrypt(patientUser.patientId)
//tech-doc: STOP HERE
output({ patientDetails })
patientDetails.patient.personalStatus = PatientPersonalStatusEnum.COMPLICATED
// patientDetails.note = 'This would make modify fail'
const modifiedPatientDetails = await apiAsPatient.patientApi.createOrModify(patientDetails.patient)
//tech-doc: STOP HERE
output({ modifiedPatientDetails })

//tech-doc: create healthcare element
const newCondition = await apiAsPatient.conditionApi.createOrModify(
  new Condition({
    description: "I don't feel so well",
    codes: new Set([
      new CodingReference({
        id: 'SNOMEDCT|617|20020131',
        type: 'SNOMEDCT',
        code: '617',
        version: '20020131',
      }),
    ]),
    openingDate: new Date('2019-10-12').getTime(),
  }),
  modifiedPatientDetails.id,
)
const sharedCondition = await apiAsPatient.conditionApi.giveAccessTo(newCondition, hcp.id)
// The doctor can now access the healthcare element
await apiAsDoctor.conditionApi.get(newCondition.id) // HealthcareElement...
//tech-doc: STOP HERE
output({ newHealthcareElement: newCondition, sharedHealthcareElement: sharedCondition })

//tech-doc: share healthcare element sfk
const filterForHcpWithoutAccessByPatient = await new ConditionFilter(apiAsDoctor)
  .forDataOwner(hcp.id)
  .forPatients([await apiAsDoctor.patientApi.get(patient.id)])
  .build()
const notFoundHEs = await apiAsDoctor.conditionApi.filterBy(filterForHcpWithoutAccessByPatient)
console.log(notFoundHEs.rows.find((x) => x.id == newCondition.id)) // undefined
expect(notFoundHEs.rows.find((x) => x.id == newCondition.id)).to.be.undefined //skip
// The patient shares his secret foreign key with the doctor
await apiAsPatient.patientApi.giveAccessTo(modifiedPatientDetails, hcp.id)
// The doctor can now also find the healthcare element
const filterForHcpWithAccessByPatient = await new ConditionFilter(apiAsDoctor)
  .forDataOwner(hcp.id)
  .forPatients([await apiAsDoctor.patientApi.get(patient.id)])
  .build()
const foundHEs = await apiAsDoctor.conditionApi.filterBy(filterForHcpWithAccessByPatient)
console.log(foundHEs.rows.find((x) => x.id == newCondition.id)) // HealthcareElement...
expect(foundHEs.rows.find((x) => x.id == newCondition.id)).to.not.be.undefined //skip
//tech-doc: STOP HERE
output({ notFoundHEs, foundHEs })

//tech-doc: doctor gets pending notifications
const newNotifications = await apiAsDoctor.notificationApi.getPendingAfter()
const patientNotification = newNotifications.filter(
  (notification) =>
    notification.type === NotificationTypeEnum.NewUserOwnDataAccess &&
    notification.responsible === patient.id,
)[0]
//tech-doc: STOP HERE
output({ newNotifications, patientNotification })
expect(!!patientNotification).to.eq(true)

//tech-doc: notification set ongoing
const ongoingStatusUpdate = await apiAsDoctor.notificationApi.updateStatus(
  patientNotification,
  MaintenanceTask.StatusEnum.Ongoing,
)
//tech-doc: STOP HERE
output({ ongoingStatusUpdate })

expect(!!ongoingStatusUpdate).to.eq(true)
expect(ongoingStatusUpdate?.status).to.eq('ongoing')

//tech-doc: data sharing
const sharedData = await apiAsDoctor.patientApi.giveAccessToAllDataOf(patient.id)
//tech-doc: STOP HERE
output({ sharedData })
expect(!!sharedData).to.eq(true)
expect(sharedData.patient?.id).to.eq(patient.id)
expect(sharedData.statuses.dataSamples?.success).to.eq(true)
expect(!!sharedData.statuses.dataSamples?.error).to.eq(false)
expect(sharedData.statuses.dataSamples?.modified).to.eq(1)

//tech-doc: completed status
const completedStatusUpdate = await apiAsDoctor.notificationApi.updateStatus(
  ongoingStatusUpdate,
  MaintenanceTask.StatusEnum.Completed,
)
//tech-doc: STOP HERE
output({ completedStatusUpdate })

expect(!!completedStatusUpdate).to.eq(true)
expect(completedStatusUpdate?.status).to.eq('completed')
