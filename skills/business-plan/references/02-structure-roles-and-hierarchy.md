# 2. Structure: roles and hierarchy

> Section 2 of the Layerz modeling guide, version 1.3.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

Roles: `section` (structural grouping, no value), `assumption` (typed input),
`formula` (expression, or an aggregator summing its children when it has no
expression), `callup` (typed mirror of one source), `balance` (rolling stock:
opening + flows), `dashboard` (container of `chart` / `kpi` / `mini_table`).

- Only `section` and `dashboard` live at root. A `section` accepts every role
  except widgets and nests inside another `section` for true sub-sections.
  A `dashboard` accepts widgets only.
- **Tab order** (the app's tabs and the Excel sheets): root dashboards first,
  then root sections, then list tabs; each group in its own order. Place a tab
  when you create it (`after` / `before` a tab of the same group; none = last
  of its group) and reorder it later with `move { uid, after | before }` (or
  `list_update { uid, after | before }` for a list). The same anchors order a
  container's children. `layerz_read` returns items in that order.
- A no-expression `formula` is an aggregate VALUE ("Total Revenue"); a nested
  `section` is grouping with no value. A `formula` is an aggregator XOR a
  transformation: an expression AND children is rejected
  (`FORMULA_EXPR_AND_CHILDREN`).
- **Callup** = a typed mirror of ONE source whose value flows INTO its parent:
  use it for balance flows and to surface a value inside a section or subtotal.
  It shows the source's name unless given its own (`name` on the callup:
  "Grant" on the P&L mirroring "Grant received"), and inherits its
  `timeline_ref` (none on a callup). Never use a callup for arithmetic:
  inside a formula, reference the source directly (`Revenue * 1.2`); a
  callup's own name is not a formula identifier. A single bare reference with
  no `timeline_ref` override is auto-posed as a callup on create/replace
  (the response says so in `notes`).
- Every item has a single `name` (visible label + formula identifier), unique
  case-insensitively within the model; multi-word names use back-ticks in
  formulas (`\`Annual Revenue\` * 12`).
- **Aggregation** (how a month folds into a year): a flow sums, a balance is a
  `stock` (its closing), a callup folds like its source, and a formula that
  copies, lags, adds or subtracts stocks is a `stock` too: ARR or a
  headcount copied by a formula is not summed over the year. A stock times a
  rate or a price (headcount × salary, debt × rate) is a flow and sums. Set
  `aggregation` only to override: `stock` for a level built from a rate
  (MRR = clients × price), `average` for a rate, `first` for an opening
  read on the first month (opening cash in a yearly cash-flow table).
