import * as process from "process";

function requireDefined(s: string, name: string): string {
  if (!s) {
    throw Error(`${name} is not defined or empty.`)
  }
  return s
}

export const password = requireDefined(process.env.ICURE_USER_PASSWORD, 'ICURE_USER_PASSWORD')
export const userName = requireDefined(process.env.ICURE_USER_NAME, 'ICURE_USER_NAME')
export const privKey = requireDefined(process.env.ICURE_USER_PRIV_KEY, 'ICURE_USER_PRIV_KEY')
export const pubKey = requireDefined(process.env.ICURE_USER_PUB_KEY, 'ICURE_USER_PUB_KEY')
export const host = requireDefined(process.env.ICURE_URL, 'ICURE_URL')
export const patientId = requireDefined(process.env.ICURE_PATIENT_ID, "ICURE_PATIENT_ID")
export const patientUserName = requireDefined(process.env.ICURE_PATIENT_USER_NAME, "ICURE_PATIENT_USER_NAME")
export const patientPassword = requireDefined(process.env.ICURE_PATIENT_PASSWORD, "ICURE_PATIENT_PASSWORD")
export const patientPrivKey = requireDefined(process.env.ICURE_PATIENT_PRIV_KEY, "ICURE_PATIENT_PRIV_KEY")
export const msgGtwUrl = requireDefined(process.env.ICURE_MSG_GTW_URL, "ICURE_MSG_GTW_URL")
export const specId = requireDefined(process.env.SPEC_ID, "SPEC_ID")