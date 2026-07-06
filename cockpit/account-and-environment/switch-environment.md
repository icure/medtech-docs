---
slug: /switch-environment
sidebar_position: 3
title: Switch Environment
---

# Switch Environment

One email can be an administrator in more than one place — multiple **[Environments](/cockpit/environment)** (granted by the
iCure team) and/or multiple **[Projects](/cockpit/project)** (granted from Cockpit). When it can, Cockpit lets you choose
which one you're working in.

## Choosing at login

If your account reaches more than one environment, right after you authenticate Cockpit shows a
**Choose your environment** prompt. The available accounts are grouped by **[access level](/cockpit/administrators-and-access-levels)** — you pick
the level first (**Environment Access** or **Project Access**), then the specific account within it. The
actions you can perform then depend on your role in whichever you enter.

## Switching anytime

When you have access to more than one, a **Change environment** item appears in the account dropdown — it
reopens the same chooser so you can switch without logging out.

:::info
The actions available to you change with the environment and access level you pick — your
[access badge](/cockpit/administrators-and-access-levels) in the header always shows your current level. See
[Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

:::info
**Passwords are per-environment.** A password only works in the environment where it was set; elsewhere, log
in with a one-time code. See [Authentication](/cockpit/authentication) and [Manage Account](/cockpit/manage-account).
:::

## Where to go next

- **[Environment](/cockpit/environment)** — the scope you're switching between.
- **[Administrators & Access Levels](/cockpit/administrators-and-access-levels)** — Environment vs Project Access.
- **[Manage Environment](/cockpit/manage-environment)** — settings for the environment you're in.
