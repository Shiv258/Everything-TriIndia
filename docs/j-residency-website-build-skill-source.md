# J Residency Website Build - Skill Source Document

This document is a strict source pack for creating a reusable skill that reproduces the J Residency website workflow: Seedance hero video generation, asset preparation, page architecture, booking flow, room galleries, map scroll frames, and final implementation rules.

Important: this is not installed as a skill yet. It is intentionally stored as a documentation source file. Before converting it into `.opencode/skills/<skill-name>/SKILL.md`, run the normal skill-writing test process.

## Known Accuracy Boundary

The repository contains the final implementation, the final hero video, the local Seedance prompt skill, and all final assets. It does not contain the original chat transcript or the exact original Seedance prompt text that produced the video. The prompt included below is therefore a strict reconstruction based on:

- The final `public/jresidency/hero-video.mp4`
- The local Seedance prompt rules in `.opencode/skills/seedance-loop-prompt/SKILL.md`
- The current J Residency page implementation in `components/LandingPage.tsx`
- The actual public assets under `public/jresidency/`

Do not claim the reconstructed prompt is the verbatim original unless the original prompt is later recovered from chat history.

---

## Draft Skill Frontmatter

```yaml
---
name: building-premium-hotel-landing-pages
description: Use when creating a premium hotel landing page with a cinematic Seedance hero video, direct-booking flow, room galleries, property story sections, map animation, and mobile-first conversion design.
---
```

# Building Premium Hotel Landing Pages

## Overview

Build a premium, high-converting hotel landing page by treating the hero video, assets, booking flow, and page sections as one system. The J Residency page is the canonical reference: video-first, direct-booking focused, warm luxury, clean UX, and built around real property media.

The core principle: start with the cinematic hero asset, then design the page around conversion, trust, room selection, and location clarity.

## When to Use

Use this when the user asks to:

- Create a hotel landing page like J Residency
- Build a premium property subpage
- Use Seedance or another AI video tool for a website hero video
- Turn hotel photos into a cinematic website
- Build a direct-booking page for a hotel
- Create a hotel website from room images, property images, logo, and location

Do not use this for a generic SaaS landing page, restaurant page, or plain property listing page unless the user explicitly wants the J Residency style.

---

## Real J Residency Context

### Property

- Name: J Residency
- Parent brand: TriIndia Hospitality
- Location: 51, Block B, Jangpura B, New Delhi, Delhi 110014
- Nearby positioning: close to Nizamuddin Railway Station, central South Delhi
- Phone in data model: `+919899402024`
- Google Maps link: `https://maps.app.goo.gl/Ez8pNYKhYcpUrGLt5`
- Route: canonical page is `/hotels/j-residency`
- Legacy redirects: `/jresidency` and `/j-residency` redirect to `/hotels/j-residency`

### Brand Mood

- Premium but not overdesigned
- Warm Delhi hospitality, not cold luxury
- Clean, direct, owner-run, practical
- Inspired by Linear, Vercel, Stripe Sessions, and Apple-style product pages
- Visual language: espresso, ivory, champagne gold, teal, terracotta, soft shadows, large serif headlines

### Conversion Goal

The page is not just a brochure. It is designed to push direct booking.

The primary CTA is always some form of:

- `Book Now`
- `Book this room`
- `Book with RETURN15`
- `Send Booking Request`

Do not make `Learn More` the primary CTA on a hotel booking page.

---

## Asset Inventory Used For J Residency

### Hero Video

- Final workspace source: `FINAL Website Video.mp4`
- Public website path: `public/jresidency/hero-video.mp4`
- Hash check: both files are identical
- Codec: H.264
- Resolution: 1920x1080
- Duration: 10.041667 seconds
- Frame rate: 24 fps
- Size: 17.2 MB
- Website usage: full-screen autoplay muted looping hero video

### Hero Video Visual Outcome

Sample frames show a cinematic interior walkthrough:

