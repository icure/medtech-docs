---
slug: /tenant
sidebar_position: 3
title: Tenant
---

# Tenant

A **Tenant** is an isolated slice of a [Project](/cockpit/project) — its own **database**, with its own users, processes,
and configuration, kept separate from every other tenant in the same project. Tenants are how one project
serves several groups that must not see each other's data: separate practices, clinics, or customers.

```
Environment            ← created on registration, bound to your email
└── Project            ← one application/solution
    └── Tenant         ← an isolated database within the project  ← you are here
```

:::info
**In the Cardinal SDK, a Tenant is a [Group](/how-to/manage-a-multi-group-environment)** — specifically a *database* group nested under the
project's group. "Tenant" and "**database**" mean the same thing here; the project is the parent, each
tenant is a child. A tenant **inherits the project's [Project ID](/cockpit/initialize-the-cardinal-sdk)**, so your app reaches a tenant with
the same [Application ID](/how-to/initialize-the-sdk/#application-id) and is routed to the right database by the user's authentication.
:::

## Tenants only appear in multi-tenant projects

Whether you see tenants at all depends on the project's **deployment model**:

- **Single-tenant project** — has exactly **one** tenant, but Cockpit **keeps it hidden**: there's no
  Tenants page, and you manage users directly on the project's **Users** page. (You can still see that one
  tenant's id as **Tenant group ID** in *Configuration → Project overview*.)
- **Multi-tenant project** — tenants are **surfaced** on their own **Tenants** page, where you create and
  manage each one individually.

Switching a project from single- to multi-tenant (from *Configuration → Danger zone*) is what reveals the
Tenants page and lets the project hold more than one. See [Project](/cockpit/project).

## The Tenants page

Open a multi-tenant project and go to **Tenants**. Each tenant appears as a card showing its **name**, its
**storage** (size of data and attachments), its **location** (cluster), and a **user breakdown** —
Healthcare parties, Patients, and Devices counts.

### Adding a tenant

Click **Add** to open **Add tenant**. You only provide:

- **Tenant name**
- **Cluster** — the region where this tenant's database is hosted (it can differ from other tenants).

Submitting provisions a brand-new **database** under the project, inheriting the project's Project ID.

:::info
**Plan limit.** The number of tenants a project can hold depends on your
[Cardinal plan](https://cardinalsdk.com/en/pricing/) — the Free plan allows **5**. When you hit the
limit, **Add** is disabled with a prompt to upgrade.
:::

<!-- TODO(screenshot): tenants — the Tenants page with a couple of tenant cards and the "Add" button. -->

## What a tenant contains

Open a tenant to manage it through its own tabs — the tenant is a self-contained unit:

1. **Overview** — the tenant's name, its **Tenant group ID**, the inherited Project ID, a per-type user
   breakdown, and storage usage.
2. **Users** — the tenant's own HCPs, organizations, patients, and devices (including bulk import). Each
   tenant has a **separate** user set.
3. **Processes** — the tenant's own **[authentication processes](/cockpit/authentication-processes)**. All process types are available at
   the tenant level; Cockpit still recommends configuring **Login at the project level** where possible.
4. **Custom properties** — key/value properties scoped to this tenant (and you can copy them to/from the
   project or other tenants).
5. **External JWT** — the tenant's external JWT configuration.
6. **Danger zone** — destructive actions, including **Delete** (permanently removes the tenant and its
   data, with a confirmation).

<!-- TODO(screenshot): tenants/tenant-detail — an opened tenant showing its tabs (Overview, Users,
     Processes, Custom properties, External JWT, Danger zone). -->

## Isolation and sharing

Each tenant is **isolated**: separate users, separate data, separate processes. A user created in one
tenant does not exist in another, and data does not cross tenant boundaries.

:::info
Data **sharing** is controlled at the **organization** level (a parent organization that holds the
sharing key), not by the tenant boundary itself. Within a tenant, who can see whose data follows the
rules you set when the project was created (the onboarding questionnaire). See [Organization](/cockpit/organization).
:::

## Tenant vs Project vs Environment — quick map

| Concept            | What it is                                  | In the Cardinal SDK        |
|--------------------|---------------------------------------------|----------------------------|
| **[Environment](/cockpit/environment)** | your private space, bound to your email     | a top-level Group          |
| **[Project](/cockpit/project)**   | one application/solution and its database   | an *app* Group             |
| **Tenant**         | an isolated database within a project       | a *database* Group under the project |

## Where to go next

- **[Project](/cockpit/project)** — single- vs multi-tenant, and how to switch the deployment model.
- **[Managing Tenants](/cockpit/managing-tenants)** — the practical how-to for creating and managing tenants.
- **[Organization](/cockpit/organization)** — how the parent organization controls data sharing.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — how your app authenticates into the right tenant.

> **Cardinal SDK reference:** a Tenant is a [`Group`](/how-to/manage-a-multi-group-environment) (a database group nested under the project) in the Cardinal SDK; it inherits the project's [Application ID](/how-to/initialize-the-sdk/#application-id) (`projectId` in `SdkOptions`).
