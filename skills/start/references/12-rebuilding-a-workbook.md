# 12. Rebuilding a workbook

> Section 12 of the Layerz modeling guide, version 1.1.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

The target is the same results as the source, not the same cells. A
workbook spells a model out cell by cell; the same work in Layerz primitives is
an order of magnitude smaller (a restructuring workbook of 11 sheets rebuilds
in about 600 items, identical to Excel in every scenario).

| Excel construction | Layerz primitive |
|---|---|
| A block of rows repeated per creditor, client or case | One list-mode line on a list (§ 5) |
| Groups of rows summed | `mapped_to` on the list, `Item[\`Group\`]` |
| A selector cell read by `CHOOSE`, `INDEX` or `IF` | Branches overriding the selector's input (§ 7) |
| A table whose columns are metrics, not periods | Constant list-mode items, or a mini-table on the list |
| A monthly row that switches to reading the yearly column | A cross-grain reference under `IF(CURRENT_PERIOD >= …)`, or `YTD` |
| Guards (`IFERROR`, `ISNUMBER`, `NA()`) | Nothing: the formula language has no error values |
| Computed dates (`EDATE`, `EOMONTH`) | The timeline and `CURRENT_PERIOD` |

- **A value is not always an input.** A pasted or frozen block that the
  workbook computed elsewhere (a macro output, a data table, a copied
  scenario) is a result: rebuild the rule that produced it. A constant that
  changes between scenarios is a rule, not an input.
- **The import map.** `layerz_parse_file` (`workbook`) and the result of
  `layerz_create_model { file_id }` (`import.structures`) list the scenario
  selectors with their scenarios, the value lines that hide a scenario rule,
  the pasted results, the two-regime rows and the lists.
- **Slice by slice.** Build one statement or schedule, then compare its key
  lines with the source recalculated in every scenario before moving on:
  `layerz_diff { source: { set: { "Sheet!D16": 1 } }, branch_id }` computes the
  model on the scenario's branch and the workbook with the selector set
  (`source.refs` links a rebuilt line to its source range).
  `layerz_patch { dry_run: true, compare_values: true }` previews the numbers
  a batch moves.
- **Keep the objective honest.** The FINANCE.md states what the model computes,
  not that it replicates the workbook cell for cell.