1. Starts around reception/lounge view: front desk, teal seating, chandelier, warm marble/cream interior.
2. Moves through corridor/door framing with reflective wall panels.
3. Reveals a bedroom with white bed, teal cushions, warm wall panels, rug, bedside table.
4. Moves to a second bedroom mood with red pillows, red runner, wood-textured wall.
5. Ends on a centered bed frame with soft overlay/door-frame transition.

This means the actual hero direction was not a product orbit or abstract animation. It was a hotel flythrough/reveal loop using realistic property interiors.

### Property Images

Stored under `public/jresidency/`:

- `reception-area.jpeg` - 854x1280, 0.16 MB
- `sitting-area.jpeg` - 862x1280, 0.14 MB
- `bedroom-blue.jpeg` - 1280x854, 0.12 MB
- `bedroom-red.jpeg` - 1280x854, 0.15 MB
- `j-logo.jpeg` - 1268x1267, 0.03 MB

### Room Images

Stored under `public/jresidency/rooms/`:

- Deluxe Room: 4 images
- Studio Room: 6 images
- Executive Attached Suite Room: 7 images
- Family Suite Premium Room: 4 images
- Total room images: 21

Exact folders:

```text
public/jresidency/rooms/deluxe/1.jpeg ... 4.jpeg
public/jresidency/rooms/studio/1.jpeg ... 6.jpeg
public/jresidency/rooms/executive-suite/1.jpeg ... 7.jpeg
public/jresidency/rooms/family-suite/1.jpeg ... 4.jpeg
```

### Map Scroll Frames

Stored under:

```text
public/jresidency/map-frames/frame-001.jpg ... frame-061.jpg
```

Total map frames: 61.

These power the scroll-scrub location animation. The page maps scroll progress to frame 1 through frame 61.

---

## Seedance Workflow Used For This Style

### Strict Workflow

1. Gather hotel subject and core positioning.
2. Gather or create a premium reference image prompt if no hero image exists.
3. Generate a Seedance prompt for a 10-second seamless looping website hero video.
4. In Seedance image-to-video mode, use the same reference image as first frame and last frame.
5. Export final video as MP4.
6. Place final video at `public/<hotel-slug>/hero-video.mp4`.
7. Build the landing page around the video.

### How Many Images To Give Seedance

For the loop workflow, give Seedance one primary reference image and use it twice:

- First frame reference: the image
- Last frame reference: the exact same image

This forces the loop seal.

For hotel flythroughs, optionally provide property images as visual guidance if the tool supports multiple references, but the strict loop method still needs the same first and last frame. For J Residency style, the best reference should be either:

- A polished reception/lounge interior frame, if the video should start with the property arrival feeling
- A bedroom hero frame, if the video should focus on room comfort

Do not use separate start and end reference images for a seamless loop unless the user explicitly accepts a non-looping cinematic video.

### Prompt Structure Required

Every Seedance prompt must include these 7 sections:

1. SCENE
2. CAMERA
3. ACTION ARC
4. TEXT CHOREOGRAPHY
5. LIGHTING & ATMOSPHERE
6. LOOP SEAL
7. TECHNICAL

Mandatory hard rules:

- 10 seconds unless user specifies otherwise
- Seamless loop
- Same image for first and last frame
- Static lighting throughout
- No text if the website will overlay or handle text separately
- No watermarks
- Hero-safe composition with clean negative space if text will be overlaid by the website

---

## Reconstructed Premium Reference Image Prompt

Use this when a new hotel has no clean first/last reference frame yet.

```text
Create a premium cinematic reference image for a boutique Delhi hotel hero video. The scene shows the interior arrival moment of J Residency in Jangpura B: a clean modern reception desk, teal lounge seating in the foreground, polished marble flooring, warm cream wall panels, subtle gold accents, a chandelier glow, and a calm owner-run hospitality feeling. The camera is positioned as if peeking through a doorway into the lobby, with soft dark vertical door-frame edges on the left and right creating depth and a natural reveal. Lighting is warm, realistic, static, and elegant, with no harsh color shifts. The mood is Apple product-film restraint meets boutique hotel editorial photography. No people dominating the frame, no readable text, no UI, no watermark. 16:9 composition, website hero safe, high detail, realistic interior photography, premium but not overdesigned.
```

