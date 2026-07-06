---
slug: /glossary
sidebar_position: 1
title: Glossary
---

# Glossary

A quick reference for the terms used throughout these docs. The authoritative, maintained glossary lives in
the Cardinal documentation — **[Cockpit Glossary](/cockpit/glossary)**.

| Term | What it means |
|------|---------------|
| **Environment** | Your private space, bound to your email, created on registration; holds all your projects. In the SDK, a top-level Group. See [Environment](/cockpit/environment). |
| **Project** | One application/solution and its database (formerly "Solution"). In the SDK, an *app* Group. See [Project](/cockpit/project). |
| **Tenant** | An isolated **database** inside a project; multi-tenant projects hold several. In the SDK, a *database* Group. See [Tenant](/cockpit/tenant). |
| **User** | The **login/account** entity; linked to a data owner via `healthcarePartyId` / `patientId` / `deviceId`. See [User](/cockpit/user). |
| **Data owner** | An entity that holds encryption keys and owns encrypted data — an HCP, patient, device, or organization. |
| **HCP** | A healthcare professional. In the SDK, a `HealthcareParty`. See [HCP · Patient · Device](/cockpit/hcp-patient-device). |
| **Organization** | A company/clinic user (also a `HealthcareParty`); usually the **parent organization** holding the data-sharing key. See [Organization](/cockpit/organization). |
| **Patient** / **Device** | End-user data owners (`Patient` / `Device`). |
| **Administrator** | Someone who manages the backend in Cockpit, with **Environment** or **Project** access. See [Administrators & Access Levels](/cockpit/administrators-and-access-levels). |
| **Environment Access / Project Access** | The two administrator access levels. See [Administrators & Access Levels](/cockpit/administrators-and-access-levels). |
| **Authentication process** | The email/SMS one-time-code flow your end users register and log in with. See [Authentication Processes](/cockpit/authentication-processes). |
| **External Services** | The email/SMS/captcha gateways (environment-wide). See [External Services](/cockpit/external-services-overview). |
| **Spec ID** | The identifier for your External Services configuration; passed to the SDK as `externalServicesSpecId`. |
| **Project ID** | Your project's reverse-domain [Application ID](/how-to/initialize-the-sdk/#application-id) (set by you); passed to the SDK as `projectId`. |
| **Operation token** | A one-time, single-use token authorising a project ownership transfer. See [Transfer ownership](/cockpit/transfer-ownership). |
| **Custom property** | Typed key–value metadata on a Group or user. See [Custom Properties](/cockpit/custom-properties). |
| **Role / Permission** | A role is a named bundle of permissions assigned to users. See [Roles & Permissions](/cockpit/roles-and-permissions). |
| **Auto-delegation** | A standing rule to auto-share newly created data with chosen data owners. See [Auto-delegation](/cockpit/auto-delegation). |
| **Private key / Recovery key** | The encryption key a data owner needs, and its optional backup. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys). |

## Where to go next

- **[Cockpit Glossary](/cockpit/glossary)** — the in-app/maintained glossary.
- **[Introduction](/cockpit/introduction)** — how Cockpit and Cardinal fit together.

> **Cardinal SDK reference:** **[The Cardinal data model](/explanations/data-model/)** — definitions of the underlying SDK entities.
