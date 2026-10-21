---
slug: /changelog
sidebar_position: 6
title: Changelog
---

## Recent changes

- **Your own authentication tokens** — a new **Auth tokens** tab in **Manage Account** lists the tokens that
  log in as you, lets you generate new ones and revoke any of them, and marks the **Auto-login** token of
  the browser you are using. See [Manage Account](/cockpit/manage-account#auth-tokens).
- **Free plan storage is a fixed 500 MB per project** of combined storage, shared by all users and tenants
  (no longer 50 MB per billable user); a tenant's chart shows its equal share of the quota. A **plan-limits
  banner** under the header warns when an environment is **over** a limit (Free: any cap or the quota;
  paid: a project past its structured or file allowance), with an indicator beside the account menu that
  reopens it. **Project Access** admins now see the storage charts too. See
  [Storage & Plans](/cockpit/storage-and-plans).
- **Tenant creation wizard** — **Add** on the Tenants page now walks through Tenant → Users → Organisation
  → Ready to go, provisioning the parent organisation and registration processes with the tenant (or an
  empty tenant on **Skip**). See [Managing Tenants](/cockpit/managing-tenants).
- **Login process offer** after switching a project to multi-tenant. See [Danger Zone](/cockpit/danger-zone).
- **Users step redesigned** in the project wizard — pick any combination of end-user types, the business
  model, and the data-sharing answers in one step. See [Create Your First Project](/cockpit/create-your-first-project).
- **Business model** per project, with a storage allowance computed from it; older projects read as
  **Per HCP (default)** until you choose. See [Storage & Plans](/cockpit/storage-and-plans).
- **Free-plan user caps** (10 HCPs, 10 devices, 100 patients per project) and no bulk import on Free. See
  [Limits](/cockpit/limits).
- **Users list** loads page by page with infinite scroll; type filters narrow the loaded users; the
  **User breakdown** badges open the list pre-filtered. See [Managing Users](/cockpit/managing-users).
- **Roles and effective permissions** managed from the user's expanded row. See [Roles & Permissions](/cockpit/roles-and-permissions).
- **Parent HCPs can't be deleted** while other HCPs point at them; **taken e-mails** are reported on create
  and skipped on import.
- **Metrics freshness** — every count and storage figure shows its **Last update** date.
- **Project Access** admins can now **view** processes (read-only), create **empty** tenants, and see the
  **Environment group Id** and **subscription plan** in Manage environment. See
  [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
- **Non-production warning** — DEV / STAGING Cockpits warn before login and badge the header. See
  [Register & Log In](/cockpit/register-and-log-in).
- **Administrators** are no longer bulk-importable.

## Coming soon

Planned changes — not yet available:

- **Custom entities** — support for custom entity types is coming to Cockpit. See
  [HCP · Patient · Device](/cockpit/hcp-patient-device).
- **Kermes message gateway** — iCure is moving to a new internal message-gateway product, **Kermes**. As
  part of this, **[External Services](/cockpit/external-services-overview) will move from the [Environment](/cockpit/environment) level to the [Project](/cockpit/project)
  level**, so each project will be able to have its **own** email/SMS/captcha configuration instead of
  sharing one environment-wide setup (and its Spec ID).

## Where to go next

- **[Introduction](/cockpit/introduction)** — what Cockpit is.
- **[Support](/cockpit/support)** — reach the iCure team.
