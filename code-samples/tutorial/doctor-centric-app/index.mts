import {DataSample, Patient, CodingReference, DataSampleFilter} from "@icure/medical-device-sdk";
import {initLocalStorage, initMedTechApi, privKey, pubKey, userName} from "../../utils/index.mjs";
import {expect} from "chai";

initLocalStorage()
const api = await initMedTechApi()

await api.initUserCrypto(false, { publicKey: pubKey, privateKey: privKey })

const loggedUser = await api.userApi.getLoggedUser()
expect(loggedUser.login).to.be.equal(userName)

const createdPatient = await api.patientApi.createOrModifyPatient(new Patient({
    firstName: 'John',
    lastName: 'Snow',
    gender: 'male',
    note: 'Winter is coming'
}))

const johnSnow = await api.patientApi.getPatient(createdPatient.id)
expect(createdPatient.id).to.be.equal(johnSnow.id)

const createdData = await api.dataSampleApi.createOrModifyDataSamplesFor(johnSnow.id, [new DataSample({
    labels: new Set([new CodingReference({ type: 'LOINC', code: '29463-7', version: '2' })]),
    content: { en: { numberValue: 92.5 } },
    valueDate: 20220203111034,
    comment: 'Weight'
}),
    new DataSample({
        labels: new Set([new CodingReference({ type: 'LOINC', code: '8302-2', version: '2' })]),
        content: { 'en': { numberValue: 187 } },
        valueDate: 20220203111034,
        comment: 'Height'
    })
])

const johnData = await api.dataSampleApi.filterDataSample(await new DataSampleFilter()
    .forDataOwner(api.dataOwnerApi.getDataOwnerIdOf(loggedUser))
    .forPatients(api.cryptoApi, [johnSnow])
    .byTagCodeFilter('LOINC', '29463-7')
    .build()
)

expect(johnData.rows.length).to.be.equal(1)
expect(johnData.pageSize).to.be.equal(1)
expect(johnData.rows[0].content['en'].numberValue).to.be.equal(92.5)
expect(johnData.rows[0].comment).to.be.equal('Weight')

const johnWeight = await api.dataSampleApi.getDataSample(johnData.rows[0].id)
expect(johnData.rows[0].id).to.be.equal(johnWeight.id)
expect(johnWeight.content['en'].numberValue).to.be.equal(92.5)
expect(johnWeight.comment).to.be.equal('Weight')
