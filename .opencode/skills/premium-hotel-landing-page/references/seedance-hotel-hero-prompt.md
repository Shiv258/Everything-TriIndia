# Seedance Hotel Hero Prompt — Reference

Reference image prompts and the reconstructed J Residency Seedance prompt. Use these as calibration when generating a hero video for a new hotel.

## Accuracy boundary

The Seedance prompt below is a strict **reconstruction** based on:

- The final `public/jresidency/hero-video.mp4`
- The generic Seedance rules in `.opencode/skills/seedance-loop-prompt/SKILL.md`
- The current J Residency implementation in `components/LandingPage.tsx`
- The actual public assets under `public/jresidency/`

Do not claim it is the verbatim original Seedance prompt unless the original is later recovered from chat history.

## Strict workflow

1. Gather hotel subject and core positioning.
2. Gather or create a premium reference image first (see prompts below).
3. Generate the Seedance prompt for a 10-second seamless looping website hero video. Every prompt must include all 7 mandatory sections.
4. In Seedance **image-to-video mode**, use the same reference image as both first frame and last frame. This forces the loop seal.
5. Export final video as MP4.
6. Place final video at `public/<hotel-slug>/hero-video.mp4`.
7. Build the landing page around the video.

## How many images to give Seedance

For the loop workflow, give Seedance **one** primary reference image and use it **twice**:

- First-frame reference: the image
- Last-frame reference: the exact same image

Optionally provide property images as visual guidance if the tool supports multiple references, but the strict loop method still needs the same first and last frame. For J Residency style, the best reference is one of:

- A polished **reception/lounge** interior frame — if the video should start with the property arrival feeling
- A **bedroom hero** frame — if the video should focus on room comfort

Do not use separate start and end reference images for a seamless loop unless the user explicitly accepts a non-looping cinematic video.

## Mandatory hard rules

- 10 seconds unless the user specifies otherwise
- Seamless loop
- Same image for first and last frame
- Static lighting throughout — no flicker, no day-night shift, no color-temperature changes
- No text baked into the video — the website handles text overlays separately
- No watermarks
- Hero-safe composition with clean negative space if text will be overlaid by the website

---

## Premium Reference Image Prompt — Reception/Arrival variant

Use when the video should start with the property arrival feeling.

```text
Create a premium cinematic reference image for a boutique Delhi hotel hero video. The scene shows the interior arrival moment of J Residency in Jangpura B: a clean modern reception desk, teal lounge seating in the foreground, polished marble flooring, warm cream wall panels, subtle gold accents, a chandelier glow, and a calm owner-run hospitality feeling. The camera is positioned as if peeking through a doorway into the lobby, with soft dark vertical door-frame edges on the left and right creating depth and a natural reveal. Lighting is warm, realistic, static, and elegant, with no harsh color shifts. The mood is Apple product-film restraint meets boutique hotel editorial photography. No people dominating the frame, no readable text, no UI, no watermark. 16:9 composition, website hero safe, high detail, realistic interior photography, premium but not overdesigned.
```

## Premium Reference Image Prompt — Bedroom-first variant

Use when the property has stronger room photography than lobby photography.

```text
Create a premium cinematic reference image for a boutique Delhi hotel hero video. The scene shows a clean J Residency guest room with a neatly made white bed, warm wood-textured wall panels, soft bedside sconces, cream flooring, subtle red and teal textile accents, a compact writing table, and a quiet residential South Delhi hotel mood. The camera looks into the room from the doorway, using the door frame as a foreground mask to create a natural cinematic reveal. Lighting is warm, realistic, static, and elegant. The composition is 16:9, website hero safe, with enough calm space for a page transition but no text baked into the image. Realistic hotel interior photography, premium but grounded, no watermark, no UI.
```

For other hotels, adapt the property name, neighbourhood, and the specific textiles/colour accents while keeping the door-framed cinematic reveal device, the warm static lighting, and the 16:9 hero-safe composition.

---

## Reconstructed J Residency Seedance Prompt

The structured 7-section prompt that approximates the J Residency hero video. Use this as a calibration template for any new hotel — keep the structure, swap the property-specific details.

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

After delivering the prompt, always include this reminder:

> **Seedance setup:** Use image-to-video mode. Set the same image as both the first frame and last frame reference to ensure a seamless loop.

---

## Adapting this template for a new hotel

When using this as a calibration template for a different property, swap these elements while keeping the structure intact:

| Element | What to change |
|---|---|
| Property name + brand | Replace `J Residency` and `TriIndia Hospitality` |
| Neighbourhood and city | Replace `Jangpura B, New Delhi` |
| Interior palette | Replace teal cushions / red runner / cream walls / wood textures with the property's actual palette — match the reference image |
| Action arc beats | Re-time the room reveals to match the property's actual photographable spaces |
| Peak moment | Pick the property's strongest single shot for the 5–6s peak |
| Loop composition | Keep door-framed start/end if you want the cinematic reveal device — or replace with a different signature framing (e.g. a windowed light source for a beachfront property) |

Hard rules — **never change**: 10s duration, static lighting, same first/last frame, no text baked in, no watermark, hero-safe composition.

## Related local skills

- `.opencode/skills/seedance-loop-prompt/SKILL.md` — the generic Seedance prompt builder, applies to any subject (not just hotels). Use it when generating loops for non-hospitality projects.
