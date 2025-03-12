---
sidebar_position: 3
---
# Create a Doctor-centric App with iCure
In this tutorial, you will learn to create a simple doctor-centric application which uses iCure to securely store data.
By the end of it, you will be able to: 
- Instantiate a MedTech API.
- Create a Patient.
- Get your newly created Patient information. 
- Create {{services}} related to your patient.
- Get your newly created {{Service}} information.
- Search for {{services}} satisfying some criteria.

## Pre-requisites
To begin working with the MedTech SDK, you need to have a valid iCure User.
You can obtain an iCure user in one of the following ways: 
- Launch a free iCure instance locally on your computer, which will automatically create a default user for you.
  To learn how to do this, refer to the [QuickStart](/{{sdk}}/quick-start/index.md) guide.
- Register on the iCure Cockpit to get your iCure Cloud User.
  To learn how to do this, refer to the [How to register on Cockpit](/cockpit/how-to/how-to-create-your-account) guide.

The iCure User credentials and the host URL of the following steps will depend on your choice.    

## Initialize the project
To start working with the iCure MedTech SDK, add the following dependencies to your package.json file : 
- `@icure/medical-device-sdk`
- `isomorphic-fetch`
- `node-localstorage`


## Init your MedTech API
Once you have your user credentials, you can start using the iCure MedTech SDK.
Create an instance of a MedTech API object using your credentials and the desired iCure host.
This api object will automatically manage the authentication to the iCure backend and give you access to all SDK services.

Provide the iCure host to use and your user credentials in this API.

<!-- file://code-samples/{{sdk}}/tutorial/doctor-centric-app/index.mts snippet:instantiate the api with existing keys-->
```typescript
import 'isomorphic-fetch'
import { medTechApi } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'

const iCureHost = process.env.ICURE_URL!
const iCureUserPassword = process.env.ICURE_USER_PASSWORD!
const iCureUserLogin = process.env.ICURE_USER_NAME!
const iCureUserPubKey = process.env.ICURE_USER_PUB_KEY!
const iCureUserPrivKey = process.env.ICURE_USER_PRIV_KEY!

const apiWithKeys = await medTechApi()
  .withICureBaseUrl(iCureHost)
  .withUserName(iCureUserLogin)
  .withPassword(iCureUserPassword)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(
    new SimpleMedTechCryptoStrategies([
      { publicKey: iCureUserPubKey, privateKey: iCureUserPrivKey },
    ]),
  )
  .build()
```

After instantiating your API, you can now get the information of your logged user. 
<!-- file://code-samples/{{sdk}}/tutorial/doctor-centric-app/index.mts snippet:get current user-->
```typescript
const loggedUser = await api.userApi.getLoggedUser()
expect(loggedUser.login).to.be.equal(iCureUserLogin)
```

<!-- output://code-samples/{{sdk}}/tutorial/doctor-centric-app/loggedUser.txt -->
<details>
<summary>loggedUser</summary>

```json
{
  "id": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "rev": "56-9ce9dee823b57cd2705a0f4efa3f8670",
  "created": 1679919731079,
  "name": "Master HCP",
  "login": "master@b16baa.icure",
  "groupId": "ic-e2etest-medtech-docs",
  "healthcarePartyId": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "email": "master@b16baa.icure",
  "properties": {},
  "roles": {},
  "sharingDataWith": {
    "medicalInformation": {}
  },
  "authenticationTokens": {}
}
```
</details>

At this point, your user can get data but is not able to encrypt/decrypt it. For this, you need to create and assign them 
an RSA keypair.  


## Init user cryptography
You may have noticed the `withCryptoStrategies()` method in the instantiation of the api. This allows the user to load
his existing key pairs. If you don't have any existing key pair, you can instantiate the MedTech API without specifying
them:

<!-- file://code-samples/{{sdk}}/tutorial/doctor-centric-app/index.mts snippet:instantiate api without keys-->
```typescript
const apiWithoutKeys = await medTechApi()
  .withICureBaseUrl(iCureHost)
  .withUserName(iCureUserLogin)
  .withPassword(iCureUserPassword)
  .withCrypto(webcrypto as any)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
```

