---
slug: how-to-authenticate-a-user-by-sms
---
# What if my user wants to authenticate by SMS ?

If your user would like to authenticate by SMS, the authentication process (Registration / Login) is extremely similar to the user authentication by email.

## Register a user by SMS
When you want to start user registration, make sure to call the method `withAuthProcessBySmsId()` to provide the 
`authenticationProcessBySmsId`. For detailed information about those authentication process ids, head to 
the [User Authentication - Init AnonymousMedTechApi](index.md#Init AnonymousMedTechApi)

<!-- file://code-samples/how-to/authenticate-user-by-sms/index.mts snippet:Instantiate AnonymousMedTech API-->
```typescript
const iCureUrl = process.env.ICURE_URL
const msgGtwUrl = process.env.ICURE_MSG_GTW_URL
const specId = process.env.SPEC_ID
const authProcessByEmailId = process.env.AUTH_BY_EMAIL_HCP_PROCESS_ID
const authProcessBySmsId = process.env.AUTH_BY_SMS_HCP_PROCESS_ID
const recaptcha = process.env.RECAPTCHA

const anonymousApi = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .build()
```

Once your AnonymousMedTechApi is initialised, you can start the authentication of your user by calling the 
`authenticationApi.startAuthentication` service. 

Make sure to provide user's phone number instead of their email. 

<!-- file://code-samples/how-to/authenticate-user-by-sms/index.mts snippet:Start Authentication Process By SMS-->
```typescript
const authProcess = await anonymousApi.authenticationApi.startAuthentication(
  recaptcha,
  undefined,
  userPhoneNumber, // Phone number of the user who wants to register
  'Ned',
  'Stark',
  masterHcpId,
)
```
<!-- output://code-samples/how-to/authenticate-user-by-sms/authProcess.txt -->
<details>
<summary>authProcess</summary>

```json
{
  "requestId": "9c2ed054-6129-4427-bee6-fb213b68bd7c",
  "login": "+32281756707",
  "bypassTokenCheck": false
}
```
</details>

Your user is now able to create data on their own. 

:::info

If you choose to provide user email **AND** phone number, they will by default, receives their validation code by email.

:::

## Login by SMS
Use the `authenticationApi.startAuthentication` service again, by providing the user's phone number. The login process 
stays very similar to [Login By Email](index.md#Login a user). 

<!-- file://code-samples/how-to/authenticate-user-by-sms/index.mts snippet:Login by SMS-->
```typescript
const anonymousApiForLogin = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .build()

const authProcessLogin = await anonymousApiForLogin.authenticationApi.startAuthentication(
  recaptcha,
  undefined,
  userPhoneNumber, // The phone number used for user registration
)
```

<!-- file://code-samples/how-to/authenticate-user-by-sms/index.mts snippet:Complete login authentication process-->
```typescript
const loginResult = await anonymousApiForLogin.authenticationApi.completeAuthentication(
  authProcessLogin!,
  validationCodeForLogin,
)

const loggedUserApi = loginResult.medTechApi

const foundPatientAfterLogin = await loggedUserApi.patientApi.getPatient(createdPatient.id)
```
<!-- output://code-samples/how-to/authenticate-user-by-sms/foundPatientAfterLogin.txt -->
<details>
<summary>foundPatientAfterLogin</summary>

```json
{
  "id": "92e1281c-da54-479a-b1ae-c96cdacee54c",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-5bfc09574ba0f585f6697d883aff15df",
  "created": 1679928150868,
  "modified": 1679928150868,
  "author": "c456f7e3-5a9a-4321-8650-1bd82707df41",
  "responsible": "9b930532-8dd8-44d9-a9f3-ea835d56b9fe",
  "firstName": "Robb",
  "lastName": "Stark",
  "note": "You must keep one's head",
  "identifiers": [],
  "labels": {},
  "codes": {},
  "names": [
    {
      "firstNames": [
        "Robb"
      ],
      "prefix": [],
      "suffix": [],
      "lastName": "Stark",
      "text": "Stark Robb",
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
    "encryptedSelf": "SUWDfWdClYvOxzM08X1X5q/2Cf9ZvbLoT1dJoFVcTmePuclcrV485laJhvh3+yUAog+cbKKvnONsG+QJRiNUxg==",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "9b930532-8dd8-44d9-a9f3-ea835d56b9fe": {}
    },
    "encryptionKeys": {
      "9b930532-8dd8-44d9-a9f3-ea835d56b9fe": {}
    }
  }
}
```
</details>
