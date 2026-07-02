---
slug: /introduction
sidebar_position: 1
title: Introduction
---

# Introduction: How Cockpit and Cardinal work together

Two complementary pieces of iCure work together to power your application. **Cockpit** is the admin
console where you set up and manage your backend. **Cardinal** is the platform your application talks to
at runtime through the **[Cardinal SDK](/)**. You use Cockpit to provision and configure things; your
application then uses the [Cardinal SDK](/) every day to read and write data.

:::tip Open Cockpit
Cockpit runs entirely in your browser — nothing to install.
**[Open Cockpit → cockpit.icure.dev](https://cockpit.icure.dev/)** to register or sign in, then follow
along in [Register & Log In](/cockpit/register-and-log-in).
:::

## Bootstrap your app from a template

You don't have to start from a blank project. Cardinal ships **ready-to-clone starters** in several
languages, so you can go from *"account created"* to *"app talking to the backend"* in minutes. There are
two kinds:

- **Template apps** — self-contained examples that showcase the main Cardinal SDK features, great for
  learning the API. Available for **[TypeScript](/quickstart/typescript)**, **[Kotlin](/quickstart/kotlin)**,
  and **[Python](/quickstart/python)** (all in [one repo](https://github.com/icure/cardinal-introductory-tutorial)),
  and **[Dart](/quickstart/dart)** ([separate repo](https://github.com/icure/cardinal-dart-introductory-tutorial)).
- **Boilerplates** — starter projects already wired up with authentication and the SDK, meant as the
  foundation for your own app:
  - **React (web)** — [`cardinal-sdk-react-js-template`](https://github.com/icure/cardinal-sdk-react-js-template)
  - **React Native (Expo)** — [`expo-medtech-boilerplate`](https://github.com/icure/expo-medtech-boilerplate)
  - **Flutter / Dart** — [`cardinal-sdk-flutter-boilerplate`](https://github.com/icure/cardinal-sdk-flutter-boilerplate)

See the **[Quickstart](/quickstart/index)** for step-by-step setup in each language. Whichever you pick,
you'll plug in the values from your project's **"Ready to go"** step — see
[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk).

## Start in Cockpit: registration creates your Environment

Before anything else: **when you register in Cockpit, you create an _Environment_.** The Environment is
bound to your email address, and you become its **only administrator with "Environment Access"** — full
control over everything inside it. (You can later invite more administrators; additional ones can be
scoped to a single project with **"Project Access"** instead.)

Everything you build lives inside that Environment, in a simple hierarchy:

```
Environment            ← created on registration, bound to your email (you = sole Environment-Access admin)
└── Project            ← one application/solution and its database
    └── Tenant         ← an isolated slice of a project (multi-tenant projects only)
```

- An **[Environment](/cockpit/environment)** can contain many **[Projects](/cockpit/project)**.
- A **[Project](/cockpit/project)** is single-tenant by default; a **[multi-tenant](/cockpit/multitenancy)** project contains many **[Tenants](/cockpit/tenant)**, each an
  isolated set of data and users.

## The two sides

### Cockpit — the admin console

Cockpit is a web app for **provisioning and configuring** your iCure backend. It doesn't store your
medical data itself — every action you take in Cockpit is performed *through* the Cardinal SDK against
the iCure Cardinal backend. In Cockpit you:

- create **Projects** (and, for multi-tenant projects, **Tenants**);
- create the **[users](/cockpit/managing-users)** your application will have (see the user types below) and the
  **[Administrators](/cockpit/administrators)** who manage the project;
- wire up **[External Services](/cockpit/external-services-overview)** (email and SMS gateways, captcha);
- configure the **[Authentication Process](/cockpit/authentication-processes)** (the email/SMS one-time code) — it's what lets your
  application's end users **register themselves and log in** (it references the project's group and
  parent organization). Creating users in Cockpit doesn't require a process; your app's
  self-registration and login flows do;
- manage **[Roles & Permissions](/cockpit/roles-and-permissions)**, **[External JWT](/cockpit/external-jwt-configuration)**, **[Custom Properties](/cockpit/custom-properties)**, and read **[Metrics](/cockpit/metrics)** and
  **[storage usage](/cockpit/storage-and-plans)**.

### Cardinal SDK — the client library

The **[Cardinal SDK](/)** ([`@icure/cardinal-sdk`](/how-to/initialize-the-sdk/)) is the library your application embeds (React, React Native,
Python, …) to talk to the iCure backend. It gives you authenticated, **[end-to-end-encrypted](/explanations/end-to-end-encryption/)** access to
the medical [data model](/explanations/data-model/), organised as API namespaces — among them:

- **People & access:** [`User`](/explanations/data-model/user), [`HealthcareParty`](/explanations/data-model/healthcareparty), [`Patient`](/explanations/data-model/patient), [`Device`](/explanations/data-model/device), [`Role`](/how-to/define-user-roles), `Permission`
- **Clinical data:** [`Contact`](/explanations/data-model/contact), [`HealthElement`](/explanations/data-model/healthelement), [`Document`](/explanations/data-model/document), `Form`, [`Message`](/explanations/data-model/message), [`Topic`](/explanations/data-model/topic), `Invoice`,
  [`CalendarItem`](/explanations/data-model/calendaritem)/[`Agenda`](/explanations/data-model/agenda), [`Code`](/explanations/data-model/code)
- **Cross-cutting:** [`Group`](/how-to/manage-a-multi-group-environment), `Auth`, `Crypto`, [`DataOwner`](/explanations/data-model/#data-owners), [`Recovery`](/how-to/key-management), `MaintenanceTask`

All data lives inside **[Groups](/how-to/manage-a-multi-group-environment)** — iCure's container primitive — and the SDK is group-aware: most
operations have a variant scoped to a specific group. That group model is exactly what Cockpit's
**Environment → Project → Tenant** hierarchy maps onto.

## User types

A project's users come in several types, each created from its own place in Cockpit:

- **[HCP](/cockpit/hcp-patient-device)** — a healthcare professional (a person).
- **[Organization](/cockpit/organization)** — an organizational party (e.g. a clinic or company). It's just another user type with
  its own creation UI — **not** a mandatory parent of the other users.
- **[Patient](/cockpit/hcp-patient-device)**
- **[Device](/cockpit/hcp-patient-device)**
- **Custom Entities** — *coming in the next version of Cockpit.*

Each user is a **[data owner](/explanations/data-model/#data-owners)**: the Cardinal SDK's crypto layer (`Crypto`, `CryptoStrategies`,
`RecoveryKey`, Shamir key sharing) manages their end-to-end encryption keys, so data is encrypted on the
client and only readable by the parties it's shared with.

## How they cooperate

```
        ┌──────────────────────────────┐
        │            COCKPIT            │   (you, to set things up)
        │  Environment → Project →      │
        │  Tenant · Users · Auth        │
        │  process · External services  │
        └───────────────┬──────────────┘
                        │ provisions & configures (via the Cardinal SDK)
                        ▼
        ┌──────────────────────────────┐
        │     iCure Cardinal backend    │   (Groups hold your data, end-to-end encrypted)
        └───────────────▲──────────────┘
                        │ authenticated, encrypted reads/writes
        ┌───────────────┴──────────────┐
        │        YOUR APPLICATION       │   (every day, via the Cardinal SDK)
        │     @icure/cardinal-sdk       │
        └──────────────────────────────┘
```

The typical loop:

1. **Set up the backend in Cockpit** — register (creating your Environment), create a Project, add your
   **users**, and configure an **Authentication Process**. You can create users directly in Cockpit
   without a process; the Authentication Process is what lets your application's end users **register
   themselves and log in**.
2. **Collect the SDK configuration values** — the final **"Ready to go"** step of project creation hands
   you the identifiers your application needs (project/group id, external-services spec id, authentication
   process id, …).
3. **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** in your app with those values, and authenticate.
4. **Read and write data** through the SDK — scoped to your project (and tenant), end-to-end encrypted.

:::info
Cockpit and your application both talk to the same backend through the same SDK. Cockpit is the
"control plane" (set-up and administration); your app is the "data plane" (everyday use).
:::

## The data model (Cockpit ↔ Cardinal)

Cockpit gives friendly names to the underlying iCure concepts:

| In Cockpit                 | In the Cardinal SDK             | What it is                                                                                |
|----------------------------|---------------------------------|-------------------------------------------------------------------------------------------|
| **[Environment](/cockpit/environment)**            | a top-level [Group](/how-to/manage-a-multi-group-environment)               | created when you register; bound to your email; you are its sole Environment-Access admin |
| **[Project](/cockpit/project)**                | a [Group](/how-to/manage-a-multi-group-environment)                         | one application/solution and its database                                                 |
| **[Tenant](/cockpit/tenant)**                 | a [Group](/how-to/manage-a-multi-group-environment) within a project        | an isolated slice of a multi-tenant project                                               |
| **[Administrator](/cockpit/administrators-and-access-levels)**          | a [`User`](/explanations/data-model/user) with admin rights      | manages the project in Cockpit (Environment- or Project-scoped access)                    |
| **[HCP / Organization](/cockpit/organization)**     | [`HealthcareParty`](/explanations/data-model/healthcareparty)               | a healthcare professional, or an organizational party                                     |
| **[Patient](/cockpit/hcp-patient-device)**                | [`Patient`](/explanations/data-model/patient)                       | an end user / subject of care                                                             |
| **[Device](/cockpit/hcp-patient-device)**                 | [`Device`](/explanations/data-model/device)                       | a connected device                                                                        |
| **[Authentication Process](/cockpit/authentication-processes)** | an auth process (email/SMS OTP) | how the end users log in / register to your application                                   |

## Where to go next

- **[Register & Log In](/cockpit/register-and-log-in)** — create your Cockpit account (and Environment) and sign in.
- **[Create Your First Project](/cockpit/create-your-first-project)** — walk the project-creation wizard.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — plug the "Ready to go" values into your app.
- **[Managing Users](/cockpit/managing-users)** — add your first end users (HCPs, patients, devices).

> **Core concepts** — the building blocks referenced above:
[Environment](/cockpit/environment) · [Project](/cockpit/project) · [Tenant](/cockpit/tenant) ·
[Organization](/cockpit/organization) · [HCP · Patient · Device](/cockpit/hcp-patient-device) ·
[Administrators & Access Levels](/cockpit/administrators-and-access-levels) ·
[Authentication Processes](/cockpit/authentication-processes).

> **Cardinal SDK docs** — for the developer side:
[SDK documentation](/) · [How to initialize the SDK](/how-to/initialize-the-sdk/) ·
[The Cardinal data model](/explanations/data-model/) ·
[End-to-end encryption](/explanations/end-to-end-encryption/).

> **Templates & boilerplates** — clone a starter and go:
[Quickstart](/quickstart/index) ·
[TypeScript](/quickstart/typescript) · [Kotlin](/quickstart/kotlin) · [Python](/quickstart/python) · [Dart](/quickstart/dart) ·
[React](https://github.com/icure/cardinal-sdk-react-js-template) ·
[React Native](https://github.com/icure/expo-medtech-boilerplate) ·
[Flutter](https://github.com/icure/cardinal-sdk-flutter-boilerplate).
