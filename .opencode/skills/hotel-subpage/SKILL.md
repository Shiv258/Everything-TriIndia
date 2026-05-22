# Hotel Subpage Skill

## Trigger
Use this skill when the user wants to add a new hotel property subpage to the TriIndia Hospitality website (e.g., "create a new hotel page", "add Ashram View subpage", "build a hotel landing page like J Residency").

## Goal
Generate a premium, production-ready hotel subpage under `/app/<hotel-slug>/` that mirrors the J Residency architecture: cinematic video hero, booking panel with real calendar picker, room galleries, scroll-scrub location animation, amenities, direct-booking offer, and WhatsApp CTA.

## Prerequisites
- The TriIndia main Next.js app is already set up.
- Assets are available: hero video, room images, property photos, map video (or location image), and a hotel logo.

## Workflow

### 1. Gather Inputs
Ask the user for (or infer from context):
- Hotel name and slug (e.g., `ashram-view`)
- Room types, names, rates, original rates, and discount percentages
- WhatsApp booking number
- Full address and Google Maps link
- Seedance / hero video file name (or generate one)
- Room image folder structure
- Brand colors (if different from J Residency)

### 2. Scaffold Assets
Create the asset folder:
```
public/<hotel-slug>/
  hero-video.mp4
  <hotel-logo>.jpeg
  rooms/
    <room-slug>/1.jpeg ... N.jpeg
  map-frames/       (if using scroll-scrub map)
    frame-001.jpg ... frame-NNN.jpg
  property-photos/  (reception, lounge, etc.)
```

### 3. Create the Landing Page Component
Create `components/<HotelName>LandingPage.tsx` using the J Residency `LandingPage.tsx` as the base template.

Required sections (copy structure from `components/LandingPage.tsx`):
1. **Fixed Navigation** — transparent over hero, solid after scroll. Links to `#top`, `#reserve`, `#rooms`, `#experience`, `#concierge`, `#location`.
2. **Video Hero** — full-screen muted looping video. No overlay text. Scroll indicator at bottom.
3. **Booking Panel** — floating glass card with:
   - Check-in / Check-out using the `CalendarPicker` component (month navigation, disabled past dates, checkout cannot be before checkin).
   - Guest & room count chips.
   - WhatsApp CTA button pre-filled with `dates | guests | rooms | RETURN15`.
4. **Room Grid** — 2×2 cards with:
   - Hover gallery cycling through room images.
   - Price with strikethrough original + discount badge.
   - "Book this room" button that opens room modal.
5. **Room Modal** — full-screen overlay with:
   - Prev / Next arrows.
   - Clickable thumbnails.
   - `object-fit: contain` so images are never cropped.
   - WhatsApp link pre-filled for that specific room.
6. **Amenities** — 4 items with custom inline SVG icons (wifi, bed, dining, reception).
7. **Gallery** — 4 property photos with reveal animations.
8. **Location** — scroll-scrub map animation (or static map image if no video) + address + Google Maps link.
9. **Direct Booking Offer** — clean card with `RETURN15` (or hotel-specific code). No circle badge.
10. **AI Concierge Visual** — CSS-only animated mesh + pulsing rings (do not use a random stock photo).
11. **Footer** — address, phone, email, quick links, socials.

### 4. Wire Routes
Create `app/<hotel-slug>/page.tsx`:
```tsx
import type { Metadata } from "next";
import <HotelName>LandingPage from "@/components/<HotelName>LandingPage";

export const metadata: Metadata = {
  title: "<Hotel Name> | TriIndia Hospitality",
  description: "...",
  openGraph: { images: ["/<hotel-slug>/<logo>.jpeg"] },
};

export default function Page() {
  return <<HotelName>LandingPage />;
}
```

If needed, also create a hyphenated alias (e.g., `app/<hotel-slug-hyphen>/page.tsx`).

### 5. Link from Main Page
Open `components/home/RoomsSection.tsx` and add the new hotel card to the `rooms` array. Set `href: "/<hotel-slug>"` so users can navigate from the home page.

### 6. Styling Rules
- Keep custom styles in `app/globals.css`. Prefix new hotel-specific selectors with the hotel slug to avoid collisions (e.g., `.ashram-hero`, `.ashram-calendar`).
- Use the existing design system: premium, modern, clean, luxury but not overdesigned.
- Do not import `@base-ui/react` or heavy UI libraries. Use standard HTML + Tailwind + `framer-motion` + `lucide-react`.
- If the main page already imports a font (e.g., DM Sans / Playfair Display), reuse it. If the hotel needs a distinct mood, extend `tailwind.config.ts` `fontFamily` or add a new Google Font `@import` in `globals.css`.

### 7. Build & Verify
Run in sequence:
```bash
npm run lint
npm run typecheck
npm run build
```
If any error appears, fix it before proceeding. Do not ignore warnings when `max-warnings=0` is set.

### 8. Optimization for Slow Networks (Jio)
- Compress all JPEG/MP4 assets before copying into `public/`.
- Use `next/image` with `priority` for above-the-fold images (logo, first room image).
- Keep hero videos under 8 MB and 720p unless the user provides a higher-res file.
- Use `loading="lazy"` for below-the-fold images.
- Run `next build` and verify the `.next/static` output size is reasonable.

## Reference Files
- `components/LandingPage.tsx` — canonical J Residency implementation.
- `components/home/RoomsSection.tsx` — how to link a new hotel from the main page.
- `app/globals.css` — all animation keyframes, calendar styles, modal styles.
- `app/jresidency/page.tsx` — route + metadata pattern.

## Customization Checklist
- [ ] Replace all room data arrays.
- [ ] Replace WhatsApp number in booking CTA.
- [ ] Replace address and Google Maps link.
- [ ] Replace hero video source.
- [ ] Replace map frame images or location image.
- [ ] Update metadata title/description/OG image.
- [ ] Verify `href` in main page `RoomsSection` points to the new slug.
- [ ] Run `lint`, `typecheck`, `build`.
