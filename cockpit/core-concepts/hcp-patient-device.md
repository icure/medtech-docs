---
slug: /hcp-patient-device
sidebar_position: 6
title: HCP · Patient · Device
---

# HCP · Patient · Device

These are the **end-user entity types** — the people and machines your application actually serves. Together
with [Organization](/cockpit/organization), they're the user types you create on a project's (or tenant's) **Users** page:

- **HCP** — a *healthcare professional*: an individual doctor, nurse, or practitioner.
- **Patient** — an end user / subject of care.
- **Device** — a connected device that reads or writes data (a sensor, an instrument, an AI service).

:::info
**Coming soon: Custom entities.** Support for custom entity types is on its way to Cockpit, so you'll
be able to model end users beyond these built-in types. See the [Changelog](/cockpit/changelog).
:::

:::info
**Every one of them is a [data owner](/explanations/data-model/#data-owners)** in the Cardinal SDK — each has its own **key pair** and can
create and read **end-to-end-encrypted** data, shared with others through a common
[parent organization](/cockpit/organization). The SDK entity behind each type:
:::

| Cockpit type | Cardinal SDK entity |
|--------------|---------------------|
| **HCP** (and Organization) | [`HealthcareParty`](/explanations/data-model/healthcareparty) |
| **Patient** | [`Patient`](/explanations/data-model/patient) |
| **Device** | [`Device`](/explanations/data-model/device) |
| any of the above (owns the encrypted data) | [`DataOwner`](/explanations/data-model/#data-owners) |
| the login account linked to a data owner | [`User`](/explanations/data-model/user) |

## Creating them

All four user types are created from the same place — **Users → Add →** *Healthcare professional /
Organization / Patient / Device* — and each opens its own form. The fields differ a little:

| Type    | Identity fields            | Contact            | Parent organization | Roles |
|---------|----------------------------|--------------------|---------------------|-------|
| **HCP** | First name + Last name     | Email, Mobile phone| optional            | yes   |
| **Patient** | First name + Last name | Email, Mobile phone| **required**        | yes   |
| **Device** | Name (+ Serial number)  | Email              | optional            | yes   |

:::caution
**A Patient must have a parent organization** — you can't create one without choosing the organization it
shares data through. For HCPs and Devices the parent is optional. See [Organization](/cockpit/organization).
:::

Beyond adding them one at a time, you can **bulk-import** users from a spreadsheet (CSV / XLSX and a few
other formats) with a downloadable template per type — the import is atomic (if one row fails, none are
created). You can also **search** by name, email, or phone, and **filter** by user type. See
[Bulk Import](/cockpit/bulk-import).

## Where users live

A user always belongs to one database:

- In a **single-tenant** [project](/cockpit/project), users live on the project's **Users** page.
- In a **multi-tenant** project, users live **inside a [tenant](/cockpit/tenant)** — each tenant has its own **Users** tab,
  and a user created in one tenant doesn't exist in another.

## What you see in the Users table

Each row shows the user's **type**, **name**, **email**, **enrolment status**, and **account status**, with
an overflow menu of actions. Expanding a row reveals the details — including the entity's identifiers:

- **Healthcare party ID** (HCP), **Patient ID** (Patient), or **Device ID** (Device) — the data owner's id;
- the **User ID**, **Parent ID** (the [parent organization](/cockpit/organization)), phone, serial number (Device), assigned
  **roles**, **authentication tokens**, **custom properties**, and **auto-delegations**.

### Account status vs enrolment status

Two separate signals describe a user, and it's worth keeping them apart:

- **Account status** — whether the user can sign in: **Active**, **Registering** (mid self-registration), or
  **Disabled**. (A **Critical issue** tag overrides this if the user points at a parent organization that
  no longer exists.)
- **Enrolment status** — whether the data owner's **private key is initialized**: **Initialized** or
  **Uninitialized**. A user can't create or read encrypted data until their key is initialized.

## How each type gets its keys

Because every type is a data owner, each needs its **private key initialized** before it can work with
encrypted data — but they don't all get there the same way:

- **Real end users (patients, devices, and the HCPs who are actual practitioners)** initialize their **own**
  keys through **your application** — typically automatically the first time they log in via an
  [authentication process](/cockpit/authentication-processes).
- **The HCP account you use yourself** (a test or admin HCP) can have its key initialized from Cockpit
  (**Users → row → Initialize Private Key**). Cockpit explicitly recommends doing this **only** for your own
  account — real HCPs should generate and keep their own keys. See [Organization](/cockpit/organization) and
  [Recovery & Private Keys](/cockpit/recovery-and-private-keys).

## Roles

Every user type comes with a **default set of roles**, and the roles (and the permissions behind them) are
managed centrally in **Configuration → Roles**. You can adjust a type's default list, create a new role
with a different set of permissions, or override the roles for an individual user when you create or edit
them. See [Roles & Permissions](/cockpit/roles-and-permissions).

## Where to go next

- **[Organization](/cockpit/organization)** — the user type that usually serves as the parent and holds the sharing key.
- **[Managing Users](/cockpit/managing-users)** — the practical how-to for adding, editing, and importing users.
- **[Authentication Processes](/cockpit/authentication-processes)** — how patients and HCPs self-register and log in to your app.
- **[Roles & Permissions](/cockpit/roles-and-permissions)** — what each user type can do.

> **Cardinal SDK reference:** the three [data owner](/explanations/data-model/#data-owners) entities — [`HealthcareParty`](/explanations/data-model/healthcareparty), [`Patient`](/explanations/data-model/patient), [`Device`](/explanations/data-model/device) — and the [`User`](/explanations/data-model/user) that logs in as one.
