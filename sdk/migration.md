---
slug: /migration
title: Migration
---

<div className="proofread">

# Migration

This page lists the changes that may require you to update your code when you upgrade the Cardinal SDK, newest
first. For the full list of novelties of each release, see [What's new](./whats-new.md).

## 2.14.0

### TypeScript and Kotlin/JS: Node.js 24 or later

The JavaScript build of the SDK no longer uses `eval`, which some bundlers, such as Rolldown, reject. On Node.js, the
file storage now loads `fs/promises` with `process.getBuiltinModule`, and the `package.json` of `@icure/cardinal-sdk`
declares `"engines": { "node": ">=24" }`.

- Run the SDK on Node.js 24 or later.
- Install the package with Node.js 24 or later too: Yarn classic refuses to install a package whose `engines` field
  doesn't match the current Node.js version, and npm prints a warning (an error with `engine-strict`).

You don't need to change your code.

## 2.13.6

### TypeScript: `onMalformedEntity` replaced by `entityListDecodingStrategy`

The `onMalformedEntity` callback option of `SdkOptions`, `BasicSdkOptions` and `AnonymousSdkOptions`, introduced in
2.13.4, is replaced by `entityListDecodingStrategy`, as in Kotlin:

```typescript
// 2.13.4 - 2.13.5
const options = { onMalformedEntity: (entity) => console.warn(entity.entityType, entity.entityId) }
// 2.13.6 and later
const options = {
  entityListDecodingStrategy: new EntityListDecodingStrategy.DiscardMalformed((entity) => console.warn(entity.entityType, entity.entityId)),
}
```

See [Discard malformed entities in list reads](./how-to/initialize-the-sdk/index.mdx#discard-malformed-entities-in-list-reads).

## 2.13.2 and 2.13.3

### `HealthElementAsserter` identifiers

The shape of `HealthElementAsserter`, added in 2.13.0, changed in two patch releases:

| Version | Shape |
|---|---|
| 2.13.0 - 2.13.1 | `HealthElementAsserter(asserterId: String, asserterType: AsserterType)` |
| 2.13.2 | `HealthElementAsserter(localAsserterIdentifier: LocalAsserterIdentifier?, externalAsserterIdentifier: Identifier?)` |
| 2.13.3 and later | `HealthElementAsserter(localAsserterIdentifier: LocalAsserterIdentifier?, externalAsserterIdentifier: ExternalAsserterIdentifier?)` |

Replace `HealthElementAsserter(asserterId = id, asserterType = type)` with
`HealthElementAsserter(localAsserterIdentifier = HealthElementAsserter.LocalAsserterIdentifier(id, type))`, and wrap
external identifiers in `HealthElementAsserter.ExternalAsserterIdentifier(identifier)`. Exactly one of the two
identifiers must be set. See [HealthElement](./explanations/data-model/healthelement.mdx).

## 2.12.0

### Python: `lenient_json` renamed to `ignoreUnknownFields`

Replace `SdkOptions(lenient_json=True)` with `SdkOptions(ignoreUnknownFields=True)`.

## 2.11.0

### TypeScript: patient of `accessLog.withEncryptionMetadata`

The patient of an access log is now optional, and in TypeScript it moved from a positional parameter to the options
object:

```typescript
// before 2.11.0
await sdk.accessLog.withEncryptionMetadata(base, patient, { user })
// 2.11.0 and later
await sdk.accessLog.withEncryptionMetadata(base, { patient, user })
```

In Kotlin the parameter order is unchanged, and in Python `patient` is now an optional keyword argument.

## 2.10.0

### `lenientJson` renamed to `ignoreUnknownFields`

In Kotlin and TypeScript, the `lenientJson` option is deprecated (at error level) in favour of `ignoreUnknownFields`.
The new option also applies when decoding decrypted content. In Kotlin, a custom `httpClient` must now be provided
together with `httpClientJson`, and the other way round.
See [Ignore unknown fields](./how-to/initialize-the-sdk/index.mdx#ignore-unknown-fields).

### `Annotation` split into `DecryptedAnnotation` and `EncryptedAnnotation`

`Annotation` is now a sealed interface. Create `DecryptedAnnotation` instances for the `notes` of contacts, health
elements, patients, services and addresses: replace `Annotation(...)` with `DecryptedAnnotation(...)`.

## 2.6.0

### 2FA: `Enable2faRequest` requires the current OTP

`Enable2faRequest` now has a mandatory `otp` field: the current code generated with the new secret, which proves the
user configured their authenticator correctly. See [Set up 2FA](./how-to/set-up-2fa.mdx).

### Filter options sortability

Many filter options can no longer be used as the first argument of the `filter…BySorted` methods, among which
`byIdentifiers`, `byPatients…`, `byPatientSecretIds…`, and the code and tag filters of patients, contacts, services,
health elements, documents, messages and maintenance tasks. These options now return `FilterOptions` instead of
`SortableFilterOptions`, so code passing them to a `BySorted` method no longer type-checks. Use the non-sorted method instead.
See [Everything about filters](./explanations/everything-about-filters.mdx).

## 2.5.0

### `Partnership` split into `DecryptedPartnership` and `EncryptedPartnership`

`Partnership` is now a sealed interface: replace `Partnership(...)` with `DecryptedPartnership(...)` when setting the
partnerships of a patient.

### `createRole` takes a description

`role.createRole` and `createRoleInGroup` take a new `description` parameter. In TypeScript and Python it is a
required positional parameter, placed before `inheritsUpTo`. See [Define user roles](./how-to/define-user-roles.mdx).

### More fields encrypted by default

The default encrypted fields of health elements (care team, episodes) and contacts (participants, locations) have
been extended, so entities created after the upgrade store these fields encrypted. If you set a custom [encrypted fields configuration](./how-to/initialize-the-sdk/index.mdx#encrypted-fields-configuration),
it is not affected.

## 2.4.0

### `registerPatient` renamed to `registerHealthcareParty`

The method of `sdk.healthcareParty` that registers a new healthcare party was misnamed `registerPatient`. It is now
`registerHealthcareParty`.

### `macosX64` target removed

The Kotlin Multiplatform library no longer publishes the `macosX64` target. A `linuxArm64` target is available since
2.4.1.

## 2.3.0 and 2.3.1

- 2.3.1: `Patient.preferredUserId` is removed.
- 2.3.0: `group.createGroup` no longer takes a `role` parameter.

</div>
