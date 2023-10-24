import 'isomorphic-fetch'

import { initLocalStorage, output } from '../../../utils/index.mjs'
import { initEHRLiteApi } from '../../utils/index.mjs'
import { LocalComponent, Observation, Patient } from '@icure/ehr-lite-sdk'
import { CodingReference, mapOf } from '@icure/typescript-common'

initLocalStorage()
