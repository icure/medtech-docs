---
slug: /auto-delegation
sidebar_position: 6
title: Auto-delegation
---

# Auto-delegation

iCure data is **end-to-end encrypted**, so by default a record is readable **only by the [data owner](/explanations/data-model/#data-owners)
who created it**. When a user creates data, they can **share it with other data owners** — either right away
or later on. Sharing is per-record and optional; auto-delegation is **not** required in order to share.

**Auto-delegation** is for the case where a user should **systematically share everything they create** with
the same data owner(s). It's a standing rule — *"whenever this user creates new data, also share it with
these data owners"* — so you don't have to share each record by hand. Reach for it only when that
always-share behaviour is genuinely what you want.

In the Cardinal SDK this is the **`User.autoDelegations`** field — *"Delegations that are automatically
generated client side when a new database object is created by this user."*

:::info
Cardinal SDK reference: **[`Auto-delegations`](/how-to/basic-operations/#auto-delegations)**.
:::

## How it works

`autoDelegations` maps a **data category** to a **list of data owner ids**:

```
autoDelegations: { [DelegationTag]: [dataOwnerId, …] }
```

- When the user creates an entity (a contact, health element, patient, …), the SDK **shares that new
  entity** with the listed data owners — for each **category** they're listed under.
- The ids are **data owner ids** — HCP / [organization](/cockpit/organization) / [patient](/explanations/data-model/patient) / [device](/explanations/data-model/device) ids, *not* User
  ids. See [User](/cockpit/user) and [HCP · Patient · Device](/cockpit/hcp-patient-device).

:::info
Auto-delegation applies to data the user creates **from then on** — it's evaluated **at creation time**, so
it doesn't retroactively share records that already existed when the delegation was added.
:::

### Data categories

When you add an auto-delegation, Cockpit asks for one or more **Categories**. **Use `All`** — it covers every
category, so all data the user creates is shared with the delegate.

:::caution
The **Categories** dropdown also lists finer-grained tags — broad buckets (**MedicalInformation**,
**AdministrativeData**, **FinancialInformation**, …) and specific medical items (**CdItemMedication**,
**CdItemLab**, **CdItemDiagnosis**, …) — but **only `All` is currently supported** in practice. Pick `All`;
the narrower categories are exposed but not yet reliably honoured.
:::

:::caution
The delegate must be able to receive the data: **the target data owner needs an initialized key pair.** Until
that key is set up, the SDK can't share with them, so the user **can't create encrypted data for this
delegation** — it starts working as soon as the delegate initializes their key. See
[Recovery & Private Keys](/cockpit/recovery-and-private-keys).
:::

## Where auto-delegations come from

### Set automatically by a registration process

The most common case. A registration [authentication process](/cockpit/authentication-processes) has a **Create auto delegation to parent
organisation** toggle: *"Auto delegation allows healthcare professionals within the same tenant to access
and decrypt data of the users created through this process. To enable it, make sure a parent organization is
selected."*

So every user registered through that process gets an auto-delegation **to the parent [organization](/cockpit/organization)** —
which is how *"healthcare professionals with the same parent can access and decrypt user data."* See
[Authentication Processes (setup)](/cockpit/authentication-processes-setup).

:::caution
This relies on the **parent organisation's private key being initialized.** Until that key is set up, users
registered through this process **can't create encrypted data** — there's no parent key to encrypt it for.
They'll be able to as soon as the parent's key is initialized. Cockpit warns: *"With auto-delegation enabled,
users registered through this process can't create encrypted data because the parent has no key to decrypt
it."* The Processes table's **Parent enrolment status** flags this. See [Organization](/cockpit/organization)
and [Recovery & Private Keys](/cockpit/recovery-and-private-keys).
:::

### Managed manually per user

You can also view and edit a user's auto-delegations directly: **Users → expand the user's row → Auto
delegations**. Each entry reads as *category → delegate*. **Add auto delegation** asks for:

- **Categories** — the data to share; use [`All`](#data-categories).
- **Delegate** — the data owner to share with (search for a healthcare party).

A delegate in a single category has one delete button; a delegate in **multiple categories** has two — remove
them from that one category, or from all categories at once.

:::danger
A warning icon means the delegate has **no initialized key**. Until that delegate sets up their key, the user
**can't create encrypted data for this delegation** — there's no delegate key to share it with. It starts
working once the delegate initializes their key by logging in through your app — or you can remove the
delegation. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys).
:::

<!-- TODO(screenshot): users/auto-delegations — an expanded user row showing the Auto delegations list (with a
     key-not-initialized warning) and the "Add auto delegation" modal (Categories + Delegate). -->

You can remove a delegate from a single category or from all categories. See [Managing Users](/cockpit/managing-users).

<!-- TODO(screenshot): users/auto-delegations — an expanded user row showing the Auto delegations list and
     the "Add auto delegation" modal (Categories + Delegate). -->

## Where to go next

- **[Organization](/cockpit/organization)** — the parent organisation that auto-delegation usually targets.
- **[Recovery & Private Keys](/cockpit/recovery-and-private-keys)** — why the delegate needs an initialized key.
- **[Authentication Processes (setup)](/cockpit/authentication-processes-setup)** — the auto-delegation-to-parent toggle.
- **[Managing Users](/cockpit/managing-users)** — managing a user's auto-delegations in the expanded row.

> Cardinal SDK reference: **[`Auto-delegations`](/how-to/basic-operations/#auto-delegations)**.
