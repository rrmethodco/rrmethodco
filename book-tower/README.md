# Book Tower — Management Cost Intelligence

Self-contained static dashboard for mapping Book Tower's leadership/management
payroll against revenue. No build step, no dependencies, no API keys — open
`index.html` and it runs.

Rebuilt from the original single-file prototype into three plain files
(`index.html` + `styles.css` + `app.js`). The CSS and JS are byte-for-byte the
original; only the inline `<style>`/`<script>` were split out into linked files.

## Run locally

It's a static site. Either open `index.html` directly, or serve the folder:

```bash
cd book-tower
python3 -m http.server 8000
# open http://localhost:8000
```

## Views

Navigate via the left rail or the scope dropdown at the top.

- **Overview** — KPIs (total management cost, mapped positions, cost % of
  revenue, open-role budget), division summary table, cost-by-division bars,
  and structure/recruiting insights.
- **Org & cost map** — interactive reporting-line tree with mapped salary on
  each node; click a node to expand/collapse, or use Expand all / Collapse to
  divisions.
- **Allocation drivers** — editable model. Adjust each role's salary and the
  percent split across outlets (ROOST, Le Supreme, Hiroki-San, Kampers,
  Anthology) and revenue per outlet; FOH/BOH/Sales category rollups and cost
  ratios recompute live. Save / Revert / Reset to defaults.
- **F&B Management / F&B Hourly / F&B Total Labor** — salaried, hourly, and
  all-in labor by outlet with FOH/BOH/Sales benchmarks by venue type, variance
  vs. target, expandable person-level rows, and grouped/stacked SVG charts.
- **By division** — Food & Beverage, Sales, ROOST, Shared Services, Executive
  Leadership detail tables (sortable by salary).
- **Outlet efficiency** — F&B revenue-bearing outlets vs. blended cost-ratio
  benchmark, plus overhead.

## Data & persistence

All figures live in `app.js` (`DIVISIONS`, `ORG`, `DEFAULT_PEOPLE`,
`DEFAULT_REV`, `FB_HOURLY`, benchmarks, etc.) — edit there to change the model.

Allocation-driver edits persist via `window.storage` when the report is opened
inside Claude. In a plain browser / static host, edits are kept for the current
session only (the app shows a banner noting this) — `Save` then snapshots
in-memory rather than cross-session.

## Deploy

Includes `netlify.toml` (publish `.`, no build command). Any static host works
— it's just three files plus the two config docs.

## Files

```
book-tower/
├── index.html    # markup + nav shell + view containers
├── styles.css    # all styling (design tokens, tables, org tree, charts)
├── app.js        # data model, rendering, routing, interactivity
├── netlify.toml  # static deploy config
└── README.md
```
