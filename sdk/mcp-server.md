---
slug: /mcp-server
title: MCP Server
---

# MCP Server

`@icure/cardinal-mcp-server` is a [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for the
Cardinal SDK. MCP is the open standard that AI assistants and coding agents use to call external tools: connect the
server once, and Claude, Codex, Cursor, GitHub Copilot or an agent you build yourself can:

- search and read the Cardinal SDK documentation (APIs, models, filters, tutorials and how-to guides), with no
  account needed;
- call the TypeScript SDK against a Cardinal backend on your behalf, after you log in with `cardinal_init`.

The server runs locally, on your machine, and talks to the assistant over stdio. It is published on
[npm](https://www.npmjs.com/package/@icure/cardinal-mcp-server) and its source lives in the
[`cardinal-mcp-server`](https://github.com/icure/cardinal-sdk/tree/main/cardinal-mcp-server) folder of the SDK
repository.

## Why use it

- **Answers that match your SDK version.** A model only knows what was in its training data: it may not know the
  Cardinal SDK, or know an older version of it, and then writes calls to methods that look plausible but do not
  exist. The server gives the assistant the documentation and the method signatures of the exact SDK release it was
  generated from, so the assistant looks them up instead of guessing.
- **The whole documentation, on demand.** The assistant searches every method of every API, the models, the filter
  factories and the guides, and reads only the pages it needs. You no longer paste documentation into the
  conversation.
- **Try a call before you write the code.** Once logged in, the assistant runs real SDK calls against a backend:
  check what a filter returns, look at an entity as the SDK decrypts it, inspect the keys of a data owner, or
  reproduce a bug step by step.
- **The same SDK as your application.** Calls go through `@icure/cardinal-sdk`, running on your machine: encryption,
  decryption and access control behave as they do in your own code.
- **One server for every assistant.** Any MCP client that can start a local process works with it, whether it is a
  coding agent in your terminal or IDE, a desktop assistant, or an agent you build with the Claude Agent SDK or the
  OpenAI Agents SDK.

## Requirements

- Node.js 24 or later (`npx` comes with it). Since version 2.14.0 the server depends on a Cardinal SDK that requires
  Node.js 24, see [Migration](./migration.md#2140). Versions up to 2.13 run on Node.js 20.
- For the operational tools only: the URL of a Cardinal backend (for example `https://api.icure.cloud`) and the
  login and password of a user in it.

The version of the server follows the SDK version it was generated from: `@icure/cardinal-mcp-server@2.14.0` serves
the documentation and the method surface of SDK 2.14.0. The commands below always start the latest release; to make
the assistant see the SDK version your project uses, replace the package name with
`@icure/cardinal-mcp-server@<version>`.

:::tip First start

The first time it runs, `npx` downloads the server and the Cardinal SDK, which takes longer than later starts. If a
client gives up waiting for the server, raise its startup timeout, or install the server once with
`npm install -g @icure/cardinal-mcp-server` and use `cardinal-mcp-server` as the command, with no arguments.

:::

## Connect Claude

### Claude Code

From the project where you want the server available:

```bash
claude mcp add cardinal -- npx -y @icure/cardinal-mcp-server
```

The default scope is `local`: the server is available to you, in this project only. Two other scopes exist:

```bash
# Everyone who clones the repository: writes .mcp.json at the repository root, commit it
claude mcp add --scope project cardinal -- npx -y @icure/cardinal-mcp-server

# You, in every project
claude mcp add --scope user cardinal -- npx -y @icure/cardinal-mcp-server
```

The project scope produces this `.mcp.json`, which you can also write by hand:

```json
{
  "mcpServers": {
    "cardinal": {
      "command": "npx",
      "args": ["-y", "@icure/cardinal-mcp-server"]
    }
  }
}
```

Check the connection with `claude mcp list`, or `/mcp` inside a Claude Code session. The tools then appear to Claude
as `mcp__cardinal__search_documentation`, `mcp__cardinal__cardinal_init` and so on.

### Claude Desktop

Open the configuration file, add the same `mcpServers` entry, then restart Claude Desktop:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cardinal": {
      "command": "npx",
      "args": ["-y", "@icure/cardinal-mcp-server"]
    }
  }
}
```

Claude Desktop starts the server with a minimal environment. If the server does not appear, replace `"npx"` with
the absolute path printed by `which npx` (macOS) or `where npx` (Windows).

## Connect Codex

The Codex CLI and the Codex IDE extension read their MCP servers from the same `~/.codex/config.toml`. Add the
server from a terminal:

```bash
codex mcp add cardinal -- npx -y @icure/cardinal-mcp-server
```

or write the entry by hand:

```toml
[mcp_servers.cardinal]
command = "npx"
args = ["-y", "@icure/cardinal-mcp-server"]
startup_timeout_sec = 60
```

Codex waits 10 seconds for a server to start by default, which the first `npx` download can exceed:
`startup_timeout_sec` gives it more time. To share the server with everyone working on a repository, put the same
entry in `.codex/config.toml` at the root of the project; Codex reads it once you trust the project. Check the
connection with `codex mcp list`, or `/mcp` inside a Codex session.

## Connect other agents

Any MCP client that supports local (stdio) servers can start the Cardinal server: give it the command `npx` and
the arguments `-y @icure/cardinal-mcp-server`.

- **Cursor**: `.cursor/mcp.json` in the project, or `~/.cursor/mcp.json` for every project, with the same
  `mcpServers` entry as [Claude Code](#claude-code).
- **VS Code (GitHub Copilot agent mode)**: `.vscode/mcp.json` in the project. Its top-level key is `servers`, not
  `mcpServers`:

  ```json
  {
    "servers": {
      "cardinal": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@icure/cardinal-mcp-server"]
      }
    }
  }
  ```

- **Other clients** (Gemini CLI, Windsurf, Zed, …): most of them accept the same `mcpServers` JSON entry. See their
  documentation for the location of the file.

### Agents you build

Agent frameworks connect to MCP servers the same way. With the
[Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) for TypeScript:

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'

for await (const message of query({
  prompt: 'How do I share a patient with another healthcare party in the Cardinal TypeScript SDK?',
  options: {
    mcpServers: {
      cardinal: { command: 'npx', args: ['-y', '@icure/cardinal-mcp-server'] },
    },
    allowedTools: ['mcp__cardinal__search_documentation'],
  },
})) {
  if (message.type === 'result' && message.subtype === 'success') console.log(message.result)
}
```

