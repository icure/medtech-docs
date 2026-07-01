---
slug: /project
sidebar_position: 2
title: Project
---

# Project

A **Project** is one application (or "solution") and its database, living inside your
[Environment](/cockpit/environment). It's the unit you actually build against: it has its own identifier, its own users,
its own authentication processes, and its own configuration. When you walk the create-project wizard (see
[Create Your First Project](/cockpit/create-your-first-project)), the thing you create is a Project.

```
Environment            ← created on registration, bound to your email
└── Project            ← one application/solution and its database  ← you are here
    └── Tenant         ← an isolated slice of a project (multi-tenant projects only)
```

An Environment can hold **many Projects**; how many depends on your
[Cardinal plan](https://cardinalsdk.com/en/pricing/).

:::info
**In the Cardinal SDK, a Project is a [Group](/how-to/manage-a-multi-group-environment)** (specifically a top-level *app* group). Its users,
tenants, and processes are all nested under that group. The older Cockpit term for a Project was
**"Solution"** — you may still see that word in a few places, but it means the same thing.
:::

## A project's two identifiers

Every project carries **two** IDs, and it's important not to mix them up:

| Identifier                                | Who sets it | What it's for                                                                                                                                                           |
|-------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Project ID (set up by you)**            | you         | the reverse-domain **[Application ID](/how-to/initialize-the-sdk/#application-id)** (e.g. `com.mycompany.myproject`) your app passes to the SDK; it keeps projects isolated so a user only sees databases matching it |
| **Project group ID (set up by Cardinal)** | Cardinal    | iCure's internal group identifier — **not** the value the SDK's `projectId`/Application ID expects                                                                      |

When you initialize the SDK, the value you pass as the `projectId` (Application ID) is the
**Project ID (set up by you)** — not the group ID — see [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).

## Single-tenant vs multi-tenant

A project is created **single-tenant**. Technically it still has exactly **one tenant** — every project's
data lives in a tenant — but Cockpit **keeps that single tenant hidden**: there's no separate Tenants page
and no per-tenant configuration to manage. You work with the project directly (its users appear on the
**Users** page), as if the project and its one tenant were the same thing.

You can switch it to **multi-tenant**, which surfaces that hidden tenant and lets the project hold several
isolated **[Tenants](/cockpit/tenant)**, each with its own users, data, and configuration — now managed individually from
the **Tenants** page.

The deployment model changes what the project looks like:

|                      | Single-tenant                               | Multi-tenant                                            |
|----------------------|---------------------------------------------|---------------------------------------------------------|
| **Databases**        | one                                         | many (one per tenant)                                   |
| **Where users live** | directly under the project (**Users** page) | under each tenant (**Tenants** page)                    |
| **Typical use**      | one organization / one shared dataset       | separate practices, clinics, or customers kept isolated |

You switch the model from **Configuration → [Danger zone](/cockpit/danger-zone)** (the **Deployment model** section, *Switch to
Multi-tenant* / *Switch to Single-tenant*). It's in the Danger zone because changing it reshapes where your
users and data live.

## Working with a project

Open a project from its card on the dashboard (the **Manage project** button). What you see depends on the
deployment model:

- **Configuration** — the project's settings (see the tabs below); always present.
- **Users** *(single-tenant)* — the HCPs, patients, devices, and organizations of the project.
- **Tenants** *(multi-tenant)* — the project's tenants; users live inside each tenant instead.
- **Administrators** — the admins who manage this project, with their [access level](/cockpit/administrators-and-access-levels).

### The Configuration page

`Configuration` has six tabs:

1. **Project overview** — the project's name, both [identifiers](#a-projects-two-identifiers), its
   **Deployment model** and tenant count, a per-type **user breakdown** (single-tenant), and **storage**
   usage (data size, attachments, clusters).
2. **Processes** — the project's **[authentication processes](/cockpit/authentication-processes)** (the email/SMS one-time-code flows your
   end users register and log in with). Each has a **Process ID** your app references.
3. **Roles** — the roles assigned to the **users** inside the project, and the permissions attached to each
   role. Every user type comes with a **default set of roles**; from here you can adjust that default list
   or create a new role with a different set of permissions.
4. **External JWT** — external JWT configuration for the project.
5. **Custom properties** — custom key/value properties on the project.
6. **Danger zone** — the irreversible / structural actions (below).

<!-- TODO(screenshot): configuration/project-overview — the Configuration page with its six tabs and the
     Project overview tab showing both project identifiers and the deployment model. -->

### The Danger zone

Reached from **Configuration → Danger zone**. It holds the actions you can't casually undo:

- **Deployment model** — switch the project between single- and multi-tenant (above).
- **Transfer ownership** — move the project to another Environment, transferring its groups, users, and
  data. The receiving environment provides an **operation token** (see [Environment](/cockpit/environment)).
- **Delete** — permanently delete the project and everything in it. You confirm by typing the project name.

:::caution
**Transfer ownership** and **Delete** are restricted to administrators with **Environment Access**. A
Project-Access admin sees these as unavailable.
:::

## Project vs Environment vs Tenant — quick map

| Concept              | What it is                                  | In the Cardinal SDK        |
|----------------------|---------------------------------------------|----------------------------|
| **[Environment](/cockpit/environment)** | your private space, bound to your email     | a top-level Group          |
| **Project**          | one application/solution and its database   | an *app* Group             |
| **[Tenant](/cockpit/tenant)**      | an isolated slice of a multi-tenant project | a Group within the project |

## Where to go next

- **[Tenant](/cockpit/tenant)** — how isolated slices work inside a multi-tenant project.
- **[Create Your First Project](/cockpit/create-your-first-project)** — walk the create-project wizard.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — find the Project ID and the other values your app needs.
- **[Project Overview & Configuration](/cockpit/project-overview-and-configuration)** — the practical how-to for the Configuration tabs.

> **Cardinal SDK reference:** a Project is a [`Group`](/how-to/manage-a-multi-group-environment) (a top-level *app* group) in the Cardinal SDK; its Project ID is the [Application ID](/how-to/initialize-the-sdk/#application-id) (`projectId` in `SdkOptions`).
