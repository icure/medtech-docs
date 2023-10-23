import { initLocalStorage, output } from '../../../utils/index.mjs'
import 'isomorphic-fetch'
import { expect } from 'chai'
import { initEHRLiteApi } from '@site/code-samples/ehr-lite-sdk/utils/index.mjs'
import {Practitioner, Location, ContactPoint, PractitionerFilter} from "@icure/ehr-lite-sdk";
import {CodingReference} from "@icure/typescript-common";
import {ContactPointTelecomTypeEnum} from "@icure/ehr-lite-sdk/models/enums/ContactPointTelecomType.enum";

initLocalStorage()

const api = await initEHRLiteApi(true)
const practitionerCode = Math.random().toString(36).substring(4)

//tech-doc: Create a healthcare professional
const practitioner: Practitioner = new Practitioner({
  firstName: 'John',
  lastName: 'Keats',
  speciality: 'Psychiatrist',
  codes: new Set([new CodingReference({ type: 'practitioner-specialty', code: practitionerCode })]),
  addresses: [
    new Location({
      telecoms: [
        new ContactPoint({
          system: ContactPointTelecomTypeEnum.EMAIL,
          value: `jk@hospital.care`,
        }),
      ],
    }),
  ],
})

const createdPractitioner = await api.practitionerApi.createOrModify(
  practitioner,
)

//tech-doc: STOP HERE
output({ createdHcp: createdPractitioner, healthcareProfessional: practitioner })

expect(createdPractitioner.id).to.be.a('string')
expect(createdPractitioner.firstName).to.equal('John')
expect(createdPractitioner.lastName).to.equal('Keats')
expect(createdPractitioner.addresses[0].telecoms[0].value).to.equal('jk@hospital.care')

//tech-doc: Load a healthcare professional by id
const loadedPractitioner = await api.practitionerApi.get(createdPractitioner.id)
//tech-doc: STOP HERE
output({ loadedHcp: loadedPractitioner })

expect(loadedPractitioner.id).to.be.equal(createdPractitioner.id)
expect(loadedPractitioner.firstName).to.equal('John')
expect(loadedPractitioner.lastName).to.equal('Keats')

//tech-doc: Filter healthcare professionals
const practitioners = await api.practitionerApi.filterBy(
  await new PractitionerFilter(api)
    .byLabelCodeFilter(undefined, undefined, 'practitioner-specialty', practitionerCode)
    .build(),
)
//tech-doc: STOP HERE
output({ hcps: practitioners })

expect(practitioners.rows.length).to.be.equal(1)
expect(practitioners.rows[0].id).to.be.equal(createdPractitioner.id)

//tech-doc: Update a healthcare professional
const practitionerToModify = await api.practitionerApi.get(createdPractitioner.id)
const modifiedPractitioner = await api.practitionerApi.createOrModify(
  new Practitioner({ ...practitionerToModify, civility: 'Dr.' }),
)
//tech-doc: STOP HERE
output({ modifiedHcp: modifiedPractitioner })

expect(modifiedPractitioner.id).to.be.equal(createdPractitioner.id)
expect(modifiedPractitioner.civility).to.equal('Dr.')

//tech-doc: Delete a healthcare professional
const deletedPractitioner = await api.practitionerApi.delete(createdPractitioner.id)
//tech-doc: STOP HERE
output({ deletedHcp: deletedPractitioner })
