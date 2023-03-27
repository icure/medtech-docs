import 'isomorphic-fetch'
import { initLocalStorage, initMedTechApi } from '../../utils/index.mjs'
import { Patient, PatientFilter } from '@icure/medical-device-sdk'
import { expect } from 'chai'

initLocalStorage()

const api = await initMedTechApi(true)
const user = await api.userApi.getLoggedUser()
const healthcarePartyId = user.healthcarePartyId!

const now = new Date()

function getYear(dateOfBirth?: number) {
  expect(!!dateOfBirth).to.be.true
  return Math.floor(dateOfBirth! / 10000)
}

await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Arthur',
    lastName: 'Dent',
    gender: 'male',
    dateOfBirth: parseInt(`${now.getFullYear() - 42}0101`),
  }),
)

await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Trillian',
    lastName: 'Astra',
    gender: 'female',
    dateOfBirth: parseInt(`${now.getFullYear() - 42}0101`),
  }),
)

await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Zaphod',
    lastName: 'Beeblebrox',
    gender: 'indeterminate',
  }),
)

//tech-doc: filter patients for hcp
const patientsForHcpFilter = await new PatientFilter().forDataOwner(healthcarePartyId).build()

const patientsForHcp = await api.patientApi.filterPatients(patientsForHcpFilter)
//tech-doc: end
expect(patientsForHcp.rows.length).to.be.greaterThan(0)
patientsForHcp.rows.forEach((p) => {
  expect(Object.keys(p.systemMetaData?.delegations ?? {})).to.contain(healthcarePartyId)
})

//tech-doc: filter patients with implicit intersection filter
const ageGenderImplicitFilter = await new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .ofAge(42)
  .byGenderEducationProfession('female')
  .build()

const ageGenderImplicitPatients = await api.patientApi.filterPatients(ageGenderImplicitFilter)
//tech-doc: end
expect(ageGenderImplicitPatients.rows.length).to.be.greaterThan(0)
ageGenderImplicitPatients.rows.forEach((p) => {
  expect(p.gender).to.be.eq('female')
  const year = getYear(p.dateOfBirth)
  expect(now.getFullYear() - year).to.be.eq(42)
})

//tech-doc: filter patients with explicit intersection filter
const filterByAge = new PatientFilter().forDataOwner(user.healthcarePartyId!).ofAge(42)

const filterByGenderAndAge = await new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('female')
  .intersection([filterByAge])
  .build()

const ageGenderExplicitPatients = await api.patientApi.filterPatients(filterByGenderAndAge)
//tech-doc: end
expect(ageGenderExplicitPatients.rows.length).to.be.greaterThan(0)
ageGenderExplicitPatients.rows.forEach((p) => {
  expect(p.gender).to.be.eq('female')
  const year = getYear(p.dateOfBirth)
  expect(now.getFullYear() - year).to.be.eq(42)
})

//tech-doc: filter patients with union filter
const filterFemales = new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('female')

const filterFemaleOrIndeterminate = await new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('indeterminate')
  .union([filterFemales])
  .build()

const unionFilterPatients = await api.patientApi.filterPatients(filterFemaleOrIndeterminate)
//tech-doc: end
expect(unionFilterPatients.rows.length).to.be.greaterThan(0)
unionFilterPatients.rows.forEach((p) => {
  expect(p.gender).to.be.oneOf(['female', 'indeterminate'])
})
