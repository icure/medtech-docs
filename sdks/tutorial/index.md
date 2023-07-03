---
sidebar_position: 3
---
# Create a Doctor-centric App with iCure
In this tutorial, you will learn to create a simple doctor-centric application which uses iCure to securely store data.
By the end of it, you will be able to: 
- Instantiate a MedTech API.
- Create a Patient.
- Get your newly created Patient information. 
- Create data samples related to your patient.
- Get your newly created Data Sample information.
- Search for data samples satisfying some criteria.

## Pre-requisites
To begin working with the MedTech SDK, you need to have a valid iCure User.
You can obtain an iCure user in one of the following ways: 
- Launch a free iCure instance locally on your computer, which will automatically create a default user for you.
  To learn how to do this, refer to the [QuickStart](/sdks/quick-start/index.md) guide.
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

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:instantiate the api with existing keys-->
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
<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:get current user-->
```typescript
const loggedUser = await api.userApi.getLoggedUser()
expect(loggedUser.login).to.be.equal(iCureUserLogin)
```

<!-- output://code-samples/tutorial/doctor-centric-app/loggedUser.txt -->
<details>
<summary>loggedUser</summary>

```json
{
  "id": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "rev": "80-9e7d4c1261e3913204403fc2e9e1a668",
  "created": 1688371977279,
  "name": "Master HCP",
  "login": "master@e2b6e8.icure",
  "groupId": "ic-e2etest-medtech-docs",
  "healthcarePartyId": "e2b6e873-035b-4964-885b-5a90e99c43b4",
  "email": "master@e2b6e8.icure",
  "properties": {},
  "roles": {},
  "sharingDataWith": {
    "medicalInformation": {}
  },
  "authenticationTokens": {
    "c1284f05-cca6-444e-bdac-3cd134d54e6b": {
      "creationTime": 1688371977378,
      "validity": 86400
    }
  }
}
```
</details>

At this point, your user can get data but is not able to encrypt/decrypt it. For this, you need to create and assign them 
an RSA keypair.  


## Init user cryptography
You may have noticed the `withCryptoStrategies()` method in the instantiation of the api. This allows the user to load
his existing key pairs. If you don't have any existing key pair, you can instantiate the MedTech API without specifying
them:

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:instantiate api without keys-->
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

You can learn more about the Crypto Strategies [here](/sdks/explanations/crypto-strategies/crypto-strategies).

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
<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:create your first patient-->
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

<!-- output://code-samples/tutorial/doctor-centric-app/createdPatient.txt -->
<details>
<summary>createdPatient</summary>