If the property has stronger room photography than lobby photography, use this alternate bedroom-first reference prompt:

```text
Create a premium cinematic reference image for a boutique Delhi hotel hero video. The scene shows a clean J Residency guest room with a neatly made white bed, warm wood-textured wall panels, soft bedside sconces, cream flooring, subtle red and teal textile accents, a compact writing table, and a quiet residential South Delhi hotel mood. The camera looks into the room from the doorway, using the door frame as a foreground mask to create a natural cinematic reveal. Lighting is warm, realistic, static, and elegant. The composition is 16:9, website hero safe, with enough calm space for a page transition but no text baked into the image. Realistic hotel interior photography, premium but grounded, no watermark, no UI.
```

---

## Reconstructed Seedance Prompt For J Residency Hero Video

This is the best reconstruction of the J Residency Seedance prompt style based on the final video and the local Seedance prompt rules.

```text
### SCENE

- Subject: J Residency, a boutique TriIndia Hospitality hotel in Jangpura B, New Delhi. The video is a cinematic interior flythrough of the guest arrival journey: reception lounge, corridor transition, and clean guest rooms.
- Environment: warm modern hotel interior with polished marble floors, cream and beige wall panels, teal lounge seating, chandelier light, reflective corridor panels, tidy beds with white linen, teal cushions, red accent pillows, warm wood-textured wall panels, bedside sconces, and compact Delhi hotel proportions.
- Mood references: Apple-style product film restraint applied to boutique hotel interiors; Aman/Soho House editorial hotel photography, but more grounded and owner-run.
- Color palette: espresso shadows, ivory walls, champagne gold highlights, teal seating accents, terracotta/red textile accents, warm white lighting.

### CAMERA

- Motion type: slow cinematic flythrough, as if the viewer is moving through the property from arrival to room reveal.
- Camera behavior: begins from a doorway-framed view into the reception lounge, glides forward with subtle parallax, transitions through reflective corridor and door-frame edges, then reveals two clean guest-room angles.
- Speed: slow, steady, unhurried, premium website hero pace. No sudden cuts, no whip pans, no handheld shake.
- Start position equals end position: the movement resolves back into a doorway-framed hotel interior composition that matches the first frame closely enough for a seamless loop.
- Angle and lens: eye-level interior photography, 24-28mm wide lens feel, realistic perspective, controlled depth, no fisheye distortion.

### ACTION ARC

- Starting state: doorway-framed reception/lounge view, front desk visible, teal seating in foreground, chandelier and warm ceiling light static.
- 0-2.5 seconds: camera glides inward from the lobby view; foreground door edges create a premium reveal, reception and lounge details stay clean and readable.
- 2.5-4.5 seconds: the scene transitions through a corridor or doorway with reflective wall panels, compressing the space like a guest walking from check-in toward the room.
- 4.5-6.5 seconds: first bedroom reveal, white bed, teal cushions, cream wall panels, bedside table, soft warm room lights, clean linen.
- 6.5-8.5 seconds: second bedroom mood appears with red pillows, red runner, warmer wood-textured wall, and a more intimate stay feeling.
- 8.5-10 seconds: motion resolves into a centered bed composition with soft doorway reflection/foreground masking, returning to a visual rhythm compatible with the opening frame.
- Peak visual moment: around 5-6 seconds, when the first guest room opens fully and the bed is cleanly visible.
- Return: final frame settles with no residual motion, matching the start/end reference image as closely as possible.

### TEXT CHOREOGRAPHY

No text. No UI. Background plate only.

### LIGHTING & ATMOSPHERE

- Light source: warm hotel ceiling lights, chandelier glow, bedside sconces, and soft ambient bounce from cream walls.
- Static lighting throughout. No flicker, no pulsing, no color temperature changes, no dramatic day-night shift.
- Highlights: gentle reflections on marble floor and corridor wall panels; soft glow on bedding and wall textures.
- Atmosphere: clean indoor air, no heavy particles, no fog, no surreal effects. Keep it realistic and premium.
- Particle state: no visible particles. If any subtle dust or lens bloom appears, it must be identical at the start and end of the loop.

### LOOP SEAL

- First frame and last frame are the same reference image. Use image-to-video mode in Seedance with the identical image for both first frame and last frame.
- Camera motion returns to the exact same doorway-framed composition and distance.
- All foreground door-frame masks, reflections, lights, and room elements return to their starting state.
- No residual camera drift at the loop point.
- The loop should feel like a continuous calm hotel walkthrough, not an abrupt restart.

### TECHNICAL

- Duration: 10 seconds
- Seamlessly looping video
- Image-to-video generation mode: use the same image for first frame and last frame
- 16:9 website hero composition
- Realistic hotel interior video
- No text baked into the video
- No watermarks
- 4K if supported, otherwise 1080p minimum
```

