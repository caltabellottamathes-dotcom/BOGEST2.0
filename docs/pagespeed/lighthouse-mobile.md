# Lighthouse-rapport — Mobiel

> Ingeschatte scores op basis van Google PageSpeed Insights (mobiel, simulatie langzaam 4G).
> Datum: 2026-08-23 — snapshot vóór optimalisatie.

## Scores

| Categorie | Score |
|-----------|-------|
| Performance | 59 / 100 |
| Accessibility | 86 / 100 |
| Best Practices | 92 / 100 |
| SEO | 100 / 100 |

## Kerndoelwitten (Core Web Vitals)

| Metric | Waarde | Doel | Status |
|--------|--------|------|--------|
| LCP (Largest Contentful Paint) | ~10,7 s | < 2,5 s | ❌ |
| FID / INP (Interaction) | ~200 ms | < 200 ms | ⚠️ rand |
| CLS (Cumulative Layout Shift) | 0 | < 0,1 | ✅ |

## Belangrijkste boosdoeners

1. **Achtergrondvideo homepage** — ~20-30 MB, wordt direct (eager) geladen op mobiel. Verantwoordelijk voor het grootste deel van de LCP en het paginagewicht.
2. **Render-blocking scripts** — weer-API, lettertypen (Google Fonts @import) en menu-data blokkeren de eerste tekstweergave.
3. **Externe CDN-afbeeldingen** — foto's via Squarespace-CDN, niet geoptimaliseerd voor mobiel formaat.
4. **Paginagewicht: ~30 MB** — vrijwel allemaal video.

## Scenario's

### Met video (huidig)
- Mobiel LCP: ~10,7 s
- Performance-score na optimalisatie: realistisch 65-75
- Video blijft een blijvende last op mobiel.

### Zonder video (statisch hero-beeld)
- Mobiel LCP: ~2,5-3,5 s
- Paginagewicht daalt met ~28 MB
- Performance-score: realistisch richting 80-90
- Verlies van beweging, maar sterke stille beeld-impact behouden.

### Tussenvorm (video desktop/wifi, beeld mobiel)
- Beste van beide, complexiteit in conditional loading.
- Te overwegen als compromis.

## Opmerking
Deze score vergelijkt met een oude, platte tekst-en-foto-site. De nieuwe site draait een digitale gastheer, spraak, live menu's, reserveringen en een beeldbank — dat weegt van nature meer dan een statische brochure. 59 is voor wat de site doet geen slecht startpunt, maar er is eerlijke winst te halen.