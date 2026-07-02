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

### 1. Default roles per user type

Each **user type** — HCP, Patient, Device, Organization, User, Admin — has a **default set of roles**. The
first table shows, per user type, its **Configuration source** (Default or Custom) and its
**Assigned roles**. Change a user type's defaults here and every user of that type picks them up.

:::info
Changing a user type's default roles applies to **existing users too**, not just new ones — every user of
that type picks up the updated set. The **only** exception is a user whose roles were changed individually
from the **Users → Edit user** page (set to *Individual for this user*): that user keeps their own roles and
is no longer affected by changes to the type's defaults. Switch that user back to *Default for \<user type>*
and they immediately pick up the type's current roles as configured here on the Roles page. See the
configuration sources below.
:::

### 2. The roles themselves

The second table lists every **Role** with its **Configuration source** (Default or Custom), its
**Permissions** (an expandable tree), and a description. *"CardinalSDK provides default roles with
predefined permissions. If those don't fit your needs, you can create custom roles with your own permission
configuration."*

## Creating a custom role

Click **Create custom role** and fill in:

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

<!-- TODO(screenshot): configuration/roles — the Roles tab with the per-user-type table and the roles
     table, and the "Create custom role" button. -->

## Default vs. individual role assignment

When you edit a user, its role assignment has a **configuration source**:

- **Default for \<user type>** — the user follows the project-level defaults for its type. If you later add
  or remove roles for that type, this user's roles update automatically.
- **Individual for this user** — a custom assignment just for this user.

:::caution
Choose **Individual for this user** with care: that user **won't** automatically receive new roles you later
add to its user type, and roles you remove from the type **won't** be removed from them.
:::

## Where to go next

- **[Managing Users](/cockpit/managing-users)** — assigning roles to individual users (Edit user).
- **[HCP · Patient · Device](/cockpit/hcp-patient-device)** and **[Organization](/cockpit/organization)** — the user types that receive roles.
- **[Administrators & Access Levels](/cockpit/administrators-and-access-levels)** — admin access (separate from user roles).

> **Cardinal SDK reference:** **[Define user roles](/how-to/define-user-roles)** — assigning roles and permissions from the SDK.
