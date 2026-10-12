---
slug: /bulk-import
sidebar_position: 2
title: Bulk Import (CSV / XLSX)
---

# Bulk Import (CSV / XLSX)

When you have more than a handful of users to create, **Import** loads them from a spreadsheet instead of
adding them one by one. It's available on the **Users** page, for each user type.
[Administrators](/cockpit/administrators) are not importable — they are always added individually.

## How it works

1. Click **Import** and pick the **user type** (Healthcare professionals, Organizations, Patients, or
   Devices).
2. **Download template** gives you a spreadsheet with the right columns for that type.
3. Fill in one **row per user**, then upload the file.

Supported formats: **`.xlsx`, `.xls`, `.xml`, `.csv`, `.txt`, `.ods`**.

<!-- TODO(screenshot): users/import — the Import dialog with the template download and upload area. -->

## Required columns and validation

**Email is always required.** Other required columns depend on the type — for example a **Patient** needs a
**Parent organization ID** (the [organization](/cockpit/organization) it shares data through; see [Managing Users](/cockpit/managing-users)), and a
**Device** can carry a **Serial number**. Cockpit validates the file as soon as you upload it and sorts the
rows into groups, each under its own notice:

| Group | What happens |
|-------|--------------|
| *These rows are valid and will be imported* | created on **Import** |
| *These rows are missing required fields and will be skipped* | fix the row and re-upload |
| *These rows have an invalid e-mail and will be skipped* | fix the address and re-upload |
| *These e-mail addresses are already used by existing users and will be skipped* | the address belongs to a user already in the tenant, or appears twice in the sheet (case and spaces ignored) |

:::caution
**Bulk import is not available on the Free plan.** **Import** is disabled for every user type until the
subscription is upgraded; users are added one at a time. See [Limits](/cockpit/limits).
:::

:::caution
**Import is atomic.** All valid rows are created **together in a single operation — if one fails, none are
created.** On a partial failure Cockpit reports *"N of M entries were imported"* and lets you **retry** the
remaining rows. If the platform still rejects an address as taken, nothing is imported: *"One or more
e-mail addresses are already used by existing users. No user was imported — remove those rows and click
Import to retry."*
:::

## Where to go next

- **[Managing Users](/cockpit/managing-users)** — the user types and their fields.
- **[Organization](/cockpit/organization)** — the parent organization a patient row references.

> **Cardinal SDK reference:** **[Registering users](/how-to/registering-users)** — creating users programmatically from the SDK.
