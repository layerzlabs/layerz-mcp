---
name: business-plan
description: "Build or extend a business plan, a budget, a forecast or a three-statement model (P&L, balance sheet, cash flow) in Layerz; add assumptions, formulas, drivers, a dashboard; \"model this business\", \"build the BP\", \"add a hiring plan\". Reads the conventions first, lays out the structure the workspace expects, builds in one validated pass, keeps every stock as a rolling balance and the checks at zero, then edits incrementally."
license: MIT
metadata:
  layerz_version: "1.1.0"
  generated_by: "layerzlabs/layerz scripts/build-plugin-skills.ts, from the modeling guide"
---

# Layerz: Business plan

**Instruction priority.** Explicit instructions from the user in the conversation come first. Then the model's FINANCE.md and the workspace conventions: both come back as `conventions` in the results of `layerz_get_model`, `layerz_create_model`, `layerz_build_from_blueprint`, an unfiltered `layerz_read` and `layerz_get_conventions`. They describe this workspace and this model (currency, units, signs, depth, structure, who reads it) and override the defaults below. Your own skills and instructions keep their priority on how you work. This skill describes how the Layerz tools work and in which order; it states no fact about any business.

## When this applies

Build or extend a business plan, a budget, a forecast, a three-statement model; add assumptions, formulas, a dashboard; "model this", "build the BP".

## Sequence

1. Conventions first: `layerz_get_conventions { model_id }` (or `{ workspace_id }` for a new model). The workspace Context says what to build and how deep; the FINANCE.md says the model's currency, units, signs and structure. Every value the tools return is expressed in those conventions.
2. On an existing model, read before writing: `layerz_read` (structure, values) or `layerz_get_model` (full detail). `computable: false` is a broken graph: fix it first (skill `review-and-fix`).
3. Lay out the structure the Context asks for. A common one: an Assumptions section (every input, grouped), an Operations section (non-money drivers), the three statements, a dashboard. Statements never carry a typed number: inputs live in Assumptions, formulas in the statements.
4. Every stock (cash, debt, receivables, payables, fixed assets, equity, ARR, headcount) is a `balance` with an `opening_balance` and its flows attached as `callup` children; a flow that depends on the stock reads the previous period with the `_M-1` suffix. See the Stock-flow reference.
5. First build in one pass: `layerz_build_from_blueprint { apply_if_clean: true }`, items referencing each other by name. Nothing is written while there is an error; errors come back with a path: fix and send again. A large blueprint goes as a file (`layerz_create_upload_url`, then `file_id`).
6. `layerz_read { health: true }`. Every failing check is fixed before the model is handed over; a Balance check (Assets minus Liabilities and Equity) at 0 every period is the minimum.
7. In the same turn, `layerz_set_finance_md` (objective, structure of the three statements, conventions, open questions) and a `glyph` (`meta` op of `layerz_patch`).
8. Later changes go through `layerz_patch`: `replace` to swap an item (keeps its UID, its references and its presentation), `update` for a strict partial change, temp ids (`_rev`) to create and reference within one batch; read `map` before the next batch. Every write carries a `summary` in plain words.
9. Per-element series (by product, team member, cohort, debt tranche) are lists, not copies of items. See the Lists reference.
10. Hand over with the model's `url`, what changed and the assumptions taken.

## References

From the Layerz modeling guide (version 1.1.0; the whole guide: `layerz_get_conventions { include_guide: true }` or the `modeling-guide://reference` resource):

- [2. Structure: roles and hierarchy](references/02-structure-roles-and-hierarchy.md)
- [3. Building: blueprint vs patch](references/03-building-blueprint-vs-patch.md)
- [4. Stock-flow (rolling balances)](references/04-stock-flow-rolling-balances.md)
- [5. Lists (per-element series)](references/05-lists-per-element-series.md)
- [6. Values: two regimes](references/06-values-two-regimes.md)
- [13. Patch examples](references/13-patch-examples.md)