Seedance setup reminder: use image-to-video mode. Set the same image as both the first frame and last frame reference to ensure a seamless loop.

---

## Final Website Architecture

### Framework And Libraries

- Next.js App Router
- TypeScript
- Tailwind CSS
- Custom global CSS in `app/globals.css`
- Framer Motion for reveals and scroll transforms
- Next Image for optimized images
- Prisma and PostgreSQL for booking request persistence
- Zod for booking request validation

### Fonts

Defined in `app/layout.tsx`:

- `Geist` as the sans font
- `Fraunces` as the serif/display font

Tailwind aliases in `tailwind.config.ts`:

- `font-sans`: Geist
- `font-display`: Fraunces
- `font-heading`: Fraunces

### Core Data Source

`lib/hotels.ts` is the single source of truth for hotel data.

The J Residency object defines:

- `slug: "j-residency"`
- `name: "J Residency"`
- `tagline`
- `address`
- `coordinates`
- `phone`
- `description`
- `amenities`
- `rooms`
- `heroImage`
- `galleryImages`
- `detailGallery`
- `heroVideo: "/jresidency/hero-video.mp4"`
- `mapEmbedUrl`
- `promoCode: "RETURN15"`
- `conciergeBlurb`
- `scrollFrames: true`

### Routing

Canonical route:

```text
/hotels/j-residency
```

Implemented in:

```text
app/hotels/[slug]/page.tsx
```

Special rule:

```tsx
if (hotel.slug === "j-residency") {
  return <LandingPage />;
}
```

Legacy redirects:

```text
app/jresidency/page.tsx -> redirects to /hotels/j-residency
app/j-residency/page.tsx -> redirects to /hotels/j-residency
```

Booking route:

```text
/book/j-residency
```

---

## Page Sections In Exact Order

The J Residency landing page is implemented in `components/LandingPage.tsx`. Reproduce the order strictly.

### 1. Fixed Navigation

Purpose: keep room/property/AI/location links and Book Now available.

Structure:

- Wordmark: circular `J` plus `J Residency`
- Links: `Rooms`, `Property`, `AI Concierge`, `Location`
- CTA: `Book Now`
- Transparent over hero
- Becomes solid ivory after scroll > 40px

### 2. Full-Screen Video Hero

Purpose: make the site feel premium instantly without text clutter.

Implementation:

```tsx
<motion.video
  className="hero-video__media"
  style={{ scale: videoScale, opacity: videoOpacity }}
  src="/jresidency/hero-video.mp4"
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
/>
```

Rules:

- No text overlay in the hero
- Full viewport height
- `object-fit: cover`
- Scroll transform scales video from 1 to 1.08 and fades opacity from 1 to 0.74
- Mobile minimum height around 540px

### 3. Reservation Stage

Purpose: move directly from cinematic trust to booking action.

Fields:

- Arrival
- Departure
- Guests
- Room Type
- Book Now

Rules:

