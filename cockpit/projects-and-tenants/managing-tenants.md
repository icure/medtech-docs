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

**Add** (or **Add tenant** on the empty state) opens the **Create a tenant** wizard — a shorter cousin of
the project-creation flow that provisions the tenant **together with** its parent organisation and
registration processes, so a new tenant is usable right away. Its steps:

| Step | What you decide |
|------|-----------------|
| **Tenant** | **Tenant name** and **Cluster** — the region hosting this tenant's database. The cluster defaults to the project's own; it can differ per tenant. |
| **Users** | the same questions as the project wizard's Users step — **End users of the application** (Patients, Healthcare professionals, Medical devices) and the data-sharing answers. The business model is **not** asked: it's the project's. See [Create Your First Project](/cockpit/create-your-first-project#3-users). |
| **Organisation** *(when needed)* | the **Responsible organization** that holds the sharing key — asked when patients or devices are served, or when any sharing answer is *Yes*. |
| **Ready to go** | the **Tenant group id**, **Tenant name**, the parent organization's **HCP ID** and keys, and one **process ID** per channel and user type — with **Download all as \*.json**. |

**Skip and create an empty tenant** on the Users step creates the database only — no users, organisation
or processes — and jumps to **Ready to go**. You can add everything later from the tenant's **Users** and
**Processes** tabs.

What the wizard provisions: a fresh **database** under the project (it **inherits the project's
[Project ID](/cockpit/initialize-the-cardinal-sdk)** — your app reaches it with the same [Application ID](/how-to/initialize-the-sdk/#application-id) and is routed to the right database by
the user's authentication); optionally the organisation with its private key (and recovery key if you
enabled it); and a **registration process** per selected end-user type — *Patient* and *Practitioner Email
or SMS Registration*, named `DEMO: …`, one for email and one more for SMS if the Environment has an SMS
gateway. Medical devices get no process. There is no External services step: the Environment's
[External Services](/cockpit/external-services-overview) decide which gateways are used, and if none is
configured the email processes run on the demo SendGrid access (the Users step says so).

:::caution
**Keys are shown only once.** **Finish** asks *"Have you downloaded the organisation's private key and
saved the tenant data?"* — download the organisation's private key (and the JSON summary) before closing.
See [Recovery & Private Keys](/cockpit/recovery-and-private-keys).
:::

:::info
**A partial failure never rolls back the tenant.** If an organisation or process can't be provisioned,
the summary reads *"Tenant created with some issues"* and lists each item under **Items that could not be
created**; add the missing pieces from the tenant's **Users** and **Processes** tabs.
:::

:::caution
**Project Access creates empty tenants only.** A Project-Access admin can't read the Environment's external
services or process templates, so for them the wizard collapses to **Tenant → Ready to go** and the tenant
is created without users, organisation or registration processes. Users can be added from the tenant's
**Users** tab afterwards; registration processes must be set up by an Environment-Access admin. See
[Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

<!-- TODO(screenshot): tenants/create-tenant-wizard — the Create a tenant wizard on its Users step with
     the "Skip and create an empty tenant" button. -->

:::info
**Plan limit.** On the Free plan a project can hold **5 tenants**; once you hit the cap **Add** is disabled
with a prompt to contact iCure to upgrade. See the [Cardinal plan](https://cardinalsdk.com/en/pricing/) and
[Storage & Plans](/cockpit/storage-and-plans).
:::

### Opening and managing a tenant

Selecting a tenant opens it in its own tabs, each scoped to that tenant alone:

| Tab | What it's for |
|-----|---------------|
| **Overview** | the tenant's name, identifiers, user breakdown, business model (inherited from the project) and storage charts |
| **Users** | the tenant's own HCPs, organizations, patients, and devices — see [Managing Users](/cockpit/managing-users) |
| **Processes** | the tenant's [authentication processes](/cockpit/authentication-processes) (all process types available; read-only with Project Access) — see [Authentication Processes (setup)](/cockpit/authentication-processes-setup) |
| **Custom properties** | properties scoped to this tenant — see [Custom Properties](/cockpit/custom-properties) |
| **External JWT** | the tenant's external-JWT configuration — see [External JWT Configuration](/cockpit/external-jwt-configuration) |
| **Danger zone** | **Update indexes** and **Delete this tenant** (below) |

The **Overview** tab carries the editable **Tenant Name**, the **Tenant group ID**, the inherited
**Project ID (set up by you)**, the project's **Business model** (read-only here), the **User breakdown**
— whose badges open the tenant's **Users** tab filtered to that type — and the **Structured storage** /
**File storage** charts sized from the project's business model and this tenant's own user count (on the
Free plan, a single **Combined storage** chart measured against this tenant's equal share of the project's
fixed 500 MB quota — remove unused tenants, or contact iCure for a personalised offer, to get more per
tenant). The
figures come from the metrics service and are refreshed every 24 hours; the tab says when they were last
updated. (An **Inspect tenant Group JSON** button shows the raw Group object.) See
[Storage & Plans](/cockpit/storage-and-plans).

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

### Project *and* tenant settings, one scope at a time

You can still configure the hidden tenant's **Processes**, **Custom properties**, and **External JWT** —
from the matching project Configuration tab. On a single-tenant project each of those tabs shows a
**Project scope / Tenant scope** switch above the table; picking a scope swaps the table beneath it:

| Configuration tab | Project scope | Tenant scope |
|-------------------|---------------|--------------|
| **Processes** | *Project processes* | *Tenant processes* |
| **Custom properties** | *Custom properties of the Project* | *Custom properties of the Tenant* |
| **External JWT** | *…of the Project* | *…of the Tenant* |

The tab opens in **Project scope**, unless the project has nothing on that tab and the tenant does — then
it opens in **Tenant scope** so you land on the items that exist. On a multi-tenant project there is no
switch — those tabs configure the project only, and each tenant is configured from its own
**Tenants → Manage tenant** page.

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
  Right after the switch, if the project has no **Login** process yet, Cockpit offers to create one
  (*"Your project is now multi-tenant"*): the login process lets users of every tenant sign in through a
  single common URL. **Create Login process** opens the process form with the **Email or SMS Login**
  template preselected; **Later** closes the offer, and you can create it any time from
  **Configuration → Processes**. See [Authentication Processes (setup)](/cockpit/authentication-processes-setup).
- **Switch to Single-tenant** — only possible when the project has **exactly one** tenant; a project with
  multiple tenants can't be converted.

:::info
Unlike **Transfer ownership** and **Delete** on the same [Danger zone](/cockpit/danger-zone) tab, switching
the deployment model is available to administrators with **Project Access** as well as **Environment
Access** — it's gated only by whether the project's current tenant count allows the switch, not by admin
access level. See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
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