If you do not specify a key pair during the instantiation, the API will try to retrieve it from the local storage. If 
the local storage contains no key, then a new pair will be created.

:::info

You can learn more about the Crypto Strategies [here](/{{sdk}}/explanations/end-to-end-encryption/crypto-strategies).

:::

:::tip

If your solution is a web app, be conscious that if you store the keypair into the browser data and the user deletes it,
they will lose his RSA keypair. Make sure to store the keypair in a secured place, and re-import it with this method.

:::

:::caution

If you're working with Node and would like to store the user keypair in the local storage, you will have to initialize 
it first.

<details>
<summary>Example</summary>

```typescript
import { LocalStorage } from 'node-localstorage'

const tmp = os.tmpdir()
console.log('Saving keys in ' + tmp)
;(global as any).localStorage = new LocalStorage(tmp, 5 * 1024 * 1024 * 1024)
;(global as any).Storage = ''
```
q
</details>

:::

Now that your API is properly initialized and that your user can create encrypted data, let's
check how you can create a patient with iCure.

## Create your first patient
In most doctor-centric applications, you will have to create patients.

To do this, call the `api.patientApi.createOrModifyPatient` service. 
<!-- file://code-samples/{{sdk}}/tutorial/doctor-centric-app/index.mts snippet:create your first patient-->
```typescript
import { Patient } from '@icure/medical-device-sdk'

const createdPatient = await api.patientApi.createOrModifyPatient(
  new Patient({
    firstName: 'John',
    lastName: 'Snow',
    gender: 'male',
    note: 'Winter is coming',
  }),
)
console.log(`Your new patient id : ${createdPatient.id}`)
```

<!-- output://code-samples/{{sdk}}/tutorial/doctor-centric-app/createdPatient.txt -->
<details>
<summary>createdPatient</summary>

```json
{
  "id": "ca9cff67-cc51-45ab-87e0-38cea4604afb",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-484251d1b7b086b1fb5be20e58aee04a",
  "created": 1679926586745,
  "modified": 1679926586745,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "firstName": "John",
  "lastName": "Snow",
  "note": "Winter is coming",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "John"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Snow",
      "text": "Snow John",
      "use": "official"
    }
  ],
  "addresses": [],
  "gender": "male",
  "birthSex": "unknown",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {},
    "transferKeys": {},
    "encryptedSelf": "bel9gPaPivU1l1PBrR7wuqtiEvAHm/tKGDaJEqh64BkTxpToM+eVWB90AP+LPui9",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>

:::info

To call these services, you always have to fully [initialize your MedTechApi](#init-your-medtech-api) and init 
[your user cryptography](#init-user-cryptography)

:::

Whenever you create a new patient (or any other type of entity) iCure will automatically generate and assign a UUID to it.
You will need this id to retrieve the information of your patient later. 

## Get your newly created Patient information
You can retrieve patient information using `patientApi.getPatient` with the id of the patient you want to retrieve. 

<!-- file://code-samples/{{sdk}}/tutorial/doctor-centric-app/index.mts snippet:get your patient information-->
```typescript
const johnSnow = await api.patientApi.getPatient(createdPatient.id)
expect(createdPatient.id).to.be.equal(johnSnow.id)
```

<!-- output://code-samples/{{sdk}}/tutorial/doctor-centric-app/johnSnow.txt -->
<details>
<summary>johnSnow</summary>

```json
{
  "id": "ca9cff67-cc51-45ab-87e0-38cea4604afb",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-484251d1b7b086b1fb5be20e58aee04a",
  "created": 1679926586745,
  "modified": 1679926586745,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "firstName": "John",
  "lastName": "Snow",
  "note": "Winter is coming",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "John"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Snow",
      "text": "Snow John",
      "use": "official"
    }
  ],
  "addresses": [],
  "gender": "male",
  "birthSex": "unknown",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {},
    "transferKeys": {},
    "encryptedSelf": "bel9gPaPivU1l1PBrR7wuqtiEvAHm/tKGDaJEqh64BkTxpToM+eVWB90AP+LPui9",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>

