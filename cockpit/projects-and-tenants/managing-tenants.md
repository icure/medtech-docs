---
slug: /managing-tenants
sidebar_position: 2
title: Managing Tenants
---

# Managing Tenants

A [tenant](/cockpit/tenant) is an isolated **database** inside a [project](/cockpit/project) — its own users, processes, and
configuration, kept separate from every other tenant in the same project.

How you manage tenants depends on the project's **deployment model**:

- **[Multi-tenant project](#managing-tenants-in-a-multi-tenant-project)** — tenants are first-class, with
  their own **Tenants** page for creating, opening, and deleting them.
- **[Single-tenant project](#managing-the-tenant-in-a-single-tenant-project)** — there is exactly **one**
  tenant, kept hidden; it can't be deleted and is managed from the project's **Configuration** tabs.

```
Environment
└── Project              ← single- or multi-tenant
    ├── Tenant           ← an isolated database
    ├── Tenant
    └── …
```

:::info
Switching a project between single- and multi-tenant is what reveals or hides the Tenants page — see
[Switching the deployment model](#switching-the-deployment-model). See also [Tenant](/cockpit/tenant) and [Project](/cockpit/project).
:::

## Managing tenants in a multi-tenant project

Open the project from its dashboard card (**Manage project**); for a multi-tenant project this lands on the
**Tenants** page (`/tenants/<id>`), a two-pane layout — the tenant **list** on the left, the selected
tenant's **details** on the right.

<!-- TODO(screenshot): tenants/list — the Tenants page with tenant cards and the "Add" button. -->

### The tenant list

Each tenant is a **card** showing its **name**, **storage** (size of data and attachments), **location**
(cluster), and a **user breakdown** — Healthcare parties, Patients, Devices. The breakdown counts are
clickable and open the tenant's **Users** tab pre-filtered to that type. The list **infinite-scrolls** in
pages of 20, and a **Search by name** box (min. 3 characters) filters it. A project with no tenants shows
an empty state with an **Add tenant** button.

### Adding a tenant

**Add** opens a dialog with two fields:

| Field | What it is |
|-------|-----------|
| **Tenant name** | a label for the tenant. |
| **Cluster** | the region hosting this tenant's database; it can differ per tenant. |

The new tenant is provisioned as a fresh **database** under the project and **inherits the project's
[Project ID](/cockpit/initialize-the-cardinal-sdk)** — your app reaches it with the same [Application ID](/how-to/initialize-the-sdk/#application-id) and is routed to the right database by
the user's authentication.

:::info
**Plan limit.** On the Free plan a project can hold **5 tenants**; once you hit the cap **Add** is disabled
with a prompt to contact iCure to upgrade. See the [Cardinal plan](https://cardinalsdk.com/en/pricing/) and
[Storage & Plans](/cockpit/storage-and-plans).
:::

### Opening and managing a tenant

Selecting a tenant opens it in its own tabs, each scoped to that tenant alone:

| Tab | What it's for |
|-----|---------------|
| **Overview** | the tenant's name, identifiers, user breakdown, and storage |
| **Users** | the tenant's own HCPs, organizations, patients, and devices — see [Managing Users](/cockpit/managing-users) |
| **Processes** | the tenant's [authentication processes](/cockpit/authentication-processes) (all process types available) — see [Authentication Processes (setup)](/cockpit/authentication-processes-setup) |
| **Custom properties** | properties scoped to this tenant — see [Custom Properties](/cockpit/custom-properties) |
| **External JWT** | the tenant's external-JWT configuration — see [External JWT Configuration](/cockpit/external-jwt-configuration) |
| **Danger zone** | **Update indexes** and **Delete this tenant** (below) |

The **Overview** tab carries the editable **Tenant Name**, the **Tenant group ID**, the inherited
**Project ID (set up by you)**, the user breakdown, and storage usage. (An **Inspect tenant Group JSON**
button shows the raw Group object.)

:::caution
When you initialize the Cardinal SDK, use the **Project ID (set up by you)** — the same value across every
tenant. There's no separate tenant ID in the SDK; the user's authentication routes them to the correct
database. See [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).
:::

### Deleting a tenant

A tenant's **Danger zone** offers **Delete this tenant**, which permanently removes the tenant and its data.

:::danger
Deleting a tenant destroys all of its users and data and **cannot be undone** — there is no way to recover a
deleted tenant's database.
:::

## Managing the tenant in a single-tenant project

A single-tenant project holds exactly **one** tenant, kept hidden, so management is deliberately limited:

- **No Tenants page** — **Manage project** opens the project's **Configuration** page instead.
- **The tenant can't be deleted** on its own; the project's [Danger zone](/cockpit/danger-zone) deletes the project and its
  single tenant together.
- **Users live on the project's [Users](/cockpit/managing-users) page**, not a per-tenant tab.

The hidden tenant's identifiers live on **Configuration → Project overview** (the **Deployment** section):
its **Tenant group ID** (shown only for single-tenant projects) and the inherited **Project ID (set up by
you)**. See [Project Overview & Configuration](/cockpit/project-overview-and-configuration).

### Project *and* tenant settings, side by side

You can still configure the hidden tenant's **Processes**, **Custom properties**, and **External JWT** —
from the matching project Configuration tab. On a single-tenant project each shows **two tables**, one per
scope:

| Configuration tab | Project table | Tenant table |
|-------------------|---------------|--------------|
| **Processes** | *Project processes* | *Tenant processes* |
| **Custom properties** | *Custom properties of the Project* | *Custom properties of the Tenant* |
| **External JWT** | *…of the Project* | *…of the Tenant* |

:::info
A setting can sensibly live at **either** scope, and you can transfer or duplicate an entry between them.
For processes, only **Login** and **Generic email** belong at the project level — **Registration goes on
the tenant**. See [Authentication Processes (setup)](/cockpit/authentication-processes-setup), [Custom Properties](/cockpit/custom-properties), and
[External JWT Configuration](/cockpit/external-jwt-configuration).
:::

## Switching the deployment model

The single ↔ multi-tenant switch lives in the project's [Danger zone](/cockpit/danger-zone) (*Configuration → Danger zone →
Deployment model*):

- **Switch to Multi-tenant** — reveals the Tenants page and lets the project hold more than one tenant.
- **Switch to Single-tenant** — only possible when the project has **exactly one** tenant; a project with
  multiple tenants can't be converted.

:::caution
Switching the deployment model is restricted to administrators with **Environment Access**; a Project-Access
admin sees it disabled. See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

:::info
**Older projects** may have an unset or inconsistent deployment model. Cockpit treats those as multi-tenant
by default and prompts you to set the correct model from the Danger zone; if a project is marked as both,
pick the correct model (or contact iCure) to resolve it.
:::

## Where to go next

- **[Tenant](/cockpit/tenant)** — the concept: what a tenant is and how it maps to a Cardinal **Group**.
- **[Project Overview & Configuration](/cockpit/project-overview-and-configuration)** — the project-level settings and identifiers.
- **[Managing Users](/cockpit/managing-users)** — add HCPs, organizations, patients, and devices.
- **[Danger Zone](/cockpit/danger-zone)** — the full set of destructive project/tenant actions.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — how your app authenticates into the right tenant.

> **Cardinal SDK reference:** tenants are [`Group`](/how-to/manage-a-multi-group-environment)s nested under the project group; each inherits the project's [Application ID](/how-to/initialize-the-sdk/#application-id) (`projectId` in `SdkOptions`).
