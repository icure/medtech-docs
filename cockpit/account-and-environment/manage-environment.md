---
slug: /manage-environment
sidebar_position: 2
title: Manage Environment
---

# Manage Environment

**Manage environment** (the account dropdown) is where you configure things that belong to the
**[Environment](/cockpit/environment)** as a whole — shared by **every project** in it. For the concept see [Environment](/cockpit/environment);
this page is the practical tour of the modal's three tabs.

:::caution
Manage Environment is **Environment-Access only.** A Project-Access admin sees *"Only administrators with
'Environment Access' can view and manage this data."* See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

## Environment variables

Environment-wide configuration values, including:

- the **Spec ID** — the identifier for your [External Services](/cockpit/external-services-overview) configuration that your app passes to the
  SDK; and
- the captcha keys (Kerberus, Friendly Captcha, reCAPTCHA).

See [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk) for how these values plug into your application.

## External services

The email / SMS / captcha gateways your [authentication processes](/cockpit/authentication-processes) use to send one-time codes — managed
here once and reused by every project. If only the onboarding **Demo setup** is configured, a banner reminds
you to add your own gateway for real traffic. See [External Services](/cockpit/external-services-overview).

## Operation tokens

Generate and manage the one-time **operation tokens** used to **receive a project transferred from another
environment** (*"Import External Projects into Your Environment"*). The receiving environment generates the
token and shares it with the source owner; each token is valid for **one transfer only**. See
[Transfer ownership](/cockpit/transfer-ownership).

## Where to go next

- **[Environment](/cockpit/environment)** — what an Environment is and what lives at its level.
- **[External Services](/cockpit/external-services-overview)** — configuring the gateways behind the External services tab.
- **[Transfer ownership](/cockpit/transfer-ownership)** — the operation-token flow end to end.
- **[Manage Account](/cockpit/manage-account)** — your personal account (vs. the environment here).
