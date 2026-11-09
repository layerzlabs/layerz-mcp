# 7. Branches, scenarios and actuals

> Section 7 of the Layerz modeling guide, version 1.1.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

A branch is a scenario coordinate: the model reads as `base ⊕ branch`.

- **Create a scenario branch** with `layerz_update_branch({ display_name })`
  (no `dataset_id` = create; a second call with the same name updates it).
  No data source is involved.
- **Write scenario values** with `layerz_patch({ branch_id, ops })`: an
  `update` / `replace` carrying `value` / `values` / `timeline_values` on an
  assumption stores only the cells that differ from the base as that branch's
  overlay, exactly what a value edit does in the web editor with the branch
  checked out. Structural ops and non-value fields apply model-wide.
  `compute_branch` defaults to `branch_id`, so the returned `compute` series
  are the scenario's. Writes on a computed line overlaid by a branch are
  rejected; import the actual instead.
- **Import actuals** with `layerz_import_branch`: the `file_id` path parses a
  spreadsheet server-side and classifies its rows with the model's mapping
  rules (§ 8); `entries[]` with `record_import` writes values you computed
  yourself with provenance (a data source is materialized so the Sources panel
  and `layerz_list_transactions` audit it). Bare `entries[]` (no `file_id`,
  no `record_import`) is a manual overlay identical to `layerz_patch { branch_id }`.
  Each entry's `timeline_ref` equals the target item's grain (or `constant`);
  aggregate or split the source to that grain first. An entry on a `formula` /
  `balance` is a per-period override (actual) that seeds downstream periods.
  `replace: true` wipes the branch then writes (carry-forward keeps periods the
  entries do not cover: send an explicit 0 to clear one; with
  `replace_scope: "import"` the entries are the source's whole contribution and
  uncovered periods are dropped, `purged_periods`); `merge: true` upserts
  cell by cell. Preview with `dry_run: true` (`overridden_items`,
  `validation_errors_new`), then commit.
- **One file per exercise (a FEC per year, a monthly export).** Several
  sources may feed the same lines: each owns its rows, a sync rewrites only
  its own months and the dry run names only them. The close in one call each:
  a new version of a file → `file_id` + `replace_source_id` (from
  `layerz_list_integrations` or a dry run's `suggested_replace_source`),
  nothing else, the default branch included; a new exercise → `file_id` +
  `rules_from_source_id` (the sibling's rules classify it and are copied
  onto the new source); a rule correction on every exercise →
  `layerz_manage_mapping { op: "set", source_ids: [...] }` then
  `layerz_manage_integration { op: "sync" }` on each source, in any order.
  An opening journal (à-nouveaux: AN, RAN, ANO, AD) is read from the journal
  column of any ledger and opens a balance (`opening_entries`).
- **Cutover.** `actuals_through` on the model (or a branch override) is the
  last real period; `IS_ACTUAL` in a formula switches actual/forecast logic
  (`IF(IS_ACTUAL, actual_line, forecast_line)`) and follows every sync.
  `layerz_update_branch({ actuals_through })` pins it; `null` resets to auto.
- **Year to date.** A KPI or a mini-table with `period_mode: "ytd"` shows the
  cumulative from January through its `target_period` (flows summed, a ratio
  line `a / b` recomputed on the cumulated operands), so a close dashboard
  needs no YTD line per account. Inside the model, `YTD(x)` and `TTM(x)`
  are the formula equivalents; a rate to date is `YTD(margin) / YTD(revenue)`,
  never the YTD of a rate.
- **Base by default.** Without `branch_id`, reads and writes are the base
  plan: `items[].values`, `v` and `layerz_get_model` never mix in an
  overlay. Read a branch with `layerz_read({ branch_id })` (`v` and
  `vv`, the branch minus the base, follow it).
- **Default branch on open**: `meta.default_branch` (and a dashboard's
  `default_branch`) sets the branch checked out when the model opens.
- `layerz_delete_branch` removes the branch, its rows and the data sources
  that fed only that branch.
