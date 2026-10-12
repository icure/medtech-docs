---
slug: /metrics
sidebar_position: 1
title: Metrics
---

# Metrics

The **Metrics** view (the second tab on the **dashboard**) reports usage across your [Environment](/cockpit/environment) —
how many users and how much data each project holds.

## What it shows

Two view modes:

- **By projects** — one row per [project](/cockpit/project).
- **By timeframe** — one row per month.

Each row reports:

| Column | What it is |
|--------|-----------|
| **Project** / **Month** | the project, or the month (depending on the view) |
| **Number of tenants** | tenants in the project |
| **Number of HCPs** | healthcare parties (HCPs and organizations) |
| **Number of patients** | patients |
| **Number of devices** | devices |
| **Data residence** | the cluster(s) the data lives in |
| **Data volume** | total stored data, human-readable |

In **By projects**, a **Total** row aggregates every project. **By timeframe** has no Total row and
doesn't need one: each month is a snapshot of where things stood at the end of that month, so the most
recent month *is* the current total.

**Download as CSV** exports whichever view is on screen — including the Total row when you're on
**By projects**.

:::info
**Figures lag by up to 24 hours.** The metrics service reports the state of your data as it was at most
24 hours before you asked, so anything created, deleted or uploaded today may not be counted yet. A
figure that looks wrong is usually just not caught up — re-check the next day before treating it as a
discrepancy.

Two consequences worth knowing:

- **Storage and counts elsewhere in Cockpit come from the same lagging source**, so a project's storage
  on the dashboard card, on its Configuration page and in this table are all the same delayed figure —
  they agree with each other, not with "right now". Each of those places carries a **Last update** date
  (and the project and tenant overviews a banner: *"…updated every 24 hours. Last updated on <date>."*)
  so you always know which day you're looking at.
- **The Free-plan user caps are the exception**: the **Add** menu checks live counts, not these figures.
:::

## Where to go next

- **[Storage & Plans](/cockpit/storage-and-plans)** — storage usage and plan limits.
- **[Project Overview & Configuration](/cockpit/project-overview-and-configuration)** — per-project storage and user breakdown.
- **[Managing Tenants](/cockpit/managing-tenants)** — per-tenant counts.
