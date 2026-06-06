# TriIndia Website — Premium Redesign Plan

## Context

The current TriIndia website ([app/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\page.tsx)) is positioned as a hotel-booking aggregator ("Discover Top Hotels, Compare Deals") with a 4-field search bar in the hero. **TriIndia is not a booking site — it is a Delhi-based hospitality organization that runs 15+ hotels.** The site needs to be repositioned as a parent-org portfolio with premium, editorial typography and clear hotel-by-hotel storytelling.

In addition, four concrete problems on the current page:
1. Stats section shows fabricated numbers ("200+ Partner Hotels", "15+ Countries", "4.9 Average Rating") — see [TrustSection.tsx:6-11](c:\Users\hp\.opencode\TriIndia%20Website\components\home\TrustSection.tsx).
2. Cities are wrong — [RoomsSection.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\RoomsSection.tsx) labels Ashram View as "Rishikesh" and Preet Palace as "Amritsar". Every TriIndia hotel is in Delhi.
3. The "Hotels" nav link scrolls to `#rooms` on the home page — no real `/hotels` page exists. Three of the four hotel cards have `href: "#"`.
4. The marquee uses generic `/marquee-images/` instead of real hotel photos. No splash/loader exists. No map exists.

**Intended outcome:** a premium parent-organization site that establishes TriIndia as the operator (not the aggregator), with a tiranga-themed splash on first visit, a proper `/hotels` portfolio page, an interactive Delhi map of all properties, and editorial typography that matches the Aman / Six Senses / Oberoi tier rather than the Booking.com tier.

## Locked decisions (from user)

| Decision | Choice |
|---|---|
| Hotel count messaging | Say **"15+ hotels"** in copy (truthful about the org). Initially seed only the **5 known properties** as active. Add the rest in later phases. |
| Hero search bar | **Remove entirely.** Booking lives on each hotel detail page, not the parent home page. |
| Splash animation | **Inline SVG + Framer Motion** (3 flag bands + Ashoka Chakra). No video asset needed. |
| Map library | **Mapbox GL JS** with a custom monochrome style. User provides a free token (URL-restricted). |

## Recommended approach — 6 phases

Each phase is a shippable chunk. Ship → review → next phase.

### P0 — Foundation (data + fonts + new logo)

The plan rests on a single data file and a unified font system. Build these first or every later phase has to be re-done.

- Create `lib/hotels.ts` — single source of truth for hotel data. Schema includes `slug`, `name`, `neighborhood`, `address`, `coordinates {lat, lng}`, `phone`, `description`, `amenities[]`, `rooms[]`, `heroImage`, `galleryImages[]`, optional `heroVideo`, `featured: boolean`, `status: "active" | "coming-soon"`. Seed with the 5 known hotels using existing photo folders ([public/ashram/](c:\Users\hp\.opencode\TriIndia%20Website\public\ashram), [public/j-residency-main/](c:\Users\hp\.opencode\TriIndia%20Website\public\j-residency-main), [public/jresidency/](c:\Users\hp\.opencode\TriIndia%20Website\public\jresidency), [public/preet/](c:\Users\hp\.opencode\TriIndia%20Website\public\preet), [public/samrth/](c:\Users\hp\.opencode\TriIndia%20Website\public\samrth)). J Residency gets the full data lifted from [LandingPage.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\LandingPage.tsx).
- Swap fonts to **Geist Sans (body/UI) + Fraunces (display)** via `next/font/google` in [app/layout.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\layout.tsx). Delete the four `@import url(...)` lines at [globals.css:1-2](c:\Users\hp\.opencode\TriIndia%20Website\app\globals.css) (Plus Jakarta Sans, Gloock, DM Sans, Playfair Display all go). Update `--sans` and `--serif` CSS variables to point at the new `next/font` variables. Update [tailwind.config.ts:7-10](c:\Users\hp\.opencode\TriIndia%20Website\tailwind.config.ts) fontFamily.
- Replace `public/triindia-logo.jpeg` with the new tiranga logo (SVG strongly preferred). Update logo references in [Header.tsx:43](c:\Users\hp\.opencode\TriIndia%20Website\components\home\Header.tsx), [Footer.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\Footer.tsx), and the mobile-menu sheet.
- Rewrite metadata in [app/layout.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\layout.tsx) — title, description, OG image — away from "Discover top hotels, compare deals".

### P1 — Tiranga splash

- New components: `components/splash/SplashGate.tsx` (client; reads `sessionStorage`, bypasses on `/book/*` and `/admin/*` routes via `usePathname()`) + `components/splash/TirangaSplash.tsx` (the 2.4s SVG animation).
- Animation timeline (Framer Motion): 0.0–0.4s three thin lines draw in (saffron / white / green) → 0.4–0.9s lines thicken into flag bands + Ashoka Chakra draws and rotates into place → 0.9–1.5s flag scales down and translates to corner, TriIndia wordmark fades in centered → 1.5–2.4s fade to home backdrop.
- `prefers-reduced-motion` → skip animation, hold final frame 600ms, complete.
- `sessionStorage` flag (not localStorage — should replay next day, not suppress forever).
- `?splash=1` query param force-replays during dev.
- Mount in [app/layout.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\layout.tsx) by wrapping `{children}` in `<SplashGate>`.

