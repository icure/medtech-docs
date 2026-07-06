---
slug: /faq
sidebar_position: 3
title: FAQ
---

# FAQ

**Is Cockpit free?**
Yes — Cockpit is free. You pay for **Cardinal**, the backend your projects run on; your
[plan](https://cardinalsdk.com/en/pricing/) sets your [limits](/cockpit/limits). See [Register & Log In](/cockpit/register-and-log-in).

**What's the difference between the Project ID and the group ID?**
The **Project ID (set up by you)** is your reverse-domain [Application ID](/how-to/initialize-the-sdk/#application-id) — that's what the SDK wants. The
**Project group ID (set up by Cardinal)** is iCure's internal id. See [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).

**Which value does the SDK need — and where do I find it?**
Your app needs the **Project ID**, the **Spec ID**, an **authentication process ID**, and (for sharing) the
parent organization's **HCP ID**. They're on the wizard's *Ready to go* step and findable later in Cockpit.
See [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).

**How do my application's end users log in?**
Through **[authentication processes](/cockpit/authentication-processes)** — email/SMS one-time codes — not through Cockpit. Cockpit is the
admin console.

**Why can't a user create or read data even though their account is Active?**
Account status and key initialization are separate. The user (or its parent organization) needs an
**initialized private key**. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys) and [Auto-delegation](/cockpit/auto-delegation).

**How do I add another Environment-Access administrator?**
You can't from Cockpit — adding admins grants **Project Access**. Contact the iCure team for Environment
Access. See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).

**Can I make a multi-tenant project single-tenant again?**
Only while it has exactly **one** tenant. See [Managing Tenants](/cockpit/managing-tenants).

**Can I move a project to another account/environment?**
Yes — via **[Transfer ownership](/cockpit/transfer-ownership)**, using an operation token from the receiving environment. It's
effectively one-way.

**Is data shared across tenants?**
No. Tenants are isolated; sharing happens *within* a tenant via the parent organization. See
[Multitenancy](/cockpit/multitenancy).

## Where to go next

- **[Troubleshooting](/cockpit/troubleshooting)** — fixes for common errors.
- **[Glossary](/cockpit/glossary)** — terms used across the docs.
- **[Support](/cockpit/support)** — reach the iCure team.
