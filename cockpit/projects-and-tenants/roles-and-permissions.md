---
slug: /roles-and-permissions
sidebar_position: 4
title: Roles & Permissions
---

# Roles & Permissions

A **role** is a named bundle of **permissions**, and the **Roles** tab of a [project's](/cockpit/project) **Configuration**
page is where you decide which roles your project's [users](/cockpit/managing-users) get. As Cockpit puts it: *"Assigned roles
define the permissions available for this user type."*

These are the roles of the **users inside the project** — not of the [administrators](/cockpit/administrators) who manage it.

## Two things on the Roles tab

The tab holds two tables and shows one at a time. A switch at the top picks which:
**Defaults Assigned roles** (the default set per user type) or **Custom Roles** (the roles themselves).
Both are available on every plan, free and paid alike. The tab opens on **Defaults Assigned roles**.

### 1. Default roles per user type — *Defaults Assigned roles*

Each **user type** — HCP, Patient, Device, Organization, User, Admin — has a **default set of roles**. This
table shows, per user type, its **Configuration source** (Default or Custom) and its
**Assigned roles**. Change a user type's defaults here and every user of that type picks them up.

:::info
Changing a user type's default roles applies to **existing users too**, not just new ones — every user of
that type picks up the updated set. The **only** exception is a user whose roles were changed individually
(set to *Individual for this user*, from **Edit user** or from the **Roles** row of the user's expanded
row): that user keeps their own roles and is no longer affected by changes to the type's defaults. Switch that user back to *Default for \<user type>*
and they immediately pick up the type's current roles as configured here on the Roles page. See the
configuration sources below.
:::

### 2. The roles themselves — *Custom Roles*

Switch to **Custom Roles** for the second table. It lists every **Role** with its **Configuration source** (Default or Custom), its
**Permissions** (an expandable tree), and a description. *"CardinalSDK provides default roles with
predefined permissions. If those don't fit your needs, you can create custom roles with your own permission
configuration."*

## Creating a custom role

Switch to **Custom Roles**, click **Create custom role** and fill in:

- **Role Name** — 3–40 characters, letters/digits/underscores; auto-uppercased (e.g. `CLINIC_MANAGER`).
  **Fixed after creation.**
- **Role description** — optional, up to 300 characters.
- **Permissions** — a searchable, hierarchical tree grouped into business areas (Scheduling, Patients,
  Medical records, Billing, Messaging, Users & roles, Organizations & practitioners, Devices, Settings &
  configuration, Security & encryption, System & maintenance, Reference data). Tick the permissions the role
  grants; **Select all / Expand all / Reset** help you navigate. A *"X of Y selected"* counter tracks your
  choice.

You can **edit** or **delete** custom roles (the default roles provided by Cardinal can't be renamed or
removed).

<!-- TODO(screenshot): configuration/roles — the Roles tab showing the Defaults Assigned roles / Custom
     Roles switch, with the Custom Roles table and the "Create custom role" button. -->

## Default vs. individual role assignment

Every user's role assignment has a **configuration source**, shown as a **Default** or **Individual** tag
on the **Roles** row of the user's expanded row (see [Managing Users](/cockpit/managing-users#roles)):

- **Default for \<user type>** — the user follows the project-level defaults for its type. If you later add
  or remove roles for that type, this user's roles update automatically.
- **Individual for this user** — a custom assignment just for this user.

:::caution
Choose **Individual for this user** with care: that user **won't** automatically receive new roles you later
add to its user type, and roles you remove from the type **won't** be removed from them. Removing a role
from a *Default* user silently switches them to *Individual* — Cockpit says so in the confirmation.
:::

## Reading a user's effective permissions

Roles are the configuration; **permissions** are what the user can actually do. The **Permissions** row of a
user's expanded row sums up its valid roles as one tag per business area, and **Inspect permissions**
opens the **User permissions** tree — every **Effective permission** with the role(s) that grant it. It's
the quickest way to answer "why can this user do X?" without opening each role. A role that was deleted
grants nothing and is flagged as invalid on the user.

## Where to go next

- **[Managing Users](/cockpit/managing-users)** — assigning roles to individual users and reading their effective permissions (expanded row).
- **[HCP · Patient · Device](/cockpit/hcp-patient-device)** and **[Organization](/cockpit/organization)** — the user types that receive roles.
- **[Administrators & Access Levels](/cockpit/administrators-and-access-levels)** — admin access (separate from user roles).

> **Cardinal SDK reference:** **[Define user roles](/how-to/define-user-roles)** — assigning roles and permissions from the SDK.