If you would like to know more about the information contained in Patient, go check the [References](../references/classes/Patient.md)

Let's now create some medical data for our patient. 

## Create your first {{service}}
You can use {{services}} to store information related to the health of a patient.
For example, when a patient goes to the doctor, we can use {{services}} to register the symptoms they experience and/or 
the results of measurements taken by the doctor. 

You can create a new {{service}} with `dataSampleApi.createOrModifyDataSample`. If you want to create many {{services}} at once, 
you should instead use `dataSampleApi.createOrModifyDataSamples`.
Link these {{services}} to the patient you created earlier through the `patientId` parameter.
A {{service}} must always be linked to a patient. 

<!-- file://code-samples/{{sdk}}/tutorial/doctor-centric-app/index.mts snippet:create your patient first medical data-->
```typescript
import { CodingReference, Content, DataSample } from '@icure/medical-device-sdk'

const createdData = await api.dataSampleApi.createOrModifyDataSamplesFor(johnSnow.id, [
  new DataSample({
    labels: new Set([new CodingReference({ type: 'LOINC', code: '29463-7', version: '2' })]),
    content: { en: new Content({ numberValue: 92.5 }) },
    valueDate: 20220203111034,
    comment: 'Weight',
  }),
  new DataSample({
    labels: new Set([new CodingReference({ type: 'LOINC', code: '8302-2', version: '2' })]),
    content: { en: new Content({ numberValue: 187 }) },
    valueDate: 20220203111034,
    comment: 'Height',
  }),
])
```

<!-- output://code-samples/{{sdk}}/tutorial/doctor-centric-app/createdData.txt -->
<details>
<summary>createdData</summary>

```text
[
  {
    "id": "021666bd-cba7-416e-909f-3a2aa8b1905d",
    "qualifiedLinks": {},
    "batchId": "5d99ab7b-f2e0-4405-a936-c530a2f13c4e",
    "index": 0,
    "valueDate": 20220203111034,
    "openingDate": 20230327141627,
    "created": 1679926587329,
    "modified": 1679926587329,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "comment": "Height",
    "identifiers": [],
    "healthcareElementIds": {},
    "canvasesIds": {},
    "content": {
      "en": {
        "numberValue": 187,
        "compoundValue": [],
        "ratio": [],
        "range": []
      }
    },
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "52128660-a16c-4b56-99d1-01cbd297addb"
      ],
      "cryptedForeignKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "e717b684-f9c6-479d-b023-d58623bae12d",
    "qualifiedLinks": {},
    "batchId": "5d99ab7b-f2e0-4405-a936-c530a2f13c4e",
    "index": 1,
    "valueDate": 20220203111034,
    "openingDate": 20230327141627,
    "created": 1679926587329,
    "modified": 1679926587329,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "comment": "Weight",
    "identifiers": [],
    "healthcareElementIds": {},
    "canvasesIds": {},
    "content": {
      "en": {
        "numberValue": 92.5,
        "compoundValue": [],
        "ratio": [],
        "range": []
      }
    },
    "codes": {},
    "labels": {},
    "systemMetaData": {
      "secretForeignKeys": [
        "52128660-a16c-4b56-99d1-01cbd297addb"
      ],
      "cryptedForeignKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  }
]
```
</details>


When creating your {{services}}, iCure will automatically assign an id to each of them, similarly to what happens for patients.

But what happens if you don't know these ids? How can you find back your data?


## Search for {{services}} satisfying some criteria
Sometimes you will want to search for data which satisfies some specific criteria.

You can do this using the `filter` services of the apis, such as `dataSampleApi.filterDataSamples` or `patientApi.filterPatients`.
Let's say we would like to find back all medical data with the LOINC label corresponding to the body weight for the patient we have created.

