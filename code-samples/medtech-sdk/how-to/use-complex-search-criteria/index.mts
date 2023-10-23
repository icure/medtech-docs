import 'isomorphic-fetch'
import {
  host,
  initLocalStorage,
  initMedTechApi,
  msgGtwUrl,
  output,
  signUpUserUsingEmail,
  specId,
} from '../../../utils/index.mjs'
import { Patient, PatientFilter } from '@icure/medical-device-sdk'
import { expect } from 'chai'
import process from 'process'
import { FilterComposition } from '@icure/typescript-common'

initLocalStorage()

const masterApi = await initMedTechApi(true)
const masterUser = await masterApi.userApi.getLoggedUser()

const { api } = await signUpUserUsingEmail(
  host,
  msgGtwUrl,
  specId,
  process.env.AUTH_BY_EMAIL_HCP_PROCESS_ID,
  masterUser.healthcarePartyId!,
)
const user = await api.userApi.getLoggedUser()
const healthcarePartyId = user.healthcarePartyId!

await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Arthur',
    lastName: 'Dent',
    gender: 'male',
    dateOfBirth: parseInt(`19520101`),
  }),
)

await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Trillian',
    lastName: 'Astra',
    gender: 'female',
    dateOfBirth: parseInt(`19520101`),
  }),
)

await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Zaphod',
    lastName: 'Beeblebrox',
    gender: 'indeterminate',
    dateOfBirth: parseInt(`19420101`),
  }),
)

//tech-doc: filter patients for hcp
const patientsForHcpFilter = await new PatientFilter(api).forDataOwner(healthcarePartyId).build()
const patientsForHcp = await api.patientApi.filterPatients(patientsForHcpFilter)
//tech-doc: end
output({ patientsForHcpFilter, patientsForHcp })

expect(patientsForHcp.rows.length).to.be.greaterThan(0)
patientsForHcp.rows.forEach((p) => {
  expect(Object.keys(p.systemMetaData?.delegations ?? {})).to.contain(healthcarePartyId)
})

//tech-doc: filter patients with implicit intersection filter
const ageGenderFilter = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId!)
  .dateOfBirthBetween(19511211, 19520203)
  .byGenderEducationProfession('female')
  .build()

const ageGenderPatients = await api.patientApi.filterPatients(ageGenderFilter)
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
  .forDataOwner(user.healthcarePartyId!)
  .sort.dateOfBirthBetween(19391211, 19520203)
  .byGenderEducationProfession('female')
  .build()

const ageGenderSortedPatients = await api.patientApi.filterPatients(ageGenderFilter)
//tech-doc: end
output({ ageGenderSortedFilter, ageGenderSortedPatients })

expect(ageGenderSortedPatients.rows.length).to.be.greaterThan(0)

//tech-doc: filter patients with explicit intersection filter
const filterByAge = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId!)
  .dateOfBirthBetween(19511211, 19520203)
  .build()

const filterByGender = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('female')
  .build()

const filterByGenderAndAge = FilterComposition.intersection(filterByAge, filterByGender)

const ageGenderExplicitPatients = await api.patientApi.filterPatients(filterByGenderAndAge)
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
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('female')
  .build()

const filterIndeterminate = await new PatientFilter(api)
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('indeterminate')
  .build()

const filterFemaleOrIndeterminate = FilterComposition.union(filterFemales, filterIndeterminate)

const unionFilterPatients = await api.patientApi.filterPatients(filterFemaleOrIndeterminate)
//tech-doc: end
output({ filterFemaleOrIndeterminate, unionFilterPatients })

expect(unionFilterPatients.rows.length).to.be.greaterThan(0)
unionFilterPatients.rows.forEach((p) => {
  expect(p.gender).to.be.oneOf(['female', 'indeterminate'])
})
