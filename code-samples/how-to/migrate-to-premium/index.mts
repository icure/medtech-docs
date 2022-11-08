import { medTechApi } from '@icure/medical-device-sdk';
import { host, password, userName } from '../../utils/index.mjs';
import { webcrypto } from 'crypto'

//tech-doc: instantiate the api
const medtechApi = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(userName)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .build()
//tech-doc: end
