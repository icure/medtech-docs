---
slug: /project-overview-and-configuration
sidebar_position: 1
title: Project Overview & Configuration
---

# Project Overview & Configuration

Every [project](/cockpit/project) has a **Configuration** page — the home for its settings, identifiers, processes, roles,
and irreversible actions. This page covers how to open it and walks through the **Project overview** tab;
the other tabs each have their own page.

## Opening the Configuration page

From the **dashboard**, find the project's card and click **Manage project**. Cockpit opens the project's
Configuration page (`/configuration/<id>`), which lands on the **Project overview** tab.

<!-- TODO(screenshot): dashboard/project-card — a project card with the "Manage project" button. -->

## The Configuration tabs

The Configuration page has six tabs:

| Tab | What it's for |
|-----|---------------|
| **Project overview** | the project's name, identifiers, business model, deployment model, user breakdown, and storage (below) |
| **Processes** | the project's [authentication processes](/cockpit/authentication-processes) — see [Authentication Processes (setup)](/cockpit/authentication-processes-setup) |
| **Roles** | the roles assigned to the project's users — see [Roles & Permissions](/cockpit/roles-and-permissions) |
| **External JWT** | external-JWT authentication — see [External JWT Configuration](/cockpit/external-jwt-configuration) |
| **Custom properties** | custom key/value properties — see [Custom Properties](/cockpit/custom-properties) |
| **Danger zone** | deployment-model switch, transfer ownership, delete — see [Danger Zone](/cockpit/danger-zone) |

:::info
The exact tabs depend on the deployment model and your [access level](/cockpit/administrators-and-access-levels). A Project-Access admin sees
Processes **read-only**, and some Danger zone actions are Environment-Access only.
:::

## Project overview

### Identity

- **Project Name** — editable; click the **Edit project name** pencil to rename.
- **Project ID (set up by you)** — the reverse-domain **[Application ID](/how-to/initialize-the-sdk/#application-id)** (e.g. `com.mycompany.myproject`); in the SDK it's the `projectId` field of `SdkOptions`.
  It has a copy button and an **Edit project ID** pencil.
- **Project group ID (set up by Cardinal)** — iCure's internal group identifier, read-only with a copy
  button.
- **Business model** — how the project is invoiced: **Per Healthcare Professional (HCP)**, **Per Patient**,
  or **Per Device or Institution Bed**. Its pencil opens **Change the project business model**. See
  [Business model](#business-model) below.

:::caution
When you initialize the Cardinal SDK you want the **Project ID (set up by you)** — *not* the **Project
group ID (set up by Cardinal)**. See [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).
:::

<!-- TODO(screenshot): configuration/project-overview — the Project overview tab showing the three
     identity fields with their copy/edit buttons. -->

### Business model

The business model decides what the project is invoiced on and, with it, how its **storage allowance** is
calculated — see [Storage & Plans](/cockpit/storage-and-plans). It's chosen on the Users step of the
project wizard, and can be changed here or from the project card's **Edit** action.

| Model | You are invoiced for |
|-------|----------------------|
| **Per Healthcare Professional (HCP)** | each active healthcare professional using your project |
| **Per Patient** | each patient record held in your project |
| **Per Device or Institution Bed** | each registered device or institution bed |

:::caution
Changing the business model of an existing project **affects how it is invoiced** — contact the iCure team
if you are not sure which model to select.
:::

:::info
**Projects created before business models existed** show **Per HCP (default)**: Cockpit assumes the
Per-HCP model for them and derives their limits from it, with an alert at the top of the overview —
*"No business model has been selected for this project yet…"* — and a **Select your business model**
link. Pick the real model to see accurate limits. A project that somehow carries **more than one** model
shows **Business model conflict**: no limit can be calculated and no users can be added until you select
the correct one.
:::

### Deployment

- **Deployment Model** — **Single - Tenant** or **Multi - Tenant**.
- **Number of tenants** — how many tenants the project holds.
- **Tenant group ID** — shown **only for single-tenant projects** (the id of the project's one hidden
  [tenant](/cockpit/tenant)), with a copy button.

:::info
Switching between single- and multi-tenant is done from the **[Danger zone](/cockpit/danger-zone)** (the *Deployment model*
section), and managing the tenants of a multi-tenant project happens on the **[Managing Tenants](/cockpit/managing-tenants)** page.
:::

### User breakdown

The overview shows a per-type count of the project's users — **Healthcare parties**, **Patients**, and
**Devices** — across all its tenants. Each badge is a shortcut: on a single-tenant project it opens the
**Users** page filtered to that type; on a multi-tenant project it opens the **Tenants** page and the
first tenant you open shows its **Users** tab already filtered. See [Managing Users](/cockpit/managing-users).

### Storage

The storage section reports how much room the project uses against its allowance:

- **Structured storage** and **File storage** charts (one **Combined storage** chart on the Free plan) —
  usage against the limit: a fixed 500 MB per project on the Free plan, or, on a paid plan, the allowance
  derived from the business model and the number of users it bills on. Hover a chart for the rate and the
  date of the figures.
- **Clusters** — the region(s) where the project's data is hosted.

:::info
**The counts and storage figures are refreshed every 24 hours** by the metrics service; a banner on the
overview tells you when they were last updated, so what you changed today is not counted yet. See
[Metrics](/cockpit/metrics). The charts are the same for Environment-Access and Project-Access admins.
**Most recent backup** / **Oldest backup** are reserved here but not yet shown. Storage usage counts
against your [Cardinal plan](https://cardinalsdk.com/en/pricing/); see [Storage & Plans](/cockpit/storage-and-plans).
:::

## Where to go next

- **[Managing Tenants](/cockpit/managing-tenants)** — create tenants and switch single ↔ multi-tenant.
- **[Roles & Permissions](/cockpit/roles-and-permissions)**, **[Custom Properties](/cockpit/custom-properties)**, **[External JWT Configuration](/cockpit/external-jwt-configuration)**,
  **[Authentication Processes (setup)](/cockpit/authentication-processes-setup)** — the other Configuration tabs.
- **[Danger Zone](/cockpit/danger-zone)** — transfer ownership or delete the project.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — where the Project ID and other values plug into your app.

> **Cardinal SDK reference:** a project is a [`Group`](/how-to/manage-a-multi-group-environment) in the Cardinal SDK; its Project ID is the [Application ID](/how-to/initialize-the-sdk/#application-id) (`projectId` in `SdkOptions`).
