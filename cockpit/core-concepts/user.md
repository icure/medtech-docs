---
slug: /user
sidebar_position: 4
title: User
---

# User

A **User** is one of the core entities of the Cardinal data model — alongside **[HealthcareParty](/explanations/data-model/healthcareparty)**
(HCP / Organization), **[Patient](/explanations/data-model/patient)**, and **[Device](/explanations/data-model/device)**. But it plays a different role from the other
three: the **User is the account you log in with**, while the HCP / Patient / Device is the **[data owner](/explanations/data-model/#data-owners)**
that actually holds the encryption keys and owns the data.

That split is why a single person in your application is represented by **two related entities**.

## The two entities

| Entity | Role | Holds |
|--------|------|-------|
| **User** | **authentication / identity** — the login account | username (`login`), password / authentication tokens, status, roles, 2FA |
| **HCP · Patient · Device** | **data ownership** — the [data owner](/explanations/data-model/#data-owners) | the encryption **key pair**, and the end-to-end-encrypted medical data |

The **User** signs in; the **data owner** is what that user *is* in the clinical model and what owns/decrypts
data. Neither does the other's job: the data owner never logs in by itself, and the User never holds keys or
data.

## What the User entity carries

From the Cardinal SDK, a `User` is the account record. Its notable fields:

- **`login`** — the username for sign-in (Cardinal encourages using an email address); plus `email` for
  token exchange / password recovery.
- **`status`** — the account's activeness: **`Active`**, **`Disabled`**, or **`Registering`**. This is the
  *Account status* you see in Cockpit's Users table.
- **`authenticationTokens`** / password — the credentials used to authenticate; 2FA can be enabled.
- **`roles`** and **`permissions`** — what the user is allowed to do (see [Roles & Permissions](/cockpit/roles-and-permissions)).
- **`groupId`** — the group (project / tenant) the user belongs to.
- **`autoDelegations`** — delegations generated automatically when this user creates data.

## How a User links to its data owner

A User points at its data owner through **one** of three id fields — and this is exactly how you connect them
when creating a user:

| If the user is a… | The `User` field set to the data owner's id |
|-------------------|---------------------------------------------|
| Healthcare professional / Organization | **`healthcarePartyId`** |
| Patient | **`patientId`** |
| Device | **`deviceId`** |

You **connect an HCP / Patient / Device to a User by providing its `healthcarePartyId` / `patientId` /
`deviceId`** on the User. Whichever one is set tells Cardinal which data owner this account *is*.

:::info
In Cockpit you don't juggle these two entities by hand. When you add a *Healthcare professional*,
*Patient*, or *Device* on the **Users** page, Cockpit creates **both** the data-owner entity **and** the
`User` that logs in as it, already linked. That's why a single row in the Users table shows both an
**Account status** and a **User ID** (from the `User`) *and* a **Healthcare party ID / Patient ID / Device
ID** (from the data owner). See [HCP · Patient · Device](/cockpit/hcp-patient-device).
:::

## Why it matters

- **Logging in is a User concern; encryption is a data-owner concern.** An end user can have an active
  account (`status: Active`) yet still be unable to read or write encrypted data until their data owner's
  **private key is initialized** — two separate signals, surfaced in Cockpit as *Account status* and
  *Enrolment status*. See [Organization](/cockpit/organization) and [Recovery & Private Keys](/cockpit/recovery-and-private-keys).
- **Authentication processes operate on the User**: the one-time-code flow registers/logs in the *account*,
  then the linked data owner's keys are set up. See [Authentication Processes](/cockpit/authentication-processes).

## Where to go next

- **[HCP · Patient · Device](/cockpit/hcp-patient-device)** — the data-owner entities a User is linked to.
- **[Organization](/cockpit/organization)** — a `HealthcareParty` that usually holds the data-sharing key.
- **[Authentication Processes](/cockpit/authentication-processes)** — how end-user accounts register and log in.
- **[Roles & Permissions](/cockpit/roles-and-permissions)** — what a user's roles allow.

> **Cardinal SDK reference:** [`User`](/explanations/data-model/user) and [`DataOwner`](/explanations/data-model/#data-owners) in the Cardinal data model.
