---
slug: /limits
sidebar_position: 2
title: Limits
---

# Limits

The limits you work within come from your **[Cardinal plan](https://cardinalsdk.com/en/pricing/)** —
Cockpit itself is free. On the **Free plan**:

| Limit | Free plan |
|-------|-----------|
| Projects per environment | **2** |
| Tenants per project | **5** |
| Healthcare professionals per project | **10** |
| Devices per project | **10** |
| Patients per project | **100** |
| Storage per project | **500 MB** of combined storage, shared by all users (see [Storage & Plans](/cockpit/storage-and-plans)) |

When you reach a cap, Cockpit disables the relevant action and prompts you to upgrade (e.g. *"You've reached
the Free plan limit of 5 tenants…"*). Paid tiers raise these limits; upgrades are arranged with the iCure
team, not in-app. See [Storage & Plans](/cockpit/storage-and-plans).

The three user caps count **across the whole project**, not per tenant — spreading users over more tenants
does not raise them. Each type is capped on its own, so reaching the 10-healthcare-professional cap still
leaves you able to add devices and patients. Two details are easy to miss:

- **Organisations count as healthcare professionals.** An organisation is an org-tagged healthcare party,
  so adding one consumes the same allowance, and reaching the cap disables both **Healthcare professional**
  and **Organisation** in the **Add** menu.
- **The caps are the same under every business model.** Like the Free storage quota — and unlike a paid
  allowance, which is calculated from the business model and the number of users it bills on — the user
  caps do not change when the model does. See [Storage & Plans](/cockpit/storage-and-plans).
- **The caps use live counts.** The user breakdown and storage charts lag by up to 24 hours, but the
  **Add** menu checks the current number of users; if that count can't be read, adding is blocked until
  it can.

**Projects and tenants are enforced by the platform** — on the Free plan the backend refuses a 3rd project
or a 6th tenant per project, so those caps hold regardless of what the interface allows. The **user caps
and storage allowance are enforced by the interface only**: Cockpit disables the action, but the
platform will not refuse a client that creates users or stores data past them. A project can therefore
exceed its storage allowance: Cockpit reports over 100 % used rather than blocking anything, and shows
the **plan-limits banner** under the header (with an indicator beside the account menu) for every limit the
environment is over — see [Storage & Plans](/cockpit/storage-and-plans#plan-limits).

:::caution

Because the user caps are not enforced when data is written, a client using the Cardinal SDK directly can
create users beyond them. Cockpit warns that *"If you store more data than your Free plan allows, some of
your data may be deleted."* Treat the caps as real limits even where the platform lets you past them.

:::

Other practical constraints worth knowing:

- **A project without a business model is treated as Per HCP.** You can still add users; the **Add**
  button's tooltip reminds you that the limits assume that model until you select one from
  **Configuration → Project overview**. A project that carries **more than one** business model can't add
  users at all until the conflict is resolved. See
  [Project Overview & Configuration](/cockpit/project-overview-and-configuration#business-model).
- **Bulk import is not available on the Free plan**, for any user type — users are added one at a time. See
  [Bulk import](/cockpit/bulk-import).
- **Multi → single-tenant** is only possible while a project has **exactly one** tenant. See
  [Managing Tenants](/cockpit/managing-tenants).
- **Demo setup** is limited to **200 emails** and has **no SMS**. See [Demo setup](/cockpit/external-services-demo-setup).
- **One authentication process per language** (and per channel and user type). See
  [Authentication Processes](/cockpit/authentication-processes).
- **Passwords are per-environment**; use a one-time code elsewhere. See [Authentication](/cockpit/authentication).

## Where to go next

- **[Storage & Plans](/cockpit/storage-and-plans)** — where limits are shown and how to upgrade.
- **[Cardinal pricing](https://cardinalsdk.com/en/pricing/)** — the tiers.
