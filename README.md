# Azure Stores Sales Forecast Dashboard

A self-contained sales forecasting dashboard for the 6 Azure Stores (3116, 3802, 3882, 5161, 5166, 8604),
deployed as a [Cloudflare Worker](https://developers.cloudflare.com/workers/) using
[Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).

The page itself (`public/index.html`) is a single static file — all data, styling, and logic are
inlined, so it serves instantly from Cloudflare's edge with no build step and no external requests
except Google Fonts. `src/index.js` is a minimal Worker entry point that currently just passes every
request through to that static file; it's there so you have a place to add server-side logic later
(a JSON API, scheduled regeneration from a database, auth, etc.) without restructuring the project.

## What's in here

```
.
├── public/
│   └── index.html      # the dashboard — forecast tables, Labor Plan, accuracy tracker, theme switcher
├── src/
│   └── index.js         # Worker entry point (currently: serve the static asset)
├── wrangler.toml         # Cloudflare Worker + static assets configuration
├── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (the free tier works fine for this)
- [`wrangler`](https://developers.cloudflare.com/workers/wrangler/) (installed automatically via `npm install`, or globally with `npm install -g wrangler`)

## Local development

```bash
npm install
npm run dev
```

This starts a local server (default `http://localhost:8787`) serving the dashboard exactly as it
will run in production.

## Deploy to Cloudflare

```bash
npx wrangler login    # one-time: authenticates wrangler with your Cloudflare account
npm run deploy
```

The first deploy will publish to `https://azure-forecast-dashboard.<your-subdomain>.workers.dev`.
To use a custom domain instead, see
[Custom Domains for Workers](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

## Updating the dashboard

The dashboard's data (forecasts, actuals, Labor Plan figures) is currently baked directly into
`public/index.html` as JavaScript constants (`DATA`, `LABOR_DATA`, `ACTUALS`, etc.) near the top of
the `<script>` block. To publish a new week's forecast or record a new week's actuals, edit those
constants directly and redeploy with `npm run deploy` — there's no database or build step in this
version.

If you outgrow that (e.g. you want the numbers to come from a spreadsheet or database instead of
being hand-edited), that's exactly what `src/index.js` is for — add an API route there backed by
[Workers KV](https://developers.cloudflare.com/kv/) or [D1](https://developers.cloudflare.com/d1/),
and have the page fetch from it instead of reading the inlined constants.

## Pushing this to GitHub

This project isn't in a Git repo yet. To publish it as one:

```bash
cd azure-forecast-worker
git init
git add .
git commit -m "Initial commit: Azure Stores forecast dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

(Create the empty repo on GitHub first — via the website, or `gh repo create <your-repo-name> --private --source=. --remote=origin` if you have the GitHub CLI installed and authenticated.)

From there, you can also wire up
[Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) to auto-deploy
on every push to `main`, instead of deploying manually with `wrangler deploy`.
