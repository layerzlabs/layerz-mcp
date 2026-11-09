# 10. Checks, health and broken DAGs

> Section 10 of the Layerz modeling guide, version 1.1.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

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
