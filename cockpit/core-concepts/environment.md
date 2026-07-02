---
slug: /environment
sidebar_position: 1
title: Environment
---

# Environment

The **Environment** is the top of everything you build in Cockpit. It's the private space, **bound to your
email address**, that holds your projects, their tenants, your users, and your administrators. You don't
create it from a button — **it's created for you the moment you register** (see
[Register & Log In](/cockpit/register-and-log-in)), and you become its first and sole administrator with **Environment Access**.

Everything else in Cockpit lives *inside* an Environment, in a simple hierarchy:

```
Environment            ← created on registration, bound to your email (you = sole Environment-Access admin)
└── Project            ← one application/solution and its database
    └── Tenant         ← an isolated slice of a project (multi-tenant projects only)
```

- An **Environment** can contain many **Projects**.
- A **Project** is single-tenant by default; a **multi-tenant** project contains many **Tenants**, each an
  isolated set of data and users.

:::info
**In the Cardinal SDK, an Environment is a top-level [Group](/how-to/manage-a-multi-group-environment).** Cockpit's
**Environment → Project → Tenant** hierarchy maps directly onto iCure's nested group model — the
Environment is the outermost group, and everything you provision is a group nested inside it.
:::

## What lives at the Environment level

Most things you work with day to day — users, processes, configuration — belong to a **Project** (or a
**Tenant**). A few things are shared across **every project in the Environment**:

| Lives at the Environment level | What it is                                                                              |
|--------------------------------|-----------------------------------------------------------------------------------------|
| **External services**          | the email, SMS, and captcha gateways — configured once, reused by all projects          |
| **Spec ID**                    | the identifier that points at that External Services configuration                      |
| **Operation tokens**           | one-time tokens used to transfer a project's ownership into or out of the Environment   |
| **Administrators**             | the people who manage the Environment and its projects (each scoped by an access level) |

This is why the [**Spec ID** is environment-wide](/cockpit/initialize-the-cardinal-sdk#spec-id-one-for-the-whole-environment): the same value is reused by every project you
create — you don't get a new one per project. (Project-specific values like the Project ID, parent
organization, and authentication processes belong to the project or tenant instead.)

:::info
**Coming soon.** With the new **Kermes** message gateway, **[External Services](/cockpit/external-services-overview) will move to the
[Project](/cockpit/project) level** — each project will get its own email/SMS/captcha configuration (and Spec ID) rather
than sharing the environment-wide one described here. See the [Changelog](/cockpit/changelog).
:::

## Managing your Environment

Open the **Account dropdown** in the header and choose **Manage environment**. The modal has three tabs:

- **Environment variables** — environment-wide configuration values, including the **Spec ID** and the
  captcha keys (Kerberus, Friendly Captcha, reCAPTCHA).
- **External services** — the email/SMS/captcha gateways your projects' authentication processes use to
  send one-time codes. If you only ran the onboarding **Demo setup**, a banner reminds you that the demo
  gateways are limited; configure your own here for real traffic.
- **Operation tokens** — generate and manage the one-time tokens used to **transfer a project to another
  environment** (the receiving environment generates the token; see [Transfer ownership](/cockpit/transfer-ownership)).

:::caution
**Only administrators with "Environment Access" can view and manage this data.** Project-Access admins see an **"
Access restricted"** message and must ask an Environment-Access admin.
:::

<!-- TODO(screenshot): manage-environment — the Manage Environment modal showing its three tabs
     (Environment variables, External services, Operation tokens). -->

## Administrators & access levels

An Environment can have several administrators, but they don't all have the same reach. Every admin has
one of two **access levels**, shown as a badge on your user button in the header (its tooltip lists your
access level and any restrictions):

| Access level           | Scope                  | Can do                                                                                                                                                        |
|------------------------|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Environment Access** | the entire Environment | manage environment data & settings, **all** projects and tenants, and the communication (authentication) processes                                            |
| **Project Access**     | a single project       | manage that project's settings, roles & permissions; view metrics. *No* access to environment data or processes, and cannot perform sensitive project actions |

When you register you are the **sole Environment-Access administrator**. You can invite more admins later
and scope them down to a single project. See
[Administrators & Access Levels](/cockpit/administrators-and-access-levels) for the full model.

:::info
**Need another Environment-Access administrator?** Additional administrators with full **Environment
Access** can only be granted by the **iCure team** — they aren't added from Cockpit. If you need one,
reach out on our [Discord](https://discord.gg/eJzV864ahA) and we'll set it up for you.
:::

:::caution
If you are the **last** administrator with Environment Access, Cockpit warns you before any action that
would leave the Environment without one — there must always be someone who can manage it.
:::

## One email, several environments

Your email can be an administrator in more than one place:

- multiple **Environments** — granted directly by the iCure team, and/or
- multiple **Projects** — granted from Cockpit by an Environment-Access admin.

When your account reaches more than one, Cockpit shows a **Choose your environment** prompt right after you
authenticate, and a **Change environment** item appears in the Account dropdown so you can switch at any
time. The available accounts are grouped by **access level** (Environment / Project Access): you
first pick the level, then the specific account within it. The actions you can perform then depend on your
role in whichever environment you entered. See [Switch Environment](/cockpit/switch-environment).

:::info
**Passwords are per-environment.** If you reuse the same email across environments, a password only works
for the environment where it was set; you can always get in elsewhere with a one-time code (OTP).
:::

## Environment and your plan

The Environment is also where your **Cardinal plan limits** apply. Cockpit itself is free; your
[Cardinal pricing tier](https://cardinalsdk.com/en/pricing/) defines how many **projects** the Environment
can hold, how many **tenants** a multi-tenant project may have, and how much **storage** each project gets.
Upgrading your tier raises these limits for the whole Environment.

## Deleting an Environment

Deleting your account from **Manage Account → Danger Zone** **permanently removes the entire Environment** —
all projects, tenants, data, and configuration along with it. This is irreversible; see
[Manage Account](/cockpit/manage-account).

## Where to go next

- **[Project](/cockpit/project)** — the application/solution and its database that lives inside the Environment.
- **[Tenant](/cockpit/tenant)** — an isolated slice of a multi-tenant project.
- **[Administrators & Access Levels](/cockpit/administrators-and-access-levels)** — Environment vs Project Access, in depth.
- **[Manage Environment](/cockpit/manage-environment)** — the practical how-to for the Manage Environment tabs.

> **Cardinal SDK reference:** an Environment is a top-level [`Group`](/how-to/manage-a-multi-group-environment) in the Cardinal SDK.
