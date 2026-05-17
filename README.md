# Mariecure

Website voor **Mariecure**, een kleinschalige nagelstudio in Kalken (Laarne).

Statische multi-page site, gebouwd met enkel HTML/CSS/JS. Geen build-step, geen dependencies. Hosten kan op elke statische host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, …).

## Structuur

```
.
├── index.html              Home
├── behandelingen.html      Behandelingen + prijzen
├── fotos.html              Galerij met lightbox
├── contact.html            Contactinfo + Google Maps embed
├── sitemap.xml
├── robots.txt
└── assets/
    ├── site.css            Gedeelde styling (alle tokens, layout, components)
    ├── site.js             Gedeelde scripts (mobile nav, lightbox, fade-in, year)
    └── img/                14 WebP-images (logo, favicon, hero, salon, galerij)
```

## Design system

- **Kleuren**: wit `#FFFFFF`, zwart `#000000`, lichtroze `#F2E0DC`, donkerroze `#D9ADA3`
- **Typografie**: Fraunces (display, serif) + Inter (body, sans), via Google Fonts
- **Stijl**: soft luxury / quiet beauty — veel witruimte, één accent (donkerroze), zachte micro-animaties

Alle design-tokens staan als CSS custom properties bovenaan `assets/site.css`. Voor branding-tweaks: pas daar `--pink-light`, `--pink-dark`, etc. aan.

## SEO

Geoptimaliseerd voor lokale zoekopdrachten ("nagelstudio Kalken", "manicure Laarne", …):

- Per-pagina canonical, title, description, Open Graph + Twitter Card
- Geo-tags + JSON-LD structured data (`NailSalon`, `BreadcrumbList`, `ItemList`, `ContactPage`, `ImageGallery`)
- Alle 5 services met prijzen als `Offer` in EUR → rich snippets-ready
- `sitemap.xml` + `robots.txt` aanwezig

**Vóór live-gang nog te doen:**

1. Domein invullen: search/replace `https://www.mariecure.be/` overal als je een ander domein gebruikt
2. Echte social URLs (Instagram, Facebook) invullen in elke footer + in het `sameAs` array in `index.html` JSON-LD
3. Geo-coördinaten verifiëren (nu `51.0639, 3.9344` als centrum Kalken)
4. Google Search Console + Google Business Profile aanmaken

## Browser-support

WebP-images, modern CSS (custom properties, `clamp()`, grid). Alle relevante browsers (Safari 14+, Chrome 80+, Firefox 80+, Edge 80+).

## License

Alle rechten voorbehouden — Mariecure.
