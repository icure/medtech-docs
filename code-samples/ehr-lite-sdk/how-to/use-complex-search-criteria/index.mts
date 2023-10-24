import 'isomorphic-fetch'
import { host, initLocalStorage, msgGtwUrl, output, specId } from '../../../utils/index.mjs'
import { expect } from 'chai'
import process from 'process'
import { initEHRLiteApi, signUpUserUsingEmail } from '../../utils/index.mjs'
import { Patient, PatientFilter } from '@icure/ehr-lite-sdk'
import { GenderEnum } from '@icure/ehr-lite-sdk/models/enums/Gender.enum.js'
import { FilterComposition } from '@icure/typescript-common'

initLocalStorage()

const masterApi = await initEHRLiteApi(true)
const masterUser = await masterApi.userApi.getLogged()

const { api } = await signUpUserUsingEmail(
  host,
  msgGtwUrl,
  specId,
  process.env.AUTH_BY_EMAIL_HCP_PROCESS_ID,
  masterUser.healthcarePartyId,
)
const user = await api.userApi.getLogged()
const healthcarePartyId = user.healthcarePartyId

await api.patientApi.createOrModify(
  new Patient({
    firstName: 'Arthur',
    lastName: 'Dent',
    gender: GenderEnum.MALE,
    dateOfBirth: parseInt(`19520101`),
  }),
)

await api.patientApi.createOrModify(
  new Patient({
    firstName: 'Trillian',
    lastName: 'Astra',
    gender: GenderEnum.FEMALE,
    dateOfBirth: parseInt(`19520101`),
  }),
)

await api.patientApi.createOrModify(
  new Patient({
    firstName: 'Zaphod',
    lastName: 'Beeblebrox',
    gender: GenderEnum.INDETERMINATE,
    dateOfBirth: parseInt(`19420101`),
  }),
)

//tech-doc: filter patients for hcp
const patientsForHcpFilter = await new PatientFilter(api).forDataOwner(healthcarePartyId).build()
const patientsForHcp = await api.patientApi.filterBy(patientsForHcpFilter)
//tech-doc: end
output({ patientsForHcpFilter, patientsForHcp })

expect(patientsForHcp.rows.length).to.be.greaterThan(0)
patientsForHcp.rows.forEach((p) => {
  expect(Object.keys(p.systemMetaData?.delegations ?? {})).to.contain(healthcarePartyId)
})

//tech-doc: filter patients with implicit intersection filter
const ageGenderFilter = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .dateOfBirthBetween(19511211, 19520203)
  .byGenderEducationProfession('female')
  .build()

const ageGenderPatients = await api.patientApi.filterBy(ageGenderFilter)
//tech-doc: end
output({ ageGenderFilter, ageGenderPatients })

expect(ageGenderPatients.rows.length).to.be.greaterThan(0)
ageGenderPatients.rows.forEach((p) => {
  expect(p.gender).to.be.eq('female')
  expect(p.dateOfBirth).to.be.greaterThan(19511211)
  expect(p.dateOfBirth).to.be.lessThan(19520202)
})

//tech-doc: filter patients with implicit intersection filter with sorting
const ageGenderSortedFilter = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .sort.dateOfBirthBetween(19391211, 19520203)
  .byGenderEducationProfession('female')
  .build()

const ageGenderSortedPatients = await api.patientApi.filterBy(ageGenderFilter)
//tech-doc: end
output({ ageGenderSortedFilter, ageGenderSortedPatients })

expect(ageGenderSortedPatients.rows.length).to.be.greaterThan(0)

//tech-doc: filter patients with explicit intersection filter
const filterByAge = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .dateOfBirthBetween(19511211, 19520203)
  .build()

const filterByGender = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .byGenderEducationProfession('female')
  .build()

const filterByGenderAndAge = FilterComposition.intersection(filterByAge, filterByGender)

const ageGenderExplicitPatients = await api.patientApi.filterBy(filterByGenderAndAge)
//tech-doc: end
output({ filterByGenderAndAge, ageGenderExplicitPatients })

expect(ageGenderExplicitPatients.rows.length).to.be.greaterThan(0)
ageGenderExplicitPatients.rows.forEach((p) => {
  expect(p.gender).to.be.eq('female')
  expect(p.dateOfBirth).to.be.greaterThan(19511211)
  expect(p.dateOfBirth).to.be.lessThan(19520202)
})

//tech-doc: filter patients with union filter
const filterFemales = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .byGenderEducationProfession('female')
  .build()

const filterIndeterminate = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId)
  .byGenderEducationProfession('indeterminate')
  .build()

const filterFemaleOrIndeterminate = FilterComposition.union(filterFemales, filterIndeterminate)

const unionFilterPatients = await api.patientApi.filterBy(filterFemaleOrIndeterminate)
//tech-doc: end
output({ filterFemaleOrIndeterminate, unionFilterPatients })

expect(unionFilterPatients.rows.length).to.be.greaterThan(0)
unionFilterPatients.rows.forEach((p) => {
  expect(p.gender).to.be.oneOf(['female', 'indeterminate'])
})
