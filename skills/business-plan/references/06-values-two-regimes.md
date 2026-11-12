# 6. Values: two regimes

> Section 6 of the Layerz modeling guide, version 1.3.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

Branch on `liste_ref` alone:

- **list-mode item** → `timeline_values` keyed by element (§ 5); `value` /
  `values` are rejected;
- **non-list item** → `value` (scalar, broadcast to every period) or
  `values` (array at the item's grain); `timeline_values` is rejected: on a
  non-list assumption or a computed line (`formula` / `balance`) it is
  **import-owned** (actuals and overrides come from `layerz_import_branch` or
  the Sources panel).

A one-cell edit on a non-list item passes a period-keyed `timeline_values`
map (`{ "2026-06": [-119.19] }`, keys `YYYY` / `YYYY-MM` / `YYYY-Qn` at the
item's grain): it is rerouted into the typed `values` series and leaves the
other periods intact; a canonical map (`{ "yearly": [...] }`) is rejected. KPI `target_period` on
monthly data accepts the annual shorthand `2028` (normalized to `2028-12`).

Timelines share one horizon, snapped to whole months; a yearly period is a
calendar year and needs its December in range. A value array starts at the
first period of that horizon: check `notes` after setting `timelines`, it
names any bound applied other than requested. A `values` array shorter than
the horizon carries its last value to the end, a longer one is cut: `notes`
says so; send one value per period when the tail should differ.

`layerz_read` values `v` always sit under their labels `p`: yearly by
default when the model has a yearly timeline, else its finest grain; a
`granularity` the model does not carry is refused
(`GRANULARITY_UNAVAILABLE`).

Formats: an item `format` names a pre-installed format, `date`, or a
`model.formats` key declared in the same batch (`meta.formats`), otherwise
`UNKNOWN_FORMAT`. `currency` / `currency_2` resolve live from the FINANCE.md
currency.
