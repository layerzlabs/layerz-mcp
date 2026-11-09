---
name: monthly-close
description: "Monthly close in Layerz: import actuals from a ledger export, FEC, trial balance, bank or accounting export; map accounts to the model lines; resync a source; compare budget and actuals and comment the variances; pin the closed version. \"Close October\", \"import the ledger\", \"map these accounts\", \"budget vs actual\". Walks the upload, dry run, mapping loop and sync in the order the tools expect."
license: MIT
metadata:
  layerz_version: "1.1.0"
  generated_by: "layerzlabs/layerz scripts/build-plugin-skills.ts, from the modeling guide"
---

# Layerz: Monthly close

**Instruction priority.** Explicit instructions from the user in the conversation come first. Then the model's FINANCE.md and the workspace conventions: both come back as `conventions` in the results of `layerz_get_model`, `layerz_create_model`, `layerz_build_from_blueprint`, an unfiltered `layerz_read` and `layerz_get_conventions`. They describe this workspace and this model (currency, units, signs, depth, structure, who reads it) and override the defaults below. Your own skills and instructions keep their priority on how you work. This skill describes how the Layerz tools work and in which order; it states no fact about any business.

## When this applies

Monthly close, import actuals (a ledger export, FEC, trial balance, bank or accounting export), map accounts to the model's lines, resync a source, budget vs actual variances, "close October".

## Sequence

1. `layerz_get_conventions { model_id }` (signs, units, fiscal year, what the Context says about variances and comments), then `layerz_list_integrations { model_id }`: the sources already connected, each with its rows and rules.
2. New file: `layerz_create_upload_url { filename, size, content_type }`, PUT the bytes from the shell, then `layerz_import_branch { model_id, branch, file_id, dry_run: true, summary }`. Read `unmapped`, `overridden_items`, `validation_errors_new`, `suggested_replace_source`.
3. A new version of a file already imported: `file_id` + `replace_source_id`. A new exercise (next year's ledger): `file_id` + `rules_from_source_id` (the sibling source's rules classify it). Then commit the same call without `dry_run`.
4. Mapping loop until `unmapped` is empty: `layerz_list_transactions { connection_id }` or `layerz_list_mappings { include_coverage: true }`, then `layerz_manage_mapping { op: "set", source_id, rules: [...] }` (one call for the whole plan, `__ignore__` for rows that belong nowhere), then `layerz_manage_integration { op: "sync", connection_id }`. Ask before creating a P&L line for an account the model does not have.
5. `layerz_read { model_id, branch_id, health: true }` on the actuals branch: the balance check at 0, the cutover (`actuals_through`) where expected.
6. Variances: read budget (base) and actuals (branch) side by side with `layerz_read { branch_id }` (`vv` is branch minus base); comment the lines above the threshold the Context sets, as item notes through `layerz_patch`.
7. `layerz_diff { from }` to show what the close changed, then `layerz_manage_version { op: "pin", version, summary }` on the closed state ("October 2026 close").

Credentials for an accounting connector are entered in the web app, never through the tools.

## References

From the Layerz modeling guide (version 1.1.0; the whole guide: `layerz_get_conventions { include_guide: true }` or the `modeling-guide://reference` resource):

- [7. Branches, scenarios and actuals](references/07-branches-scenarios-and-actuals.md)
- [8. Sources and mapping rules](references/08-sources-and-mapping-rules.md)
