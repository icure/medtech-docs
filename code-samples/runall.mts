import * as fs from 'fs'
import * as process from 'process'
import { execSync } from 'child_process'
import * as Process from 'process'
import { createHcpUser, createPatientUser } from './utils/index.mjs'

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

let additionalEnvs = {}
if (
  !process.env.ICURE_PATIENT_ID ||
  !process.env.ICURE_PATIENT_USER_NAME ||
  !process.env.ICURE_PATIENT_PASSWORD ||
  !process.env.ICURE_PATIENT_PRIV_KEY
) {
  const user = await createPatientUser()
  additionalEnvs = {
    ICURE_PATIENT_ID: user.dataOwnerId,
    ICURE_PATIENT_USER_NAME: user.user,
    ICURE_PATIENT_PASSWORD: user.password,
    ICURE_PATIENT_PRIV_KEY: user.privateKey,
  }
}

if (
  !process.env.ICURE_USER2_NAME ||
  !process.env.ICURE_USER2_PASSWORD ||
  !process.env.ICURE_USER2_PRIV_KEY
) {
  const user = await createHcpUser()
  additionalEnvs = {
    ...additionalEnvs,
    ICURE_USER2_NAME: user.user,
    ICURE_USER2_PASSWORD: user.password,
    ICURE_USER2_PRIV_KEY: user.privateKey,
  }
}

;[`quick-start`, `how-to`, `explanation`, `tutorial`].forEach((module) => {
  scanAndRunRecursively(`${cwd}/${module}`, additionalEnvs)
})
