---
slug: /bulk-import
sidebar_position: 2
title: Bulk Import (CSV / XLSX)
---

# Bulk Import (CSV / XLSX)

When you have more than a handful of users to create, **Import** loads them from a spreadsheet instead of
adding them one by one. It's available on the **Users** page (for each user type) and for
[Administrators](/cockpit/administrators).

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
**Device** can carry a **Serial number**. Cockpit validates the file and **skips** any row that's missing a
required column or has an invalid email, listing them so you can fix them.

:::caution
**Import is atomic.** All valid rows are created **together in a single operation — if one fails, none are
created.** On a partial failure Cockpit reports *"N of M entries were imported"* and lets you **retry** the
remaining rows.
:::

## Where to go next

- **[Managing Users](/cockpit/managing-users)** — the user types and their fields.
- **[Administrators](/cockpit/administrators)** — the same import flow for admins.
- **[Organization](/cockpit/organization)** — the parent organization a patient row references.

> **Cardinal SDK reference:** **[Registering users](/how-to/registering-users)** — creating users programmatically from the SDK.
