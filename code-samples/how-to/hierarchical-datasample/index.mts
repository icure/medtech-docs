import {CodingReference, DataSample, DataSampleFilter, medTechApi, Patient, TimeSeries} from '@icure/medical-device-sdk'
import {hex2ua, sleep} from "@icure/api";
import "isomorphic-fetch";
import * as console from "console";

import {initLocalStorage, initMedTechApi, privKey} from "../../utils/index.mjs";

initLocalStorage()

const api = await initMedTechApi()

const loggedUser = await api.userApi.getLoggedUser();
await api!.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
    loggedUser.healthcarePartyId!,
    hex2ua(privKey)
);

//tech-doc: create a patient for datasample
const patient = await api.patientApi.createOrModifyPatient(
    new Patient({
        firstName: "John",
        lastName: "Snow",
        note: "Winter is coming",
    })
);
//tech-doc: STOP HERE

//tech-doc: create a dataSample

new DataSample({
    labels: new Set([
        new CodingReference({type: "LOINC", code: "35094-2", version: '2.73'}),
    ]),
    openingDate: 20220929083400,
})

//tech-doc: add heart rate data

new DataSample({
    labels: new Set([
        new CodingReference({type: "LOINC", code: "35094-2", version: '2.73'}),
    ]),
    openingDate: 20220929083400,
    content: {
        en: {
            compoundValue: [
                // highlight-start
                new DataSample({
                    labels: new Set([
                        new CodingReference({type: "LOINC", code: "41920-0", version: '2.73'}),
                    ]),
                    comment: "Heart rate 1 hour mean",
                    openingDate: 20220929083400,
                    content: {
                        en: {
                            measureValue: {
                                value: 72,
                                unit: "{beats}/min",
                                unitCodes: new Set([
                                    new CodingReference({type: "UCUM", code: "{beats}/min", version: '1.2'}),
                                ]),
                            }
                        }
                    }
                }),
                new DataSample({
                    labels: new Set([
                        new CodingReference({type: "LOINC", code: "41921-8", version: '2.73'}),
                    ]),
                    comment: "Heart rate 8 hour mean",
                    openingDate: 20220929083400,
                    content: {
                        en: {
                            measureValue: {
                                value: 63,
                                unit: "{beats}/min",
                                unitCodes: new Set([
                                    new CodingReference({type: "UCUM", code: "{beats}/min", version: '1.2'}),
                                ]),
                            }
                        }
                    }
                })
                // highlight-end
            ]
        }
    }
})


//tech-doc: add temperatures data

new DataSample({
    labels: new Set([
        new CodingReference({type: "LOINC", code: "35094-2", version: '2.73'}),
    ]),
    openingDate: 20220929083400,
    content: {
        en: {
            compoundValue: [
                new DataSample({
                    /**
                     *
                     */
                }),
                new DataSample({
                    /**
                     *
                     */
                }),
                // highlight-start
                new DataSample({
                    labels: new Set([
                        new CodingReference({type: "LOINC", code: "8310-5", version: '2.73'}),
                    ]),
                    comment: "Body temperature",
                    openingDate: 20220929083400,
                    content: {
                        en: {
                            timeSeries: new TimeSeries(
                                {
                                    samples: Array.apply(null, {length: 60}).map(Function.call, Math.random), // Simulate 60 random values for temperature
                                    fields: [
                                        "C°"
                                    ],
                                }
                            )
                        }
                    }
                })
                // highlight-end
            ]
        }
    }
})

//tech-doc: final example
const dataSampleToCreate = new DataSample({
    labels: new Set([
        new CodingReference({type: "LOINC", code: "35094-2", version: '2.73'}),
    ]),
    openingDate: 20220929083400,
    content: {
        en: {
            compoundValue: [
                new DataSample({
                    labels: new Set([
                        new CodingReference({type: "LOINC", code: "41920-0", version: '2.73'}),
                    ]),
                    comment: "Heart rate 1 hour mean",
                    openingDate: 20220929083400,
                    content: {
                        en: {
                            measureValue: {
                                value: 72,
                                unit: "{beats}/min",
                                unitCodes: new Set([
                                    new CodingReference({type: "UCUM", code: "{beats}/min", version: '1.2'}),
                                ]),
                            }
                        }
                    }
                }),
                new DataSample({
                    labels: new Set([
                        new CodingReference({type: "LOINC", code: "41921-8", version: '2.73'}),
                    ]),
                    comment: "Heart rate 8 hour mean",
                    openingDate: 20220929083400,
                    content: {
                        en: {
                            measureValue: {
                                value: 63,
                                unit: "{beats}/min",
                                unitCodes: new Set([
                                    new CodingReference({type: "UCUM", code: "{beats}/min", version: '1.2'}),
                                ]),
                            }
                        }
                    }
                }),
                new DataSample({
                    labels: new Set([
                        new CodingReference({type: "LOINC", code: "8310-5", version: '2.73'}),
                    ]),
                    comment: "Body temperature",
                    openingDate: 20220929083400,
                    content: {
                        en: {
                            timeSeries: new TimeSeries(
                                {
                                    samples: Array.apply(null, {length: 60}).map(Function.call, Math.random), // Simulate 60 random values for temperature
                                    fields: [
                                        "C°"
                                    ],
                                }
                            )
                        }
                    }
                })
            ]
        }
    }
})

const createdDataSample = await api.dataSampleApi.createOrModifyDataSampleFor(
    patient.id!,
    dataSampleToCreate
);
//tech-doc: STOP HERE

console.log(JSON.stringify(createdDataSample));

