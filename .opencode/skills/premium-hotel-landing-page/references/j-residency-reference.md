# J Residency — Canonical Reference

The implementation specs, exact copy, design system, data model, and verification checklist for the J Residency landing page. Use this as the bar for any new premium hotel landing page build.

## Property facts

| Field | Value |
|---|---|
| Name | J Residency |
| Parent brand | TriIndia Hospitality |
| Address | 51, Block B, Jangpura B, New Delhi, Delhi 110014 |
| Neighbourhood | Jangpura B (central South Delhi) |
| Nearby anchor | Nizamuddin Railway Station, ~2 min walk |
| Phone | `+919899402024` |
| Google Maps | `https://maps.app.goo.gl/Ez8pNYKhYcpUrGLt5` |
| Canonical route | `/hotels/j-residency` |
| Legacy redirects | `/jresidency`, `/j-residency` |
| Booking route | `/book/j-residency` |
| Promo code | `RETURN15` |

## Brand mood

Premium but not overdesigned. Warm Delhi hospitality, not cold luxury. Clean, direct, owner-run, practical. Inspired by Linear, Vercel, Stripe Sessions, Apple-style product pages. Visual language: espresso, ivory, champagne gold, teal, terracotta, soft shadows, large serif headlines.

## Conversion intent

The page is not a brochure. It is engineered for direct booking. Primary CTAs are always some form of: `Book Now`, `Book this room`, `Book with RETURN15`, `Send Booking Request`. `Learn More` is never the primary CTA.

## Asset inventory

### Hero video
- Path: `public/jresidency/hero-video.mp4`
- Codec: H.264 · 1920×1080 · 24 fps · 10.04s · ~17 MB
- Usage: full-screen autoplay muted loop
- Content: cinematic interior flythrough — reception/lounge → corridor → bedroom-1 (teal cushions) → bedroom-2 (red runner) → resolves to centred bed framed by doorway

### Property images (`public/jresidency/`)
- `reception-area.jpeg` — 854×1280, 0.16 MB
- `sitting-area.jpeg` — 862×1280, 0.14 MB
- `bedroom-blue.jpeg` — 1280×854, 0.12 MB
- `bedroom-red.jpeg` — 1280×854, 0.15 MB
- `j-logo.jpeg` — 1268×1267, 0.03 MB

### Room images (`public/jresidency/rooms/`)
- `deluxe/1.jpeg … 4.jpeg` — 4 photos
- `studio/1.jpeg … 6.jpeg` — 6 photos
- `executive-suite/1.jpeg … 7.jpeg` — 7 photos
- `family-suite/1.jpeg … 4.jpeg` — 4 photos

### Map scroll frames (`public/jresidency/map-frames/`)
- `frame-001.jpg … frame-061.jpg` — 61 frames driving the scroll-scrub location animation

## Data model — `lib/hotels.ts`

The J Residency entry uses every optional field. Fields:

```ts
slug: "j-residency"
name: "J Residency"
shortName: "J Residency"
tagline: <one-line property pitch>
neighborhood: "Jangpura B"
address: "Jangpura B, New Delhi"
pincode: "110014"
coordinates: { lat: 28.5825, lng: 77.2421 }
phone: "+919899402024"
description: [<paragraph 1>, <paragraph 2>]
amenities: [{ label, icon: "wifi"|"bed"|"dining"|"reception"|… , detail }]
rooms: [{ slug, name, rate, originalRate, discount, description, heroImage, images[] }]
heroImage: "/main-images/J%20Residency.jpeg"
galleryImages: [3 paths under /j-residency-main/]
detailGallery: [{ src, label, copy } × 4]    // reception, sitting, blue bedroom, red bedroom
heroVideo: "/jresidency/hero-video.mp4"
mapEmbedUrl: <Google Maps share link>
featured: true
status: "active"
promoCode: "RETURN15"
conciergeBlurb: [<4 bullets>]
scrollFrames: true                            // triggers the 61-frame scroll-scrub map
```

## Routing

```text
app/hotels/[slug]/page.tsx          ← dynamic route, generateStaticParams from hotels[]
  if (hotel.slug === "j-residency") return <LandingPage />
  else                              return <HotelDetailTemplate hotel={hotel} />

app/jresidency/page.tsx             ← redirect("/hotels/j-residency")
app/j-residency/page.tsx            ← redirect("/hotels/j-residency")
app/book/j-residency/page.tsx       ← reads ?arrival, ?departure, ?guests, ?room query params
```

## Page sections — exact order

The landing page lives in `components/LandingPage.tsx`. Reproduce this order strictly.

### 1. Fixed navigation
- Wordmark: circular `J` + `J Residency` lockup
- Links: `Rooms`, `Property`, `AI Concierge`, `Location`
- CTA: `Book Now`
- Transparent over hero, solid ivory after scroll > 40px

