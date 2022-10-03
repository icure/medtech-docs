---
sidebar_position: 3
---
# Create a Doctor-centric App with iCure
In this tutorial, you will learn to create a simple doctor-centric application which uses iCure to securely store data.
By the end of it, you will be able to : 
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
  To learn how to do this refer to the [QuickStart](../quick-start.md) guide.
- Register on the iCure Cockpit to get your iCure Cloud User.
  To learn how to do this refer to the [How to register on Cockpit](../../cockpit/how-to/how-to-register.md) guide.

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

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:instantiate the api-->
```typescript
const iCureHost = process.env.ICURE_URL!
const iCureUserPassword = process.env.ICURE_USER_PASSWORD!
const iCureUserLogin = process.env.ICURE_USER_NAME!

const api = await medTechApi()
    .withICureBasePath(iCureHost)
    .withUserName(iCureUserLogin)
    .withPassword(iCureUserPassword)
    .withCrypto(webcrypto as any)
    .build()
```

After instantiating your API, you can now get the information of your logged user. 
<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:get current user-->
```typescript
const loggedUser = await api.userApi.getLoggedUser()
expect(loggedUser.login).to.be.equal(iCureUserLogin)
```

At this point, your user can get data but is not able to encrypt/decrypt it. For this, you need to create and assign him 
an RSA keypair.  


## Init user cryptography
`initUserCrypto` will create an RSA Keypair and assign it to your user. This way, (s)he will be able to encrypt/decrypt 
data.

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:init user crypto-->
```typescript
await api.initUserCrypto()
```

This works for the first time you're initializing user cryptography. However, you don't want to create an RSA keypair 
each time your user connects. 

If your user already has her/his RSA keypair, call `initUserCrypto` providing her/his existing keypair, in order to 
initialize the cryptography properly. 

Here is an example on how to do it :
<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:init user crypto with existing key-->
```typescript
const iCureUserPubKey = process.env.ICURE_USER_PUB_KEY!
const iCureUserPrivKey = process.env.ICURE_USER_PRIV_KEY!
await api.initUserCrypto(false, { publicKey: iCureUserPubKey, privateKey: iCureUserPrivKey })
```
For more information about this method, go to the [References: initUserCrypto](../references/classes/MedTechApi.md#initusercrypto)

:::tip

If your solution is a web app, be conscious that if you store the keypair into the browser data and the user deletes them,
he will lose his RSA keypair. Make sure to store them in a secured place, and re-import it with this method.
Also, if you're working with Node and would like to store user keypair in the local storage, make sure to initialize it 
first. 

:::

Now that your API is properly initialized and that your user can create encrypted data, let's
check how you can create a patient with iCure.

## Create your first patient
In most doctor-centric applications, you will have to create patients.

To do this, call the `api.patientApi.createOrModifyPatient` service. 
<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:create your first patient-->
```typescript
const createdPatient = await api.patientApi.createOrModifyPatient(new Patient({
    firstName: 'John',
    lastName: 'Snow',
    gender: 'male',
    note: 'Winter is coming'
}))
console.log(`Your new patient id : ${createdPatient.id}`);
```

:::info

To call those services, you always have to fully [initialize your MedTechApi](#init-your-medtech-api) and init 
[your user cryptography](#init-user-cryptography)

:::

Whenever you create a new patient (or any other type of entity) iCure will automatically generate and assign an UUID to it.
You will need this id to retrieve the information of your patient later. 

## Get your newly created Patient information
You can retrieve patient information using `patientApi.getPatient` with the id of the patient you want to retrieve. 

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:get your patient information-->
```typescript
const johnSnow = await api.patientApi.getPatient(createdPatient.id)
expect(createdPatient.id).to.be.equal(johnSnow.id)
```

If you would like to know more about the information contained in Patient, go check the [References](../references/classes/Patient.md)

Let's now create some medical data for our patient. 

## Create your first data sample
You can use data samples to store information related to the health of a patient.
For example, when a patient goes to the doctor, we can use data samples to register the symptoms they experience and/or 
the results of measurements taken by the doctor. 

You can create a new data sample with `dataSampleApi.createOrModifyDataSample`. If you want to create many data samples at once, 
you can use `dataSampleApi.createOrModifyDataSamples`.
Link these data samples to the patient you created earlier through the `patientId` parameter.
A data sample must always be linked to a patient. 

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:create your patient first medical data-->
```typescript
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
```

When creating your data samples, iCure will automatically assign an id to each of them, similarly to what happens for patients.

But what happens if you don't know these ids? How can you find back your data?


## Search for data samples satisfying some criteria
Sometimes you will want to search for data which satisfies some specific criteria.

You can do this using the `filter` services of the apis, such as `dataSampleApi.filterDataSamples` or `patientApi.filterPatients`.
Let's say we would like to find back all medical data with the LOINC label corresponding to the body weight for the patient we have created.

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:Find your patient medical data following some criteria-->
```typescript
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
```

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

To know more about the Data Sample information, go check the [References](../references/classes/DataSample.md)

## What's next ? 
Congratulations, you are now able to use the basic functions of the iCure MedTech SDK. 
However, the SDK offers a lot of other services: head to the [How-To](../how-to/index.md) section to discover all of them. 
You can also check the different [In-Depth Explanations](../explanations.md), to understand fully what's happening 
behind each service of iCure.   



