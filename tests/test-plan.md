# HRVR Digital Solutions — Test Plan

## Scope
Verify structure, styling, behavior, security posture and responsiveness of
the static site across the specification's supported viewports
(320 → 1920+ px).

## 1. Automated / Static Checks (runnable in CI or sandbox)
| # | Check | Method |
|---|-------|--------|
| A1 | Every JS file parses without syntax errors | `node --check js/*.js` |
| A2 | No duplicate element IDs | HTML parse + id histogram |
| A3 | No broken internal anchors | Compare every `href="#x"` against existing `id="x"` |
| A4 | No `innerHTML` usage | grep source |
| A5 | No `eval` / `new Function` | grep source |
| A6 | No inline event handlers (`onclick=` etc.) | grep source |
| A7 | Theme guard applies theme before paint | `theme.js` loaded in `<head>`, sets `data-theme` |
| A8 | Contact endpoint not invented | `config.js` ships `CONTACT_ENDPOINT: null` |

## 2. Functional (manual — browser)
- Navigation: sticky state, active tracking, smooth anchors, mobile drawer
  (open, close via link / outside click / Escape), Hire Me button
- Theme: first-visit system preference, toggle both directions, persistence,
  no flash, all components readable in both themes
- Animations: loader dismissal, hero entrance, typing cycle (all 5 phrases),
  counters (20/18/15/1.5), scroll reveal, card hover, reduced-motion mode
- Portfolio modal: open with correct data, close via X / overlay / Escape,
  focus restoration, DM link navigation
- Contact form: validation per field, error clearing on input, character
  counter, not-connected notice (no endpoint), submission lock, timeout and
  network failure handling, success only on real 2xx, reset only after success
- Scroll-to-top visibility and behavior; footer year auto-update

## 3. Responsive (manual)
Widths to verify: 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920.
Check: no horizontal overflow, no clipped text, grids reflow, drawer works,
touch targets ≥ ~44px.

## 4. Accessibility (manual)
Keyboard-only walkthrough, visible focus indicators, dialog semantics,
`aria-live` status messages, heading hierarchy, contrast in both themes.

## 5. Performance & SEO (manual, Lighthouse)
Aim: strong mobile/desktop scores; verify title/meta description/OG tags,
favicon, semantic headings, no layout shift from fonts (system stack), lazy
canvas cost bounded (≤ 46 particles, pauses when tab hidden).

## Deployment-level items (host configuration, not testable statically)
- Security headers per `security/SECURITY.md`
- HTTPS enforcement + HSTS
- `robots.txt` / `sitemap.xml` with the production domain
- Canonical URL uncommented with the real domain
