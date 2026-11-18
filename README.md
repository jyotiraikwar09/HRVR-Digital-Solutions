# HRVR Digital Solutions — Premium Corporate Website

A fully static, enterprise-grade corporate website built with **HTML5 + CSS3 +
Vanilla JavaScript** only. Advanced glassmorphism design, complete dark/light
theming, professional animations, WCAG-oriented accessibility, SEO
fundamentals and a security-first frontend architecture.

> **Note:** the original website ZIP was not available for this build; the
> official specification (sections, content, contact details, portfolio
> projects, statistics) was used as the single source of truth.

---

## Features

- Premium glass navbar with scroll state, active-section tracking and smooth
  anchor navigation
- Responsive mobile drawer (hamburger) with Escape / outside-click closing and
  focus management
- Hero with animated gradient heading, typing animation, technology badges,
  floating orbs, canvas particles and animated statistics counters
  (20+ projects, 18+ clients, 15+ skills, 1.5 yrs — as supplied)
- Tech Stack, Services (8), Portfolio (6 projects with details modal),
  Why Choose Me (6 benefits), CTA, Contact and Footer sections — all content
  preserved verbatim from the specification
- Complete dark & light theme engine: system-preference aware, persisted in
  `localStorage`, no first-paint theme flash (head-loaded `theme.js`)
- Page loader, scroll reveal (IntersectionObserver), toasts, scroll-to-top
- Contact form: full client-side validation, submission lock, timeout,
  network-failure handling, and **honest state reporting** — it never claims
  success unless the configured endpoint actually confirms delivery
- `prefers-reduced-motion` respected across every animation
- Automatic copyright year in the footer

## Project Structure

```
HRVR-Digital-Solutions/
├── index.html
├── css/
│   ├── variables.css      # design tokens (dark defaults)
│   ├── reset.css          # minimal reset + base styles
│   ├── themes.css         # light theme overrides + transitions
│   ├── style.css          # layout, sections, typography
│   ├── components.css     # glass cards, buttons, forms, modal, toasts
│   ├── animations.css     # keyframes, reveal states, reduced motion
│   └── responsive.css     # 1024 / 768 / 480 / 360 / 1920 breakpoints
├── js/
│   ├── main.js            # module bootstrapper
│   ├── config.js          # public runtime config (CONTACT_ENDPOINT)
│   ├── theme.js           # head-loaded theme guard + toggle API
│   ├── navigation.js      # navbar, drawer, active section, footer year
│   ├── animations.js      # loader, reveal, counters, typing, particles
│   ├── interactions.js    # theme toggle, modal, toasts, scroll-top
│   ├── validation.js      # contact form validation rules
│   └── contact.js         # submission pipeline & state handling
├── assets/
│   ├── images/            # (empty — the site uses CSS/SVG visuals only)
│   ├── icons/favicon.svg
│   └── fonts/             # (empty — system font stack, no external fonts)
├── security/SECURITY.md   # security architecture + required HTTP headers
├── tests/
│   ├── test-plan.md
│   ├── manual-checklist.md
│   └── test-report.md     # actual recorded results
└── README.md
```

## Running Locally

No build step, no dependencies, no server required:

1. Download and unzip the project.
2. Open `index.html` in any modern browser.

Optionally serve it (nicer URLs, correct MIME types):

```bash
# any static server works, e.g.
python3 -m http.server 8080     # then open http://localhost:8080
# or
npx serve .
```

## Connecting the Contact Form

The form ships **unconnected on purpose**. To enable real submissions:

1. Choose a form service that accepts JSON POSTs and is designed for public
   endpoint URLs (e.g. Formspree, Web3Forms, or your own API endpoint).
2. Open `js/config.js` and set:
   ```js
   CONTACT_ENDPOINT: "https://your-endpoint.example/f/yourId"
   ```
3. Never put secret keys in this file — see `security/SECURITY.md` for the
   correct pattern (server-side proxy for anything private).
4. Update the `connect-src` / `form-action` entries in your deployed
   Content-Security-Policy header (documented in `security/SECURITY.md`).

While `CONTACT_ENDPOINT` is `null`, the form clearly displays a
"not connected" message with the direct email alternative
(hrvrdigitalsolutions@gmail.com). It never fakes a success message.

## Deployment

Any static host works — GitHub Pages, Netlify, Vercel, Cloudflare Pages,
nginx, Apache. Steps:

1. Upload the project folder (or connect the repo).
2. **Configure HTTP security headers** — copy the exact header block from
   `security/SECURITY.md` into your host's header settings.
3. Set the canonical URL: uncomment the `<link rel="canonical">` and
   `og:url` tags in `index.html` and insert your production domain.
4. Add `sitemap.xml` / `robots.txt` at the host level if desired (guidance in
   `tests/test-plan.md`).
5. Point `CONTACT_ENDPOINT` at your live form endpoint and re-run the contact
   checklist in `tests/manual-checklist.md`.

## Security & Limitations

See `security/SECURITY.md` for the full write-up. Short version: this is a
static frontend — there is no server-side validation, rate limiting or
authentication, and none can be securely provided in a static site. All
frontend-side protections (XSS-safe DOM handling, no secrets, no inline code,
strict CSP guidance) are implemented and documented.

## Browser Support

All evergreen browsers. `backdrop-filter` has a solid-color fallback for
browsers without glass support (`@supports` block in `components.css`).
