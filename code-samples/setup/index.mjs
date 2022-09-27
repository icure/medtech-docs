import { Api } from '@icure/api'
import { crypto } from '@icure/api/node-compat.js' //Only needed on node

const host = 'https://kraken.icure.dev/rest/v1';
const {
    userApi,
    healthcarePartyApi,
    cryptoApi
} = Api(host, 'watson', 'correct horse battery staple', crypto)

const user = await userApi.getCurrentUser()
console.log(user.login)
