---
slug: /transfer-ownership
sidebar_position: 8
title: Transfer ownership
---

# Transfer ownership

**Transfer ownership** moves a whole [project](/cockpit/project) — its tenants, HCPs, patients, devices, and all their
data — from your [Environment](/cockpit/environment) into **another environment**. It's how you hand a project to a different
account while keeping the data intact.

:::danger
**This is effectively one-way.** Once transferred, the project belongs to the target environment:
*"You cannot undo this action. Only the Environment Access Administrator of the target environment will be able [to]
change it back."* The only way to reverse it is for the **new owner to transfer it back to you** — by the
same procedure, with the roles reversed.
:::

The move is authorised by a one-time **operation token** that the **receiving** environment generates and
hands to you. So the two sides cooperate:

- **Receiving environment** (the new owner) — generates the token.
- **Source environment** (you, the current owner) — pastes it in to perform the transfer.

:::caution
Both sides need **Environment Access**. Generating the token and running the transfer are each restricted to
administrators with Environment Access — a Project-Access admin sees *"This action is restricted to
administrators with 'Environment Access'."* See [Administrators & Access Levels](/cockpit/administrators-and-access-levels).
:::

## Step by step

### 1. The receiving environment generates an operation token

The Environment-Access admin of the **target** environment opens **Manage environment → Operation tokens**
(*"Import External Projects into Your Environment"*) and clicks **Generate operation token**, providing:

- **Description** — a label for the token.
- **Operation** — **Transfer group ownership** (the available operation).
- **Expiration date and time** — when the token stops working.

The generated **operation token** is shown once to copy. **Each token is valid for one transfer only.**

<!-- TODO(screenshot): manage-environment/operation-tokens — the Operation tokens tab with "Generate
     operation token" and the Active operation tokens table. -->

### 2. They share the token with you

The token can be shared through **any method the administrator chooses** — it authorises this single
transfer, into their environment.

### 3. You run the transfer from the project's Danger zone

In the project you want to move, open **Configuration → [Danger zone](/cockpit/danger-zone) → Transfer ownership**. The
modal (*"Transfer the \<project> project to a new environment"*) walks two steps:

1. Paste the **Operation token** and click **Find environment** — Cockpit reads the token and shows the
   **target environment** it points to.
2. Confirm: *"Are you absolutely sure you want to transfer the ownership of the project … to the environment
   of …"* — then **Transfer project**.

The project, with everything in it, now lives in the target environment.

<!-- TODO(screenshot): configuration/transfer-ownership — the Transfer ownership modal showing the
     operation-token field and the confirmation step with the target environment. -->

## What happens under the hood

A project is a Cardinal [Group](/how-to/manage-a-multi-group-environment); transferring it **re-parents that group** to the target environment's
group. The operation token is a **short-lived, single-use** credential (stored as a hash, scoped to the
*Transfer group ownership* operation) that the SDK requires to authorise the move — the receiving side
creates it (`getOperationTokenForGroup`), and the transfer changes the project's parent group
(`changeSuperGroup`). This is the same mechanism Cockpit surfaces as **operation tokens** on the
[Environment](/cockpit/environment) page.

## Where to go next

- **[Environment](/cockpit/environment)** — operation tokens and what an Environment contains.
- **[Danger Zone](/cockpit/danger-zone)** — the other irreversible project/tenant actions.
- **[Administrators & Access Levels](/cockpit/administrators-and-access-levels)** — why both sides need Environment Access.

> **Cardinal SDK reference:** a project is a [`Group`](/how-to/manage-a-multi-group-environment); transferring it re-parents that group (operation tokens + `changeSuperGroup`).
