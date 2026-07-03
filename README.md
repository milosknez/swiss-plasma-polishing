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

## Editing guide

There is no build step and no templating: what you edit is what ships. Pushing to `main` redeploys GitHub Pages in about a minute. Every file carries maintainer comments; start with the file header.

**Change a color, font size or spacing.** Edit the token in `assets/css/tokens.css`, every page updates. Never hardcode hex values in component CSS. Mind the spacing-scale naming gotcha documented at the top of that file.

**Change navigation.** The header and footer are hand-copied on every page (no includes). Edit the nav in all 11 HTML files, keeping header and footer identical. Sub-pages use `../` prefixes, case studies use `../../`.

**Swap a placeholder photo.** Convert the new image with `./scripts/convert-images.sh photo.png`, then overwrite the file in `assets/img/` keeping the same name, and no markup changes are needed. Slots still waiting for photos are marked `IMG/... (replace)`.

**Add a case study.** Copy an existing folder under `case-studies/` (the dental page is the annotated template reference), update title, breadcrumb, hero and copy, splice it into the wrap-around previous/next chain by fixing both neighbours' links, and add the case to the home spotlight list with its `data-image`.

**Wire the contact form.** The submit handler in `assets/js/main.js` is a stub with a TODO; point it at Formspree or Web3Forms once the client confirms the endpoint.

**Give each case its own spotlight photo.** Edit the `data-image` attributes on the `.case-item` elements in `index.html`.

## Notes

- Images are placeholders until the client supplies final photography. They follow the `IMG/... (replace)` convention so they are easy to find and swap.
- Legal pages (Impressum, Privacy, Terms) and 4 of 5 case studies contain `[Placeholder]` copy to be replaced with client text.
- The contact form is not yet wired to a backend endpoint (Formspree / Web3Forms, to be confirmed).
- Multi-language (DE, FR) is planned for a later phase; the site is English-only for now.
- Two fonts only, Switzer and Inter. IBM Plex Mono was removed by design; do not reintroduce it.