<!-- file://code-samples/{{sdk}}/tutorial/doctor-centric-app/index.mts snippet:Find your patient medical data following some criteria-->
```typescript
import { DataSampleFilter } from '@icure/medical-device-sdk'
import { SimpleMedTechCryptoStrategies } from '@icure/medical-device-sdk'

const johnData = await api.dataSampleApi.filterDataSample(
  await new DataSampleFilter(api)
    .forDataOwner(api.dataOwnerApi.getDataOwnerIdOf(loggedUser))
    .forPatients([johnSnow])
    .byLabelCodeDateFilter('LOINC', '29463-7')
    .build(),
)

expect(johnData.rows.length).to.be.equal(1)
expect(johnData.pageSize).to.be.equal(1)
expect(johnData.rows[0].content['en'].numberValue).to.be.equal(92.5)
expect(johnData.rows[0].comment).to.be.equal('Weight')
```

<!-- output://code-samples/{{sdk}}/tutorial/doctor-centric-app/johnData.txt -->
<details>
<summary>johnData</summary>

```json
{
  "pageSize": 1,
  "totalSize": 1,
  "rows": [
    {
      "id": "e717b684-f9c6-479d-b023-d58623bae12d",
      "qualifiedLinks": {},
      "batchId": "5d99ab7b-f2e0-4405-a936-c530a2f13c4e",
      "index": 1,
      "valueDate": 20220203111034,
      "openingDate": 20230327141627,
      "created": 1679926587329,
      "modified": 1679926587329,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "comment": "Weight",
      "identifiers": [],
      "healthcareElementIds": {},
      "canvasesIds": {},
      "content": {
        "en": {
          "numberValue": 92.5,
          "compoundValue": [],
          "ratio": [],
          "range": []
        }
      },
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "52128660-a16c-4b56-99d1-01cbd297addb"
        ],
        "cryptedForeignKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>


Filters offer you a lot of possibilities. Go have a look at 
the [How To search data in iCure using complex filters](../how-to/how-to-filter-data-with-advanced-search-criteria.md) 
guide to know more about them. 

## Get your newly created {{Service}} information
Finally, you can also get the information of a specific {{service}}, if you know its id. 

<!-- file://code-samples/{{sdk}}/tutorial/doctor-centric-app/index.mts snippet:get specific medical data information-->
```typescript
const johnWeight = await api.dataSampleApi.getDataSample(johnData.rows[0].id)
expect(johnData.rows[0].id).to.be.equal(johnWeight.id)
expect(johnWeight.content['en'].numberValue).to.be.equal(92.5)
expect(johnWeight.comment).to.be.equal('Weight')
```

<!-- output://code-samples/{{sdk}}/tutorial/doctor-centric-app/johnWeight.txt -->
<details>
<summary>johnWeight</summary>

```json
{
  "id": "e717b684-f9c6-479d-b023-d58623bae12d",
  "qualifiedLinks": {},
  "batchId": "5d99ab7b-f2e0-4405-a936-c530a2f13c4e",
  "index": 1,
  "valueDate": 20220203111034,
  "openingDate": 20230327141627,
  "created": 1679926587329,
  "modified": 1679926587329,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "comment": "Weight",
  "identifiers": [],
  "healthcareElementIds": {},
  "canvasesIds": {},
  "content": {
    "en": {
      "numberValue": 92.5,
      "compoundValue": [],
      "ratio": [],
      "range": []
    }
  },
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "52128660-a16c-4b56-99d1-01cbd297addb"
    ],
    "cryptedForeignKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>

To know more about the {{Service}} information, go check the [References](/{{sdk}}/references/classes/DataSample.md)

## What's next ? 
Congratulations, you are now able to use the basic functions of the iCure MedTech SDK. 
However, the SDK offers a lot of other services: head to the [How-To](/{{sdk}}/how-to/index) section to discover all of them. 
You can also check the different [In-Depth Explanations](/{{sdk}}/explanations), to understand fully what's happening 
behind each service of iCure.
