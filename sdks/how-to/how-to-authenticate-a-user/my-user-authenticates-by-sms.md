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
```

Once your AnonymousMedTechApi is initialised, you can start the authentication of your user by calling the 
`authenticationApi.startAuthentication` service. 

Make sure to provide user's phone number instead of their email. 

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user-by-sms/index.mts snippet:Start Authentication Process By SMS-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user-by-sms/authProcess.txt -->
<details>
<summary>authProcess</summary>

```json
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
```

<!-- file://code-samples/{{sdk}}/how-to/authenticate-user-by-sms/index.mts snippet:Complete login authentication process-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/authenticate-user-by-sms/foundPatientAfterLogin.txt -->
<details>
<summary>foundPatientAfterLogin</summary>

```json
```
</details>
