---
slug: /external-services-demo-setup
sidebar_position: 5
title: Demo setup
---

# Demo setup

**Demo setup** lets you skip provider configuration and start testing immediately. In the project-creation
wizard's **Configure external services** step, choose **Use Demo setup** and Cockpit wires up a
preconfigured environment for you:

- a **SendGrid email gateway** (iCure's, limited to **200 emails**), and
- **Cardinal Kerberus** captcha.

That's enough to exercise your authentication flows end to end without signing up for any provider.

:::caution
**Demo setup is for testing, not production.** It's email-only (no SMS) and capped at **200 emails** —
*"After reaching this limit, you'll need to add your own API key from any supported message gateway to
continue using Cardinal without interruption."*
:::

## Replacing the demo with your own gateways

While only the demo is configured, **Manage environment → External services** shows a reminder:

> You are currently using the demo SendGrid access provided by the iCure team. This access has a limited
> email sending quota. To continue sending emails to your end users without interruption, please configure
> at least one email gateway.

Add your own [Email](/cockpit/external-services-email) (and, if you need texts, [SMS](/cockpit/external-services-sms)) gateway there for real traffic.

## Where to go next

- **[Email](/cockpit/external-services-email)** · **[SMS](/cockpit/external-services-sms)** · **[Captcha](/cockpit/external-services-captcha)** — configure your own gateways.
- **[Create Your First Project](/cockpit/create-your-first-project)** — where Demo setup is offered during onboarding.
- **[Overview](/cockpit/external-services-overview)** — how external services fit together.

> **Cardinal SDK reference:** **[Initialize the SDK](/how-to/initialize-the-sdk/)** — using the Spec ID the demo setup creates.
