---
slug: /authentication-processes-setup
sidebar_position: 6
title: Authentication Processes (setup)
---

# Authentication Processes (setup)

This is the practical how-to for **creating and managing** authentication processes. For what a process
*is* and how your application calls it, see the concept page: [Authentication Processes](/cockpit/authentication-processes).

:::caution
Processes are **Environment-Access only**. A Project-Access admin sees: *"Only administrators with
'Environment Access' can view and manage Processes."* See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

## Where processes live

- **Project level** — **Configuration → Processes**. Only a limited set is available here: **Login** and
  **Generic email**.
- **Tenant level** — **Tenants → \[tenant] → Processes**. **All** process types are available, including
  the **Registration** templates.

:::info
Rule of thumb: **Login and Generic at the project**, **Registration inside the tenant**. In a single-tenant
project the tenant is hidden, so you manage everything from the project's Configuration.
:::

## Creating a process

**Gateways and channels.** A process sends its codes through a gateway you configure in
[External Services](/cockpit/external-services-overview). You can still create a process *before* its gateway exists — Cockpit warns you in
the modal and the process simply won't send on that channel until a matching gateway is set up.

:::caution
**On the demo setup, SMS is unavailable.** While only the demo SendGrid gateway is configured, the modal
shows the demo reminder and the **SMS template** option is **disabled**: *"SMS is not available with the
demo setup. To send SMS messages, configure an SMS gateway in External Services."* Add a real
[SMS](/cockpit/external-services-sms) gateway to enable it.
:::

> See [Email](/cockpit/external-services-email), [SMS](/cockpit/external-services-sms) and [Demo setup](/cockpit/external-services-demo-setup).

On the Processes tab, click **Create process** (or **Create project process** / **Create tenant process**)
and fill in the form:

1. **Process template** — pick one: *Patient / Organisation / Practitioner … Registration*, *Generic Email
   or SMS template*, or *Email or SMS Login*. **This is fixed once created.**
2. **Name** and an optional **Language**.
3. **Email template** — a **Subject** and an **HTML** body; **or SMS template** — a **Message**.
4. **Parent organisation** *(registration templates only)* — the [organization](/cockpit/organization) new users are attached
   to. **Required for patient processes** (*"Parent organisation is required for patient authentication
   process."*).
5. **Create auto delegation to parent organisation** *(registration templates only)* — when on, users
   created through this process share with the parent so HCPs with the same parent can access their data.

Click **Autofill defaults** to start from a ready-made template, then **Submit**.

:::info
**One process per language.** A process holds a single language and message, so to support more than one
language, create a separate process per language — each with its own **Process ID**.
:::

<!-- TODO(screenshot): configuration/processes — the Create process modal showing template, name,
     email/SMS template, parent organisation, and the auto-delegation toggle. -->

### Dynamic variables

Subject, HTML, and SMS text can interpolate values with `{{it.variable}}`:
**`validationCode`** (the one-time code), **`firstName`**, **`lastName`**, **`email`**, **`mobilePhone`**.
(Generic, non-authentication templates support all of these *except* `validationCode`.) The default email
subject is `Your confirmation code: {{it.validationCode}}`.

## Managing existing processes

The Processes table lists each process with a **Process ID** column — *"Use this ID to reference the process
in your application code."* Per row you can:

- **Edit process** — change its name, language, or message (not its template).
- **Delete process** — remove it (with confirmation).
- **Transfer to another group** — move it between the project and one of its tenants
  (*"Transfer to another group"*). **Registration processes can't be moved.**

For multi-tenant projects the table also shows the **Parent ID**, **Auto delegation to parent**, and
**Parent enrolment status** of each registration process.

:::caution
If a registration process's **parent organisation has no initialized private key**, auto-delegation won't
work *and* users created through it can't access encrypted data. Watch the **Parent enrolment status** and
initialize the parent's key first — see [Organization](/cockpit/organization).
:::

## Where to go next

- **[Authentication Processes](/cockpit/authentication-processes)** — the concept: how your app uses the Spec ID + Process ID.
- **[External Services](/cockpit/external-services-overview)** — the gateways (and Spec ID) that actually send the codes.
- **[Organization](/cockpit/organization)** — the parent organisation and its key that auto-delegation needs.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — plugging the Process ID into your application.

> **Cardinal SDK reference:** **[Registering users](/how-to/registering-users)** and **[Initialize the SDK](/how-to/initialize-the-sdk/)** — using the process IDs you create here.
