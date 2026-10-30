---
slug: /acceptable-use
title: Acceptable use
---

# Acceptable use: build on a project you own

Cardinal is made for developers and companies that build healthcare applications. If you build on a
[project](/cockpit/project) you created in Cockpit, or on a project whose owner authorized you, nothing on this page
restricts you.

This page covers another situation: you use a medical application built on Cardinal, as a healthcare professional,
practice staff, a patient, or someone working for one of them, and you want to build your own application, script or
AI-assisted tool on the data of that application.

## Who owns the project

Every Cardinal application runs on a project, and every project has an owner: the company that created it in Cockpit
and accepted the [iCure terms](https://cardinalsdk.com/en/legal/). For a medical application, that's its software
vendor.

The account you use to log in to a medical application is a user of the vendor's project. It gives you access to the
data through the vendor's application; it doesn't make you the owner of the project.

| You build on                                                                                                          | Allowed                         |
|-----------------------------------------------------------------------------------------------------------------------|---------------------------------|
| A project you created in Cockpit                                                                                      | Yes                             |
| A project whose owner gave you explicit authorization, for example through a public API or a partner program          | Yes, within that authorization  |
| The project of a medical application you use, with your account in that application, without the vendor's authorization | No                              |

The rule is the same for everyone: healthcare professionals, practice staff, patients, and the IT providers or
developers who work for them. Using an AI assistant or the [MCP server](./mcp-server.md) doesn't change it.

## Why it's not allowed

### The terms you accepted are with your vendor

iCure's contract is with the software vendor, not with the users of its application. Your account is governed by the
terms you accepted with your vendor, and most vendors forbid connecting software they didn't approve: check your
terms or ask your vendor.

The vendor, in turn, has obligations to iCure about who reaches its project. In the
[iCure General Terms and Conditions and Data Processing Agreement](https://cardinalsdk.com/en/legal/):

- its users "have received access through the Client's Permission" (GT&C, section 2), and an End User is a person
  "who uses an application or service of the Client built on the iCure Services" (DPA, section 1.2);
- it "shall permit access to the iCure Services only to its authorized Users" (GT&C, section 6.5) and must ensure that
  their use complies with the terms (GT&C, section 7.1);
- it must prevent "tampering or any other unauthorized access" to its project and report unauthorized use to iCure
  (GT&C, section 6.7).

An application the vendor didn't authorize is unauthorized use of its project, and the vendor can disable the account
it runs with.

### It can corrupt the data you and your colleagues rely on

A medical application relies on conventions you don't see in the data: which entities it creates, who it shares them
with, which codes and tags it uses, and how it manages encryption keys. Software written without knowing them can
damage the data of the vendor's application, for you and for everyone you work with:

- **Encryption keys.** When the SDK logs in on a device that doesn't hold your private key, its default
  [crypto strategies](/explanations/end-to-end-encryption/crypto-strategies) create a new key pair and add it to your
  account. The vendor's application then finds an unknown key on your account, data encrypted with it may stay
  unreadable there, and if the folder that holds the new private key is lost, that data can't be recovered.
- **Sharing.** Encrypted data is readable only by the data owners it's shared with. Data that doesn't follow the
  vendor's sharing rules stays invisible to your colleagues, your practice or your patients.
- **Data model.** Missing or different codes, tags or links make records invisible, duplicated or wrong in the
  vendor's application.

### Patient data leaves the agreements that protect it

When an AI assistant works on decrypted data, that data is sent to the provider of the assistant. Your vendor and your
practice decide where patient data is processed and under which agreements; an assistant connected outside them can
breach medical confidentiality and data protection law.

## What to do instead

- **A feature is missing.** Ask your vendor. Many vendors have a roadmap, an integration program or an API for third
  parties, and only they can authorize access to their project.
- **You need your data in another tool.** Ask your vendor for an export. iCure deals only with your vendor, which
  relays any request about the data it processes for you (DPA, section 2.2).
- **You're a patient and want your health data.** You have the right to access it and to receive a copy. Ask your
  healthcare provider, or the vendor of your patient application.
- **You want to build your own application.** [Create your own project in Cockpit](/cockpit/register-and-log-in).
  You're its owner, and the whole documentation applies.
- **You work for a practice as an IT provider or developer.** Get the vendor's written authorization before you connect
  anything to its project.

## Signs that you're not on your own project

Before you write or run code against a Cardinal backend, check where your credentials come from. You're probably on
someone else's project if:

- the username and password are the ones you use to log in to your medical software, practice software or patient
  application;
- you don't have a Cockpit account, or the project doesn't appear in your Cockpit;
- the backend URL or the project ID came from a medical application rather than from your Cockpit;
- the goal is to get around a limitation of a medical application you use.

If one of these applies, ask the project owner for authorization first, or create your own project.
