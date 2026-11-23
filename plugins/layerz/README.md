# Layerz plugin for Claude

Financial models your agent builds and edits: items, formulas, dependencies and scenario branches, exported to standard Excel with live formulas.

Install in Claude Code:

```
/plugin install layerz --marketplace layerzlabs/layerz-mcp
```

This plugin bundles:

- **The hosted Layerz MCP server** (`https://layerz.cc/mcp`). Sign-in is handled by Claude through OAuth with your Layerz account. The plugin reads nothing from your machine.
- **Five skills**: `start` (first session), `business-plan`, `monthly-close`, `scenarios-and-cash`, `review-and-fix`. Each is a short sequence of Layerz tools, with the matching sections of the Layerz modeling guide in `references/`.

Layerz only reads and edits the models of the signed-in Layerz account. It does not move money, place trades or give investment advice.

- Product and docs: https://layerz.cc/for-agents
- Privacy policy: https://layerz.cc/privacy
- Terms: https://layerz.cc/terms
- Support: contact@layerz.cc

MIT licensed.
