---
slug: /administrators
sidebar_position: 3
title: Administrators
---

# Administrators

**Administrators** manage your backend *in Cockpit* — distinct from the [end users](/cockpit/hcp-patient-device) your application
serves. This page is the practical how-to for adding and managing them; for the access-level model
(**Environment Access** vs **Project Access**) see [Administrators & Access Levels](/cockpit/administrators-and-access-levels).

## The Administrators page

Open a project's **Administrators** page to see its admins. The table lists each one's **Name**, **Email**,
**Phone number**, and **Account Status**.

<!-- TODO(screenshot): administrators — the Administrators table with the Add and Import buttons. -->

## Adding an administrator

**Add** opens a form with **Name**, **Email**, and an optional **Mobile phone** — there's no access-level
picker, because an admin added from a project's page gets **Project Access scoped to that project**. Use
**Import** to add several at once (the same spreadsheet flow as [Bulk Import](/cockpit/bulk-import)).

:::info
**Environment-Access administrators aren't created in Cockpit.** Adding admins here only grants **Project
Access**. To get another administrator with full **Environment Access**, contact the iCure team — see
[Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

## Managing administrators

From a row you can **Edit** the admin's details, **Activate** / **Disable** the account, manage their
**authentication tokens** (see [Authentication](/cockpit/authentication)), **Inspect** the raw entity, or **Delete** them. You
**can't change an administrator's access level** after creation.

:::danger
**The last Environment-Access administrator is protected.** If you're the only one and try to delete your
own account (from **Manage Account → Danger zone**), Cockpit warns that it would remove the entire
[Environment](/cockpit/environment). Use **Transfer ownership** or contact iCure first — see [Manage Account](/cockpit/manage-account).
:::

## Where to go next

- **[Administrators & Access Levels](/cockpit/administrators-and-access-levels)** — the Environment vs Project Access model in depth.
- **[Bulk Import](/cockpit/bulk-import)** — importing administrators from a spreadsheet.
- **[Manage Account](/cockpit/manage-account)** — your own profile, password, and 2FA.

> **Cardinal SDK reference:** administrators are [`User`](/explanations/data-model/user)s; see **[Define user roles](/how-to/define-user-roles)**.
