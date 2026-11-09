# 1. Session start

> Section 1 of the Layerz modeling guide, version 0.6.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

1. **Conventions first.** `layerz_get_conventions({ model_id })` returns the
   conventions of the model's workspace (the standing preferences its members
   share: conventions, tone, modelling habits, on every model of the
   workspace) and the model's FINANCE.md (currency,
   units, sign convention, glossary, objective, statement structure). Every
   value returned by the tools is expressed in those conventions: `12000` may
   be 12k EUR or 12M USD depending on `units` and `currency`. The same two
   documents come back as `conventions` in the results of `layerz_get_model`,
   `layerz_create_model`, `layerz_build_from_blueprint` and an unfiltered
   `layerz_read`, so a session that opens a model already has them.
2. **Push a local FINANCE.md.** When the local project root carries a
   `FINANCE.md`, push it with `layerz_set_finance_md({ content, source: "imported" })`
   so later writes follow the same conventions.
3. **Keep the FINANCE.md complete.** Its Markdown body documents the objective
   (what the model builds, the deliverable expected), the structure of the P&L,
   the Cash Flow and the Balance Sheet (sections, key line items, how they
   connect: net income → retained earnings, cash flow → closing cash) and the
   conventions. When any of this is missing or stale, reconstruct it from the
   live model (`layerz_read` returns every item with `role` + `parent_uid`;
   that hierarchy IS the statements structure) and persist it with
   `layerz_set_finance_md`. Update it in the same turn as any change to the
   model's identity, structure or conventions (`layerz_set_finance_md` or the
   `meta` op of `layerz_patch`).
4. **Model identity.** A model carries a `glyph`: a kebab-case Lucide icon
   name (https://lucide.dev/icons) shown as its emblem in the app and on shared
   links. When `glyph` is absent from `layerz_get_model` / `layerz_list_models`,
   set one coherent with the business via the `meta` op of `layerz_patch`
   (SaaS → `trending-up`, coffee shop → `coffee`, real estate → `house`,
   banking → `landmark`, energy → `wind`, HR → `users`, valuation → `scale`,
   treasury → `wallet`), without asking.
5. **Read before writing.** `layerz_read` (structure, optional values) and
   `layerz_get_model` (full detail, branches, sharing roster) are the two
   reads; `layerz_validate_model` audits the DAG. Values returned with
   `computable: false` are zero-filled placeholders: fix the model first.
