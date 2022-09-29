import {userName, initLocalStorage, initMedTechApi, userName2, initMedTechApi2} from "../../utils/index.mjs";
import {expect} from "chai";
import {Patient} from "@icure/medical-device-sdk";
import {sleep} from "@icure/api";

initLocalStorage()
const api1 = await initMedTechApi(true)
const api2 = await initMedTechApi2(true)
const user1 = await api1.userApi.getLoggedUser()
const user2 = await api2.userApi.getLoggedUser()

console.log(api1.dataOwnerApi.getDataOwnerIdOf(user1))
console.log(api2.dataOwnerApi.getDataOwnerIdOf(user2))
expect(user1.email).to.equal(userName)
expect(user2.email).to.equal(userName2)

const note = "Winter is coming"
const patient = await api1.patientApi.createOrModifyPatient(
    new Patient({ firstName: "John", lastName: "Snow", note })
)
expect((await api1.patientApi.getPatient(patient.id)).note).to.equal(note)
expect((await api2.patientApi.getPatient(patient.id)).note).to.be.undefined

const user2DataOwnerId = api2.dataOwnerApi.getDataOwnerIdOf(user2)
await api1.patientApi.giveAccessTo(patient, user2DataOwnerId)
const api3 = await initMedTechApi2(true)
const sharedPatient = await api3.patientApi.getPatient(patient.id)
console.log(sharedPatient.systemMetaData!.delegations[user2DataOwnerId] !== undefined);
console.log(sharedPatient.systemMetaData!.delegations[user2DataOwnerId] !== undefined);
console.log(sharedPatient.id === patient.id)
console.log(sharedPatient.note === note)
