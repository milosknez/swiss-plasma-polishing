# Swiss Plasma Polishing — website

Marketing website for **Swiss Plasma Polishing (SPP)**, a Bern University of Applied Sciences (BFH) spin-off offering a patented, water-based plasma polishing service for metal parts.

- Live domain (target): [plasmapolishing.ch](https://www.plasmapolishing.ch/)
- Built 1:1 from the Figma design.

## Stack

Plain **HTML, CSS and JavaScript**. No framework, no build step. Fully static.

- **Fonts:** Switzer (headings), Inter (body/UI), IBM Plex Mono (a few labels).
- **Design tokens:** `assets/css/tokens.css` (colors, type scale, spacing, radius, shadows).
- **Base styles:** `assets/css/base.css` (reset, typography, buttons, helpers).
- **Components:** `assets/css/components.css` (header, footer, sections, form, cookie banner).
- **Per-page styles:** `assets/css/pages/*.css`.
- **Scripts:** `assets/js/main.js` (nav toggle, case accordion, form tabs, cookie banner).

## Pages

| Page | Path |
|------|------|
| Home | `index.html` |
| About (Who we are) | `about/` |
| Case study (Dental) | `case-studies/dental-cobalt-chrome-prosthesis/` |
| FAQ | `faq/` |
| Impressum | `impressum/` |
| Privacy Policy | `privacy/` |
| Terms & Conditions | `terms/` |

## Run locally

Any static file server works, for example:

```bash
python3 -m http.server 4321
# then open http://localhost:4321/
```

## Notes

- Images are placeholders until the client supplies final photography. They follow the `IMG/… (replace)` convention so they are easy to find and swap.
- Legal pages (Impressum, Privacy, Terms) contain placeholder copy to be replaced with reviewed legal text.
- The contact form is not yet wired to a backend endpoint (Formspree / Web3Forms, to be confirmed).
- Multi-language (DE, FR) is planned for a later phase; the site is English-only for now.