```json
{
  "id": "27773ab2-593a-44f6-9bd3-1bef03bf5009",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-73b2b31bfab5c7c9ecacee242b8b42ff",
  "created": 1688375634875,
  "modified": 1688375634875,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "aesExchangeKeys": {},
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "transferKeys": {},
    "encryptedSelf": "M1zHU7qVDhRAw9chD+70EKYrWr1LFD6kqEbiWrxQ3XGhn4p6aRFu71dDREORETix",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "publicKeysForOaepWithSha256": {}
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

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:get your patient information-->
```typescript
const johnSnow = await api.patientApi.getPatient(createdPatient.id)
expect(createdPatient.id).to.be.equal(johnSnow.id)
```

<!-- output://code-samples/tutorial/doctor-centric-app/johnSnow.txt -->
<details>
<summary>johnSnow</summary>

```json
{
  "id": "27773ab2-593a-44f6-9bd3-1bef03bf5009",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-73b2b31bfab5c7c9ecacee242b8b42ff",
  "created": 1688375634875,
  "modified": 1688375634875,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "aesExchangeKeys": {},
    "hcPartyKeys": {},
    "privateKeyShamirPartitions": {},
    "transferKeys": {},
    "encryptedSelf": "M1zHU7qVDhRAw9chD+70EKYrWr1LFD6kqEbiWrxQ3XGhn4p6aRFu71dDREORETix",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

If you would like to know more about the information contained in Patient, go check the [References](../references/classes/Patient.md)

Let's now create some medical data for our patient. 

## Create your first data sample
You can use data samples to store information related to the health of a patient.
For example, when a patient goes to the doctor, we can use data samples to register the symptoms they experience and/or 
the results of measurements taken by the doctor. 

You can create a new data sample with `dataSampleApi.createOrModifyDataSample`. If you want to create many data samples at once, 
you should instead use `dataSampleApi.createOrModifyDataSamples`.
Link these data samples to the patient you created earlier through the `patientId` parameter.
A data sample must always be linked to a patient. 

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:create your patient first medical data-->
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

<!-- output://code-samples/tutorial/doctor-centric-app/createdData.txt -->
<details>
<summary>createdData</summary>

```text
[
  {
    "id": "829a4359-1475-4e52-bc4f-e113bd6b62a5",
    "qualifiedLinks": {},
    "batchId": "104fb57c-1c18-4c46-84f3-ccc3999b4bf1",
    "index": 0,
    "valueDate": 20220203111034,
    "openingDate": 20230703111354,
    "created": 1688375634920,
    "modified": 1688375634920,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
      "encryptedSelf": "hoDAp0UY8jQgpmOTYcKo+cUO7wQAAzFIguLB4yDIqXXk3hm8Xgnrdw78CAHfzf5mHvAKSvtcgf/Ofk4EVOt28VOH62lv3RxNwIjnF1lbuiLUEmCSM+vNAKn07A+7SGhK",
      "secretForeignKeys": [
        "31fd89a8-53db-4470-8f21-90f345f02de5"
      ],
      "cryptedForeignKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "publicKeysForOaepWithSha256": {}
    }
  },
  {
    "id": "c7af5940-4716-4972-86a8-080e82f8d150",
    "qualifiedLinks": {},
    "batchId": "104fb57c-1c18-4c46-84f3-ccc3999b4bf1",
    "index": 1,
    "valueDate": 20220203111034,
    "openingDate": 20230703111354,
    "created": 1688375634920,
    "modified": 1688375634920,
    "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
    "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
      "encryptedSelf": "KvTEKtw/aCP89y9W36t9KrXV4m35U99i8ffySDzyAG4+C6YeYtypRD2cSsNPdwULhmI+RhAyAvbVb2f0UW9ikcNJtETybxU1+Z1RgO9Ox1CIDpnu1KypE1kdPtqU9QvkXQs3huB4p8kthsZ36/95nw==",
      "secretForeignKeys": [
        "31fd89a8-53db-4470-8f21-90f345f02de5"
      ],
      "cryptedForeignKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "delegations": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "encryptionKeys": {
        "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
      },
      "publicKeysForOaepWithSha256": {}
    }
  }
]
```
</details>


When creating your data samples, iCure will automatically assign an id to each of them, similarly to what happens for patients.

But what happens if you don't know these ids? How can you find back your data?


## Search for data samples satisfying some criteria
Sometimes you will want to search for data which satisfies some specific criteria.

You can do this using the `filter` services of the apis, such as `dataSampleApi.filterDataSamples` or `patientApi.filterPatients`.
Let's say we would like to find back all medical data with the LOINC label corresponding to the body weight for the patient we have created.

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:Find your patient medical data following some criteria-->
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

<!-- output://code-samples/tutorial/doctor-centric-app/johnData.txt -->
<details>
<summary>johnData</summary>

```json
{
  "pageSize": 1,
  "totalSize": 1,
  "rows": [
    {
      "id": "c7af5940-4716-4972-86a8-080e82f8d150",
      "qualifiedLinks": {},
      "batchId": "104fb57c-1c18-4c46-84f3-ccc3999b4bf1",
      "index": 1,
      "valueDate": 20220203111034,
      "openingDate": 20230703111354,
      "created": 1688375634920,
      "modified": 1688375634920,
      "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
      "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
        "encryptedSelf": "KvTEKtw/aCP89y9W36t9KrXV4m35U99i8ffySDzyAG4+C6YeYtypRD2cSsNPdwULhmI+RhAyAvbVb2f0UW9ikcNJtETybxU1+Z1RgO9Ox1CIDpnu1KypE1kdPtqU9QvkXQs3huB4p8kthsZ36/95nw==",
        "secretForeignKeys": [
          "31fd89a8-53db-4470-8f21-90f345f02de5"
        ],
        "cryptedForeignKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
        },
        "delegations": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
        },
        "encryptionKeys": {
          "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
        },
        "publicKeysForOaepWithSha256": {}
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

## Get your newly created Data Sample information
Finally, you can also get the information of a specific data sample, if you know its id. 

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:get specific medical data information-->
```typescript
const johnWeight = await api.dataSampleApi.getDataSample(johnData.rows[0].id)
expect(johnData.rows[0].id).to.be.equal(johnWeight.id)
expect(johnWeight.content['en'].numberValue).to.be.equal(92.5)
expect(johnWeight.comment).to.be.equal('Weight')
```

<!-- output://code-samples/tutorial/doctor-centric-app/johnWeight.txt -->
<details>
<summary>johnWeight</summary>

```json
{
  "id": "c7af5940-4716-4972-86a8-080e82f8d150",
  "qualifiedLinks": {},
  "batchId": "104fb57c-1c18-4c46-84f3-ccc3999b4bf1",
  "index": 1,
  "valueDate": 20220203111034,
  "openingDate": 20230703111354,
  "created": 1688375634920,
  "modified": 1688375634920,
  "author": "6a541dfb-40d9-41f5-ba76-e3a5e277813f",
  "responsible": "e2b6e873-035b-4964-885b-5a90e99c43b4",
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
    "encryptedSelf": "KvTEKtw/aCP89y9W36t9KrXV4m35U99i8ffySDzyAG4+C6YeYtypRD2cSsNPdwULhmI+RhAyAvbVb2f0UW9ikcNJtETybxU1+Z1RgO9Ox1CIDpnu1KypE1kdPtqU9QvkXQs3huB4p8kthsZ36/95nw==",
    "secretForeignKeys": [
      "31fd89a8-53db-4470-8f21-90f345f02de5"
    ],
    "cryptedForeignKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "delegations": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "encryptionKeys": {
      "e2b6e873-035b-4964-885b-5a90e99c43b4": {}
    },
    "publicKeysForOaepWithSha256": {}
  }
}
```
</details>

To know more about the Data Sample information, go check the [References](/sdks/references/classes/DataSample.md)

## What's next ? 
Congratulations, you are now able to use the basic functions of the iCure MedTech SDK. 
However, the SDK offers a lot of other services: head to the [How-To](/sdks/how-to/index) section to discover all of them. 
You can also check the different [In-Depth Explanations](/sdks/explanations), to understand fully what's happening 
behind each service of iCure.