- Past dates disabled
- Departure cannot be before arrival
- Room selection can be set from room cards
- Booking URL carries query params:

```text
/book/j-residency?arrival=...&departure=...&guests=...&room=...
```

Copy used:

```text
Book direct at J Residency
RETURN15
Choose dates, guests, and a room type. The Book Now button opens a ready-to-send reservation message with RETURN15 included.
```

Note: current implementation opens the booking page, not a WhatsApp message.

### 4. Intro Panel

Purpose: establish location and positioning.

Copy:

```text
J Residency / 51, Block B, Jangpura B
Stay close to South Delhi with rooms that keep travel simple.
J Residency gives guests a clean room, helpful reception, in-house dining, and a clear path to book direct. No overcomplication. Just a better base for Delhi.
```

Image:

```text
/jresidency/sitting-area.jpeg
```

### 5. Amenity Strip

Four amenity cards:

- Free WiFi - Fast connection for work, calls, and travel planning.
- Luxury Rooms - Clean rooms with polished finishes and comfortable bedding.
- In-House Dining - Food support inside the property without stepping out.
- 24/7 Reception - Front-desk support for arrivals, stays, and questions.

Rules:

- Use custom inline SVG icons, not random icon sets for this page section
- Cards should feel tactile and premium

### 6. Rooms And Prices

Purpose: make room comparison visual and direct.

Heading:

```text
Rooms & prices
Pick the room that matches the trip.
Tap any room to open the full image gallery. Use "Book this room" to send that exact room category into the booking panel.
```

Room data:

```text
Deluxe Room - INR 1,999 - original INR 2,999 - 33% off - 4 photos
Studio Room - INR 1,999 - original INR 2,999 - 33% off - 6 photos
Executive Attached Suite Room - INR 2,499 - original INR 3,499 - 29% off - 7 photos
Family Suite Premium Room - INR 4,499 - original INR 6,499 - 31% off - 4 photos
```

Rules:

- Each room card is clickable
- Each room card has `View gallery` and `Book this room`
- `Book this room` scrolls to reservation and sets the room type
- Room gallery preview shows up to 6 thumbnails
- Modal supports next/previous arrows and thumbnails

### 7. Property Gallery Story

Purpose: show arrival and stay details in a narrative stack.

Heading:

```text
Inside the property
Reception, lounge, rooms, and the details guests actually notice.
Move through the hotel the way a guest does: first impression, waiting space, room decision, then booking.
```

Gallery items:

- Reception: `Chandelier light, marble flooring, and a front desk built for quick arrivals.`
- Sitting Area: `Teal lounge seating, gold table frames, wall art, and a quiet pause before the room.`
- Guest Room Detail: `Crisp linen, paneled walls, and a clean room setup for business and leisure stays.`
- Warm Suite Detail: `Wood textures, warm sconces, and a softer room mood for families and longer nights in Delhi.`

Rules:

- Sticky copy on desktop
- Offset stacked image cards
- Dark caption glass panels

### 8. AI Concierge Amenity

Purpose: frame AI as a guest amenity, not a replacement for hotel staff.

Copy:

```text
AI Concierge Amenity
Questions answered faster, without replacing hospitality.
AI concierge support is presented as a guest amenity: faster answers for room details, arrival help, dining questions, and common stay requests before reception takes over where human care is needed.
```

List:

- Ask about room types, rates, check-in, or dining before you arrive.
- Get the map link and arrival guidance without searching through messages.
- Send simple requests faster: extra bedding, dining questions, or late arrival notes.
- Reception stays in control whenever a guest needs a real person.

Visual rules:

- CSS-only AI mesh/core/rings
- Floating cards: `Ask before you arrive`, `Reception follows through`
- Do not use generic robot/stock AI images

### 9. Direct Booking Offer

Purpose: repeat the offer without adding visual clutter.

Copy:

```text
Direct booking benefit
Use RETURN15 when booking direct.
Keep the offer close to the reservation flow. Guests can choose a room above, send the booking request, and mention RETURN15 in the same message.
Book with RETURN15
```

