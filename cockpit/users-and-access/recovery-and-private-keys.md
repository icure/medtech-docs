---
slug: /recovery-and-private-keys
sidebar_position: 5
title: Recovery & Private Keys
---

# Recovery & Private Keys

iCure data is **end-to-end encrypted**, so every [data owner](/explanations/data-model/#data-owners) (HCP, patient, device, organization) needs
its own **key pair**. Having a private key is what the SDK calls *initializing* the key — **until a data
owner's key is initialized, it can't create or read encrypted data.** This page covers where those keys come
from and how to safeguard them.

:::danger
Private keys are **security-critical**. They are **not stored by Cardinal**, are **shown only once**, and
**cannot be recovered** if lost — unless you saved a recovery key. Lose both and that owner's encrypted data
is **gone for good**.
:::

## How keys get initialized

- **Real end users** (patients, devices, and HCPs who are actual practitioners) initialize their **own**
  keys through **your application** — typically automatically the first time they log in via an
  [authentication process](/cockpit/authentication-processes).
- **The parent [organization](/cockpit/organization)'s** private key is initialized **automatically** during project creation,
  so the users that share through it can work immediately. See [Create project / Ready to go](/cockpit/create-your-first-project#6-ready-to-go).
- **Your own test/admin HCP** can be initialized manually in Cockpit (below).

A user's **Enrolment status** in the Users table tells you which state they're in — **Initialized** or
**Uninitialized**. See [Managing Users](/cockpit/managing-users).

## Initializing a key in Cockpit

For an HCP whose key isn't set up, **Users → the user's row → Initialize Private Key** generates one, and
optionally a **recovery key** at the same time.

:::caution
**Only do this for an HCP account you use yourself.** Cockpit is explicit: *"Real doctors and other HCPs must
generate and keep their own private keys when they start using your application."* For real users, let them
initialize their own keys through your app — don't generate keys for them here.
:::

Initializing fails if the HCP has no valid parent organization — fix the parent first. See
[Organization](/cockpit/organization).

## Private key vs recovery key

| | What it is | Lifecycle |
|---|---|---|
| **Private key** | required for the data owner to access encrypted data and create new data | generated once; **not stored by Cardinal**, **shown only once**, downloadable as `*.pem`, **can't be displayed again** |
| **Recovery key** | an optional backup that restores the private key if it's lost (the SDK stores the key pair encrypted on the iCure server so it can be recovered later) | can **only** be generated **together with** the private key; also **shown only once**, downloadable as `*.txt` |

:::caution
A recovery key can grant access to the private key, so **keep it secret**. Cockpit notes recovery keys are
best used for **demo purposes** — production apps should use a workflow that doesn't expose them to
intermediaries.
:::

When keys are generated (at project creation or manually), save them immediately — the dialog warns you'll
lose the private key if you close without downloading it. The parent organization's keys also appear on the
project-creation wizard's **Ready to go** step and in *Download all as \*.json*.

## Where to go next

- **[Organization](/cockpit/organization)** — why the parent organization's key matters for data sharing.
- **[Managing Users](/cockpit/managing-users)** — the enrolment status and the Initialize Private Key action.
- **[Authentication Processes](/cockpit/authentication-processes)** — how real end users get their keys on first login.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — the keys in your application's context.

> **Cardinal SDK reference:** **[Key management](/how-to/key-management)** and **[End-to-end encryption](/explanations/end-to-end-encryption/)** — how the SDK creates, stores, and recovers keys.
