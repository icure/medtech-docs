//tech-doc: Prepare for iCure - FHIR Bridge API requests
import fetch from "node-fetch";

const host = 'https://dxm.icure.dev';
const hcpId = '2d205ac4-c8c9-428b-b68e-d9381da235d2';

let key = {
    key: /* truncate */'308204bd020100300d06092a864886f70d0101010500048204a7308204a30201000282010100e36d676734dfd867d592346e5634a1d487b9209e015964ecf225b2ae6d211562079a07cf8977836889173f9889ff2ac26a95a8fd83b4216926004559344797d6e1fbdec196a99b75fa696631bc0eef5b1a3c96785fcbdf7007be4f2ef751d5eafbfe3abe4669fbb56d4cf119d482646f75ae882492b13ce4aaa002a5346fdabedbc7175a5206dc4af9181d13a2425d4d22bb63b79fa117a4001be9764029de6bfbb6896c083f366e5cb5d48a7976618cf2e66e6389a3b6926188f34eac81565610659388a66e36b4ab61df6a3103cfad46a45ba6c90df758b934a034fe2d19ca687ad6ecb3a763168bd7cd674514eca5d146963e39d27ccf0498818a9b91046d0203010001028201004d696a667f61683463c669d15ac77c842e948dad2ab166809ea5c54dc8f89762304b363866c6c6f478a170b4b7d822925d9c4692d0572a7e3380a91a4588cefec61a29070505035523a0e7b7ab16fc532ab98fd0366f5b4533658c6764a8b6e34ed608e1c66f01ce0dffc01b7631d204fc6e258a296269e33dcecc47b6731265fb761e79f92129513a37567dba3b3a96931b6d2b9b61eff46a403507ce603c82ab3363c8c54ad1f5d2f04b1b5ea444d66721be007636337a116c4070cbc4aaf577a0326f0ef2152804db3c3ed584e4b56d0f5dc16cc47fcf0ecd822b7bebeed1803b823d19c1e7e20e14568bbe069aba41f7ba34988f9991aac1a9ab392cd00302818100f62e18adc9c7608f073cd047628d9cf2efd46728b09946c5953662782e14db24f4e149466df056602aa4219e43cf3a551c0736d21d9f08fff75ee8495dfea7afdef8bf90503513cd7d7ce34793785f63f7d10f2ffb6e945beb8e872f911e31af5fcbe23016cf9386fc0e4329a47d7081a09bf0375ef0d5db7dd943d45e164bbf02818100ec7fcfc0e0bcd1935c10df85e31e5688e5e491539a3610ddbfe5cb34969832210fd1697b40b27010cd41d885953c10c4e86f2a0c0a4690a9309d46556c7809213e3afb42c572535bef80a34f7bbed05a8c264a0a0ffea45a9b463a5603d02a32489c32e98a858552c04060bcabce35fc12da2b2373360b7d361136f71f0cead30281804e29849c691c6c83fd004a00e041a63b5bfa4c6696eb9394d833544064212b1328ccfebee5d91113a776455642a1611bf4b235adb0c9f5c98f790ab780a882054cfe1d946c62edcea8b126586b72249750ef87aaec61c7a907b95122c1289d0dd9949a543a69dda556121130ff90f44fb3f6cee645b6a1aff6dd2cb418cb6b7102818100c8874310073ef2f0e0e289b4cbb400a9c94c3a114a33c7af4eb438cdd957294231585df91d0d6fca3f50329869c6696d9cac0d59f2288d26784b12c501d8f1dcd71849cdfeff064170dd811bb7103f3857976bb60683e2b5d4ed022fc6c1edd57f0dba799d73c36d3c081a3e3feaf4894d2ee1df08246e2f77f5b6c668f499f302818018fc063dc44debae1b5bd5443150edaa8d87511a9a9c180cf566f801ed46091c798a2785ca7b99fc798badd6bbc3dfc00c37c78340c9e90d1fec1efaf5f137b59ff390608f71af775cf7a7322a0a7cc7d68f271b3ffb22b2bb4e662f38a843364e57f7207af8f1bb952875dafccf015fed418542acb794fb1c53878b40fdc0bc'
}

let credentials = /* truncate */'Y3ZAdGFrdGlrLmNvbTpjMjdiZGUxNi0yN2E1LTRjMDctOTQ4MC1mYjdmOWMzOGY1MTQ='

