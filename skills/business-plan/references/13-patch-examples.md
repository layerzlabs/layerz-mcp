# 13. Patch examples

> Section 13 of the Layerz modeling guide, version 0.6.0, copied verbatim by `scripts/build-plugin-skills.ts`. The formula language is `formula-spec://reference` (inline: `layerz_get_conventions { include_formula_spec: true }`).

### tab order: a dashboard first, a section placed after the P&L, a tab moved

```json
{
  "ops": [
    {
      "op": "create",
      "role": "dashboard",
      "name": "Summary",
      "id": "_sum",
      "before": "dsh00001"
    },
    {
      "op": "create",
      "role": "section",
      "name": "Inventory",
      "after": "sec00001"
    },
    {
      "op": "move",
      "uid": "sec00003",
      "before": "sec00002"
    }
  ]
}
```

### section with children via temp id

```json
{
  "ops": [
    {
      "op": "create",
      "role": "section",
      "name": "P&L",
      "id": "_pl"
    },
    {
      "op": "create",
      "role": "assumption",
      "name": "Revenue",
      "parent": "_pl",
      "timeline_ref": "monthly",
      "value": 1000
    },
    {
      "op": "create",
      "role": "formula",
      "name": "Gross Margin",
      "parent": "_pl",
      "formula": "Revenue - COGS"
    }
  ]
}
```

### nested section (true sub-section, no computed value)

```json
{
  "ops": [
    {
      "op": "create",
      "role": "section",
      "name": "Revenue",
      "id": "_rev"
    },
    {
      "op": "create",
      "role": "section",
      "name": "Subscription",
      "parent": "_rev",
      "id": "_sub"
    },
    {
      "op": "create",
      "role": "assumption",
      "name": "MRR",
      "parent": "_sub",
      "timeline_ref": "monthly",
      "value": 50000
    }
  ]
}
```

### atomic swap via replace

```json
{
  "ops": [
    {
      "op": "replace",
      "from_uid": "rev12345",
      "new_item": {
        "role": "formula",
        "name": "Revenue",
        "formula": "price123 * vol123"
      }
    }
  ]
}
```

### stock-flow: balance with flow callup

```json
{
  "ops": [
    {
      "op": "create",
      "role": "balance",
      "name": "Cash EoP",
      "opening_balance": 1500000,
      "id": "_cash"
    },
    {
      "op": "create",
      "role": "formula",
      "name": "Net Cash Change",
      "formula": "Operating CF + Investing CF + Financing CF",
      "timeline_ref": "monthly",
      "id": "_flow"
    },
    {
      "op": "create",
      "role": "callup",
      "name": "Net Cash Change",
      "source": "_flow",
      "parent": "_cash"
    }
  ]
}
```

### list-mode: assumption keyed by RH function

```json
{
  "ops": [
    {
      "op": "list_create",
      "name": "Functions",
      "items": [
        {
          "label": "Engineering"
        },
        {
          "label": "Sales"
        },
        {
          "label": "G&A"
        }
      ]
    },
    {
      "op": "create",
      "role": "assumption",
      "name": "Salaries by Function",
      "timeline_ref": "yearly",
      "liste_ref": "Functions",
      "timeline_values": {
        "Engineering": [
          1200000,
          1500000
        ],
        "Sales": [
          800000,
          950000
        ],
        "G&A": [
          400000,
          420000
        ]
      }
    }
  ]
}
```

### balance-list: debt tranches roll-forward

```json
{
  "ops": [
    {
      "op": "list_create",
      "name": "Debt Tranches",
      "items": [
        {
          "label": "Senior"
        },
        {
          "label": "Mezzanine"
        }
      ]
    },
    {
      "op": "create",
      "role": "balance",
      "name": "Debt Outstanding",
      "liste_ref": "Debt Tranches",
      "timeline_values": {
        "Senior": [
          10000000
        ],
        "Mezzanine": [
          3000000
        ]
      },
      "id": "_debt"
    },
    {
      "op": "create",
      "role": "formula",
      "name": "Drawdowns",
      "timeline_ref": "yearly",
      "liste_ref": "Debt Tranches",
      "timeline_values": {
        "Senior": [
          500000,
          0
        ],
        "Mezzanine": [
          0,
          200000
        ]
      },
      "parent": "_debt"
    },
    {
      "op": "create",
      "role": "formula",
      "name": "Repayments",
      "timeline_ref": "yearly",
      "liste_ref": "Debt Tranches",
      "timeline_values": {
        "Senior": [
          -300000,
          -300000
        ],
        "Mezzanine": [
          0,
          -100000
        ]
      },
      "parent": "_debt"
    }
  ]
}
```

### cohorts: retention via LIST_INDEX + variable lag

```json
{
  "ops": [
    {
      "op": "list_create",
      "id": "_cohorts",
      "name": "Cohorts",
      "items": [
        {
          "id": "_c1",
          "label": "Jan 26"
        },
        {
          "id": "_c2",
          "label": "Feb 26"
        },
        {
          "id": "_c3",
          "label": "Mar 26"
        }
      ]
    },
    {
      "op": "create",
      "id": "_curve",
      "role": "assumption",
      "name": "RetentionCurve",
      "timeline_ref": "monthly",
      "values": [
        1,
        0.8,
        0.65,
        0.52
      ]
    },
    {
      "op": "create",
      "id": "_age",
      "role": "formula",
      "name": "CohortAge",
      "liste_ref": "_cohorts",
      "timeline_ref": "monthly",
      "formula": "LIST_INDEX"
    },
    {
      "op": "create",
      "id": "_new",
      "role": "assumption",
      "name": "New Customers",
      "liste_ref": "_cohorts",
      "timeline_ref": "constant",
      "timeline_values": {
        "_c1": [
          120
        ],
        "_c2": [
          140
        ],
        "_c3": [
          160
        ]
      }
    },
    {
      "op": "create",
      "role": "formula",
      "name": "Active Customers",
      "liste_ref": "_cohorts",
      "timeline_ref": "monthly",
      "formula": "`New Customers`[i] * RetentionCurve_M-$CohortAge"
    }
  ]
}
```

### scenario overlay: write one value on a branch (no data source)

```json
{
  "ops": [
    {
      "op": "update",
      "uid": "tick1234",
      "timeline_values": {
        "2027": [
          1.1
        ]
      }
    }
  ]
}
```
