import "isomorphic-fetch";

import {initLocalStorage, initMedTechApi, privKey} from "../../utils/index.mjs";
import { hex2ua } from '@icure/api';

initLocalStorage()

const api = await initMedTechApi()

const loggedUser = await api.userApi.getLoggedUser();
await api!.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
  loggedUser.healthcarePartyId!,
  hex2ua(privKey)
);
