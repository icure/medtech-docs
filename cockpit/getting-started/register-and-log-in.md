---
slug: /register-and-log-in
sidebar_position: 2
title: Register & Log In
---

# Register & Log In

Getting into Cockpit takes about a minute. This page walks you through creating your account and the
different ways to sign back in afterwards.

:::tip
**Good to know — Cockpit itself is free.** What you pay for is **Cardinal**, the backend your projects
actually run on. Your plan ([see the Cardinal pricing](https://cardinalsdk.com/en/pricing/)) defines the
[limits](/cockpit/limits) you work within: how many **[projects](/cockpit/project)** you can create, how many **[tenants](/cockpit/tenant)** a multi-tenant
project may hold, and how much **[storage](/cockpit/storage-and-plans)** each project gets. On the free tier these are modest;
upgrading your tier raises them.
:::

## Register

The first time you arrive you create your account — and with it your own **[Environment](/cockpit/environment)**, the private
space that holds everything you'll build. You become its sole
[Environment-Access administrator](/cockpit/administrators-and-access-levels).

1. On the [registration page](https://cockpit.icure.dev/register), fill in the form — first name, last
   name, email, company name, and cluster — and accept the terms; or skip the typing and click
   **Register with Google**.
2. Click **Register**.
3. We email you an invitation; click the verification link to activate your account, and you're in.

## Log in

Once your account exists, the [login page](https://cockpit.icure.dev/) offers three ways back in —
pick whichever suits you:

- **Email + one-time code** (the default) — enter your email, click **Request a one-time code**, then
  type the code we send to your inbox.
- **Email + password** — click **Login with password**, then enter your username and password.
- **Google** — click **Log in with Google**, using the same Google account you registered with.

However you sign in, you land on your Environment's dashboard — empty and ready for your first project.

## Choosing an environment

One email can wear several hats. The same user can be an administrator in:

- multiple **[Environments](/cockpit/environment)** — granted directly by the iCure team, and/or
- multiple **[Projects](/cockpit/project)** — granted from Cockpit by an Environment-Access admin.

When your account has access to more than one, Cockpit greets you with a quick prompt to **choose which
environment to log in to** right after you authenticate. The available accounts are grouped by
**[access level](/cockpit/administrators-and-access-levels)**, so you first pick the level (Environment Access or Project Access) and then the
specific account within it. See [Switch Environment](/cockpit/switch-environment) for the full flow.

## Where to go next

- **[Create Your First Project](/cockpit/create-your-first-project)** — provision your first project inside your Environment.
- **[Manage Account](/cockpit/manage-account)** — set a password, enable 2FA, and manage your profile.
- **[Switch Environment](/cockpit/switch-environment)** — move between the environments and projects you can access.
- **[Administrators & Access Levels](/cockpit/administrators-and-access-levels)** — how Environment Access and Project Access differ.
