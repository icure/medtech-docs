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

:::info
An email address identifies a user within the tenant. Creating a user with an address that is already
taken fails with *"This email address is already used by another user."* — nothing is created, not even
the data owner.
:::

:::caution
On the **Free plan** each user type is capped per project (10 healthcare professionals, 10 devices,
100 patients) and each entry of the **Add** menu is disabled on its own once its cap is reached. See
[Limits](/cockpit/limits).
:::

## The Users table

Each row shows the user's **Type**, **Name**, **Email**, **Enrolment status**, and **Account Status**.
**Search** by name, email, or phone (min. 3 characters) and **filter** by user type. The **⋯ menu** on each
row holds the [actions](#overflow-menu-actions); **expanding** a row reveals the details and the
[per-user collections](#expanded-row-actions) you can manage.

On narrow screens some columns (Email, Account Status, Enrolment status) are hidden instead of making the
table scroll sideways — their values move into the expanded row under the same labels.

### Loading, searching and filtering

The table **loads 20 users at a time** and fetches the next page as you scroll towards the bottom; there
are no page controls. **Search** runs on the server and is paged the same way.

The **Filter by User Type** popover (the filter icon) offers **User**, **Hcp**, **Device**, and
**Patient**; each active filter shows as a removable *User type:* tag. Two details to keep in mind:

- **Hcp** covers both healthcare professionals and organizations; **User** means a login with no linked
  data owner at all.
- The filter narrows the users **already loaded**. While a filter is active Cockpit keeps fetching further
  pages on its own; after scanning 300 users it pauses and shows **Load more matches** so you can
  continue. The empty state *"There are no users of this type in this tenant."* therefore only means
  nothing matched among the loaded users.

The **User breakdown** badges on a project's or tenant's **Overview** open this table with the matching
type filter already applied — see [Project Overview & Configuration](/cockpit/project-overview-and-configuration).

### Account status vs enrolment status

- **Account status** — whether the user can sign in: **Active**, **Registering**, or **Disabled**. (A
  **Critical issue** tag overrides it if the user references a parent organization that no longer exists.)
- **Enrolment status** — whether the data owner's **private key is initialized**. Until it is, the user
  can't create or read encrypted data. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys).

## Overflow menu actions

The **⋯ menu** on each row acts on the user as a whole:

- **Edit** — change the user's details, roles ([Roles & Permissions](/cockpit/roles-and-permissions)), or parent organization.
- **Initialize Private Key** *(HCP, if uninitialized)* — set up the key for **your own** test/admin HCP
  only; real users initialize their own keys via your app. The action is greyed out while the account is
  **Disabled** (*"Enable the account before initializing its private key."*). See
  [Recovery & Private Keys](/cockpit/recovery-and-private-keys).
- **Activate** / **Disable** — toggle whether the account can sign in (its **Account status**).
- **Inspect … JSON** — view the raw entity.
- **Delete** — remove the user **and its linked data owner**. Deletion cascades: the linked
  [HCP / Organization / Patient / Device](/cockpit/hcp-patient-device) is deleted first, then the
  [User](/cockpit/user) shell itself. There is **no undo in Cockpit**, so the account and its data owner stop
  appearing in the Users table. See the caution below.

:::caution
**Delete removes the data owner, not just the login.** Because the linked HCP / Patient / Device is deleted
alongside the User, any [auto-delegation](/cockpit/auto-delegation) pointing at that data owner is now
broken — other users who systematically share with it can no longer do so. Cockpit flags a deleted delegate
in the target user's **Auto delegations** list. Delete a user only when you intend to retire the data owner
itself, not merely to block sign-in — for that, use **Disable** instead.
:::

:::caution
**An HCP that is the parent of other HCPs can't be deleted.** When you open the delete confirmation on an
HCP, Cockpit first checks whether other healthcare parties have it as their parent organization. If any
do, **Yes** stays disabled and the dialog explains: *"This healthcare party cannot be deleted: N HCP(s)
have it as their parent Organisation and would be left broken."* — listing the children by name. Change
those users' parent organization first, then delete. The check covers child HCPs only, not patients or
devices.
:::

## Expanded row actions

Expanding a row shows the user's **identifiers** — the data owner's id (**Healthcare party ID** /
**Patient ID** / **Device ID**), the **User ID**, the **Parent ID** and **Parent organization** (flagged in
red if the parent no longer exists), and contact details — followed by its **Roles** and **Permissions**,
and three **per-user collections** you can manage:

### Roles

The **Roles** row lists the user's role tags and carries a **Default** or **Individual** tag telling you
whether the user follows the project's default roles for its type or has its own assignment. You manage
the roles right here, without opening the Edit modal:

- **+** opens **Modify user's roles**: pick the **Assigned roles** or **Reset to default** (Cockpit lists
  what *Will be removed* and *Will be added* before you confirm).
- The delete button on a tag removes that role, after a confirmation that spells out the consequence —
  removing a role from a **Default** user switches it to an **Individual** configuration, and removing the
  last **Individual** role resets the user to the defaults. The only role of a Default configuration can't
  be removed (adjust the project's default roles instead).
- The parentheses icon on a tag (**Inspect the role JSON**) shows the raw role. A role that no longer
  exists is shown as invalid with a prompt to remove it.

Changes apply immediately. See [Roles & Permissions](/cockpit/roles-and-permissions) for the Default vs
Individual model.

### Permissions

The **Permissions** row shows what the user can effectively do, derived from its valid roles: one tag per
**business area** (Scheduling, Patients, Medical records, Billing, …), each with a tooltip giving the
permission count and the roles that grant it. **Inspect permissions** opens the **User permissions**
modal — a tree of every **Effective permission** with the **role(s)** that grant it. A user with no valid
role reads *"No permissions: this user has no valid role assigned."*

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
here you can see and adjust it per user; removing one asks for confirmation. See
**[Auto-delegation](/cockpit/auto-delegation)** for the full picture.

## Where to go next

- **[HCP · Patient · Device](/cockpit/hcp-patient-device)** and **[Organization](/cockpit/organization)** — the entity types in depth.
- **[Bulk Import](/cockpit/bulk-import)** — create many users from a spreadsheet.
- **[Roles & Permissions](/cockpit/roles-and-permissions)** — what each user can do.
- **[Recovery & Private Keys](/cockpit/recovery-and-private-keys)** — initializing and safeguarding keys.

> **Cardinal SDK reference:** **[Registering users](/how-to/registering-users)** — creating [`User`](/explanations/data-model/user)s and their [data owners](/explanations/data-model/#data-owners) from the SDK.
