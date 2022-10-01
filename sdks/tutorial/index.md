---
sidebar_position: 3
---
# Create a Doctor-centric App with iCure
In this tutorial, you will learn the basic steps to initialize a doctor-centric application, using iCure to store your 
data.
By the end of it, you will be able to : 
- Instantiate a MedTech API; 
- Create a Patient; 
- Get your newly created Patient information; 
- Create data samples related to your patient;
- Get your newly created Data Sample information;
- Search for data samples satisfying some criteria;

# Pre-requisites
To begin working with the MedTech SDK, you need to have a valid iCure User. 
Therefore, you have two possibilities : 
- Use the free iCure version locally on your computer, where a default user will be created for you. For this, 
check the [QuickStart](../quick-start.md)
- Register on the iCure Cockpit to get your iCure Cloud User. For this, check 
the [How to register on Cockpit](https://docs.icure.com/cockpit/how-to/how-to-register.md)

The iCure User credentials and the host URL of the following steps will depend on your choice.    


# Init your MedTech API
Once you have your user credentials, you can start using the iCure MedTech SDK
by instantiating a MedTech API object. 

This API will gather all services you can use in the SDK 
but also manage the authentication of these.

Provide the iCure host to use, your user credentials in this API. 
You can also call `initUserCrypto`, which will create a new RSA keypair, assign it to your user and store it 
in the API.  

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

await api.initUserCrypto()
```


If your user already has its RSA Keypair, you can call `initUserCrypto` providing it, which will only 
store it in the current API. 
Here is an example on how to do it : 
<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:init user crypto with existing key-->
```typescript
const iCureUserPubKey = process.env.ICURE_USER_PUB_KEY!
const iCureUserPrivKey = process.env.ICURE_USER_PRIV_KEY!
await api.initUserCrypto(false, { publicKey: iCureUserPubKey, privateKey: iCureUserPrivKey })
```
For more information about this method, go to the [References: initUserCrypto](../references/classes/MedTechApi.md#initusercrypto)


After instantiating your API, you can now get the information of your logged user. 
<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:get current user-->
```typescript
const loggedUser = await api.userApi.getLoggedUser()
expect(loggedUser.login).to.be.equal(iCureUserLogin)
```

Now that your API is properly initialized and that your user can create encrypted data, let's 
check how you can create a patient with iCure. 

# Create your first patient
In most doctor-centric applications, you will have to create patients.

To do this, re-use the api you just created and call the `patientApi.createOrModifyPatient` service. 
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

When creating your patient, iCure will assign an id to it, format as an uuid.

That's exactly what we'll need to retrieve the information of your patient. 

# Get your newly created Patient information
To retrieve your patient information, you will need to call the `patientApi.getPatient` service, providing
the id iCure assigned to your patient during its creation. 

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:get your patient information-->
```typescript
const johnSnow = await api.patientApi.getPatient(createdPatient.id)
expect(createdPatient.id).to.be.equal(johnSnow.id)
```

If you would like to know more about the information contained in Patient, go check the [References](../references/classes/Patient.md)

Let's now create some medical data for our patient. 

# Create your first data sample
A data sample can be any piece of information related to the health of a patient. (Measures, symptoms, ...)

When a patient goes to the doctor, the measures the doctor takes, the symptoms the patient is listing are considered 
as data samples in iCure. 

To create a new data sample, use the `dataSampleApi.createOrModifyDataSample` or `dataSampleApi.createOrModifyDataSamples`
if you have multiple of them. 
You can also link those medical data to the patient you just created through the `patientId`argument. 

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

When creating your data samples, iCure will assign an id to each of them as for patients.

But what happens if you don't know these ids ? How can you find back your data ?


# Search for data samples satisfying some criteria
Sometimes in your application, you will have to find multiple data, satisfying some specific criteria. 
Some examples : 
- You want to find all medical data of your patient with id ...; 
- You want to find all patients containing 'Smith' in their name; 
- You want to find all your male patients born between 01-01-1970 and 31-12-1970;
- ...

For this, we'll use the `dataSampleApi.filterDataSamples` service, creating our own search criteria.
Let's say we would like to find back all medical data of our previously created Patient, with the corresponding 
LOINC Body Weight label. 

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
to know more about them. 

# Get your newly created Data Sample information
Finally, you can also get the information of a specific data sample, if you know its id. 

<!-- file://code-samples/tutorial/doctor-centric-app/index.mts snippet:get specific medical data information-->
```typescript
const johnWeight = await api.dataSampleApi.getDataSample(johnData.rows[0].id)
expect(johnData.rows[0].id).to.be.equal(johnWeight.id)
expect(johnWeight.content['en'].numberValue).to.be.equal(92.5)
expect(johnWeight.comment).to.be.equal('Weight')
```

To know more about the Data Sample information, go check the [References](../references/classes/DataSample.md)

# What's next ? 
Congratulations, you are now able to use the basic functions of the iCure MedTech SDK. 
However, the SDK offers a lot of other services : head to the [How-To](../how-to/index.md) section to discover all of them. 
You can also check the different [In-Depth Explanations](../explanations.md), to understand fully what's happening 
behind each service of iCure.   



