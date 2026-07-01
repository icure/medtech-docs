---
slug: /custom-properties
sidebar_position: 3
title: Custom Properties
---

# Custom Properties

**Custom properties** are additional **key–value fields you attach to a Cardinal Group** — a [project](/cockpit/project) or
a [tenant](/cockpit/tenant) — to store your own metadata: descriptive or configuration data that isn't part of the
standard schema. Your application can read them back from the Group through the Cardinal SDK
(`group.properties`).

:::info
Custom properties work the **same way for a Group and for a user** — in both cases they store extra
metadata *about that entity*. This page covers the **Group-level** properties (project / tenant); the
custom properties you can set on a user row in the Users table behave the same, just attached to the user.
:::

## Where to find them

- **Project level** — open the project's **Configuration** page and select the **Custom properties** tab.
  See [Project Overview & Configuration](/cockpit/project-overview-and-configuration).
- **Tenant level** — open a tenant and select its **Custom properties** tab. See [Managing Tenants](/cockpit/managing-tenants).

Both use the same table and the same add/edit/transfer/duplicate actions described below.

:::info
If you set **project** custom properties while single-tenant and later switch to multi-tenant, those
properties stay assigned to the **"initial deployment"** tenant.
:::

## Anatomy of a property

Each custom property is **typed**. When you add or edit one, you provide three fields:

- **Identifier** — the property's key/name.
- **Value** — the value (a multi-line text field).
- **Type** — one of **Boolean**, **Integer**, **Double**, **String**, **Date**, **Clob** (large text), or
  **Json**.

:::info
The editor infers the type from what you type — e.g. `true` → **Boolean**, `42` → **Integer**, `{ … }` →
**Json** — but you can always override it. The type is stored alongside the value, so your application reads
back a correctly typed value.
:::

## Managing properties

The table lists each property's **Identifier**, **Value**, and **Type**. The per-row menu and the
**Add custom property** button give you:

- **Add custom property** — create a new one (header, footer, and empty-state button).
- **Edit property** — change its value or type.
- **Convert to correct type** — shown when a property's stored value doesn't match its declared type.
- **Delete property** — remove it (with a confirmation).

<!-- TODO(screenshot): configuration/custom-properties — the Custom properties table with Identifier /
     Value / Type columns and the "Add custom property" button. -->

### Moving properties between groups

Two row actions let you reuse a property across the project and its tenants:

- **Transfer to another group** — *moves* the property: it's **removed from the current group** and assigned
  to the one you pick (the project itself or one of its tenants).
- **Duplicate in another group** — *copies* the property: the original **stays**, and a copy is created in
  **each** destination you select (you can pick several).

:::info
Both work within the **same project** — you can move/copy between the project and its tenants. This is handy
for seeding every tenant with the same configuration property.
:::

## Where to go next

- **[Project Overview & Configuration](/cockpit/project-overview-and-configuration)** — the Configuration page that hosts this tab.
- **[Managing Tenants](/cockpit/managing-tenants)** — where a tenant's own custom properties live.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — reading the Group's properties from your application.
