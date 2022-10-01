import "isomorphic-fetch";
import {
    CodingReference,
    HealthcareElement, ICureRegistrationEmail,
    medTechApi, Patient,
    Address, Telecom
} from '@icure/medical-device-sdk'
import { webcrypto } from "crypto";
import {hex2ua} from "@icure/api";
import { LocalStorage } from 'node-localstorage';
import {host, msgGtwUrl, password, patientId, privKey, specId, userName} from "../../utils/index.mjs";
import os from "os";
import {expect} from 'chai';
import {v4 as uuid} from 'uuid';

const tmp = os.tmpdir();
(global as any).localStorage = new LocalStorage(tmp, 5 * 1024**3);
(global as any).Storage = "";

const api = await medTechApi()
    .withICureBasePath(host)
    .withUserName(userName)
    .withPassword(password)
    .withMsgGtwUrl(msgGtwUrl)
    .withMsgGtwSpecId(specId)
    .withCrypto(webcrypto as any)
    .build()

const user = await api.userApi.getLoggedUser()
await api.cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
    user.healthcarePartyId ?? user.patientId ?? user.deviceId,
    hex2ua(privKey)
);
const hcp = await api.healthcareProfessionalApi.getHealthcareProfessional(user.healthcarePartyId);
hcp.addresses = [new Address({
  addressType: "home",
  description: "London",
  telecoms: [
    new Telecom({
      telecomType: "email",
      telecomNumber: userName
    })
  ]
})]

const patientEmail = `${uuid().substring(0,8)}@icure.com`

const existingPatient = await api.patientApi.createOrModifyPatient(
    new Patient({
        firstName: "Marc",
        lastName: "Specter",
        addresses: [new Address({
            addressType: "home",
            description: "London",
            telecoms: [
                new Telecom({
                    telecomType: "email",
                    telecomNumber: patientEmail
                })
            ]
        })]
    })
);
expect(!!existingPatient).to.eq(true); //skip

//tech-doc: doctor invites user
const messageFactory = new ICureRegistrationEmail(
    hcp,
    "test",
    "iCure",
    existingPatient
)
const createdUser = await api.userApi.createAndInviteUser(existingPatient, messageFactory);
expect(createdUser.patientId).to.eq(existingPatient.id); // skip
//tech-doc: STOP HERE
