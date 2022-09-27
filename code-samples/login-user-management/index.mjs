import {Api, HealthcareParty, ua2hex, User} from '@icure/api'
import {crypto} from '@icure/api/node-compat.js' //Only needed on node

const host = 'https://kraken.icure.dev/rest/v1';
const {
    userApi,
    healthcarePartyApi,
    cryptoApi
} = Api(host, 'watson', 'correct horse battery staple', crypto)

const {publicKey, privateKey} = await cryptoApi.RSA.generateKeyPair()
const exportedKey = ua2hex(await cryptoApi.RSA.exportKey(privateKey, 'pkcs8'))

//The private key will have to be stored in a secured place and used later
console.log(exportedKey)

const newHcp = await healthcarePartyApi.createHealthcareParty(
    new HealthcareParty({
        id: cryptoApi.randomUuid(),
        firstName: 'Elliott',
        lastName: 'Smith',
        publicKey: ua2hex(await cryptoApi.RSA.exportKey(publicKey, 'spki'))
    })
)

//Create user with unique login
const login = 'esmith_' + (+new Date());
const newUser = await userApi.createUser(new User({
    id: cryptoApi.randomUuid(),
    healthcarePartyId: newHcp.id,
    login: login,
    email: `${login}@example.com`,
    passwordHash: 'mypassword'
}))
console.log(newUser)

//Change user password
const modifiedUser = await userApi.modifyUser(new User({...newUser, passwordHash: 'otherPassword'}))
console.log(modifiedUser)

//Try to log in as modifiedUser
const {userApi: otherUserApi} = Api(host, login, 'otherPassword', crypto)
console.log(await otherUserApi.getCurrentUser())
