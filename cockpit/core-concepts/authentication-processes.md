---
slug: /authentication-processes
sidebar_position: 8
title: Authentication Processes
---

# Authentication Processes

An **authentication process** defines **how your application communicates with an end user by email or SMS**
to deliver the **one-time code (OTP)** they use to **register** or **log in**. It's the piece that lets your
application's [HCPs, patients, and devices](/cockpit/hcp-patient-device) sign themselves in — as opposed to the users you create by
hand in Cockpit, which don't need a process.

Each process has its own **Process ID**, and your application references whichever process matches the flow
it's offering. A project typically has **several** — one per **channel** (email or SMS) and **user type**
(patient, practitioner, organisation), plus **Login** and **Generic** templates.

:::info
**One process per language.** A process carries a single **Language** and a single message (subject/body
or SMS text), so to reach users in more than one language you create a **separate process per language**
— each with its own **Process ID**. Your application picks the process whose language matches the user,
on top of the right channel and user type.
:::

:::caution
Authentication processes are **Environment-Access only**. A Project-Access admin sees: *"Only
administrators with 'Environment Access' can view and manage Processes."* See
[Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

## How your application uses a process

A process needs **two identifiers** from Cockpit: the **Spec ID** (your [External Services](/cockpit/external-services-overview)
configuration, which decides *how* the message is sent) and the **Process ID** (which template to run, i.e.
*what* is sent). Your application passes both to the Cardinal SDK to start a registration or login: the SDK
asks the message gateway to send the one-time code, and the user completes the flow by entering it.

The exact SDK call and code are covered in the Cardinal documentation —
**[How to initialize the SDK](/how-to/initialize-the-sdk/)** — and locally in
[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk), where you also find where to copy these two values.

## What a process contains

When you create a process (**Configuration → Processes → Create process**), you choose a **Process
template** and fill in the message:

- **Process template** — one of *Patient / Organisation / Practitioner … Registration*, *Generic Email or
  SMS template*, or *Email or SMS Login*. (Fixed once created.)
- **Name** and optional **Language**.
- **Email template** — a **Subject** and **HTML** body; **or SMS template** — a **Message**.
- **Parent organisation** *(registration templates only)* — the [organization](/cockpit/organization) new users are attached to.
  **Required for patient processes** — *"Parent organisation is required for patient authentication
  process."*
- **Create auto delegation to parent organisation** *(registration templates only)* — see below.

Click **Autofill defaults** to start from a ready-made template. The default email subject is
`Your confirmation code: {{it.validationCode}}`, and the body greets the user and shows the code.

### Dynamic variables

Message text can interpolate values with `{{it.variable}}`. The supported variables are
**`validationCode`** (the one-time code), **`firstName`**, **`lastName`**, **`email`**, and
**`mobilePhone`**. (Generic, non-authentication templates support all of these *except* `validationCode`.)

## Project-level vs tenant-level processes

Where a process lives depends on its type:

- **Project level** — *"only a limited set of process types is available, including **Login** and **Generic
  email**. Registration should be configured at the tenant level."*
- **Tenant level** — *"**All** process types are available at the tenant level. However, we recommend
  configuring **Login at the project level** whenever possible."*

In short: **Login and Generic at the project**, **Registration inside the [tenant](/cockpit/tenant)**. You can **Transfer**
a process between a project and its tenants (*Transfer to another group*), except **registration processes,
which can't be moved**.

:::info
In a single-tenant project the tenant is hidden, so you manage its processes from the project's
Configuration. In a multi-tenant project, a tenant's processes live under **Tenants → \[tenant] →
Processes**.
:::

## Auto-delegation and the parent's key

Registration processes can **auto-delegate to the parent organisation**: when enabled, users created through
the process automatically share with the parent, so *"healthcare professionals with the same parent can
access and decrypt user data."*

This only works if the **parent organisation's private key is initialized**. The Processes table surfaces a
**Parent enrolment status** for exactly this reason — if the parent is *uninitialized*:

:::caution
The parent HCP does not have an initialized private key. Auto delegation will not work until the private
key is set up. In addition, users created through this process will not be able to create or access
encrypted data.
:::

So a registration process and its parent organisation's key go together — see [Organization](/cockpit/organization) for how the
key is initialized.

## Finding a Process ID

Each process row has a **Process ID** column whose tooltip confirms *"Use this ID to reference the process
in your application code."* Copy the ID from the row whose template/channel matches your flow. The IDs also
appear on the project-creation wizard's **Ready to go** step (e.g. *Patient email process ID*, *Practitioner
SMS process ID*). See [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).

<!-- TODO(screenshot): configuration/processes — the Processes table with the Process ID column and its
     "use this ID in your application code" tooltip. -->

## Where to go next

- **[External Services](/cockpit/external-services-overview)** — the email/SMS gateways (and the Spec ID) a process sends through.
- **[Organization](/cockpit/organization)** — the parent organisation and its private key that auto-delegation relies on.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — passing the Spec ID and Process ID to `initializeWithProcess`.
- **[Authentication Processes (setup)](/cockpit/authentication-processes-setup)** — the practical how-to for creating and editing processes.

> **Cardinal SDK reference:** **[Registering users](/how-to/registering-users)** and **[Initialize the SDK](/how-to/initialize-the-sdk/)** — how your app runs a process to register and log users in.
