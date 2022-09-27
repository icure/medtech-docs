---
slug: login-as-a-user
---
# Login as a user

<!-- file://code-samples/introduction/index.mjs snippet:How to use-->
```typescript
import {Api, hex2ua, Patient} from '@icure/api'
import {crypto} from '@icure/api/node-compat.js'

const host = 'https://kraken.icure.dev/rest/v1';
const {
	patientApi,
	userApi,
	healthcarePartyApi,
	cryptoApi
} = Api(host, 'esmith', 'mypassword', crypto)

const loggedUser = await userApi.getCurrentUser();

await cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
	loggedUser.healthcarePartyId,
	hex2ua("308204bc02...473a613059")
)

const patient = await patientApi.createPatientWithUser(loggedUser,
	await patientApi.newInstance(
		loggedUser,
		new Patient({
			firstName: 'Gustave',
			lastName: 'Eiffel',
			profession: 'Architect & Engineer',
			dateOfBirth: 19731012,
			note: 'A very private information'
		}))
)
const fetchedPatient = await patientApi.getPatientWithUser(loggedUser, patient.id)
console.log(JSON.stringify(fetchedPatient, null, ' '))
```

aaa

<!-- file://code-samples/introduction/index.mjs snippet:How to use-->
```typescript
import {Api, hex2ua, Patient} from '@icure/api'
import {crypto} from '@icure/api/node-compat.js'

const host = 'https://kraken.icure.dev/rest/v1';
const {
	patientApi,
	userApi,
	healthcarePartyApi,
	cryptoApi
} = Api(host, 'esmith', 'mypassword', crypto)

const loggedUser = await userApi.getCurrentUser();

await cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
	loggedUser.healthcarePartyId,
	hex2ua("308204bc02...473a613059")
)

const patient = await patientApi.createPatientWithUser(loggedUser,
	await patientApi.newInstance(
		loggedUser,
		new Patient({
			firstName: 'Gustave',
			lastName: 'Eiffel',
			profession: 'Architect & Engineer',
			dateOfBirth: 19731012,
			note: 'A very private information'
		}))
)
const fetchedPatient = await patientApi.getPatientWithUser(loggedUser, patient.id)
console.log(JSON.stringify(fetchedPatient, null, ' '))
```

































































































































































