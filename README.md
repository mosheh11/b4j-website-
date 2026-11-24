# Bicycles for Jerusalem — website

Hebrew (RTL) website for **אופניים בשביל ירושלים**, built with [Astro 7](https://astro.build) as a static site.
Content follows the [website ↔ CMS content contract](https://github.com/akivazev/bikes4jlm.org/blob/master/content-contract.md) (Directus); until the CMS is live the site builds from mock data in `src/mock/`.

## Run it

Requires **Node ≥ 22.12**.

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/
```

## Pages

| Route | Page | Source |
|---|---|---|
| `/` | Home — hero, next ride + countdown, activity & numbers, updates, gallery, WhatsApp, social | `src/pages/index.astro` |
| `/join/` | Join activity — community group, topic groups, group rules, social feed | `src/pages/join.astro` |
| `/about/` | About — vision & mission, activities, achievements & timeline, teams, partners | `src/pages/about.astro` |
| `/events/` | Events — upcoming, annual ride, past events, "don't miss an event" | `src/pages/events/index.astro` |
| `/events/<slug>/` | Event detail | `src/pages/events/[slug].astro` |
| `/updates/` | Updates feed with category filter (`?category=`) | `src/pages/updates/index.astro` |
| `/updates/<slug>/` | Post | `src/pages/updates/[slug].astro` |
| `/map/` | Bike-path map (municipality embed on desktop, static image + link on mobile) | `src/pages/map.astro` |
| `/legal/<slug>/` | Terms, privacy, accessibility | `src/pages/legal/[slug].astro` |
| `/calendar.ics`, `/events/<slug>.ics` | Synced calendar feed & per-event "add to calendar" | `src/pages/**.ics.ts` |

The old URLs (`about.html`, `join.html`, `map.html`, `activities.html`) redirect to the new pages (`public/*.html`).

## Structure

```text
src/
  lib/cms.ts          content layer — Directus REST or mock data, localization, derived fields
  lib/labels.ts       interface wording, choice-list labels, date formatting (code-owned)
  lib/calendar.ts     .ics generation and Google Calendar links
  mock/*.json         mock CMS content, shaped like Directus responses (with translations)
  layouts/Layout.astro
  components/         Header, Footer, StickyWhatsApp, PageBanner, PostCard, StatsGrid, …
  pages/
  styles/global.css   design tokens + shared classes
public/images/        photos, logos, QR
```

## Content (CMS)

- **The CMS owns what is said; the code owns how and where it is shown.** Pages never hardcode CMS-owned text — everything comes through `src/lib/cms.ts`.
- **Mock mode (default):** with no `CMS_URL`/`CMS_TOKEN`, the build reads `src/mock/*.json`. Every collection and singleton from the contract has mock data: `site_settings`, `page_<route>`, `posts`, `post_categories`, `events`, `whatsapp_groups`, `teams`, `milestones`, `stats`, `partners`, `gallery`, `legal_pages`.
- **Directus mode:** copy `.env.example` to `.env` and set `CMS_URL` + `CMS_TOKEN`. The build then reads `/items/*` at build time, and fails if the CMS is unreachable (the live site stays up).
- **Languages:** text lives in `translations[]` keyed by `he`/`en`/`ar`. Collection items without a translation are hidden in that language; singletons fall back to Hebrew field by field. Only Hebrew is enabled today.
- **Fixed choice lists the code branches on:** event `type` (`monthly_ride`, `annual_ride`, `workshop`, `other`), event `level` (`all`, `beginner`, `intermediate`, `advanced`), social `platform` (`instagram`, `facebook`, `x`, `whatsapp`, `youtube`, `tiktok`). Labels live in `src/lib/labels.ts`.
- **Derived by the code:** upcoming vs past (from event end time, at build), the next ride, countdowns, calendar files.
- **Field names in the mock are a proposal** — once the Directus data model exists, align `src/mock/` and the types in `cms.ts` to it (or add Zod schemas, per the contract).

### Mock content to replace

The mock data is realistic placeholder content, not real facts: team members, milestones, event dates/prices/spots, posts, partners, email (`info@example.org`), newsletter URL and most WhatsApp invite links (`MOCK-…`). Real links in the mock: the community WhatsApp group, Instagram, X, the donation page and the municipality map.

The social feed (`src/components/SocialFeed.astro`) is outside the contract and shows placeholder posts from `src/mock/social.json` until real embeds are chosen.

## Design

From the "Polished palette" homepage and the brand book:

| Token | Value | Use |
|---|---|---|
| `--purple` | `#5434C9` | buttons, links, numbers, headline accent |
| `--ink` | `#1A1420` | headings |
| `--green` / `--green-700` | `#30977A` / `#1F7A5F` | decoration / WhatsApp buttons (AA) |
| `--stone` | `#F5F0E8` | hero & banners |
| `--lilac` | `#EFEBFA` | invite sections |
| `--night` | `#15111A` | footer |

Font: Google Sans (400/500/700), Heebo fallback. Rounded cards (24–32px), pill buttons, 60/30/10 color balance.
Mobile: single column, hamburger menu, sticky "join on WhatsApp" bar, swipe gallery, ≥44px touch targets. Motion respects `prefers-reduced-motion`.

## Deploy

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`
(set **Settings → Pages → Source: GitHub Actions**). It sets `BASE_PATH=/<repo>/` so the site works under the project sub-path; on a custom domain, remove `BASE_PATH`. Add `CMS_URL`/`CMS_TOKEN` as repository secrets to build from Directus.
