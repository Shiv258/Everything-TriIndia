---
name: premium-hotel-landing-page
description: Use when creating a premium hotel landing page with a cinematic AI-generated hero video, direct-booking flow, room galleries, property storytelling, and location animation. Trigger on requests like "create a hotel landing page", "build a premium property subpage", "build a hotel website from these photos", "build a direct-booking page", "make a hotel page like J Residency", or "turn this hotel's photos into a cinematic site". Do NOT use for generic SaaS, restaurant, or plain listing pages unless the user explicitly wants the J Residency style.
---

# Premium Hotel Landing Page Builder

Build a premium, high-converting hotel landing page by treating the hero video, assets, booking flow, and page sections as one system. The J Residency page is the canonical reference: video-first, direct-booking focused, warm luxury, clean UX, built around real property media.

**Core principle:** start with the cinematic hero asset, then design the page around conversion, trust, room selection, and location clarity. Never use `Learn More` as the primary CTA on a booking page — always `Book Now`, `Book this room`, `Send Booking Request`, or `Book with <PROMO_CODE>`.

## When to use

- Create a hotel landing page like J Residency
- Build a premium property subpage in the TriIndia portfolio
- Use Seedance (or another AI video tool) for a website hero video
- Turn hotel photos into a cinematic website
- Build a direct-booking page for a hotel
- Compose a hotel website from room images, property images, logo, and location media

For a deeper hand-holding of the simpler subpage scaffold (older architecture, before the `/hotels/[slug]` route), see the local `hotel-subpage` skill — but prefer this one for new builds.

## Prerequisites

**Hotel facts (ask if missing):**
- Name, slug, parent brand
- Address, neighbourhood, pincode
- Phone (WhatsApp-capable)
- Google Maps share link
- Room types with rates, original rates, and discount %
- Promo code (J Residency uses `RETURN15`)

**Asset checklist:**
- Hero video (or a reference image to generate one via Seedance)
- 4+ property photos (reception, lounge, two room moods minimum)
- 3–7 photos per room type
- Optional: ~60 map scroll frames (`frame-001.jpg` through `frame-NNN.jpg`)
- Hotel logo (transparent SVG/PNG preferred)

## Workflow

Follow these steps in order. Do not skip ahead.

### 1. Confirm hotel facts

Lock everything in the prerequisites list above before touching code. Use `lib/hotels.ts` schema as the bar — every field there needs an answer or an explicit "skip".

### 2. Gather or generate the hero video

If a hero video already exists, place it at `public/<hotel-slug>/hero-video.mp4` and skip to step 3.

If no hero video exists:

1. Decide on a hero reference image (reception/arrival vs. bedroom-first) — see `references/seedance-hotel-hero-prompt.md`.
2. If no reference image exists, generate one with the **Premium Reference Image Prompt** in the references file.
3. Build a Seedance prompt using ALL 7 mandatory sections — `SCENE`, `CAMERA`, `ACTION ARC`, `TEXT CHOREOGRAPHY`, `LIGHTING & ATMOSPHERE`, `LOOP SEAL`, `TECHNICAL`. Use the **Reconstructed J Residency Seedance Prompt** in the references file as the calibration baseline.
4. Generate the 10-second loop in **image-to-video mode**, using the **same reference image** as both first and last frame.
5. Export MP4, place at `public/<hotel-slug>/hero-video.mp4`.

If you need general Seedance prompt rules outside the hotel-hero context, defer to the local `seedance-loop-prompt` skill.

### 3. Place assets

```text
public/<hotel-slug>/
  hero-video.mp4
  <hotel-logo>.jpeg            (or .svg / .png)
  reception-area.jpeg
  sitting-area.jpeg
  bedroom-<mood>.jpeg          x2+
  rooms/
    <room-slug>/1.jpeg … N.jpeg
  map-frames/                  (optional, only if scroll-scrub map is built)
    frame-001.jpg … frame-NNN.jpg
```

### 4. Add the hotel to `lib/hotels.ts`

Add an entry to the `hotels` array. Required fields: `slug`, `name`, `tagline`, `neighborhood`, `address`, `pincode`, `coordinates`, `phone`, `description[]`, `amenities[]`, `rooms[]`, `heroImage`, `galleryImages[]`, `featured`, `status`. Optional: `heroVideo`, `detailGallery`, `mapEmbedUrl`, `promoCode`, `conciergeBlurb`, `scrollFrames`.

