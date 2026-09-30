/**
 * Azure Stores Sales Forecast dashboard — Cloudflare Worker entry point.
 *
 * The dashboard itself is a static, self-contained HTML file served straight from
 * the `public/` assets directory (see `[assets]` in wrangler.toml) — Cloudflare
 * serves it directly from the edge with no JS execution needed for the common case.
 *
 * This worker script exists as the `main` entry so you have a place to add
 * server-side logic later without restructuring the project — for example:
 *   - an API route (e.g. /api/forecast) that returns live JSON instead of the
 *     hardcoded DATA/LABOR_DATA/ACTUALS constants baked into index.html
 *   - scheduled (cron) regeneration of the forecast from a KV or D1 store
 *   - auth in front of the dashboard (e.g. Cloudflare Access, or a simple check here)
 *
 * Until you need any of that, this just falls through to the static asset for
 * every request, which is the same as not having a worker script at all.
 */
export default {
  async fetch(request, env, ctx) {
    // Example of where you'd branch for an API route:
    // const url = new URL(request.url);
    // if (url.pathname.startsWith("/api/")) {
    //   return new Response(JSON.stringify({ ok: true }), {
    //     headers: { "content-type": "application/json" },
    //   });
    // }

    // Everything else (including "/") is served from public/index.html via the
    // ASSETS binding configured in wrangler.toml.
    return env.ASSETS.fetch(request);
  },
};
