# Layerz MCP

**Financial models your AI agent builds and edits: items, formulas, dependencies, branches. Exports to Excel.**

Layerz is a structured spreadsheet for financial models, ready for AI. This is its remote MCP server. Claude, ChatGPT, Codex or any MCP client works on the model structure itself, not on loose cells, so formulas hold when the agent changes an assumption and the model is still there next session.

- **Endpoint:** `https://layerz.cc/mcp` (streamable HTTP)
- **Auth:** OAuth 2.1 with PKCE and dynamic client registration, or a Layerz API key
- **Docs:** [layerz.cc/for-agents](https://layerz.cc/for-agents) · [llms.txt](https://layerz.cc/llms.txt)
- **Registry:** `io.github.layerzlabs/layerz` on the [official MCP Registry](https://registry.modelcontextprotocol.io)

[![Layerz MCP connector](https://glama.ai/mcp/connectors/cc.layerz.app/layerz/badges/score.svg)](https://glama.ai/mcp/connectors/cc.layerz.app/layerz)

The server is hosted. There is nothing to install or run locally: this repository holds the setup instructions and the metadata MCP directories read.

---

## Why

Ask an AI to build a financial model and you get a workbook in 30 seconds. Then one assumption changes: links break, values get hardcoded, and the next session starts from scratch.

Layerz keeps the **structure** of a model (items, formulas with named references, the dependency graph, timelines) apart from its **data** (values, scenarios, actuals). The agent edits that structure through MCP tools, every change is versioned with a readable summary, and Excel is an export format: clean, standard `.xlsx` with live formulas, the file you send to people who never see the agent.

## Setup

### One click

| Client | Link |
|---|---|
| Claude (claude.ai, desktop app, Cowork) | [layerz.cc/claude](https://layerz.cc/claude) opens Settings → Connectors with Layerz pre-filled |
| ChatGPT and Codex | [layerz.cc/chatgpt](https://layerz.cc/chatgpt) opens the Layerz plugin in the ChatGPT directory |

Confirm, sign in to Layerz, done.

### Cursor

[![Add Layerz to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=layerz&config=eyJ1cmwiOiJodHRwczovL2xheWVyei5jYy9tY3AifQ%3D%3D)

Or add it to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "layerz": { "url": "https://layerz.cc/mcp" }
  }
}
```

Cursor opens the Layerz sign-in the first time a tool is called.

### By hand


**Claude Code**

```bash
claude mcp add -t http layerz https://layerz.cc/mcp
```

Then run `/mcp` to authenticate in the browser.

**OpenAI Codex**

```bash
codex mcp add layerz --url https://layerz.cc/mcp
codex mcp login layerz
```

**Claude, without the link**: Settings → Connectors → Add custom connector → `https://layerz.cc/mcp`

**ChatGPT, without the directory**: Settings → Security and login → Developer mode, then Plugins → + → `https://layerz.cc/mcp`

**Mistral Le Chat**: Settings → Connectors → Add custom MCP connector → `https://layerz.cc/mcp`

**OpenCode**: add to `opencode.json`, then run `opencode mcp auth layerz`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "layerz": {
      "type": "remote",
      "url": "https://layerz.cc/mcp",
      "oauth": {}
    }
  }
}
```

**Grok**: grok.com/connectors → New Connector → Custom → `https://layerz.cc/mcp`

**Antigravity CLI** (formerly Gemini CLI): add to `mcp_config.json`

```json
{
  "mcpServers": {
    "layerz": { "serverUrl": "https://layerz.cc/mcp" }
  }
}
```

**Any other MCP client**: point it at `https://layerz.cc/mcp` over streamable HTTP. Clients without OAuth can send a Layerz API key, created in the Layerz app, as a bearer token.

## What the agent can do

29 tools, grouped by job. Read-only tools are annotated as such, so clients can run them without asking.

| Job | Tools |
|---|---|
| Find and read models | `layerz_list_models`, `layerz_get_model`, `layerz_read`, `layerz_dependencies`, `layerz_validate_model` |
| Build and edit | `layerz_create_model`, `layerz_build_from_blueprint`, `layerz_list_templates`, `layerz_patch`, `layerz_match_items` |
| Conventions | `layerz_get_conventions`, `layerz_set_finance_md`, `layerz_set_custom_instructions` |
| Scenarios and actuals | `layerz_update_branch`, `layerz_delete_branch`, `layerz_import_branch`, `layerz_list_transactions` |
| Import files and sources | `layerz_create_upload_url`, `layerz_parse_file`, `layerz_list_integrations`, `layerz_manage_integration`, `layerz_list_mappings`, `layerz_manage_mapping`, `layerz_external_ref` |
| Versions | `layerz_history`, `layerz_diff`, `layerz_manage_version` |
| Share and export | `layerz_share_model`, `layerz_export` |

The server also exposes reference resources the agent reads on its own: `modeling-guide://reference` (session workflow, modeling patterns, validated patch examples), `formula-spec://reference` (the formula language) and `format-spec://reference` (number formats).

## Using it well

The guidance lives on the server, so it is never out of date on your machine:

- **Conventions travel with the model.** Each model carries a [FINANCE.md](https://github.com/layerzlabs/finance-md) (currency, units, sign convention, how the statements are built), and each workspace carries standing instructions for agents. The agent receives both when it opens a model.
- **The modeling guide** comes from `layerz_get_conventions { include_guide: true }`. Agents read it at the start of a session.
- **Recipes** (prompts for budgets, three-statement models, monthly closes, LBOs) are in the [cookbook](https://github.com/layerzlabs/cookbook).

A good first prompt:

> Build a three-statement model for a B2B SaaS company: 2 M€ ARR, 40 % growth, 18-month runway. Ask me what you need to know first.

## Pricing

Free for one person working alone: unlimited models, MCP and REST API, Excel and JSON export. A paid plan starts when a second person edits the same models. Details at [layerz.cc/pricing](https://layerz.cc/pricing).

## Related

- [finance-md](https://github.com/layerzlabs/finance-md): the open standard for financial conventions an agent reads
- [cookbook](https://github.com/layerzlabs/cookbook): recipes for financial work with AI agents
- [layerz.cc](https://layerz.cc): the web app, where people review, share and collaborate on the same models

## Support

Questions or stuck on setup: [contact@layerz.cc](mailto:contact@layerz.cc). Bugs and requests: open an issue in this repository.

## License

The contents of this repository (documentation and metadata) are released under the [MIT License](LICENSE). The Layerz server and web app are proprietary.
