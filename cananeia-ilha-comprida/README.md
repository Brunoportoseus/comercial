# Cananéia & Ilha Comprida — Travel Itinerary Site

Bilingual (English / Português) single-page travel guide for a group of 6
travelers visiting Cananéia, Ilha Comprida and Ilha do Cardoso on the
southern coast of São Paulo, Brazil — **December 30, 2026 → January 2, 2027**.

## Open it

Just open `index.html` in any browser. No build step, no dependencies.

## Files

| File | What it does |
|------|--------------|
| `index.html` | Page shell, hero, section containers |
| `styles.css` | Design system (ocean blue, mangrove green, sand, sunset accents) |
| `content.js` | All content as a paired **EN/PT** data model — edit text/prices here |
| `app.js` | Renders the content and handles the language toggle + video players |

## Features

- **EN ⇄ PT toggle** (top-right); choice is remembered per browser.
- Full itinerary, tours, stays, food, per-person budget, tips and links.
- **Video previews** — YouTube thumbnails that swap to an embedded player on
  click (full videos + Shorts). Titles/dates load from YouTube.
- **Map links** — Google Maps for the two guesthouses, Ilha do Cardoso,
  Ilha Comprida, the ferry crossing, restaurants and stays (Booking.com).

## Notes on prices

All prices are **estimates in Brazilian reais (R$)**. Every shared group
cost is divided by 6 and shown **per person**; group totals appear as
reference. Prices may rise over New Year's Eve — confirm before booking.
Wildlife sightings are never guaranteed.

To update any figure or wording, edit `content.js` (each item has `en` and
`pt` fields).
