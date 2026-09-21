# Delete candidates — 2026-09-21

These files were moved here for quarantine only. They have **not** been deleted.

## Why they are here
The current portfolio source/build/runtime audit found no active production dependency for these files. The set includes:
- the legacy `src/public/` copy tree
- obsolete Jekyll-era files
- standalone experiment/test HTML pages
- root/source duplicate portfolio pages that are no longer authoritative
- CSS used only by the obsolete Jekyll layout
- root JavaScript files not used by the current public page asset graph or Webpack allowlist
- an old local Git memo

## Safety
The original relative path is preserved below this directory, so any file can be restored by moving it back to the repository root.

Do not treat files in this directory as production source. Current source-of-truth rules in `SITE_MAP.md`, `PORTFOLIO_MASTER_SPEC.md`, and `AGENTS.md` take priority.

## Audit size
- Files quarantined: 226
- Original total size: approximately 32.77 MB
