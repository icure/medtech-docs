//tech-doc: instantiate the api
import { medTechApi } from '@icure/medical-device-sdk';
import { webcrypto } from "crypto";
const password = process.env.PASSWORD;
const host = 'https://api.icure.cloud/rest/v1';
const api = await medTechApi()
    .withICureBasePath(host)
    .withUserName('admin')
    .withPassword(password)
    .withCrypto(webcrypto)
    .build();
