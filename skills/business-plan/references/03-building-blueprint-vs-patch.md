# 3. Building: blueprint vs patch

> Section 3 of the Layerz modeling guide, version 1.3.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

- **`layerz_build_from_blueprint`** for bulk creation of whole sections with
  their hierarchy (items reference each other by `name`; `mode: "merge"` adds
  to the model reusing items by name, `mode: "replace"` rebuilds it). Send it
  once with `apply_if_clean: true`: it validates and writes only when there
  is no error (errors come back with a path, nothing written). A large
  blueprint goes as a JSON file (`layerz_create_upload_url`, then
  `file_id`). The answer is concise (`name_to_uid`, counters, errors,
  health); UIDs are stable for a model, so a dry run's `name_to_uid` holds.
- **`layerz_patch`** for incremental edits (a batch of
  `create/replace/update/delete/move/list_*/meta` ops, all-or-nothing). Give a
  `create` a temp `id` (`_rev`) and reference it from later ops in the same
  batch (`parent`, `source`, `target`, `series`, `liste_ref`, `after`) and
  inside formulas (`$_rev * 1.2`, whole tokens only, lag suffix kept:
  `$_cum_Y-1`). A create may reference its own temp id or name in its formula:
  the self-referential counter `IF($_y_Y-1 = 0, $start, $_y_Y-1 + 1)` ships in
  one op.
- **Swap with `replace`**, not create + rewire + delete: `replace` keeps the
  item's UID, so inbound references (formulas, callups, widgets, children) stay
  valid, and it carries over the presentation fields `new_item` omits (style,
  format, note, check, placement).
- **`update` is a strict partial merge**: only the named fields change.
  Styling, formats, notes, checks and tile placement set in the web editor
  survive every agent write that does not mention them.
- Read the `map` field of the patch result (temp id → real UID) before the
  next batch: temp ids are batch-scoped.
- Every item or list reference takes a temp id, a UID or the name: `uid`,
  `from_uid`, `parent`, `after` / `before`, `source`, `target`,
  `series`, `rows`, `compute`, a list op's `uid`, and the `uids` of
  `layerz_read` / `layerz_diff`. A UID wins over a name.
