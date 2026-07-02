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

A **Total** row aggregates everything, and **Download as CSV** exports the table.

:::info
Figures are **up to date as of yesterday** — changes from the last 24 hours aren't included yet.
:::

## Where to go next

- **[Storage & Plans](/cockpit/storage-and-plans)** — storage usage and plan limits.
- **[Project Overview & Configuration](/cockpit/project-overview-and-configuration)** — per-project storage and user breakdown.
- **[Managing Tenants](/cockpit/managing-tenants)** — per-tenant counts.
