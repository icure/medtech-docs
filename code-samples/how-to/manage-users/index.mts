import { medTechApi } from '@icure/medical-device-sdk'
import { webcrypto } from "crypto";
import { host, userName, password } from "../../utils/index.mjs";
import "isomorphic-fetch";
import {LocalStorage} from "node-localstorage";
import * as os from "os";
import { expect } from "chai";

const tmp = os.tmpdir();
(global as any).localStorage = new LocalStorage(tmp, 5 * 1024 * 1024 * 1024);
(global as any).Storage = "";

const api = await medTechApi()
	.withICureBasePath(host)
	.withUserName(userName)
	.withPassword(password)
	.withCrypto(webcrypto as any)
	.build()

//tech-doc: Create a user
import { User } from '@icure/medical-device-sdk'

let userToCreate = new User({login: 'john', email: 'john@hospital.care', passwordHash: 'correct horse battery staple'});
const newUser = await api.userApi.createOrModifyUser(userToCreate)

//tech-doc: STOP HERE
expect(newUser.id).to.be.a('string')
expect(newUser.login).to.equal('john')
expect(newUser.email).to.equal('john@hospital.care')
expect(newUser.passwordHash).to.not.equal('correct horse battery staple')