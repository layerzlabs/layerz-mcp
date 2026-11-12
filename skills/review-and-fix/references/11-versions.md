# 11. Versions

> Section 11 of the Layerz modeling guide, version 1.3.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

Every persist writes a snapshot; `revision_id` (sha256) on `layerz_read` /
`layerz_get_model` / `layerz_history` detects concurrent writes (a stable id
between two reads = unchanged). `layerz_history { uid }` traces one item's
changes; `layerz_diff` compares two revisions (omit `to` for the live model);
`values: true` adds the computed-values diff — the cells that moved on the
key lines (checks, totals) or on `uids` — the way to verify a refactor is
neutral on the numbers; `layerz_patch { dry_run: true, compare_values: true }`
previews the same report before applying a batch.
Read the history and the diff before `layerz_manage_version { op: "restore" }`
(the live state is backed up first); `op: "pin"` keeps a version past the plan
retention window. A no-op patch creates no version. A patch retried after a
timeout re-applies its `create` ops (new UIDs): read the history first.
