# Layerz MCP

**Financial models your AI agent builds and edits: items, formulas, dependencies, branches. Exports to Excel.**

Layerz is a structured spreadsheet for financial models, ready for AI. This repository is its **plugin**: the hosted MCP server plus five skills that teach an agent how to drive it (first session, business plan, monthly close, scenarios and cash, review and fix). Claude, ChatGPT, Codex, Cursor or any MCP client works on the model structure itself, not on loose cells, so formulas hold when the agent changes an assumption and the model is still there next session.

- **Endpoint:** `https://layerz.cc/mcp` (streamable HTTP)
- **Auth:** OAuth 2.1 with PKCE and dynamic client registration, or a Layerz API key
- **Docs:** [layerz.cc/for-agents](https://layerz.cc/for-agents) · [llms.txt](https://layerz.cc/llms.txt)
- **Registry:** `io.github.layerzlabs/layerz` on the [official MCP Registry](https://registry.modelcontextprotocol.io)

[![Layerz MCP connector](https://glama.ai/mcp/connectors/cc.layerz.app/layerz/badges/score.svg)](https://glama.ai/mcp/connectors/cc.layerz.app/layerz)

The server is hosted. There is nothing to run locally: this repository holds the plugin manifests (Agent Plugins 1.0, Claude Code, Cursor), the five skills under `skills/`, the setup instructions and the metadata MCP directories read. Installing the plugin adds one connection to `https://layerz.cc/mcp` and nothing else; `SECURITY.md` says exactly what is sent.

---

## Why

Ask an AI to build a financial model and you get a workbook in 30 seconds. Then one assumption changes: links break, values get hardcoded, and the next session starts from scratch.

Layerz keeps the **structure** of a model (items, formulas with named references, the dependency graph, timelines) apart from its **data** (values, scenarios, actuals). The agent edits that structure through MCP tools, every change is versioned with a readable summary, and Excel is an export format: clean, standard `.xlsx` with live formulas, the file you send to people who never see the agent.

## Install

Where a plugin can be installed, install the plugin: it is the same server with the skills on top. The bare URL remains the fallback for every other MCP client.

| Client | How |
|---|---|
| Claude (claude.ai, desktop app, Cowork) | Connector: [layerz.cc/claude](https://layerz.cc/claude) opens Settings → Connectors with Layerz pre-filled. Skills: add the **Layerz plugin** from Customize → Plugins → Discover once it is listed; it pairs with the connector, so one set of tools. |
| Claude Code | In a session: `/plugin install layerz --marketplace layerzlabs/layerz-mcp`. From the shell: `claude plugin marketplace add layerzlabs/layerz-mcp` then `claude plugin install layerz`. If you had added the server by hand, `claude mcp remove layerz` so the tools are not listed twice. A plugin added on claude.ai also reaches Claude Code as a synced plugin. |
| ChatGPT and Codex | [layerz.cc/chatgpt](https://layerz.cc/chatgpt) opens the Layerz plugin in the directory; the skills ship with it. From Codex CLI: `codex plugin marketplace add layerzlabs/layerz-mcp`. |
| Cursor and Grok Bot | Install **Layerz** from the Cursor Marketplace (shared with Grok Bot). The plugin carries the server, so the deeplink below is not needed. |

Sign in to Layerz the first time a tool is called. Free for one person working alone.

### Server only (any MCP client)

Every client below speaks to the same server at `https://layerz.cc/mcp` (streamable HTTP, OAuth 2.1 with PKCE and dynamic client registration, or a Layerz API key as a bearer token). It gets the tools, the conventions and the modeling guide, not the skills.

**Cursor, without the plugin**

[![Add Layerz to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=layerz&config=eyJ1cmwiOiJodHRwczovL2xheWVyei5jYy9tY3AifQ%3D%3D)

```json
{
  "mcpServers": {
    "layerz": { "url": "https://layerz.cc/mcp" }
  }
}
```

**Claude Code, without the plugin**

```bash
claude mcp add -t http layerz https://layerz.cc/mcp
```

**OpenAI Codex, without the plugin**

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

**Grok** (grok.com): Connectors → New Connector → Custom → `https://layerz.cc/mcp`

**Antigravity CLI** (formerly Gemini CLI): add to `mcp_config.json`

```json
{
  "mcpServers": {
    "layerz": { "serverUrl": "https://layerz.cc/mcp" }
  }
}
```

**Any other MCP client**: point it at `https://layerz.cc/mcp` over streamable HTTP. Clients without OAuth can send a Layerz API key, created in the Layerz app, as a bearer token.

## The skills

Five skills, each named after a job the user asks for. The `SKILL.md` is a short sequence of tool calls for that job; the matter comes from the Layerz modeling guide, copied verbatim into `references/` by a script in the Layerz code repo, so the skills can never drift from what the server documents.

| Skill | When the agent loads it | What it does |
|---|---|---|
| [`start`](skills/start/SKILL.md) | First conversation, a workspace with no model yet, "where do I start" | Lists the models, offers a template or a few questions, reads the workspace conventions, builds a first model in one pass, hands over the link |
| [`business-plan`](skills/business-plan/SKILL.md) | Build or extend a business plan, a budget, a three-statement model | Conventions first, the structure the workspace expects, one validated build, every stock as a rolling balance, checks at zero, then incremental patches |
| [`monthly-close`](skills/monthly-close/SKILL.md) | Import actuals, map accounts, resync, comment variances | Upload, dry run, the mapping loop, sync, health on the actuals branch, diff, pinned version |
| [`scenarios-and-cash`](skills/scenarios-and-cash/SKILL.md) | Scenarios, runway, cash-flow forecast, actuals versus forecast | Scenario branches, values written on the branch only, branch versus base, the cash balance and the cutover |
| [`review-and-fix`](skills/review-and-fix/SKILL.md) | A failing check, wrong numbers, a refactor to verify, undo | Health by branch, the cycle or the typed number, dry run before a structural change, history, diff, restore |

Every skill opens with the same rule: explicit instructions from the user come first, then the model's FINANCE.md and the workspace conventions (both returned by the tools), then the user's own skills, then the skill's defaults. The skills state no fact about any business and never quote a workspace's text. Finance judgement (is this plan credible) is not in the plugin: the [cookbook](https://github.com/layerzlabs/cookbook) has skills for that, yours to fork.

### Where instructions come from

Four places, one owner each. The plugin skills (this repository, Layerz) say how the tools work and in which order. Your own skills and instructions, in your agent, say how you work. The **workspace Context**, written in the Layerz app and shared by the workspace's members, says what this workspace expects of a model (depth, structure, presentation); every client receives it in tool results. Each model's **FINANCE.md** says what is true of that model (currency, units, signs, statement structure, objective). When they disagree, the narrower one wins: your request in the conversation, then the FINANCE.md, then the Context, then your skills, then the plugin's defaults.

### Updates

Two rhythms. The server (tools, conventions, modeling guide, engine messages) is live for everyone as soon as it is deployed. The skills change with a commit here: Claude Code refreshes marketplace plugins at startup or with `claude plugin update layerz`; Cursor re-reads the repository; ChatGPT and Anthropic's directory take a new version through their review. The skills are written to stay stable: they point at the server for everything that moves.

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

The facts live on the server and travel with the model; the method is in the skills above and in the guide the server serves:

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

## Versioning

One version, the server's. The number published to the [official MCP Registry](https://registry.modelcontextprotocol.io) (`io.github.layerzlabs/layerz`, from the `server.json` of the Layerz code repo) is the only version; `plugin.json`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`, `lhm.plugin.json`, the `X-Layerz-Client` header of the Claude and Cursor MCP entries (the Agent Plugins `mcp.json` read by ChatGPT and Codex carries none: OpenAI's public submission rejects server headers) and the `layerz_version` of every skill mirror it, never one of their own. A change to this repository alone (a skill reworded, a tool declared) ships under the current version. The `version check` workflow (`.github/workflows/version-check.yml`, on every push and weekly) fails when they disagree or run behind the registry, and only warns when a publish is pending.

## Support

Questions or stuck on setup: [contact@layerz.cc](mailto:contact@layerz.cc). Bugs and requests: open an issue in this repository.

## License

The contents of this repository (documentation and metadata) are released under the [MIT License](LICENSE). The Layerz server and web app are proprietary.
