---
slug: /create-your-first-project
sidebar_position: 3
title: Create Your First Project
---

# Create Your First Project

Inside your Environment you can spin up a project in two ways:

- **Onboarding** *(recommended for your first time)* — a short guided flow that walks you through every
  decision and provisions a complete, ready-to-use setup: the project and its database, its **business
  model**, an optional [parent organization](/cockpit/organization), your [external services](/cockpit/external-services-overview), and
  the [authentication processes](/cockpit/authentication-processes) your end users will log in with. It ends by handing you the configuration
  values your application needs.
- **Create a Project** — the same wizard without the welcome guidance, handy once you know your way around
  and just want to add another project to your Environment.

Both start from the dashboard: a brand-new Environment offers **Start onboarding** and **Create project**;
later, the **Create Project** button is always available.

:::info
Nothing is created until the final step. As you move through the flow Cockpit just collects your
choices — you can go back and change anything; the project, database, organization, services, and
authentication processes are all provisioned together when you finish.
:::

## The onboarding, step by step

### 1. Welcome

A short introduction. Click **Create Solution** (start onboarding) to begin.

### 2. Project

Name your project, give it a **Project ID**, and pick a **cluster**. The business model is chosen on the
next step.

- The **Project ID** uses reverse-domain notation (e.g. `com.mycompany.myproject`). It keeps projects
  isolated: when a user can reach several databases, only those matching the Project ID are visible to
  your application.
- The **cluster** is the region where your data is hosted; choose the one closest to your users.

![The Project step: the project name, the reverse-domain Project ID, and the cluster selector.](img/onboarding/project.png)

*Creates:* a new **[Project](/cockpit/project)** (a fresh iCure environment/group) and its first **database**. In Cockpit a
database is called a **[Tenant](/cockpit/tenant)**. A project starts with a single database — that is, **one tenant** — so by
default a project is **single-tenant**. You can switch it to **[multi-tenant](/cockpit/multitenancy)** later from its
**[Project Configuration](/cockpit/project-overview-and-configuration)** (the deployment-model setting), which lets the project hold several tenants.

### 3. Users

**Configure secure access and data sharing.** Tell Cockpit who will use your application and how they
share data; the answers decide which registration processes and which parent organization are set up.

| Field | What it decides |
|-------|-----------------|
| **End users of the application** | any combination of **Patients**, **Healthcare professionals**, and **Medical devices**. One registration process is created per selected type (devices get none). |
| **Project business model** | how the project is invoiced: **Per Healthcare Professional (HCP)**, **Per Patient**, or **Per Device or Institution Bed**. It preselects the matching end-user type until you edit the list — it never limits who can use the app. |
| **Healthcare professional data sharing** *(if professionals are selected)* | **Yes** — professionals can access medical data created by other professionals (a shared practice); **No** — each professional only sees what they created. |
| **Patient data sharing** *(if professionals and patients are selected)* | **Yes** — all professionals can access data created by the patient; **No** — only the responsible professional can. |

*Impacts:* the **data-sharing** model, whether an **Organization** is created (next step), and the set of
**authentication process IDs** you get at the end. Registration for other end-user types can be added later
from **[Project Configuration](/cockpit/project-overview-and-configuration) → Processes**.

