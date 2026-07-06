---
slug: /multitenancy
sidebar_position: 1
title: Multitenancy
---

# Multitenancy

**Multitenancy** is how one [project](/cockpit/project) serves several groups that must not see each other's data. A
project's **deployment model** decides whether it holds one dataset or many isolated ones:

- **Single-tenant** — one database, one shared dataset.
- **Multi-tenant** — many **[tenants](/cockpit/tenant)**, each an isolated database with its own users, processes, and
  configuration.

This page explains the two models, how data isolation and sharing work, and how to choose. For the
day-to-day steps see [Managing Tenants](/cockpit/managing-tenants).

## Single-tenant

A single-tenant project has exactly **one** tenant, and Cockpit keeps it **hidden**: there's no Tenants
page, users live directly on the project's **Users** page, and you manage the one tenant's settings from the
project's **Configuration** tabs. It's the simplest setup — best when everyone in the project belongs to one
organization and shares one dataset.

## Multi-tenant

A multi-tenant project surfaces a **Tenants** page where each tenant is a self-contained unit — its own
users, [authentication processes](/cockpit/authentication-processes), [custom properties](/cockpit/custom-properties), and [external JWT](/cockpit/external-jwt-configuration) config — that you create
and manage individually. Use it when you serve **separate practices, clinics, or customers** that must stay
isolated from one another. Each tenant can even live in a **different cluster**.

:::info
All tenants of a project share the **same [Project ID](/cockpit/initialize-the-cardinal-sdk)** ([Application ID](/how-to/initialize-the-sdk/#application-id)). Your app connects with that
one ID; the user's authentication routes them to the **right tenant's database**. There's no separate tenant
id to pass to the SDK. See [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).
:::

## Switching between the two

The single ↔ multi-tenant switch lives in the project's **[Danger zone](/cockpit/danger-zone)** (*Configuration → Danger zone →
Deployment model*), and is restricted to administrators with **Environment Access**:

- **Switch to Multi-tenant** — reveals the Tenants page and lets the project hold more than one tenant.
- **Switch to Single-tenant** — only possible while the project has **exactly one** tenant.

:::caution
Going multi-tenant is **reversible only while there is a single tenant**. Once a project has more than one
tenant, it **can't** go back to single-tenant. See [Managing Tenants](/cockpit/managing-tenants).
:::

## Isolation and sharing

**Tenants are isolated.** A user created in one tenant doesn't exist in another, and **data never crosses
tenant boundaries** — that separation is the whole point of multi-tenancy.

**Sharing happens *inside* a tenant**, and it's driven by the **[parent organization](/cockpit/organization)**, not by the
tenant boundary itself. Users that share through a common parent organization can read each other's
end-to-end-encrypted data; who can see whose data follows the rules you set when the project was created (the
onboarding questionnaire). The parent's **private key must be initialized** for any of this to work — see
[Organization](/cockpit/organization) and [Recovery & Private Keys](/cockpit/recovery-and-private-keys).

:::info
There is **no cross-tenant sharing**. If two groups need to exchange data, they belong in the **same**
tenant (sharing via a parent organization), not in separate tenants.
:::

## Choosing a model — best practices

- **Start single-tenant** for a single organization with one shared dataset; it's simpler and has nothing
  hidden to manage.
- **Go multi-tenant** when you onboard distinct customers/clinics that must be isolated, or when you need
  per-customer data residency (different clusters per tenant).
- **Decide early.** You can switch single → multi at any time, but **multi → single only works with one
  tenant** — plan the model before you create the second tenant.
- **Place settings at the right scope.** Keep **Login** and generic processes at the **project** level and
  put **Registration** on the **tenant**; the same project-vs-tenant choice applies to
  [custom properties](/cockpit/custom-properties) and [external JWT](/cockpit/external-jwt-configuration).
- **Mind the plan limit.** The number of tenants a project can hold depends on your
  [Cardinal plan](https://cardinalsdk.com/en/pricing/) (the Free plan allows 5). See [Storage & Plans](/cockpit/storage-and-plans).

## Where to go next

- **[Tenant](/cockpit/tenant)** and **[Project](/cockpit/project)** — the underlying concepts.
- **[Managing Tenants](/cockpit/managing-tenants)** — create tenants and switch the deployment model.
- **[Organization](/cockpit/organization)** — the parent organization that drives data sharing.
- **[Authentication Processes (setup)](/cockpit/authentication-processes-setup)** — project- vs tenant-level processes.

> **Cardinal SDK reference:** **[Manage a multi-group environment](/how-to/manage-a-multi-group-environment)** — working across [`Group`](/how-to/manage-a-multi-group-environment)s from the SDK.
