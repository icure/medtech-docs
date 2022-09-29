// import "isomorphic-fetch";
// import {
//     CodingReference, Content,
//     DataSample,
//     HealthcareElement,
//     medTechApi,
// } from '@icure/medical-device-sdk'
// import { webcrypto } from "crypto";
// import { hex2ua} from "@icure/api";
// import { LocalStorage } from 'node-localstorage';
// import {host, patientId, patientPassword, patientPrivKey, patientUserName, privKey} from "../../utils/index.mjs";
// import os from "os";
// import * as console from "console";
//
// const tmp = os.tmpdir();
// (global as any).localStorage = new LocalStorage(tmp, 5 * 1024**3);
// (global as any).Storage = "";
//
// const api = await medTechApi()
//     .withICureBasePath(host)
//     .withUserName(patientUserName)
//     .withPassword(patientPassword)
//     .withCrypto(webcrypto as any)
//     .build()
//
// const user = await api.userApi.getLoggedUser()
// await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
//     user.healthcarePartyId ?? user.patientId ?? user.deviceId,
//     hex2ua(patientPrivKey)
// );
//
// const patient = await api.patientApi.getPatient(patientId)
// //tech-doc: patient can create DS and HE
// const healthcareElement = await api.healthcareElementApi.createOrModifyHealthcareElement(
//     new HealthcareElement({
//         description: 'My period started'
//     }),
//     patient.id
// )
//
// await api.dataSampleApi.createOrModifyDataSampleFor(
//     patient.id,
//     new DataSample({
//         content: { 'en': new Content({
//                 stringValue: 'I have a headache'
//             })},
//         healthcareElementIds: new Set([healthcareElement.id])
//     })
// )
// //tech-doc: STOP HERE