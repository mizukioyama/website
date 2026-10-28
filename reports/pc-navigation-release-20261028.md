# PC menu and sidebar release — Linux review

The user authorized publishing the previously reviewed PC header and six-page sidebar after all release gates pass. The release excludes unrelated Gallery work and private review packages.

## Initial Linux CI

- PR: https://github.com/mizukioyama/website/pull/39
- CI: https://github.com/mizukioyama/website/actions/runs/40609471085
- Candidate: 792d50954172e3c8dbac81d548a9f02bc80fe766, based on a024cd12c8e83a48dcc39ab213aa7fff46ae5275.
- Clean repository checks/build: PASS. Browser suite: 264 PASS / 124 existing conditional SKIP / 4 screenshot FAIL. All four failures are desktop-1440 screenshot comparisons.
- Reviewed artifact: 12783111277, SHA-256 039ff62fd2ebe6f0370e2f7c487f5d3eeffff2cfdd1386bef5573105cf93646e.

## Individually reviewed reference adoption

| Reference | Classification and reason |
| --- | --- |
| home-desktop-1440-linux.png | Intentional PC header: left brand with period and language below, fluid six-column right menu/rule. Home composition, creator placement and slideshow are preserved. |
| 404-desktop-1440-linux.png | Intentional shared-header change. Recovery content, background, Footer and total page height are preserved. |
| biography-desktop-1440-linux.png | Intentional shared header and Reading Nav moving out of article flow into the fixed sidebar. Article height decreases by 144px (12135 to 11991); approved body text and typography checks pass. |
| artist-statement-desktop-1440-linux.png | Intentional shared header and Reading Nav moving out of article flow into the fixed sidebar. Article height decreases by 92px (7104 to 7012); statement and all five questions remain intact. |

Baseline, Actual and Diff were inspected, including top, body and Footer. Only these four original Linux Actual files were adopted. The other 16 references, including all 10 mobile references, remain unchanged. No thresholds, tests or production animation were weakened to obtain a pass. macOS differences were not adopted.

## Release gates

Final full Linux CI, Pages deployment and post-deployment Linux checks must pass before reporting production verified. Existing CI now runs a real public-URL check after a successful Pages deployment: generated HTML/CSS/JS byte identity, ten routes at 1920/1440/1024/390, native anchors/history, language/mobile menu, Gallery filter/modal, Home slide timers, live JSON and motion lifecycle. Its local rehearsal passed 40 route/viewport cases and 12 byte comparisons with no JavaScript page errors.

All existing working checkouts, WIP, untracked files and stash are preserved. Typography, body wording, artwork, Gallery data and background sources are unchanged. Physical-device acceptance remains pending with the user. Additional cost: zero.