### P2 — Home hero + About + stats rewrite

- Heavy rewrite of [Hero.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\Hero.tsx): kill the search bar (lines 130–256) and the floating particles (lines 86–106). New headline (Fraunces): *"A house of hotels in Delhi."* New sub: *"TriIndia Hospitality runs 15+ properties across the capital. Local roots. Direct stays. No middlemen."* Two CTAs: "Explore our hotels" → `/hotels` and "Our story" → `#about`. Keep [hero.mp4](c:\Users\hp\.opencode\TriIndia%20Website\public\hero.mp4) but darken overlay to ~70%.
- Delete [components/home/Calendar.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\Calendar.tsx) once Hero no longer imports it (verify it's not used elsewhere; [LandingPage.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\LandingPage.tsx) has its own inline CalendarPicker).
- Rename [TrustSection.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\TrustSection.tsx) → `AboutTriIndia.tsx`. New heading: *"We don't aggregate hotels. We run them."* Two short paragraphs about Delhi roots and operating vs. listing.
- Replace stats array ([TrustSection.tsx:6-11](c:\Users\hp\.opencode\TriIndia%20Website\components\home\TrustSection.tsx)) with four new slots, computed by a helper in `lib/stats.ts`:
  1. `{years}+ years in Delhi hospitality` — placeholder, user provides
  2. `15+ hotels in our portfolio` — static copy reflecting org reality
  3. `{neighborhoods} Delhi neighborhoods served` — derived from `lib/hotels.ts`
  4. `50K+ guests hosted` — keep
  - Icons: `Landmark` (years), `Building2` (hotels), `MapPinned` (neighborhoods), `Users` (guests). Drop `Star` and `Globe`.
- Update [app/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\page.tsx) imports.

### P3 — Real hotel slideshow + Featured Stays + nav fix + footer

- Rename [ImageAutoSlider.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\ImageAutoSlider.tsx) → `PortfolioMarquee.tsx`. Drop the hardcoded `/marquee-images/` array; build the image list dynamically from `hotels.flatMap(h => h.galleryImages)`. Each tile becomes a `<Link href={\`/hotels/${slug}\`}>` with a hotel-name chip overlay on hover.
- Rename [RoomsSection.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\RoomsSection.tsx) → `FeaturedStays.tsx`. Replace hardcoded `rooms` array with `hotels.filter(h => h.featured).slice(0, 4)`. Fix wrong cities (Ashram View ≠ Rishikesh, Preet Palace ≠ Amritsar — both in Delhi). Replace `href: "#"` with `/hotels/${slug}`. Drop the price chip from cards (price belongs on detail pages, not the parent-org home page). CTA copy → "View hotel →".
- Update [Header.tsx:12](c:\Users\hp\.opencode\TriIndia%20Website\components\home\Header.tsx): `{ label: "Hotels", href: "/hotels" }` instead of `#rooms`.
- Rewrite [Footer.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\Footer.tsx): replace the generic `services` column (Hotel Booking / Room Service / etc.) with a **portfolio** column listing every hotel from `lib/hotels.ts` linking to its detail page. Update brand blurb to parent-org voice. Collapse Quick Links to only routes that exist. Use `new Date().getFullYear()` for copyright.

### P4 — `/hotels` page + reusable detail template

- Extract [LandingPage.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\LandingPage.tsx) into `components/hotels/HotelDetailTemplate.tsx`. Lift J Residency-specific constants (rooms, amenities, gallery, concierge text, promo code, hero video path, the 60-frame ScrollFrameMap data) into J Residency's entry in `lib/hotels.ts`. The template conditionally renders sections based on what each hotel's data contains:
  - `hotel.heroVideo` present → hero-video variant; else hero-image variant
  - `hotel.scrollFrames === true` → the 60-frame scroll map (J Residency only); else the Mapbox static snapshot
  - `hotel.conciergeBlurb`, `hotel.promoCode`, `hotel.mapEmbedUrl` — each optional, render only if present
- New `components/hotels/HotelCard.tsx` — used on the `/hotels` list.
- New [app/hotels/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\hotels\page.tsx) — server component, lists all `status: "active"` hotels in a 3-col grid (2 col tablet, 1 col mobile). Header: eyebrow "Portfolio", Fraunces heading *"15+ hotels. One organization."* Each card links to `/hotels/[slug]`.
- New [app/hotels/[slug]/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\hotels\[slug]\page.tsx) — server component, `generateStaticParams()` + `generateMetadata()`, renders `<HotelDetailTemplate hotel={...} />`, `notFound()` on unknown slug.
- Convert existing [app/jresidency/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\jresidency\page.tsx) and [app/j-residency/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\j-residency\page.tsx) to `redirect("/hotels/j-residency")`. Delete [LandingPage.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\LandingPage.tsx) (replaced by the template).

### P5 — Delhi map with hotel pins

- Install: `mapbox-gl`, `react-map-gl`, `@types/mapbox-gl`.
- Env: `NEXT_PUBLIC_MAPBOX_TOKEN` (user provides; restrict to production domain + localhost in the Mapbox dashboard).
- New `components/map/HotelsMap.tsx` (client). Props: `hotels: Hotel[]`, `height`, `initialZoom`. Centers on Delhi (28.6139, 77.2090), zoom 11. Each hotel renders as a champagne-gold `<Marker>` with a subtle Framer Motion pulse. Hover (desktop) → `<Popup>` with photo, name, neighborhood, "View hotel →". Click (mobile) → navigates directly to detail page.
- New `components/home/DelhiMap.tsx` — the home-page section wrapping `<HotelsMap>`. Eyebrow "Where we are.", heading *"Five corners of Delhi. One operator."* (corner count derived from unique neighborhoods).
- Insert `<DelhiMap />` in [app/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\page.tsx) between `<FeaturedStays />` and the footer.
- For detail pages: use Mapbox **Static Images API** (server-rendered PNG, zero client JS) instead of the interactive map.

### P6 — "Why TriIndia" + polish

- New `components/home/WhyTriIndia.tsx` — three-column values grid: 01 *Operator, not aggregator* / 02 *Delhi-rooted, since [year]* / 03 *Direct stays, fair pricing*. Thin Fraunces numerals, Geist H3, no stock icons.
- New `components/home/Testimonials.tsx` — skeleton with TODO comments. Real content deferred until operator provides quotes.
- QA pass: Lighthouse, mobile splash on throttled 4G, axe-core accessibility, broken-link sweep.

## Critical files

**New files**
- `lib/hotels.ts` *(gates every later phase)*
- `lib/stats.ts`
- `components/splash/SplashGate.tsx`
- `components/splash/TirangaSplash.tsx`
- `components/hotels/HotelDetailTemplate.tsx` *(extracted from LandingPage.tsx)*
- `components/hotels/HotelCard.tsx`
- `components/map/HotelsMap.tsx`
- `components/map/HotelPopup.tsx`
- `components/home/DelhiMap.tsx`
- `components/home/WhyTriIndia.tsx`
- `components/home/Testimonials.tsx`
- `app/hotels/page.tsx`
- `app/hotels/[slug]/page.tsx`

**Heavy rewrites**
- [app/layout.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\layout.tsx) — fonts, metadata, SplashGate wrap
- [app/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\page.tsx) — new section ordering
- [app/globals.css](c:\Users\hp\.opencode\TriIndia%20Website\app\globals.css) — delete font imports, rewire CSS variables
- [tailwind.config.ts](c:\Users\hp\.opencode\TriIndia%20Website\tailwind.config.ts) — new fontFamily
- [components/home/Hero.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\Hero.tsx) — remove search bar + particles, new headline
- [components/home/TrustSection.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\TrustSection.tsx) — rename to AboutTriIndia, new stats, new copy
- [components/home/ImageAutoSlider.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\ImageAutoSlider.tsx) — rename to PortfolioMarquee, dynamic data
- [components/home/RoomsSection.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\RoomsSection.tsx) — rename to FeaturedStays, dynamic data, fix cities
- [components/home/Header.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\Header.tsx) — Hotels link → `/hotels`, new logo
- [components/home/Footer.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\Footer.tsx) — portfolio column, copy rewrite

**Conversions / deletes**
- [app/jresidency/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\jresidency\page.tsx) → `redirect("/hotels/j-residency")`
- [app/j-residency/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\j-residency\page.tsx) → `redirect("/hotels/j-residency")`
- [components/LandingPage.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\LandingPage.tsx) — delete (replaced by HotelDetailTemplate)
- [components/home/Calendar.tsx](c:\Users\hp\.opencode\TriIndia%20Website\components\home\Calendar.tsx) — delete (orphan after Hero rewrite — verify with grep first)

## Inputs needed from you

**Before P0 (Foundation)**
- [ ] The new tiranga logo as **SVG** (preferred) or high-res transparent PNG. Drop at `public/triindia-logo.svg` or `public/triindia-logo.png`.
- [ ] **Founding year** of TriIndia (for "Since YYYY" eyebrow + stats slot 1).
- [ ] **Correct Delhi neighborhood** for each of the 5 active hotels — confirm: J Residency (Jangpura B), and the neighborhood for Hotel Satwah 29, Hotel Ashram View, Hotel Preet Place, Hotel Samrat Residency. *(Critical: current code has Rishikesh/Amritsar/Jaipur — all wrong.)*
- [ ] Full **street addresses + phone numbers** for the 4 non-J-Residency hotels.

**Before P3 (Slideshow + Featured Stays)**
- [ ] Photos for **Hotel Satwah 29** (no folder exists yet in `public/`).
- [ ] Confirm `/preet/`, `/samrth/`, `/ashram/` folders are the canonical photo sources for those properties.

**Before P4 (Hotels page + detail template)**
- [ ] **2–3 paragraphs of description** per hotel (for the detail page hero + about section).
- [ ] **Room types + rates** per hotel — OR a decision to render a "Booking coming soon" CTA on detail pages until rooms data is finalized.

**Before P5 (Map)**
- [ ] **Mapbox account + access token** (free signup at mapbox.com → Account → Tokens → restrict URLs to `triindiahospitality.com` and `localhost:3000`). Drop in `.env.local` as `NEXT_PUBLIC_MAPBOX_TOKEN=...`.
- [ ] **Lat/lng for every active hotel.** Use maps.google.com → right-click the hotel pin → "copy coordinates".

**Anytime**
- [ ] Real Instagram + Facebook URLs (footer currently has `href="#"`).
- [ ] Confirmed WhatsApp/phone for site-wide CTAs (J Residency already has `+919899402024`).
- [ ] If you want to provide a tiranga video later, we wire an `NEXT_PUBLIC_SPLASH_MODE` env flag and swap implementations without redesigning.

## Verification

After each phase, run locally and walk through these checks. **Do not deploy** between phases without explicit approval (per `AGENTS.md`).

**P0**
- `npm run dev` → home page loads without console errors. Fonts visibly render in Geist (UI) and Fraunces (any large headlines that still exist). Logo in header is the new tiranga logo.
- Inspect element on `<body>` → font-family resolves to `Geist`, not `DM Sans`. No `Plus Jakarta Sans` requests in Network tab.

**P1**
- Hard reload home page → tiranga splash plays for ~2.4s then fades to the home page.
- Reload again → splash skipped (sessionStorage cached).
- Visit `/?splash=1` → splash replays.
- Visit `/book/j-residency` → no splash.
- DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion: reduce`" → splash skips to final frame, holds, completes.
- Throttle to "Slow 4G" → splash still <3s end-to-end.

**P2**
- Home hero shows new headline (Fraunces), no search bar, no floating particles.
- "Explore our hotels" CTA routes to `/hotels`. "Our story" CTA scrolls to `#about`.
- Stats section shows 4 new slots; "15+ hotels" displays; neighborhoods count auto-derives from `lib/hotels.ts`.

**P3**
- Marquee shows real TriIndia hotel photos (not generic `/marquee-images/` set). Hover on a tile → name + neighborhood chip appears; click → routes to that hotel's detail page.
- Featured Stays cards show correct **Delhi** neighborhoods for all 4 (no Rishikesh/Amritsar/Jaipur).
- Click "View hotel →" on every card → routes to `/hotels/[slug]` (404 expected until P4 ships — that's fine).
- Header "Hotels" link → `/hotels` (404 expected until P4).
- Footer portfolio column lists all 5 hotels with working links.

**P4**
- `/hotels` renders a grid of all active hotels. Click any card → detail page renders with that hotel's data.
- `/hotels/j-residency` matches the visual quality of the old `/jresidency` page (since we extracted from it). The other 4 hotels render the same template with their own data; sections without data are gracefully hidden.
- Visit `/jresidency` and `/j-residency` → both 301-redirect to `/hotels/j-residency`. Check with `curl -I http://localhost:3000/jresidency` → status 308 or 301.
- `generateStaticParams` produces 5 routes; `npm run build` succeeds and produces static HTML for each.

**P5**
- Delhi map renders on the home page below Featured Stays. All 5 hotels appear as champagne-gold pins on the correct Delhi neighborhoods.
- Hover on a pin (desktop) → popup with photo + name + neighborhood + "View hotel →" link. Click → routes to detail page.
- Tap on a pin (mobile / touch device emulation) → routes directly to detail page.
- Detail pages render a static Mapbox snapshot (no map JS bundle on those routes — check Network tab).
- Token misuse check: `curl https://api.mapbox.com/styles/v1/...?access_token=$TOKEN -H "Referer: https://evil.example.com"` → 403 (URL restriction working).

**P6**
- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- axe-core devtools → zero critical/serious issues.
- All `href="#"` are gone (grep the repo). No "Lorem ipsum" / placeholder text.

## Risks & open notes

- **`react-map-gl` vs React 19 / Next.js 16 compat** — verify at install time. Fallback is raw `mapbox-gl` with a small custom React wrapper.
- **Splash on slow phones** — if the user reports the 2.4s feels long, drop to 1.6s and trim animation step 4. Don't ship without testing on throttled 4G.
- **Mapbox token security** — `NEXT_PUBLIC_*` is browser-exposed by definition. URL restrictions in the Mapbox dashboard are mandatory, not optional.
- **Prisma vs `lib/hotels.ts`** — keep both. Prisma stays the source of truth for bookings/admin ([prisma/seed.mjs](c:\Users\hp\.opencode\TriIndia%20Website\prisma\seed.mjs), [/admin/page.tsx](c:\Users\hp\.opencode\TriIndia%20Website\app\admin\page.tsx)). `lib/hotels.ts` is the source of truth for marketing-site content. They share the `slug` field. Unifying them is a separate refactor, out of scope.
- **No deploy without explicit ask** — per outer `AGENTS.md`. All phases ship to localhost only. Production deploy happens only when operator says so.

---

# QloApps PMS Connectivity — Investigation, Fix, and Glue Service

## Context

QloApps PMS is deployed at `https://book.triindiahospitality.com` (version 1.7.0.0, Webkul Docker image, MariaDB inside container, behind Nginx reverse proxy on Contabo `94.136.185.217`). Shiv reports **two symptoms** that have been blocking the integration:

1. **Storefront → admin disconnect**: A booking made on the QloApps public storefront (date range, hotel, guest details) does not appear in the QloApps admin. One team member made it work locally with a Chrome extension, but that's not a deployable fix for managers / front-desk staff.
2. **PMS → backend disconnect**: HTTP calls to QloApps's Webservice API from an external backend never succeed ("backend never listens"). The team intended to push data into a lead store for WhatsApp + AI agent flows.

Phase 1 exploration of this repo found:
- No QloApps source code in this repo (it lives inside the Docker named volume `qloapps-web-data`). Zero core customizations have been committed.
- [deploy/nginx/book.conf](c:\Users\hp\.opencode\TriIndia%20Website\deploy\nginx\book.conf) is a textbook reverse-proxy config — no obvious problem.
- [deploy/docker/qloapps-compose.yml](c:\Users\hp\.opencode\TriIndia%20Website\deploy\docker\qloapps-compose.yml) uses `webkul/qloapps_docker:latest` bound to `127.0.0.1:8080`. Apache + MariaDB run inside the container; source is in a named volume.
- No glue service exists yet. The architecture spec at [docs/superpowers/specs/2026-05-22-triindia-qloapps-odoo-architecture-design.md](c:\Users\hp\.opencode\TriIndia%20Website\docs\superpowers\specs\2026-05-22-triindia-qloapps-odoo-architecture-design.md) calls for `glue/src/qloapps/`, `glue/src/odoo/`, `glue/src/sync/`, `glue/src/webhooks/` — none of these directories have been created.
- A proven push pattern already exists at [SaaS/ocr-odoo-integration/app.py:328-411](c:\Users\hp\.opencode\TriIndia%20Website\SaaS\ocr-odoo-integration\app.py) (OCR → Odoo CRM via XML-RPC, with auth, dedup, error handling). The glue service should follow the same shape.
- The existing Next.js booking endpoint at [app/api/booking-requests/route.ts](c:\Users\hp\.opencode\TriIndia%20Website\app\api\booking-requests\route.ts) writes only to local Postgres ([prisma/schema.prisma](c:\Users\hp\.opencode\TriIndia%20Website\prisma\schema.prisma) models `Guest`, `Booking`, `Property`, `Room`). It does not talk to QloApps.

**Root-cause hypothesis (high confidence)** — corroborated by multiple QloApps forum threads and the PrestaShop reverse-proxy pattern: the QloApps database has `PS_SHOP_DOMAIN` / `PS_SHOP_DOMAIN_SSL` and the `ps_shop_url` table set to the **internal Docker address (127.0.0.1:8080 or similar)** instead of `book.triindiahospitality.com`. Every storefront AJAX call (including the booking submit) is therefore POSTing to a URL the browser cannot reach — the request fails silently, the booking never persists, and the admin sees nothing. A Chrome extension can mask this by rewriting outbound URLs at the request layer (`chrome.declarativeNetRequest` redirect rules), which exactly matches the workaround Shiv's team member built. The same misconfiguration almost certainly explains why the Webservice API at `/api/...` doesn't respond as expected from external clients.

## Locked decisions (from Shiv via AskUserQuestion)

| Decision | Choice |
|---|---|
| Lead-store backend | **Stick with the existing Postgres + Prisma stack.** No Supabase. Glue writes to the same `Guest` / `Booking` tables that the Next.js booking form already uses. Architecture spec confirms this. |
| Starting point | **Config audit first, then build the glue service.** Cheap, fast, likely fixes the storefront → admin disconnect before any new code is written. |
| QloApps customization policy | Per `SaaS/AGENTS.md` hard rule, do **not edit QloApps core PHP**. Fix via config, admin settings, or — if absolutely required — `override/` mounted from a host folder. Source patches are last resort. |
| Where the glue service lives | New `glue/` folder at repo root, separate Node/TS service running on Contabo as a systemd unit. Not folded into the Next.js app — the spec allows folding in but recommends separation as it grows. |

## Recommended approach — 3 stages

Each stage is independently shippable. Stop and re-evaluate between stages.

### Stage 1 — QloApps configuration audit & fix (estimated 1–2 hours)

This stage is read-mostly and reversible. It's the highest-leverage investigation because **one config fix likely unblocks both symptoms**.

**Step 1.1 — Read the live QloApps DB state.**

SSH into Contabo, exec into the QloApps container, read the configuration that PrestaShop/QloApps uses:

```bash
ssh -i ~/.ssh/triindia_vps_ed25519 root@94.136.185.217
docker exec -it qloapps-web mariadb -u root -p"$MYSQL_ROOT_PASSWORD" qloapps -e \
  "SELECT id_shop_url, domain, domain_ssl, physical_uri FROM ps_shop_url;
   SELECT name, value FROM ps_configuration
     WHERE name IN ('PS_SHOP_DOMAIN','PS_SHOP_DOMAIN_SSL','PS_SSL_ENABLED','PS_SSL_ENABLED_EVERYWHERE');"
```

**Expected (correct) values:**
- `ps_shop_url.domain` = `book.triindiahospitality.com`
- `ps_shop_url.domain_ssl` = `book.triindiahospitality.com`
- `ps_configuration.PS_SHOP_DOMAIN` = `book.triindiahospitality.com`
- `ps_configuration.PS_SHOP_DOMAIN_SSL` = `book.triindiahospitality.com`
- `ps_configuration.PS_SSL_ENABLED` = `1`
- `ps_configuration.PS_SSL_ENABLED_EVERYWHERE` = `1`

**If wrong (highly likely):** Symptom A and B are both explained.

**Step 1.2 — Apply the fix.**

```sql
UPDATE ps_shop_url
   SET domain='book.triindiahospitality.com',
       domain_ssl='book.triindiahospitality.com',
       physical_uri='/'
 WHERE id_shop_url IN (SELECT * FROM (SELECT id_shop_url FROM ps_shop_url) AS x);

UPDATE ps_configuration SET value='book.triindiahospitality.com'
 WHERE name IN ('PS_SHOP_DOMAIN','PS_SHOP_DOMAIN_SSL');

UPDATE ps_configuration SET value='1'
 WHERE name IN ('PS_SSL_ENABLED','PS_SSL_ENABLED_EVERYWHERE');
```

Then clear the PrestaShop cache inside the container:

```bash
docker exec -u www-data qloapps-web rm -rf /home/qloapps/www/QloApps/cache/*
docker exec -u www-data qloapps-web rm -rf /home/qloapps/www/QloApps/var/cache/*
docker compose restart qloapps-web
```

**Step 1.3 — Turn off Demo mode.**

QloApps admin → Dashboard → top-right "Demo mode" toggle → OFF. Demo mode injects fake bookings into the dashboard and can mask real orders in some views.

**Step 1.4 — Verify the storefront → admin flow.**

Open browser DevTools → Network tab → go to `book.triindiahospitality.com` storefront → submit a real test booking. Confirm:
- Every XHR/fetch hits `book.triindiahospitality.com` (not `127.0.0.1:8080`)
- The booking POST returns 200, not a network error
- QloApps admin → Orders → New Orders shows the booking
- QloApps admin → Hotel Reservation System → Bookings shows the room as occupied for the chosen dates

**If this works → the Chrome extension is no longer needed.** Document the fix and move on.

**If it does NOT work, fall back to:**
1. Tail QloApps logs: `docker exec qloapps-web tail -f /var/log/apache2/error.log` + `docker exec qloapps-web tail -f /home/qloapps/www/QloApps/var/logs/*.log` during a test booking
2. Check Apache `AllowOverride` for the QloApps vhost — if it's `None`, `.htaccess` rewrites don't apply
3. Check the QloApps `Preferences → SEO & URLs` page in admin — verify "Enable SSL" and "Friendly URLs" settings
4. As deepest fallback: `override/` directory pattern (mount a host folder into the container so we can patch the booking controller without losing changes on container rebuild)

### Stage 2 — Webservice API verification (estimated 1 hour)

Once the domain is fixed (Stage 1), the Webservice API endpoint at `https://book.triindiahospitality.com/api/` should be reachable. Now wire it up properly.

**Step 2.1 — Confirm Webservice is enabled.**

QloApps admin → Advanced Parameters → Webservice. Confirm:
- "Enable QloApps' webservice" = YES
- "Enable CGI mode for PHP" = NO (this is critical — CGI mode strips the `Authorization` header on some Apache builds)

**Step 2.2 — Audit the API key permissions.**

Edit the existing API key (or generate a new one). For every resource in the table, check at minimum: GET on `customers`, `addresses`, `orders`, `order_carriers`, `carts`, `products`. Also (QloApps-specific): `hotel_branches`, `hotel_rooms`, `room_types`, `bookings` if those resources are listed. The key is 32 chars, used as the username in HTTP Basic auth with empty password.

**Step 2.3 — Smoke test from outside.**

From your laptop:

```bash
curl -i -u <API_KEY>: https://book.triindiahospitality.com/api/customers
```

**Expected:** HTTP 200 with an XML body listing customers.
**If 401:** API key has no resource permissions, or auth header was stripped (toggle "Enable CGI mode" OFF and retry).
**If 404:** `.htaccess` URL rewriting is broken — fix Apache `AllowOverride All` for the QloApps vhost inside the container.

**Step 2.4 — Document the working API base URL, key, and reachable resources** in `deploy/env/qloapps.env.example` (key names only, never the secret value) so the glue service in Stage 3 has a contract to read.

### Stage 3 — Build the glue service (estimated 2–4 days)

This is the productionable architecture. It replaces the Chrome extension permanently and unblocks WhatsApp + AI agent flows.

**Step 3.1 — Repo scaffold.** New folder at repo root:

```
glue/
  package.json
  tsconfig.json
  src/
    index.ts                    # entry point; boots the poll loop and the webhook receiver
    qloapps/
      client.ts                 # typed QloApps Webservice API client (HTTP Basic auth)
      types.ts                  # generated/handwritten types for Customer, Order, Booking, RoomType, HotelBranch
      poll.ts                   # periodic poll: fetch new orders since last cursor, push into sync layer
    odoo/
      client.ts                 # XML-RPC client (copy the pattern from SaaS/ocr-odoo-integration/app.py)
    sync/
      booking-sync.ts           # transforms QloApps booking → Prisma Booking + Odoo CRM lead
      cursor.ts                 # persists last-seen QloApps order id so we don't re-fetch (uses Postgres)
    prisma/
      client.ts                 # reuses the existing Prisma schema in ../prisma/schema.prisma
    webhooks/
      razorpay.ts               # placeholder for Phase 2.X
      whatsapp.ts               # placeholder for Phase 2.X
    config.ts                   # reads env (QLOAPPS_URL, QLOAPPS_API_KEY, ODOO_*, DATABASE_URL)
    logger.ts                   # structured JSON logs (winston or pino)
.env.example                    # add QLOAPPS_URL, QLOAPPS_API_KEY
deploy/systemd/triindia-glue.service   # systemd unit for the poller
```

**Step 3.2 — Reuse what's already proven.**

Copy the Odoo XML-RPC pattern from [SaaS/ocr-odoo-integration/app.py:208-411](c:\Users\hp\.opencode\TriIndia%20Website\SaaS\ocr-odoo-integration\app.py) verbatim into `glue/src/odoo/client.ts`. The Python proved the auth flow, deduplication-by-name+phone, and the `crm.lead` schema. Translate to TypeScript using `xmlrpc` npm package (≈80 lines).

For QloApps webservice: HTTP Basic with API key as username, empty password. PrestaShop returns XML by default; pass `?output_format=JSON` for JSON. Use `undici` or `axios`. The official QloApps PHP SDK exists ([devdocs.qloapps.com/webservice/qloapps-webservice-lib.html](https://devdocs.qloapps.com/webservice/qloapps-webservice-lib.html)) — we'll write a thin TS equivalent rather than spawning PHP.

**Step 3.3 — Sync logic.**

`glue/src/sync/booking-sync.ts` implements the canonical flow:
1. Pull `GET /api/orders?date=>=<last_cursor>&display=full&output_format=JSON` from QloApps every 60 seconds
2. For each new order: fetch its `cart`, `customer`, `addresses`, and `bookings` resources
3. Upsert into Prisma `Guest` (dedup by phone) and `Booking` (dedup by QloApps order id, stored in a new field `externalRef`)
4. Push a `crm.lead` into Odoo using the same dedup-by-name+phone pattern from the OCR integration
5. Advance the cursor
6. Idempotent: re-running the same window must not duplicate rows

**Step 3.4 — Add `externalRef` field to Prisma.**

Edit [prisma/schema.prisma](c:\Users\hp\.opencode\TriIndia%20Website\prisma\schema.prisma) `Booking` model:

```prisma
model Booking {
  // existing fields…
  externalRef String? @unique  // QloApps order id, e.g. "TRI-ext-1234"
  externalSource String?       // "qloapps" | "website" | "walk-in"
}
```

Run `npx prisma migrate dev --name add_external_ref` locally; the production migration is part of deploy.

**Step 3.5 — Wire the Next.js booking form to QloApps too.**

Modify [app/api/booking-requests/route.ts](c:\Users\hp\.opencode\TriIndia%20Website\app\api\booking-requests\route.ts) to:
1. Still write to local Postgres (unchanged — this is the lead-capture safety net)
2. Additionally POST a cart + customer to QloApps via the same `glue/src/qloapps/client.ts` (factored as a shared package or copied module)
3. On QloApps success, populate `externalRef` on the Postgres row
4. If QloApps fails, log it and keep the Postgres row — the glue service's reconciliation pass on the next poll will retry

This means the website booking form becomes the unified entry point: lead lands in Postgres immediately (fast), then in QloApps (source of truth), then in Odoo (CRM) via the glue.

**Step 3.6 — Deploy as systemd.**

```ini
# deploy/systemd/triindia-glue.service
[Unit]
Description=TriIndia Glue Service (QloApps ↔ Postgres ↔ Odoo)
After=network.target

[Service]
Type=simple
User=triindia
WorkingDirectory=/opt/triindia/glue
EnvironmentFile=/opt/triindia/glue/.env
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Build pipeline: `npm ci && npm run build` produces `dist/index.js`. Service is enabled, polls forever, restarts on failure.

## Critical files to modify / create

**New files**
- `glue/package.json`, `glue/tsconfig.json`, `glue/src/**` (full service)
- `deploy/systemd/triindia-glue.service`
- `prisma/migrations/<timestamp>_add_external_ref/migration.sql`

**Modified files**
- [prisma/schema.prisma](c:\Users\hp\.opencode\TriIndia%20Website\prisma\schema.prisma) — add `externalRef`, `externalSource` to `Booking`
- [app/api/booking-requests/route.ts](c:\Users\hp\.opencode\TriIndia%20Website\app\api\booking-requests\route.ts) — also POST to QloApps after Prisma write
- [.env.example](c:\Users\hp\.opencode\TriIndia%20Website\.env.example) — add `QLOAPPS_URL`, `QLOAPPS_API_KEY`, plus Odoo vars if not already there
- [deploy/env/qloapps.env.example](c:\Users\hp\.opencode\TriIndia%20Website\deploy\env\qloapps.env.example) — document `QLOAPPS_WS_KEY` placeholder for the operator
- [deploy/README.md](c:\Users\hp\.opencode\TriIndia%20Website\deploy\README.md) — add a "8. Run the Glue Service" section

**Patches on the live server (Stage 1, no repo change)**
- MariaDB inside `qloapps-web` container: update `ps_shop_url` and `ps_configuration`
- QloApps admin: turn off Demo mode, enable webservice, audit API key resources
- Apache inside container (only if `.htaccess` rewrites are dead): `AllowOverride All` for the QloApps vhost

## Verification (end-to-end test for the full integration)

After all 3 stages:

1. **Storefront booking test.** Open https://book.triindiahospitality.com in an incognito window with DevTools → Network. Submit a real booking (e.g. J Residency, Deluxe, 9 Jun → 12 Jun, fake guest). Every XHR must hit `book.triindiahospitality.com`. The success page must show a booking reference. QloApps admin → Orders shows the order within 5 seconds.

2. **API smoke test.** From your laptop: `curl -u $QLOAPPS_API_KEY: https://book.triindiahospitality.com/api/orders?output_format=JSON&limit=1` returns the test booking as JSON.

3. **Glue sync test.** Watch the glue service logs: `journalctl -u triindia-glue -f`. Within 60 seconds of the QloApps booking, you should see a log line `synced order ext_id=<x> → prisma Booking id=<y> → odoo lead id=<z>`.

4. **Prisma row.** `psql ... -c "SELECT id, externalRef, externalSource FROM \"Booking\" ORDER BY id DESC LIMIT 1;"` shows the test booking with `externalRef` populated and `externalSource = 'qloapps'`.

5. **Odoo CRM row.** Log into https://crm.triindiahospitality.com → CRM → Pipeline. The test guest appears as a new lead with the correct source tag.

6. **Website booking test.** Submit a test booking through https://triindiahospitality.com/book/j-residency. Prisma row exists immediately; within one poll cycle the same booking appears in QloApps (because the booking-requests route now also POSTs to QloApps) AND in Odoo.

7. **Idempotency.** Re-run the glue service over the same time window. No duplicate rows in Prisma or Odoo.

8. **No Chrome extension required.** Confirm the QA team can complete the booking flow in a stock Chrome session (no extensions installed).

## Risks & open notes

- **MariaDB SQL access requires the root password from `/opt/triindia/qloapps/.env`.** That file is not in git (correctly gitignored). Shiv must pull the password out when we begin Stage 1.
- **`webkul/qloapps_docker:latest` rolls.** A future `docker pull` could change the QloApps version under us. Pin to a specific digest in the compose file as part of Stage 1 work (`webkul/qloapps_docker@sha256:...`).
- **Database migrations on a live QloApps DB are risky.** The `ps_shop_url` and `ps_configuration` UPDATEs are well-known PrestaShop fixes and reversible by re-running the UPDATE with old values — but back up the QloApps DB before any UPDATE: `docker exec qloapps-web mariadb-dump -uroot -p"$MYSQL_ROOT_PASSWORD" qloapps > /opt/triindia/backups/qloapps-$(date +%F).sql`.
- **The Chrome extension might be doing something Stage 1 doesn't catch.** If it is, Stage 1's verification step will tell us — bookings still won't appear. Then we widen the investigation (PHP logs, mod_rewrite, CSRF token). The plan does not assume Stage 1 will fix everything; it just makes the cheap fix first.
- **`AGENTS.md` rule: do not edit QloApps core PHP.** This plan respects that. If Step 1 fallback requires source patches, they will be applied via `override/` mounted as a Docker bind from a new repo folder `qloapps/override/`, never to the named-volume copy directly.
- **No deploy without Shiv's explicit ask.** Stage 1 is on production (it has to be — there's no local QloApps in the repo). Each Stage 1 SQL UPDATE is run only after Shiv approves the exact statement; nothing is pushed automatically.
- **Supabase decision is deferred, not killed.** If later the WhatsApp AI agent benefits from realtime subscriptions, we add Supabase as a downstream consumer of the same Postgres (logical replication or a small fanout worker), not as a second source of truth.
