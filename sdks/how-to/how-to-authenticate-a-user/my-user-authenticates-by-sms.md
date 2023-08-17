---
slug: how-to-authenticate-a-user-by-sms
---
# What if my user wants to authenticate by SMS ?

If your user would like to authenticate by SMS, the authentication process (Registration / Login) is extremely similar to the user authentication by email.

## Register a user by SMS
When you want to start user registration, make sure to call the method `withAuthProcessBySmsId()` to provide the 
`authenticationProcessBySmsId`. For detailed information about those authentication process ids, head to 
the [User Authentication - Init AnonymousMedTechApi](/{{sdk}}/how-to/how-to-authenticate-a-user/how-to-authenticate-a-user#init-anonymousmedtechapi) how to.

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user-by-sms/index.mts snippet:Instantiate AnonymousMedTech API-->
```typescript
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
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()
```

Once your AnonymousMedTechApi is initialised, you can start the authentication of your user by calling the 
`authenticationApi.startAuthentication` service. 

Make sure to provide user's phone number instead of their email. 

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user-by-sms/index.mts snippet:Start Authentication Process By SMS-->
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
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user-by-sms/authProcess.txt -->
<details>
<summary>authProcess</summary>

```json
{
  "requestId": "f238b4eb-6389-439f-a966-dc4384fa8c8d",
  "login": "+32778028653",
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
stays very similar to [Login By Email](/{{sdk}}/how-to/how-to-authenticate-a-user/how-to-authenticate-a-user#regenerate-the-credentials-for-a-user). 

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user-by-sms/index.mts snippet:Login by SMS-->
```typescript
const anonymousApiForLogin = await new AnonymousMedTechApiBuilder()
  .withICureBaseUrl(iCureUrl)
  .withCrypto(webcrypto as any)
  .withMsgGwUrl(msgGtwUrl)
  .withMsgGwSpecId(specId)
  .withAuthProcessByEmailId(authProcessByEmailId)
  .withAuthProcessBySmsId(authProcessBySmsId)
  .withCryptoStrategies(new SimpleMedTechCryptoStrategies([]))
  .build()

const authProcessLogin = await anonymousApiForLogin.authenticationApi.startAuthentication(
  recaptcha,
  undefined,
  userPhoneNumber, // The phone number used for user registration
)
```

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user-by-sms/index.mts snippet:Complete login authentication process-->
```typescript
const loginResult = await anonymousApiForLogin.authenticationApi.completeAuthentication(
  authProcessLogin!,
  validationCodeForLogin,
)

const loggedUserApi = loginResult.medTechApi

const foundPatientAfterLogin = await loggedUserApi.patientApi.getPatient(createdPatient.id)
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user-by-sms/foundPatientAfterLogin.txt -->
<details>
<summary>foundPatientAfterLogin</summary>

```json
{
  "id": "c05bfb27-bac9-4117-ba51-ec44bd96e4f1",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-9c712757738ccdabf7da0638968e0262",
  "created": 1679997692519,
  "modified": 1679997692519,
  "author": "169f7a83-3aa0-4722-8914-5b9b8bfbcaee",
  "responsible": "16f68184-5547-4fa9-ad84-5c46e57b9cbb",
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
    "encryptedSelf": "Xou8KoD+S9Aza9AHKxqNmtQloAUkUe/EIF/XPKmOMu8EBOdPHvGf+cv9ionMEa9brYP+h6n66ACyyLTMHs0dIg==",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "16f68184-5547-4fa9-ad84-5c46e57b9cbb": {}
    },
    "encryptionKeys": {
      "16f68184-5547-4fa9-ad84-5c46e57b9cbb": {}
    }
  }
}
```
</details>
