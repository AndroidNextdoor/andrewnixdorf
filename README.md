
# Andrew Nixdorf — Portfolio (Replit + GitHub Pages + CI/CD)

A zero-build, static site optimized for **Replit**, **GitHub Pages**, and a custom domain (**andrewnixdorf.com**). Content is driven by `data/site.config.json`.

## Quick Start (Replit)
1. Create a new Repl → **Import from GitHub** or **Upload this zip**.
2. Click **Run**. Dev server runs at `https://<repl>.replit.dev` (or `localhost:8000`).
3. Edit content in `data/site.config.json`. Most sections update automatically.

## Deploy to GitHub Pages
- This repo ships with `.github/workflows/pages.yml` (official GitHub Pages deployment via Actions).
- Push to **main** → deploys automatically.
- Repo **Settings → Pages**: set **Custom domain** to `andrewnixdorf.com`, then **Enforce HTTPS**.

## DNS (Namecheap) for andrewnixdorf.com
Create these records in **Advanced DNS**:
- A @ → `185.199.108.153`
- A @ → `185.199.109.153`
- A @ → `185.199.110.153`
- A @ → `185.199.111.153`
- CNAME `www` → `<your-username>.github.io`

> Keep only these; remove parking/redirect records. After propagation, Pages will issue SSL and `Enforce HTTPS` can be toggled on.

## CI: Quality Gates on PRs
- `.github/workflows/ci.yml` runs on pull requests to **main**:
  - JSON sanity (jq)
  - Broken links (lychee)
  - Accessibility (pa11y-ci)
  - Lighthouse (performance/SEO/best practices)
- Reports are uploaded as build artifacts.

## Customize
- Brand/meta: `index.html`, `/assets/logo.svg`
- Theme: `css/style.css`
- Projects/Experience: `data/site.config.json`
- Resume: drop a file at `assets/resume.pdf` and update the config link

---
