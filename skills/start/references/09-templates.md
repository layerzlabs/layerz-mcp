# 9. Templates

> Section 9 of the Layerz modeling guide, version 1.1.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

A template is a read-only copy of a model, published from the web app. Two
scopes: `official` (curated by Layerz) and
`workspace` (the library of a workspace, read by its members). The MCP
consumes templates and never publishes one. `layerz_list_templates` lists
them (`template_id` on one entry returns its blueprint); its `description` is
the template's FINANCE.md, the usage guide. Start a new model from a whole
template with `layerz_create_model({ template_id, timelines })` (sources,
staged transactions and mapping rules copied; connector credentials excluded),
or apply one as a module into an existing model with
`layerz_build_from_blueprint({ template_id, mode: "merge" })`. The template is
never modified. Then adapt the new model (list contents via `layerz_patch`,
timeline bounds) and update its own FINANCE.md so its objective and
conventions match the project.
