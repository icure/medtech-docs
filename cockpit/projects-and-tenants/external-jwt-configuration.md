---
slug: /external-jwt-configuration
sidebar_position: 5
title: External JWT Configuration
---

# External JWT Configuration

**External JWT** lets your application authenticate iCure users with **JWTs issued by your own / a
third-party identity provider** instead of iCure's built-in login. As the **External JWT** tab explains:
*"Configure authentication with externally issued JWTs. Each configuration defines how the token is
validated and which JWT field is used to identify the corresponding iCure user. This feature is available
at both the Project and Tenant levels."*

So each configuration answers two questions: **how is the token's signature verified**, and **which iCure
user does it map to**.

## Where to find it

- **Project level** — **Configuration → External JWT**.
- **Tenant level** — **Tenants → \[tenant] → External JWT**.

The table is titled *"External JWT Configurations of the \<group>"* and lists each config's
**Configuration key**, **Validation method**, **User matching field**, and **Authentication class**.

## Adding a configuration

Click **Add configuration** to open **Add external JWT configuration**:

**Identity**
- **Configuration Key** — a unique key identifying this configuration within the group. **Fixed after
  creation** (to change it, delete and recreate).

**Validation method** — *how the JWT signature is verified*:
- **Public Key** — paste a PEM/Base64 **Public Key**; optionally set a **Signature Algorithm** (RS/ES/PS
  256–512), otherwise the JWT header's algorithm is used.
- **OIDC Discovery** — give an **Issuer Location** (the OIDC issuer URL); the JWKS is fetched from there.
- Either method may set an optional **Client Id**, checked against the JWT's audience claim.

**User matching** — *which iCure user the token represents*:
- **User matching field** — the iCure field the claim is matched against: **LocalId**, **Email**,
  **MobilePhone**, **Username**, or **Identifier**.
- **JWT Claim Name** — the claim holding that identifier value.
- **Identifier Assigner** — only when matching on **Identifier**: the assigner system for it.

**Session**
- **Authentication Class** — the assurance level granted to sessions created via this config (strongest →
  weakest: DigitalId, TwoFactorAuthentication, ShortLivedToken, ExternalAuthentication, Password,
  LongLivedToken).

<!-- TODO(screenshot): configuration/external-jwt — the Add external JWT configuration modal showing the
     validation method and user-matching fields. -->

## Managing configurations

Per row you can **Edit configuration**, **Delete configuration**, and move it within the project —
**Transfer to another group** (move) or **Duplicate in another group** (copy to one or more groups).
Expanding a row shows the details (public key, algorithm, client id, issuer location, claim name, identifier
assigner).

:::info
This mirrors how [custom properties](/cockpit/custom-properties) and [processes](/cockpit/authentication-processes) move between a project and its tenants — transfer
moves the single config, duplicate copies it to the destinations you pick.
:::

## Where to go next

- **[Authentication Processes (setup)](/cockpit/authentication-processes-setup)** — iCure's own email/SMS OTP login (the alternative to external
  JWT).
- **[Project Overview & Configuration](/cockpit/project-overview-and-configuration)** — the rest of the Configuration tabs.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — authenticating your application's users.

> **Cardinal SDK reference:** **[Initialize the SDK](/how-to/initialize-the-sdk/)** — authenticating your app, including external-token flows.
