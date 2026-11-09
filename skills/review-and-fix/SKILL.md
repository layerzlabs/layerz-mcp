---
name: review-and-fix
description: "Review and fix a Layerz model: a check fails, the balance sheet does not balance, \"the numbers are wrong\", a model is not computable, verify that a refactor changed nothing, compare two versions or an imported model with its source workbook, undo or restore, \"what changed since yesterday\". Reads health by branch, finds the cycle or the typed number, previews a patch before applying it, and uses history, diff and versions to prove or undo a change."
license: MIT
metadata:
  layerz_version: "0.6.0"
  generated_by: "layerzlabs/layerz scripts/build-plugin-skills.ts, from the modeling guide"
---

# Layerz: Review and fix

**Instruction priority.** Explicit instructions from the user in the conversation come first. Then the model's FINANCE.md and the workspace conventions: both come back as `conventions` in the results of `layerz_get_model`, `layerz_create_model`, `layerz_build_from_blueprint`, an unfiltered `layerz_read` and `layerz_get_conventions`. They describe this workspace and this model (currency, units, signs, depth, structure, who reads it) and override the defaults below. Your own skills and instructions keep their priority on how you work. This skill describes how the Layerz tools work and in which order; it states no fact about any business.

## When this applies

A check fails, the balance sheet does not balance, "the numbers are wrong", `computable: false`, verify that a refactor changed nothing, compare two versions, undo, restore, "what changed".

## Sequence

1. `layerz_read { model_id, health: true }` (add `branch_id` to judge the branch the user looks at; `health.by_branch` on a multi-branch model). Each violation names the line and the periods.
2. `computable: false` or `health.status: "unknown"`: `layerz_validate_model` returns the cycle or the broken reference path. Fix the graph before reasoning on any value; every series is zero-filled until then.
3. A failing check: read the line and its sources (`layerz_dependencies { uid }`), look for the typed number, the wrong sign, the missing callup (a `balance` without callup children stays flat), the formula that sums a stock. Fix with `layerz_patch` (`replace` keeps the UID and the presentation), then read health again.
4. Before a structural change on a working model: `layerz_patch { dry_run: true, compare_values: true }` previews the cells that move on checks, totals and the `uids` named. A refactor is neutral when nothing moves.
5. What changed: `layerz_history { model_id, uid }` (one item's changes, or the versions without `uid`) and `layerz_diff { from, to, values: true }` (omit `to` for the live model). On an imported model, `layerz_diff { model_id, source: { set, refs } }` (top level, in place of `from`) compares the live model with its source workbook as Layerz recalculates it: per line, `first_gaps` and `summary.score`; `set` overrides cells (`"Sheet!C6": 0.4`) to compare a scenario.
6. Undo: `layerz_manage_version { op: "restore", version }` after reading the history and the diff (the live state is backed up first); `op: "pin"` keeps a version past the retention window. A patch retried after a timeout re-applies its `create` ops: read the history first.
7. Report in words: what was wrong, what was changed, what the checks say now.

Finance judgement (is the plan credible, what to challenge, what a lender looks at) is not in this plugin: the Layerz cookbook (github.com/layerzlabs/cookbook) has skills for that, which the user installs and adapts.

## References

From the Layerz modeling guide (version 0.6.0; the whole guide: `layerz_get_conventions { include_guide: true }` or the `modeling-guide://reference` resource):

- [10. Checks, health and broken DAGs](references/10-checks-health-and-broken-dags.md)
- [11. Versions](references/11-versions.md)
