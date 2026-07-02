---
slug: /troubleshooting
sidebar_position: 4
title: Troubleshooting
---

# Troubleshooting

Common issues and how to resolve them.

## "Access restricted" / an action is disabled

Some areas are **Environment-Access only** — External Services, the Spec ID, Operation tokens, authentication
processes, and transfer/delete. If you have **Project Access** you'll see *"Only administrators with
'Environment Access' can view and manage this data"* or a disabled control. Ask an Environment-Access admin,
or have iCure grant you Environment Access. See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).

## A user can't create or read encrypted data

Their **private key isn't initialized**, or their **parent organization's** key isn't. Check the
**Enrolment status** in the Users table. Real users initialize their own keys by logging into your app; for
your own test/admin HCP you can initialize it in Cockpit. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys).

## "Auto delegation will not work" / Parent enrolment status warning

The parent organization has **no initialized private key**, so users created via that process can't share or
access data. Initialize the parent's key (or have the parent HCP log in). See [Organization](/cockpit/organization) and
[Auto-delegation](/cockpit/auto-delegation).

## I can't create an SMS (or email) authentication process

You can only use a channel you've configured in **External Services**. Add the matching
[email](/cockpit/external-services-email) or [SMS](/cockpit/external-services-sms) gateway first. See [Authentication Processes (setup)](/cockpit/authentication-processes-setup).

## I can't add another project / tenant

You've hit a **plan limit** (Free: 2 projects, 5 tenants). Upgrade with the iCure team. See [Limits](/cockpit/limits) and
[Storage & Plans](/cockpit/storage-and-plans).

## I can't switch a project back to single-tenant

That's only possible while the project has **exactly one** tenant. See [Managing Tenants](/cockpit/managing-tenants).

## My password doesn't work in another environment

Passwords are **per-environment**. Use a **one-time code** to log in elsewhere, or set a password for that
environment. See [Authentication](/cockpit/authentication).

## I lost the parent organization's private key

If no **recovery key** was saved, the encrypted data **can't be recovered**. Keys are shown only once — save
them at creation. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys).

## A user shows a "Critical issue" tag

The user references a **parent organization that no longer exists**. Edit the user and set a valid parent.
See [Managing Users](/cockpit/managing-users) and [Organization](/cockpit/organization).

## Still stuck?

See [Support](/cockpit/support) — reach the iCure team on Discord.

> **Cardinal SDK reference:** **[Troubleshooting encryption](/troubleshooting/encryption)** — diagnosing SDK-side encryption issues.
