---
slug: /danger-zone
sidebar_position: 7
title: Danger Zone
---

# Danger Zone

The **Danger zone** is the last tab of a [project's](/cockpit/project) **Configuration** page (tenants have one too). It
holds the structural and **irreversible** actions — the things you can't casually undo — so they're kept
away from everyday settings.

:::danger
Most actions here can't be undone, and two of them (**Transfer ownership**, **Delete**) are restricted to
administrators with **Environment Access** — a Project-Access admin sees: *"This action is restricted to
administrators with 'Environment Access'."* See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

## Project Danger zone

### Deployment model

Switch the project between single- and multi-tenant:

- **Switch to Multi-tenant** — *"Reversible only while there is 1 tenant."*
- **Switch to Single-tenant** — *"Best for projects with a single tenant."*

Changing the model reshapes where your users live (directly under the project vs inside [tenants](/cockpit/tenant)), which
is why it lives here. See [Managing Tenants](/cockpit/managing-tenants) and [Project Overview & Configuration](/cockpit/project-overview-and-configuration).

:::info
Once a project has **more than one tenant**, it can no longer become single-tenant. Older projects with no
model set are treated as multi-tenant by default until you set one explicitly.
:::

### Transfer Project Ownership

**Transfer ownership** moves the project to **another environment**, *"ensuring the safe transfer of groups,
users and other data."* The receiving environment must supply an **operation token** (generated from its
**Manage environment → Operation tokens**). For the full step-by-step procedure see
**[Transfer ownership](/cockpit/transfer-ownership)**; see also [Environment](/cockpit/environment).

### Delete this project

**Delete** permanently removes the project and everything in it — *"Once you delete a project, there is no
going back."* You confirm by typing the project's exact name.

:::danger
Deleting a project destroys its tenants, users, processes, and data. This cannot be recovered. If you only
want to move the project, use **Transfer ownership** instead.
:::

<!-- TODO(screenshot): configuration/danger-zone — the project Danger zone tab showing Deployment model,
     Transfer ownership, Update indexes, and Delete. -->

## Tenant Danger zone

A [tenant](/cockpit/tenant) has its own **Danger zone** (under **Tenants → \[tenant] → Danger zone**) with one action:

- **Delete this tenant** — permanently remove the tenant and its data (*"Once you delete a tenant, there is
  no going back."*), confirmed by typing its name.

:::danger
Deleting a tenant removes only that tenant's users and data — the rest of the project is unaffected. It's
still irreversible.
:::

## Where to go next

- **[Managing Tenants](/cockpit/managing-tenants)** — the deployment-model switch in context, and creating tenants.
- **[Environment](/cockpit/environment)** — operation tokens, used to receive a transferred project.
- **[Project Overview & Configuration](/cockpit/project-overview-and-configuration)** — the rest of the Configuration tabs.

> **Cardinal SDK reference:** transferring a project re-parents its [`Group`](/how-to/manage-a-multi-group-environment) in the Cardinal SDK.