If the hotel deserves the full J Residency cinematic treatment (premium video hero, scroll-scrub map, AI concierge section), set `scrollFrames: true` and include a custom landing component (see step 5).

### 5. Decide: shared template or custom landing component

**Default path — shared `HotelDetailTemplate.tsx`:** sufficient for most hotels. Renders hero photo + about + amenities + gallery carousel + Mapbox static-image of the location. Just adding the hotel to `lib/hotels.ts` is enough — `app/hotels/[slug]/page.tsx` picks it up automatically.

**Premium path — custom `LandingPage` component (J Residency tier):** required only when the operator wants the full cinematic treatment for this property. Steps:

1. Either reuse `components/LandingPage.tsx` (currently J Residency-specific) by parameterising it, or copy it to `components/<HotelName>LandingPage.tsx` and swap hardcoded J Residency strings/paths for the new hotel.
2. Wire the special case in `app/hotels/[slug]/page.tsx`:
   ```tsx
   if (hotel.slug === "<new-slug>") {
     return <<HotelName>LandingPage />;
   }
   ```
3. Implement all 12 sections in the order listed in `references/j-residency-reference.md` (section-by-section breakdown there).

### 6. Wire routes

For a portfolio hotel, you usually need:

- Canonical: `app/hotels/[slug]/page.tsx` (already exists — uses `generateStaticParams` from `lib/hotels.ts`).
- Booking page (if direct-booking capture is enabled): `app/book/<slug>/page.tsx` and `app/book/<slug>/BookingRequestForm.tsx`. Reuses `/api/booking-requests` and `lib/booking-validation.ts`.
- Legacy redirects only if the operator already shared older URLs.

### 7. Verify

Run in this order — fix any failure before continuing:

```bash
npm run lint
npm run typecheck
npm run build
```

Then walk the verification checklist in `references/j-residency-reference.md` — hero autoplays, booking panel works, room modal opens/closes/navigates, map scroll doesn't crash on missing frames, mobile usable, desktop preserves premium spacing.

## Hard rules — never break these

1. **Hero video must be of THIS property.** Do not use stock or unrelated cinematic footage. The hero is the trust signal.
2. **Static lighting in the Seedance prompt.** No flicker, no day-night shift — it kills loop integrity.
3. **Same first/last frame for the Seedance loop.** Always image-to-video mode with the identical reference image at both ends.
4. **Direct-booking CTA is the primary CTA.** Never `Learn More` above the fold.
5. **AI Concierge is framed as an amenity, not a replacement for reception.** The copy must protect human hospitality.
6. **Room modal must use `object-fit: contain`** — guests need to inspect rooms without cropping.
7. **Mobile-first.** A premium desktop layout that breaks on mobile is a failed build — Indian guests browse on phones.
8. **Do not hardcode J Residency details into reusable components.** When extending for a new hotel, parameterise via `lib/hotels.ts`.
9. **Do not bake text into the Seedance video** when the page will overlay or handle text separately. Keep the video as a clean cinematic plate.

## Common mistakes to prevent

- Random hero video unrelated to the actual property
- Different first and last Seedance reference images for what's meant to be a loop
- Overlay text on a clean cinematic plate
- Burying the booking CTA below too much storytelling
- Skipping static-lighting instruction in the Seedance prompt
- Cropping room modal images so aggressively that the room can't be inspected
- Making AI concierge sound like it replaces reception
- Treating mobile as an afterthought

## References

Heavy detail lives in the reference files alongside this SKILL.md:

- [`references/j-residency-reference.md`](references/j-residency-reference.md) — canonical implementation: 12 page sections in order, exact copy, booking flow internals, design system (colors, typography, motion, responsive rules), data model, file inventory, verification checklist.
- [`references/seedance-hotel-hero-prompt.md`](references/seedance-hotel-hero-prompt.md) — reference image prompts (lobby-first and bedroom-first variants) and the full reconstructed J Residency Seedance prompt with all 7 sections, for calibration.

## Accuracy boundary

The reconstructed Seedance prompt in `references/seedance-hotel-hero-prompt.md` is a faithful reconstruction from the final video + local Seedance rules + landing page implementation — not the verbatim original. Do not claim it is the original unless the original is recovered from chat history.

## Notes for maintainers

The `hotel-subpage` skill in this repo predates the `/hotels/[slug]` redesign and references components that no longer exist (`RoomsSection.tsx`, the original `LandingPage.tsx` hardcoded for J Residency). Prefer this skill for new builds. The `hotel-subpage` skill should be updated or deprecated.
