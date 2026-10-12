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
- a tenant's **Overview** tab, sized from the project's business model and the tenant's own users — see
  [Managing Tenants](/cockpit/managing-tenants).

On a **paid** plan there are two charts, **Structured storage** and **File storage**; on the **Free** plan
a single **Combined storage** chart. The header reads *used of max* — or *of N/A* when no limit can be
calculated yet (no business model, no billable user, or a model conflict). Hovering a chart shows how the
allowance is computed, the date of the figures, and a link to the pricing page.

:::info
Figures come from the metrics service and are **updated every 24 hours** (*"Changes from the last 24 hours
are not included"*, with the **Last update** date). Project-Access admins see plain figures instead of
charts.
:::

## How the allowance is calculated

Your storage allowance is not a flat number: it is a **rate per billable user**, multiplied by the number
of users of the type your [business model](/cockpit/project-overview-and-configuration#business-model)
bills on (healthcare professionals, patients, or devices / institution beds). The allowance therefore
**grows with each billable user you add**.

| Business model | Free plan (combined) | Paid — structured | Paid — file |
|----------------|----------------------|-------------------|-------------|
| **Per Healthcare Professional (HCP)** | 50 MB per HCP | 5 GB per HCP | 100 GB per HCP |
| **Per Device or Institution Bed** | 50 MB per device/bed | 50 MB per device/bed | 2 GB per device/bed |
| **Per Patient** | 50 MB per patient | 2 MB per patient | 50 MB per patient |

:::caution
A project without a business model is treated as **Per HCP (default)** and its limit is flagged: *"This
limit assumes the Per Healthcare Professional model, because none has been selected for this project
yet."* Select the real model to see an accurate limit; a project carrying **more than one** model gets no
limit at all until you resolve it.
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
| Storage | **50 MB** of combined storage per billable user |
| Bulk import | not available |

The same list sits in the tooltip of the **Free tier** ribbon on the account menu in the header. When you
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
