---
slug: /initialize-the-cardinal-sdk
sidebar_position: 4
title: Initialize the Cardinal SDK
---

# Initialize the Cardinal SDK

Once your project exists, your application connects to the iCure backend through the **Cardinal SDK**.
Initializing the SDK and authenticating your end users is covered in detail in the SDK guide —
**[How to initialize the SDK](/how-to/initialize-the-sdk/)**. This page doesn't
repeat that walkthrough; it answers the question you hit *just before* it:

## Where do I get the values the SDK asks for?

When you initialize the SDK (and configure an authentication process for self-registration and login),
the code needs a handful of identifiers — most importantly:

| In your SDK config        | In Cockpit (label) | What it identifies                                                     |
|---------------------------|--------------------|------------------------------------------------------------------------|
| `specId`                  | **Spec ID**        | your [External Services](/cockpit/external-services-overview) configuration (email/SMS/captcha gateways)      |
| [`projectId`](/how-to/initialize-the-sdk/#application-id) / Application ID | **Project ID**  | your [project](/cockpit/project), in reverse-domain notation (`com.mycompany.myproject`)   |
| `parentOrganizationId`    | **HCP ID**         | the [organization](/cockpit/organization) that holds the data-sharing key for new users         |
| `externalProcessId` / `processId` | **Process ID** | the [authentication process](/cockpit/authentication-processes) that sends login/registration codes        |

Everything below is about **finding these four values** in Cockpit.

## The fastest path: the "Ready to go" table

When you finish creating a project, the final **Ready to go** step hands you all of these at once, laid
out in two tables with a **copy button** on every value:

- **Project configuration variables** — your **Spec ID**, **Project ID**, the captcha site key(s) you
  enabled, and one **authentication process ID** per channel and user type (e.g. *Email authentication
  process ID*, *Patient SMS process ID*, *Practitioner email process ID*).
- **Parent organization** — its **Name** and **HCP ID**, plus its keys. A **private key is generated
  automatically by default** for the organization created during project creation; the **recovery key is
  optional** — you decide whether to generate one. If you did, it's shown here too.

You can also click **Download all as \*.json** to export the whole set in one file — the simplest way to
hand everything to your application. Some values, like the parent organization's keys, are **shown only
once**, so grab them here.

:::caution
If you've already left this step, don't worry — every value can be found again later from the
dashboard, **except the parent organization's private and recovery keys**, which are shown **only
once** and can't be retrieved afterwards. The rest of this page shows where to find everything else.
:::

<!-- TODO(screenshot): onboarding/ready-to-go — the two "Ready to go" tables (Project configuration
     variables + Parent organization), with the copy buttons and the "Download all as *.json" button
     visible. This is the one image that shows all four values together. -->

## Finding the values again, one by one

The values live in two different scopes, and that distinction matters:

- The **Spec ID** is **environment-wide** — one configuration shared by **every project** in your
  [Environment](/cockpit/environment).
- The **Project ID**, **[parent organization](/cockpit/organization)**, and **[authentication processes](/cockpit/authentication-processes)** belong to a specific
  **[Project](/cockpit/project)** (or, in a multi-tenant project, a specific **[Tenant](/cockpit/tenant)**).

### Spec ID *(one for the whole Environment)*

The **Spec ID** points at your External Services configuration (the email, SMS, and captcha gateways).
That configuration sits at the **Environment** level, so the **same Spec ID is reused by all the
projects** inside your Environment — you don't get a new one per project.

To find it, open the **Account dropdown** in the header and choose **[Manage environment](/cockpit/manage-environment)**, then go to the
**External services** tab. See [External Services](/cockpit/external-services-overview).

:::caution
Only administrators with **Environment Access** can view and edit External Services. A Project-Access
admin will see an "access restricted" message and needs to ask an Environment-Access admin for the value.
:::

<!-- TODO(screenshot): manage-environment/external-services — the External services tab of the Manage
     Environment modal, with the Spec ID highlighted. -->

### Project ID — Configuration → Project overview

Open your project and go to **Configuration → [Project overview](/cockpit/project-overview-and-configuration)**. The **Project ID (set up by you)** is
the reverse-domain identifier you chose when creating the project; it has a copy button (and an edit
button if you need to change it).

:::info
Don't confuse it with **Project group ID (set up by Cardinal)** shown just below — that's iCure's
internal group identifier, not the Application ID the SDK expects.
:::

<!-- TODO(screenshot): configuration/project-overview — the Project overview tab showing "Project ID
     (set up by you)" with its copy button. -->

### Authentication process ID — Configuration → Processes

An **authentication process** is what sends your end users the one-time code they use to register and log
in. A project usually has **several** — one per **channel** (email or SMS) and **user type** (patient or
practitioner) — which is why the "Ready to go" table lists them with names like *Patient email process
ID* or *Practitioner SMS process ID*. **Each one has its own ID**, and your app references whichever
process matches the flow it offers.

To find an ID later, open your project's **Configuration** page and select the **Processes** tab. Every
process appears as a row, and the **Process ID** column holds the value (with a copy button); its tooltip
confirms — *"Use this ID to reference the process in your application code."* Copy the ID from the row
whose **name** matches the channel and user type you need.

:::info
**Multi-tenant projects:** processes can be defined **per tenant** as well. Those live under
**Tenants → \[your tenant] → Processes** rather than the project's Configuration page.
:::

<!-- TODO(screenshot): configuration/processes — the Processes table with the "Process ID" column and a
     row's copy button visible. -->

### Parent organization ID — the Users table

The **[parent organization](/cockpit/organization)** is the HCP that holds the encryption key new users share data through. To
find its ID, open the tenant's **[Users](/cockpit/managing-users)** tab, expand the organization's row, and copy its
**Healthcare party ID** — that's the `parentOrganizationId`. (It's the same value shown as **HCP ID** on
the "Ready to go" step.)

<!-- TODO(screenshot): users/organization-id — an expanded organization row in the Users table showing
     the "Healthcare party ID" with its copy button. -->

## These values aren't fixed — you can add your own

The "Ready to go" table shows the values created *for you* during onboarding, but they're not the only
ones your application can use. Within a project you can:

- **Create more authentication processes** (Configuration → Processes) — for a new channel, language, or
  user type — and use any of their **Process IDs** in your app.
- **Create more organizations** (the Users tab) and assign **their** IDs as the parent organization for a
  given registration process.

Only the **Spec ID** is shared and stable across the whole Environment; the project-level values are
yours to extend. Pick whichever process and organization fit the flow you're building, copy their IDs,
and plug them into your SDK configuration.

## Where to go next

- **[How to initialize the SDK](/how-to/initialize-the-sdk/)** — the full
  initialization and authentication walkthrough, now that you have the values.
- **[Authentication Processes (setup)](/cockpit/authentication-processes-setup)** — create and edit the processes whose IDs you pass to the SDK.
- **[Project Overview & Configuration](/cockpit/project-overview-and-configuration)** — where the Project ID and processes live.
- **[External Services](/cockpit/external-services-overview)** — the Spec ID and the gateways behind it.
- **[Managing Users](/cockpit/managing-users)** — add your first end users (HCPs, patients, devices).

> **Cardinal SDK reference:** **[Initialize the SDK](/how-to/initialize-the-sdk/)** and the **[quickstarts](/quickstart/typescript)** — the full developer walkthrough.
