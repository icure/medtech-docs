---
slug: /external-services-sms
sidebar_position: 3
title: SMS
---

# SMS gateway

An **SMS gateway** delivers one-time codes by text message. Configure it from **Manage environment →
External services** (see [Overview](/cockpit/external-services-overview)). iCure supports four providers:

| Provider | Fields |
|----------|--------|
| **Twilio** | **From** (sender number), **Sid**, **Token** |
| **OVH** | **From**, **App Key**, **App Secret**, **Consumer Key** |
| **Ring ring** | **Api Key** |
| **Swisscom** | **User name**, **Password** |

:::info
The SMS gateway is what an [authentication process](/cockpit/authentication-processes) uses to deliver **SMS** OTPs. Run it alongside an
[email](/cockpit/external-services-email) gateway and choose the channel per process.
:::

:::caution
A process can only use a channel you've configured. With **only an SMS gateway** set up you **can't create
an email authentication process** — add an [email](/cockpit/external-services-email) gateway first. See [Authentication Processes (setup)](/cockpit/authentication-processes-setup).
:::

:::caution
SMS gateways are **Environment-Access only** and shared across every project in the [Environment](/cockpit/environment).
The **[Demo setup](/cockpit/external-services-demo-setup)** covers email only — there's no demo SMS, so SMS needs your own provider.
:::

## Where to go next

- **[Email](/cockpit/external-services-email)** — the email counterpart.
- **[Captcha](/cockpit/external-services-captcha)** — protect your sign-in flows.
- **[Authentication Processes (setup)](/cockpit/authentication-processes-setup)** — picking a channel per process.

> **Cardinal SDK reference:** **[Registering users](/how-to/registering-users)** — the SMS gateway delivers a process’s one-time codes.
