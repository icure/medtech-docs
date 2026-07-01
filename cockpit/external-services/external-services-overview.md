---
slug: /external-services-overview
sidebar_position: 1
title: Overview
---

# External Services — Overview

**External Services** are the **gateways your project uses to reach your users** — the email and SMS
providers that deliver one-time codes, and the captcha that protects your sign-in flows. They're what make
[authentication processes](/cockpit/authentication-processes) actually able to send their OTPs.

They come in three kinds:

- **[Email](/cockpit/external-services-email)** — SendGrid, SMTP, or Outlook.
- **[SMS](/cockpit/external-services-sms)** — Twilio, OVH, Ring ring, or Swisscom.
- **[Captcha](/cockpit/external-services-captcha)** — Google reCAPTCHA v3, Friendly Captcha, or Cardinal Kerberus.

## Where they're configured

External Services live at the **[Environment](/cockpit/environment) level** — one configuration shared by **every project** in
your Environment. You set them up in two places:

- During the project-creation wizard's **Configure external services** step (or skip it with the
  **[Demo setup](/cockpit/external-services-demo-setup)**); see [Create Your First Project](/cockpit/create-your-first-project).
- Anytime after, from **Manage environment → External services**.

:::caution
External Services are **Environment-Access only.** A Project-Access admin sees *"Only administrators with
'Environment Access' can view and manage this data."* See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

:::info
**Coming soon.** iCure is moving to a new internal message gateway, **Kermes**. With it, External Services
will move from the **[Environment](/cockpit/environment) level to the [Project](/cockpit/project) level** — so each project will be able to
have its **own** email/SMS/captcha configuration instead of sharing one environment-wide setup. See the
[Changelog](/cockpit/changelog).
:::

## The Spec ID

The whole External Services configuration is identified by one **Spec ID** — environment-wide, reused by
every project. It's the value your application passes to the SDK as `externalServicesSpecId` so the message
gateway knows which configuration to send through. You'll find it in **Manage environment → Environment
variables** and on the wizard's **Ready to go** step. See [Environment](/cockpit/environment) and
[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).

:::info
A configured gateway is what lets [authentication processes](/cockpit/authentication-processes) deliver OTPs. Without at least one email or
SMS gateway, your end users can't receive their login/registration codes.
:::

## Where to go next

- **[Email](/cockpit/external-services-email)** · **[SMS](/cockpit/external-services-sms)** · **[Captcha](/cockpit/external-services-captcha)** — configure each gateway type.
- **[Demo setup](/cockpit/external-services-demo-setup)** — get started fast with a limited preconfigured gateway.
- **[Authentication Processes](/cockpit/authentication-processes)** — what uses these gateways to send OTPs.

> **Cardinal SDK reference:** **[Initialize the SDK](/how-to/initialize-the-sdk/)** — your app passes the Spec ID configured here.
