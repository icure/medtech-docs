import {
  Address,
  DataSampleFilter,
  HealthcareProfessional,
  HealthcareProfessionalFilter,
  medTechApi,
  Telecom,
  UserFilter,
} from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import { host, userName, password } from '../../utils/index.mjs'
import 'isomorphic-fetch'
import { LocalStorage } from 'node-localstorage'
import * as os from 'os'
import { expect } from 'chai'

const tmp = os.tmpdir()
;(global as any).localStorage = new LocalStorage(tmp, 5 * 1024 * 1024 * 1024)
;(global as any).Storage = ''

const api = await medTechApi()
  .withICureBasePath(host)
  .withUserName(userName)
  .withPassword(password)
  .withMsgGtwSpecId('ic')
  .withMsgGtwUrl('https://msg-gw.icure.dev')
  .withCrypto(webcrypto as any)
  .build()

//tech-doc: Create a healthcare professional
import { User } from '@icure/medical-device-sdk'
import { ICureRegistrationEmail } from '@icure/medical-device-sdk'

const healthcareProfessional: HealthcareProfessional = new HealthcareProfessional({
  firstName: 'John',
  lastName: 'Keats',
  speciality: 'Psychiatrist',
  codes: new Set([{ type: 'practitioner-specialty', code: 'psychiatrist' }]),
  addresses: [
    new Address({
      telecoms: [
        new Telecom({
          telecomType: 'email',
          telecomNumber: `jk@hospital.care`,
        }),
      ],
    }),
  ],
})

const createdHcp = await api.healthcareProfessionalApi.createOrModifyHealthcareProfessional(
  healthcareProfessional,
)

//tech-doc: STOP HERE
expect(createdHcp.id).to.be.a('string')
expect(createdHcp.firstName).to.equal('John')
expect(createdHcp.lastName).to.equal('Keats')
expect(createdHcp.addresses[0].telecoms[0].telecomNumber).to.equal('jk@hospital.care')

//tech-doc: Load a healthcare professional by id
const loadedHcp = await api.healthcareProfessionalApi.getHealthcareProfessional(createdHcp.id)

//tech-doc: STOP HERE
expect(loadedHcp.id).to.be.equal(createdHcp.id)
expect(loadedHcp.firstName).to.equal('John')
expect(loadedHcp.lastName).to.equal('Keats')

//tech-doc: Filter healthcare professionals
const hcps = await api.healthcareProfessionalApi.filterHealthcareProfessionalBy(
  await new HealthcareProfessionalFilter()
    .byLabelCodeFilter(undefined, undefined, 'practicioner-specialty', 'psychiatrist')
    .build(),
)

//tech-doc: STOP HERE
expect(hcps.rows.length).to.be.equal(1)
expect(hcps.rows[0].id).to.be.equal(createdHcp.id)

//tech-doc: Update a healthcare professional
const hcpToModify = await api.healthcareProfessionalApi.getHealthcareProfessional(createdHcp.id)
const modifiedHcp = await api.healthcareProfessionalApi.createOrModifyHealthcareProfessional(
  new HealthcareProfessional({ ...hcpToModify, civility: 'Dr.' }),
)

//tech-doc: STOP HERE
expect(modifiedHcp.id).to.be.equal(createdHcp.id)
expect(modifiedHcp.civility).to.equal('Dr.')

//tech-doc: Delete a healthcare professional
await api.healthcareProfessionalApi.deleteHealthcareProfessional(createdHcp.id)

//tech-doc: STOP HERE
