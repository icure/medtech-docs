---
slug: how-to-invite-existing-patient-as-a-user
description: How to Create a User for an Existing Patient
tags:
- User creation
- Patient
---
# Inviting an existing patient to become a user

## Use Case Description
There may be some cases where a Healthcare Professional wants to invite one of his patients to the platform. 
If the Patient already exists in the platform, the MedTech SDK provides a method to automatically invite the User, 
link it to the existing Patient and then ask all the Healthcare Professionals that manage their data to share those with 
them.  
The following diagrams summarizes the operations performed by the different actors.  

```mermaid
sequenceDiagram
    participant Doctor
    participant Patient
    participant MedTechSDK
    Doctor->>MedTechSDK: Creates user for Patient
    MedTechSDK->>Patient: Sends an invitation email
    Patient->>MedTechSDK: Logs in and updates credentials
    Patient->>MedTechSDK: Creates Notifications asking for data
    Doctor->>MedTechSDK: Checks for new Notifications
    MedTechSDK-->>Doctor: Provides the Notifications
    Doctor->>MedTechSDK: Shares data with Patient
```

## Use Case Implementation

:::note

For this example, we assume that your database contains at least one Healthcare Professional, one Patient and one Data 
Sample associated to them.

:::

### The Doctor Invites the Patient

The first step in inviting a User is to create an instance of a class that implements either the 
[`EmailMessageFactory`](../references/interfaces/EmailMessageFactory) or the 
[`SMSMessageFactory`](../references/interfaces/SMSMessageFactory), depending on if you want to invite User by Email or 
SMS.  
Two examples are the [`ICureRegistrationEmail`](../references/classes/ICureRegistrationEmail) and 
[`ICureRegistrationSMS`](../references/classes/ICureRegistrationSMS) classes.

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:instantiate a message factory-->
```typescript
const messageFactory = new ICureRegistrationEmail(
  hcp,
  'URL_WHERE_TO_LOGIN',
  'SOLUTION_NAME',
  patient,
)
```

Then, it is possible to invite the User using the newly created factory object and the existing Patient.

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:doctor invites user-->
```typescript
await apiAsDoctor.userApi.createAndInviteUser(patient, messageFactory, 3600)
```

### The User Logs in and Asks for Access

After that, the User will receive an email or a SMS message that contains their login and a short-lived authentication 
token that they can use to log in.

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:user logs in-->
```typescript
const anonymousMedTechApi = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(host)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withCrypto(webcrypto as any)
  .withAuthProcessByEmailId(authProcessId)
  .withAuthProcessBySmsId(authProcessId)
  .build()

const authenticationResult =
  await anonymousMedTechApi.authenticationApi.authenticateAndAskAccessToItsExistingData(
    patientUsername,
    patientToken,
  )
const apiAsPatient = authenticationResult.medTechApi
```

The `authenticateAndAskAccessToItsExistingData` method will set up the User private and public key, it will create a 
long-lived authentication token, and will send a Notification to all the Healthcare Professionals that have a delegation 
for the Patient to ask access to their data.

### The Patient has Limited Permissions Until he is Given Access to Existing Data

The patient can now start using iCure, but there are still some limitations to what he can do until the doctor gives him access to the existing data.

The patient can't:

- access any existing data samples and health elements
- access encrypted data in his `Patient` entity

but the patient can:

- create new data samples and health elements
- share newly created medical data with his doctor
- access and modify non-encrypted data in his `Patient` entity

Initially, the patient won't be able to decrypt his own `Patient` entity, and for this reason the method 
`PatientApi.getPatient` will fail. Instead, the patient needs to use the method `PatientApi.getPatientAndTryDecrypt` 
which returns a `PotentiallyEncryptedPatient` which is an interface implemented by both `Patient` and 
`EncryptedPatient`. This method will try to decrypt the retrieved `Patient`, and if not successful instead of failing 
the method will just return the patient without decrypting it as an `EncryptedPatient`.

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:get patient details-->
```typescript
const patientUser = await apiAsPatient.userApi.getLoggedUser()
// apiAsPatient.patientApi.getPatient would fail
const patientDetails = await apiAsPatient.patientApi.getPatientAndTryDecrypt(patientUser.patientId!)
```
<!-- output://code-samples/how-to/create-user-for-patient/patientDetails.txt -->
<details>
<summary>patientDetails</summary>

