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

Storage usage appears as **Size of data** and **Size of attachments** (with a usage chart against the
limit), in three places:

- the **project card** on the dashboard,
- **Configuration → [Project overview](/cockpit/project-overview-and-configuration)** (with **Clusters**), and
- a tenant's **Overview** tab — see [Managing Tenants](/cockpit/managing-tenants).

## Plan limits

Limits depend on your tier. On the **Free plan**:

| Limit | Free plan |
|-------|-----------|
| Projects | **2** |
| Tenants per project | **5** |
| Data per project | **1 GB** |
| Attachments per project | **100 MB** |

When you hit a cap, Cockpit disables the relevant action with a prompt — e.g. *"You've reached the Free plan
limit of 2 projects. Contact the iCure team to upgrade to a plan that fits your needs."* Paid tiers raise
these limits.

## Upgrading

Plan and storage changes are **handled by the iCure team, not in-app**. The **Upgrade storage** link on a
project card opens a contact prompt; see the [Cardinal pricing page](https://cardinalsdk.com/en/pricing/) or
reach out on [Discord](https://discord.gg/eJzV864ahA).

:::info
Limits apply per [Environment](/cockpit/environment) / project. Upgrading your Cardinal tier raises them across the board.
:::

## Where to go next

- **[Metrics](/cockpit/metrics)** — usage across the environment.
- **[Managing Tenants](/cockpit/managing-tenants)** — the per-project tenant limit.
- **[Environment](/cockpit/environment)** — where plan limits apply.