### 2. Full-screen video hero
```tsx
<motion.video
  className="hero-video__media"
  style={{ scale: videoScale, opacity: videoOpacity }}
  src="/jresidency/hero-video.mp4"
  autoPlay muted loop playsInline preload="metadata"
/>
```
- No text overlay
- Full viewport height
- `object-fit: cover`
- Scroll transform: video scales 1 → 1.08, opacity 1 → 0.74
- Mobile min-height ≥ 540 px

### 3. Reservation stage
Fields: Arrival · Departure · Guests · Room Type · Book Now

Rules:
- Past dates disabled
- Departure cannot precede arrival
- Room can be set from a room card via `Book this room`
- `Book Now` opens: `/book/j-residency?arrival=…&departure=…&guests=…&room=…`

Copy:
> **Book direct at J Residency**
> RETURN15
> Choose dates, guests, and a room type. The Book Now button opens a ready-to-send reservation message with RETURN15 included.

### 4. Intro panel
Copy:
> **J Residency / 51, Block B, Jangpura B**
> Stay close to South Delhi with rooms that keep travel simple.
> J Residency gives guests a clean room, helpful reception, in-house dining, and a clear path to book direct. No overcomplication. Just a better base for Delhi.

Image: `/jresidency/sitting-area.jpeg`

### 5. Amenity strip — 4 cards, custom inline SVG icons

- **Free WiFi** — Fast connection for work, calls, and travel planning.
- **Luxury Rooms** — Clean rooms with polished finishes and comfortable bedding.
- **In-House Dining** — Food support inside the property without stepping out.
- **24/7 Reception** — Front-desk support for arrivals, stays, and questions.

Do not substitute random lucide icons here — these four use bespoke inline SVGs to feel tactile.

### 6. Rooms & prices

Heading:
> **Rooms & prices**
> Pick the room that matches the trip.
> Tap any room to open the full image gallery. Use "Book this room" to send that exact room category into the booking panel.

Rooms:

| Room | Rate | Original | Discount | Photos |
|---|---|---|---|---|
| Deluxe Room | ₹1,999 | ₹2,999 | 33% off | 4 |
| Studio Room | ₹1,999 | ₹2,999 | 33% off | 6 |
| Executive Attached Suite Room | ₹2,499 | ₹3,499 | 29% off | 7 |
| Family Suite Premium Room | ₹4,499 | ₹6,499 | 31% off | 4 |

Rules:
- Each room card is clickable; opens room modal
- Each card shows `View gallery` and `Book this room`
- `Book this room` scrolls to reservation and sets the room type
- Card preview shows up to 6 thumbnails
- Modal supports next/prev arrows + clickable thumbnails
- Modal uses `object-fit: contain` — never crop the room

### 7. Property gallery story

Heading:
> **Inside the property**
> Reception, lounge, rooms, and the details guests actually notice.
> Move through the hotel the way a guest does: first impression, waiting space, room decision, then booking.

Gallery items (caption copy is intentional):

- **Reception** — Chandelier light, marble flooring, and a front desk built for quick arrivals.
- **Sitting Area** — Teal lounge seating, gold table frames, wall art, and a quiet pause before the room.
- **Guest Room Detail** — Crisp linen, paneled walls, and a clean room setup for business and leisure stays.
- **Warm Suite Detail** — Wood textures, warm sconces, and a softer room mood for families and longer nights in Delhi.

Rules: sticky copy on desktop, offset stacked image cards, dark caption glass panels.

### 8. AI Concierge amenity

Copy:
> **AI Concierge Amenity**
> Questions answered faster, without replacing hospitality.
> AI concierge support is presented as a guest amenity: faster answers for room details, arrival help, dining questions, and common stay requests before reception takes over where human care is needed.

Bullets:
- Ask about room types, rates, check-in, or dining before you arrive.
- Get the map link and arrival guidance without searching through messages.
- Send simple requests faster: extra bedding, dining questions, or late arrival notes.
- Reception stays in control whenever a guest needs a real person.

Visual rules:
- CSS-only AI mesh, core, pulsing rings — do not use generic robot or stock AI photos
- Floating cards: `Ask before you arrive`, `Reception follows through`

### 9. Direct booking offer

Copy:
> **Direct booking benefit**
> Use RETURN15 when booking direct.
> Keep the offer close to the reservation flow. Guests can choose a room above, send the booking request, and mention RETURN15 in the same message.
> **Book with RETURN15**

Rules:
- Refined offer card — no loud coupon badge, no circle stamp
- Link returns to `#reserve`

### 10. Location with scroll-scrub map

Implementation: `ScrollFrameMap` component stores a target ref, calculates section scroll progress, maps progress to frame 1–61, renders `/<hotel-slug>/map-frames/frame-NNN.jpg`.

Copy:
> **Location**
> 51, Block B, Jangpura B, New Delhi, Delhi 110014
> Scroll through the map preview, then open the live route in Google Maps when you are ready to navigate.
> **Open Google Maps**