Rules:

- Keep the offer card refined
- No loud coupon badge
- Link returns to `#reserve`

### 10. Location Section With Scroll-Scrub Map

Purpose: make the location memorable and useful.

Implementation:

- `ScrollFrameMap` stores a target ref
- On scroll, it calculates section progress
- It maps progress to frame 1-61
- It renders:

```text
/jresidency/map-frames/frame-001.jpg ... frame-061.jpg
```

Copy:

```text
Location
51, Block B, Jangpura B, New Delhi, Delhi 110014
Scroll through the map preview, then open the live route in Google Maps when you are ready to navigate.
Open Google Maps
```

### 11. Final Booking CTA

Copy:

```text
Ready to stay?
Choose dates, compare rooms, and send your booking request.
Book Now
```

Rules:

- Large centered serif headline
- Dark espresso background
- Champagne CTA

### 12. Footer

Footer includes:

- J Residency logo: `/jresidency/j-logo.jpeg`
- Brand line: `J Residency by TriIndia Hospitality`
- Signup copy: `Direct booking updates, room offers, and J Residency news.`
- Meta: `triindia.in/jresidency`, `Google Maps route ready`

---

## Booking Request Flow

### Frontend

The booking page is:

```text
app/book/j-residency/page.tsx
```

It receives query params from the landing page:

- `arrival`
- `departure`
- `guests`
- `room`

It normalizes dates and maps room names to slugs:

```text
Deluxe Room -> deluxe
Studio Room -> studio
Executive Attached Suite Room -> executive-suite
Family Suite Premium Room -> family-suite
```

### Booking Form

Implemented in:

```text
app/book/j-residency/BookingRequestForm.tsx
```

Fields:

- Guest Name
- Phone
- Email Optional
- Guests
- Check-In
- Check-Out
- Room Preference
- Special Requests

Submit button:

```text
Send Booking Request
```

### API Route

Implemented in:

```text
app/api/booking-requests/route.ts
```

Flow:

1. Parse JSON request
2. Validate with Zod schema from `lib/booking-validation.ts`
3. Find property by slug
4. Find room by property and room slug if provided
5. Upsert guest by phone
6. Create booking with generated reference like `TRI-YYYYMMDD-XXXXX`
7. Return booking JSON

### Database Models

Prisma schema includes:

- Property
- Room
- Guest
- Booking
- Payment
- Message
- Kalakar

Booking status enum:

- NEW
- CONTACTED
- CONFIRMED
- CHECKED_IN
- CHECKED_OUT
- CANCELLED

Payment status enum:

- PENDING
- PAID
- FAILED
- REFUNDED

---

## Design System Rules

### Colors

CSS variables in `app/globals.css`:

```css
--ink: #15100b;
--coffee: #2a1b12;
--espresso: #0f0b08;
--ivory: #f6efe3;
--paper: #fff9ee;
--champagne: #c39a57;
--gold: #ad7b33;
--teal: #0d6f75;
--terracotta: #9c4a31;
--stone: #d9cab7;
--muted: #75685d;
```

### Typography

- Large emotional headings use Fraunces
- UI labels and nav use Geist
- Uppercase microcopy with wide tracking for section kickers
- Headlines should be specific, not generic luxury filler

### Motion

- Use `Reveal` wrapper with Framer Motion
- Initial: opacity 0, y 34
- Animate: opacity 1, y 0
- Duration: 0.9
- Ease: `[0.22, 1, 0.36, 1]`
- Respect `prefers-reduced-motion`

### Responsive Rules

- Hero min height: 620px desktop, 540px mobile
- Navigation hides center links on mobile
- Booking grid collapses from 5 columns to 2 columns, then 1 column
- Room grid, intro layout, gallery story, concierge, location, and footer collapse to single column
- Room modal changes from two columns to one column under 1040px

---

## Strict Build Workflow For Future Hotel Pages

