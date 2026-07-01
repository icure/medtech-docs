---
slug: /managing-users
sidebar_position: 1
title: Managing Users
---

# Managing Users

The **Users** page is where you create and manage your application's end users — **[HCPs](/cockpit/hcp-patient-device)**,
**[Organizations](/cockpit/organization)**, **[Patients](/cockpit/hcp-patient-device)**, and **[Devices](/cockpit/hcp-patient-device)**. Each is a [data owner](/explanations/data-model/#data-owners); creating one in
Cockpit provisions both the data-owner entity and the [User](/cockpit/user) account that logs in as it. For the entity
types themselves see [HCP · Patient · Device](/cockpit/hcp-patient-device) and [Organization](/cockpit/organization).

## Where the Users page lives

- **Single-tenant project** — the project's **Users** page.
- **Multi-tenant project** — each [tenant](/cockpit/tenant) has its own **Users** tab; a user belongs to one tenant.

See [Managing Tenants](/cockpit/managing-tenants).

## Adding a user

**Add** offers the four user types — **Healthcare professional**, **Organization**, **Patient**, **Device**
— each with its own form:

| Type | Identity | Contact | Parent organization |
|------|----------|---------|---------------------|
| **HCP** | First name + Last name | Email, Mobile phone | optional |
| **Organization** | Name | Email, Mobile phone | optional |
| **Patient** | First name + Last name | Email, Mobile phone | **required** |
| **Device** | Name (+ Serial number) | Email | optional |

:::caution
A **Patient** can't be created without a **parent organization** — it's the party they share data through.
See [Organization](/cockpit/organization).
:::

To create many at once, use **Import** — see [Bulk Import](/cockpit/bulk-import).

## The Users table

Each row shows the user's **type**, **name**, **email**, **enrolment status**, and **account status**.
**Search** by name, email, or phone (min. 3 characters) and **filter** by user type. The **⋯ menu** on each
row holds the [actions](#overflow-menu-actions); **expanding** a row reveals the details and the
[per-user collections](#expanded-row-actions) you can manage.

### Account status vs enrolment status

- **Account status** — whether the user can sign in: **Active**, **Registering**, or **Disabled**. (A
  **Critical issue** tag overrides it if the user references a parent organization that no longer exists.)
- **Enrolment status** — whether the data owner's **private key is initialized**. Until it is, the user
  can't create or read encrypted data. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys).

## Overflow menu actions

The **⋯ menu** on each row acts on the user as a whole:

- **Edit** — change the user's details, roles ([Roles & Permissions](/cockpit/roles-and-permissions)), or parent organization.
- **Initialize Private Key** *(HCP, if uninitialized)* — set up the key for **your own** test/admin HCP
  only; real users initialize their own keys via your app. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys).
- **Activate** / **Disable** — toggle whether the account can sign in (its **Account status**).
- **Inspect … JSON** — view the raw entity.
- **Delete** — remove the user.

## Expanded row actions

Expanding a row shows the user's **identifiers** — the data owner's id (**Healthcare party ID** /
**Patient ID** / **Device ID**), the **User ID**, the **Parent ID**, contact details, and assigned **roles**
— and lets you manage three **per-user collections**:

### Custom properties

Typed **key–value metadata** attached to this user — the same model as a project's/tenant's
[Custom Properties](/cockpit/custom-properties), just scoped to the user. Add, edit, or delete an **Identifier** + **Value** with a
declared **Type** (Boolean, Integer, Double, String, Date, Clob, Json). Use it to store your own data about
the user that isn't part of the standard schema; your application reads it back from the entity.

### Authentication tokens

Long-lived tokens for **programmatic / API access as this user** — distinct from interactive login.
**Generate authentication token** takes a **Token name** and an **Expiration date and time**; the token's
value is **shown only once**, so copy it immediately. You can delete tokens you no longer need. See
[Authentication](/cockpit/authentication).

### Auto-delegations

The set of **other data owners this user automatically shares with** whenever it creates new data. The most
common case is the **[parent organization](/cockpit/organization)**: with auto-delegation in place, data the user creates is
shared with the parent, so others under the same parent (e.g. HCPs in the same clinic) can access and
decrypt it. Registration [authentication processes](/cockpit/authentication-processes) can set this up automatically for users they create;
here you can see and adjust it per user. See **[Auto-delegation](/cockpit/auto-delegation)** for the full picture.

## Where to go next

- **[HCP · Patient · Device](/cockpit/hcp-patient-device)** and **[Organization](/cockpit/organization)** — the entity types in depth.
- **[Bulk Import](/cockpit/bulk-import)** — create many users from a spreadsheet.
- **[Roles & Permissions](/cockpit/roles-and-permissions)** — what each user can do.
- **[Recovery & Private Keys](/cockpit/recovery-and-private-keys)** — initializing and safeguarding keys.

> **Cardinal SDK reference:** **[Registering users](/how-to/registering-users)** — creating [`User`](/explanations/data-model/user)s and their [data owners](/explanations/data-model/#data-owners) from the SDK.
