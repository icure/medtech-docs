---
slug: /authentication
sidebar_position: 4
title: Authentication
---

# Authentication

This page covers how **administrators** sign in to Cockpit and secure their account. It's distinct from how
your application's **end users** authenticate — that's the [authentication processes](/cockpit/authentication-processes) (email/SMS OTP)
you configure for self-registration and login.

## Logging in to Cockpit

The login page offers three ways in:

- **Email + one-time code** *(default)* — enter your email or mobile, **Request a one-time code**, then
  type the code we send.
- **Email + password** — **Login with password**, then username + password.
- **Google** — **Log in with Google**, using the Google account you registered with.

See [Register & Log In](/cockpit/register-and-log-in).

:::info
**Passwords are per-environment.** If you reuse the same email across [environments](/cockpit/environment), a password only
works for the environment where it was set — but you can always get in elsewhere with a one-time code.
:::

## Securing your account

From **Manage Account** (the account dropdown) you control your own credentials — see [Manage Account](/cockpit/manage-account):

- **Password** — set or change your password (minimum 10 characters).
- **2FA** — enable two-factor auth with an authenticator app: scan the QR code, then enter the verification
  code to confirm. You can disable it again later. (The 2FA tab appears once you have a password set.)

:::caution
Some safety-critical actions trigger a **Security Verification Required** step — you re-confirm with a
one-time code sent to your email (or your 2FA / password) before the action proceeds.
:::

## Authentication tokens (programmatic access)

Beyond interactive login, a [user](/cockpit/user) or administrator can hold **authentication tokens** for
**programmatic / API** access — found in the expanded row on the **Users** (or **Administrators**) page.
**Generate authentication token** takes a **Token name** and an **Expiration date and time**.

:::caution
A token's value is **shown only once** — *"You will not be able to access it again after you close this
modal."* Copy it immediately. Delete tokens you no longer need.
:::

## End-user authentication

Your application's patients, HCPs, and devices don't log in to Cockpit. They authenticate against your app
via **[authentication processes](/cockpit/authentication-processes)** — email or SMS one-time codes, configured per channel and user type.
OTP delivery requires a configured message gateway in [External Services](/cockpit/external-services-overview).

## Where to go next

- **[Manage Account](/cockpit/manage-account)** — the Password and 2FA tabs in context.
- **[Authentication Processes](/cockpit/authentication-processes)** — how end users register and log in to your app.
- **[Administrators & Access Levels](/cockpit/administrators-and-access-levels)** — who can do what once signed in.
- **[Recovery & Private Keys](/cockpit/recovery-and-private-keys)** — the encryption keys, separate from login credentials.

> **Cardinal SDK reference:** **[Initialize the SDK](/how-to/initialize-the-sdk/)**, **[Set up 2FA](/how-to/set-up-2fa)**, and **[Remember me](/how-to/remember-me)** — authenticating end users from your app.