Rules:
- Component must degrade gracefully when frames are missing — do not crash the page

### 11. Final booking CTA

Copy:
> **Ready to stay?**
> Choose dates, compare rooms, and send your booking request.
> **Book Now**

Rules: large centred serif headline (Fraunces), dark espresso background, champagne CTA.

### 12. Footer

- Logo: `/jresidency/j-logo.jpeg`
- Brand line: `J Residency by TriIndia Hospitality`
- Signup copy: `Direct booking updates, room offers, and J Residency news.`
- Meta: `triindia.in/jresidency` · `Google Maps route ready`

## Booking flow internals

### Frontend
- `app/book/j-residency/page.tsx` — normalises query params (`arrival`, `departure`, `guests`, `room`), maps room display names → slugs:
  ```
  Deluxe Room                    → deluxe
  Studio Room                    → studio
  Executive Attached Suite Room  → executive-suite
  Family Suite Premium Room      → family-suite
  ```
- `app/book/j-residency/BookingRequestForm.tsx` — form fields: Guest Name, Phone, Email (optional), Guests, Check-In, Check-Out, Room Preference, Special Requests. Submit label: `Send Booking Request`.

### API
- `app/api/booking-requests/route.ts` — POST handler. Flow:
  1. Parse JSON
  2. Validate with Zod schema from `lib/booking-validation.ts`
  3. Find property by slug
  4. Find room by property + room slug (if provided)
  5. Upsert guest by phone
  6. Create booking with reference `TRI-YYYYMMDD-XXXXX`
  7. Return booking JSON

### Database (Prisma)
Models: `Property`, `Room`, `Guest`, `Booking`, `Payment`, `Message`, `Kalakar`.

Enums:
- `BookingStatus`: `NEW | CONTACTED | CONFIRMED | CHECKED_IN | CHECKED_OUT | CANCELLED`
- `PaymentStatus`: `PENDING | PAID | FAILED | REFUNDED`

## Design system

### Colors (CSS variables in `app/globals.css`)

```css
--ink: #15100b
--coffee: #2a1b12
--espresso: #0f0b08
--ivory: #f6efe3
--paper: #fff9ee
--champagne: #c39a57
--gold: #ad7b33
--teal: #0d6f75
--terracotta: #9c4a31
--stone: #d9cab7
--muted: #75685d
```

### Typography
- **Fraunces** (display): large emotional headings, section H2s
- **Geist** (sans): UI labels, body, nav
- Uppercase microcopy with wide tracking for section kickers
- Headlines must be specific, not generic luxury filler

Tailwind aliases in `tailwind.config.ts`:
- `font-sans` → Geist
- `font-display` → Fraunces
- `font-heading` → Fraunces

### Motion
- Use `Reveal` wrapper with Framer Motion
- Initial: `{ opacity: 0, y: 34 }`
- Animate: `{ opacity: 1, y: 0 }`
- Duration: 0.9s
- Ease: `[0.22, 1, 0.36, 1]`
- Respect `prefers-reduced-motion`

### Responsive rules
- Hero min-height: 620 px desktop, 540 px mobile
- Nav hides center links on mobile (hamburger sheet)
- Booking grid: 5 cols → 2 cols → 1 col
- Room grid, intro, gallery story, concierge, location, footer all collapse to single column
- Room modal: 2-col → 1-col under 1040 px

## Verification checklist

- [ ] Hero video autoplays muted, loops, does not block mobile rendering
- [ ] `/hotels/<slug>` loads correctly
- [ ] Legacy aliases redirect if any
- [ ] Booking panel updates arrival/departure/guests/room
- [ ] `Book Now` passes query params into the booking page
- [ ] Booking form validates name, phone, dates, guests, and checkout > checkin
- [ ] Room modal opens, closes, navigates next/prev, thumbnails work
- [ ] All images load from `public/<hotel-slug>/`
- [ ] Map scroll-frame section does not crash if frames are missing
- [ ] Mobile nav is usable
- [ ] Desktop layout preserves premium spacing
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes

## File map for reference

- `components/LandingPage.tsx` — canonical J Residency landing page
- `components/hotels/HotelDetailTemplate.tsx` — shared template for non-J-Residency hotels
- `app/globals.css` — all J Residency section styles + responsive rules
- `lib/hotels.ts` — hotel data source of truth
- `app/hotels/[slug]/page.tsx` — dynamic route with J Residency special case
- `app/jresidency/page.tsx`, `app/j-residency/page.tsx` — legacy redirects
- `app/book/j-residency/page.tsx` — booking page
- `app/book/j-residency/BookingRequestForm.tsx` — booking form
- `app/api/booking-requests/route.ts` — booking API
- `lib/booking-validation.ts` — Zod validation
- `prisma/schema.prisma` — booking database models
- `public/jresidency/hero-video.mp4` — final hero video
- `.opencode/skills/seedance-loop-prompt/SKILL.md` — generic Seedance prompt rules
