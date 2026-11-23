# Layerz plugin for Claude

Financial models your agent builds and edits: items, formulas, dependencies and scenario branches, exported to standard Excel with live formulas.

Install in Claude Code:

```
/plugin install layerz --marketplace layerzlabs/layerz-mcp
```

This plugin bundles:

- **The hosted Layerz MCP server** (`https://layerz.cc/mcp`). Sign-in is handled by Claude through OAuth with your Layerz account. The plugin reads nothing from your machine.
- **Five skills**: `start` (first session), `business-plan`, `monthly-close`, `scenarios-and-cash`, `review-and-fix`. Each is a short sequence of Layerz tools, with the matching sections of the Layerz modeling guide in `references/`.

## What the Layerz tools can do

The MCP server reads and edits the models of the signed-in Layerz account. Besides reading, some of its tools take actions that change data or access, always on that account's own models:

- **Create and edit**: create a model (from a template, a blueprint or an uploaded Excel or CSV file), change its items and formulas, its FINANCE.md and the workspace instructions.
- **Delete**: delete items of a model, a scenario branch (with the rows and data sources that fed only that branch), mapping rules, a data source.
- **Change access and send an email**: `layerz_share_model` invites a person by email as viewer or editor of a model (Layerz sends them an invitation email) and revokes an access. Making a model public stays in the web app.
- **Sync connected sources**: pull rows from an accounting or banking connector the user already connected in the Layerz web app (read-only on the provider side). Credentials are entered in the web app, never through the tools.
- **Restore a version**: put a model back to an earlier version (the current state is saved first).
- **Export**: generate an Excel or CSV file and return a private, expiring download link.

The tools never move money, place trades or post anywhere outside Layerz.

Layerz only reads and edits the models of the signed-in Layerz account. It does not move money, place trades or give investment advice.

- Product and docs: https://layerz.cc/for-agents
- Privacy policy: https://layerz.cc/privacy
- Terms: https://layerz.cc/terms
- Support: contact@layerz.cc

MIT licensed.
