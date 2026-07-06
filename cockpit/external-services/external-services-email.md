---
slug: /external-services-email
sidebar_position: 2
title: Email
---

# Email gateway

An **email gateway** sends your users their one-time codes (and other process emails) by email. Configure it
from **Manage environment → External services** (see [Overview](/cockpit/external-services-overview)). iCure supports three providers — pick
the one you have an account with:

| Provider | Fields |
|----------|--------|
| **SendGrid** | **Api Key** |
| **SMTP** | **Host**, **User**, **Password** |
| **Outlook** | **Tenant ID**, **Client ID**, **Client Secret** |

You also set the **sender email** the messages go out from.

:::info
The email gateway is what an [authentication process](/cockpit/authentication-processes) uses to deliver **email** OTPs. You can run email
and [SMS](/cockpit/external-services-sms) gateways side by side and choose the channel per process.
:::

:::caution
A process can only use a channel you've configured. With **only an email gateway** set up you **can't create
an SMS authentication process** — add an [SMS](/cockpit/external-services-sms) gateway first. See [Authentication Processes (setup)](/cockpit/authentication-processes-setup).
:::

:::caution
Email gateways are **Environment-Access only** and shared across every project in the
[Environment](/cockpit/environment). To try things without your own provider, use the **[Demo setup](/cockpit/external-services-demo-setup)** (limited to
200 emails).
:::

## Where to go next

- **[SMS](/cockpit/external-services-sms)** — the SMS counterpart.
- **[Demo setup](/cockpit/external-services-demo-setup)** — the preconfigured SendGrid demo.
- **[Authentication Processes (setup)](/cockpit/authentication-processes-setup)** — picking a channel per process.

> **Cardinal SDK reference:** **[Registering users](/how-to/registering-users)** — the email gateway delivers a process’s one-time codes.
