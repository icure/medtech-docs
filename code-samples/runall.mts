import 'isomorphic-fetch'
import * as fs from 'fs'
import * as process from 'process'
import { execSync } from 'child_process'
import * as Process from 'process'
import { getEnvVariables } from '@icure/test-setup/types'
import { TestEnvironmentBuilder } from '@icure/test-setup/builder'

const cwd = process.cwd()
if (!cwd.endsWith('/code-samples')) {
  throw Error('Please run this script from the code samples directory')
}
function scanAndRunRecursively(dir: string, additionalEnvs: { [key: string]: string }) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err
    }
    files.forEach(async (filename) => {
      const fullpath = `${dir}/${filename}`
      if (filename !== 'node_modules') {
        if (fs.lstatSync(fullpath).isDirectory()) {
          scanAndRunRecursively(fullpath, additionalEnvs)
        } else if (
          (filename === 'index.js' || filename === 'index.mjs') &&
          fs.lstatSync(fullpath).isFile()
        ) {
          const relative = '.' + fullpath.slice(cwd.length)
          console.log(`Running ${relative}`)
          execSync(`node ${relative}`, {
            env: {
              ...Process.env,
              ...additionalEnvs,
              SCRIPT_ROOT: fullpath.replace(/(.+)\/.+/, '$1'),
            },
            stdio: 'inherit',
          })
        }
      }
    })
  })
}

export const hcp1Username =
  process.env.ICURE_TS_TEST_HCP_USER ?? `hcp1.${new Date().getTime()}@icure.com`
export const hcp2Username =
  process.env.ICURE_TS_TEST_HCP_2_USER ?? `hcp2.${new Date().getTime()}@icure.com`
export const hcp3Username =
  process.env.ICURE_TS_TEST_HCP_3_USER ?? `hcp3.${new Date().getTime()}@icure.com`
export const patUsername =
  process.env.ICURE_TS_TEST_PAT_USER ?? `patient.${new Date().getTime()}@icure.com`

let env = getEnvVariables()
const scratchDir = 'test/scratch'
const baseEnvironment =
  env.testEnvironment === 'docker'
    ? new TestEnvironmentBuilder().setUpDockerEnvironment(scratchDir, ['mock'])
    : new TestEnvironmentBuilder()
const initializer = await baseEnvironment
  .withGroup(fetch, {
    patient: ['BASIC_USER', 'BASIC_DATA_OWNER'],
    hcp: ['BASIC_USER', 'BASIC_DATA_OWNER', 'PATIENT_USER_MANAGER', 'HIERARCHICAL_DATA_OWNER'],
    device: ['BASIC_USER', 'BASIC_DATA_OWNER'],
    user: ['BASIC_USER'],
  })
  .withMasterUser(fetch)
  .addHcp({ login: hcp1Username })
  .addHcp({ login: hcp2Username })
  .addHcp({ login: hcp3Username })
  .addPatient({ login: patUsername })
  .withSafeguard()
  .withEnvironmentSummary()
  .build()

env = await initializer.execute(getEnvVariables())

const additionalEnvs = {
  AUTH_BY_EMAIL_HCP_PROCESS_ID: env.hcpAuthProcessId,
  AUTH_BY_EMAIL_PROCESS_ID: env.patAuthProcessId,
  AUTH_BY_SMS_HCP_PROCESS_ID: env.hcpAuthProcessId,
  AUTH_BY_SMS_PROCESS_ID: env.patAuthProcessId,
  AUTH_PROCESS_ID: env.patAuthProcessId,
  ICURE_MSG_GTW_URL: env.msgGtwUrl,
  ICURE_URL: env.iCureUrl,
  ICURE_USER2_NAME: env.dataOwnerDetails[hcp2Username].user,
  ICURE_USER2_PASSWORD: env.dataOwnerDetails[hcp2Username].password,
  ICURE_USER2_PRIV_KEY: env.dataOwnerDetails[hcp2Username].privateKey,
  ICURE_USER_NAME: env.masterHcp.user,
  ICURE_USER_PASSWORD: env.masterHcp.password,
  ICURE_USER_PRIV_KEY: env.masterHcp.privateKey,
  ICURE_USER_PUB_KEY: env.masterHcp.publicKey,
  RECAPTCHA: env.recaptcha,
  SPEC_ID: env.specId,
  ICURE_PATIENT_ID: env.dataOwnerDetails[patUsername].dataOwnerId,
  ICURE_PATIENT_USER_NAME: env.dataOwnerDetails[patUsername].user,
  ICURE_PATIENT_PASSWORD: env.dataOwnerDetails[patUsername].password,
  ICURE_PATIENT_PRIV_KEY: env.dataOwnerDetails[patUsername].privateKey,
}

;['ehr-lite-sdk', 'medtech-sdk'].forEach((sdk) =>
  [`quick-start`, `how-to`, `explanation`, `tutorial`].forEach((module) => {
    scanAndRunRecursively(`${cwd}/${sdk}/${module}`, additionalEnvs)
  }),
)
