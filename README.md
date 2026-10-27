# Mariecure

Website voor **Mariecure**, een kleinschalige nagelstudio in Kalken (Laarne).

Statische multi-page site, gebouwd met enkel HTML/CSS/JS. Geen build-step, geen npm-dependencies. De site draait op Netlify. De login van `/admin` is een Netlify Function (`api/auth.mjs`) en werkt alleen daar.

## Structuur

```
.
├── index.html              Home
├── behandelingen.html      Behandelingen + prijzen
├── fotos.html              Galerij met lightbox
├── contact.html            Contactinfo + formulier
├── bedankt.html            Bevestiging na het contactformulier (noindex)
├── admin/                  Sveltia CMS, foto's beheren op /admin
│   ├── index.html
│   └── config.yml
├── api/
│   └── auth.mjs            Wachtwoord-login voor /admin (alleen op Netlify)
├── netlify.toml            Netlify-config: functions-map, cache-headers
├── sitemap.xml
├── robots.txt
└── assets/
    ├── site.css            Gedeelde styling (alle tokens, layout, components)
    ├── site.js             Gedeelde scripts (mobile nav, lightbox, fade-in, year)
    ├── data/gallery.json   Lijst van galerijfoto's
    └── img/                Logo, hero, salon en galerij
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
2. Geo-coördinaten verifiëren (nu `51.0639, 3.9344` als centrum Kalken)
3. Google Search Console + Google Business Profile aanmaken

## Foto's wijzigen (`/admin`)

De foto's op de pagina Foto's staan niet in de HTML. De pagina leest `assets/data/gallery.json`. Wijzigen doe je in het CMS, niet in de code.

1. Open [https://www.mariecure.be/admin](https://www.mariecure.be/admin).
2. Klik op **Sign in with GitHub**. Dat opent de wachtwoordpagina. Het is geen GitHub-login. Marieke heeft geen GitHub-account nodig.
3. Vul het masterwachtwoord in. Dat is de Netlify-variabele `CMS_PASSWORD`. Het wachtwoord staat niet in deze repo.
4. Open **Foto's (galerij)**.
5. Voeg een foto toe, versleep de volgorde, of verwijder er een. Vul een korte omschrijving in. Die tekst is de alt-tekst.
6. Publiceer. Dat maakt een commit op `main`. Netlify zet de site daarna live.

De volgorde in het CMS is de volgorde op de site. De roze rand komt van de site. Die hoef je niet op de foto te zetten.

Nieuwe uploads komen in `assets/img/gallery`. Oudere foto's blijven in `assets/img`.

Lokaal (`python3 -m http.server`) zie je de galerij wel. De login werkt daar niet, want `api/auth.mjs` draait alleen op Netlify.

Zegt de pagina dat het wachtwoord fout is, terwijl het klopt? Vaak staat er een spatie of een nieuwe regel achter de waarde in Netlify. Plak het wachtwoord opnieuw, zonder spatie, en start een nieuwe deploy (**Deploys → Trigger deploy → Deploy site**). Een gewijzigde env-var geldt pas na een nieuwe deploy.

## Deployen via Netlify

De live site is [https://www.mariecure.be](https://www.mariecure.be). Netlify hangt aan de GitHub-repo `zjeflabs/mariecure`, branch `main`.

Een push naar `main` start een deploy. Er is geen build-commando. De instellingen staan in `netlify.toml`: publish-map `.` (de repo-root), functions-map `api`. Foto's publiceren vanuit `/admin` is ook een push naar `main`, dus dat deployt vanzelf.

De repo is privé. De website blijft publiek.

Deze twee variabelen staan in Netlify onder **Site configuration → Environment variables**. Zet de scope op **Functions** en vul ze alleen in voor de **Production**-context. Zet ze nooit in git.

| Naam               | Wat het is                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `CMS_PASSWORD`     | Het wachtwoord voor `/admin`                                                                                                      |
| `CMS_GITHUB_TOKEN` | Fine-grained GitHub-token. Resource owner: `zjeflabs`. Alleen de repo `mariecure`. Contents: Read and write. Metadata: Read-only. |

Na het wijzigen van een variabele: **Deploys → Trigger deploy → Deploy site**. Netlify leest ze bij het starten van een deploy, niet live.

Het token verloopt. Maak dan een nieuw token, vervang `CMS_GITHUB_TOKEN`, en redeploy. Daarna werkt het oude token niet meer.

`/admin` en `/api` staan in `robots.txt` op Disallow, zodat zoekmachines ze niet indexeren.

## Browser-support

WebP-images, modern CSS (custom properties, `clamp()`, grid). Alle relevante browsers (Safari 14+, Chrome 80+, Firefox 80+, Edge 80+).

## License

Alle rechten voorbehouden — Mariecure.
