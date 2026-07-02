---
slug: /external-services-captcha
sidebar_position: 4
title: Captcha
---

# Captcha

A **captcha** protects your registration/login flows from automated abuse before an OTP is ever sent.
Configure it from **Manage environment → External services** (see [Overview](/cockpit/external-services-overview)). Three providers are
supported:

| Provider | Fields |
|----------|--------|
| **Google reCAPTCHA v3** | **Secret Key** |
| **Friendly Captcha** | **Secret Key** |
| **Cardinal Kerberus Captcha** | *none* — no API key required |

**[Kerberus](https://github.com/icure/kerberus)** is Cardinal's own **free** captcha: *"You don't need to
provide an API key — Cardinal will automatically generate one for you."* It's a great default for getting
started.

:::info
Your application needs the **site key** for whichever captcha you enabled. The keys surface in **Manage
environment → Environment variables** and on the wizard's **Ready to go** step (e.g. *reCAPTCHA site key*,
*Friendly Captcha site key*, *Kerberus API key*). See [Environment](/cockpit/environment) and
[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).
:::

:::caution
Captcha configuration is **Environment-Access only** and shared across every project in the
[Environment](/cockpit/environment).
:::

## Where to go next

- **[Email](/cockpit/external-services-email)** · **[SMS](/cockpit/external-services-sms)** — the OTP delivery gateways.
- **[Demo setup](/cockpit/external-services-demo-setup)** — includes Kerberus by default.
- **[Authentication Processes](/cockpit/authentication-processes)** — the flows the captcha protects.

> **Cardinal SDK reference:** **[Solving the captcha](/how-to/initialize-the-sdk/captcha)** — handling the captcha from your app.