let keyPutInCache = await fetch(`${host}/rest/icdx/v1/keychain/${hcpId}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
    },
    body: JSON.stringify(key)
})
    .then(response => response.json());

console.log(`Key put in cache : ${keyPutInCache}`)

//tech-doc: Create FHIR Patient
let patientToCreate = {
    resourceType: "Patient",
    id: "pat1",
    text: {
        status: "generated",
        div: "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n      \n      <p>Patient Donald DUCK @ Acme Healthcare, Inc. MR = 654321</p>\n    \n    </div>"
    },
    identifier: [
        {
            use: "usual",
            type: {
                coding: [
                    {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                        code: "MR"
                    }
                ]
            },
            system: "urn:oid:0.1.2.3.4.5.6.7",
            value: "654321"
        }
    ],
    active: true,
    name: [
        {
            use: "official",
            family: "Donald",
            given: [
                "Duck"
            ]
        }
    ],
    gender: "male",
    photo: [
        {
            contentType: "image/gif",
            data: "R0lGODlhEwARAPcAAAAAAAAA/+9aAO+1AP/WAP/eAP/eCP/eEP/eGP/nAP/nCP/nEP/nIf/nKf/nUv/nWv/vAP/vCP/vEP/vGP/vIf/vKf/vMf/vOf/vWv/vY//va//vjP/3c//3lP/3nP//tf//vf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAEALAAAAAATABEAAAi+AAMIDDCgYMGBCBMSvMCQ4QCFCQcwDBGCA4cLDyEGECDxAoAQHjxwyKhQAMeGIUOSJJjRpIAGDS5wCDly4AALFlYOgHlBwwOSNydM0AmzwYGjBi8IHWoTgQYORg8QIGDAwAKhESI8HIDgwQaRDI1WXXAhK9MBBzZ8/XDxQoUFZC9IiCBh6wEHGz6IbNuwQoSpWxEgyLCXL8O/gAnylNlW6AUEBRIL7Og3KwQIiCXb9HsZQoIEUzUjNEiaNMKAAAA7"
        }
    ],
    contact: [
        {
            relationship: [
                {
                    coding: [
                        {
                            system: "http://terminology.hl7.org/CodeSystem/v2-0131",
                            code: "E"
                        }
                    ]
                }
            ],
            organization: {
                reference: "Organization/1",
                display: "Walt Disney Corporation"
            }
        }
    ],
    managingOrganization: {
        reference: "Organization/1",
        display: "ACME Healthcare, Inc"
    },
    link: [
        {
            other: {
                reference: "Patient/pat2"
            },
            type: "seealso"
        }
    ]
}

let createdPatient = await fetch(`${host}/rest/fhir/r4/Patient`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
    },
    body: JSON.stringify(patientToCreate)
})
    .then(response => response.json());

console.log(`Created FHIR patient : ${JSON.stringify(createdPatient, null, ' ')}`)

//tech-doc: Read FHIR Patient
let fetchedPatient = await fetch(`${host}/rest/fhir/r4/Patient/pat1`, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
    }
})
    .then(response => response.json());

console.log(`Fetched FHIR patient : ${JSON.stringify(fetchedPatient, null, ' ')}`)

//tech-doc: Delete FHIR Patient
let deletedPatient = await fetch(`${host}/rest/fhir/r4/Patient?name=Donald`, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
    }
});

//tech-doc: Create FHIR Observation
let observationToCreate = {
    "resourceType": "Observation",
    "id": "f001",
    "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: f001</p><p><b>identifier</b>: 6323 (OFFICIAL)</p><p><b>status</b>: final</p><p><b>code</b>: Glucose [Moles/volume] in Blood <span>(Details : {LOINC code '15074-8' = 'Glucose [Moles/volume] in Blood', given as 'Glucose [Moles/volume] in Blood'})</span></p><p><b>subject</b>: <a>P. van de Heuvel</a></p><p><b>effective</b>: 02/04/2013 9:30:10 AM --&gt; (ongoing)</p><p><b>issued</b>: 03/04/2013 3:30:10 PM</p><p><b>performer</b>: <a>A. Langeveld</a></p><p><b>value</b>: 6.3 mmol/l<span> (Details: UCUM code mmol/L = 'mmol/L')</span></p><p><b>interpretation</b>: High <span>(Details : {http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation code 'H' = 'High', given as 'High'})</span></p><h3>ReferenceRanges</h3><table><tr><td>-</td><td><b>Low</b></td><td><b>High</b></td></tr><tr><td>*</td><td>3.1 mmol/l<span> (Details: UCUM code mmol/L = 'mmol/L')</span></td><td>6.2 mmol/l<span> (Details: UCUM code mmol/L = 'mmol/L')</span></td></tr></table></div>"
    },
    "identifier": [
        {
            "use": "official",
            "system": "http://www.bmc.nl/zorgportal/identifiers/observations",
            "value": "6323"
        }
    ],
    "status": "final",
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "15074-8",
                "display": "Glucose [Moles/volume] in Blood"
            }
        ]
    },
    "subject": {
        "reference": "9a106b7f-2fa1-4b54-b3cb-c29cbfebe2ee",
        "display": "P. van de Heuvel"
    },
    "effectivePeriod": {
        "start": "2013-04-02T09:30:10+01:00"
    },
    "issued": "2013-04-03T15:30:10+01:00",
    "performer": [
        {
            "reference": "Practitioner/f005",
            "display": "A. Langeveld"
        }
    ],
    "valueQuantity": {
        "value": 6.3,
        "unit": "mmol/l",
        "system": "http://unitsofmeasure.org",
        "code": "mmol/L"
    },
    "interpretation": [
        {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                    "code": "H",
                    "display": "High"
                }
            ]
        }
    ],
    "referenceRange": [
        {
            "low": {
                "value": 3.1,
                "unit": "mmol/l",
                "system": "http://unitsofmeasure.org",
                "code": "mmol/L"
            },
            "high": {
                "value": 6.2,
                "unit": "mmol/l",
                "system": "http://unitsofmeasure.org",
                "code": "mmol/L"
            }
        }
    ]
}

let createdObservation = await fetch(`${host}/rest/fhir/r4/Observation`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
    },
    body: JSON.stringify(observationToCreate)
})
    .then(response => response.json());

console.log(`Created FHIR observation : ${JSON.stringify(createdObservation, null, ' ')}`)

//tech-doc: Read FHIR Observation
let fetchedObservation = await fetch(`${host}/rest/fhir/r4/Observation/f001`, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
    }
})
    .then(response => response.json());

console.log(`Fetched FHIR observation : ${JSON.stringify(fetchedObservation, null, ' ')}`)

//tech-doc: Bundle FHIR Resource transaction creation
let bundleToCreate = {
    "type": "transaction",
    "entry": [{
        "resource": {
            "resourceType": "Patient",
            "id": "pat2",
            "text": {
                "status": "generated",
                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n\t\t\t<p>Patient Donald D DUCK @ Acme Healthcare, Inc. MR = 123456</p>\n\t\t</div>"
            },
            "identifier": [
                {
                    "use": "usual",
                    "type": {
                        "coding": [
                            {
                                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                "code": "MR"
                            }
                        ]
                    },
                    "system": "urn:oid:0.1.2.3.4.5.6.7",
                    "value": "123456"
                }
            ],
            "active": true,
            "name": [
                {
                    "use": "official",
                    "family": "Donald",
                    "given": [
                        "Duck",
                        "D"
                    ]
                }
            ],
            "gender": "other",
            "_gender": {
                "extension": [
                    {
                        "url": "http://example.org/Profile/administrative-status",
                        "valueCodeableConcept": {
                            "coding": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0001",
                                    "code": "A",
                                    "display": "Ambiguous"
                                }
                            ]
                        }
                    }
                ]
            },
            "photo": [
                {
                    "contentType": "image/gif",
                    "data": "R0lGODlhEwARAPcAAAAAAAAA/+9aAO+1AP/WAP/eAP/eCP/eEP/eGP/nAP/nCP/nEP/nIf/nKf/nUv/nWv/vAP/vCP/vEP/vGP/vIf/vKf/vMf/vOf/vWv/vY//va//vjP/3c//3lP/3nP//tf//vf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAEALAAAAAATABEAAAi+AAMIDDCgYMGBCBMSvMCQ4QCFCQcwDBGCA4cLDyEGECDxAoAQHjxwyKhQAMeGIUOSJJjRpIAGDS5wCDly4AALFlYOgHlBwwOSNydM0AmzwYGjBi8IHWoTgQYORg8QIGDAwAKhESI8HIDgwQaRDI1WXXAhK9MBBzZ8/XDxQoUFZC9IiCBh6wEHGz6IbNuwQoSpWxEgyLCXL8O/gAnylNlW6AUEBRIL7Og3KwQIiCXb9HsZQoIEUzUjNEiaNMKAAAA7"
                }
            ],
            "managingOrganization": {
                "reference": "Organization/1",
                "display": "ACME Healthcare, Inc"
            },
            "link": [
                {
                    "other": {
                        "reference": "Patient/pat1"
                    },
                    "type": "seealso"
                }
            ]
        }
    }, {
        "resource": {
            "resourceType": "Observation",
            "id": "f005",
            "text": {
                "status": "generated",
                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: f005</p><p><b>identifier</b>: 6327 (OFFICIAL)</p><p><b>status</b>: final</p><p><b>code</b>: Hemoglobin [Mass/volume] in Blood <span>(Details : {LOINC code '718-7' = 'Hemoglobin [Mass/volume] in Blood', given as 'Hemoglobin [Mass/volume] in Blood'})</span></p><p><b>subject</b>: <a>P. van de Heuvel</a></p><p><b>effective</b>: 05/04/2013 10:30:10 AM --&gt; 05/04/2013 10:30:10 AM</p><p><b>issued</b>: 05/04/2013 3:30:10 PM</p><p><b>performer</b>: <a>A. Langeveld</a></p><p><b>value</b>: 7.2 g/dl<span> (Details: UCUM code g/dL = 'g/dL')</span></p><p><b>interpretation</b>: Low <span>(Details : {http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation code 'L' = 'Low', given as 'Low'})</span></p><h3>ReferenceRanges</h3><table><tr><td>-</td><td><b>Low</b></td><td><b>High</b></td></tr><tr><td>*</td><td>7.5 g/dl<span> (Details: UCUM code g/dL = 'g/dL')</span></td><td>10 g/dl<span> (Details: UCUM code g/dL = 'g/dL')</span></td></tr></table></div>"
            },
            "identifier": [
                {
                    "use": "official",
                    "system": 	"http://www.bmc.nl/zorgportal/identifiers/observations",
                    "value": "6327"
                }
            ],
            "status": "final",
            "code": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "718-7",
                        "display": "Hemoglobin [Mass/volume] in Blood"
                    }
                ]
            },
            "subject": {
                "reference": "9a106b7f-2fa1-4b54-b3cb-c29cbfebe2ee",
                "display": "P. van de Heuvel"
            },
            "effectivePeriod": {
                "start": "2013-04-05T10:30:10+01:00",
                "end": "2013-04-05T10:30:10+01:00"
            },
            "issued": "2013-04-05T15:30:10+01:00",
            "performer": [
                {
                    "reference": "Practitioner/f005",
                    "display": "A. Langeveld"
                }
            ],
            "valueQuantity": {
                "value": 7.2,
                "unit": "g/dl",
                "system": "http://unitsofmeasure.org",
                "code": "g/dL"
            },
            "interpretation": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                            "code": "L",
                            "display": "Low"
                        }
                    ]
                }
            ],
            "referenceRange": [
                {
                    "low": {
                        "value": 7.5,
                        "unit": "g/dl",
                        "system": "http://unitsofmeasure.org",
                        "code": "g/dL"
                    },
                    "high": {
                        "value": 10,
                        "unit": "g/dl",
                        "system": "http://unitsofmeasure.org",
                        "code": "g/dL"
                    }
                }
            ],
            "valueCodeableConcept": {
                "coding": [{
                    "system": "CD-ITEM",
                    "code": "adr",
                    "version": "1"
                }],
                "id": "CD-ITEM|adr|1"
            }
        }
    }]
}

let createdBundle = await fetch(`${host}/rest/fhir/r4`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`
    },
    body: JSON.stringify(bundleToCreate)
})
    .then(response => response.json());

console.log(`Created FHIR Bundle : ${JSON.stringify(createdBundle, null, ' ')}`)

//tech-doc: Search FHIR patients
let searchedPatients = await fetch(`${host}/rest/fhir/r4/Patient?_id=pat2&name=Donald&_has%3AObservation%3A_tag=http%3A%2F%2Floinc.org%7C718-7`, {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`
    }
})
    .then(response => response.json());

console.log(`Searched FHIR patients : ${JSON.stringify(searchedPatients, null, ' ')}`)

//tech-doc: Search FHIR Observations
let searchedObservations = await fetch(`${host}/rest/fhir/r4/Observation?_tag=http%3A%2F%2Floinc.org%7C15074-8`, {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`
    }
})
    .then(response => response.json());

console.log(`Searched FHIR observations : ${JSON.stringify(searchedObservations, null, ' ')}`)