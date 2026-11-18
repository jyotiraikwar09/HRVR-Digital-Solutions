# HRVR Digital Solutions — Security Documentation

This is a **static frontend** (HTML5 + CSS3 + Vanilla JavaScript). Static
frontends **cannot be made completely secure**: there is no server-side
validation, authorization or rate limiting in the browser. Everything below
minimizes *frontend* risk; a proper deployment adds the server-side half.

---

## 1. Implemented Frontend Security Controls

### XSS prevention
- All dynamic content is written with `textContent` or built with
  `createElement` — **no `innerHTML`, no HTML string concatenation** anywhere.
- No `eval()`, no `new Function()`, no dynamically generated scripts.
- No inline event handlers (`onclick=` etc.) — all listeners are attached in JS.
- No `javascript:` URLs; all links are `#section` anchors, `mailto:` or none.
- Portfolio project metadata is stored in `data-project` JSON attributes and
  parsed with `JSON.parse` inside try/catch; malformed data is discarded, and
  only string fields are rendered via `textContent`.
- External links opened in new tabs use `rel="noopener noreferrer"`.

### Form security
- Client-side validation (required fields, e-mail format, length limits) is for
  **usability only** — the configured form service MUST re-validate everything
  server-side.
- Submitted values are **never** placed in URL parameters and **never** stored
  in `localStorage` or `sessionStorage`.
- Duplicate submission lock (`isSubmitting` flag) + disabled submit button.
- Request timeout (15 s, `AbortController`) and network-failure handling.
- Raw server error bodies are never shown to the user — only generic messages.
- The form resets **only after the endpoint confirms an HTTP 2xx response**.
  With no endpoint configured, the form displays a "not connected" notice and
  the direct e-mail alternative. No success message is ever faked.

### Secrets
- No API keys, tokens, passwords or private credentials exist anywhere in this
  repository. `js/config.js` holds only public-by-design values.
- If you adopt a form service (Formspree, Web3Forms, your own API…), use a
  service designed for public endpoint URLs. If your provider issues a
  *secret* key, keep it server-side (a small serverless function proxy) —
  never commit it to the frontend.

---

## 2. Required HTTP Security Headers (deployment level)

A `<meta http-equiv="Content-Security-Policy">` tag is **not** equivalent to
real headers and is intentionally not used. Configure these headers on your
host (nginx, Netlify `_headers`, Vercel `vercel.json`, Cloudflare Pages, …):

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src '<YOUR-FORM-ENDPOINT>'; object-src 'none'; base-uri 'self'; form-action '<YOUR-FORM-ENDPOINT>'; frame-ancestors 'none'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
X-Frame-Options: DENY
```

Notes:
- `script-src 'self'` works because the site loads **no inline scripts and no
  CDN scripts** (all JS is external and local).
- After configuring a form endpoint, replace `<YOUR-FORM-ENDPOINT>` in
  `connect-src` and `form-action` with the real origin.
- The site currently loads no external fonts or icon CDNs, so `font-src`/`style-src`
  can stay `'self'` only.

---

## 3. Privacy
- No analytics, tracking, fingerprinting or third-party scripts.
- The only stored value is the theme preference (`hrvr-theme` in
  `localStorage`) — a non-personal UI setting.
- Contact form data goes only to the endpoint you configure.

---

## 4. Known Static-Frontend Limitations (do not fake these)
- No server-side input validation, rate limiting or spam protection — the form
  service must provide these.
- No authentication, admin panel, database, payments or user accounts (none are
  implemented, and none can be made secure in a pure static site).
- Email delivery depends entirely on the configured external form service.

## 5. Reporting
Found a security issue? Email **hrvrdigitalsolutions@gmail.com**.
