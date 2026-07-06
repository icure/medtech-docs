---
slug: /security
sidebar_position: 3
title: Security
---

# Security

Security in Cockpit isn't a single screen — it's a set of features spread across the app. This page is a map
of them.

## Your account

- **Password & 2FA** — set a password and enable two-factor authentication from
  **[Manage Account](/cockpit/manage-account)** (the Password and 2FA tabs). See [Authentication](/cockpit/authentication).
- **Sensitive-action verification** — safety-critical operations require a fresh **one-time code** (or your
  2FA / password) before they proceed — Cockpit shows a *"Security Verification Required"* step.

## Access control

- **Access levels** — administrators have **Environment Access** or **Project Access**, which gate what they
  can see and do (External Services, processes, transfer/delete, …). See
  [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
- **Roles & permissions** — what your application's [users](/cockpit/managing-users) can do is governed by roles you manage in
  **Configuration → Roles**. See [Roles & Permissions](/cockpit/roles-and-permissions).

## Data protection (end-to-end encryption)

- All medical data is **end-to-end encrypted**; each [data owner](/explanations/data-model/#data-owners) has its own **key pair**.
- **Private & recovery keys** — keys are generated once, shown once, and can't be recovered if lost without
  a recovery key. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys).
- **Auto-delegation** controls which data owners a user automatically shares new data with — encrypted
  sharing, never plaintext exposure. See [Auto-delegation](/cockpit/auto-delegation).
- **External JWT** lets you authenticate users with your own identity provider's signed tokens. See
  [External JWT Configuration](/cockpit/external-jwt-configuration).

:::info
There is no separate audit-log or system-monitoring screen in Cockpit. Security is enforced through the
features above — account credentials, access levels, roles, and end-to-end encryption.
:::

## Where to go next

- **[Authentication](/cockpit/authentication)** — login methods, 2FA, tokens.
- **[Recovery & Private Keys](/cockpit/recovery-and-private-keys)** — the encryption keys.
- **[Administrators & Access Levels](/cockpit/administrators-and-access-levels)** — who can do what.
- **[Auto-delegation](/cockpit/auto-delegation)** — controlled, encrypted data sharing.

> **Cardinal SDK reference:** **[End-to-end encryption](/explanations/end-to-end-encryption/)** and **[Key management](/how-to/key-management)** — how data is encrypted client-side.
