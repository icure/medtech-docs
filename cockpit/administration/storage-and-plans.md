---
slug: /storage-and-plans
sidebar_position: 2
title: Storage & Plans
---

# Storage & Plans

Cockpit itself is free; what you pay for is **Cardinal**, the backend your projects run on. Your
[Cardinal plan](https://cardinalsdk.com/en/pricing/) sets the limits you work within — how many
**[projects](/cockpit/project)** and **[tenants](/cockpit/tenant)** you can create, and how much **storage** each project gets.

## Where storage is shown

Storage usage appears as charts against the project's allowance in three places:

- the **project card** on the dashboard,
- **Configuration → [Project overview](/cockpit/project-overview-and-configuration)** (with **Clusters**), and
- a tenant's **Overview** tab — on a paid plan sized from the project's business model and the tenant's
  own users, on the Free plan measured against the tenant's equal share of the project's fixed quota —
  see [Managing Tenants](/cockpit/managing-tenants).

On a **paid** plan there are two charts, **Structured storage** and **File storage**; on the **Free** plan
a single **Combined storage** chart. The header reads *used of max* — or, on a paid plan, *of N/A* when no
limit can be calculated yet (no business model, no billable user, or a model conflict). Hovering a chart
shows how the allowance is computed, the date of the figures, and a link to the pricing page.

Sizes use **binary units** (1 MB = 1024 KB, 1 GB = 1024 MB; the [Metrics](/cockpit/metrics) page tooltip
spells this out). Part of the **structured
storage** is metadata — the space taken by the Environment, Project and Tenant groups themselves — so a
project shows some structured storage even before you store any data in it.

:::info
Figures come from the metrics service and are **updated every 24 hours** (*"Changes from the last 24 hours
are not included"*, with the **Last update** date). The charts are the same for Environment-Access and
Project-Access admins.
:::

## How the allowance is calculated

On the **Free plan** the allowance is a **fixed 500 MB of combined storage per project**, shared by all the
project's users and all its tenants. It does not depend on the business model or on the number of users,
and it applies from the moment the project exists. A tenant's chart shows its **equal share** of that
quota (500 MB divided by the project's number of tenants): with five tenants each may use up to 100 MB.
Need more per tenant? Remove the tenants you no longer use, or contact iCure for a personalised offer —
the chart tooltip says so and links to the contact form.

On a **paid plan** the allowance is not a flat number: it is a **rate per billable user**, multiplied by the
number of users of the type your
[business model](/cockpit/project-overview-and-configuration#business-model) bills on (healthcare
professionals, patients, or devices / institution beds). The allowance therefore **grows with each billable
user you add**.

| Business model | Free plan (combined) | Paid — structured | Paid — file |
|----------------|----------------------|-------------------|-------------|
| **Per Healthcare Professional (HCP)** | 500 MB per project | 5 GB per HCP | 100 GB per HCP |
| **Per Device or Institution Bed** | 500 MB per project | 50 MB per device/bed | 2 GB per device/bed |
| **Per Patient** | 500 MB per project | 2 MB per patient | 50 MB per patient |

:::caution
On a paid plan, a project without a business model is treated as **Per HCP (default)** and its limit is
flagged: *"This limit assumes the Per Healthcare Professional model, because none has been selected for
this project yet."* Select the real model to see an accurate limit; a project carrying **more than one**
model gets no limit at all until you resolve it. On the Free plan the quota is fixed, so neither case
changes the figure.
:::

## Plan limits

Limits depend on your tier. On the **Free plan**:

| Limit | Free plan |
|-------|-----------|
| Projects | **2** |
| Tenants per project | **5** |
| Healthcare professionals per project | **10** (organisations count) |
| Devices per project | **10** |
| Patients per project | **100** |
| Storage | **500 MB** of combined storage per project, shared by all users |
| Bulk import | not available |

The same list sits in the tooltip of the **Free tier** ribbon on the account menu in the header. If a Free
environment is already **over** any of these limits — possible, since the storage quota is not enforced
when data is written and a plan can be downgraded with data in place — a red banner under the header on
every page names each exceeded limit (and the project concerned), warns that the excess data may be deleted
by iCure, and links to the contact form: reach out as soon as possible. Paid environments get the same banner
when a project uses more **structured** or **file** storage than its dynamic allowance — with a different
message: nothing is deleted, but a full allowance may impact your application's performance, so contact iCure
to update your plan. The banner can be closed; Cockpit remembers that for the limits listed at the time, and
shows it again as soon as a new limit is exceeded. An orange indicator beside the account menu stays as long
as a limit is exceeded, and its **Read more** reopens the banner. When you
hit a cap, Cockpit disables the relevant action with a prompt — e.g. *"This project has reached the
Free-plan limit of 5 tenants. Upgrade your subscription to add more."* Paid tiers raise these limits. See
[Limits](/cockpit/limits) for the fine print on each.

The **project and tenant caps are enforced by the platform**, not only by the interface: on the Free plan
the backend refuses to create a 3rd project or a 6th tenant in a project, so the disabled buttons reflect a
real rule rather than a courtesy.

The **storage figures work differently** — they are shown for information. Nothing stops a project from
growing past its allowance, so a Free project can report more than 100 % used. If that happens, get in
touch about upgrading. Cockpit warns on every Free-plan chart: *"If you store more data than your Free plan
allows, some of your data may be deleted."*

## Upgrading

Plan and storage changes are **handled by the iCure team, not in-app**. The **Upgrade storage** link on a
project card opens a contact prompt; see the [Cardinal pricing page](https://cardinalsdk.com/en/pricing/) or
reach out on [Discord](https://discord.gg/eJzV864ahA).

:::info
Limits apply per [Environment](/cockpit/environment) / project. Upgrading your Cardinal tier raises them across the board.
:::

## Where to go next

- **[Metrics](/cockpit/metrics)** — usage across the environment.
- **[Project Overview & Configuration](/cockpit/project-overview-and-configuration)** — choosing the business model.
- **[Managing Tenants](/cockpit/managing-tenants)** — the per-project tenant limit.
- **[Environment](/cockpit/environment)** — where plan limits apply.
