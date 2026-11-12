# 8. Sources and mapping rules

> Section 8 of the Layerz modeling guide, version 1.3.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

`layerz_list_integrations` lists every data source (API connectors and file
imports, plus linked external models with `include_external_refs`). Lines of
other models link through `layerz_external_ref { op: "link" }`, one per call or
up to 200 in `links` (one version for the batch).
`layerz_list_transactions` shows each staged row with its routing: mapping is
the only routing path (no fuzzy match), so a row with no matching rule is
`unmapped` and its cost is masked.

The loop: read `unmapped` (from `layerz_list_transactions`, or
`layerz_list_mappings { include_coverage: true }`) → write a rule with
`layerz_manage_mapping { op: "set", source_id, pattern, target }` (a rule
belongs to the source whose rows it classifies; glob `*` anywhere;
`secondary_pattern` for a double key; `__ignore__` to route a
row nowhere on purpose; a whole plan goes in ONE call as `rules: [...]`, up to
500, validated whole and replay-safe: identical rules report `unchanged`) or
import a catalog onto a source (`op: "import_template", source_id`), or give a
source the rules of a sibling (`op: "copy", source_id, rules_from_source_id`;
`on_conflict` `keep` by default, `replace` to overwrite) → replay
the projection with `layerz_manage_integration { op: "sync" }` (a file source
replays over its staged rows). A projecting op reports `unmapped`,
`proposed_window` (the staged span, auto-applied as `config.window`; edit it
with `layerz_manage_integration { op: "update", config: { window } }`),
`deletable_items` (import-only items a remap emptied, proposed, never
auto-deleted) and `shadowed` (cells an earlier import already wrote).
Connecting a new API key stays in the web app; credentials never transit MCP.
