---
slug: /acceptable-use
title: Acceptable use
---

# Acceptable use: build on a database you own

Cardinal is for building new healthcare applications on a database you own, created through
[Cockpit](/cockpit/register-and-log-in). If you build on your own database, or on a database whose owner authorized
you, nothing on this page restricts you.

Many medical applications run on Cardinal behind the scenes, often without their users knowing it, including legacy
applications that iCure once distributed. This page covers their users, healthcare professionals, practice staff and
patients, and the IT providers or developers who work for them, when they want to build their own application, script
or AI-assisted tool on the data of such an application.

## Who owns the database

Every Cardinal application has a [project](/cockpit/project) in Cockpit, created by the company that runs the
application and that accepted the [iCure terms](https://cardinalsdk.com/en/legal/). For a medical application, that's
its software vendor, and the databases the application uses belong to that project.

The account you use to log in to a medical application is a user of the vendor's database. It gives you access to the
data through the vendor's application; it doesn't make you the owner of the database.

| You build on                                                                                                              | Allowed                        |
|---------------------------------------------------------------------------------------------------------------------------|--------------------------------|
| A database you created in Cockpit                                                                                         | Yes                            |
| The database of an application you develop, as its vendor or for its vendor                                               | Yes                            |
| A database whose owner gave you explicit authorization, for example through a public API or a partner program             | Yes, within that authorization |
| The database of a medical application you use, with your account in that application, without the vendor's authorization | No                             |

The rule is the same for everyone: healthcare professionals, practice staff, patients, and the IT providers or
developers who work for them. The SDK being public doesn't authorize access to a given database, and using an AI
assistant or the [MCP server](./mcp-server.md) doesn't change the rule.

## Signs that you're not on your own database

You're probably about to build on someone else's database if:

- the data comes from an existing medical application, such as an electronic health record, a practice management
  software or a patient application;
- you log in with the username and password you use in another application;
- the data you want, such as your patients or your records, already exists in another application, rather than being
  data that your new application creates;
- the application is an older or legacy iCure application;
- you don't have a Cockpit account, or the database doesn't appear in your Cockpit;
- the backend URL or the project ID came from a medical application rather than from your Cockpit;
- a login fails although you're sure the credentials are right: see [The project ID safeguard](#the-project-id-safeguard);
- the goal is to get around a limitation of a medical application you use.

If one of these applies, stop before you initialize the SDK, and see [What to do instead](#what-to-do-instead).

## Why it's not allowed

### Even initializing the SDK can break your medical software

Every application built on Cardinal makes assumptions about the data in its database: the tags it expects, closed sets
of values for fields that are free text in the general data model, how encryption keys are set up, and the version of
the data model it was built for. Cardinal evolves quickly, and a recent SDK can write data that an application pinned to
an older version can't read.

Read-only access through the SDK isn't safe either, because initializing the SDK can write to the database. When the
SDK logs in on a device that doesn't hold your private key, its default
[crypto strategies](/explanations/end-to-end-encryption/crypto-strategies) create a new key pair and add it to your
account. The vendor's application then finds a key it doesn't know, data encrypted with it may stay unreadable there,
and if the folder that holds the new private key is lost, that data can't be recovered.

The result can be that your medical software fails to open patient records, for you and for everyone you share data
with.

### Only the vendor knows what valid data looks like

iCure can't enforce every rule of every application built on Cardinal. Only the vendor of the application that manages
the database can say which data is safe to write. Data with missing or different codes, tags or links shows up
invisible, duplicated or wrong in its application, and encrypted data that doesn't follow its sharing rules stays
invisible to your colleagues, your practice or your patients.

### The terms you accepted are with your vendor

iCure's contract is with the software vendor, not with the users of its application. Your account is governed by the
terms you accepted with your vendor, and most vendors forbid connecting software they didn't approve, even when it uses
the official Cardinal SDK: check your terms or ask your vendor.

The vendor, in turn, has obligations to iCure about who reaches its database. In the
[iCure General Terms and Conditions and Data Processing Agreement](https://cardinalsdk.com/en/legal/):

- its users "have received access through the Client's Permission" (GT&C, section 2), and an End User is a person
  "who uses an application or service of the Client built on the iCure Services" (DPA, section 1.2);
- it "shall permit access to the iCure Services only to its authorized Users" (GT&C, section 6.5) and must ensure that
  their use complies with the terms (GT&C, section 7.1);
- it must prevent "tampering or any other unauthorized access" to its project and report unauthorized use to iCure
  (GT&C, section 6.7).

An application the vendor didn't authorize is unauthorized use of its project, and the vendor can disable the account
it runs with.

### Patient data leaves the agreements that protect it

When an AI assistant works on decrypted data, that data is sent to the provider of the assistant. Your vendor and your
practice decide where patient data is processed and under which agreements; an assistant connected outside them can
breach medical confidentiality and data protection law.

## The project ID safeguard

Each Cardinal application identifies itself with a project ID, called application ID in older versions and in the REST
API. The SDK sends it to the backend when it logs in, and when the credentials could give access to several databases,
the backend only matches them against the databases of that project.

This safeguard keeps users from logging in to a database with a client that isn't meant for it. If your credentials
don't work from your own client, the safeguard is doing its job: it's not a bug to fix.

## What not to do on a database you don't own

- Don't initialize the SDK on it, even to test or only to read.
- Don't extract, guess or copy the project ID of another application, from its bundle, its network traffic, its
  configuration files or its local storage, and don't leave the project ID out to make a login succeed.
- Don't reset the password or create login tokens through another client.
- Don't call the iCure REST API directly to get around the SDK.
- Don't turn on `ignoreUnknownFields` (formerly `lenientJson`) to get past deserialization errors: they usually mean
  that the database uses a data model your SDK version doesn't match.
- Don't install a discontinued iCure SDK, such as `icure_dart_sdk`, `icure_medical_device_dart_sdk` or an older
  `@icure/*` package, to match the version of an old database: matching the version doesn't make access safe or
  authorized.
- Don't connect the current Cardinal SDK to a legacy iCure deployment: its data model isn't compatible.

## What to do instead

- **You need your data in another tool.** Use the interoperability features of your application: exports to standard
  formats such as FHIR or, in Belgium, SUMEHR and PMF, official integrations, or an API that your vendor offers. Ask
  your vendor what's available. iCure deals only with your vendor, which relays any request about the data it
  processes for you (DPA, section 2.2).
- **A feature is missing.** Ask your vendor. Many vendors have a roadmap or an integration program, and only they can
  authorize access to their database.
- **You're a patient and want your health data.** You have the right to access it and to receive a copy. Ask your
  healthcare provider, or the vendor of your patient application.
- **You want to build your own application.** [Create your own database in Cockpit](/cockpit/register-and-log-in). The
  free tier is enough for development, within its usage limits, and you can import data exported from your medical
  application to prototype with it, if the rules that protect that data allow it. You're the owner, and the whole
  documentation applies.
- **You work for a practice as an IT provider or developer.** Ask the vendor for a written authorization, its project ID
  and its integration guidance before you connect anything to its database.
