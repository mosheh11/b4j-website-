# Bicycles for Jerusalem — Nonprofit Website

A static website (HTML + CSS + JS only) with no build step, ready to deploy on GitHub Pages. Right-to-left (Hebrew) layout.

## Deploy on GitHub Pages

1. Push all files to the repository (`main` branch).
2. In **Settings → Pages**, choose Branch: `main`, Folder: `/ (root)`.
3. The site is served at `https://<user>.github.io/<repo>/`.

No extra configuration is needed — all links are relative.

## File structure

| File | Description |
|------|-------------|
| `index.html` | Home page |
| `about.html` | About, team, and partners |
| `activities.html` | Activities, filterable by type |
| `map.html` | Bike-path map (embedded official Jerusalem municipality ArcGIS map) |
| `join.html` | Join us — social links, WhatsApp groups, donation |
| `style.css` | Shared styles |
| `nav.js` | Mobile menu toggle + active-page highlighting |
| `logo.svg` | White logo (used on the purple hero) |
| `logo-purple.svg` | Purple logo (used in the light glass nav) |
| `favicon.svg` | Site favicon |

## Navigation

The nav bar is fixed to the top of the page with a light, near-white glassmorphism effect (frosted blur + gentle bottom shadow). Nav items use an 8px corner radius. On screens ≤900px it collapses into a frosted overlay menu driven by `nav.js`.

## Content to review / replace

- **Email:** `join.html` uses `info@example.org` (in both the `mailto` link and the visible text) — replace with the real address.
- **Team names & roles** in `about.html` — currently placeholder examples.
- **Partners** in `about.html` — placeholder examples.
- **Events** in `activities.html` — sample dates, times, and locations.
- **Donation link** in `join.html` points to `avi-dashboard.netlify.app` — confirm the final URL.

Social and WhatsApp links in `join.html` (Facebook, Instagram, X, WhatsApp channel + community group) are wired to live links.

## Design

Color palette: purple + white + neutral grays only. Colors are defined as CSS variables at the top of `style.css`. Font: [Assistant](https://fonts.google.com/specimen/Assistant) (loaded from Google Fonts).
