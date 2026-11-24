---
slug: /connect-an-ai-agent
sidebar_position: 9
title: Connect an AI Agent (MCP)
---

# Connect an AI Agent (MCP)

The **AI agent** tab of a [project](/cockpit/project)'s Configuration page gathers everything an AI assistant or
coding agent needs to work on that project through the [Cardinal MCP server](/mcp-server): the server entry
for your client, a dedicated **agent user** with its **authentication token**, and the values of the
`cardinal_init` call that logs the agent in. The same values initialise the Cardinal SDK in your own code.

The MCP server takes four values at login — `baseUrl`, `username`, `password` and `projectId`. This tab is
where each of them comes from.

## Where to find it

**Configuration → AI agent**, the tab right after **Project overview**. It can be linked directly:
`/configuration/<id>?tab=aiAgent`.

The tab is a three-step walk — **Add the MCP server to your client**, **Create the agent user and token**,
**Initialise the agent** — with **Back** / **Next** buttons. The steps are not gated: you can open step 3
before step 2 to read the values, and what you typed in one step is kept while you visit the others.

<!-- TODO(screenshot): configuration/ai-agent-steps — the AI agent tab with its three steps, opened on
     "Add the MCP server to your client". -->

## 1. Add the MCP server to your client

The server entry is the same for every project: **it never holds credentials**. Pick your **MCP client** and
copy the snippet:

| Client | What you copy |
|--------|---------------|
| **Claude Code** | the `claude mcp add cardinal -- npx -y @icure/cardinal-mcp-server` command |
| **Other clients (.mcp.json)** | the `mcpServers` entry, for any client that reads that format |

Codex, Cursor, VS Code and agents you build yourself are covered on the [MCP Server](/mcp-server) page.

## 2. Create the agent user and token

The agent logs in as a regular [user](/cockpit/user) of the project, so that what it may read and write is
decided by that user's roles — not by yours.

| Field | What it is |
|-------|------------|
| **Tenant** | **multi-tenant projects only** — the [tenant](/cockpit/tenant) the agent user lives in. Nothing can be created until one is chosen. A single-tenant project uses its only tenant. |
| **The agent signs in as** | **Healthcare professional** (the default) or **Patient**. |
| **Agent user** | **Create a new agent user** or **Use an existing user** of the chosen type, found by name or e-mail (3 characters minimum). |
| **Name**, **Email** | for a new user. A new **Patient** also needs a **Parent organization**. |
| **Token name** | the name the token is listed under on the user. |
| **Token expires on** | 7 days from now by default. |

**Create agent user and token** (or **Generate token**, for an existing user) then shows, once:

- **Username** — `<tenant group id>/<user id>`, the form that identifies the user without ambiguity.
- **Authentication token (password)** — the value to pass as `password`.

**Download as JSON** saves the complete `cardinal_init` arguments as `cardinal-init.json`. **Done** clears
the token from the page.

:::caution
The token is **shown only once** and cannot be retrieved later: copy or download it before you press
**Done** or leave the tab. If you lose it, generate a new one for the same user with **Use an existing
user** — and delete the old one from the user's row (see [Managing Users](/cockpit/managing-users)).
:::

:::info
The agent's permissions follow the **default roles** of the chosen user type — review them on the
[Roles](/cockpit/roles-and-permissions) tab before handing the token over. A new agent user also counts
like any other user: toward the user limits of the Free plan, and toward invoicing when the project's
[business model](/cockpit/project-overview-and-configuration#business-model) bills on that user type.
:::

<!-- TODO(screenshot): configuration/ai-agent-credentials — step 2 after creation: the "shown only once"
     warning, the Username and Authentication token fields, Download as JSON and Done. -->

## 3. Initialise the agent

The last step lists the values for the agent's `cardinal_init` call:

| Value | `cardinal_init` argument | Where it comes from |
|-------|--------------------------|---------------------|
| **Backend URL (baseUrl)** | `baseUrl` | the **Backend** choice below |
| **Project ID (projectId)** | `projectId` | the project's **Project ID (set up by you)** — if the project has none yet, set it on the [Project overview](/cockpit/project-overview-and-configuration) |
| Username | `username` | step 2 |
| Authentication token | `password` | step 2 |

Below them, the ready-to-paste block comes in two **formats**: the **cardinal_init arguments** as JSON, or a
**Prompt for the agent** — a sentence you paste into the conversation. Until step 2 is done they carry
`<username>` and `<token>` placeholders.

### Choosing the backend

- **Production (recommended)** — `https://api.icure.cloud`, the stable backend.
- **Preview** — the backend this Cockpit itself talks to. It receives changes earlier.

:::caution
On the **Preview** backend *"some features … may be experimental. Do not use it on real data."*
:::

:::caution
The MCP server stores the agent user's **private keys** in its `storageDir` (by default
`./cardinal-mcp-storage`, relative to where the server was started). Keep that directory outside your
repository and do not commit it.
:::

<!-- TODO(screenshot): configuration/ai-agent-initialise — step 3: the Backend choice, Backend URL and
     Project ID fields, and the cardinal_init arguments block. -->

## Good practice

- **One user per agent.** A dedicated user keeps the agent's actions distinguishable from a person's, and
  lets you cut its access by deleting its token or disabling the user.
- **Least privilege.** Give the agent's user type only the roles the job needs, and never log an agent in
  as an administrator.
- **Short-lived tokens.** Keep the expiry close to the length of the work, and generate a new token rather
  than a long one.
- **Your own data only.** Log in to a database you own or are authorised to use — see
  [Acceptable use](/acceptable-use).

## Where to go next

- **[MCP Server](/mcp-server)** — what the server offers, every supported client, and how the assistant uses
  `cardinal_init`.
- **[Roles & Permissions](/cockpit/roles-and-permissions)** — what the agent user is allowed to do.
- **[Managing Users](/cockpit/managing-users)** — the agent user's row: its tokens, status and deletion.
- **[Initialize the Cardinal SDK](/cockpit/initialize-the-cardinal-sdk)** — the same values in your own code.

> **Cardinal SDK reference:** the agent user is a `User` linked to a `HealthcareParty` or `Patient` data
> owner; the token is one of its `authenticationTokens`, and logging in with it is
> [authentication with a login token](/how-to/initialize-the-sdk/#username--login-token).
