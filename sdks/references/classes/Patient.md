[@icure/medical-device-sdk](../modules.md) / Patient

# Class: Patient

## Implements

- [`PotentiallyEncryptedPatient`](../interfaces/PotentiallyEncryptedPatient.md)

## Table of contents

### Constructors

- [constructor](Patient.md#constructor)

### Properties

- [active](Patient.md#active)
- [addresses](Patient.md#addresses)
- [administrativeNote](Patient.md#administrativenote)
- [alias](Patient.md#alias)
- [author](Patient.md#author)
- [birthSex](Patient.md#birthsex)
- [civility](Patient.md#civility)
- [codes](Patient.md#codes)
- [companyName](Patient.md#companyname)
- [created](Patient.md#created)
- [dateOfBirth](Patient.md#dateofbirth)
- [dateOfDeath](Patient.md#dateofdeath)
- [deactivationReason](Patient.md#deactivationreason)
- [deceased](Patient.md#deceased)
- [deletionDate](Patient.md#deletiondate)
- [education](Patient.md#education)
- [endOfLife](Patient.md#endoflife)
- [ethnicity](Patient.md#ethnicity)
- [externalId](Patient.md#externalid)
- [firstName](Patient.md#firstname)
- [gender](Patient.md#gender)
- [id](Patient.md#id)
- [identifiers](Patient.md#identifiers)
- [labels](Patient.md#labels)
- [languages](Patient.md#languages)
- [lastName](Patient.md#lastname)
- [maidenName](Patient.md#maidenname)
- [mergeToPatientId](Patient.md#mergetopatientid)
- [mergedIds](Patient.md#mergedids)
- [modified](Patient.md#modified)
- [names](Patient.md#names)
- [nationality](Patient.md#nationality)
- [note](Patient.md#note)
- [parameters](Patient.md#parameters)
- [partnerName](Patient.md#partnername)
- [partnerships](Patient.md#partnerships)
- [patientHealthCareParties](Patient.md#patienthealthcareparties)
- [patientProfessions](Patient.md#patientprofessions)
- [personalStatus](Patient.md#personalstatus)
- [picture](Patient.md#picture)
- [placeOfBirth](Patient.md#placeofbirth)
- [placeOfDeath](Patient.md#placeofdeath)
- [profession](Patient.md#profession)
- [properties](Patient.md#properties)
- [race](Patient.md#race)
- [responsible](Patient.md#responsible)
- [rev](Patient.md#rev)
- [spouseName](Patient.md#spousename)
- [ssin](Patient.md#ssin)
- [systemMetaData](Patient.md#systemmetadata)

### Methods

- [marshal](Patient.md#marshal)

## Constructors

### constructor

• **new Patient**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `IPatient` |

#### Defined in

[src/models/Patient.ts:26](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L26)

## Properties

### active

• **active**: `boolean`

Is the patient active (boolean).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[active](../interfaces/PotentiallyEncryptedPatient.md#active)

#### Defined in

[src/models/Patient.ts:102](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L102)

___

### addresses

• **addresses**: [`Address`](Address.md)[]

the list of addresses (with address type).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[addresses](../interfaces/PotentiallyEncryptedPatient.md#addresses)

#### Defined in

[src/models/Patient.ts:95](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L95)

___

### administrativeNote

• `Optional` **administrativeNote**: `string`

An administrative note, not confidential.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[administrativeNote](../interfaces/PotentiallyEncryptedPatient.md#administrativenote)

#### Defined in

[src/models/Patient.ts:117](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L117)

___

### alias

• `Optional` **alias**: `string`

An alias of the person, nickname, ...

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[alias](../interfaces/PotentiallyEncryptedPatient.md#alias)

#### Defined in

[src/models/Patient.ts:101](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L101)

___

### author

• `Optional` **author**: `string`

The id of the [User] that created this patient. When creating the patient, this field will be filled automatically by the current user id if not provided.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[author](../interfaces/PotentiallyEncryptedPatient.md#author)

#### Defined in

[src/models/Patient.ts:84](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L84)

___

### birthSex

• `Optional` **birthSex**: [`PatientBirthSexEnum`](../modules.md#patientbirthsexenum)

the birth sex of the patient: male, female, indeterminate, unknown

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[birthSex](../interfaces/PotentiallyEncryptedPatient.md#birthsex)

#### Defined in

[src/models/Patient.ts:98](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L98)

___

### civility

• `Optional` **civility**: `string`

Mr., Ms., Pr., Dr. ...

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[civility](../interfaces/PotentiallyEncryptedPatient.md#civility)

#### Defined in

[src/models/Patient.ts:96](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L96)

___

### codes

• **codes**: `Set`<[`CodingReference`](CodingReference.md)\>

A code is an item from a codification system that qualifies the content of this patient.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[codes](../interfaces/PotentiallyEncryptedPatient.md#codes)

#### Defined in

[src/models/Patient.ts:87](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L87)

___

### companyName

• `Optional` **companyName**: `string`

the name of the company this patient is member of.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[companyName](../interfaces/PotentiallyEncryptedPatient.md#companyname)

#### Defined in

[src/models/Patient.ts:93](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L93)

___

### created

• `Optional` **created**: `number`

the creation date of the patient (encoded as epoch).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[created](../interfaces/PotentiallyEncryptedPatient.md#created)

#### Defined in

[src/models/Patient.ts:82](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L82)

___

### dateOfBirth

• `Optional` **dateOfBirth**: `number`

The birthdate encoded as a fuzzy date on 8 positions (YYYYMMDD) MM and/or DD can be set to 00 if unknown (19740000 is a valid date).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[dateOfBirth](../interfaces/PotentiallyEncryptedPatient.md#dateofbirth)

#### Defined in

[src/models/Patient.ts:109](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L109)

___

### dateOfDeath

• `Optional` **dateOfDeath**: `number`

The date of death encoded as a fuzzy date on 8 positions (YYYYMMDD) MM and/or DD can be set to 00 if unknown (19740000 is a valid date).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[dateOfDeath](../interfaces/PotentiallyEncryptedPatient.md#dateofdeath)

#### Defined in

[src/models/Patient.ts:110](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L110)

___

### deactivationReason

• **deactivationReason**: [`PatientDeactivationReasonEnum`](../modules.md#patientdeactivationreasonenum)

When not active, the reason for deactivation.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[deactivationReason](../interfaces/PotentiallyEncryptedPatient.md#deactivationreason)

#### Defined in

[src/models/Patient.ts:103](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L103)

___

### deceased

• `Optional` **deceased**: `boolean`

Is the patient deceased.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[deceased](../interfaces/PotentiallyEncryptedPatient.md#deceased)

#### Defined in

[src/models/Patient.ts:113](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L113)

___

### deletionDate

• `Optional` **deletionDate**: `number`

the soft delete timestamp. When a patient is ”deleted“, this is set to a non null value: the moment of the deletion

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[deletionDate](../interfaces/PotentiallyEncryptedPatient.md#deletiondate)

#### Defined in

[src/models/Patient.ts:89](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L89)

___

### education

• `Optional` **education**: `string`

The level of education (college degree, undergraduate, phd).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[education](../interfaces/PotentiallyEncryptedPatient.md#education)

#### Defined in

[src/models/Patient.ts:114](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L114)

___

### endOfLife

• `Optional` **endOfLife**: `number`

Soft delete (unix epoch in ms) timestamp of the patient

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[endOfLife](../interfaces/PotentiallyEncryptedPatient.md#endoflife)

#### Defined in

[src/models/Patient.ts:88](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L88)

___

### ethnicity

• `Optional` **ethnicity**: `string`

The ethnicity of the patient.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[ethnicity](../interfaces/PotentiallyEncryptedPatient.md#ethnicity)

#### Defined in

[src/models/Patient.ts:120](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L120)

___

### externalId

• `Optional` **externalId**: `string`

An external (from another source) id with no guarantee or requirement for unicity .

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[externalId](../interfaces/PotentiallyEncryptedPatient.md#externalid)

#### Defined in

[src/models/Patient.ts:122](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L122)

___

### firstName

• `Optional` **firstName**: `string`

the firstname (name) of the patient.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[firstName](../interfaces/PotentiallyEncryptedPatient.md#firstname)

#### Defined in

[src/models/Patient.ts:90](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L90)

___

### gender

• `Optional` **gender**: [`PatientGenderEnum`](../modules.md#patientgenderenum)

the gender of the patient: male, female, indeterminate, changed, changedToMale, changedToFemale, unknown

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[gender](../interfaces/PotentiallyEncryptedPatient.md#gender)

#### Defined in

[src/models/Patient.ts:97](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L97)

___

### id

• `Optional` **id**: `string`

the Id of the patient. We encourage using either a v4 UUID or a HL7 Id.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[id](../interfaces/PotentiallyEncryptedPatient.md#id)

#### Defined in

[src/models/Patient.ts:79](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L79)

___

### identifiers

• **identifiers**: [`Identifier`](Identifier.md)[]

Typically used for business / client identifiers. An identifier should identify a patient uniquely and unambiguously. However, iCure can't guarantee the uniqueness of those identifiers : This is something you need to take care of.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[identifiers](../interfaces/PotentiallyEncryptedPatient.md#identifiers)

#### Defined in

[src/models/Patient.ts:81](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L81)

___

### labels

• **labels**: `Set`<[`CodingReference`](CodingReference.md)\>

A label is an item from a codification system that qualifies a patient as being member of a certain class, whatever the value it might have taken. If the label qualifies the content of a field, it means that whatever the content of the field, the label will always apply. LOINC is a codification system typically used for labels.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[labels](../interfaces/PotentiallyEncryptedPatient.md#labels)

#### Defined in

[src/models/Patient.ts:86](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L86)

___

### languages

• **languages**: `string`[]

the list of languages spoken by the patient ordered by fluency (alpha-2 code http://www.loc.gov/standards/iso639-2/ascii_8bits.html).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[languages](../interfaces/PotentiallyEncryptedPatient.md#languages)

#### Defined in

[src/models/Patient.ts:94](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L94)

___

### lastName

• `Optional` **lastName**: `string`

the lastname (surname) of the patient. This is the official lastname that should be used for official administrative purposes.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[lastName](../interfaces/PotentiallyEncryptedPatient.md#lastname)

#### Defined in

[src/models/Patient.ts:91](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L91)

___

### maidenName

• `Optional` **maidenName**: `string`

Lastname at birth (can be different of the current name), depending on the country, must be used to design the patient .

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[maidenName](../interfaces/PotentiallyEncryptedPatient.md#maidenname)

#### Defined in

[src/models/Patient.ts:105](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L105)

___

### mergeToPatientId

• `Optional` **mergeToPatientId**: `string`

The id of the patient this patient has been merged with.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[mergeToPatientId](../interfaces/PotentiallyEncryptedPatient.md#mergetopatientid)

#### Defined in

[src/models/Patient.ts:99](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L99)

___

### mergedIds

• **mergedIds**: `Set`<`string`\>

The ids of the patients that have been merged inside this patient.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[mergedIds](../interfaces/PotentiallyEncryptedPatient.md#mergedids)

#### Defined in

[src/models/Patient.ts:100](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L100)

___

### modified

• `Optional` **modified**: `number`

the last modification date of the patient (encoded as epoch).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[modified](../interfaces/PotentiallyEncryptedPatient.md#modified)

#### Defined in

[src/models/Patient.ts:83](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L83)

___

### names

• **names**: [`PersonName`](PersonName.md)[]

the list of all names of the patient, also containing the official full name information. Ordered by preference of use. First element is therefore the official name used for the patient in the application

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[names](../interfaces/PotentiallyEncryptedPatient.md#names)

#### Defined in

[src/models/Patient.ts:92](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L92)

___

### nationality

• `Optional` **nationality**: `string`

The nationality of the patient.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[nationality](../interfaces/PotentiallyEncryptedPatient.md#nationality)

#### Defined in

[src/models/Patient.ts:118](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L118)

___

### note

• `Optional` **note**: `string`

A text note (can be confidential, encrypted by default).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[note](../interfaces/PotentiallyEncryptedPatient.md#note)

#### Defined in

[src/models/Patient.ts:116](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L116)

___

### parameters

• **parameters**: `Object`

Extra parameters

#### Index signature

▪ [key: `string`]: `string`[]

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[parameters](../interfaces/PotentiallyEncryptedPatient.md#parameters)

#### Defined in

[src/models/Patient.ts:126](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L126)

___

### partnerName

• `Optional` **partnerName**: `string`

Lastname of the partner, should not be used to design the patient.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[partnerName](../interfaces/PotentiallyEncryptedPatient.md#partnername)

#### Defined in

[src/models/Patient.ts:107](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L107)

___

### partnerships

• **partnerships**: [`Partnership`](Partnership.md)[]

List of partners, or persons of contact (of class Partnership, see below).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[partnerships](../interfaces/PotentiallyEncryptedPatient.md#partnerships)

#### Defined in

[src/models/Patient.ts:123](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L123)

___

### patientHealthCareParties

• **patientHealthCareParties**: [`PatientHealthCareParty`](PatientHealthCareParty.md)[]

Links (usually for therapeutic reasons) between this patient and healthcare parties (of class PatientHealthcareParty).

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[patientHealthCareParties](../interfaces/PotentiallyEncryptedPatient.md#patienthealthcareparties)

#### Defined in

[src/models/Patient.ts:124](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L124)

___

### patientProfessions

• **patientProfessions**: [`CodingReference`](CodingReference.md)[]

Codified list of professions exercised by this patient.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[patientProfessions](../interfaces/PotentiallyEncryptedPatient.md#patientprofessions)

#### Defined in

[src/models/Patient.ts:125](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L125)

___

### personalStatus

• `Optional` **personalStatus**: [`PatientPersonalStatusEnum`](../modules.md#patientpersonalstatusenum)

any of `single`, `in_couple`, `married`, `separated`, `divorced`, `divorcing`, `widowed`, `widower`, `complicated`, `unknown`, `contract`, `other`.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[personalStatus](../interfaces/PotentiallyEncryptedPatient.md#personalstatus)

#### Defined in

[src/models/Patient.ts:108](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L108)

___

### picture

• `Optional` **picture**: `ArrayBuffer`

A picture usually saved in JPEG format.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[picture](../interfaces/PotentiallyEncryptedPatient.md#picture)

#### Defined in

[src/models/Patient.ts:121](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L121)

___

### placeOfBirth

• `Optional` **placeOfBirth**: `string`

The place of birth.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[placeOfBirth](../interfaces/PotentiallyEncryptedPatient.md#placeofbirth)

#### Defined in

[src/models/Patient.ts:111](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L111)

___

### placeOfDeath

• `Optional` **placeOfDeath**: `string`

The place of death.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[placeOfDeath](../interfaces/PotentiallyEncryptedPatient.md#placeofdeath)

#### Defined in

[src/models/Patient.ts:112](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L112)

___

### profession

• `Optional` **profession**: `string`

The current professional activity.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[profession](../interfaces/PotentiallyEncryptedPatient.md#profession)

#### Defined in

[src/models/Patient.ts:115](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L115)

___

### properties

• **properties**: `Set`<[`Property`](Property.md)\>

Extra properties

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[properties](../interfaces/PotentiallyEncryptedPatient.md#properties)

#### Defined in

[src/models/Patient.ts:127](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L127)

___

### race

• `Optional` **race**: `string`

The race of the patient.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[race](../interfaces/PotentiallyEncryptedPatient.md#race)

#### Defined in

[src/models/Patient.ts:119](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L119)

___

### responsible

• `Optional` **responsible**: `string`

The id of the data owner that is responsible of this patient. When creating the patient, will be filled automatically by the current user data owner id ([HealthcareProfessional], [Patient] or [MedicalDevice]) if missing

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[responsible](../interfaces/PotentiallyEncryptedPatient.md#responsible)

#### Defined in

[src/models/Patient.ts:85](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L85)

___

### rev

• `Optional` **rev**: `string`

the revision of the patient in the database, used for conflict management / optimistic locking.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[rev](../interfaces/PotentiallyEncryptedPatient.md#rev)

#### Defined in

[src/models/Patient.ts:80](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L80)

___

### spouseName

• `Optional` **spouseName**: `string`

Lastname of the spouse for a married woman, depending on the country, can be used to design the patient.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[spouseName](../interfaces/PotentiallyEncryptedPatient.md#spousename)

#### Defined in

[src/models/Patient.ts:106](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L106)

___

### ssin

• `Optional` **ssin**: `string`

Social security inscription number.

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[ssin](../interfaces/PotentiallyEncryptedPatient.md#ssin)

#### Defined in

[src/models/Patient.ts:104](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L104)

___

### systemMetaData

• `Optional` **systemMetaData**: [`SystemMetaDataOwnerEncrypted`](SystemMetaDataOwnerEncrypted.md)

#### Implementation of

[PotentiallyEncryptedPatient](../interfaces/PotentiallyEncryptedPatient.md).[systemMetaData](../interfaces/PotentiallyEncryptedPatient.md#systemmetadata)

#### Defined in

[src/models/Patient.ts:128](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L128)

## Methods

### marshal

▸ **marshal**(): `IPatient`

#### Returns

`IPatient`

#### Defined in

[src/models/Patient.ts:130](https://github.com/icure/icure-medical-device-js-sdk/blob/4df0728/src/models/Patient.ts#L130)