:::caution
Changing the business model of an existing project affects how it is invoiced — contact the iCure team if
you are not sure which model to select. You can change it from either of two places: **[Project
Configuration](/cockpit/project-overview-and-configuration) → Project overview**, where the **Business
model** field carries an edit button, or the dashboard's project card, via its **Edit project** action. It
is also shown on the project card and on a tenant's overview (read-only in both); projects created before
this feature show **Per HCP (default)** there and are prompted to select a real model. See
[Project Overview & Configuration](/cockpit/project-overview-and-configuration#business-model).
:::

:::info
If the Environment has no email or SMS gateway yet, the step warns that the registration processes will use
the **demo SendGrid access** provided by the iCure team, which has a limited sending quota. Configure a
gateway in [External Services](/cockpit/external-services-overview) to lift it.
:::

![The Users step: the end-user multi-select with Healthcare professionals and Patients, the Per Healthcare Professional business model, and the two data-sharing questions.](img/onboarding/users-step.png)

### 4. Organization *(only when needed)*

When your answers imply users share data — patients or devices are served, or any sharing answer is
**Yes** — the flow asks you to create a **parent [Organization](/cockpit/organization)** — the
party that holds the **encryption key** used to share data between users.

- Its **private key is generated automatically** and can't be turned off — the organization needs it to
  encrypt and share data.
- A **recovery key is optional** (off by default). Enable it so you can restore access to the
  organization's data if its private key is ever lost. Like other keys, it's shown only once. See
  [Recovery & Private Keys](/cockpit/recovery-and-private-keys).

*Creates:* the parent **[Organization](/cockpit/organization)** (an HCP) with its private key — plus a recovery key if you enabled it.

:::info
This step is skipped when a shared parent isn't required — healthcare professionals only, with both
sharing answers set to **No**.
:::

![The Organization step: the parent organization's name and email, the keys-required notice, and the automatically generated private key.](img/onboarding/organization.png)

### 5. External Services

Configure the gateways your project uses to reach your users, or click **Use Demo setup** to get started
quickly. **Demo setup is limited**: it includes **200 free emails** that we provide so you can test how
the product works — for real traffic, configure your own gateways.

- **[Email](/cockpit/external-services-email)** — SendGrid, SMTP, or Outlook.
- **[SMS](/cockpit/external-services-sms)** — Twilio, OVH, Ringring, or Swisscom.
- **[Captcha](/cockpit/external-services-captcha)** — reCAPTCHA, Friendly Captcha, or **[Kerberus](https://github.com/icure/kerberus)**.
  Kerberus is Cardinal's own proof-of-concept captcha — **free of charge**, so feel free to use it.

*Impacts:* these power the **[authentication processes](/cockpit/authentication-processes)** — they're how the one-time login codes are
actually sent to your end users.

![The External services step: the captcha and message-gateway provider options, with the Use Demo setup shortcut.](img/onboarding/external-services.png)

### 6. Ready to go

This is the payoff step: Cockpit confirms your project was created and hands you everything you need to
connect your application. Take a moment here — some of it you can't get back later.

**Configuration values.** The project's **name** and the identifiers the Cardinal SDK needs, each with a
copy button:

- **Project [Application ID](/how-to/initialize-the-sdk/#application-id)** — your project's identifier (the reverse-domain ID you chose).
- **External Services Spec ID** — references the email/SMS/captcha configuration you set up.
- **Captcha site key(s)** — for reCAPTCHA / Friendly Captcha / Kerberus, depending on what you enabled.
- **Authentication process IDs** — one per channel and user type (e.g. patient vs practitioner, email vs
  SMS). Your application uses these so its end users can register and log in.

**Parent Organization** *(if you created one).* Its **name** and **ID**, plus the **private key** and —
only if you enabled it — the **recovery key**. These two are **downloadable** and shown **only once**:
save them now. If you lose the private key and have no recovery key, the organization's encrypted data
**cannot be recovered**.

**Download all as \*.json.** Exports the whole summary (all the values above, including the org keys) in
a single file — the easiest way to hand everything to your app or store it safely.

**Jump-start your app.** The step also links to ready-made **boilerplate apps** — a ready environment with
an initialized Cardinal SDK and working login/registration flows — for
[Compose Multiplatform](https://github.com/icure/cardinal-sdk-compose-multiplatform-boilerplate),
[React](https://github.com/icure/cardinal-sdk-react-js-template),
[React Native (Expo)](https://github.com/icure/cardinal-sdk-expo-boilerplate),
[Flutter](https://github.com/icure/cardinal-sdk-flutter-boilerplate) and
[Python](https://github.com/icure/icure-sdk-python-boilerplate-app-template), plus the
[PetraCare EHR template app](https://github.com/icure/icure-ehr-lite-doctor-app) you can clone to get going fast.

When you're done, click **Finish** to close the flow and land on your new project. Next, plug these values
into your application — see *Initialize the Cardinal SDK*.

![The Ready to go step: the parent organization table and the project-configuration variables — Project ID, Spec ID, captcha key, and authentication process IDs — each with a copy button.](img/onboarding/ready-to-go.png)

## Where to go next

- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — use the "Ready to go" values in your application.
- **[Managing Users](/cockpit/managing-users)** — add your first end users (HCPs, patients, devices).
- **[Project Overview & Configuration](/cockpit/project-overview-and-configuration)** — where your project's settings, IDs, and processes live afterwards.
- **[External Services](/cockpit/external-services-overview)** — set up your own email, SMS, and captcha gateways.
- **[Multitenancy](/cockpit/multitenancy)** — when and how to split a project into isolated tenants.
- **[Managing Tenants](/cockpit/managing-tenants)** — the tenant-creation wizard reuses this flow's Users and Organization steps.

> **Cardinal SDK reference:** **[Initialize the SDK](/how-to/initialize-the-sdk/)** — connect your app once the project exists.
