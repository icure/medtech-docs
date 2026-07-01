---
slug: /organization
sidebar_position: 5
title: Organization
---

# Organization

An **Organization** is a user that represents a **company or clinic** rather than a person — a hospital, a
practice, your own company. It plays two distinct roles in Cockpit:

1. it's a **user type** you can create alongside HCPs, patients, and devices; and
2. it's typically the **parent organization** — the entity that holds the **key used to share data**
   between your users.

:::info
**In the Cardinal SDK, an Organization is a [HealthcareParty](/explanations/data-model/healthcareparty)** — the *same* entity type as an
[HCP](/cockpit/hcp-patient-device), with the same permissions. The only difference is that it stands for a non-person party. Cockpit
tags it as an organization and gives it its own create/edit form, list icon, and the *"is organisation"*
flag.
:::

## Organization vs HCP

They're the same underlying entity, created from two different buttons on the **Users** page (**Add →
Organization** or **Add → Healthcare professional**):

|                  | Organization                                           | HCP                                             |
|------------------|--------------------------------------------------------|-------------------------------------------------|
| **Represents**   | a company / clinic (non-person)                        | an individual healthcare professional           |
| **Name fields**  | a single **Name**                                      | **First name** + **Last name**                  |
| **Other fields** | Email, Mobile phone, Parent organization, Roles        | Email, Mobile phone, Parent organization, Roles |
| **Typical use**  | the **parent organization** that holds the sharing key | an end user who reads/writes data               |

:::info
Choose **Organization** for non-person entities (hospitals, clinics, companies) and **HCP** for individual
practitioners. An Organization is **not a mandatory parent** of your other users — it's just another user
type that happens to be well-suited to the parent role.
:::

## The parent organization (data sharing)

iCure data is **end-to-end encrypted**, so for one user to read another's data they must share through a
common key. The **parent organization** is the party that **holds that key**. Point your users at a parent
organization and Cardinal Sdk wires up the secure sharing between them automatically.

- Assigning a parent is done per user: every user form (HCP, patient, device, and even an organization) has
  a **Parent organization** field.
- For a **patient it's required** — you **can't create a patient without choosing a parent organization**,
  since a patient needs one to share their data through. For HCPs, devices, and organizations the field is
  optional.

This is why the create-project wizard offers to create a parent organization for you whenever your
questionnaire answers imply users share data (the **Responsible organization** step) — see
[Create Your First Project](/cockpit/create-your-first-project).

## The parent organization's private key must be initialized

iCure data is end-to-end encrypted, so every user that reads or writes data is a **data owner** with its
own **key pair**. Having a private key is what the SDK calls *initializing* the key — until a data owner's
key pair exists, that owner can't encrypt or decrypt anything.

This matters most for the **parent organization**, because its users share data *through* it. **Until the
parent organization's private key is initialized, every user that has this organization as their parent
cannot create or access any encrypted data** — with auto-delegation, the users are registered under a
parent that has no key to decrypt their data. As Cockpit puts it:

:::caution
The parent HCP does not have an initialized private key. Auto delegation will not work until the private
key is set up. In addition, users created through this process will not be able to create or access
encrypted data. Please initialize the private key of this HCP in the Users section, or ask the HCP to log
in to the application — their keys will be initialized automatically.
:::

This is exactly why the create-project wizard **initializes the parent organization's private key
automatically** when it creates the organization for you — so the users you go on to create can work right
away.

## Initializing keys from Cockpit

You can also initialize an HCP's keys manually in Cockpit: **Users → the user's row → overflow menu →
Initialize Private Key**. You may optionally generate a **recovery key** at the same time.

:::caution
**Only do this for an HCP account you use yourself** (e.g. a test or admin HCP). Cockpit warns:
*"Real doctors and other HCPs must generate and keep their own private keys when they start using your
application."* For real end users, **don't** generate keys here — let them initialize their own keys
through **your application's** interface; their keys are created automatically the first time they log in.
:::

(Initializing fails with a clear error if the HCP has no valid parent organization — fix the parent first.)

## Private key vs recovery key

- **Private key** — *required* for the data owner to access encrypted data and create new data. It's
  **generated automatically** for the parent organization during project creation. It is **not stored by
  Cardinal**, is **shown only once**, is **downloadable** (`*.pem`), and **cannot be displayed again** —
  lose it with no recovery key and the encrypted data is **unrecoverable**.
- **Recovery key** — an *optional* backup that lets you restore the private key if it's lost (the SDK stores
  the key pair encrypted on the iCure server so it can be recovered later). It can **only be generated at
  the same time** as the private key, is also **shown only once**, and is downloadable (`*.txt`). Because a
  recovery key can give access to the private key, **keep it secret**; Cockpit notes recovery keys are best
  used for **demo purposes** — production apps should use a workflow that doesn't expose them to
  intermediaries.

The parent organization's keys also appear on the wizard's **Ready to go** step (and in
*Download all as \*.json*) — save them there. See [Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk) and
[Recovery & Private Keys](/cockpit/recovery-and-private-keys).

## Finding the organization's ID

When your app references a parent organization, it uses the organization's **HCP ID** (its
**Healthcare party ID**) as the `parentOrganizationId`. You'll find it:

- on the wizard's **Ready to go** step, in the **Parent organization** table (labelled **HCP ID**); and
- later, by expanding the organization's row in the **Users** table (**Healthcare party ID**).

A user that points at a parent shows that value as its **Parent ID**.

:::caution
**Broken reference warning.** If a user references a parent organization ID that no longer exists, Cockpit
flags it with a red **critical issue** tag in the Users table: *"This user references a parent
organization that doesn't exist in this environment. Edit the user and set a valid parent organization."*
:::

<!-- TODO(screenshot): users/organization-row — an expanded organization row in the Users table showing
     "Healthcare party ID" with its copy button. -->

## Where it fits

| Concept                            | What it is                                                           | In the Cardinal SDK                             |
|------------------------------------|----------------------------------------------------------------------|-------------------------------------------------|
| **Organization**                   | a company/clinic user; usually the parent that holds the sharing key | a `HealthcareParty` (tagged as an organisation) |
| **[HCP](/cockpit/hcp-patient-device)**                       | an individual healthcare professional                                | a `HealthcareParty`                             |
| **[Patient](/explanations/data-model/patient)** / **[Device](/explanations/data-model/device)** | end users / subjects of care                                         | `Patient` / `Device`                            |

## Where to go next

- **[HCP · Patient · Device](/cockpit/hcp-patient-device)** — the other end-user entity types.
- **[Create Your First Project](/cockpit/create-your-first-project)** — the wizard's Responsible organization step.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — using the organization's HCP ID as `parentOrganizationId`.
- **[Recovery & Private Keys](/cockpit/recovery-and-private-keys)** — safeguarding the private and recovery keys.

> **Cardinal SDK reference:** an Organization is a [`HealthcareParty`](/explanations/data-model/healthcareparty) in the Cardinal data model.
