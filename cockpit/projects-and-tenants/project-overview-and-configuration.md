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
| **Project overview** | the project's name, identifiers, deployment model, user breakdown, and storage (below) |
| **Processes** | the project's [authentication processes](/cockpit/authentication-processes) — see [Authentication Processes (setup)](/cockpit/authentication-processes-setup) |
| **Roles** | the roles assigned to the project's users — see [Roles & Permissions](/cockpit/roles-and-permissions) |
| **External JWT** | external-JWT authentication — see [External JWT Configuration](/cockpit/external-jwt-configuration) |
| **Custom properties** | custom key/value properties — see [Custom Properties](/cockpit/custom-properties) |
| **Danger zone** | deployment-model switch, transfer ownership, delete — see [Danger Zone](/cockpit/danger-zone) |

:::info
The exact tabs depend on the deployment model and your [access level](/cockpit/administrators-and-access-levels). A Project-Access admin can't
view or manage Processes, and some Danger zone actions are Environment-Access only.
:::

## Project overview

### Identity

- **Project Name** — editable; click the **Edit project name** pencil to rename.
- **Project ID (set up by you)** — the reverse-domain **[Application ID](/how-to/initialize-the-sdk/#application-id)** (e.g. `com.mycompany.myproject`); in the SDK it's the `projectId` field of `SdkOptions`.
  It has a copy button and an **Edit project ID** pencil.
- **Project group ID (set up by Cardinal)** — iCure's internal group identifier, read-only with a copy
  button.

:::caution
When you initialize the Cardinal SDK you want the **Project ID (set up by you)** — *not* the **Project
group ID (set up by Cardinal)**. See [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).
:::

<!-- TODO(screenshot): configuration/project-overview — the Project overview tab showing the three
     identity fields with their copy/edit buttons. -->

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

For a **single-tenant** project, the overview shows a per-type count of its users — **Healthcare parties**,
**Patients**, and **Devices**. In a **multi-tenant** project the users live inside each tenant, so you'll
find the breakdown per tenant on the [Managing Tenants](/cockpit/managing-tenants) page instead.

### Storage

The storage section reports how much room the project uses:

- **Size of data** and **Size of attachments** — the current usage.
- **Clusters** — the region(s) where the project's data is hosted.

:::info
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
