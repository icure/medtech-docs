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
  "requestId": "2765a90e-62e6-4de9-bba2-f713c8299ec2",
  "login": "+32676455247",
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
  "id": "6d8eab22-c675-4871-9d0b-6fca40a75412",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-bb83851d6e3ba170a337a88907df8fe3",
  "created": 1680075034405,
  "modified": 1680075034405,
  "author": "4224ccd4-b8a1-4372-8c12-0a6d2f09a322",
  "responsible": "8748d23e-98c7-4275-b5a6-06e51f5d445a",
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
    "encryptedSelf": "TzYbyGx8KGGoEBXGKJCwRkOgiaPPbo0zjm/C+OfBTX6e1GeKCsr3nM3M6sZiZvMWE0bm11kTaSUiLvz0hqggmg==",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "8748d23e-98c7-4275-b5a6-06e51f5d445a": {}
    },
    "encryptionKeys": {
      "8748d23e-98c7-4275-b5a6-06e51f5d445a": {}
    }
  }
}
```
</details>
