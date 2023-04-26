---
slug: how-to-authenticate-a-user-by-sms
---
# What if my user wants to authenticate by SMS ?

If your user would like to authenticate by SMS, the authentication process (Registration / Login) is extremely similar to the user authentication by email.

## Register a user by SMS
When you want to start user registration, make sure to call the method `withAuthProcessBySmsId()` to provide the 
`authenticationProcessBySmsId`. For detailed information about those authentication process ids, head to 
the [User Authentication - Init AnonymousMedTechApi](/sdks/how-to/how-to-authenticate-a-user/how-to-authenticate-a-user#init-anonymousmedtechapi) how to.

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
  "requestId": "cb15679d-f0d2-4ef3-8ec2-8e01d98d2d82",
  "login": "+32588235595",
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
stays very similar to [Login By Email](/sdks/how-to/how-to-authenticate-a-user/how-to-authenticate-a-user#regenerate-the-credentials-for-a-user). 

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
  "id": "4d085141-98e4-4cbc-aa34-ef9ed3fc6622",
  "languages": [],
  "active": true,
  "parameters": {},
  "rev": "1-9a90cdd7873ee86f70016fa6d22c3499",
  "created": 1682493517812,
  "modified": 1682493517812,
  "author": "ad20e686-d697-45cc-a779-34a2711b718e",
  "responsible": "6176f1be-520f-45ea-9ef0-4bd60e593d4c",
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
    "encryptedSelf": "XXzr5hjnwZITzfDIsOpqO22DwUFToyAfbwqv9R6uINVX8bgM89HoJBntENjsTrB5BmFPRQ0ybC8AcK3nWIXZUA==",
    "secretForeignKeys": [],
    "cryptedForeignKeys": {},
    "delegations": {
      "6176f1be-520f-45ea-9ef0-4bd60e593d4c": {}
    },
    "encryptionKeys": {
      "6176f1be-520f-45ea-9ef0-4bd60e593d4c": {}
    }
  }
}
```
</details>
