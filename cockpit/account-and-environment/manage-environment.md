---
slug: /manage-environment
sidebar_position: 2
title: Manage Environment
---

# Manage Environment

**Manage environment** (the account dropdown) is where you configure things that belong to the
**[Environment](/cockpit/environment)** as a whole — shared by **every project** in it. For the concept
see [Environment](/cockpit/environment);
this page is the practical tour of the modal's three tabs.

:::caution
Manage Environment is **Environment-Access only**, except for the **Environment group Id** and the **Environment
subscription plan**, which every admin can see. A Project-Access admin sees those two fields and *"Only administrators
with 'Environment Access' can view and manage the other environment variables (Spec and captcha keys), the external
services and the operation tokens."*
See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

## Environment variables

Environment-wide configuration values, including:

- the **Environment group Id** — the identifier of your Environment (its top-level group), which is also the Spec ID
  and the Kerberus key; and the **Environment subscription plan** (Free or Paid). Both are visible to every admin,
  Project-Access ones included;
- the **Spec ID** — the identifier for your [External Services](/cockpit/external-services-overview) configuration that
  your app passes to the
  SDK; and
- the captcha keys (Kerberus, Friendly Captcha, reCAPTCHA).

See [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk) for how these values plug into your application.


## External services

The email / SMS / captcha gateways your [authentication processes](/cockpit/authentication-processes) use to send
one-time codes — managed
here once and reused by every project. If only the onboarding **Demo setup** is configured, a banner reminds
you to add your own gateway for real traffic. See [External Services](/cockpit/external-services-overview).


## Operation tokens

Generate and manage the one-time **operation tokens** used to **receive a project transferred from another
environment** (*"Import External Projects into Your Environment"*). The receiving environment generates the
token and shares it with the source owner; each token is valid for **one transfer only**. See
[Transfer ownership](/cockpit/transfer-ownership).


## Where to go next

- **[Environment](/cockpit/environment)** — what an Environment is and what lives at its level.
- **[External Services](/cockpit/external-services-overview)** — configuring the gateways behind the External services
  tab.
- **[Transfer ownership](/cockpit/transfer-ownership)** — the operation-token flow end to end.
- **[Manage Account](/cockpit/manage-account)** — your personal account (vs. the environment here).
