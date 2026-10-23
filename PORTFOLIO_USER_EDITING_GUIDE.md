# Portfolio user editing environment

This isolated VS Code worktree is based on the published Portfolio main. Changes made here stay local until they are reviewed through a pull request and deployed by GitHub Pages. Saving a file or opening the local preview does not publish it.

## Source of truth

| Content | Edit this source | Generated output |
| --- | --- | --- |
| Home | `index.html` | `docs/index.html` |
| Biography | `biography.html` | `docs/biography.html` |
| Artist Statement | `artist-statement.html` | `docs/artist-statement.html` |
| Information | `src/information.html` | `docs/information.html` |
| Yurayura detail | `src/exhibitions/yurayura/index.html` | `docs/exhibitions/yurayura/index.html` |
| Header / Footer markup | `src/components/header.html`, `src/components/footer.html` | Synced into `js/menu.js` by the build |
| Shared and page styles | `css/` and the imported files listed in `SITE_MAP.md` | Copied to `docs/css/` |
| Typography controls | `assets/css/user-settings.css`, section `USER EDITABLE — TYPOGRAPHY` | Included by the build |

`docs/` is generated deployment output. Do not edit it by hand. Edit the source, then build and inspect the generated page.

## Local preview

1. In VS Code, open the Command Palette with `Cmd+Shift+P`.
2. Open the Yuruyura `assets/data/exhibitions.json` file in a VS Code editor tab, and keep the Portfolio editing folder as the workspace. Use that tab to edit the one data source and the Portfolio workspace to build and preview the result.
3. For Portfolio HTML/CSS edits, choose `Tasks: Run Task` → `Portfolio: Build generated site`. For a Yuruyura JSON-only edit, skip the build; the preview reads that JSON file directly.
4. Run `Tasks: Run Task` → `Portfolio: Preview generated site`.
5. Open `http://127.0.0.1:4174/website/`. The preview task prints this URL in its terminal. Stop the server with the terminal's stop button or `Ctrl+C`.
6. Use `Portfolio: Full quality checks` before handing a change to Codex for release review.

The preview server serves the generated `docs/` tree under the same `/website/` path used by GitHub Pages.

## Safe editing and release

Keep this worktree separate from the formal checkout and the existing Gallery WIP. Ask Codex to review the source diff, rebuild `docs/`, run `npm run check`, and run the relevant Visual Regression before release. Do not commit directly to `main`; use a reviewed isolated branch and pull request. Font-size tuning remains under the user's control. The cross-site exhibition data feed is implemented as described below.

## Yurayura event data and automatic Portfolio updates

The single public authoring source is `assets/data/exhibitions.json` in the isolated Yurayura editing worktree:
`/Users/mizu/.codex/worktrees/yurayura-cross-site-events/assets/data/exhibitions.json`.
Edit one event record there. `city`, `venue`, `startsAt`, and `endsAt` may be `null` only when the information is genuinely unconfirmed; an event with no dates remains explicitly undated. Keep date-time values offset-aware (normally `+09:00`). Set `published: true` only after the event and its copy are approved for public display.

Keep the public facts in the common fields and the two editorial voices separate under `copy.yurayura` and `copy.portfolio`. Both `ja` and `en` are required for both sites. Yurayura's current Information page remains Japanese-led; Portfolio's Information language switch renders only `copy.portfolio` in the selected language. Do not put internal notes, private contact details, unapproved recruitment conditions, or HTML into the public JSON. The public-data validator applies an allowlist; `node scripts/export-public-events.cjs --check` validates the canonical JSON without writing files.

After editing, validate Yurayura locally with `node --test tests/exhibition-state.test.cjs` and `node scripts/export-public-events.cjs --check`. For a local official-site preview, run `python3 -m http.server 8000 --bind 127.0.0.1 --directory /Users/mizu/.codex/worktrees/yurayura-cross-site-events` from the Yurayura folder and open `http://127.0.0.1:8000/information.html`. In the Portfolio workspace, run `Portfolio: Build generated site`, then `Portfolio: Preview generated site`; this preview reads the same local JSON path and opens at `http://127.0.0.1:4174/website/`.

Only publishing the approved Yurayura data to its GitHub Pages site changes the public feed. Portfolio fetches that public JSON on each Information page visit, so ordinary event updates need no Portfolio commit or redeploy. GitHub Pages currently advertises a 10-minute cache lifetime; the Portfolio request bypasses the browser cache and adds a time-based query value, but a CDN may still delay a new value. Confirm the updated public JSON first, then reload Portfolio Information and check both languages. If retrieval or validation fails, the page reports that the current schedule could not be checked and retains the existing first-edition archive.
