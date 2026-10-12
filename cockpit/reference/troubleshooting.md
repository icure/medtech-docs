---
slug: /troubleshooting
sidebar_position: 4
title: Troubleshooting
---

# Troubleshooting

Common issues and how to resolve them.

## "Access restricted" / an action is disabled

Some areas are **Environment-Access only** — External Services, the Spec ID, Operation tokens, managing
authentication processes (Project Access can view them), creating projects, and transfer/delete. If you have **Project Access** you'll see *"Only administrators with
'Environment Access' can view and manage the other environment variables (Spec and captcha keys), the external services
and the operation tokens"* or a disabled control. Ask an Environment-Access admin,
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

## I can't add another project / tenant / user

You've hit a **plan limit** (Free: 2 projects, 5 tenants per project, 10 healthcare professionals,
10 devices, and 100 patients per project; no bulk import). Upgrade with the iCure team. See [Limits](/cockpit/limits) and
[Storage & Plans](/cockpit/storage-and-plans). If the **Add** menu says the user count couldn't be verified,
reload and try again — adding stays blocked until Cockpit can count the project's users.

## The storage limit says "N/A" or "Per HCP (default)"

The allowance is derived from the project's **business model** and the number of users it bills on. *N/A*
means it can't be calculated yet (no billable user, or more than one model on the project); *Per HCP
(default)* means no model was selected, so Cockpit assumes Per-HCP. Select the real model from
**Configuration → Project overview**. See [Storage & Plans](/cockpit/storage-and-plans).

## I can't delete an HCP

The HCP is the **parent organization of other HCPs**; the confirmation lists them and keeps **Yes**
disabled. Change those users' parent organization first. See [Managing Users](/cockpit/managing-users).

## Counts or storage look wrong

Metrics are **updated every 24 hours** — check the **Last update** date next to the figure. The user
breakdown, storage charts and the Metrics page all share that lag; only the Free-plan **Add** caps use live
counts. See [Metrics](/cockpit/metrics).

## "You are about to log in to Cockpit Dev / Staging"

You're on a **non-production** Cockpit (the header shows a **DEV** or **STAGING** badge). It runs
experimental features against a test backend — don't use a production database there. **Go to Cockpit
Prod** takes you to [cockpit.icure.cloud](https://cockpit.icure.cloud). See [Register & Log In](/cockpit/register-and-log-in).

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
