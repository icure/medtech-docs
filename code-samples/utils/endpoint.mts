import 'isomorphic-fetch'
import * as process from 'process'

function requireDefined(s: string, name: string): string {
  if (!s) {
    throw Error(`${name} is not defined or empty.`)
  }
  return s
}

export const password = requireDefined(process.env.ICURE_USER_PASSWORD, 'ICURE_USER_PASSWORD')
export const userName = requireDefined(process.env.ICURE_USER_NAME, 'ICURE_USER_NAME')
export const privKey = requireDefined(process.env.ICURE_USER_PRIV_KEY, 'ICURE_USER_PRIV_KEY')
export const host = requireDefined(process.env.ICURE_URL, 'ICURE_URL')
export const msgGtwUrl = requireDefined(process.env.ICURE_MSG_GTW_URL, 'ICURE_MSG_GTW_URL')
export const specId = requireDefined(process.env.SPEC_ID, 'SPEC_ID')
export const authProcessId = requireDefined(process.env.AUTH_PROCESS_ID, 'AUTH_PROCESS_ID')
export const patientId = requireDefined(process.env.ICURE_PATIENT_ID, 'ICURE_PATIENT_ID')
export const patientUserName = requireDefined(
  process.env.ICURE_PATIENT_USER_NAME,
  'ICURE_PATIENT_USER_NAME',
)
export const patientPassword = requireDefined(
  process.env.ICURE_PATIENT_PASSWORD,
  'ICURE_PATIENT_PASSWORD',
)
export const patientPrivKey = requireDefined(
  process.env.ICURE_PATIENT_PRIV_KEY,
  'ICURE_PATIENT_PRIV_KEY',
)
export const userName2 = requireDefined(process.env.ICURE_USER2_NAME, 'ICURE_USER2_NAME')
export const password2 = requireDefined(process.env.ICURE_USER2_PASSWORD, 'ICURE_USER2_PASSWORD')
export const privKey2 = requireDefined(process.env.ICURE_USER2_PRIV_KEY, 'ICURE_USER2_PRIV_KEY')

export const userName3 = requireDefined(process.env.ICURE_USER3_NAME, 'ICURE_USER3_NAME')
export const password3 = requireDefined(process.env.ICURE_USER3_PASSWORD, 'ICURE_USER3_PASSWORD')
export const privKey3 = requireDefined(process.env.ICURE_USER3_PRIV_KEY, 'ICURE_USER3_PRIV_KEY')
