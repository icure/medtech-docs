import { initLocalStorage, initMedTechApi } from '../../utils/index.mjs';
import { Patient, PatientFilter } from '@icure/medical-device-sdk';
import { expect } from 'chai';

initLocalStorage()

const api = await initMedTechApi(true)
const user = await api.userApi.getLoggedUser()
const healthcarePartyId = user.healthcarePartyId!

const now = new Date()

const p1 = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Arthur',
    lastName: 'Dent',
    gender: "male",
    dateOfBirth: parseInt(`${now.getFullYear() - 42}0214`)
  })
)

const p2 = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'Trillian',
    lastName: 'Astra',
    gender: "female",
    dateOfBirth: 19850317
  })
)

//tech-doc: filter patients for hcp
const patientsForHcpFilter = await new PatientFilter()
  .forDataOwner(healthcarePartyId)
  .build()

const patientsForHcp = await api.patientApi.filterPatients(patientsForHcpFilter)
//tech-doc: end
expect(patientsForHcp.rows.length).to.be.greaterThan(0)
patientsForHcp.rows.forEach( (p) => {
  expect(Object.keys(p.systemMetaData?.delegations ?? {})).to.contain(healthcarePartyId)
})

const filter = await new PatientFilter()
