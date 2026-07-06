---
slug: /manage-account
sidebar_position: 1
title: Manage Account
---

# Manage Account

**Manage Account** (the account dropdown in the header) is where you manage **your own** administrator
account — profile, credentials, and account deletion. It's about *you*, the signed-in admin, not the
project's users. The modal has four tabs.

## General

Edit your account details — your **email** and **mobile phone**. Changes are saved per field.

## Password

**Set password** (or change it); minimum **10 characters**.

:::info
**Passwords are per-environment.** *"If you use the same email across multiple environments, your password
will only work for the environments where it was originally set. You can still log in to any environment
using a one-time password (OTP)."* See [Authentication](/cockpit/authentication).
:::

## 2FA

Add two-factor authentication with an authenticator app: **scan the QR code with your authenticator app,
then enter the verification code** (a 6-digit token) to complete setup. Once enabled you can **Disable 2FA**
again (with confirmation). The 2FA tab appears once you have a password set.

## Danger Zone

**Delete** your account.

:::danger
If you're the **last administrator with Environment Access**, deleting your account **permanently removes
the entire [Environment](/cockpit/environment)** — all projects, tenants, data, and configuration. Cockpit warns you and points
to safer options: contact iCure to add another Environment-Access admin, or use **[Transfer ownership](/cockpit/transfer-ownership)**
to move your projects first. See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

## Where to go next

- **[Manage Environment](/cockpit/manage-environment)** — the environment-wide settings (vs. your personal account here).
- **[Switch Environment](/cockpit/switch-environment)** — moving between environments your email can access.
- **[Authentication](/cockpit/authentication)** — login methods, 2FA, and tokens in context.
