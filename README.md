# website

Portfolio website built with Webpack and deployed to GitHub Pages.

## Structure

- `src/`: source HTML, JavaScript, styles, and assets
- `src/public/`: files copied unchanged to the published site
- `scripts/`: local validation scripts
- `.github/workflows/`: GitHub Pages build and deployment
- `docs/`: generated build output (not committed)

## Commands

```bash
npm ci
npm run check
npm run dev
```

Edit files in `src/`. The deployment workflow builds `docs/` automatically, so generated files should not be edited directly.
