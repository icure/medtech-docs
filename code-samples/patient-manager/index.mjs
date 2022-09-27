//tech-doc: Prepare for patient creation
import {
    Api,
    Filter,
    FilterChainPatient,
    Patient,
    PatientByHcPartyNameContainsFuzzyFilter,
    hex2ua
} from '@icure/api'
import {crypto} from '@icure/api/node-compat.js'

const host = 'https://kraken.icure.dev/rest/v1';
const { patientApi, userApi, healthcarePartyApi, cryptoApi } = Api(host, 'esmith', 'mypassword', crypto)

const loggedUser = await userApi.getCurrentUser();
const loggedHcp = await healthcarePartyApi.getCurrentHealthcareParty()

await cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
    loggedUser.healthcarePartyId,
    hex2ua(/* truncate */"308204bc020100300d06092a864886f70d0101010500048204a6308204a20201000282010100d862a7597d21da6f8972c02fc4e71d456d3b4fdfff7beffd1759d81fdeabf63c00af6cc15a634bc3a537d7c666d648c93951a496eaeb07c58f8bbe840c4b0375201f3f6cd9ac631150d412111c9d85bf1012dc88188464c07335481af8285aa595078433563b40503ecb2db8ff50836db9fd0a14f4473eee5538766471ae4151a6ee94eeaaa2ee16d4655dff71f7b25958359894e18d535450aa0e8aa8ca72e3f6046c1bc75792748560148bedc5af3f8525465384ad2020dcf28eba45e2aab8fcfde0a79c1fcc1fbd4778cdebd3eb0af62d6e8ef845dc0251d1e0a7e6d2e358f8b4d39db5ffa4021e8a351a8d768308ddacacc2a22814301da64931c477ef4102030100010282010041733da93cc7339a0f1a0d75a57a3e89546bdf5222a5eb46437ce2796951dc4df3eb1bdb342adaacd7d99743a4b1661caf60b987089184ad4628ffbc5337915929192a8713242867016ad3f8270ea278d334d14dbd14b6a0db781f5241037bbf9fdf4126820bb3fd51b1052872d9789784ed3bd270bce81510e3de33ad8b06a84c926c171182043ff7277b8a9378ef05d06098efdeed043608499eec334e2959bfb7335182089e6c66e4b9565934e5eda8c572d00424aad4b9fc40fd286f040cfefe96d25dacc37738a03dbebfdb47c027ce450512900dacfc0f643b2d805536cb9c7ea2641b318e28a635e561fad86d1475463a3331d9331b33b8580bedcded02818100ece5dad8504df2ccbc0eea67f98bd1ceac7bcac0719a7dea629408523cb0f8a3cabd7b5bb82a23ae232165a015e3c46c80b78543621bebc9a94b26d0bcf15ce714dabef132e8185217cb558ae31ba930763a35510f5518c7d56270ccdab7b159872aa902ef68dc0b6edce5ceb2d855671b3545c9a1e0ace67eebe60700eace4302818100e9d55f0267cceb74ed32bc0a43ee5ea08e2c2e8d44b685aadb4cdb0cdc0295bf1063e4d239a3559431da7724bc9418119a94f1054cee1f848886e3577b5424ca84ec0dfae6e9249581bebeaf7b02c71c472c626f1b1913f488639a8afebbbc8db8f7048f8141ecf8af709467eb17f46c2ab4bc7c273702986e46a1289dd7ee2b02818056af412638345dad16ff6a3cc3aeab06324d5602974f4dd5ef5e75b109ee43fd435994831a5fa910b660291cac05dd414ad45c9a2c9344f354d4600eafa4ae370c8582ab25d291dbb0434239012385046bae9f05db536b2eec610a1f9bc4edcb71cf656ae289ff42dbbd4f0614a15e96ccf8f06178af8af508ea6f108f005c9b0281801fd5567be359b86c50a66987143c6d517a497584f1e7cf46b5583f31fef9b31d31c407b0befc07788758f08365d0db7dfa0770d081eaa10bcff25d1cd9c358c6e155a98990ca089af9f0d7d0d7f446db08ad78311c054bfc2c5d32fadd36fdb2658deb6705f7cda5056d5426d990874bfa7c64749a7a18b65bbcedcfb3bd63c502818043b4cd06cae3983bbef1b54bc856fef98df7b35bf1d3bc28124ab84e222f273e9482f48bb6f0776df841fcc50d5df2665d542dd36a952713d92cf6c373000ee9f284aa5b5ee4b3f9de3d7624f925ba40f47cdd8586f60f54a958a738283486538027e8ed6011e3fdbec30f456f2ae468b31e003c9040fc4559af2f473a613059")
)
await cryptoApi.checkPrivateKeyValidity(loggedHcp)

//tech-doc: Create a patient
const patient = await patientApi.createPatientWithUser(loggedUser,
    await patientApi.newInstance(
        loggedUser,
        new Patient({
            firstName: 'Gustave',
            lastName: 'Eiffel',
            dateOfBirth:19731011,
            note: 'A very private information'
        }))
)

//tech-doc: Load a patient by id
const fetchedPatient = await patientApi.getPatientWithUser(loggedUser, patient.id)
console.log(JSON.stringify(fetchedPatient, null, ' '))

//tech-doc: Filter patient
const foundPatients = await patientApi.filterByWithUser(loggedUser, new FilterChainPatient({
    filter: new PatientByHcPartyNameContainsFuzzyFilter({
        healthcarePartyId: loggedUser.healthcarePartyId,
        searchString: "eiffel"
    })
}))
console.log(foundPatients.rows.map(p => `${p.firstName} ${p.lastName}°${p.dateOfBirth}`).join('\n'))

//tech-doc: Filter patient with api
const search1 = await patientApi.filterByWithUser(loggedUser, new FilterChainPatient({
    filter: Filter.patient().forHcp(loggedUser.healthcarePartyId)
        .searchByName("eif")
        .build()
}))

const search2 = await patientApi.filterByWithUser(loggedUser, new FilterChainPatient({
    filter: Filter.patient().forHcp(loggedUser.healthcarePartyId)
        .olderThan(65).or().youngerThan(18)
        .build()
}))

const search3 = await patientApi.filterByWithUser(loggedUser, new FilterChainPatient({
    filter: Filter.patient().forHcp(loggedUser.healthcarePartyId)
        .olderThan(18).and().youngerThan(65)
        .and().searchByName("eif")
        .build()
}))

const patientFilterBuilder = Filter.patient().forHcp(loggedUser.healthcarePartyId)
    .olderThan(65).or().youngerThan(18)
    .and().searchByName("eif");

const filter = patientFilterBuilder.build();
const search4 = await patientApi.filterByWithUser(loggedUser, new FilterChainPatient({
    filter: filter
}))

;[search1, search2, search3, search4].forEach((r, idx) =>
    console.log(`Search ${idx+1}\n${r.rows.map(p => `${p.firstName} ${p.lastName}°${p.dateOfBirth}`).join('\n')}`)
)
