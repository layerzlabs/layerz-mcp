# 5. Lists (per-element series)

> Section 5 of the Layerz modeling guide, version 1.1.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

Three concepts:

- the **lists registry** (`list_create` / `list_update` / `list_delete`): a
  named registry of elements (Functions, Products, Channels, Debt Tranches…),
  idempotent by name, at most 500 elements;
- **list-mode items**: an `assumption` / `formula` / `balance` carrying
  `liste_ref`, expanded to one virtual instance per element;
- **branches** (§ 7), which are scenario coordinates, not lists.

Pattern: `list_create` (each element may carry a temp `id`), bind the consumer
with `liste_ref` (temp id, name or UID), populate `timeline_values` keyed by
element UID, label or temp id (`null | number | (number|null)[]`, a scalar is
wrapped into a 1-element array). Unset cells read as 0 (a flux), never a
forward-filled stock: send a full array or `timeline_ref: "constant"` for a
value held every period. Temp ids of list elements resolve only in the batch
that declares the list; later batches key by label or UID. The map is the full
set of series of the branch written: an element it omits loses its series
there. Removing an element from the list (`list_update` without it) drops its
series on every item bound to the list.

- **Balance-list rule**: when a `balance` carries `liste_ref`, every list-typed
  child shares the same `liste_ref`; scalar children broadcast. A callup child
  takes the list of its source: the callup of a list-mode flow feeds each
  element its own flow (the stock-flow pattern of § 4 holds per element).
- **Cross-list bridging** is declared on the element: `list_update` with
  `items: [{ label: "Direct", mapped_to: { Products: ["Pro", "Enterprise"] } }]`.
  Declare a link once, on either side: it serves both directions (aggregation
  children → parent, broadcast parent → children with `Item[i]`).
  Group subtotal example: creditors `Bank 1`, `Bank 2`, `Supplier` and a
  `Groups` list with `Banks`; link them on the group
  (`{ label: "Banks", mapped_to: { Creditors: ["Bank 1", "Bank 2"] } }`) or on each
  creditor (`{ label: "Bank 1", mapped_to: { Groups: ["Banks"] } }`), then
  `Bank repayments = Repayment[\`Banks\`]`.
- **Formula-list (cross-dimension aggregation)**: a scalar formula whose operand
  carries a `liste_ref` sums that operand across its dimension; with
  `mapped_to`, the subscript `Operand[\`key\`]` rolls up the mapped source
  elements (a SUMIF over the mapping). Prefer it over a parallel "code" column
  + `SUMIF(..., = N)`. A bare reference to a list item is always its TOTAL; the
  per-element value inside a list-mode formula is `Item[i]`. Never add a scalar
  callup to get a total.
- **Chart list rendering**: `list_mode: "split"` (default) explodes EVERY
  list-backed source into one series per element; `"total"` plots each item's
  aggregate as one series.
- **List total row**: `list_total: true` shows the aggregate row's values; the
  aggregate is still computed and referenceable when it is off.
- **Subscript syntax**: `Item[\`key\`]` slices a list-dimensioned item by an
  element of its list, or by a key of a list reachable via `mapped_to`
  (auto-aggregates the matching sources). Lags apply to a subscript
  (`Salary[\`Sales\`]_Y-1`, `Item[i]_M-1`).
- **2D patterns (list × time)**: seasonality (`[i]` × scalar monthly curve),
  ramp-up / cohorts (`Curve_M-$Offset` with a per-element offset auto-populated
  by `LIST_INDEX`), per-element roll-forward (`X[i] = Flow[i] + X[i]_M-1`),
  allocation (`G&A[i] = Shared G&A * Revenue[i] / Revenue`).
