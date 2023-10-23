import 'isomorphic-fetch'
import { initEHRLiteApi } from '../../utils/index.mjs'
import { expect } from 'chai'
import { v4 as uuid } from 'uuid'
import { initLocalStorage, output } from '../../../utils/index.mjs'
import { ContactPoint, Location, Patient } from '@icure/ehr-lite-sdk'
import { LocationAddressTypeEnum } from '@icure/ehr-lite-sdk/models/enums/LocationAddressType.enum'
import {ContactPointTelecomTypeEnum} from "@icure/ehr-lite-sdk/models/enums/ContactPointTelecomType.enum";

initLocalStorage()

const api = await initEHRLiteApi(true)

const user = await api.userApi.getLogged()

const practitioner = await api.practitionerApi.get(user.healthcarePartyId)
practitioner.addresses = [
  new Location({
    addressType: LocationAddressTypeEnum.HOME,
    description: 'London',
    telecoms: [
      new ContactPoint({
        system: ContactPointTelecomTypeEnum.EMAIL,
        value: 'test@example.com',
      }),
    ],
  }),
]

const patientEmail = `${uuid().substring(0, 8)}@icure.com`

const existingPatient = await api.patientApi.createOrModify(
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
            value: patientEmail,
          }),
        ],
      }),
    ],
  }),
)
expect(!!existingPatient).to.eq(true) //skip

//tech-doc: doctor invites user
const createdUser = await api.userApi.createAndInviteFor(existingPatient)
//tech-doc: STOP HERE
output({ createdUser })
expect(createdUser.patientId).to.eq(existingPatient.id)
