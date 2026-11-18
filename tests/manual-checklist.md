# HRVR Digital Solutions — Manual Test Checklist

Legend: `[ ]` = not yet tested. Mark only what you actually verified.
(Test results recorded in `tests/test-report.md` — automated checks already
run are documented there; everything below is manual browser testing.)

## 1. Layout & Responsiveness
- [ ] 320px: no horizontal scroll, all text readable, no clipped elements
- [ ] 360px / 375px / 390px / 430px: stats grid, hero buttons and cards stack correctly
- [ ] 768px: hamburger menu appears; drawer opens/closes smoothly
- [ ] 1024px: contact section becomes single column
- [ ] 1280px / 1440px / 1920px: grids max out at container width, content centered
- [ ] No overlapping content or broken cards at any tested width

## 2. Navigation
- [ ] Sticky navbar appears with glass background after scrolling
- [ ] All 6 nav links scroll to the correct section
- [ ] Active link indicator follows the section while scrolling
- [ ] "Hire Me" button scrolls to Contact
- [ ] Mobile: hamburger toggles menu; closes on link click, outside click, and Escape
- [ ] Tab order is logical; focus outline visible on all controls

## 3. Theme
- [ ] First visit honors system `prefers-color-scheme`
- [ ] Toggle switches dark ⇄ light with a smooth transition and no flash of wrong theme
- [ ] Choice persists after reload
- [ ] Every section readable in both themes (hero, cards, form, footer, modal, toasts)

## 4. Animations
- [ ] Page loader appears and disappears (max ~3 s even on slow load)
- [ ] Hero elements animate in staggered
- [ ] Typing animation cycles through all 5 phrases
- [ ] Counters animate to 20+ / 18+ / 15+ / 1.5 Yrs when scrolled into view
- [ ] Sections reveal on scroll; cards lift on hover
- [ ] OS "reduce motion" enabled: animations are effectively disabled

## 5. Portfolio Modal
- [ ] "View Details" opens modal with correct title, status and tech badges
- [ ] Close works via: X button, overlay click, Escape key
- [ ] Focus returns to the trigger button after closing
- [ ] "DM me" link closes modal and navigates to Contact

## 6. Contact Form
- [ ] Empty submit shows field errors and focuses the first invalid field
- [ ] Invalid email shows format error
- [ ] Details counter updates while typing (x / 2000)
- [ ] With no endpoint configured: shows the "not connected" message with the email link — **never** a success message
- [ ] With endpoint configured: loading state, timeout handling, success only on 2xx, form resets only after success
- [ ] Double-click submit does not send twice

## 7. Miscellaneous
- [ ] Scroll-to-top button appears after ~2 screens and scrolls to top
- [ ] Footer year matches the current year without hardcoding
- [ ] Browser console is free of errors on load and during interaction