With the [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/) for Python:

```python
import asyncio

from agents import Agent, Runner
from agents.mcp import MCPServerStdio


async def main():
    async with MCPServerStdio(
        name="cardinal",
        params={"command": "npx", "args": ["-y", "@icure/cardinal-mcp-server"]},
    ) as cardinal:
        agent = Agent(
            name="Cardinal assistant",
            instructions="Answer questions about the Cardinal SDK. Look up the documentation before answering.",
            mcp_servers=[cardinal],
        )
        result = await Runner.run(agent, "How do I share a patient with another healthcare party?")
        print(result.final_output)


asyncio.run(main())
```

An agent that only answers questions about the SDK does not need the operational tools: allow it
`search_documentation` alone, as `allowedTools` does in the Claude Agent SDK example.

## What the assistant gets

| Tool | Needs `cardinal_init` | Purpose |
| --- | --- | --- |
| `search_documentation` | no | Full-text search over the API, model, filter, tutorial and guide documentation |
| `cardinal_init` | – | Logs in to a Cardinal backend and keeps the SDK instance for the rest of the session |
| `cardinal_admin` | yes | Group, User, Role, Permission, System, Auth and Filter APIs |
| `cardinal_data_owner` | yes | HealthcareParty, Patient and Device APIs, with a `flavour` of `decrypted`, `encrypted` or `tryAndRecover` |
| `cardinal_crypto` | yes | Crypto, Recovery, ShamirKeysManager, DataOwner and CardinalMaintenanceTask APIs |
| `cardinal_continue_iteration` | yes | Fetches the next page of a paginated result |

The documentation is also exposed as MCP resources the assistant can read directly: `cardinal://docs/overview`,
`cardinal://docs/api/{apiName}`, `cardinal://docs/model/{modelName}`, `cardinal://docs/filter/{entityName}`,
`cardinal://docs/tutorial/{slug}` and `cardinal://docs/guide/{slug}`.

## Using it

Documentation questions work right away:

> How do I share a patient with another healthcare party in the Cardinal TypeScript SDK?

The assistant searches the documentation and reads `cardinal://docs/api/Patient` or the relevant how-to guide. The
same applies when it writes code for you: in a coding agent, ask it to check the Cardinal documentation before it
calls the SDK, for instance:

> Write a function that creates a patient and shares it with the healthcare party whose id I pass. Check the
> signatures in the Cardinal documentation first.

To run operations, ask the assistant to log in first:

> Initialise Cardinal against https://api.icure.cloud with the user alice@example.com and the password I will give you.

This calls `cardinal_init`, which takes `baseUrl`, `username`, `password`, an optional `projectId` and a `storageDir`
for the SDK's key storage (default `./cardinal-mcp-storage`, relative to the directory the server was started from).
From then on the assistant can, for instance, list the patients of the current data owner, create an entity or
inspect the keys of a data owner. Method parameters are passed by their declared name; a filter parameter is written
as `{ "_factory": "<Entity>Filters.<method>", "<param>": ... }` using the factories listed under
`cardinal://docs/filter/{entityName}` (see [Everything about filters](./explanations/everything-about-filters.mdx)).

:::warning Keep the credentials and the data you hand over in mind

Everything you type reaches the model, and so does every result the tools return, including the data the SDK
decrypts for the assistant. The assistant can call any method the SDK exposes with the rights of the user you log in
with.

- Use a test group or a dedicated user with the least privileges that get the job done, never a production
  administrator, and never a user with access to real patient data.
- Keep tool-call approval on for the operational tools, so that you see each call before it runs.
- The `storageDir` holds the user's private keys: point it outside your repository and do not commit it.

:::

## Running from source

```bash
git clone https://github.com/icure/cardinal-sdk.git
cd cardinal-sdk/cardinal-mcp-server
corepack enable
yarn install
yarn run build
claude mcp add cardinal-dev -- node "$PWD/dist/index.js"
```

`yarn test` runs the suite (an in-memory MCP client against the real server, no network). `yarn run generate`
regenerates the documentation manifest and the method registry in `generated/`; it needs the parent repository
checked out (for the Kotlin KDoc) and the matching `@icure/cardinal-sdk` in `node_modules`. See the
[server's README](https://github.com/icure/cardinal-sdk/blob/main/cardinal-mcp-server/README.md) and its `CLAUDE.md`
for the code layout and the release automation.
