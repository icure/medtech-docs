---
slug: /whats-new
title: What's new
---

<div className="proofread">

# What's new

This page lists what each Cardinal SDK release has added, newest first. Changes that can break existing code are
marked **Breaking** and come with migration instructions in
[Migration](./migration.md).

Releases that only contain internal, build or CI changes are not listed.

## 2.14.0 — 2026-10-01

- **Breaking (TypeScript and Kotlin/JS)**: the SDK requires Node.js 24 or later. The JavaScript build no longer uses
  `eval`, so bundlers that reject it, such as Rolldown, can now bundle the SDK. See [Migration](./migration.md#2140).

## 2.13.6 — 2026-10-01

- **Breaking (TypeScript)**: the `onMalformedEntity` option introduced in 2.13.4 is replaced by
  `entityListDecodingStrategy`, which takes `EntityListDecodingStrategy.Strict` (the default) or
  `new EntityListDecodingStrategy.DiscardMalformed(handler)`, like in Kotlin.
  See [Discard malformed entities in list reads](./how-to/initialize-the-sdk/index.mdx#discard-malformed-entities-in-list-reads).
- TypeScript: the filter discovery API is now available as `sdk.filter`, as it already was in Kotlin.
  See [Everything about filters](./explanations/everything-about-filters.mdx).

## 2.13.5 — 2026-09-28

- New read-only `Group.status` (`GroupStatus.Paying` or `GroupStatus.Free`). A group without an explicit status
  inherits the status of its first ancestor that is `Paying` or `Free`, and is `Free` if there is none.
- New `InvoicingCode.agreementNumber`: the reimbursement agreement number obtained during a pre-authorization.
- Subscriptions: when the server drops the websocket without a closing frame, the subscription now emits
  `EntitySubscriptionEvent.ConnectionError.ClosedByServer` instead of failing.

## 2.13.4 — 2026-09-23

- New option to discard the entities that can't be decoded in list and page reads, instead of failing the whole
  request (Kotlin: `entityListDecodingStrategy`, TypeScript: `onMalformedEntity`). Not available in Python or Dart.
  See [Discard malformed entities in list reads](./how-to/initialize-the-sdk/index.mdx#discard-malformed-entities-in-list-reads).

## 2.13.3 — 2026-09-02

- **Breaking**: `HealthElementAsserter.externalAsserterIdentifier` is now an `ExternalAsserterIdentifier`, which
  wraps the `Identifier`.

## 2.13.2 — 2026-08-12

- **Breaking**: `HealthElementAsserter(asserterId, asserterType)` is replaced by
  `HealthElementAsserter(localAsserterIdentifier, externalAsserterIdentifier)`. Exactly one of the two must be set.

## 2.13.1 — 2026-08-11

- Fix: the `asserters` of health elements are now correctly encrypted by default. 2.13.0 used an invalid
  encrypted-field path.

## 2.13.0 — 2026-08-11

- New `HealthElement.qualifiedLinks`: typed links from a health element to other health elements, for example a
  complication of another condition.
- New `HealthElement.asserters`: who asserts that the condition is true (FHIR asserter): a patient, a healthcare
  party or a related person. Asserters are encrypted by default.
- See [HealthElement](./explanations/data-model/healthelement.mdx). These fields are not yet available in the
  Dart SDK.

## 2.12.1 — 2026-08-03

- Fix: `calendarItem.linkToPatient` no longer fails on calendar items that are not linked to a patient yet. Before
  this fix it also did not block calendar items that were already linked.

## 2.12.0 — 2026-07-30

- New `RelatedPerson` entity and `sdk.relatedPerson` API, with `RelatedPersonFilters`, to store a patient's
  relatives and other contact persons. See [RelatedPerson](./explanations/data-model/relatedperson.mdx).
- New `Partnership.partnerType` (`PartnerType`) to link a patient to a related person.
- Python: the `lenient_json` option is renamed to `ignoreUnknownFields` (see 2.10.0).

## 2.11.0 — 2026-07-26

- New `withEncryptionMetadataAndDelegates` methods on all the APIs of encryptable entities, for fine-grained control
  over what each delegate can access. See [Basic operations](./how-to/basic-operations.mdx).
- New `user.removeUserMobilePhone(userId, previousMobilePhone)`. See [User](./explanations/data-model/user.mdx).
- `accessLog.withEncryptionMetadata`: the patient is now optional. **Breaking (TypeScript)**: `patient` moved into
  the options object.
- New `receipt.listReceiptsBetweenDates` (and in-group variant), and in-group `getRawReceiptAttachment`.

## 2.10.0 — 2026-07-06

- New `ignoreUnknownFields` option, which replaces `lenientJson` (Kotlin and TypeScript) and now also applies to
  decrypted content. A custom Kotlin `httpClient` now requires `httpClientJson`, and the other way round.
  See [Ignore unknown fields](./how-to/initialize-the-sdk/index.mdx#ignore-unknown-fields).
- **Breaking**: `Annotation` is split into `DecryptedAnnotation` and `EncryptedAnnotation`. This affects the `notes`
  of contacts, health elements, patients, services and addresses.

## 2.9.0 — 2026-07-02

- New `InsuranceFilters` (`all`, `byIdentifiers`, `byCode`, `byTag`), with `insurance.matchInsurancesBy` and
  `filterInsurancesBy[Sorted]`. See [Everything about filters](./explanations/everything-about-filters.mdx).
- The calendar item occupancy methods are now also available on `CardinalSdk` (they were added to
  `CardinalBaseSdk` in 2.8.0).

## 2.8.0 — 2026-07-01

- New calendar item occupancy histograms: `getCalendarItemsOccupancyByPeriodForSelf`, `…ForHealthcareParty` and
  `…AndAgendaId` (on `CardinalBaseSdk`). See [Calendar items occupancy](./how-to/calendar-items-occupancy.mdx).

## 2.7.0 — 2026-06-18

- New `sdk.filter` API (`getFilterOptionsDefinitions`) and `FilterOptionsCatalog`, to discover the available filter
  options at runtime, for example to build dynamic query builders. Kotlin only at first: TypeScript support came in
  2.13.6, and Python has a `FilterApi` class since 2.11.0 but no `sdk.filter` property yet. See [Everything about filters](./explanations/everything-about-filters.mdx).

## 2.6.0 — 2026-05-29

- 2FA: `Enable2faRequest` now requires the current `otp` and accepts an optional `algorithm` (`Sha1` by default,
  `Sha256` or `Sha512`). New `User.systemMetadata.uses2fa`. Initializing the SDK no longer fails when the user still
  has to provide a 2FA code. See [Set up 2FA](./how-to/set-up-2fa.mdx).
- **Breaking**: the sortability of filter options has been reviewed. Many filters (`byIdentifiers`, `byPatients…`,
  code and tag filters, …) can no longer be used as the first argument of `filter…BySorted`.
  See [Everything about filters](./explanations/everything-about-filters.mdx).

## 2.5.0 — 2026-05-20

- New `Role.description`, and a `description` parameter on `role.createRole`.
  See [Define user roles](./how-to/define-user-roles.mdx).
- **Breaking**: `Partnership` is split into `DecryptedPartnership` and `EncryptedPartnership`.
- More fields are encrypted by default: the asserters, care team and episodes of health elements, and the
  participants and locations of contacts.

## 2.4.x — 2026-04-23 to 2026-05-04

- **Breaking** (2.4.0): `healthcareParty.registerPatient` is renamed to `registerHealthcareParty`.
- 2.4.0: the `macosX64` Kotlin target is removed. 2.4.1: a `linuxArm64` target is added.
- 2.4.2: the multi-code service filters take a `Map<String, Set<String>>`.

## 2.3.x — 2026-04-02 to 2026-04-10

- 2.3.0: new `recovery.createRecoveryInfoForAvailableParentKeyPairs`, which lets a child data owner create recovery
  data for its parent's keypairs. See [Share data with many users](./how-to/share-data-with-many-users.mdx).
- 2.3.1: new `contact.decryptPatientIdOfService`, to find the patient of a service.
- 2.3.2: new service filters on codes and tags combined with a value date (`byCodesAndValueDate`,
  `byCodePrefixAndValueDate`, `byTagCodesAndValueDate`, `byTagPrefixAndValueDate` and their patient variants).
- 2.3.2: the `Serialization.CardinalSerializerModule` used by the SDK is now public, for custom Kotlin `Json` instances.
- **Breaking** (2.3.1): `Patient.preferredUserId` is removed.
- **Breaking** (2.3.0): `group.createGroup` no longer takes a `role` parameter.

## 2.2.0 — 2026-03-26

- New `user.modifyUserPassword`, `modifyUserEmail` and `modifyUserMobilePhone`, which don't need the user revision
  and work with a smart authentication provider. See [User](./explanations/data-model/user.mdx).

</div>
