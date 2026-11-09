---
name: scenarios-and-cash
description: "Scenarios and cash in Layerz: a base, upside and downside case, a fundraise or a delayed hire, runway, a cash-flow forecast, \"what if\", switching between actuals and forecast at the cutover. Creates scenario branches, writes scenario values without touching the base, reads branch versus base, and builds the cash balance and the runway the right way."
license: MIT
metadata:
  layerz_version: "0.6.0"
  generated_by: "layerzlabs/layerz scripts/build-plugin-skills.ts, from the modeling guide"
---

# Layerz: Scenarios and cash

**Instruction priority.** Explicit instructions from the user in the conversation come first. Then the model's FINANCE.md and the workspace conventions: both come back as `conventions` in the results of `layerz_get_model`, `layerz_create_model`, `layerz_build_from_blueprint`, an unfiltered `layerz_read` and `layerz_get_conventions`. They describe this workspace and this model (currency, units, signs, depth, structure, who reads it) and override the defaults below. Your own skills and instructions keep their priority on how you work. This skill describes how the Layerz tools work and in which order; it states no fact about any business.

## When this applies

Scenarios (base, upside, downside, a fundraise, a hire delayed), runway, a cash-flow forecast, "what if", actuals versus forecast.

## Sequence

1. `layerz_get_conventions { model_id }` and a `layerz_read` of the base: which assumptions drive cash, where the cash `balance` is, where `actuals_through` stands.
2. A scenario is a branch; no data source is involved. `layerz_update_branch` with `patch.display_name` creates it; the same name again updates it.
3. Scenario values: `layerz_patch { model_id, branch_id, ops }` with `update` ops carrying `value` / `values` / `timeline_values` on assumptions. Only the cells that differ from the base are stored; structure and non-value fields apply model-wide. The base is never overwritten to test a case.
4. Read the scenario with `layerz_read { branch_id }` (`v` the branch, `vv` branch minus base); without `branch_id`, reads and writes are the base plan.
5. Cash forecast: cash is a `balance` fed by callups of the operating, investing and financing flows; a fundraise is one assumption (amount and month) that moves cash, equity and runway together; runway is a formula on the cash balance and the monthly burn. With actuals in the model, `IF(IS_ACTUAL, actual_line, forecast_line)` switches at the cutover, pinned with `layerz_update_branch` and `patch.actuals_through`.
6. Dashboard: KPIs read the branch checked out; `period_mode: "ytd"` for year-to-date tiles; `meta.default_branch` opens the model on the scenario the user reads first.
7. Hand over the comparison in words: what moves, by how much, under which assumption.

## References

From the Layerz modeling guide (version 0.6.0; the whole guide: `layerz_get_conventions { include_guide: true }` or the `modeling-guide://reference` resource):

- [4. Stock-flow (rolling balances)](references/04-stock-flow-rolling-balances.md)
- [7. Branches, scenarios and actuals](references/07-branches-scenarios-and-actuals.md)