1. Confirm hotel facts: name, address, phone, Google Maps link, room types, rates, amenities, offer code.
2. Gather assets: logo, 4 property photos, room photos per room type, map/location media, hero video or Seedance reference image.
3. If no hero video exists, generate a reference image prompt first.
4. Generate Seedance prompt with all 7 required sections.
5. Produce 10-second loop using same first and last reference image.
6. Export MP4 and place it at `public/<hotel-slug>/hero-video.mp4`.
7. Copy room images into `public/<hotel-slug>/rooms/<room-slug>/` using numeric filenames.
8. Copy property gallery images into `public/<hotel-slug>/` using semantic filenames.
9. Create or update hotel data in `lib/hotels.ts`.
10. Create a custom landing component if the hotel needs the J Residency premium treatment.
11. Route the hotel slug through `app/hotels/[slug]/page.tsx` or add a dedicated route.
12. Add booking page and form if direct-booking capture is required.
13. Add or reuse API route for booking requests.
14. Add scroll-scrub map frames if a map animation is available.
15. Verify desktop and mobile layouts.
16. Run lint, typecheck, and build.

---

## Common Mistakes To Prevent

- Do not create a random hero video unrelated to the hotel photos.
- Do not overlay large text on the video if the video itself is meant to be a clean cinematic plate.
- Do not use different first and last Seedance reference images for a loop.
- Do not skip static lighting in the Seedance prompt.
- Do not bury the booking CTA below too much storytelling.
- Do not use `Learn More` as the primary CTA.
- Do not crop room modal images so aggressively that guests cannot inspect the room.
- Do not make AI concierge sound like it replaces reception.
- Do not create a page that only looks good on desktop.
- Do not hardcode J Residency details into reusable components for other hotels.

---

## Verification Checklist

Before calling the page complete:

- [ ] Hero video autoplays muted, loops, and does not block mobile rendering.
- [ ] `/hotels/<slug>` loads correctly.
- [ ] Legacy aliases redirect if required.
- [ ] Booking panel updates arrival/departure/guests/room.
- [ ] Booking CTA passes query params into booking page.
- [ ] Booking form validates name, phone, dates, guests, and checkout after checkin.
- [ ] Room modal opens, closes, moves next/prev, and thumbnails work.
- [ ] All images load from `public/<hotel-slug>/`.
- [ ] Map frame scroll section does not crash if frames are missing.
- [ ] Mobile nav is usable.
- [ ] Desktop layout preserves premium spacing.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes if configured.
- [ ] `npm run build` passes.

---

## Reference Files

- `components/LandingPage.tsx` - canonical J Residency landing page
- `app/globals.css` - all J Residency section styles and responsive rules
- `lib/hotels.ts` - hotel data source
- `app/hotels/[slug]/page.tsx` - dynamic hotel route and J Residency special case
- `app/jresidency/page.tsx` - legacy redirect
- `app/j-residency/page.tsx` - legacy redirect
- `app/book/j-residency/page.tsx` - booking page
- `app/book/j-residency/BookingRequestForm.tsx` - booking form
- `app/api/booking-requests/route.ts` - booking request API
- `lib/booking-validation.ts` - Zod validation
- `prisma/schema.prisma` - booking database models
- `public/jresidency/hero-video.mp4` - final hero video
- `.opencode/skills/seedance-loop-prompt/SKILL.md` - local Seedance prompt rules

---

## Notes For Converting This Into A Real Skill

When converting this source into a real skill, keep the installed skill concise. Put heavy references like the reconstructed Seedance prompt and full J Residency context into supporting reference files if needed.

Recommended skill directory:

```text
.opencode/skills/premium-hotel-landing-page/
  SKILL.md
  references/
    j-residency-reference.md
    seedance-hotel-hero-prompt.md
```

Recommended trigger description:

```yaml
description: Use when creating a premium hotel landing page with a cinematic AI-generated hero video, room galleries, direct booking, property storytelling, and location guidance.
```

Do not install the skill until it has been tested with at least one scenario where an agent tries to create a generic hotel page and the skill forces the J Residency-grade workflow.