```json
{
  "id": "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "5-b98f341b15a977629e20246c5f253ee4",
  "created": 1682493568425,
  "modified": 1682493568425,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "firstName": "Marc",
  "lastName": "Specter",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "Marc"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Specter",
      "text": "Specter Marc",
      "use": "official"
    }
  ],
  "addresses": [
    {
      "description": "London",
      "addressType": "home",
      "telecoms": [
        {
          "telecomNumber": "9c2f414d@icure.com",
          "telecomType": "email"
        }
      ]
    }
  ],
  "gender": "unknown",
  "birthSex": "unknown",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e0d5c9fe52a0ab54651b363fd6af25679f17285a2004b04b9e0f3b59816a1ceb1c4f5d14913e45b5679c41c53a0f0d4655eee5b7ca0fe02f348122d9f95b1d60acaabee6ab5498d4fbeeb805b3916b289dda9b999182bb88c05710aa61070cfb37435327b12772c485596f9d0203c3aa4a41b37a48baf9ede652e8737ca4d7583e4560bcf4974f0745f277aa4c2c5db2680b3fd92ed620fc3ce2e12343c3d465ab91143ac8f1ddb02701fcd02f4b7ae4fff28374ab2741182f7d3b62fca9dd20b4c1decec297f77e0d599635393374ea43790be3e2bed3555c8a76404b12c68cddc7a7d62e59448731141727b20c1f39312c4320e83604c8f999a2a7063267750203010001",
    "hcPartyKeys": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": [
        "1a838fdad75a5b31f0376f016b4cbc790551d22c942cab21afbfda929f2e26a1403cf7c8a317bd064904f5e0535e18d5750aa36849f572eff0d220a97f173160ea2c761e5104c4c54e0304c8a8c420d26145a5c99934b08db20a05588f9160d4a97c7720c53d7806d3ac5ee38f115a21982719abee5cd19ed8bd558727de7a26cb85f49bdea8a6ae9e32f9567a2e470ae087cb206fee3ad29b09ffecedc187148bbbf92c7bc233f99254c3cb0fc2a438befc6c492e974da7c3e06a94cb9d40ad32492a6d5cfddaaea9d71ab802c45fca8f6c953747419d3773cbf42164e0b914fec8ce8a87669e0ea5a06b1345ff251c0710b29e586e9e2ebdaec6fd2c638f52",
        "1a838fdad75a5b31f0376f016b4cbc790551d22c942cab21afbfda929f2e26a1403cf7c8a317bd064904f5e0535e18d5750aa36849f572eff0d220a97f173160ea2c761e5104c4c54e0304c8a8c420d26145a5c99934b08db20a05588f9160d4a97c7720c53d7806d3ac5ee38f115a21982719abee5cd19ed8bd558727de7a26cb85f49bdea8a6ae9e32f9567a2e470ae087cb206fee3ad29b09ffecedc187148bbbf92c7bc233f99254c3cb0fc2a438befc6c492e974da7c3e06a94cb9d40ad32492a6d5cfddaaea9d71ab802c45fca8f6c953747419d3773cbf42164e0b914fec8ce8a87669e0ea5a06b1345ff251c0710b29e586e9e2ebdaec6fd2c638f52"
      ],
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
        "b758140db648e445ef2b72d72954f86782b1cc864a13636e5363bccba19f19504d8c4598c717b218164ba979dd3aebae98b8a97b4a916e6e8ee7ac2bc3dae79131aae89d5cb3cdf74283ae298928b1472c77aa98ef15fbf9c4983f81af7e2ed0192c6291ae798e51c5596ff32c76e05003099ba47db24cef9924369409234f05eaa0521eb8d72bfb970a44ce03693cc81fa096552e8113468afb6437436d37c6e9ce6d5e72e9387d56ab08103d917e77a50c5fa5925d3a460dba48c25b7c4575a914fde7c00d78d6b0d23ba2407e060355e919819fdc54799174e029a11c2390f2463572c8c6165ae695c95ed9442b48b980bba5cf318e285e23fda8427a7d8a",
        "585c6309cd2b9c7f8b3bb7f30a50b7076e48b7fc2797ce0ca5fa495b6cbbef830c17c9928ba47ed8946f6e0f9a1849b2d3b8a4e5c4971b3c1db883104505686563958ea34cde09eb3a0b9c9ab9607ac46085300c9864d5f706d1b8e39b017f5d86b17803fdc0d67295f22242da54bee23fa274fb2eba26890cb9ad79768590be009ebc6b9c6aaf8db05176679c400afee5447ff8f9f31abda98060e1f8fddbe40993c154738f76b3ed3ee4222ad4d06d601d1419c1bd394a3107cd310a2bc911137e4e3d25fe7c38a95dcd1f160895c4dc7ca383d479b04e6c9fc7a63a3e92ba65856463423177d69e91c853e77b39287fe22f551afe54b537f64e531cf4aa3c"
      ]
    },
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {
      "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e0d5c9fe52a0ab54651b363fd6af25679f17285a2004b04b9e0f3b59816a1ceb1c4f5d14913e45b5679c41c53a0f0d4655eee5b7ca0fe02f348122d9f95b1d60acaabee6ab5498d4fbeeb805b3916b289dda9b999182bb88c05710aa61070cfb37435327b12772c485596f9d0203c3aa4a41b37a48baf9ede652e8737ca4d7583e4560bcf4974f0745f277aa4c2c5db2680b3fd92ed620fc3ce2e12343c3d465ab91143ac8f1ddb02701fcd02f4b7ae4fff28374ab2741182f7d3b62fca9dd20b4c1decec297f77e0d599635393374ea43790be3e2bed3555c8a76404b12c68cddc7a7d62e59448731141727b20c1f39312c4320e83604c8f999a2a7063267750203010001": {
        "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {
          "3604c8f999a2a7063267750203010001": "1a838fdad75a5b31f0376f016b4cbc790551d22c942cab21afbfda929f2e26a1403cf7c8a317bd064904f5e0535e18d5750aa36849f572eff0d220a97f173160ea2c761e5104c4c54e0304c8a8c420d26145a5c99934b08db20a05588f9160d4a97c7720c53d7806d3ac5ee38f115a21982719abee5cd19ed8bd558727de7a26cb85f49bdea8a6ae9e32f9567a2e470ae087cb206fee3ad29b09ffecedc187148bbbf92c7bc233f99254c3cb0fc2a438befc6c492e974da7c3e06a94cb9d40ad32492a6d5cfddaaea9d71ab802c45fca8f6c953747419d3773cbf42164e0b914fec8ce8a87669e0ea5a06b1345ff251c0710b29e586e9e2ebdaec6fd2c638f52"
        },
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
          "3604c8f999a2a7063267750203010001": "b758140db648e445ef2b72d72954f86782b1cc864a13636e5363bccba19f19504d8c4598c717b218164ba979dd3aebae98b8a97b4a916e6e8ee7ac2bc3dae79131aae89d5cb3cdf74283ae298928b1472c77aa98ef15fbf9c4983f81af7e2ed0192c6291ae798e51c5596ff32c76e05003099ba47db24cef9924369409234f05eaa0521eb8d72bfb970a44ce03693cc81fa096552e8113468afb6437436d37c6e9ce6d5e72e9387d56ab08103d917e77a50c5fa5925d3a460dba48c25b7c4575a914fde7c00d78d6b0d23ba2407e060355e919819fdc54799174e029a11c2390f2463572c8c6165ae695c95ed9442b48b980bba5cf318e285e23fda8427a7d8a",
          "223f55731820b91ccd18010203010001": "585c6309cd2b9c7f8b3bb7f30a50b7076e48b7fc2797ce0ca5fa495b6cbbef830c17c9928ba47ed8946f6e0f9a1849b2d3b8a4e5c4971b3c1db883104505686563958ea34cde09eb3a0b9c9ab9607ac46085300c9864d5f706d1b8e39b017f5d86b17803fdc0d67295f22242da54bee23fa274fb2eba26890cb9ad79768590be009ebc6b9c6aaf8db05176679c400afee5447ff8f9f31abda98060e1f8fddbe40993c154738f76b3ed3ee4222ad4d06d601d1419c1bd394a3107cd310a2bc911137e4e3d25fe7c38a95dcd1f160895c4dc7ca383d479b04e6c9fc7a63a3e92ba65856463423177d69e91c853e77b39287fe22f551afe54b537f64e531cf4aa3c",
          "162b762390cd32b0acb3690203010001": "02199478d7ff66f09a9260f5d6512bd5e0d74d21697d23be00b9d151f951a83008b272e523b7ba881b43fba243fa97fab72280b87c11d26b00ccd6cf0dc0b99541ce2ecfd74f22fd0388aed7b9d664313d794ac826c6f7aea44b8cb87813508c65d5fe277d62e2840b0d8ac1d4c244c6a95df99b623f3eaab9fdcb98015361217adbf80bd3beddc96fe455f0d89abaec235605c899dbca80ea34d462f477d27483af08f8378abff7324bdc192c1300bcc10b69f6560dc6d839d3f8b297adf99e5e50c4d0675bc80f9e447a630c1281fee3d390b5383a29b2f4ee074ea9060afeab0cf75d6aacab4410cd906a3898b7c594647739cd0ee260688fc52ffe4e299c",
          "46576a2dcbb172a44a7c170203010001": "9356a7c3f424ce3c589c5b69b8c878b93d23c6a76db219c01cb928f9ce6e7e9120485540d85e41951b91c854ddc9c3ee197622cce3ba5c4f53a8cfa963a6d73be848d12528c65698228ec64ec24726a7a8bf7735a29eab4cb008d26fc0aa4dc7bb1f6069bc2b6b53126a6cc8e34b9faf7f13eeab79889fe5ea91c260fc3d4d50ab790e0aefabbdfdf494b68ea7278208564c231a19378221d4b3aa6ecc474179d566811c59fffaa1c43f615e7d69182b7680bf15cae65e4669bdc96318e1f1a1735041a7c511a3949d36c4b0675a49251386cfa4b661cf3c34534a24b3f7b4d1be8221fdd7874b6d31d8a8138e93e54439726aef182fcd7f8aa648db532105ed"
        }
      }
    },
    "transferKeys": {},
    "encryptedSelf": "1ZXsM7I3iSMYvtY29fcO0aw230wtyCVkbppbvqGSylY=",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>

It is also possible to for the patient to modify his non-encrypted data using the 
`PatientApi.modifyPotentiallyEncryptedPatient` method. Note however that any attempt to change data which should be 
encrypted according to the api configuration will cause a runtime error.

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:modify patient details-->
```typescript
patientDetails.companyName = 'iCure'
// patientDetails.note = 'This would make modify fail'
const modifiedPatientDetails = await apiAsPatient.patientApi.modifyPotentiallyEncryptedPatient(
  patientDetails,
)
```
<!-- output://code-samples/how-to/create-user-for-patient/modifiedPatientDetails.txt -->
<details>
<summary>modifiedPatientDetails</summary>

```json
{
  "id": "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "6-aed7fc84f6cec51f12258f308ee47512",
  "created": 1682493568425,
  "modified": 1682493568425,
  "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
  "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "firstName": "Marc",
  "lastName": "Specter",
  "companyName": "iCure",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "Marc"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Specter",
      "text": "Specter Marc",
      "use": "official"
    }
  ],
  "addresses": [
    {
      "description": "London",
      "addressType": "home",
      "telecoms": [
        {
          "telecomNumber": "9c2f414d@icure.com",
          "telecomType": "email"
        }
      ]
    }
  ],
  "gender": "unknown",
  "birthSex": "unknown",
  "mergedIds": {},
  "deactivationReason": "none",
  "personalStatus": "unknown",
  "partnerships": [],
  "patientHealthCareParties": [],
  "patientProfessions": [],
  "properties": {},
  "systemMetaData": {
    "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e0d5c9fe52a0ab54651b363fd6af25679f17285a2004b04b9e0f3b59816a1ceb1c4f5d14913e45b5679c41c53a0f0d4655eee5b7ca0fe02f348122d9f95b1d60acaabee6ab5498d4fbeeb805b3916b289dda9b999182bb88c05710aa61070cfb37435327b12772c485596f9d0203c3aa4a41b37a48baf9ede652e8737ca4d7583e4560bcf4974f0745f277aa4c2c5db2680b3fd92ed620fc3ce2e12343c3d465ab91143ac8f1ddb02701fcd02f4b7ae4fff28374ab2741182f7d3b62fca9dd20b4c1decec297f77e0d599635393374ea43790be3e2bed3555c8a76404b12c68cddc7a7d62e59448731141727b20c1f39312c4320e83604c8f999a2a7063267750203010001",
    "hcPartyKeys": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": [
        "1a838fdad75a5b31f0376f016b4cbc790551d22c942cab21afbfda929f2e26a1403cf7c8a317bd064904f5e0535e18d5750aa36849f572eff0d220a97f173160ea2c761e5104c4c54e0304c8a8c420d26145a5c99934b08db20a05588f9160d4a97c7720c53d7806d3ac5ee38f115a21982719abee5cd19ed8bd558727de7a26cb85f49bdea8a6ae9e32f9567a2e470ae087cb206fee3ad29b09ffecedc187148bbbf92c7bc233f99254c3cb0fc2a438befc6c492e974da7c3e06a94cb9d40ad32492a6d5cfddaaea9d71ab802c45fca8f6c953747419d3773cbf42164e0b914fec8ce8a87669e0ea5a06b1345ff251c0710b29e586e9e2ebdaec6fd2c638f52",
        "1a838fdad75a5b31f0376f016b4cbc790551d22c942cab21afbfda929f2e26a1403cf7c8a317bd064904f5e0535e18d5750aa36849f572eff0d220a97f173160ea2c761e5104c4c54e0304c8a8c420d26145a5c99934b08db20a05588f9160d4a97c7720c53d7806d3ac5ee38f115a21982719abee5cd19ed8bd558727de7a26cb85f49bdea8a6ae9e32f9567a2e470ae087cb206fee3ad29b09ffecedc187148bbbf92c7bc233f99254c3cb0fc2a438befc6c492e974da7c3e06a94cb9d40ad32492a6d5cfddaaea9d71ab802c45fca8f6c953747419d3773cbf42164e0b914fec8ce8a87669e0ea5a06b1345ff251c0710b29e586e9e2ebdaec6fd2c638f52"
      ],
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
        "b758140db648e445ef2b72d72954f86782b1cc864a13636e5363bccba19f19504d8c4598c717b218164ba979dd3aebae98b8a97b4a916e6e8ee7ac2bc3dae79131aae89d5cb3cdf74283ae298928b1472c77aa98ef15fbf9c4983f81af7e2ed0192c6291ae798e51c5596ff32c76e05003099ba47db24cef9924369409234f05eaa0521eb8d72bfb970a44ce03693cc81fa096552e8113468afb6437436d37c6e9ce6d5e72e9387d56ab08103d917e77a50c5fa5925d3a460dba48c25b7c4575a914fde7c00d78d6b0d23ba2407e060355e919819fdc54799174e029a11c2390f2463572c8c6165ae695c95ed9442b48b980bba5cf318e285e23fda8427a7d8a",
        "585c6309cd2b9c7f8b3bb7f30a50b7076e48b7fc2797ce0ca5fa495b6cbbef830c17c9928ba47ed8946f6e0f9a1849b2d3b8a4e5c4971b3c1db883104505686563958ea34cde09eb3a0b9c9ab9607ac46085300c9864d5f706d1b8e39b017f5d86b17803fdc0d67295f22242da54bee23fa274fb2eba26890cb9ad79768590be009ebc6b9c6aaf8db05176679c400afee5447ff8f9f31abda98060e1f8fddbe40993c154738f76b3ed3ee4222ad4d06d601d1419c1bd394a3107cd310a2bc911137e4e3d25fe7c38a95dcd1f160895c4dc7ca383d479b04e6c9fc7a63a3e92ba65856463423177d69e91c853e77b39287fe22f551afe54b537f64e531cf4aa3c"
      ]
    },
    "privateKeyShamirPartitions": {},
    "aesExchangeKeys": {
      "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e0d5c9fe52a0ab54651b363fd6af25679f17285a2004b04b9e0f3b59816a1ceb1c4f5d14913e45b5679c41c53a0f0d4655eee5b7ca0fe02f348122d9f95b1d60acaabee6ab5498d4fbeeb805b3916b289dda9b999182bb88c05710aa61070cfb37435327b12772c485596f9d0203c3aa4a41b37a48baf9ede652e8737ca4d7583e4560bcf4974f0745f277aa4c2c5db2680b3fd92ed620fc3ce2e12343c3d465ab91143ac8f1ddb02701fcd02f4b7ae4fff28374ab2741182f7d3b62fca9dd20b4c1decec297f77e0d599635393374ea43790be3e2bed3555c8a76404b12c68cddc7a7d62e59448731141727b20c1f39312c4320e83604c8f999a2a7063267750203010001": {
        "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {
          "3604c8f999a2a7063267750203010001": "1a838fdad75a5b31f0376f016b4cbc790551d22c942cab21afbfda929f2e26a1403cf7c8a317bd064904f5e0535e18d5750aa36849f572eff0d220a97f173160ea2c761e5104c4c54e0304c8a8c420d26145a5c99934b08db20a05588f9160d4a97c7720c53d7806d3ac5ee38f115a21982719abee5cd19ed8bd558727de7a26cb85f49bdea8a6ae9e32f9567a2e470ae087cb206fee3ad29b09ffecedc187148bbbf92c7bc233f99254c3cb0fc2a438befc6c492e974da7c3e06a94cb9d40ad32492a6d5cfddaaea9d71ab802c45fca8f6c953747419d3773cbf42164e0b914fec8ce8a87669e0ea5a06b1345ff251c0710b29e586e9e2ebdaec6fd2c638f52"
        },
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
          "3604c8f999a2a7063267750203010001": "b758140db648e445ef2b72d72954f86782b1cc864a13636e5363bccba19f19504d8c4598c717b218164ba979dd3aebae98b8a97b4a916e6e8ee7ac2bc3dae79131aae89d5cb3cdf74283ae298928b1472c77aa98ef15fbf9c4983f81af7e2ed0192c6291ae798e51c5596ff32c76e05003099ba47db24cef9924369409234f05eaa0521eb8d72bfb970a44ce03693cc81fa096552e8113468afb6437436d37c6e9ce6d5e72e9387d56ab08103d917e77a50c5fa5925d3a460dba48c25b7c4575a914fde7c00d78d6b0d23ba2407e060355e919819fdc54799174e029a11c2390f2463572c8c6165ae695c95ed9442b48b980bba5cf318e285e23fda8427a7d8a",
          "223f55731820b91ccd18010203010001": "585c6309cd2b9c7f8b3bb7f30a50b7076e48b7fc2797ce0ca5fa495b6cbbef830c17c9928ba47ed8946f6e0f9a1849b2d3b8a4e5c4971b3c1db883104505686563958ea34cde09eb3a0b9c9ab9607ac46085300c9864d5f706d1b8e39b017f5d86b17803fdc0d67295f22242da54bee23fa274fb2eba26890cb9ad79768590be009ebc6b9c6aaf8db05176679c400afee5447ff8f9f31abda98060e1f8fddbe40993c154738f76b3ed3ee4222ad4d06d601d1419c1bd394a3107cd310a2bc911137e4e3d25fe7c38a95dcd1f160895c4dc7ca383d479b04e6c9fc7a63a3e92ba65856463423177d69e91c853e77b39287fe22f551afe54b537f64e531cf4aa3c",
          "162b762390cd32b0acb3690203010001": "02199478d7ff66f09a9260f5d6512bd5e0d74d21697d23be00b9d151f951a83008b272e523b7ba881b43fba243fa97fab72280b87c11d26b00ccd6cf0dc0b99541ce2ecfd74f22fd0388aed7b9d664313d794ac826c6f7aea44b8cb87813508c65d5fe277d62e2840b0d8ac1d4c244c6a95df99b623f3eaab9fdcb98015361217adbf80bd3beddc96fe455f0d89abaec235605c899dbca80ea34d462f477d27483af08f8378abff7324bdc192c1300bcc10b69f6560dc6d839d3f8b297adf99e5e50c4d0675bc80f9e447a630c1281fee3d390b5383a29b2f4ee074ea9060afeab0cf75d6aacab4410cd906a3898b7c594647739cd0ee260688fc52ffe4e299c",
          "46576a2dcbb172a44a7c170203010001": "9356a7c3f424ce3c589c5b69b8c878b93d23c6a76db219c01cb928f9ce6e7e9120485540d85e41951b91c854ddc9c3ee197622cce3ba5c4f53a8cfa963a6d73be848d12528c65698228ec64ec24726a7a8bf7735a29eab4cb008d26fc0aa4dc7bb1f6069bc2b6b53126a6cc8e34b9faf7f13eeab79889fe5ea91c260fc3d4d50ab790e0aefabbdfdf494b68ea7278208564c231a19378221d4b3aa6ecc474179d566811c59fffaa1c43f615e7d69182b7680bf15cae65e4669bdc96318e1f1a1735041a7c511a3949d36c4b0675a49251386cfa4b661cf3c34534a24b3f7b4d1be8221fdd7874b6d31d8a8138e93e54439726aef182fcd7f8aa648db532105ed"
        }
      }
    },
    "transferKeys": {},
    "encryptedSelf": "1ZXsM7I3iSMYvtY29fcO0aw230wtyCVkbppbvqGSylY=",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {}
    },
    "encryptionKeys": {
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>

The patient can also create and share data sample and health elements as normal:

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:create healthcare element-->
```typescript
const newHealthcareElement =
  await apiAsPatient.healthcareElementApi.createOrModifyHealthcareElement(
    new HealthcareElement({
      description: "I don't feel so well",
      codes: new Set([
        new CodingReference({
          id: 'SNOMEDCT|617|20020131',
          type: 'SNOMEDCT',
          code: '617',
          version: '20020131',
        }),
      ]),
      openingDate: new Date('2019-10-12').getTime(),
    }),
    modifiedPatientDetails.id,
  )
const sharedHealthcareElement = await apiAsPatient.healthcareElementApi.giveAccessTo(
  newHealthcareElement,
  hcp.id,
)
// The doctor can now access the healthcare element
apiAsDoctor.cryptoApi.emptyHcpCache(hcp.id)
console.log(await apiAsDoctor.healthcareElementApi.getHealthcareElement(newHealthcareElement.id!)) // HealthcareElement...
```
<!-- output://code-samples/how-to/create-user-for-patient/newHealthcareElement.txt -->
<details>
<summary>newHealthcareElement</summary>

```json
{
  "id": "10217715-6dfc-4972-98b8-37519afe3417",
  "rev": "1-b5f34fb1add99ccd91ef98d118ec9923",
  "created": 1682493582946,
  "modified": 1682493582946,
  "author": "c842130a-06a2-4080-9d61-f65cea1066d1",
  "responsible": "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58",
  "healthcareElementId": "10217715-6dfc-4972-98b8-37519afe3417",
  "valueDate": 20230426071942,
  "openingDate": 1570838400000,
  "description": "I don't feel so well",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "3db4966c-c410-4b44-91d7-02ce78eeed94"
    ],
    "cryptedForeignKeys": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {}
    },
    "delegations": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {}
    },
    "encryptionKeys": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {}
    },
    "encryptedSelf": "YYYqvmCVF2m7bnh3mvT9DZXey66juB1wLaDP9/0UjMHqzVKFi97cRf9sKOy2E4eCln8dZs8AbycEAaWyLBly8g=="
  }
}
```
</details>

<!-- output://code-samples/how-to/create-user-for-patient/sharedHealthcareElement.txt -->
<details>
<summary>sharedHealthcareElement</summary>

```json
{
  "id": "10217715-6dfc-4972-98b8-37519afe3417",
  "rev": "2-8079b1959990126f79f54a5437767264",
  "created": 1682493582946,
  "modified": 1682493582946,
  "author": "c842130a-06a2-4080-9d61-f65cea1066d1",
  "responsible": "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58",
  "healthcareElementId": "10217715-6dfc-4972-98b8-37519afe3417",
  "valueDate": 20230426071942,
  "openingDate": 1570838400000,
  "description": "I don't feel so well",
  "identifiers": [],
  "codes": {},
  "labels": {},
  "systemMetaData": {
    "secretForeignKeys": [
      "3db4966c-c410-4b44-91d7-02ce78eeed94"
    ],
    "cryptedForeignKeys": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "delegations": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptedSelf": "X1hMD1fA1z3jgdr1vX7rlELUwV1FtFJDBQatgdc+mBrsyzpQ0GJFE9qRWo9xO5e2qslWt2zU12QhjNEIGM+gZQ=="
  }
}
```
</details>

However, if you only share the medical data the doctor will not be able to find when using filters: this is because the
new data is created using a new secret foreign key that only the patient knows. In order to allow the doctor to find 
this new medical data you will have to share the secret foreign key using the 
`PatientApi.giveAccessToPotentiallyEncrypted` method.

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:share healthcare element sfk-->
```typescript
const filterForHcpWithoutAccessByPatient = await new HealthcareElementFilter()
  .forPatients(apiAsDoctor.cryptoApi, [await apiAsDoctor.patientApi.getPatient(patient.id)])
  .forDataOwner(hcp.id)
  .build()
const notFoundHEs = await apiAsDoctor.healthcareElementApi.filterHealthcareElement(
  filterForHcpWithoutAccessByPatient,
)
console.log(notFoundHEs.rows.find((x) => x.id == newHealthcareElement.id)) // undefined
// The patient shares his secret foreign key with the doctor
await apiAsPatient.patientApi.giveAccessToPotentiallyEncrypted(modifiedPatientDetails, hcp.id)
// The doctor can now also find the healthcare element
const filterForHcpWithAccessByPatient = await new HealthcareElementFilter()
  .forPatients(apiAsDoctor.cryptoApi, [await apiAsDoctor.patientApi.getPatient(patient.id)])
  .forDataOwner(hcp.id)
  .build()
const foundHEs = await apiAsDoctor.healthcareElementApi.filterHealthcareElement(
  filterForHcpWithAccessByPatient,
)
console.log(foundHEs.rows.find((x) => x.id == newHealthcareElement.id)) // HealthcareElement...
```
<!-- output://code-samples/how-to/create-user-for-patient/notFoundHEs.txt -->
<details>
<summary>notFoundHEs</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 0,
  "rows": [],
  "nextKeyPair": {}
}
```
</details>

<!-- output://code-samples/how-to/create-user-for-patient/foundHEs.txt -->
<details>
<summary>foundHEs</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 1,
  "rows": [
    {
      "id": "10217715-6dfc-4972-98b8-37519afe3417",
      "rev": "2-8079b1959990126f79f54a5437767264",
      "created": 1682493582946,
      "modified": 1682493582946,
      "author": "c842130a-06a2-4080-9d61-f65cea1066d1",
      "responsible": "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58",
      "healthcareElementId": "10217715-6dfc-4972-98b8-37519afe3417",
      "valueDate": 20230426071942,
      "openingDate": 1570838400000,
      "description": "I don't feel so well",
      "identifiers": [],
      "codes": {},
      "labels": {},
      "systemMetaData": {
        "secretForeignKeys": [
          "3db4966c-c410-4b44-91d7-02ce78eeed94"
        ],
        "cryptedForeignKeys": {
          "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "delegations": {
          "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptedSelf": "X1hMD1fA1z3jgdr1vX7rlELUwV1FtFJDBQatgdc+mBrsyzpQ0GJFE9qRWo9xO5e2qslWt2zU12QhjNEIGM+gZQ=="
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

:::note

The patient needs to share his new secret foreign key with the delegate (using 
`PatientApi.giveAccessToPotentiallyEncrypted`) only once, and after the delegate will be able to find all new medical 
data created by the patient as long as the medical data itself has been shared with him.

Multiple calls to `PatientApi.giveAccessToPotentiallyEncrypted` from the same data owner with the same patient and
delegate will have no effect.

:::

### The Doctor Receives the Notification and Gives Access

Once the Notification is sent, on the Doctor side you can use the MedTech SDK to filter his Notifications and get the one related to 
the new User.

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:doctor gets pending notifications-->
```typescript
const newNotifications = await apiAsDoctor.notificationApi.getPendingNotificationsAfter()
const patientNotification = newNotifications.filter(
  (notification) =>
    notification.type === NotificationTypeEnum.NEW_USER_OWN_DATA_ACCESS &&
    notification.responsible === patient.id,
)[0]
```
<!-- output://code-samples/how-to/create-user-for-patient/newNotifications.txt -->
<details>
<summary>newNotifications</summary>

```text
[
  {
    "id": "6de96672-293a-45ae-9395-7be7eb0d00aa",
    "rev": "1-2c9632b28c0d3286f6f85f5af3b44dad",
    "created": 1682493580443,
    "modified": 1682493580443,
    "author": "c842130a-06a2-4080-9d61-f65cea1066d1",
    "responsible": "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "NEW_USER_OWN_DATA_ACCESS",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "ccfd971c-3eda-4559-924c-e0f2f2e955be",
    "rev": "1-fd4834a4455de28eefa71ff6ac9f8a1c",
    "created": 1682493540541,
    "modified": 1682493540541,
    "author": "cd103856-44d3-43b7-b1bb-9e017834d4bc",
    "responsible": "fe1a337f-0019-4270-a40b-cbe4791d9cc3",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "fe1a337f-0019-4270-a40b-cbe4791d9cc3",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a02820101009e0ef3c4332f072dce171429ea0f8c9ba6804b2db8dd27006304b44f75583e3d83159de73c47c5061e1a117f4ecb1e3c331419d203ae64d854563596a846f4a9dc216933a672d08a98e5526f7551872c04cfd83bf7f02d22c4ad44d105b05dc7d8ebc30faeedce7822eb9ba63d321b6419dec5aaf83b630d538e5cc862c0373b7922978a7e589984da25ce60f340430286455eba428b1645b4843d3f66b94c34eaccc8770a959492f2188c1ecf2cf1e747e0f9a5b5bbc5bd02d027544f53d6aedc56d713a1369d266fa8f18f563cc8dc7a77ba38095747797d1418d5356755d3e642c5c14436e9482eaf736ee542f3c8454a0416424c217ac7e13dde44ce935f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "fe1a337f-0019-4270-a40b-cbe4791d9cc3": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "fe1a337f-0019-4270-a40b-cbe4791d9cc3": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "f80a89c2-7294-4cdf-abd2-4b6111ffcefa",
    "rev": "1-56c4191d469e00f8dc99615a16e77cf2",
    "created": 1680507101558,
    "modified": 1680507101558,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "f6df706c-21e3-4d68-9353-08ce9376d66a",
    "rev": "1-d58dfc761dd3356f031b8876bfc5b3ff",
    "created": 1680507101558,
    "modified": 1680507101558,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "f4b1fa35-9b8b-4916-8fd4-93532d83fe85",
    "rev": "1-d363ee8e82e493070f8e155d5e27c825",
    "created": 1680507101558,
    "modified": 1680507101558,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "e85798bb-01a3-4684-9027-c5d4d4e65b52",
    "rev": "1-b678d000f26094ee3c107a15f63841e8",
    "created": 1680507101558,
    "modified": 1680507101558,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "d6ea5954-abb5-4d50-849d-a1b238da52a6",
    "rev": "1-efe6ebf8100070fb4f3e7a5467278c28",
    "created": 1680507101558,
    "modified": 1680507101558,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "b0077a17-00da-48a4-8ca2-0db75fad44ab",
    "rev": "1-4dea159a6803d3401ed53debeb985a7d",
    "created": 1680507101558,
    "modified": 1680507101558,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "759bbe60-6e5a-4cf3-9ce2-13b0630839b3",
    "rev": "1-a5c0282c46bc7dccf238e7837200dfde",
    "created": 1680507101558,
    "modified": 1680507101558,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "5d87da31-fe9f-4513-b553-32700fb16683",
    "rev": "1-642904b3e0a3abaa3efb671669825e91",
    "created": 1680507101558,
    "modified": 1680507101558,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "11847e6c-0093-4850-89de-e7a35dcd8bb3",
    "rev": "1-531bf2e58c0ad13f995c92005b93f927",
    "created": 1680507101558,
    "modified": 1680507101558,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      }
    }
  },
  {
    "id": "0e22f0bc-a1f5-4cb3-a040-30b688f1b207",
    "rev": "1-6a6ec4afa9bbebc8b6916c869fda8e5c",
    "created": 1680507101558,
    "modified": 1680507101558,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "ffadf494-5113-41f6-984c-8cf6ce6d1c7d",
    "rev": "1-4e0367bbd74f2a84fc9c81498e2b457e",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d": {}
      }
    }
  },
  {
    "id": "f9f4db5e-0634-4ab0-9429-b3e3a6927b88",
    "rev": "1-d390f7f96169500fee285b99c716dad1",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "bfb52608-d0db-402e-ae9c-2ab240d6620a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "bfb52608-d0db-402e-ae9c-2ab240d6620a": {}
      }
    }
  },
  {
    "id": "c8cbd0b5-afbf-411f-a992-0bd12132d577",
    "rev": "1-bec575a966ad5386a7a3a0a3e738de8d",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f272cdab-3139-47d2-9fff-a1cb2e082f15": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f272cdab-3139-47d2-9fff-a1cb2e082f15": {}
      }
    }
  },
  {
    "id": "bc643d92-890a-45d6-b597-0479997e196c",
    "rev": "1-c34e424fe90765c6c14a42681e703d9a",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "83cf5973-87df-4eee-b8b3-b94e9fc64db4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "83cf5973-87df-4eee-b8b3-b94e9fc64db4": {}
      }
    }
  },
  {
    "id": "b9b98157-fce1-4d57-98fd-d5509673c571",
    "rev": "1-539274d992f65f19b1b0bd97e774981f",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "af7b724a-0a67-4726-975d-bda46f524e52": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "af7b724a-0a67-4726-975d-bda46f524e52": {}
      }
    }
  },
  {
    "id": "b35e4eec-8913-4509-bfc4-f5dd5d7fae29",
    "rev": "1-31b7a93e0812d217261d25fce226a370",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aa8f1340-74d6-47f7-9bb8-0a32384897dc": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aa8f1340-74d6-47f7-9bb8-0a32384897dc": {}
      }
    }
  },
  {
    "id": "b1c13145-efa6-4de0-82e0-c59a3f9aa174",
    "rev": "1-8181086a8b65b4baa20629673bc31c1a",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2df64961-21f7-4fef-a7bc-559684501bb5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2df64961-21f7-4fef-a7bc-559684501bb5": {}
      }
    }
  },
  {
    "id": "ac99f952-ade5-4465-935e-809cd00f97f6",
    "rev": "1-38cc758395bafe872aaf1ea07cb2bcdd",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3807753-8d67-4c71-8d1b-4395f418ba61": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3807753-8d67-4c71-8d1b-4395f418ba61": {}
      }
    }
  },
  {
    "id": "a14afa20-e71a-4189-bb53-608bac983d61",
    "rev": "1-5a16884c7b9ac1bec7f5a7cb3ca8f1a5",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "65c1aa32-9780-4634-b789-1c5a1e075c3b": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "65c1aa32-9780-4634-b789-1c5a1e075c3b": {}
      }
    }
  },
  {
    "id": "91b1dc0b-1590-4dab-9d37-0a819c734174",
    "rev": "1-860f6ae9e7e9d57d500f11b17b4e970b",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "34b5e063-45ab-4216-888a-3326160d7262": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "34b5e063-45ab-4216-888a-3326160d7262": {}
      }
    }
  },
  {
    "id": "7a63e5fb-3fb2-4f18-8d0b-239862b03fbe",
    "rev": "1-8b597bebfeab66e5717b3d8027b1f8cc",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c9c02fa0-fcfa-4078-ba3b-335ff9686419": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c9c02fa0-fcfa-4078-ba3b-335ff9686419": {}
      }
    }
  },
  {
    "id": "6f5c307a-419f-4124-bab2-83e5166aff44",
    "rev": "1-4a19a0faa66cffd02fa1fb617dbc2090",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "1e674fa4-f59e-4f8e-888a-df78f1cb572a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "1e674fa4-f59e-4f8e-888a-df78f1cb572a": {}
      }
    }
  },
  {
    "id": "63c7ef59-1946-42fa-ab40-1b87d712a210",
    "rev": "1-466eb409c7fdb1b5e9f7bc10db7d562b",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      }
    }
  },
  {
    "id": "5d9a2f57-4c3b-4d9f-a0de-8c24048f927c",
    "rev": "1-c68a6cddb4dd000f41c405b382061cd3",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "ac933532-b26b-4a19-b6e9-ead6b3043e6e": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "ac933532-b26b-4a19-b6e9-ead6b3043e6e": {}
      }
    }
  },
  {
    "id": "5b5b41bc-bdba-49e1-8267-2db153e68700",
    "rev": "1-b785d260391f96468f6c8996d172e65b",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9388453b-8f65-488d-9ff8-ef1fb6be0ee0": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9388453b-8f65-488d-9ff8-ef1fb6be0ee0": {}
      }
    }
  },
  {
    "id": "4dab80ef-6778-4939-b68e-e0e70888ce7a",
    "rev": "1-6a86bab7d35acfab14d78b8952221095",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3a12c0d-274c-42dd-884b-89e86d6b7cd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3a12c0d-274c-42dd-884b-89e86d6b7cd5": {}
      }
    }
  },
  {
    "id": "1a383541-72ac-4c91-9d21-490962da1c38",
    "rev": "1-2599e03988b026b59e21423b5296fda8",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "147fa56a-02ac-48c5-a98f-ea079835a17f",
    "rev": "1-044c66a5454bc38dc2a4fb916131f7d5",
    "created": 1680507101557,
    "modified": 1680507101557,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a920ea49-1390-4b72-977c-5a4890b9f1fc": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a920ea49-1390-4b72-977c-5a4890b9f1fc": {}
      }
    }
  },
  {
    "id": "e6c57106-5062-4df9-991c-98cc155f21e0",
    "rev": "1-88b88dc6894f2f93d5dda56068072324",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "8e48ac95-0151-4b45-88f0-fa1ba7530944": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "8e48ac95-0151-4b45-88f0-fa1ba7530944": {}
      }
    }
  },
  {
    "id": "d0699ede-2c97-4a87-a73e-f099a45f0f8a",
    "rev": "1-9b9dc77c662c8331578351880f1a7d5c",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {}
      }
    }
  },
  {
    "id": "cd91fce7-3d4a-450e-a517-472dcfc2b4fc",
    "rev": "1-9a7dc10a92368efad32af9ba58ac058d",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af24447-4928-4c55-ab35-6cb5a4ceae4d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af24447-4928-4c55-ab35-6cb5a4ceae4d": {}
      }
    }
  },
  {
    "id": "c44b90a7-d133-4080-b432-c47074c1c650",
    "rev": "1-af7f6444f121e9f89f39439c8710fe72",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "3eb68076c5c8f3b49d1ba50203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {}
      }
    }
  },
  {
    "id": "bf717ad8-d01f-461f-b3ee-193b694a36a5",
    "rev": "1-4b3f47c689fe5982ed834600dec95306",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {}
      }
    }
  },
  {
    "id": "b86b0dce-46ac-45d8-9e64-a983f2d36c77",
    "rev": "1-7e351e3f67a75ed1cba75e83518baa5e",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "980ce887e0cbc490d2d6930203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {}
      }
    }
  },
  {
    "id": "ab6e5fc6-4df8-489a-a04b-986444cc8fc2",
    "rev": "1-a89e4dfb47ee6d946a5728feb8e264c4",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "7ad08dd7d9f5528a70f17b0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f272cdab-3139-47d2-9fff-a1cb2e082f15": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f272cdab-3139-47d2-9fff-a1cb2e082f15": {}
      }
    }
  },
  {
    "id": "992cbee5-2b55-40c8-9012-62f6402a0b23",
    "rev": "1-9a909d13e95d342b6de7dd992bfabcc1",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "396f6d45-1d92-4bca-888c-086d8415aef9": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "396f6d45-1d92-4bca-888c-086d8415aef9": {}
      }
    }
  },
  {
    "id": "8b612bc4-ccf1-4c8d-afc4-bc467620c2e3",
    "rev": "1-f268d2d3711f26631424db056afff695",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "980ce887e0cbc490d2d6930203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {}
      }
    }
  },
  {
    "id": "8a3a7330-f9cc-4c42-b389-b0d06468229b",
    "rev": "1-9838a26db11535799ed12df1cfd7d4d7",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {}
      }
    }
  },
  {
    "id": "7cd77424-2ef4-4dbf-9a54-7d3301bbb7cb",
    "rev": "1-2e1e2648e358c770e1302939364dc99e",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f272cdab-3139-47d2-9fff-a1cb2e082f15": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f272cdab-3139-47d2-9fff-a1cb2e082f15": {}
      }
    }
  },
  {
    "id": "7392e143-46c4-4038-9f26-c14fbf4ad31e",
    "rev": "1-741e362bf7ba4eded194ba3b94fa2294",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
      }
    }
  },
  {
    "id": "7352377e-222f-45fe-a667-9dac19649381",
    "rev": "1-e62f37a5b1835b3e0ecb1c00c23559ea",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "cbb379ac6f43f1f7fdc7690203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {}
      }
    }
  },
  {
    "id": "49a90594-04b4-4375-915a-ffe18fd5099a",
    "rev": "1-ca3c31b8635ec5122e3b6267bd90a3e5",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "3eb68076c5c8f3b49d1ba50203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {}
      }
    }
  },
  {
    "id": "46346f89-4191-45d6-84c4-9e9085c51c75",
    "rev": "1-055570e2ad685290215c09b4391b7bef",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "2c3292b06cc950f42a60330203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {}
      }
    }
  },
  {
    "id": "38e79c3e-c5d6-4406-9371-1c82a9e5124d",
    "rev": "1-4fd5cd8505393b0c8379f19932dfb6fc",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "fbd6dcbb0ca0bbc89821ff0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3a12c0d-274c-42dd-884b-89e86d6b7cd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3a12c0d-274c-42dd-884b-89e86d6b7cd5": {}
      }
    }
  },
  {
    "id": "2e926e02-1577-44c1-ab0b-0e5b5f9db6ec",
    "rev": "1-9c1ce5b579eb2f695c8389ab0b852516",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100edf331691812b1fe30df74b875ced93ab98de2f985dd8e41dc81d91a456d1b3ebbc665f97ffeb96f1f97731a999886b1612d31bfc157a463aff663aa0ec5bcefe472487d2bd31665ea996c563610c2c820ad49c831ca6149c1fe94f26fd42131fab3cb5a5aff0b89fa02966329c4dc246dcb4d270824cc0100af5f3c9001565937cb2020b9c3e85d6c18a6f0b52e745de0b6931923a549bd46fae7300c2f838eedb58ce627cd633831234822a3a72dfa0efd015b8a30019c63d793c0891b7a652273eff08de4d39dc7bf156651cce1f342108ec92e8b3828a964b009edf4ba932e761c8e14175666b8139105abe93198f1e28ae32546576a2dcbb172a44a7c170203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a8298b4a-8a42-4451-b8b6-2a2eda5448a1": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a8298b4a-8a42-4451-b8b6-2a2eda5448a1": {}
      }
    }
  },
  {
    "id": "0accb996-8186-4d02-98e4-f84dc382beb0",
    "rev": "1-2c0b5b50151fadeeca262b1133177a07",
    "created": 1680507101556,
    "modified": 1680507101556,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {}
      }
    }
  },
  {
    "id": "d0555c90-c937-40b0-853c-8c0af9d0ddda",
    "rev": "1-f7879e4bd2aa10c2a2890254fa567c22",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "de4a0f21499548bbdeabf90203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {}
      }
    }
  },
  {
    "id": "cd6c4be4-47be-4a9f-9411-71bc9f2a7076",
    "rev": "1-bde074b06055c8bea5fd6f7a48d56ff4",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {}
      }
    }
  },
  {
    "id": "c2e24209-42de-4fde-a12e-b0c3c40228dc",
    "rev": "1-beeb6b0ff70ba9fbd184810c12348264",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "e90a3ad550c7d786bf316b0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {}
      }
    }
  },
  {
    "id": "be32937b-6b26-4baa-91f4-2ee442a67650",
    "rev": "1-1fc616e99028a6158d3e9e3423cb6a0f",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {}
      }
    }
  },
  {
    "id": "b797f40d-64a8-4ce9-9ea9-965bd5295032",
    "rev": "1-b6100c80facd75dd346b4031c4a966b8",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3a12c0d-274c-42dd-884b-89e86d6b7cd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3a12c0d-274c-42dd-884b-89e86d6b7cd5": {}
      }
    }
  },
  {
    "id": "b06cb481-cef5-4fcd-812b-e96aea638894",
    "rev": "1-7ac889b515d3e9804160086d71c6d621",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "de4a0f21499548bbdeabf90203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {}
      }
    }
  },
  {
    "id": "ade96f3a-dd0d-43af-b29f-2384f0fc1c3b",
    "rev": "1-7dcd00a0b41976ee18066bb9fff47add",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "328d75e1a36c4d3b85f90f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {}
      }
    }
  },
  {
    "id": "a7f6e49f-94be-4423-aca5-f74a1fc69c6b",
    "rev": "1-f97babbf522875ed4622c36905e16e3e",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "a18e9caadf3c9a2749f84f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {}
      }
    }
  },
  {
    "id": "a3628527-3ced-4355-8a3a-f9a3805d5e6e",
    "rev": "1-cc1968c40112ac83bd8da39193741816",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "328d75e1a36c4d3b85f90f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {}
      }
    }
  },
  {
    "id": "9f992337-1bd6-4f58-b9a6-ac42ea34afe8",
    "rev": "1-8d592a05d1410e08e73bcaa0733cda3c",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3807753-8d67-4c71-8d1b-4395f418ba61": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3807753-8d67-4c71-8d1b-4395f418ba61": {}
      }
    }
  },
  {
    "id": "9b68b0b5-6b56-4044-b20d-7b3072129261",
    "rev": "1-b2de5bb192428007ecacd01d941f2496",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "64a07995b08cdfaa0c91a30203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {}
      }
    }
  },
  {
    "id": "89bc1903-b13e-4877-abb2-40352428fde7",
    "rev": "1-e7b02b2ebc1c5c29e4d4ec125db67e8d",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "8a1f96573fcd7f11bb1ebb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {}
      }
    }
  },
  {
    "id": "7d6020d2-0cd8-423c-93ea-8afe81772ad4",
    "rev": "1-c898ea2a18ce57fa40b8fd3b2de1bead",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "c7090df3da48d3205cd0cb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3807753-8d67-4c71-8d1b-4395f418ba61": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e3807753-8d67-4c71-8d1b-4395f418ba61": {}
      }
    }
  },
  {
    "id": "6277469b-6905-426d-8103-6da98c882d66",
    "rev": "1-583bce96cff640e66f371fab3301f14c",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {}
      }
    }
  },
  {
    "id": "3c026813-dfc3-4eef-bdd2-e2566306065c",
    "rev": "1-a23f06e9b8dc98db92f9f500dfc0567c",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "a18e9caadf3c9a2749f84f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {}
      }
    }
  },
  {
    "id": "32771c56-9d41-4ebb-8ef4-8e5d5a86876a",
    "rev": "1-536d33cb00c49e28c8ed73b1249dc6c8",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {}
      }
    }
  },
  {
    "id": "2e57d794-4743-4a2a-96e2-5e1c72adcb57",
    "rev": "1-b077c025c4958be30e6d96ed33c98398",
    "created": 1680507101555,
    "modified": 1680507101555,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {}
      }
    }
  },
  {
    "id": "ff1ceb90-6a0d-457c-9830-2250b5f29b7e",
    "rev": "1-f42a73b6c64f9c975e620ee2a8dcc88d",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "cba719b5-f8df-4e63-b34a-df5378648a29": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "cba719b5-f8df-4e63-b34a-df5378648a29": {}
      }
    }
  },
  {
    "id": "ef6db23d-3cd4-4519-a1b0-5f4553c7ed91",
    "rev": "1-073dc4f400e054847efb6adeaaca7fe6",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "cba719b5-f8df-4e63-b34a-df5378648a29": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "cba719b5-f8df-4e63-b34a-df5378648a29": {}
      }
    }
  },
  {
    "id": "eca1be88-318b-4899-b8ab-1c1bed030832",
    "rev": "1-c9ace441e570bd8a51b51e092d57ee3d",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "427a8dcf9ec9862868564d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {}
      }
    }
  },
  {
    "id": "e98f60ba-e963-4cfa-948b-4cd481b56ec9",
    "rev": "1-b10811044d9449655c1f2a06908fff6e",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "59b5f8cf8b8a9fbe7560fb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {}
      }
    }
  },
  {
    "id": "c843e587-00f5-435a-84f7-fb632d37c6bf",
    "rev": "1-ed7bca7b2a81ddc1bcdb99efa14c5c69",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "0e467432ce730e230b4a7f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "cba719b5-f8df-4e63-b34a-df5378648a29": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "cba719b5-f8df-4e63-b34a-df5378648a29": {}
      }
    }
  },
  {
    "id": "bb1b2fd8-cb49-4a89-9b23-cf32223ae7d7",
    "rev": "1-7d4ac2408ded3781be4ae50385600c45",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "59b5f8cf8b8a9fbe7560fb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {}
      }
    }
  },
  {
    "id": "a607e492-7d80-40d4-b870-8e8fc5216e22",
    "rev": "1-0bffbff093a54aaf605c5f701b602389",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "fd1c3f798c2807c76aedd70203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {}
      }
    }
  },
  {
    "id": "a5afa83f-dd1c-4931-9a7b-9f063f307996",
    "rev": "1-aacbb11513e347082a88faeb505b6ba1",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {}
      }
    }
  },
  {
    "id": "a26601b2-b51e-4463-b75c-442ab218574b",
    "rev": "1-9d28923dab1245a7342e188a66e75cd1",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "0e467432ce730e230b4a7f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "cba719b5-f8df-4e63-b34a-df5378648a29": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "cba719b5-f8df-4e63-b34a-df5378648a29": {}
      }
    }
  },
  {
    "id": "8b0785f4-8d71-48f8-b5fd-db8cc8f841a7",
    "rev": "1-d103cb6418e3fe226143bf6202a9288e",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "9c44f394537ba3b09eef790203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "cba719b5-f8df-4e63-b34a-df5378648a29": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "cba719b5-f8df-4e63-b34a-df5378648a29": {}
      }
    }
  },
  {
    "id": "8aa051ef-f79d-442d-b4e4-19021a21cb03",
    "rev": "1-9e15f56f609947ac470eae7b564c3473",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "427a8dcf9ec9862868564d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {}
      }
    }
  },
  {
    "id": "6bb9f15e-617b-4f38-a91b-26218a410601",
    "rev": "1-5dc03a99b06e72997b461e6dbafe80b6",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "ec5b8e5900482dc21aff270203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {}
      }
    }
  },
  {
    "id": "619665bf-f0b0-4f40-a63a-b24256bbbda2",
    "rev": "1-73b9abd4639a301f9b162d6f012d1838",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {}
      }
    }
  },
  {
    "id": "4f0c8411-6ba2-4d74-b3c6-6dfa8d1e642b",
    "rev": "1-82010832620dbf1e85c9d406a8b91215",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {}
      }
    }
  },
  {
    "id": "41ec050c-9801-4095-8f57-0dc3eef1ee32",
    "rev": "1-1d136a7b0a60ffe26c6443f36c5fede1",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {}
      }
    }
  },
  {
    "id": "3a0aa20f-3a55-487b-8e93-44b6eb3ac7e9",
    "rev": "1-38bb1b7b7297c77e36d3e2b7fb49c201",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "ab954fbfc6f17edc37dc5f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c9c02fa0-fcfa-4078-ba3b-335ff9686419": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c9c02fa0-fcfa-4078-ba3b-335ff9686419": {}
      }
    }
  },
  {
    "id": "0afd2a8f-10b7-4889-96c1-4cce08e94eb3",
    "rev": "1-e3aa39a1f3f39003db296f2701a1c19b",
    "created": 1680507101554,
    "modified": 1680507101554,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c9c02fa0-fcfa-4078-ba3b-335ff9686419": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c9c02fa0-fcfa-4078-ba3b-335ff9686419": {}
      }
    }
  },
  {
    "id": "f6a0c6f2-9ce1-4ec1-b509-4eb3c1bada7a",
    "rev": "1-a86b1e1c832dab96332043671c7bc8c4",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {}
      }
    }
  },
  {
    "id": "e8cfc1a1-b4d0-4180-8ca6-1bd12026d157",
    "rev": "1-51f290c4fb937d3db81e193081cccdd2",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {}
      }
    }
  },
  {
    "id": "d013a56e-728c-4f14-893f-5a2fde1fca14",
    "rev": "1-160d9474b20b0e77c5e3331a3b01aac2",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "d0ed06ef291b1d083c62590203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {}
      }
    }
  },
  {
    "id": "b52d23c1-ad17-40cd-b0e9-9bf1627dc311",
    "rev": "1-c74c52b9dd793c07f4ddc757acb2d1a8",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "49de524320449413dc72090203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {}
      }
    }
  },
  {
    "id": "b35bc754-2a72-4bc0-8808-dcf3fd7dcec9",
    "rev": "1-0ae5c5497044a173d5fd5ba2ed642134",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {}
      }
    }
  },
  {
    "id": "a7cfe454-3c22-4177-bf4f-6d187a50b387",
    "rev": "1-18faf0532cfbbb604f409c325fea445c",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "27a27e0a9112b427910dbb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {}
      }
    }
  },
  {
    "id": "9efa79f3-1028-467e-855b-edf9c1fe6ae1",
    "rev": "1-1ee55addd2e308ff14c83d997448c831",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "af7b724a-0a67-4726-975d-bda46f524e52": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "af7b724a-0a67-4726-975d-bda46f524e52": {}
      }
    }
  },
  {
    "id": "9a8d9110-65a5-4581-98cd-58360e21f853",
    "rev": "1-a3a5b8c364970a93a917b3fe9c08cda6",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "bfb52608-d0db-402e-ae9c-2ab240d6620a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "bfb52608-d0db-402e-ae9c-2ab240d6620a": {}
      }
    }
  },
  {
    "id": "85468eaf-b43f-4179-8a77-620213668921",
    "rev": "1-b32064b2799b48cd20fc7f97ed55b2d5",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "268a66a98521c8748e95cd0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "af7b724a-0a67-4726-975d-bda46f524e52": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "af7b724a-0a67-4726-975d-bda46f524e52": {}
      }
    }
  },
  {
    "id": "80fbdf0e-6f58-4a68-a15c-237085722d9a",
    "rev": "1-ef39e39393188309c150e9ed199fe41b",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {}
      }
    }
  },
  {
    "id": "7de35853-a381-4f48-97d4-b4a7aee17c3f",
    "rev": "1-8206d604c1d8459e2277bd2b6ee4ce71",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "56afe6788be54a6539614d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "bfb52608-d0db-402e-ae9c-2ab240d6620a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "bfb52608-d0db-402e-ae9c-2ab240d6620a": {}
      }
    }
  },
  {
    "id": "768da226-cfb4-4e9a-a26c-99c1a8c040d0",
    "rev": "1-3a2758e518fbfaa5bd3c8d3b8aa9c9f5",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {}
      }
    }
  },
  {
    "id": "2f0256f2-ec71-4a68-9bed-ca9ef4f7228f",
    "rev": "1-1619a319847533fac20286fe9cf4bf8c",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "6c72fec29fdcfdfad48c4f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {}
      }
    }
  },
  {
    "id": "0f2ad38a-97b6-45a5-ae9d-b2ad32511df9",
    "rev": "1-be0652bc04aae44b6fccbe0849fa2417",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "ae3324920e3d36c24ed04f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {}
      }
    }
  },
  {
    "id": "0edfdb85-acc6-46ce-8259-d1ba4b8804c0",
    "rev": "1-732a594c4ff936e6372a50055198c1e4",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "6c72fec29fdcfdfad48c4f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {}
      }
    }
  },
  {
    "id": "0d6330a1-267e-429b-a0ff-59b18e92fe20",
    "rev": "1-62e43f1e840bcc9a49044009136a6d1d",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "27a27e0a9112b427910dbb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {}
      }
    }
  },
  {
    "id": "0d5a1ac5-bdb1-4599-948f-890ebb4c3d5e",
    "rev": "1-9683c9ea0a301052fc8962082a67ca97",
    "created": 1680507101553,
    "modified": 1680507101553,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {}
      }
    }
  },
  {
    "id": "fd57475e-8248-4d87-aedb-f9281bcf54fc",
    "rev": "1-0a3493726b4f4c8184ac6c97d63684de",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "397622daae71a4b0329e990203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "ac933532-b26b-4a19-b6e9-ead6b3043e6e": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "ac933532-b26b-4a19-b6e9-ead6b3043e6e": {}
      }
    }
  },
  {
    "id": "f35c1c47-6020-4653-b87f-2efea08dea02",
    "rev": "1-f934ca99f7870154a3dbc56af4081b65",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "00d49617e6548961fa8adf0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {}
      }
    }
  },
  {
    "id": "d34428a3-76d2-4a78-af11-b407129696da",
    "rev": "1-71851d1b81b8e288746a2f838db0cbcc",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "5bddd1fb8ee905b8b6bb670203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      }
    }
  },
  {
    "id": "c589cf10-c58a-4e00-ba42-52f5e899f45b",
    "rev": "1-62249d9ecb37f194ab628ba7aab98ead",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a8298b4a-8a42-4451-b8b6-2a2eda5448a1": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a8298b4a-8a42-4451-b8b6-2a2eda5448a1": {}
      }
    }
  },
  {
    "id": "bbf8eacc-adad-4b78-a54d-d4618dbb0440",
    "rev": "1-587288243c016c3d5bb1c7a4ead12011",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "ae3324920e3d36c24ed04f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {}
      }
    }
  },
  {
    "id": "ba443d12-5434-4904-afb5-9ac29ed36b6b",
    "rev": "1-2e796bcf9a2725aeb99034b9d64e1482",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "ac933532-b26b-4a19-b6e9-ead6b3043e6e": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "ac933532-b26b-4a19-b6e9-ead6b3043e6e": {}
      }
    }
  },
  {
    "id": "b6354063-f54a-47d7-8dbe-ec553ca2bafc",
    "rev": "1-1e2d3bb76c646f4a0a4251c07cce4f20",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {}
      }
    }
  },
  {
    "id": "a0cd45e5-bc1c-403c-a820-5b9798a1cfaf",
    "rev": "1-f9e456f6c6a86f213caa0f71a613d44b",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "8eb62a6b14a3e938a35a850203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      }
    }
  },
  {
    "id": "a04e3a11-0dba-4db9-9208-b0c81a1aa766",
    "rev": "1-e8f6350d8daaf51758ca43abe58d31b3",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a920ea49-1390-4b72-977c-5a4890b9f1fc": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a920ea49-1390-4b72-977c-5a4890b9f1fc": {}
      }
    }
  },
  {
    "id": "9e86abfe-e96e-4241-8835-e1217d3ed9ca",
    "rev": "1-c979e235a0dfed8b62b08eeb6e3542e2",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      }
    }
  },
  {
    "id": "694e6568-c937-4e78-b32b-7ede5cae86bf",
    "rev": "1-7f44edf220fa2eee2c56cb15abc8fbc9",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "9f9f52a47de6b411b489ad0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aa8f1340-74d6-47f7-9bb8-0a32384897dc": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aa8f1340-74d6-47f7-9bb8-0a32384897dc": {}
      }
    }
  },
  {
    "id": "6504348b-4479-4a8c-9282-6d4ce4e4c809",
    "rev": "1-e320fa22974879ba0b62c8438f4dc3a2",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "8eb62a6b14a3e938a35a850203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      }
    }
  },
  {
    "id": "3498cf47-806c-4b63-b70d-41a29f957525",
    "rev": "1-f310e672821dd67cffb86fb216bc9b9e",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {}
      }
    }
  },
  {
    "id": "287010b6-afe3-4c81-b51d-8482f5f0ae23",
    "rev": "1-da4d97bc67e1b3c7cff584920a75c421",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "22a50e70c7a55edca3e31d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a8298b4a-8a42-4451-b8b6-2a2eda5448a1": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a8298b4a-8a42-4451-b8b6-2a2eda5448a1": {}
      }
    }
  },
  {
    "id": "2140633f-6b6e-489a-a162-8f3d8b688be3",
    "rev": "1-4cad3b595d654e1b769a938f2c575b72",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aa8f1340-74d6-47f7-9bb8-0a32384897dc": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "aa8f1340-74d6-47f7-9bb8-0a32384897dc": {}
      }
    }
  },
  {
    "id": "08e6193d-7cf7-42ad-bf5a-ea561e248e8b",
    "rev": "1-52165c1ea3175828ad32dccf8f5f6c7f",
    "created": 1680507101552,
    "modified": 1680507101552,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "c6865a970bbdfda6c62ebd0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a920ea49-1390-4b72-977c-5a4890b9f1fc": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "a920ea49-1390-4b72-977c-5a4890b9f1fc": {}
      }
    }
  },
  {
    "id": "eda8f5c2-6d9b-41a3-b2ed-152040e028a7",
    "rev": "1-b3f7d670f30ba673d321857c086042a6",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "ee98ff27bfdc16aea956d10203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af24447-4928-4c55-ab35-6cb5a4ceae4d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af24447-4928-4c55-ab35-6cb5a4ceae4d": {}
      }
    }
  },
  {
    "id": "e6ea0681-caa9-4d3a-b4bb-1525af5ab174",
    "rev": "1-5fcb1ce1beaebb3179294717ab3956fd",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "c8338fe9710c892fd321cf0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "ddbcb013-da35-4448-af02-02834098066e",
    "rev": "1-dc3185041032b69a85e9d80298918cfd",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b0daf22e60dd51354ba6d50203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "beae8e78-5872-4b0f-84c7-339385982b10",
    "rev": "1-685fb39b573fba949b5e0713444669e1",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "8e48ac95-0151-4b45-88f0-fa1ba7530944": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "8e48ac95-0151-4b45-88f0-fa1ba7530944": {}
      }
    }
  },
  {
    "id": "be5daa43-798d-41d0-b0f4-3481067f87d9",
    "rev": "1-15ef9f4b113365d9f1dad1edad005456",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "a5168cdbabcfd2506b09f10203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9388453b-8f65-488d-9ff8-ef1fb6be0ee0": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9388453b-8f65-488d-9ff8-ef1fb6be0ee0": {}
      }
    }
  },
  {
    "id": "973ab66b-edfc-4291-8c71-fe16d939eadb",
    "rev": "1-d8f14d7a29f1edeacad0228304d0033a",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "83cf5973-87df-4eee-b8b3-b94e9fc64db4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "83cf5973-87df-4eee-b8b3-b94e9fc64db4": {}
      }
    }
  },
  {
    "id": "967dc623-f148-4184-9760-5ee00e1dc1af",
    "rev": "1-cac0b0a09a55cacaa36a9b4d09193e6a",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "d5f8894cabbfe8b22671ed0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "934ba0b8-f285-4937-86ec-ed4e950d235e",
    "rev": "1-ad1ea56017e1c5af4caff7ab5f1f0a87",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9388453b-8f65-488d-9ff8-ef1fb6be0ee0": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9388453b-8f65-488d-9ff8-ef1fb6be0ee0": {}
      }
    }
  },
  {
    "id": "88265fd7-f17b-4c0d-95b2-8dbee9838f8f",
    "rev": "1-4e4f333471297e32ef7691d5cb4f02c8",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "8bce95c5d275fc6a7b70430203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "8e48ac95-0151-4b45-88f0-fa1ba7530944": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "8e48ac95-0151-4b45-88f0-fa1ba7530944": {}
      }
    }
  },
  {
    "id": "8444ab88-c878-426f-94bf-697c67737eec",
    "rev": "1-5f5d910352572b58e4faaa0f96eec560",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "6d974fce-805e-4d64-a15e-ece9589a61b7",
    "rev": "1-e36aaa536ef2a7a6c5912adaa2dc4509",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "6400ec84-24f0-44cc-9039-227246e6cea4",
    "rev": "1-4870784d890161bcea407787506d5ef6",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "5e5e1113-d846-4648-9d77-7d8c67762632",
    "rev": "1-2b4a541264c9dd135d13f9f095691810",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "82ac14e5c394a172f888930203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "83cf5973-87df-4eee-b8b3-b94e9fc64db4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "83cf5973-87df-4eee-b8b3-b94e9fc64db4": {}
      }
    }
  },
  {
    "id": "59ab0f35-2406-4564-8d01-d9911bd7f088",
    "rev": "1-e503b199a63521be29d2fac8ab2f5547",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "fc5fa2821f34a1779c621f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "31ee9e45-77dc-4c4b-bfb9-39a53501e1ed",
    "rev": "1-6d84f7e94d2a9df97e53e7656b9bd399",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "d5f8894cabbfe8b22671ed0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "173c988f-96f9-4155-81ab-53ab8174a864",
    "rev": "1-93522ff9707e41749ebb409e1e3103d9",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af24447-4928-4c55-ab35-6cb5a4ceae4d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9af24447-4928-4c55-ab35-6cb5a4ceae4d": {}
      }
    }
  },
  {
    "id": "0bfddc32-d811-4a8a-976c-2df105437038",
    "rev": "1-e7ebadee589d776dc98624ed21bcb9b8",
    "created": 1680507101551,
    "modified": 1680507101551,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b0daf22e60dd51354ba6d50203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "e386c39d-ef90-40f5-b869-f112091da9ed",
    "rev": "1-753d4c6be94d1bab5dbb3a759e518281",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "e9b56cf7037856c64ed34d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "ce27416d-ecc3-4932-bd09-5047312fe7be",
    "rev": "1-31aa2fbeac8bff0866f9ec6fbdf3632f",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "49b3e93ca53ed8adde67cf0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "65c1aa32-9780-4634-b789-1c5a1e075c3b": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "65c1aa32-9780-4634-b789-1c5a1e075c3b": {}
      }
    }
  },
  {
    "id": "ca093b30-df82-429f-bd7e-5f004d01ae6f",
    "rev": "1-e4728d75c00fd3714a2418c94bee8edb",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "7c3eeec92c8f0506bc012d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "b3c54235-91ef-4b93-8208-5f2c94eee7df",
    "rev": "1-36901f9638c63cea2bed1fcc6244a384",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "8895a0553e9388e7eeb7550203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "a45a4112-31ab-4e99-bb18-3bcb8d6b60e7",
    "rev": "1-3987baec23ad36f2ddd233a938fbe20e",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "9f1d49b1-4da5-4c08-b98d-b587b1bf51bf",
    "rev": "1-338288040f06d9ef5bf3b277c5ae07df",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "d5ff89ad4a483b5eeb26db0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "7f975676-ce34-4c02-9f46-e327e2acf474",
    "rev": "1-234a9f93fed2b10cd77960588db8e458",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "7729f983-d590-42d6-b1f1-d4724dd6cd92",
    "rev": "1-92c5347dc910893edd8fb28031da62d4",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "7c3eeec92c8f0506bc012d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "76ece8f4-7106-473d-a352-f17985a28c9a",
    "rev": "1-e3e2c727cb643ee44f20b129bb2ce2ce",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "8895a0553e9388e7eeb7550203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "6f80f986-944d-46a2-8049-14525195cbbd",
    "rev": "1-513b6231d247dc5871b2b0628f031128",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "6d41ce35-722e-4a59-8c2c-d3fa544d6ccc",
    "rev": "1-ba34d11385ba8d4ed6ab3c60b616bf0d",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "5028d6de-0853-46c1-b758-c330a871c900",
    "rev": "1-59ba4e0881e85575d0f0416b931ed949",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "65c1aa32-9780-4634-b789-1c5a1e075c3b": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "65c1aa32-9780-4634-b789-1c5a1e075c3b": {}
      }
    }
  },
  {
    "id": "4f3b841d-7236-4e3c-afa5-1b3731e67a24",
    "rev": "1-7e241c5a95a0ced229e81c1cddba3e39",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "0468691cd0a0c136a9edbb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "1dea0915-5282-4d0f-9b09-256169dcb233",
    "rev": "1-e6fe8fbf37596c5c720741214a621fa5",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "1ba14c26-b232-4f94-9d70-0c95155c0284",
    "rev": "1-97381c7989b0fc3ba4a3bedc9ae5a2f5",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "0468691cd0a0c136a9edbb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "15131212-23db-4de8-ac92-2bde83900e19",
    "rev": "1-07e27122628a4197849048bec3ab9543",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "c444d559b48231b4fbaf090203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "05ba7eac-a1a0-4ccc-bac1-425378a92d4e",
    "rev": "1-8e9961de454c196c223a64ef7a3962b3",
    "created": 1680507101550,
    "modified": 1680507101550,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "fc67c181-c5a9-45cd-ad63-452d06242555",
    "rev": "1-3e6699136c625419848f6d338ed4dcca",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "8929c47f2aa72f8a89ffdb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "34b5e063-45ab-4216-888a-3326160d7262": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "34b5e063-45ab-4216-888a-3326160d7262": {}
      }
    }
  },
  {
    "id": "eeb881e8-301d-441a-8eb4-8aba193d0950",
    "rev": "1-13bbaf1d186d1cddb04452e63fff3428",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "d03646ad-a19c-4df5-a6bc-aa797a971a10",
    "rev": "1-1e241ccd4d818cc1d1f6a1d0cfab2bfb",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "98afa9fcfa6c0ef0ef773f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "bbefecd6-1fb7-4d7e-a56d-30344256f772",
    "rev": "1-2f4bdd204039d5a9ec6bea653696e215",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "bb78f0fd-ebcb-4e80-91ed-fcb2d0ff04a5",
    "rev": "1-184c3b9d81853a87e58b7550c254c5f8",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "f9eeaa6d65ad581ee9becd0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "b8f8d163-6ba8-4065-9a38-f52bac1b5e9a",
    "rev": "1-e357a2e962b0a06292049cd571420501",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "b1a1bdbe-4ebe-408a-8d67-998cf7a420a0",
    "rev": "1-54a4da058af80fd900db8b50829f5129",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "34ac91b295673a63ccf39d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
      }
    }
  },
  {
    "id": "aabbc3cb-09b3-4ae5-a9b0-4d29ccf88dd2",
    "rev": "1-0c7965a1b8c4348efe0e0b8bb5168604",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "98afa9fcfa6c0ef0ef773f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "9ae47d27-5d08-4220-9d6d-9b3a55ec82d5",
    "rev": "1-b34898bfb58a9a5dff47447997ba188c",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "88ca798f-9731-4dc6-82b9-570c8681077a",
    "rev": "1-03b8bb3c1e3580eb6a86f32c4b1d79d2",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2df64961-21f7-4fef-a7bc-559684501bb5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2df64961-21f7-4fef-a7bc-559684501bb5": {}
      }
    }
  },
  {
    "id": "4fdb0b34-c2e1-467f-baf1-d3705e1b1205",
    "rev": "1-85ac4c830a7fb63357845a4838a98c3f",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "3cad5534-605b-4971-bec8-2567e8344d1e",
    "rev": "1-5ae0e081efb95132d0b4a104c2f77053",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "dd6d8016347b443a3e643b0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "1faee5f8-874a-41a4-9868-fe31cef756bd",
    "rev": "1-1e359a581263f7e94bbb46d18fa7f447",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "f9eeaa6d65ad581ee9becd0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "14db145c-38d6-4e5b-8aff-8a804c407caa",
    "rev": "1-7dd2e59693f3a6d394b6107f7ad4e8b5",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "147f0459941fd6cc2667270203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "0bd40ac1-59b6-4504-ba71-be4056d1b238",
    "rev": "1-40da0c621e57c97a1c2d107ac235bda7",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "a3cc812006fc2df240b4df0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2df64961-21f7-4fef-a7bc-559684501bb5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2df64961-21f7-4fef-a7bc-559684501bb5": {}
      }
    }
  },
  {
    "id": "040ff691-1964-42db-8f9d-280489a4a2cb",
    "rev": "1-d466c6407d82f6a0ef308f3552ecfdda",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
      }
    }
  },
  {
    "id": "01e650bc-2098-4e91-8407-1c17e2356cb9",
    "rev": "1-8d2e0b47dc7bcef5a27417b648d7bbd7",
    "created": 1680507101549,
    "modified": 1680507101549,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "34b5e063-45ab-4216-888a-3326160d7262": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "34b5e063-45ab-4216-888a-3326160d7262": {}
      }
    }
  },
  {
    "id": "d0c8e5fa-03d1-4756-bf9e-c2de9238e98d",
    "rev": "1-4ce8e931e4bcd16bb9ee7c1e89dbacfc",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "f7106002f018436d588e050203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "1e674fa4-f59e-4f8e-888a-df78f1cb572a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "1e674fa4-f59e-4f8e-888a-df78f1cb572a": {}
      }
    }
  },
  {
    "id": "a2aa05a3-aa97-4922-9e20-fa16bb388228",
    "rev": "1-e52d53ddc28c33797921eb83e63ad08d",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "8b5ea72c-96ef-4033-9d9d-664b8427f98e",
    "rev": "1-5737c6ffc6096a724777d48e4ed58c84",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "924542a1148a3a5089797d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "8971e1b3-84fb-4c31-af05-1c2467268f25",
    "rev": "1-c2d5be4dbb2bd65852899cdf8ddf191c",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "522071efd7ff988a95e9cb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "888016e4-903a-49f8-9a62-f8628b105024",
    "rev": "1-ac7cfed35e66943b555948ae9f7b67e1",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "003174c872dd2545ddeef10203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "85676bcf-8c25-4765-a19b-7e07822fc1aa",
    "rev": "1-0e016285898cc6cac679803aa91cbd84",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "3cb719d49f8adca7798e410203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "73fdd3c3-1e04-4b18-b2db-eb06c556aae6",
    "rev": "1-912fcd7a4854256c005844f612897948",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "a841c31a2638bb431e858d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d": {}
      }
    }
  },
  {
    "id": "70e700d1-a68d-4b37-8250-68a412b08e64",
    "rev": "1-5e30de02126870320bef826fab94bda6",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "6bb8890f-1159-4a0e-98e7-43fe9e001a13",
    "rev": "1-035eb42f7fc2ee920e8a6e3613cac6cc",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "5694c890-afe0-4abb-aeab-647f61f42d19",
    "rev": "1-21072c35876b7fc73b37567b85aa5a7a",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "3cb719d49f8adca7798e410203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "177d4a21-cea8-498d-84b4-fe3f0adc252c",
    "rev": "1-66f53107c2bb69b77f63a700da5bf868",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "522071efd7ff988a95e9cb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "0883459b-d961-4528-86b8-19049f4ec70f",
    "rev": "1-680e0c123fba732ec2a9c95e87176bb7",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d": {}
      }
    }
  },
  {
    "id": "05de1364-d339-4103-b155-19f37151ea6b",
    "rev": "1-ab8f51b9bc06e0ddae3d63e55d245903",
    "created": 1680507101548,
    "modified": 1680507101548,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "f2f611a1-b0eb-4dd9-a6bc-42404daf593f",
    "rev": "1-384eb4c890139c38e2b67991f5e79362",
    "created": 1680507101547,
    "modified": 1680507101547,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "3d8c58f7e19a551f96380d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      }
    }
  },
  {
    "id": "f00ed81d-46e2-4a38-9817-b16136385d3d",
    "rev": "1-705b0d1f4911967c1a396c9c58db0e84",
    "created": 1680507101547,
    "modified": 1680507101547,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "c4bffefc-7aab-4272-8c6b-0118d7af8d69",
    "rev": "1-811b528c041a6e2111681ad9881b2627",
    "created": 1680507101547,
    "modified": 1680507101547,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "70294e5ef3f74163261db10203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "a81c2214-597e-4b32-938c-1b1c2d8e0c83",
    "rev": "1-962de941bf9ae6b09795fe9be9754089",
    "created": 1680507101547,
    "modified": 1680507101547,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      }
    }
  },
  {
    "id": "92220fac-fea6-4873-bd5c-484769d28070",
    "rev": "1-32db441b5e473529a1d779cf5facd5cb",
    "created": 1680507101547,
    "modified": 1680507101547,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "53835f5fe4178b9756a5550203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "75d66650-46c2-4d20-953f-90508dcd1be9",
    "rev": "1-b5fd2a552aa1ec1143027d74e0326df9",
    "created": 1680507101547,
    "modified": 1680507101547,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "1e674fa4-f59e-4f8e-888a-df78f1cb572a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "1e674fa4-f59e-4f8e-888a-df78f1cb572a": {}
      }
    }
  },
  {
    "id": "504daf17-d7c0-4299-87e9-959b17ea0d76",
    "rev": "1-913753a14faa416ba83793520acf33d6",
    "created": 1680507101547,
    "modified": 1680507101547,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "36f838eb-c4aa-4da6-8996-fcc16155e467",
    "rev": "1-8a8e62f5620c7c5422a2c82c152ff990",
    "created": 1680507101547,
    "modified": 1680507101547,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "53835f5fe4178b9756a5550203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "726faf09-75db-48fc-a4c8-23120476ce9c",
    "rev": "1-9c5dfbef995d265fed4183d3bd2f4fe3",
    "created": 1680507101546,
    "modified": 1680507101546,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "07b5d279ad7ddb604de1c30203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      }
    }
  },
  {
    "id": "600d9b47-8cbc-4692-89de-95d0e4eaaa12",
    "rev": "1-1c2e2611aeb2e69d0d95c533a9f994b2",
    "created": 1680507101546,
    "modified": 1680507101546,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "07b5d279ad7ddb604de1c30203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      }
    }
  },
  {
    "id": "548e29bd-5b7e-42d1-8ea8-d6f1d5c8abf7",
    "rev": "1-c4b74244f6903a997f71452cd39d3673",
    "created": 1680507101546,
    "modified": 1680507101546,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      }
    }
  },
  {
    "id": "e5c1699f-dc89-4908-be12-10cc6fd022ef",
    "rev": "1-011f70ea2047b5ce0d92002fbda0ce61",
    "created": 1680263693538,
    "modified": 1680263693538,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "9225f43c-cba8-4531-897a-eed01fe81f69",
    "rev": "1-8ce579aeab2e7cf3b9e1bf0c1d01aa4d",
    "created": 1680263693538,
    "modified": 1680263693538,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "d5f8894cabbfe8b22671ed0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "5e482fee-6c17-46a5-9e99-5bd536603f19",
    "rev": "1-2643a094c6e4991f3aeb20c43e2043d5",
    "created": 1680263693538,
    "modified": 1680263693538,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "342d7039-72f9-4e90-81f8-d071ac2f0954",
    "rev": "1-9a1e7efb4e05a912b2e72e691f6961ef",
    "created": 1680263693538,
    "modified": 1680263693538,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "d5f8894cabbfe8b22671ed0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "1db0dd50-39fb-4e46-ab5d-ab01bebe4655",
    "rev": "1-6f9322a3c03a537927422a6cd65ba42e",
    "created": 1680263693538,
    "modified": 1680263693538,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "fc5fa2821f34a1779c621f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {}
      }
    }
  },
  {
    "id": "e8b4c382-ff3b-44d7-8c25-ea31ddd5b70d",
    "rev": "1-8c5f37cb3d02455f9144407e371e697c",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "8895a0553e9388e7eeb7550203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "d8b835c3-ad34-40fb-9a87-301f0aedd267",
    "rev": "1-193de87d08ec0d07a12a9c1494cc4b19",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "d865ba4d-4311-449f-aec3-e211049967c0",
    "rev": "1-adc5a72fdd44fe0a4cad439206f52165",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "c444d559b48231b4fbaf090203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "ae0d4b6e-05ae-4794-afbd-e781db3b9dc7",
    "rev": "1-3c53b6e9eb8c4a730686e4111f4803f9",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "0468691cd0a0c136a9edbb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "aa993142-a2be-4633-a80a-90b28467e53e",
    "rev": "1-b0e28feee597d479f7955a2790c467ce",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "c8338fe9710c892fd321cf0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "9ef4dc13-6e2d-4c95-9019-5174acdd3a54",
    "rev": "1-72e09a3086aa1d3625a0d7ab99ad7347",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "8895a0553e9388e7eeb7550203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "8975ef4d-47c4-49b0-9af4-5eead2e07c7c",
    "rev": "1-2a6b46a5a8f69299248c518d8cfdca3c",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "610162c4-0ac8-4936-857d-d2d9443a1bef",
    "rev": "1-919b5a2f527382dee1f4c608b60ea31c",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "60649dc1-2037-4e6c-8d43-e3480ae902ae",
    "rev": "1-4724e6b044457db6053d8f334a84e768",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b0daf22e60dd51354ba6d50203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "3f2a268d-6f13-4fa5-850b-d5d9b3cd10ac",
    "rev": "1-b7534d55166a5cdc89dbbacfa94fa8a7",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "2cadc9ac-d3e0-4409-847d-c2b0116bfaa1",
    "rev": "1-0fe8336354fa222278e422ce759b98e5",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "63002f77-ad14-415c-9694-c3518a70d1c4": {}
      }
    }
  },
  {
    "id": "206ee93e-67b1-47cb-b58f-feba7fe35345",
    "rev": "1-4d90ecf41dfd233aa3e2030b2edc7a5f",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b0daf22e60dd51354ba6d50203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "1e06eac0-ffd1-4d5c-be47-36662b302b35",
    "rev": "1-d246b53f2daec32341220de74109d530",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {}
      }
    }
  },
  {
    "id": "0e0d03ff-e98c-4815-89d0-ba03ada103a4",
    "rev": "1-4e766567456cc7313df2a974abd5e9b8",
    "created": 1680263693537,
    "modified": 1680263693537,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "d5ff89ad4a483b5eeb26db0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "d8ea6988-0851-4728-be80-bdf50fdb3734",
    "rev": "1-4c1196d5fb10ac96f9d59ba8eb0145c1",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "7c3eeec92c8f0506bc012d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "d6e9ab21-8f9b-48d2-822f-31b49cec510c",
    "rev": "1-db3730b2d88dbb5b50678134aa78dedc",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "98afa9fcfa6c0ef0ef773f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "d2444fbb-eff4-4872-9315-cd77094b57ea",
    "rev": "1-130f3ca67f25f405b27a6e03b076e285",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "147f0459941fd6cc2667270203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "c0d3cbb0-8a8c-4544-8aa4-59674f8245de",
    "rev": "1-d5c604de6e106338c020f77dbd8f4997",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "bd650e97-07bc-4b33-99f1-3c8627e3ac40",
    "rev": "1-a3df1ab4d45c52599d1e0c4a239116b5",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "e9b56cf7037856c64ed34d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "b5574368-d372-4e4b-9899-9ba741f8edcc",
    "rev": "1-dbe7764bf15bbbc509c1b6056f4aa2e4",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "b4c44214-6a51-4f22-85e1-205e424e022d",
    "rev": "1-e97b106b355442ee6a20ebe3304234ed",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "dd6d8016347b443a3e643b0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "8c0f684b-af58-40fe-9f1a-f58579c65480",
    "rev": "1-748d4f001822fb6b458d2a467b62e1f2",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "f9eeaa6d65ad581ee9becd0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "5c69d6fa-4ff7-4122-a2f4-c6a14ee9afe0",
    "rev": "1-0f47d9ba7d815983ec573651ea59a12e",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "7c3eeec92c8f0506bc012d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "33db47e9-a136-411b-8e1e-b8d8704ddfb9",
    "rev": "1-703dd5b328f588799446cc2ea6c14fe1",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "249348f1-2821-4927-b082-5534fc615de1",
    "rev": "1-217acc3b980c575c478ac69d54034687",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "0468691cd0a0c136a9edbb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {}
      }
    }
  },
  {
    "id": "11ddc694-c06b-4386-89db-27556af71cd5",
    "rev": "1-939bdffd403dd50855910108d56531cb",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {}
      }
    }
  },
  {
    "id": "0fad1674-fd65-4fa4-abef-0db5b0ca95e6",
    "rev": "1-d7a086eccdf27ac6a572dd1823aa43e6",
    "created": 1680263693536,
    "modified": 1680263693536,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "f9eeaa6d65ad581ee9becd0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "348f99d7-d67e-435a-9423-829d7909bf22": {}
      }
    }
  },
  {
    "id": "f4f6b7a4-502d-4f6a-8cab-e2a05796e13a",
    "rev": "1-30aed3d19c0a234f75d7697942ef85b3",
    "created": 1680263693535,
    "modified": 1680263693535,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "edc8d397-9e9a-4eb7-89ce-0a3e26f94a7d",
    "rev": "1-908ff1135ea257715358a9946adc1848",
    "created": 1680263693535,
    "modified": 1680263693535,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "522071efd7ff988a95e9cb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "d9a97260-7846-474d-8461-13263e999ae7",
    "rev": "1-d0f8cfebd5d682029c61f3aa1d732347",
    "created": 1680263693535,
    "modified": 1680263693535,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "98afa9fcfa6c0ef0ef773f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "c5a21e1b-b810-494b-a630-13c2958b8628",
    "rev": "1-0e5444b908f4266278539784940e1a75",
    "created": 1680263693535,
    "modified": 1680263693535,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "bde3b16d-d305-4065-af20-8ddb4edc328e",
    "rev": "1-6caec0afcb44c790c463be5d525d5145",
    "created": 1680263693535,
    "modified": 1680263693535,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "003174c872dd2545ddeef10203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "999dc4b1-8c31-4150-b4cc-b6aaf837f7ae",
    "rev": "1-bf45d352ecf6eda63c5b934c8a5645f4",
    "created": 1680263693535,
    "modified": 1680263693535,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "522071efd7ff988a95e9cb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "67b4b83e-beea-408b-a026-0a7b2b156e9f",
    "rev": "1-1b60505ebb4b3291206de0bc010d4cc9",
    "created": 1680263693535,
    "modified": 1680263693535,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {}
      }
    }
  },
  {
    "id": "15de6e65-c29d-4c32-81d2-b81975bc30ee",
    "rev": "1-ef01d34d55549245c85e956c76e45520",
    "created": 1680263693535,
    "modified": 1680263693535,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {}
      }
    }
  },
  {
    "id": "f555a054-c4c6-49af-84e0-93fb50c5d109",
    "rev": "1-3bd83c992503310daabf1a96ac07d6d8",
    "created": 1680263693534,
    "modified": 1680263693534,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "dc0eb429-8933-47d8-8d8c-1fe29308456b",
    "rev": "1-0b64e8372e5e17c7ae87e225f5642f17",
    "created": 1680263693534,
    "modified": 1680263693534,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "3cb719d49f8adca7798e410203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "8290908c-f7ca-40e7-8404-1c34f5749498",
    "rev": "1-a989945a386efab15896fdfaf108aaee",
    "created": 1680263693534,
    "modified": 1680263693534,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "764560d5-5020-4884-ba6c-53a1d606fea7",
    "rev": "1-31412e18cbe26730ae0b043e4baa4ce2",
    "created": 1680263693534,
    "modified": 1680263693534,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "924542a1148a3a5089797d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "4e28703a-13f9-491d-beea-60fdffd1e34a",
    "rev": "1-5a65e58550cebe82247addd60fc4116f",
    "created": 1680263693534,
    "modified": 1680263693534,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "53835f5fe4178b9756a5550203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "3f31a601-8d2e-472a-9a1d-0d12d8f64fa4",
    "rev": "1-bbb4dc6497a12272866a7fdf9944035f",
    "created": 1680263693534,
    "modified": 1680263693534,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "376458c8-6fab-4cd3-8417-eab970d719bb",
    "rev": "1-8a694e328e28a334c8223309093bf00d",
    "created": 1680263693534,
    "modified": 1680263693534,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "70294e5ef3f74163261db10203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "2b4d60ba-e201-484d-99ce-3e2f2f053f14",
    "rev": "1-361d67ff3372e2bb00e99588be368f52",
    "created": 1680263693534,
    "modified": 1680263693534,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "3cb719d49f8adca7798e410203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {}
      }
    }
  },
  {
    "id": "fc71f22c-a553-480b-b4de-9f6537895ccc",
    "rev": "1-aea230c10b8c2a1fe38e27c65fc2a7e4",
    "created": 1680263693533,
    "modified": 1680263693533,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "53835f5fe4178b9756a5550203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "fa646362-afd9-4f42-98ce-9307533cd707",
    "rev": "1-4e4a76b3bcb76088f985cc7520eaaea9",
    "created": 1680263693533,
    "modified": 1680263693533,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "3d8c58f7e19a551f96380d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      }
    }
  },
  {
    "id": "88d0472a-5dd4-468a-9c9d-bdf55f0452b0",
    "rev": "1-a9b83e6045576479368ad3280e8d4a36",
    "created": 1680263693533,
    "modified": 1680263693533,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "223f55731820b91ccd18010203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {}
      }
    }
  },
  {
    "id": "63aad5c0-4f46-42e7-aaa6-e3c79e263686",
    "rev": "1-32acc76c190b78de0b9ea1b26408e82a",
    "created": 1680263693533,
    "modified": 1680263693533,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "07b5d279ad7ddb604de1c30203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "03d42c21-1f27-478c-86d6-9179f32a537a": {}
      }
    }
  },
  {
    "id": "733a4ff3-9747-49d3-a096-0b6be425659b",
    "rev": "1-b48f928d492f5344c44295b33c93115e",
    "created": 1680075115983,
    "modified": 1680075115983,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "02298f0d-2728-45f5-a58b-ca8902dc05c8",
    "rev": "1-c9e086b8502d89d43102d84d10392ff4",
    "created": 1680075115759,
    "modified": 1680075115759,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "84440ac1-4d17-4f80-a27b-859e0cf81af2",
    "rev": "1-3a55504f4fe5efe2642b6ada57077058",
    "created": 1680075052724,
    "modified": 1680075052724,
    "author": "f4c7dd4e-e7c9-4419-8dc1-eb6217654134",
    "responsible": "59b5a1d8-46a6-429f-9b41-005925c8afd5",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "59b5a1d8-46a6-429f-9b41-005925c8afd5",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d0921d7b18d8341444130f89d215d83800db65373d21a036c3f3c840f824b4fc4723024599438105f38106d2ffd7173b8291478c02334cab84e213a9fd9d24f7508e2468b18bdf3db59df9f2fd908082ce6e1aea60bee23fde6efeb500d7911f38bf451e38f4084ed3c8bb794b7b1c768d3756a353822a372029b1959527fa47d951c6c64231d050b3480443b6c82389e12fcc34d844401e06932479a32db49618ef18a1dd63a29cd321a2c4deb62170eb74bf9d243a766de5b0b97e57bae84b0cc4f55bacb6d6245912409703f37fb2a45af5d63d888c233698307ae2234e872e4b425042957ede9a1f5b0ad543c685775a35328a0468691cd0a0c136a9edbb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "59b5a1d8-46a6-429f-9b41-005925c8afd5": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "68c22afb-3e6f-40e8-a6c6-a78c982fd7e1",
    "rev": "1-1ce5678e6867b66daf8bfcd2874bdf84",
    "created": 1680074915461,
    "modified": 1680074915461,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "b1ebe730-dfb6-4730-83ff-972ae2e4b9de",
    "rev": "1-c324b14cdcbeb33cf0a8f6722f785329",
    "created": 1680074915217,
    "modified": 1680074915217,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "a82b655a-6cc5-4727-b15a-375ee28003c2",
    "rev": "1-414c3eb13ff9f787cb2b84ba4746fe58",
    "created": 1680074852281,
    "modified": 1680074852281,
    "author": "14d6bd45-7a28-4d38-9255-16323a2eed92",
    "responsible": "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d51cdfd81437e260e49d00636160e930f55c0fd6ad45a055c93496e9e4ce1db5617174433afb5bfba3fddffb4e4e3ce12c2b6e72575a8f347bcc5047325f4883a47cc4bb1009313764973131bb62c93c3176bef9c28176a179b7b2cbbfef3eb6789d11fd5197bf105725eb6ffccfca887e327c009f0b29befeee566cd228b37519aeb0e4be2b72ab25c608b1f304b6416f3d44ea5d111177f39d81f1e2f1d42aa2180555e942653d047681a69116b3b6cfc56005676edcd0d1ce3628eac5a2f567f67c3a9fbc19f6a4388a8010b27e41d8154ca5ab02ff556c0ee8dec88365d49a2f862f6fd55be1906cf076c5424a9b933d128dd2ae3324920e3d36c24ed04f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "aeda80a9-193d-4f8b-ab4e-1510ab77ccbb": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "168d0fb1-ab1f-4372-990b-27566df70c1f",
    "rev": "1-07f3fb5766649aa9c05d9c0ddb9cd7bb",
    "created": 1680074568833,
    "modified": 1680074568833,
    "author": "b4269bb4-cf98-491b-b5a6-696895acede2",
    "responsible": "cba719b5-f8df-4e63-b34a-df5378648a29",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "cba719b5-f8df-4e63-b34a-df5378648a29",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c3a5d089bcbe24d444359d1539877032c2ef1c73dbb90261f1ada053db52c70f47cf302b177187f486900a815873f9972a9a1c5b09aa26148b7a5ef6472f832e7b436fc81b676d7b3865de8981969a4c9db148de492667605500e32daefb4ab1ef883658c045137c17a3cd22e47c33dba20af3183febccfd9f63c55537c0511313a5b3f9a3c9a7c157826ee19bc317dacac2aacb661663086a6fb2002b13ae47f6d8b2ba51b4182bee58e41e858d9fe17d512efa3be30d07d0648de82d46158f5744b95a9784db0008b1a1674a52d59e96702ad8ea878400c0f347a5b0ed7b7117bdea1c8b14e7e2376627aa408e6a96bdb7b596af0e467432ce730e230b4a7f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "cba719b5-f8df-4e63-b34a-df5378648a29": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "cba719b5-f8df-4e63-b34a-df5378648a29": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "e41382a3-c508-44ed-b204-211c14e3ce89",
    "rev": "1-986a6a5caa1b3c90f53b3f0f5824dae5",
    "created": 1679997681218,
    "modified": 1679997681218,
    "author": "d4ed8d59-bf6a-42cb-9d25-25f861b56f28",
    "responsible": "df18183f-fabf-4f13-b204-0650dc68c7c6",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "df18183f-fabf-4f13-b204-0650dc68c7c6",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100db36eb19d1d91fb09f892a9c6246768053d0307eb361f5c48f2ff63e7c5a5a0860ebcfd996ae4c432215fc7263b64251445f488c3ac22d55b7a661fce523832c775292d39420b72b855d8acb3c2226de7e021618f92c61bd97cd4c5c1c3f0a82fcf309bce96db112b69ae116d479c98d23b86a78d192dd7575a2bdeb9c689135b5cc1d8b2b082a59e4b04db056a9b4af81b2585e31492c8e353a81232efbb9a8c4f500478a3b8084d9d44c50c1cd67ab67fc4e482a0d54c62ce0232ef0db65275bf369a9df570560cc9c87e4d67dc46a68d96c44178e9c5643acb2af6a6d38b00591b1b949257abd45882af9955157b48a2743623aa18e9caadf3c9a2749f84f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "df18183f-fabf-4f13-b204-0650dc68c7c6": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "51615526-e486-4512-b8c6-4ff481748888",
    "rev": "1-08d166edecc920acb98e53d3996a5ed3",
    "created": 1679997198745,
    "modified": 1679997198745,
    "author": "c533e90d-fd79-43e6-923f-26bf4cd2ec80",
    "responsible": "f7e4ab5d-965b-468e-bef4-a9cabe7f446f",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "f7e4ab5d-965b-468e-bef4-a9cabe7f446f",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b68ac0a763ecef81fd284f720e917cb2057a6a0286b049146501d638d47e2cb4ba60d6a4a5eeb5f742300bb1a785b3185fd5e1c77b26323a936cdb13b30dc6ac1c4389996db2b7ca6126fd6055b082c80116ded3b431b443773b24b648f37929b27f3ff7c3cd4d94c1e7e06f75a23958b88aa8eee7d01be1ad1db12f33d51ab60323c965922cf4bf6970afcf52decde111be5f5bab8a6f17698f04955ad1118f4fface96a779f29ac5b7a455a0d0a7d3a641a263b8d882c55c83c67e1e552593ce6324bd6fef885a15048b7d61644a27691c5591d077d257a089ff240f9fb109fe23b9ee32960ae7f8068e06ee2a8e0fc2b838c8d23eb68076c5c8f3b49d1ba50203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "f7e4ab5d-965b-468e-bef4-a9cabe7f446f": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "519a4da0-e7b4-4421-be63-6a99904078a2",
    "rev": "1-59504d554510f06b3dac0b21a5387a37",
    "created": 1679991712230,
    "modified": 1679991712230,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "f9eddd73-03eb-44ea-8487-97cef757ac98",
    "rev": "1-35ea0e607f642e17f7ca33814bd34d76",
    "created": 1679991712162,
    "modified": 1679991712162,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "b4736bbf-5446-4cbe-af23-d160d0fdde5e",
    "rev": "1-68010e8eeccd11a91e494611b06771da",
    "created": 1679991673518,
    "modified": 1679991673518,
    "author": "892602a1-5198-45f8-a3a5-cb19f0eb789c",
    "responsible": "d2a81781-edfe-4886-bc99-b9cc336ffc17",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "d2a81781-edfe-4886-bc99-b9cc336ffc17",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100eaf4133d607b1afe286ac71b7481039c99f24756de62ea2c4340353e3538a125ed391e000e1cc2c02feec4a2f9ee1b963b4eaa9c4527193b8983cc42fac09be857e668e20f051bf1839dd3d3d8f9a51fed07993723371aaadf8c4736059fe248f003c45677f43682af38c3006188048e913aa9e84ddcdaab50fa4b314f8fa6701d9503f09bff67b86fdc7764029beb9279cf6f37cbea748bd018ad2a21ee109878fac512f20fdd360396eebcf0c91d5067ddb2e1a19d26c384804f4014cadd2c551d79e82877f65104febc63391cd3d0f7f9162be4373ec01f7f4b7c43360712ef49ce02a43cfade6fa4d6dfc104f81b56b3bd67b359b5f8cf8b8a9fbe7560fb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "d2a81781-edfe-4886-bc99-b9cc336ffc17": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "0f3b9f89-3d6e-49f0-8ce3-af7abff75102",
    "rev": "1-706d91cf61ed2e24fd39e56caa9121b6",
    "created": 1679929565678,
    "modified": 1679929565678,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "f9a52dbf-a19e-4589-bcd2-599a7256c22f",
    "rev": "1-68ff65bb93d7e9c9e31e9c63230491ef",
    "created": 1679929565617,
    "modified": 1679929565617,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "dad6947f-12f7-4d67-9606-107159bc3134",
    "rev": "1-761830d9ba232538d55afe3da55b1fe2",
    "created": 1679929536526,
    "modified": 1679929536526,
    "author": "8f5db3f2-c6b3-4f2e-b448-4c2fc5a731f3",
    "responsible": "348f99d7-d67e-435a-9423-829d7909bf22",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "348f99d7-d67e-435a-9423-829d7909bf22",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a9e333cb8a01c33749903703029c8660dd4cc39d4668d0862d2398baa075915ba4be4a9f9127dc84fc2b813cf20936143fa84415d4d9e06b441fb267e4b783c14a4a7c9ad4600270dd8d6ed7732ca3f7fe835ce5f9d4a4b81f59cadc015ff19c90f1d47eeba792cfc639b7d5335804a0c08ed56820bfd721cda57a148d3cd7ed0d96c6d84b5feb5e4125dd873ced0fe4478f841cd84c9f49008c25212c7aafb73ae97d2b1b479f1bde15b39e08a7db9cbf7cfe30b0bccfc64c64331b0451a3e4943de7a366739ed429510f2b6efcf669d10214e058b7b66e7aacfa6c9f4945dc0c345538c5c4ff724aa75837f2e17b1d92cc73b414f9eeaa6d65ad581ee9becd0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "348f99d7-d67e-435a-9423-829d7909bf22": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "348f99d7-d67e-435a-9423-829d7909bf22": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "fe2c28ec-db59-4f91-94a1-5304b598c5a1",
    "rev": "1-f6a055fb35103693a50c7ff7d1fe70a2",
    "created": 1679929414535,
    "modified": 1679929414535,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "c1a18deb-499e-4985-95b8-82712eb1fab9",
    "rev": "1-d9c2aa9c207ee7810332acb2ff520c25",
    "created": 1679929414481,
    "modified": 1679929414481,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "524cf295-f954-47a6-80d4-29b5e89a3ad4",
    "rev": "1-5ee0928e027ce327d041537e5c9f508b",
    "created": 1679929383887,
    "modified": 1679929383887,
    "author": "cf7bddc1-1df7-45d0-9488-ecde2e57abc0",
    "responsible": "03d42c21-1f27-478c-86d6-9179f32a537a",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "03d42c21-1f27-478c-86d6-9179f32a537a",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d73a6930a70cad7aa1c856679ddc502f8dfa08822f27db6a517b1948a07ce3c97123b1d8da524612b6041e2cacca4139ed0ae8e067fb64ef033a31b36b2d756af0ea2f4f933540d65b99953fbdd1e3d7badbd3ec452162394d433d08b28d1f125288344d36f5a1339b4e69776194cce7e7dc0077ace862db92bcf9eca9aea405774a3aafe011408fecc6e9ad362812ef36f5cafef741c6f541480b44b115ed10510f348086c6daedc82b25ee5ac9feaa6bfdd4336735b6b7f6620d9fd970bb60c432f7b7665427e271297543cad03576cd1ac12a86938df1aced718e9d41673dfad1ff8e2b8a80a0ec502ffd7434b9074091885ddc07b5d279ad7ddb604de1c30203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "03d42c21-1f27-478c-86d6-9179f32a537a": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "03d42c21-1f27-478c-86d6-9179f32a537a": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "f5299a54-d73a-482a-851f-73d1dc8fc305",
    "rev": "1-4c5005c59d373ed3f91c264188de718d",
    "created": 1679928192087,
    "modified": 1679928192087,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "b7f20e61-99d0-4bf4-96dc-04facb4e6110",
    "rev": "1-2077b009df32f36c6bcdeaf8894cd6f6",
    "created": 1679928192027,
    "modified": 1679928192027,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "7b93be7a-d7ff-4b1a-a7b3-a2e7d47d8b96",
    "rev": "1-c345e16cadd1dcb825377b8ee70cdc15",
    "created": 1679928162868,
    "modified": 1679928162868,
    "author": "311a0b38-eb54-424c-9d61-b8a190260189",
    "responsible": "d691c3f8-1483-4be4-b66f-2b1645a71b0f",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "d691c3f8-1483-4be4-b66f-2b1645a71b0f",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ce96f68068e7d7d1f68efdc47e27e9029a772782692448e9b8ee7ded88014ab7dd014ac1949b72ff0a1675339520ca7a779f946dafb4e407fbfb14526600c4b6e0320091b89afef827ad5c52bc335e54f6581659af582971a5d766fce20e48efa1db573503ec4273871eeda10edd3a26c159ebe32794c2af7d62a0a5b22b78496ad35afd0a7d2a771b6f7987d03d9c6c7ebade5995d564bc67966add45fe26345e857b0168d3b85a6ff897aee1f07521882e1e31dfac3d46786e8253250d89bfebf852c4ae5ea839fe0503ce715fe011064790390020c68ab11a4a60cd7b3a855cbc596b06d066d4a664a4ed591c061a2654cc4108de4a0f21499548bbdeabf90203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "135e9ce3-8051-4d69-ad22-7ef7dd19ee3b",
    "rev": "1-9bfab2d269458b37d678eb0056321e2c",
    "created": 1679927908384,
    "modified": 1679927908384,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "8461fd5c-0774-4eab-8b2c-c4fd3a62f769",
    "rev": "1-e5a10c72fca305d9371612980b34bda2",
    "created": 1679927908328,
    "modified": 1679927908328,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "17323b5c-f3f8-4055-9d57-017380dd43f2",
    "rev": "1-c9bbcafd3875a71ed173af0df325383a",
    "created": 1679927869406,
    "modified": 1679927869406,
    "author": "4f1c27b8-ae05-44ae-8853-4b20a0d988ef",
    "responsible": "63002f77-ad14-415c-9694-c3518a70d1c4",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "63002f77-ad14-415c-9694-c3518a70d1c4",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100be68f1d9b0bc455cf7dcc84cb1b1958a067d082f5be523f10eed309d06b9991a94f3f4683ca1489e5373fcaf958754c9a2a31468f916465ac3c43c7fe621d87a435f253ae64c9e39ec96198112dd9561d94cfff417ba18504bc3c21d0afc02b45baeb4f39408f52dd3a7578a50f4c5d6c45cbe3e9733ac6b64066677b70b5d81019ba1f41d2d19edbe85f6fc7be44f5aff39693bed2cd834d62345721938ad6eb35718c676844afc684933af560497775d848381f82b3514b0728a8e899d66bdcbc37757a6a7fb291bd34e5a937c8770ac0f4ffaa3c5b4560e0f214a33a6d5f26527f3e6e6d3c467255c67207f6689a4ada0e0f7cf8895a0553e9388e7eeb7550203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "63002f77-ad14-415c-9694-c3518a70d1c4": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "63002f77-ad14-415c-9694-c3518a70d1c4": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "ea8112f3-bd11-44c2-bd01-337ee6687317",
    "rev": "1-a31d8937a73fd0df4a804aeb0c050b7d",
    "created": 1679927264812,
    "modified": 1679927264812,
    "author": "ebe4c24a-a717-4a79-b1a2-982db6ce96b7",
    "responsible": "9af2ac37-edc3-4dde-b1eb-9362892f6167",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "9af2ac37-edc3-4dde-b1eb-9362892f6167",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b19c234107a6bff5d98f5940a8f9af44ac7078a3ecb7c9257444f615bacb260e79ca80d94c85cac601b9e98e85238a63bc6d3983787841d74b2dc6f6cac0e6e6b3369e4cca21be9f373814527ffd789219023ea9d450adba417fb2f1687e8380c1a927b4ee5222db83e93b0bb7eb875a7616afa78ebdd3956bee7ee49edd76225d506c0780e46f98998f52409dc29b09be7e3958b2efecca2d676617a42676ae7db63131c082354e2a97a67dd0fd173db6d57d88e7602d3a46f07d0f707f224305fb568388ce49125072a2f8aa757da0a996d75641eacec8bda31f3119e5c915ddd2b94493c370aee3ea648ed27e0366a2d1f7526b8eb62a6b14a3e938a35a850203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "9af2ac37-edc3-4dde-b1eb-9362892f6167": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "bf6ee14c-857c-4c87-b914-f2d12a48ebd2",
    "rev": "1-b1ce2fe68062c96c6c5965ce671bf084",
    "created": 1679927178323,
    "modified": 1679927178323,
    "author": "18373c7b-2285-4544-84bf-aef3a324c9d8",
    "responsible": "26e0959f-775b-4572-9b40-4c60b1fda72d",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "26e0959f-775b-4572-9b40-4c60b1fda72d",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d3cc6ef61bcb6becfe49090bee4b0749d89fcc886537c6092e9131fcc29a55c037642a08945748515d5b64cc86bd62772777b4d35d570d60bc56adcbcf2079a90004fbd87da29415a142ba09388d5d624456ebe0738ac907667fb413ee83ed926b1ad7bc9a728fc313b8ac56bf85748502437ad78d5beca0888c3e81f86c6f3b508feb9c2556fc25d08151d576898b0a8fe47d05311b7ac0f7123f15f1dca87e35c75a726ef2aa0ee6baa408b7b4864407b5b623f03847a42463499dfb226fdb541f80ba840c4b9ebf8d49c79de791a0cb93dfeb3d562f156c0f5c239001005843a85939f06bf09212e0ec7f70ac05568a2a35fec23cb719d49f8adca7798e410203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "26e0959f-775b-4572-9b40-4c60b1fda72d": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "e40e2856-4471-419a-a69b-4f7cf6751634",
    "rev": "1-29ef5610ad36d04b80979636a3606381",
    "created": 1679926605867,
    "modified": 1679926605867,
    "author": "4bf2e02d-9370-4145-bcac-f7340b375627",
    "responsible": "9313d25c-292b-4277-9fa4-18bb9bb50090",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "9313d25c-292b-4277-9fa4-18bb9bb50090",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100cb4eef41d065c838e45601e9a5cc2c00476e402520fd15493a8f760ebf2b543bbcf3c09bd29beabf517fdcb702de3bf28c6cac1f2b002ccf52335a1e84bda4baa1043f717224e21a39f5f5658666aa1e25ac5686580ace8f4c3d29db69d310a3e0f791c5d68ebc62e1b9e523e5b70f8e04b387382647b0fa9a7711bb98d291e691e30975df21d0e04fc8690a5d419052ed4bbcec5a6e34f257dcf384ac1e49a6b04f09cf1c82a33baf8cf46f57b469d7b53e4e34c39fe0527370f8c08ec6da1f2a5e74a022c321293e7450a2d8770c1dcef4d56c5b8632b8cfa8d4c1ad9e2043ebb7dcb13a3ca849f83690a310514a20e02347ad8ad5f8894cabbfe8b22671ed0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "9313d25c-292b-4277-9fa4-18bb9bb50090": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "dec9c4fb-3d1a-4f55-96fc-a236004a1305",
    "rev": "1-3128f5cba37e4efae1ececf25f016229",
    "created": 1679926549010,
    "modified": 1679926549010,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "cba3bd9f-3646-4b2e-8a3d-619c5fc82346",
    "rev": "1-d7f44d9c45ce0901d9f388fc8e43bf15",
    "created": 1679926548780,
    "modified": 1679926548780,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "ed1424ae-4dba-40ed-8be3-4e471639a0eb",
    "rev": "1-fd418cba7f4c5f2683bea13e4a46294e",
    "created": 1679926492019,
    "modified": 1679926492019,
    "author": "98b2638c-8050-45f9-b01a-34fea17d5ab7",
    "responsible": "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100cf5629d52249b02ea52dad14fb4ba7c22e08a192235ca5c4cc974f190a7a742e203f9dcbd2af1bb7c86def838bce88d452440f1dd6b1b2de940cbd5276515814a4cabf61180466d279e86f03af35dd208a17246f3ddb57c9bc7c6f91044e8d6d072e7ee69547f10e557f9ca411106a875b6a878fe087438520c6da6bf31a0f54ffef4f26e21c0b9e09d6dfec5eb33e4a5c04db0467695022bc43157d88de116cc100639d92090bbe6bd20c1e7a06e03629e48044ae713bdf3c9b0d4294449a982be7bf43d29216eed3ab854628e819c22d1a65d46323378bed9c0747bbd1c8d969735d299bf734d5ef95146b9412f78f67526e23c8b0daf22e60dd51354ba6d50203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "c986a2e7-e16b-4e40-aaef-5c8f7368d392",
    "rev": "1-877bee2b7ea4d737e1474decfd8e61ff",
    "created": 1679926422559,
    "modified": 1679926422559,
    "author": "f5cbc6d5-87eb-4952-bbe8-e27937762b55",
    "responsible": "2e3d40a8-51b6-494f-921d-e806c5b83010",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "2e3d40a8-51b6-494f-921d-e806c5b83010",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a1b97a2317702a4f0627c4c47ff12ff9449c582eb8a1f82e13353eb4172ff778db4e99cc4f0d5f4de9ddee558172345b1c9259939336a76eec995d257c3fa48f23d3301c96129ed6a5cc3288004e72f5e1fdfd71b64f10631b608fcf800c6a5bc67b87f35d0c7a98042a78744c60d0acb797a0e6d6e589cdd13a0d33a234f0c61d8287437a4486be3e5f03d5d523dd6057c858622e49f995b7e097de087fbf4ffeff3295bbff889cd1477c30a2c4074a6a47e60525453fd28b8f38b3d3b2d78db3f1883d744557680b543d6a84d0e407c6d3b80511fd645bdc273ea3f0684f536d977ccbd43dbe314518ef7e932a971841afca1e3d98afa9fcfa6c0ef0ef773f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "2e3d40a8-51b6-494f-921d-e806c5b83010": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "867f2933-aeab-4c72-86d0-19d210d9b970",
    "rev": "1-5958f8cd45dbdb67c970cc7313fe47eb",
    "created": 1679926244077,
    "modified": 1679926244077,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "5d5f2fd8-aaff-4d71-b79e-02a4d5888492",
    "rev": "1-bf438a9801196eb31ca5bf66abd39c48",
    "created": 1679926244033,
    "modified": 1679926244033,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "8f700fa1-73af-4093-87d5-d72106f03994",
    "rev": "1-33120822e52442b4fae2685f742bd12f",
    "created": 1679926209011,
    "modified": 1679926209011,
    "author": "6028a43d-c3a9-4071-9634-915c2a578269",
    "responsible": "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c0a6df018127ddf91b83f27e950f726cce97e7d70bbe751898ae52da9844c9a0d3b96db621389c41fe2344e4dd96a02f1b647937be61eefdf00ab48c8876e258b15606d63b904f0a67e35442f438d568a55471607a76b3933aeb5904233563673252d3791edcb603bb945df4cc0a1e7e4ddbad0d516ac4de631810fcbbb886ad1181b38e0d11a274e743cbffa761bfd7ae229268a7976f26f7eb4e22f9723dbe5d6df3a25f7af9b351243fd1a7e4a1546eca8e392f14f63563436d67558ab6ee3453f101d7e6a9725b9be42d3271486c61d466ff78b2831b262127073f9376656843de17092ed061dc8537104c604c14f6d350b9e9980ce887e0cbc490d2d6930203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "7d0834e9-f15e-45c5-aa77-92b5403ce19d",
    "rev": "1-8ed36847313f4e1be23d2e98f4b90f46",
    "created": 1679925877018,
    "modified": 1679925877018,
    "author": "40d44232-c0a3-4fca-b842-9598767fddf8",
    "responsible": "486a6b23-2fb8-4815-b81d-dd3b5040ce12",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "486a6b23-2fb8-4815-b81d-dd3b5040ce12",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bdece43e8320d67a4a99afa3b229acb4904d658206a06f33bd647db4339ce9f505301a2370c42944e7ac45b6b54bf6245d5fde39a1e46329884dcc3fcbfaddc0009e668f63a7906ebee58bb1ede39f3b6a97166a7fd36756949d98297c97acfada5ee3e0e237c305e1808339ee11712b7729ed1a73335b645362b29faf2d68a2c1dda7575bfc0a7f0d990627b98e9c36a644b3621a81155947c99657ec7936c3fa2420142c613f7fa7e2760dd1ce795c3b99cef8bb6129a45a7ac808ee575c947dbcc7197ef68f4385a51ac246bb372f97ac1230eff1a77d0555f25df7e940af77d8807e2f3a3fcdbee5dc4cdd898e4caa503ffd107c3eeec92c8f0506bc012d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "a65d7657-3391-431b-9872-941cc3c7d489",
    "rev": "1-bfde6894ac0c0cb56e75927a1c523fd2",
    "created": 1679925849955,
    "modified": 1679925849955,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "cdbb5396-0516-49a4-94db-824b3aee7c07",
    "rev": "1-d7673f8ed6aad926f20811227cc554c6",
    "created": 1679925849882,
    "modified": 1679925849882,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "e1de0bdb-210c-4714-ace2-f754a9d710ae",
    "rev": "1-5e25b2aa812122e2c68185dbff9d7ce6",
    "created": 1679924658464,
    "modified": 1679924658464,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "aad67930-5775-45be-8300-b5ebf937e93e",
    "rev": "1-a049adaf835260347bc587c523dd7f63",
    "created": 1679924658418,
    "modified": 1679924658418,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "cfd0f293-a834-45ac-844d-09f675ef2269",
    "rev": "1-12de2909149bbeb4cf9a34e10e01fef8",
    "created": 1679924615711,
    "modified": 1679924615711,
    "author": "2b20e061-f5a7-48af-890a-a82ac0000690",
    "responsible": "b4efa501-14ad-4ce4-b988-cd05fe261cd4",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b4efa501-14ad-4ce4-b988-cd05fe261cd4",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a7c9f5fe8abdab47f5b63a248b800ddbae5127d6dae189a41ac43d31a302f730c19c0da1cad6040e2ae11a6b4c18b6334149725121871b174a1795898dbd2147b2fa8f7b26eb6d2b6711a1c8e4e09bf68d8809b5eba12fee48643a5706255c9bd53ad5b3877ee3f48914d1d161a7c900a830e6d6cc07cbc596f0cb0c29ed2961a510d88651ed2b767007f54273a475fbdc65d771353d5dd6d925d619fecb902b7483920b92577fcd0896fecb2194476ec71c17fa0054c81b7d645de205e8b42618994e1d02431916d0504144265f0f9781c2e1d2c67f3730f8592ff1cacfdc85998bcf277c8487c7d4e7df3597fac581e49c6f36286c72fec29fdcfdfad48c4f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "f39ecbc2-08fd-43a8-b9fe-44815661bef1",
    "rev": "1-04738d5e98c1c2f7c3de713e2a778351",
    "created": 1679924397742,
    "modified": 1679924397742,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "5b66fadf-65bd-4df2-ac16-99cdcfb60acf",
    "rev": "1-e81f4b4539b54906e4addd9e6e209149",
    "created": 1679924397699,
    "modified": 1679924397699,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "0dfdf388-b0a6-4fec-ab40-07efa1043be3",
    "rev": "1-e04b53fd7b28c142116649c7b16b337f",
    "created": 1679924358172,
    "modified": 1679924358172,
    "author": "82bdd9de-3235-4ed2-a8fe-a1644617b152",
    "responsible": "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100de6f56b118c5d5ccf2a643a0a6e0f255f8eca847852c48a4ea9e23dd0f30e9f42f4d4ded244906d4d7fef2ed2c1dedacb9c89250d480766ef92877e968610b6731d94741dddfe2169d72be8b126e17fa38dc2d2f5f2ec89dfa1d65ecf210afb9b1ae4f3112257b2b89d3aa093c03b1d17c839e53d71d57101d7f9961fc02301ca73cddb04ebc469d783a124d00b19d90e3bf1023223bac447ff3489347cf7d203e6b32a9eb982f0c200e9f37585f7435b94682f0ef343f273e9b5452f86fed7504b00b0be3064f70f2916997e5b2749f22608bf357026ac92270ef5d1c48d98fde179e4091062e235246952a5ee76c78094e80aaf153835f5fe4178b9756a5550203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "3f686d41-6bf0-40b7-b3c7-d2505c318b29",
    "rev": "1-44a0d898b07a30b72d16cb6f4e2cb564",
    "created": 1679923798190,
    "modified": 1679923798190,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "db387ba4-328b-43ab-8b66-20258df77a1d",
    "rev": "1-5229cf90b2739cb0810c89ada2a816a1",
    "created": 1679923798144,
    "modified": 1679923798144,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "8fd86a17-d41e-4257-aae3-6021b55e9c96",
    "rev": "1-022e633d7519154a5cd98671b7e50114",
    "created": 1679923758883,
    "modified": 1679923758883,
    "author": "804c058a-5877-4424-8bed-4eba5300655f",
    "responsible": "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bd7df0510b70316e09624e84aee23c7a159846353dfc4716a6a2550c7759ceee791f312068a4b70f3cf53f3b12279e9b00ce230505d3dc4997187b644d7961110620202693c5403e3af9a5cdcabe2bacac9bd534647999927be52bbc0355baaa4e4020a234aa808b034bfa3c52461ed8e81b7b7f758267c6e9d1af102d19809d1f399957914a52f7676eb4a7384e53f3e774f9efd198378e85df4a87fe85ea291afffd78bbde4b2ac0b8dccc0fe3a3a629d0383b4315c0ed38bdf0dae62e6b43321f254615b09b7f489dd80115c8420b4d123cad46e722e11da0efbd446e57613dafb23eaed651e38a7d3faa11d2c6aee97a38ca7527a27e0a9112b427910dbb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "25f99cd0-fc8b-4f05-accc-d74b99cd6e5e",
    "rev": "1-f84a220f33cea4bcea8b9cfe374b5ae9",
    "created": 1679920642531,
    "modified": 1679920642531,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "b2ade2b5-775b-4979-9417-cd3a8045b979",
    "rev": "1-0bb5a660817bf063601ab80e60c88b2b",
    "created": 1679920642488,
    "modified": 1679920642488,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "84968b08-caed-4779-8888-2ca3c813fda8",
    "rev": "1-ffe353400a6a15ce17671a0fa919455a",
    "created": 1679920604172,
    "modified": 1679920604172,
    "author": "39eb165a-1b18-433a-bf1d-a3b6b87ef4a5",
    "responsible": "c15af6dd-d26a-404f-ac40-07efa5607f89",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "c15af6dd-d26a-404f-ac40-07efa5607f89",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b57746448f36c3406b875005b64c867410a26b5d177e2d9db75644cd21871c4181521cf5388167b3e0c7a3da1d0c54b388acf9ff30b1806ed32a9a5ed8298bd01813585f198b1d6e8a1dd642d3889859e86001dca59e3f282d82bba795105239c37b55644d6bc0969023bb41e90c412f54d786f3054831bba373b168c177fad54b92303dd1090bb2c5473145de1cb742c1a35d141eb418b05d03d711ae9158825b03f44a23b031c2dbc30eb96d9fd3b63e5631ecc5e226135a5ff86cb1e91eea8747eb81fa6341d7d7b9dc5367f909fff6e60c4791ffece9feb5d1671c65901d60460c9810a3427d86fb607b5c7549649740cc85e0427a8dcf9ec9862868564d0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "c15af6dd-d26a-404f-ac40-07efa5607f89": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "6abae71b-c44b-45db-909d-ef3715b36a80",
    "rev": "1-511cf5b3a9de410f5295cd41ee47b3eb",
    "created": 1679920308705,
    "modified": 1679920308705,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "e4babda6-983e-4d97-951c-6e2bbade8203",
    "rev": "1-4ae53304d7ae6459a1850e215e7d73e2",
    "created": 1679920308653,
    "modified": 1679920308653,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "2730eb4d-3a60-43f1-b023-24f8e4158edc",
    "rev": "1-a9390f74aac66917acc110ac988a37c4",
    "created": 1679920269232,
    "modified": 1679920269232,
    "author": "8dec4a36-dcd0-4619-b078-219a76cb60a7",
    "responsible": "2ca82608-87e0-46aa-8295-cc4bf0366a3c",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "2ca82608-87e0-46aa-8295-cc4bf0366a3c",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100dc50fde2afe664b1e67b605f26026f86324cac3d7c589e00d9718d6694fad654f2f5570aff43a8fba16ad4b7adf4a297c8ba16597f4bb029a00d031f80153915de53dadf65ec0ee5d72ee8e9491faafac6554b2e80ff9a28b39838bfdc115aee07f0dca44efa6fcce613134eb454b3fc3a79132b90efc8b9bb7055dc02949f032c7feeab637e599a3bc705c6ce7042bef61e74915fc68962ee05933a26272940a47d8386b5c80c32ec7375e3a81b6ff61830965f35e64afeb93d6353ac2fa9b861ac91cc75caf7d3ae623d3965540775a63dd92e74479fe124387d938a106c68fb651a13ce65763537f22ed0e33fddfc0ca1da9c05522071efd7ff988a95e9cb0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "43192bf9-4f72-454e-ae4a-692249e7af3c",
    "rev": "1-2b145be29a7773bb5e3f86b2b8aeb963",
    "created": 1679920182773,
    "modified": 1679920182773,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "OTHER",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "414b1aaf-a280-4c28-bf79-9dfb443f6729",
    "rev": "1-3348cc8ac8667453e2dc41e9ecab3dac",
    "created": 1679920182722,
    "modified": 1679920182722,
    "author": "68a4f7d3-aa5d-43ff-95a1-ba14675397ca",
    "responsible": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
    "status": "pending",
    "identifiers": [],
    "properties": [],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  },
  {
    "id": "e7a25f4d-aaa9-4f01-b3f0-5f7bf0a142c5",
    "rev": "1-c36b8a28401907fb2ef3e68fa3c28d5e",
    "created": 1679920178399,
    "modified": 1679920178399,
    "author": "97baa9dc-2a0d-49fb-af1d-cb3ca9a87106",
    "responsible": "e308f10d-d0f8-497b-b732-79fc0a79ad83",
    "status": "pending",
    "identifiers": [],
    "properties": [
      {
        "id": "dataOwnerConcernedId",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "e308f10d-d0f8-497b-b732-79fc0a79ad83",
          "type": "STRING"
        }
      },
      {
        "id": "dataOwnerConcernedPubKey",
        "type": {
          "type": "STRING"
        },
        "typedValue": {
          "stringValue": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b8b20272859beff03a3e62a0e46ad697361dbdda3d341d5df89890960a5c90c9fc347d1d00d4acf35c3a4b3e394c51cade568d102f052297c7479f538269c4ae15a995f3176a8afe0958b0aa7afce36a661a248ee98b0c7d0ec6c4887cf5b3b99b2754f2bc95b95283ea64209c837f1f826c91412c4253ad0763c3ee925b96db44a095dc2a1a84ab3200a8e53deb154321255ffe793f5c49071ee933ee1b570751d0c83859b26a6ca9a121a50417973e2b69f3944e2db9d00b785af6120663cf53b3a5f291063e0ba835d3fbabd1ef6e938cc2743a212e3ec3ccb966c605a09462126d60dd2add2eb9418613b9075f058d206a47a5328d75e1a36c4d3b85f90f0203010001",
          "type": "STRING"
        }
      }
    ],
    "type": "KEY_PAIR_UPDATE",
    "systemMetaData": {
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      },
      "encryptionKeys": {
        "e308f10d-d0f8-497b-b732-79fc0a79ad83": {},
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
      }
    }
  }
]
```
</details>

Then, you can change the status of the Notification to signal that the operation is being taken care of.

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:notification set ongoing-->
```typescript
const ongoingStatusUpdate = await apiAsDoctor.notificationApi.updateNotificationStatus(
  patientNotification,
  'ongoing',
)
```
<!-- output://code-samples/how-to/create-user-for-patient/ongoingStatusUpdate.txt -->
<details>
<summary>ongoingStatusUpdate</summary>

```json
{
  "id": "6de96672-293a-45ae-9395-7be7eb0d00aa",
  "rev": "2-82eb16a982a93bc187d29c716e6b5daa",
  "created": 1682493580443,
  "modified": 1682493580443,
  "author": "c842130a-06a2-4080-9d61-f65cea1066d1",
  "responsible": "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58",
  "status": "ongoing",
  "identifiers": [],
  "properties": [],
  "type": "NEW_USER_OWN_DATA_ACCESS",
  "systemMetaData": {
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>

To allow the new User to access all their own data, you can use the `giveAccessToAllDataOf` method.

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:data sharing-->
```typescript
const sharedData = await apiAsDoctor.patientApi.giveAccessToAllDataOf(patient.id)
```
<!-- output://code-samples/how-to/create-user-for-patient/sharedData.txt -->
<details>
<summary>sharedData</summary>

```json
{
  "patient": {
    "id": "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58",
    "languages": [],
    "active": true,
    "parameters": {},
    "rev": "8-ae81c72b93526b878193d5c143e8c399",
    "created": 1682493568425,
    "modified": 1682493568425,
    "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
    "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
    "firstName": "Marc",
    "lastName": "Specter",
    "companyName": "iCure",
    "identifiers": [],
    "labels": {},
    "codes": {},
    "names": [
      {
        "firstNames": [
          "Marc"
        ],
        "prefix": [],
        "suffix": [],
        "lastName": "Specter",
        "text": "Specter Marc",
        "use": "official"
      }
    ],
    "addresses": [
      {
        "description": "London",
        "addressType": "home",
        "telecoms": [
          {
            "telecomNumber": "9c2f414d@icure.com",
            "telecomType": "email"
          }
        ]
      }
    ],
    "gender": "unknown",
    "birthSex": "unknown",
    "mergedIds": {},
    "deactivationReason": "none",
    "personalStatus": "unknown",
    "partnerships": [],
    "patientHealthCareParties": [],
    "patientProfessions": [],
    "properties": {},
    "systemMetaData": {
      "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e0d5c9fe52a0ab54651b363fd6af25679f17285a2004b04b9e0f3b59816a1ceb1c4f5d14913e45b5679c41c53a0f0d4655eee5b7ca0fe02f348122d9f95b1d60acaabee6ab5498d4fbeeb805b3916b289dda9b999182bb88c05710aa61070cfb37435327b12772c485596f9d0203c3aa4a41b37a48baf9ede652e8737ca4d7583e4560bcf4974f0745f277aa4c2c5db2680b3fd92ed620fc3ce2e12343c3d465ab91143ac8f1ddb02701fcd02f4b7ae4fff28374ab2741182f7d3b62fca9dd20b4c1decec297f77e0d599635393374ea43790be3e2bed3555c8a76404b12c68cddc7a7d62e59448731141727b20c1f39312c4320e83604c8f999a2a7063267750203010001",
      "hcPartyKeys": {
        "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": [
          "1a838fdad75a5b31f0376f016b4cbc790551d22c942cab21afbfda929f2e26a1403cf7c8a317bd064904f5e0535e18d5750aa36849f572eff0d220a97f173160ea2c761e5104c4c54e0304c8a8c420d26145a5c99934b08db20a05588f9160d4a97c7720c53d7806d3ac5ee38f115a21982719abee5cd19ed8bd558727de7a26cb85f49bdea8a6ae9e32f9567a2e470ae087cb206fee3ad29b09ffecedc187148bbbf92c7bc233f99254c3cb0fc2a438befc6c492e974da7c3e06a94cb9d40ad32492a6d5cfddaaea9d71ab802c45fca8f6c953747419d3773cbf42164e0b914fec8ce8a87669e0ea5a06b1345ff251c0710b29e586e9e2ebdaec6fd2c638f52",
          "1a838fdad75a5b31f0376f016b4cbc790551d22c942cab21afbfda929f2e26a1403cf7c8a317bd064904f5e0535e18d5750aa36849f572eff0d220a97f173160ea2c761e5104c4c54e0304c8a8c420d26145a5c99934b08db20a05588f9160d4a97c7720c53d7806d3ac5ee38f115a21982719abee5cd19ed8bd558727de7a26cb85f49bdea8a6ae9e32f9567a2e470ae087cb206fee3ad29b09ffecedc187148bbbf92c7bc233f99254c3cb0fc2a438befc6c492e974da7c3e06a94cb9d40ad32492a6d5cfddaaea9d71ab802c45fca8f6c953747419d3773cbf42164e0b914fec8ce8a87669e0ea5a06b1345ff251c0710b29e586e9e2ebdaec6fd2c638f52"
        ],
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
          "b758140db648e445ef2b72d72954f86782b1cc864a13636e5363bccba19f19504d8c4598c717b218164ba979dd3aebae98b8a97b4a916e6e8ee7ac2bc3dae79131aae89d5cb3cdf74283ae298928b1472c77aa98ef15fbf9c4983f81af7e2ed0192c6291ae798e51c5596ff32c76e05003099ba47db24cef9924369409234f05eaa0521eb8d72bfb970a44ce03693cc81fa096552e8113468afb6437436d37c6e9ce6d5e72e9387d56ab08103d917e77a50c5fa5925d3a460dba48c25b7c4575a914fde7c00d78d6b0d23ba2407e060355e919819fdc54799174e029a11c2390f2463572c8c6165ae695c95ed9442b48b980bba5cf318e285e23fda8427a7d8a",
          "585c6309cd2b9c7f8b3bb7f30a50b7076e48b7fc2797ce0ca5fa495b6cbbef830c17c9928ba47ed8946f6e0f9a1849b2d3b8a4e5c4971b3c1db883104505686563958ea34cde09eb3a0b9c9ab9607ac46085300c9864d5f706d1b8e39b017f5d86b17803fdc0d67295f22242da54bee23fa274fb2eba26890cb9ad79768590be009ebc6b9c6aaf8db05176679c400afee5447ff8f9f31abda98060e1f8fddbe40993c154738f76b3ed3ee4222ad4d06d601d1419c1bd394a3107cd310a2bc911137e4e3d25fe7c38a95dcd1f160895c4dc7ca383d479b04e6c9fc7a63a3e92ba65856463423177d69e91c853e77b39287fe22f551afe54b537f64e531cf4aa3c"
        ]
      },
      "privateKeyShamirPartitions": {},
      "aesExchangeKeys": {
        "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e0d5c9fe52a0ab54651b363fd6af25679f17285a2004b04b9e0f3b59816a1ceb1c4f5d14913e45b5679c41c53a0f0d4655eee5b7ca0fe02f348122d9f95b1d60acaabee6ab5498d4fbeeb805b3916b289dda9b999182bb88c05710aa61070cfb37435327b12772c485596f9d0203c3aa4a41b37a48baf9ede652e8737ca4d7583e4560bcf4974f0745f277aa4c2c5db2680b3fd92ed620fc3ce2e12343c3d465ab91143ac8f1ddb02701fcd02f4b7ae4fff28374ab2741182f7d3b62fca9dd20b4c1decec297f77e0d599635393374ea43790be3e2bed3555c8a76404b12c68cddc7a7d62e59448731141727b20c1f39312c4320e83604c8f999a2a7063267750203010001": {
          "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {
            "3604c8f999a2a7063267750203010001": "1a838fdad75a5b31f0376f016b4cbc790551d22c942cab21afbfda929f2e26a1403cf7c8a317bd064904f5e0535e18d5750aa36849f572eff0d220a97f173160ea2c761e5104c4c54e0304c8a8c420d26145a5c99934b08db20a05588f9160d4a97c7720c53d7806d3ac5ee38f115a21982719abee5cd19ed8bd558727de7a26cb85f49bdea8a6ae9e32f9567a2e470ae087cb206fee3ad29b09ffecedc187148bbbf92c7bc233f99254c3cb0fc2a438befc6c492e974da7c3e06a94cb9d40ad32492a6d5cfddaaea9d71ab802c45fca8f6c953747419d3773cbf42164e0b914fec8ce8a87669e0ea5a06b1345ff251c0710b29e586e9e2ebdaec6fd2c638f52"
          },
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
            "3604c8f999a2a7063267750203010001": "b758140db648e445ef2b72d72954f86782b1cc864a13636e5363bccba19f19504d8c4598c717b218164ba979dd3aebae98b8a97b4a916e6e8ee7ac2bc3dae79131aae89d5cb3cdf74283ae298928b1472c77aa98ef15fbf9c4983f81af7e2ed0192c6291ae798e51c5596ff32c76e05003099ba47db24cef9924369409234f05eaa0521eb8d72bfb970a44ce03693cc81fa096552e8113468afb6437436d37c6e9ce6d5e72e9387d56ab08103d917e77a50c5fa5925d3a460dba48c25b7c4575a914fde7c00d78d6b0d23ba2407e060355e919819fdc54799174e029a11c2390f2463572c8c6165ae695c95ed9442b48b980bba5cf318e285e23fda8427a7d8a",
            "223f55731820b91ccd18010203010001": "585c6309cd2b9c7f8b3bb7f30a50b7076e48b7fc2797ce0ca5fa495b6cbbef830c17c9928ba47ed8946f6e0f9a1849b2d3b8a4e5c4971b3c1db883104505686563958ea34cde09eb3a0b9c9ab9607ac46085300c9864d5f706d1b8e39b017f5d86b17803fdc0d67295f22242da54bee23fa274fb2eba26890cb9ad79768590be009ebc6b9c6aaf8db05176679c400afee5447ff8f9f31abda98060e1f8fddbe40993c154738f76b3ed3ee4222ad4d06d601d1419c1bd394a3107cd310a2bc911137e4e3d25fe7c38a95dcd1f160895c4dc7ca383d479b04e6c9fc7a63a3e92ba65856463423177d69e91c853e77b39287fe22f551afe54b537f64e531cf4aa3c",
            "162b762390cd32b0acb3690203010001": "02199478d7ff66f09a9260f5d6512bd5e0d74d21697d23be00b9d151f951a83008b272e523b7ba881b43fba243fa97fab72280b87c11d26b00ccd6cf0dc0b99541ce2ecfd74f22fd0388aed7b9d664313d794ac826c6f7aea44b8cb87813508c65d5fe277d62e2840b0d8ac1d4c244c6a95df99b623f3eaab9fdcb98015361217adbf80bd3beddc96fe455f0d89abaec235605c899dbca80ea34d462f477d27483af08f8378abff7324bdc192c1300bcc10b69f6560dc6d839d3f8b297adf99e5e50c4d0675bc80f9e447a630c1281fee3d390b5383a29b2f4ee074ea9060afeab0cf75d6aacab4410cd906a3898b7c594647739cd0ee260688fc52ffe4e299c",
            "46576a2dcbb172a44a7c170203010001": "9356a7c3f424ce3c589c5b69b8c878b93d23c6a76db219c01cb928f9ce6e7e9120485540d85e41951b91c854ddc9c3ee197622cce3ba5c4f53a8cfa963a6d73be848d12528c65698228ec64ec24726a7a8bf7735a29eab4cb008d26fc0aa4dc7bb1f6069bc2b6b53126a6cc8e34b9faf7f13eeab79889fe5ea91c260fc3d4d50ab790e0aefabbdfdf494b68ea7278208564c231a19378221d4b3aa6ecc474179d566811c59fffaa1c43f615e7d69182b7680bf15cae65e4669bdc96318e1f1a1735041a7c511a3949d36c4b0675a49251386cfa4b661cf3c34534a24b3f7b4d1be8221fdd7874b6d31d8a8138e93e54439726aef182fcd7f8aa648db532105ed"
          }
        }
      },
      "transferKeys": {},
      "encryptedSelf": "8Ngjp6zMhAYtjW7DqCfua3858MPJmAnvAzn659VUw8k=",
      "secretForeignKeys": [],
      "cryptedForeignKeys": {},
      "delegations": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {}
      },
      "encryptionKeys": {
        "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
        "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {}
      }
    }
  },
  "statuses": {
    "dataSamples": {
      "success": true,
      "error": null,
      "modified": 1
    },
    "healthcareElements": {
      "success": true,
      "error": null,
      "modified": 1
    },
    "patient": {
      "success": true,
      "error": null,
      "modified": 0
    }
  }
}
```
</details>

If the method runs successfully, it will return a report of all the shared objects:


Finally, you can update the Notification status again to signal that the operation was completed successfully. 
Updating the status of the Notification is important, as otherwise you will risk of getting old Notifications when filtering
 for the new pending ones.

<!-- file://code-samples/how-to/create-user-for-patient/index.mts snippet:completed status-->
```typescript
const completedStatusUpdate = await apiAsDoctor.notificationApi.updateNotificationStatus(
  ongoingStatusUpdate,
  'completed',
)
```
<!-- output://code-samples/how-to/create-user-for-patient/completedStatusUpdate.txt -->
<details>
<summary>completedStatusUpdate</summary>

```json
{
  "id": "6de96672-293a-45ae-9395-7be7eb0d00aa",
  "rev": "3-1efe119d33432ab86b17b2865127d3ee",
  "created": 1682493580443,
  "modified": 1682493580443,
  "author": "c842130a-06a2-4080-9d61-f65cea1066d1",
  "responsible": "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58",
  "status": "completed",
  "identifiers": [],
  "properties": [],
  "type": "NEW_USER_OWN_DATA_ACCESS",
  "systemMetaData": {
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    },
    "encryptionKeys": {
      "c081e8ce-6ef1-438f-8b8c-e4e12e83ae58": {},
      "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
    }
  }
}
```
</details>
