---
slug: /auto-delegation
sidebar_position: 6
title: Auto-delegation
---

# Auto-delegation

iCure data is **end-to-end encrypted**, so by default a record is readable **only by the [data owner](/explanations/data-model/#data-owners)
who created it**. **Auto-delegation** is how that data becomes readable by *others* automatically: it's a
standing rule that says *"whenever this user creates new data, also share it with these data owners."*
Without it, every record would have to be shared by hand.

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

### Data categories (DelegationTag)

A delegation is tagged with a **category**, so you can share some kinds of data without sharing everything.
The SDK's `DelegationTag` *"enumerates the categories of medical data that can be used to tag delegations,
controlling access to specific types of information."* They range from broad to specific:

- **All** — every category.
- Broad buckets — **AdministrativeData**, **GeneralInformation**, **FinancialInformation**,
  **MedicalInformation**, **SensitiveInformation**, **ConfidentialInformation**,
  **AnonymousMedicalInformation**.
- Fine-grained medical items — e.g. **CdItemMedication**, **CdItemLab**, **CdItemDiagnosis**,
  **CdItemAllergy**, **CdItemVaccine**, **CdItemTreatment**, … (and more).

:::caution
The delegate must be able to receive the data: **the target data owner needs an initialized key pair.** The
SDK verifies the delegate's public key before creating a delegation — if the delegate has no key, sharing
**fails**. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys).
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
This relies on the **parent organisation's private key being initialized.** If it isn't, Cockpit warns:
*"With auto-delegation enabled, users registered through this process can't create encrypted data because
the parent has no key to decrypt it."* The Processes table's **Parent enrolment status** flags this. See
[Organization](/cockpit/organization) and [Recovery & Private Keys](/cockpit/recovery-and-private-keys).
:::

### Managed manually per user

You can also view and edit a user's auto-delegations directly: **Users → expand the user's row → Auto
delegations**. Each entry reads as *category → delegate*. **Add auto delegation** asks for:

- **Categories** — one or more [data categories](#data-categories-delegationtag) to share.
- **Delegate** — the data owner to share with (search for a healthcare party).

A delegate in a single category has one delete button; a delegate in **multiple categories** has two — remove
them from that one category, or from all categories at once.

:::danger
A warning icon means the delegate has **no initialized key**. Data can't be shared with them, so any data the
user creates for this delegation won't be saved. It's resolved once the delegate initializes their key by
logging in through your app — or by removing the delegation. See [Recovery & Private Keys](/cockpit/recovery-and-private-keys).
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
