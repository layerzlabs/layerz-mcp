# 10. Checks, health and broken DAGs

> Section 10 of the Layerz modeling guide, version 1.3.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

A **check** flags an `assumption` or `formula` as a control (`check: {}`,
`check: { tolerance: 0.01 }`, `check: null` removes it). The line is judged on
its own value: an amount passes when `ABS(value) < tolerance` (default 1); a
boolean formula (comparison / AND / OR / NOT) passes when true. Values are
rounded to 2 decimals and empty periods read 0 (write `>= 0` rather than
`> 0` for a line legitimately empty early on). A failing check never blocks a
write. After a patch, `layerz_read { health: true }` reports every violation
in one call. The verdict is judged on a branch checkout, the view the user
sees: pass `branch_id` to audit one
branch (the same basis as `v`), or read `health.by_branch` on a multi-branch
model, where `health.branch_id` names the branch the top-level verdict is for.

On `computable: false` (a cycle, a `#REF!`), every series is zero-filled and
`health.status` is `unknown`: run `layerz_validate_model` for the cycle path
and fix the DAG before reasoning on values.

`layerz_validate_model` and `layerz_build_from_blueprint` also return
`quality`: at most five hints, most severe first, on what a reviewer flags
before any figure (a formula rolling its own previous value instead of a
balance, a balance without flows, balances without a check line, a dashboard
without KPI, a month written in a name, a model of typed values). Fix them
before handing the model over. The dashboards a blueprint declares get a
default layout where it says nothing (2 or 3 KPIs share the row, a mini-table
spans the width, a KPI compares with the model's only budget branch): send
`span` / `compare_to` only to override.
