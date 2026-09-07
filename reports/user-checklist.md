# User Checklist

- [ ] Open `index.html` and confirm the header appears without waiting for an HTML partial.
- [ ] Open the menu and confirm the five links and exhibition information are unchanged.
- [ ] Close the menu by clicking the mask.
- [ ] Switch between `Ja` and `En` and confirm the active state and language content.
- [ ] Open `artist-statement.html` and confirm the footer links and current year appear.
- [ ] Repeat the footer check on `biography.html`, `contact.html`, and `policy.html`.
- [ ] Confirm the footer still appears when only `js/menu.js` is loaded by the page.
- [ ] Check one desktop and one mobile viewport for clipping or spacing changes.
- [ ] Confirm that the original HTML files remain available as rollback/reference files.

## 2026-09-06 Visual Alignment Check

- [ ] After approved deployment, hard-reload the public `index.html`, `artist-statement.html`, `biography.html`, `gallery.html`, `contact.html`, and `policy.html` pages.
- [ ] Compare the public pages at a desktop width and a mobile width against the local preview.
- [ ] Confirm that the cursor shape, size, color, and hover movement match the local preview.
- [ ] Confirm that the gallery shows the same work count, pagination controls, modal content, and close behavior.
- [ ] Confirm that the menu and footer retain the same links, spacing, language controls, and current year.
- [ ] Record any remaining VANTA warning or missing biography image separately from visual alignment.

## 2026-09-06 Public Browser Evidence

- [x] GitHub Actions completed successfully for the public alignment commit.
- [x] Public mobile gallery checked at `390x844` with the local sidebar structure and fixed positioning.
- [x] Public desktop gallery checked at `1710x895` with the local sidebar structure, gallery, pagination, menu, and footer.
- [x] Public root HTML/CSS resource hashes match the local source files.
- [ ] Repeat the visual check on a physical iOS/Android device and with physical mouse/touch input.

## 2026-09-06 Cursor Visual Check

- [ ] Hard-reload the local and public pages before comparing the cursor.
- [ ] Confirm the 8px white dot and 15px ring appear together on desktop.
- [ ] Confirm the ring glow animation and hover enlargement match the local preview.
- [ ] Confirm the native cursor remains hidden while the custom cursor follows the pointer.
- [ ] Confirm mobile/touch pages have no unintended cursor artifact.
- [x] Confirm the cursor deployment completed successfully and the public biography page loads the versioned cursor assets.

## 2026-09-06 Responsive Typography Check

- [ ] Check `index.html`, `artist-statement.html`, `biography.html`, `gallery.html`, `contact.html`, and `policy.html` locally at 320px, 390px, 768px, 1024px, and desktop widths.
- [ ] Confirm headings and body text keep the intended hierarchy and largest existing desktop size.
- [ ] Confirm Japanese and English text do not clip or produce unintended horizontal overflow.
- [ ] Open the menu and footer and confirm link spacing remains unchanged.
- [ ] Open gallery/contact modals and confirm their text, close controls, and scroll behavior remain usable.
- [ ] Check the contact form, biography table, timeline, captions, and pagination on a narrow viewport.
- [ ] Repeat the check on a physical iOS/Android device or record it as pending.

## 2026-09-07 Responsive Width Check

- [ ] Check `index.html`, `artist-statement.html`, `biography.html`, `gallery.html`, `contact.html`, `policy.html`, and the matching page at 320px, 390px, 600px, 768px, 1024px, and desktop widths.
- [x] Confirm the local Biography page loads at desktop width without a layout-breaking error.
- [x] Confirm the local Biography page text wraps within a 390px viewport.
- [x] Confirm the local Contact page does not show a fixed-width form overflow at a 390px viewport.
- [ ] Open the gallery modal at a narrow width and confirm its content, image, padding, and close control remain usable.
- [ ] Confirm footer padding and menu offset at tablet widths between the mobile and desktop breakpoints.
- [ ] Repeat the width check on generated `docs` pages after an approved production build and deployment.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 Mobile Gallery 90% Check

- [x] Confirm the mobile wrapper uses a 90% width basis.
- [x] Confirm `calc()` and `clamp()` are present in the mobile width rule.
- [x] Confirm JavaScript syntax, local references, and focused whitespace checks pass.
- [ ] Check 320px, 390px, and 599px rendered widths for overflow.
- [ ] Confirm the two-column gallery and pagination remain usable on a physical mobile device.
- [ ] Push and verify the public site after explicit approval.

## 2026-09-07 Gallery 55% and Footer Width Check

- [x] Confirm the local gallery renders after the width correction.
- [x] Confirm the desktop gallery rule is approximately 55% and mobile override is 100%.
- [x] Confirm footer container and footer element use the full available width.
- [x] Confirm JavaScript syntax, local references, and focused whitespace checks pass.
- [ ] Check gallery and footer at 320px, 390px, 600px, 768px, 1024px, and desktop widths.
- [ ] Rebuild and inspect generated `docs/` after reviewing unrelated generated changes.
- [ ] Push and verify the public site after explicit approval.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 Sidebar JS/CSS and Width Check

- [x] Confirm the local gallery renders the sidebar from `menu.js` without fetching `sidebar.html`.
- [x] Confirm the local gallery renders category items, artwork, pagination, header, and footer.
- [x] Confirm JavaScript syntax, local references, and focused whitespace checks pass.
- [ ] Check gallery/sidebar/footer at 320px, 390px, 600px, 768px, 1024px, and desktop widths.
- [ ] Confirm category filtering, pagination, modal, language switching, and sidebar collapse behavior after a hard reload.
- [ ] Rebuild and inspect generated `docs/` output after reviewing unrelated generated changes.
- [ ] Push and verify the public site after explicit approval.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.

## 2026-09-07 JavaScript Integration Check

- [x] Confirm p5 is retained because the existing VANTA.TRUNK background depends on it.
- [x] Confirm the six root pages load common cursor, loading, header, and footer behavior through `menu.js`.
- [x] Confirm gallery sidebar loading and category setup work through `page-nation.js`.
- [ ] Hard-reload all six local pages and compare cursor, menu, footer, and page-specific effects at desktop and mobile widths.
- [ ] Confirm that gallery filtering, pagination, modal open/close, and sidebar collapse remain unchanged.
- [ ] If complete deletion is wanted, provide explicit approval before removing the retained compatibility files.
- [ ] Repeat the checks on the generated `docs` pages after an approved rebuild and deployment.
- [ ] Perform physical Safari/iOS/Android and touch-device acceptance.
