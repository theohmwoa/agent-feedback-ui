# agent-ui site

Vite + React + TypeScript. The catalog source AND the docs site share this project — `src/components/<slug>/` is what the CLI ships, `src/chrome/` and `src/pages/` are docs-site-only.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # writes dist/
npm run preview  # serves dist/ locally
```

## Adding a new component

1. Create a folder in `src/components/<slug>/`:
   - `index.tsx` — the React component (this is what users copy)
   - `types.ts` — public types + intent default
   - `meta.ts` — display name, accent, summary, status
   - `usage.ts` — code snippet for the Usage tab + props table
2. Wire it into `src/registry.ts` (one entry in `STABLE`).
3. Add a card preview to `src/chrome/browser.tsx`'s `CardPreview` if you want a custom thumbnail (otherwise the generic placeholder is used).

That's it — landing grid, command palette, `/c/<slug>` page, share link, install command, code block all light up automatically.

## Layout

```
src/
  components/         # the catalog — these are what `npx agent-ui add` copies
    email-compose/
    slack-message/
    linear-issue/
  chrome/             # docs-site-only UI (nav, hero, palette, etc.)
  hooks/
  pages/              # /, /c/:slug, 404
  registry.ts         # single source of truth
  types.ts            # ReviewResult, AgentMeta
  theme.css           # tokens + Prism overrides
  app.tsx
  main.tsx
public/
  404.html            # GH Pages SPA fallback
```

## Deploy

`.github/workflows/deploy-playground.yml` builds and ships `site/dist` to GitHub Pages on every push to `main`.

GH Pages is mounted under `/agent-feedback-ui/` — Vite's `base` and React Router's `basename` are set to that in production. Locally everything runs at `/`.
