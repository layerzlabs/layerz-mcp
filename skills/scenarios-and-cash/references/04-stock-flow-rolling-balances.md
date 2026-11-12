# 4. Stock-flow (rolling balances)

> Section 4 of the Layerz modeling guide, version 1.3.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

Cash, ARR, retained earnings, debt, fixed assets:

1. create a `balance` with `opening_balance`;
2. for each flow, a `formula` whose value is the per-period delta (outflows
   negative);
3. attach each flow as a `callup` child of the balance (`source: <flow>`);
4. when a flow depends on the balance itself (interest on debt, churn on ARR),
   read the previous period with the lag suffix `_M-1` / `_Q-1` / `_Y-1` on
   the balance to break the cycle.

A balance without callup children stays flat at `opening_balance` forever:
almost always a modeling bug. The balance rolls at the finest active grain
whatever its declared `timeline_ref`.
