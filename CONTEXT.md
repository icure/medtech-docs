# Cardinal documentation

Shared language for the Cardinal SDK and Cockpit documentation published at docs.icure.com, including who is
allowed to build applications against which data.

## Language

### Parties

**Software vendor**:
A Cardinal customer that owns a **Project** and ships an application built on it to its own users. It is the
"Client" of the iCure General Terms and Conditions and DPA.
_Avoid_: client, customer (when the meaning is "the company that builds on Cardinal")

**Project owner**:
The party that administers a **Project** in Cockpit, through Environment Access or project administration.
_Avoid_: account owner

**End user**:
A healthcare professional, patient or device user that exists inside a **Software vendor**'s **Project** and reaches
its data through that vendor's application. Same meaning as "End User" in the iCure DPA (§1.2).
_Avoid_: client, customer

### Applications

**Client application**:
Software that calls the Cardinal backend through the SDK or the REST API.
_Avoid_: client (alone)

**Own project**:
A **Project** whose **Project owner** is the person, or the organization of the person, building the **Client application**.

**Unauthorized client application**:
A **Client application** that an **End user**, or anyone acting for them (an AI assistant, an IT provider, a
freelance developer), builds to reach a **Software vendor**'s **Project** with end-user credentials, without the
**Project owner**'s explicit authorization. Applies to every kind of **End user**: healthcare professionals, practice
staff and patients alike.
_Avoid_: hacked client, rogue client

## Relationships

- A **Software vendor** is the **Project owner** of one or more **Projects**.
- A **Project** has many **End users**; an **End user** is never its **Project owner** by virtue of having credentials.
- iCure's contract (GT&C, DPA) binds the **Software vendor** only. An **End user** is bound by the terms they signed
  with the **Software vendor**, never directly by iCure's.
- Building a **Client application** is allowed against an **Own project**, or against another **Project** with the
  explicit authorization of its **Project owner**. Anything else is an **Unauthorized client application**.

## Example dialogue

> **Dev:** "A GP logs in to the MCP server with the credentials of their practice software. Is that their own project?"
> **Domain expert:** "No. Those credentials make them an **End user** of the **Software vendor**'s **Project**. Unless
> the vendor authorized it, what they build is an **Unauthorized client application**."
> **Dev:** "And if the same GP registers in Cockpit and creates a project for a side app?"
> **Domain expert:** "Then they are the **Project owner** and it's their **Own project**. Anything goes, within the
> Cardinal terms."

## Flagged ambiguities

- "Database" is the word AGENTS.md and the pages written for **End users** use for the data of a **Project**: "a
  database you own" means a database of an **Own project**. Keep **Project** for the Cockpit object and its project ID.
- "Client" was used both for the **Software vendor** (the company paying for Cardinal) and for the **Client
  application** (the software calling the backend). Resolved: say **Software vendor** for the company and **Client
  application** for the software.
