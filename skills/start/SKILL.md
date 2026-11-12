---
name: start
description: "First steps with Layerz: the first conversation, a workspace with no model yet, \"what can Layerz do\", \"where do I start\", \"import my Excel model\", a fresh connection. Lists the models, offers a template, a few questions or the import of an existing workbook when the account is empty, reads the workspace conventions before the first write, builds a first model in one pass and hands over its link. Use it whenever the Layerz tools are available and no model has been opened yet in the conversation."
license: MIT
metadata:
  layerz_version: "1.3.0"
  generated_by: "layerzlabs/layerz scripts/build-plugin-skills.ts, from the modeling guide"
---

# Layerz: Start

**Instruction priority.** Explicit instructions from the user in the conversation come first. Then the model's FINANCE.md and the workspace conventions: both come back as `conventions` in the results of `layerz_get_model`, `layerz_create_model`, `layerz_build_from_blueprint`, an unfiltered `layerz_read` and `layerz_get_conventions`. They describe this workspace and this model (currency, units, signs, depth, structure, who reads it) and override the defaults below. Your own skills and instructions keep their priority on how you work. This skill describes how the Layerz tools work and in which order; it states no fact about any business.

## When this applies

First conversation with Layerz, a workspace with no model yet, "what can Layerz do", "where do I start".

## Sequence

1. `layerz_list_models`. Read `workspaces[]` (`has_conventions` says whether a Context is set: read it before the first write) and `models[]`.
2. When `models` is empty, do not stop there. Offer two ways in one sentence:
   - from a template: `layerz_list_templates`, then `layerz_create_model { template_id, timelines }` (a template's `description` is its FINANCE.md, the usage guide);
   - from the business: ask 4 to 6 questions (what the company sells and to whom, how it makes money, stage and size, horizon, who reads the model) and wait for the answers. When the user says to go ahead, build on stated assumptions and list them in the FINANCE.md as open questions.
   - from an existing workbook: `layerz_create_upload_url`, PUT the file, `layerz_parse_file { file_id }` (its `workbook` says what Layerz recalculates, its scenarios and data tables; `guidance` says how to proceed), then `layerz_create_model { file_id, name }`. The import runs after the answer and its report lands in the model's FINANCE.md; a `409 IMPORT_DECISION_REQUIRED` lists the decisions to ask the user (undated period headers), answered through `anchors`. See the Rebuilding a workbook reference.
3. `layerz_get_conventions { workspace_id }` before the first write. `custom_instructions` is the workspace Context: what its members expect of a model (depth, structure, presentation, working style). Follow it; it is theirs.
4. Build in one pass with the `business-plan` skill: `layerz_build_from_blueprint { apply_if_clean: true }`, then `layerz_read { health: true }`, fix every failing check, then `layerz_set_finance_md` and a `glyph` through the `meta` op of `layerz_patch`.
5. End with the model's `url` and three lines: what was built, the assumptions taken, what is left to decide.

## Where a preference goes

When the user states a preference, write it where every agent and every teammate will read it, and say where it went:

- about every model of this workspace (depth, structure, formats, working style): the workspace Context, `layerz_set_custom_instructions { workspace_id, content }`. The write replaces the whole text (3,000 characters at most): read the current one with `layerz_get_conventions` first and keep what is there.
- about this model (currency, units, signs, statement structure, objective, open questions): its FINANCE.md, `layerz_set_finance_md { model_id, content, summary }`.
- about how you work (tone, questions, deliverables): the user's own skills or instructions, not Layerz.

Finance judgement (is the plan credible, what to challenge, what a lender looks at) is not in this plugin: the Layerz cookbook (github.com/layerzlabs/cookbook) has skills for that, which the user installs and adapts.

## References

From the Layerz modeling guide (version 1.3.0; the whole guide: `layerz_get_conventions { include_guide: true }` or the `modeling-guide://reference` resource):

- [1. Session start](references/01-session-start.md)
- [9. Templates](references/09-templates.md)
- [12. Rebuilding a workbook](references/12-rebuilding-a-workbook.md)
