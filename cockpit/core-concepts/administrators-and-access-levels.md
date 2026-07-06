---
slug: /administrators-and-access-levels
sidebar_position: 7
title: Administrators & Access Levels
---

# Administrators & Access Levels

An **administrator** is someone who manages your iCure backend *in Cockpit* — projects, users, processes,
configuration. Administrators are different from the [end users](/cockpit/hcp-patient-device) (HCPs, patients, devices) your
*application* serves: admins work in the control plane, end users in the data plane.

Not every administrator has the same reach. Each one has an **access level** that decides what they can see
and do. Cockpit exposes **two**:

| | **Environment Access** | **Project Access** |
|---|---|---|
| **Scope** | the whole [Environment](/cockpit/environment) | a single [Project](/cockpit/project) |
| **Can do** | manage environment data & settings, **all** projects and tenants, and the authentication (communication) processes | manage that project's settings, **[roles & permissions](/cockpit/roles-and-permissions)**, and view its metrics |
| **Can't do** | — | view or manage environment data, the authentication processes, or any **sensitive project actions** (transfer / delete) |

When you **register**, you become the **sole administrator with Environment Access** over the Environment
that registration creates (see [Register & Log In](/cockpit/register-and-log-in)). From there you can add more administrators.

## The access badge

Your current access level is always visible: a coloured **badge** sits on your user button in the header.
Its tooltip spells out four things — **Administrator** (your name), **Access level**, a **Description** of
what that level allows, and the **Restrictions** that apply to it. It's the quickest way to confirm "what
am I allowed to do right now," especially if your email has access to more than one place (see
[Switch Environment](/cockpit/switch-environment)).

<!-- TODO(screenshot): header/access-badge — the access badge on the user button with its tooltip showing
     Administrator / Access level / Description / Restrictions. -->

## Adding administrators

You manage a project's administrators from its **Administrators** page. Click **Add** and provide the
new admin's **Name**, **Email**, and optionally a **Mobile phone** — there's no access-level picker, because
an administrator added from a project's page gets **Project Access scoped to that project**. You can also
**Import** administrators in bulk from a spreadsheet (the same CSV/XLSX import used for users).

:::caution
**Environment-Access administrators can't be created from Cockpit.** Adding admins in Cockpit only ever
grants **Project Access**. To get another administrator with full **Environment Access**, you
**[contact the iCure team](https://discord.gg/eJzV864ahA)** — they grant it directly. (This mirrors how
access to multiple *Environments* is granted; see [Environment](/cockpit/environment).)
:::

### Managing existing administrators

The Administrators table lists each admin's **Name**, **Email**, **Phone number**, and **Account Status**.
From a row you can **Edit** their details, **Disable** or **Activate** the account, manage their
**authentication tokens**, or **Delete** them. You **cannot change an administrator's access level** after
creation — the level is fixed when the account is created (or granted by iCure).

## What Project Access can't do

Several areas are **Environment-Access only**. A Project-Access admin still sees them, but they're read-only
or blocked, with a clear message — *"Only administrators with 'Environment Access' can view and manage this
data. Please contact them to request changes…"* (and on individual controls,
*"This action is restricted to administrators with 'Environment Access'."*). These include:

- **External services** and the **Spec ID** (the [Environment](/cockpit/environment)-level gateways and config);
- **Operation tokens** (used to transfer project ownership);
- **Authentication processes** — *"Only administrators with 'Environment Access' can view and manage
  Processes."* — at both project and tenant level;
- **Transfer ownership** and **Delete** a project (the project's [Danger zone](/cockpit/danger-zone)).

Everything else inside a project — its users, roles & permissions, custom properties, metrics — is open to
a Project-Access admin for that project.

## The last Environment-Access administrator

Because an Environment **must** always have someone who can manage it, Cockpit protects the **last**
administrator with Environment Access. If you're that person and you try to delete your account (from
**Manage Account → Danger zone**), Cockpit warns you:

:::danger
**This account is the last Administrator with Environment Access.** Deleting this account will permanently
remove the entire environment, including all projects, data and configurations.
:::

It points you to two safe alternatives: **Contact iCure** to create another Environment-Access admin first,
or use **Transfer ownership** to move your projects elsewhere before leaving. See [Manage Account](/cockpit/manage-account).

## Where to go next

- **[Environment](/cockpit/environment)** — the scope an Environment-Access admin controls.
- **[Project](/cockpit/project)** — the scope a Project-Access admin controls.
- **[Administrators](/cockpit/administrators)** — the practical how-to for adding, importing, and managing admins.
- **[Switch Environment](/cockpit/switch-environment)** — using one email across several environments and access levels.

> **Cardinal SDK reference:** an administrator is a [`User`](/explanations/data-model/user); what it can do comes from its [roles](/how-to/define-user-roles).
