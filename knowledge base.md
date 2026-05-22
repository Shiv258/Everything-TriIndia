

**TRIINDIA HOSPITALITY**

**Project Knowledge Base**

*Complete reference document for the build team*

Hospitality Tech Transformation — Phase 1 Pilot

J Residency — Jangpura B, New Delhi

Project Start: 10 May 2026  |  Target Delivery: 50 days

*Internal — Shiv Automates Team Use Only*

# **0\. How To Use This Document**

This knowledge base is the single source of truth for the TRIINDIA Hospitality project. It contains every detail discussed during client discovery, every architectural decision made, every workflow planned, every technical specification, every client context, and every operational requirement.

Read it cover to cover before starting any work. Every component you build depends on context that lives in another section. Skipping ahead causes mistakes.

## **Document Structure**

* Sections 1–3: Client context, stakeholders, business understanding

* Sections 4–6: The problems we're solving and why they matter

* Sections 7–9: System architecture and tech stack decisions

* Sections 10–22: Every individual component, in build order

* Section 23: The complete guest journey walkthrough

* Section 24: Timeline, milestones, and delivery checkpoints

* Section 25: Client obligations and what we need from them

* Section 26: Phase 2 roadmap (post-pilot expansion)

* Section 27: Strategic context (long-game thinking)

* Section 28: Operational protocols and team rules

## **Critical Rules For The Team**

* Anything outside this document needs explicit approval before building

* Client communication goes through Shiv only — do not message partners directly

* All data captured during the project belongs to the client — handle with care

* If you find a discrepancy between this document and reality, raise it immediately

# **1\. Client Identity & Stakeholders**

## **Legal & Business Entity**

* Business name: TRIINDIA HOSPITALITY

* Entity type: Partnership firm (not a Pvt Ltd company)

* Registered business address: 2719, 2nd Floor, Gali No. 7, China Mandi, Paharganj, New Delhi 110055

* Industry: Hospitality — operates multiple hotel properties in Delhi

## **The Three Partners (Decision-Makers)**

All three partners take unanimous decisions. There is no single CEO or final authority — every major decision needs all three to align. Communication happens via a shared WhatsApp group containing all three plus Shiv.

| Partner | Notes |
| ----- | ----- |
| **Mr. Hansraj Lakhmani** | Partner — primary co-founder. Originally the one who introduced Shiv to TRIINDIA. |
| **Mr. Habib Mohammad** | Partner — co-founder. Part of the trio that takes unanimous decisions. |
| **Mr. Mohd Aftab** | Partner — co-founder. Part of the trio that takes unanimous decisions. |

## **Communication Protocol**

* Single point of contact: WhatsApp group with all three partners plus Shiv

* All three partners are also Shiv's personal friends — relationship is warm but contract is formal

* Major decisions require all three on the call/message

* Day-to-day operational coordination happens with hotel managers (whose contacts will be shared at kickoff)

## **Tech Comfort Level**

***CRITICAL: The partners are not tech-savvy. Explain everything in plain language. Use analogies. Avoid jargon (no 'API', 'webhook', 'OAuth', 'cron' in front of them — use 'connection', 'auto-trigger', 'permission', 'scheduled task').***

* They've never used a CRM before

* They run their hotels with physical paper registers

* They do not have a website

* They are heavy WhatsApp users personally

* They understand business intuitively but not technology

# **2\. The Properties Under Scope**

TRIINDIA Hospitality operates a network of hotels in Delhi. Five (5) properties are active and included in this engagement. The pilot deployment happens at J Residency first; the others are rolled out in Phase 1.5 after pilot success.

## **The 5 Hotels (Phase 1 Scope)**

| Hotel Name | Phase Position | Status |
| ----- | :---: | ----- |
| **J Residency** | PILOT — Phase 1 | Build full system here first |
| **Hotel Satwah 29** | Phase 1.5 — rollout | Onboard after pilot success |
| **Hotel Ashram View** | Phase 1.5 — rollout | Onboard after pilot success |
| **Hotel Preet Place** | Phase 1.5 — rollout | Onboard after pilot success |
| **Hotel Samrat Residency** | Phase 1.5 — rollout | Onboard after pilot success |

## **Pilot Property Details (J Residency)**

* Location: Jangpura B, New Delhi

* Existing Instagram handle: @jresidency\_

* Existing website: jresidency.in (basic — must be replaced or absorbed)

* Existing room rates publicly listed: Deluxe / Executive / Family categories (+5% GST), Extra bed available

* Booking channel currently: Almost entirely WhatsApp — every 'Book Now' button on their site links to wa.me/919899402024

* No online booking engine exists

* No Property Management System (PMS) visible

* No OTA strategy on their site (though they list on Booking.com, MakeMyTrip)

## **Existing Marketing Setup**

* Instagram account has \~10,000 followers (built up by previous agency)

* Previous agency charged approximately ₹25,000/month for Instagram only

* Agency produced content that was visually decent but had no CTAs, no conversion focus, no measurable bookings driven

* Partners felt the agency 'did nothing' beyond gaining followers

* No Google Business Profile optimization done

* No paid ads running

* No email marketing

* No CRM, no customer database

## **Future Hotel Additions**

If the client wants to onboard any additional hotel properties (beyond the 5 active at signing), each new hotel is treated as an extension. The build process for additional hotels is faster because the platform is already deployed — mostly configuration and account setup work.

# **3\. Business Context You Must Understand**

## **Seasonal Revenue Pattern**

* Peak season: August through February (high demand, high revenue, hotels full)

* Lean season: March through July (significant revenue dip)

* Summer-specific pain: Delhi summer means electricity bills spike dramatically

* This seasonal dip is a major business worry for the partners — they want a marketing engine to fight it

## **Booking Source Mix (Approximate)**

* 55-60% via OTAs (Booking.com, MakeMyTrip, Goibibo, Agoda)

* 30% via Kalakar walk-ins (see Kalakar section below)

* 10-15% direct via phone or WhatsApp

* 0% via own website (no booking engine exists)

## **OTA Commission Reality**

* Currently paying 20-30% commission per booking to Booking.com, MMT, etc.

* Partners are frustrated and want to reduce OTA dependence

* They cannot simply leave OTAs — those drive discovery. The strategy is to build a parallel direct channel and gradually shift repeat customers.

## **The Kalakar System (CRITICAL — read this carefully)**

*This is unique to TRIINDIA's business and a major data point the team must understand fully.*

**What is a Kalakar?**

* 'Kalakar' \= local Delhi term for auto/cab/taxi drivers who pick up travelers at airports and railway stations and drive them to hotels

* They earn a commission per guest delivered (roughly ₹400-500 per check-in, paid in cash)

* They are not employees of the hotel — independent operators with informal relationships

* Many drivers have long-standing relationships with TRIINDIA hotels

**How TRIINDIA currently tracks Kalakars**

* Hotel manager keeps a physical card / register for each Kalakar

* Manager hand-records which Kalakar brought which guest

* Payments are made in cash at the time of check-in

* At Diwali every year, the partners reward top-performing Kalakars with gifts

* Top Kalakar (\#1 performer) gets the best gift; \#2-\#5 get secondary; lower tiers get smaller gifts

* Current selection of 'top Kalakars' is based on manager's memory and rough recall — not data

**What this means for the system we're building**

***The Kalakar reward tradition must be PRESERVED. We are not replacing it. We are digitizing the tracking layer so the partners can pick winners based on actual data instead of memory. The ritual stays.***

## **Foreign / Out-of-Station Guest Pain**

* Many guests are foreigners or first-time visitors to Delhi

* They are nervous about airport touts and unfamiliar drivers

* Once booked, they typically call the hotel 3-5 times asking: where exactly is the hotel, how do I get there from IGI Airport, should I take Uber/Ola or your partner cab, what's the estimated fare, when should I leave, etc.

* Receptionists are overwhelmed handling these repetitive calls

* At night, no one answers — first impressions die before guests arrive

## **Operational Pain Points**

* All customer data lives in physical paper registers

* Cannot identify a returning guest

* Cannot run any marketing campaigns (no list)

* Cannot do WhatsApp broadcasts

* Receptionist handles every inquiry call (location, rates, availability, room types)

* Manager personally takes ID documentation at every check-in

* Years of historical register data exists but is locked in handwriting

* Some properties have decent internet, some have patchy internet — this affects deployment planning

## **Existing Tools The Partners Have**

* They mentioned having some form of dynamic pricing tool already (one partner pushed back on us doing dynamic pricing because of this)

* Reality of that tool unknown — we don't replace it. Phase 2 strategy is to INTEGRATE with it, feeding it real-time signals

* Otherwise, no tech infrastructure: no PMS, no CRM, no booking engine, no email system, no analytics

# **4\. The Problems We're Solving (In Priority Order)**

Internalize these. Every component we build solves one or more of these problems. If you ever question 'why are we building this?', the answer is here.

**Problem 1 — OTA dependence is bleeding margin**

Every booking through Booking.com or MMT loses 20-30% to commission. Partners want to reduce OTA dependence without leaving the platforms entirely (since OTAs still drive discovery).

**Problem 2 — Foreign / first-time guests get spooked**

Repeated calls about location and cab options reflect a real fear. A pre-arrival concierge experience fixes this and dramatically improves first impressions.

**Problem 3 — All data is on paper**

Years of guest information sit in physical registers. No marketing is possible without a digital customer database. No repeat customer identification is possible.

**Problem 4 — Instagram is a vanity exercise, not a revenue engine**

10k followers, zero attributable bookings. Content is decent but lacks CTAs and a funnel. The agency 'didn't do anything' beyond gaining followers.

**Problem 5 — Kalakar attribution is on memory, not data**

Cash payouts, hand-written cards, Diwali rewards picked by manager recall. Some Kalakars are loud and visible; some are quiet but bring 3x the bookings. The data should pick the winners.

**Problem 6 — Repeat guests forget TRIINDIA exists**

No post-stay follow-up. No return offer. No reason for a guest to come back. Lifetime customer value is essentially zero today.

**Problem 7 — Summer revenue dip has no campaign engine**

March-July is a slow period. Without a CRM and outreach capability, the partners can't run targeted campaigns (wedding-guest packages, corporate offsites, staycations, pilgrimage tourism).

**Problem 8 — Night-time inquiries die in the inbox**

Guests message at 11pm, 2am, 6am. Receptionist is asleep. Booking goes to whoever responds first — and that's usually a competitor.

**Problem 9 — No owner visibility into operations**

Partners have to call managers to know what's happening. No live dashboard. No real-time revenue, occupancy, or source data.

# **5\. Explicitly OUT OF SCOPE for Phase 1**

*These items came up in conversations but are NOT part of Phase 1 delivery. Do not build them. If client requests during the build, escalate to Shiv for a separate scoping conversation.*

**Marketing and advertising**

* Instagram strategy reset and content production

* Performance ad campaigns (Meta Ads, Google Ads, Hotel Ads)

* Local SEO and Google Business Profile management beyond basic setup

* Summer revenue rescue campaigns

* Corporate B2B lead-generation outreach

* These are all Phase 2 territory

**Multilingual support**

* Hindi and English only in Phase 1

* Spanish, French, Arabic, Mandarin are Phase 3 add-ons

**Hotel Property Management System integration**

* No integration with Hotelogix, eZee, Djubo, Cloudbeds, or any other PMS

* The Odoo CRM serves as our data backbone — no third-party PMS needed for pilot

**Dynamic pricing**

* The client already has a dynamic pricing tool — we DO NOT replace it

* Future integration with their existing tool is Phase 2 work (we feed it signals, we don't replace it)

**Google Reviews automation**

* Explicitly declined by client at contract signing

* Available as a future add-on if they change their mind

**Onboarding hotels 2-5 in Phase 1**

* Only J Residency (pilot) gets built in Phase 1

* The remaining 4 hotels are Phase 1.5 — handled after pilot proves results

# **6\. What We're Building (Master Scope List)**

**Every item below is committed deliverable. Every item below must be built, tested, and delivered. Nothing in this list is optional.**

## **Phase 1 Core Deliverables**

1. Multi-tenant website at triindia.in, with a dedicated J Residency sub-page

2. Direct booking engine integrated with Razorpay (UPI, cards, net-banking)

3. Odoo Community CRM, self-hosted, configured with hotel module

4. WhatsApp Business API setup for J Residency (1 verified number, green-tick application)

5. AI WhatsApp agent (Full version) — FAQ, location, cab help, availability, rates, booking, escalation

6. Manager mobile walk-in form — captures name, phone, ID type, ID photo, room, rate, source dropdown

7. Owner Dashboard — live revenue, occupancy, source breakdown, top Kalakars, recent bookings

8. Pre-arrival WhatsApp flow (48hr \+ 24hr before check-in)

9. In-stay WhatsApp flow (check-in welcome, mid-stay touchpoint, on-demand support)

10. Post-stay WhatsApp flow (thank-you, review request, return-booking offer)

11. Referral source tracking \+ Kalakar reward dashboard

12. OTA-to-direct recapture flow (Day 0, Day 90, Day 180 sequenced WhatsApp)

13. Onboarding \+ manager training \+ SOPs in Hindi and English (recorded videos)

## **Add-On Deliverables (also committed)**

14. AI Upsell Agent — pre-arrival room upgrade offers

15. Historical Register OCR Migration — one-time bulk import of existing paper register data into the CRM

# **7\. Technology Stack (Locked Decisions)**

These technology choices are final. Do not propose alternatives during the build without explicit approval from Shiv. Every choice below has been made deliberately based on cost, capability, client budget, and long-term maintainability.

## **Frontend / Guest-Facing**

| Layer | Technology | Reasoning |
| ----- | ----- | ----- |
| **Website framework** | Next.js (React-based) | SEO-friendly, fast, mobile-first, multi-tenant architecture supports easy hotel sub-page replication |
| **Hosting** | Vercel | Free tier sufficient for projected traffic, auto-scaling, instant deployments |
| **Domain** | triindia.in (fresh registration) | Client doesn't currently own this; we register fresh during setup |
| **Payments** | Razorpay (fresh merchant account) | UPI \+ cards \+ net-banking. Client will set up new merchant account during onboarding |

## **Backend / Data Layer**

| Layer | Technology | Reasoning |
| ----- | ----- | ----- |
| **CRM** | Odoo Community Edition (self-hosted) | Free license, hotel module pre-built, APIs (XML-RPC, JSON-RPC, REST in v17+) compatible with n8n, full data ownership by client |
| **VPS / Hosting** | Hetzner or DigitalOcean | Single VPS runs both Odoo and n8n. Cheap and reliable. Client's card on file |
| **Automation engine** | n8n (self-hosted on same VPS) | Open-source, low-code workflow engine. Shiv's deep specialty. Connects every component |
| **Database (auxiliary)** | Supabase (where needed) | Free tier for any custom data structures not handled natively by Odoo |

## **Messaging Layer**

| Layer | Technology | Reasoning |
| ----- | ----- | ----- |
| **WhatsApp API** | Meta WhatsApp Business API via AiSensy or Wati (BSP) | Official API, green-tick verification possible, multi-agent inbox, template approval workflow |
| **Verification** | Meta green-tick application | Submitted at WhatsApp API setup; approval takes 1-4 weeks (Meta-controlled timeline) |

## **AI Layer**

| Use case | Model | Why |
| ----- | ----- | ----- |
| **WhatsApp agent conversations** | Claude (Anthropic) or GPT-4o (OpenAI) | Pay-per-use pricing, top-tier reasoning, Hindi+English support |
| **OCR for register data migration** | Claude Vision or GPT-4o Vision | Handles messy real-world Indian documents (Aadhaar, PAN, handwritten registers in Hindi/English) far better than Tesseract |
| **Upsell agent reasoning** | Claude Haiku or similar (cost-optimized) | Simpler logic, cheaper model is fine |

## **Frameworks & Languages**

* Frontend: React (via Next.js), TypeScript preferred

* Styling: Tailwind CSS

* Backend automation: n8n workflows (JSON exports stored in version control)

* Odoo customizations: Python (Odoo's native language) for any custom modules

* Database queries: Odoo ORM, raw SQL only when necessary

# **8\. System Architecture (How Everything Connects)**

The system is built around a single central data store (Odoo CRM) with multiple input and output channels feeding it. Every component talks to the others through the automation layer (n8n).

## **The 5-Layer Model**

**Layer 1 — Guest Discovery**

Where guests find TRIINDIA properties:

* Instagram (organic reach, profile link)

* Google Search (organic, Maps, Business Profile)

* WhatsApp (direct number sharing)

* Kalakar (walk-in physical referral)

* OTA listings (Booking.com, MMT — still active, parallel channel)

* Word-of-mouth, repeat visits, referrals

**Layer 2 — Booking & Inquiry**

How a guest transitions from interested to booked:

* Direct booking via triindia.in/jresidency website (Razorpay checkout)

* AI WhatsApp agent (handles inquiry, quotes rate, sends payment link)

* Manager walk-in form (Kalakar walk-in or direct walk-in)

* All three paths terminate in the CRM with full guest details \+ source attribution

**Layer 3 — Central Brain (Odoo CRM \+ n8n automation)**

Every guest, every booking, every interaction is stored here. Source of truth for everything.

* Odoo holds: guest records, booking records, room inventory, payment status, source attribution, Kalakar attribution, communication logs

* n8n workflows continuously monitor Odoo and trigger actions

* AI layer reads guest context from Odoo before responding

* Owner Dashboard reads aggregate data from Odoo for live display

**Layer 4 — Guest Experience (Automated Touchpoints)**

Driven by n8n workflows triggered by CRM events:

* Booking confirmed → instant confirmation WhatsApp

* 48 hours before check-in → pre-arrival flow

* 24 hours before check-in → final pre-arrival reminder \+ upsell

* Check-in → welcome WhatsApp

* Mid-stay → 'everything okay?' touchpoint

* Check-out → thank-you \+ review request \+ return offer

* Day 90 post-stay → re-engagement message

* Day 180 post-stay → seasonal offer based on original booking pattern

**Layer 5 — Owner Dashboard**

Real-time view into operations, accessible from any device:

* Today's revenue (across all hotels, with comparison to yesterday/last week/same date last year)

* Live occupancy by hotel

* Source mix (direct / OTA / walk-in / WhatsApp / Kalakar)

* AI agent activity (messages handled, escalation rate, response time)

* Top Kalakars this month with reward planning view

* Drill-down: tap any hotel/guest/month for detail

## **Data Flow Examples**

**Example A: Direct Website Booking**

* Guest visits triindia.in/jresidency

* Selects dates and room → clicks Book Now

* Razorpay checkout opens → guest pays

* Webhook from Razorpay hits n8n

* n8n creates booking record in Odoo with source \= 'Direct Website'

* n8n sends WhatsApp confirmation to guest

* n8n schedules pre-arrival flow for 48hr / 24hr before check-in

* Owner Dashboard updates in real-time

**Example B: WhatsApp Inquiry → AI-Handled Booking**

* Guest messages J Residency WhatsApp number

* AiSensy/Wati webhook hits n8n

* n8n routes message to AI agent (Claude/GPT-4o) with conversation context from Odoo

* AI agent responds with rates/availability

* Guest confirms → AI sends Razorpay payment link

* On payment, same flow as Example A continues

* If guest asks something AI can't handle, AI escalates → manager gets notified

**Example C: Kalakar Walk-In**

* Kalakar arrives at hotel with guest

* Manager opens mobile walk-in form

* Manager fills: guest name, phone, ID type, ID photo, room, rate

* Manager selects 'Source \= Kalakar' → second dropdown shows registered Kalakars → picks correct one

* Submit → n8n receives form data → creates Odoo records (guest \+ booking \+ Kalakar attribution)

* Kalakar reward dashboard updates

* Welcome WhatsApp triggers automatically

**Example D: OTA-Sourced Guest (Booking.com)**

* Guest books via Booking.com (commission already deducted)

* Manager manually enters this guest into CRM via walk-in form with Source \= 'Booking.com'

* All subsequent flows (welcome, mid-stay, post-stay) trigger normally

* Post-stay flow includes the RETURN15 direct-booking offer — the 'OTA-to-direct recapture' strategy starts here

* Day 90 \+ Day 180 re-engagement automatically goes out

# **9\. Naming Conventions & Project Standards**

## **URL Structure**

* Master domain: triindia.in

* Pilot hotel page: triindia.in/jresidency

* Future hotel pages follow same pattern: triindia.in/\[hotel-slug\]

* Booking pages: triindia.in/jresidency/book

* Hotel slugs (decide at build time):

  *     j-residency or jresidency

  *     hotel-satwah-29 or satwah29

  *     hotel-ashram-view or ashram-view

  *     hotel-preet-place or preet-place

  *     hotel-samrat-residency or samrat-residency

## **Source Attribution Values (Locked)**

The 'Source' field in the manager walk-in form and CRM has a fixed dropdown. Use these exact values:

* Walk-in (organic walk-in, no Kalakar)

* Booking.com

* MakeMyTrip (display as 'MMT')

* Website (direct booking via triindia.in)

* Kalakar (triggers second dropdown of registered Kalakar names)

* Other (free text — used sparingly)

## **Discount / Offer Codes**

* RETURN15 — 15% off for OTA-acquired guests booking direct next time

* Future codes use the same pattern: \[WORD\]\[PERCENTAGE\], e.g. SUMMER20, WEDDING10

## **WhatsApp Message Template Naming**

* All Meta-approved templates follow: \[hotel\_slug\]\_\[flow\]\_\[stage\]

* Examples:

  *     jresidency\_pre\_arrival\_48hr

  *     jresidency\_pre\_arrival\_24hr

  *     jresidency\_checkin\_welcome

  *     jresidency\_midstay\_pulse

  *     jresidency\_checkout\_thankyou

  *     jresidency\_day90\_reengagement

  *     jresidency\_day180\_seasonal

  *     jresidency\_ota\_recapture

  *     jresidency\_upsell\_offer

## **Code Repository Standards**

* All code in Git (private repo on GitHub under Shiv Automates account)

* Branches: main (production), develop (integration), feature/\[name\]

* No commits directly to main — always PR through develop

* All n8n workflows exported as JSON and stored in /workflows/ folder

* Environment variables in .env (never committed) and .env.example (committed as template)

## **Documentation Standards**

* Every workflow has a README explaining trigger, steps, error handling

* Every API integration has a setup doc explaining account creation and credentials

* Manager SOPs delivered as PDF \+ recorded videos (Hindi \+ English)

* Owner training materials separate from manager SOPs

# **10\. Component: Website & Booking Engine**

## **What gets built**

* Multi-tenant website at triindia.in with master brand identity

* J Residency sub-page with dedicated content (photos, rooms, amenities, reviews)

* Booking engine on each hotel page

* Razorpay integration for payments

## **Pages required (J Residency in Phase 1\)**

* Home page (triindia.in) — brand introduction, hotel grid, contact

* Hotel page (triindia.in/jresidency) — hero section, about, rooms, amenities, gallery, location, reviews, booking widget

* Booking flow page — date picker, room selection, guest details, payment

* Booking confirmation page — thank-you, booking reference, next steps

* Contact page (or embedded in hotel page)

## **Booking Engine Specifications**

* Date picker (check-in, check-out) with min stay validation

* Room type selection (Deluxe / Executive / Family — match J Residency's existing categories)

* Number of guests selector

* Extra bed option

* Live rate display (pulled from CRM or hard-coded for Phase 1\)

* Guest details form: name, phone, email, identification (optional at this stage)

* Special requests text field

* Payment via Razorpay (UPI / cards / net-banking)

* Confirmation via WhatsApp \+ email (if provided)

* Booking record auto-created in Odoo CRM with source \= 'Website'

## **Design Requirements**

* Mobile-first — 80%+ of guests will browse on mobile

* Loads in under 2 seconds on 4G

* Clean, modern aesthetic — Indian hospitality brand feel

* Color palette and brand identity to be discussed at kickoff

* Hindi \+ English language toggle

* High-quality hotel photography (client to provide; we curate)

## **SEO Foundations (basic only — full SEO is Phase 2\)**

* Proper meta tags on each page

* Schema markup for Hotel \+ LocalBusiness

* Sitemap.xml \+ robots.txt

* Google Search Console verification

* Mobile-friendly compliance

* Fast page speed (Core Web Vitals)

## **Integrations**

* Razorpay — payment processing, webhooks to n8n on successful payment

* Odoo CRM — booking records, guest records

* WhatsApp — confirmation messages on booking

* Google Analytics — traffic and conversion tracking (basic setup only)

## **Critical Notes**

***The website is the primary direct-booking channel. Every element on it should be designed to convert. Hero CTA must be 'Book Now', not 'Learn More'. Pricing must be visible. Booking must take less than 60 seconds from landing to payment.***

# **11\. Component: Odoo Community CRM**

## **Why Odoo Community (and not GoHighLevel)**

* GHL SaaS Mode costs around $497/mo — too expensive for client at scale

* Odoo Community Edition is open-source (LGPL-3.0) — completely free

* Has a hotel management module available on Odoo App Store (Cybrosys, Ksolves)

* Has APIs (XML-RPC, JSON-RPC, native REST in v17+, webhooks) compatible with n8n

* Self-hosted on a cheap VPS (\~₹1,500/month, paid by client direct)

* Full data ownership by the client — they can take it anywhere

## **Self-Hosting Decision**

* Confirmed by Shiv: we go with self-hosted Odoo Community

* VPS provider: Hetzner or DigitalOcean

* Single VPS runs Odoo \+ n8n \+ any auxiliary services

* VPS is on the client's billing account, set up during onboarding

## **Multi-Company / Multi-Hotel Handling**

* Odoo Community does NOT have native multi-company support (that's Enterprise-only)

* Workaround for our use case: use a 'hotel\_id' field on every guest, booking, and room record

* All filters in dashboards and views filter by hotel\_id

* Each manager's account is scoped to see only their hotel's records

* Owner accounts see all hotels

## **Modules To Install**

* CRM (built-in)

* Sales (built-in)

* Hotel Management module (from Odoo App Store — choose Cybrosys or Ksolves based on features)

* Inventory (built-in, for room availability)

* Contacts (built-in)

## **Custom Fields / Data Structures Required**

**Guest record fields**

* Full name (English \+ Hindi if available)

* Phone number (primary contact)

* Email (optional)

* ID type (Aadhaar / PAN / Passport / Driving License / Voter ID / Other)

* ID number

* ID photo (uploaded image)

* Nationality (for foreign guest identification)

* Preferred language (Hindi / English)

* Source of first booking (locked dropdown)

* Kalakar reference (if source \= Kalakar)

* Total stays count (auto-calculated)

* Last stay date (auto-calculated)

* Lifetime value (auto-calculated)

* Notes (free text for manager observations)

**Booking record fields**

* Booking reference number

* Guest (linked to guest record)

* Hotel (linked to hotel record)

* Room number / room type

* Check-in date and time

* Check-out date and time

* Rate per night

* Total amount

* Payment status (Paid / Partial / Unpaid)

* Payment method (UPI / Card / Net-banking / Cash / OTA)

* Source (locked dropdown)

* Kalakar reference (if applicable)

* Special requests

* Status (Confirmed / Checked-in / Checked-out / Cancelled / No-show)

* Communication log (auto-linked WhatsApp conversations)

**Kalakar record fields**

* Name

* Phone number

* ID type and number (optional)

* Photo (optional)

* Hotels they refer to (multi-select)

* Active status (Yes / No)

* Total bookings referred (auto-calculated)

* Total revenue generated (auto-calculated)

* Total commission paid (auto-calculated)

* Last referral date (auto-calculated)

* Diwali reward tier (current year)

* Notes

## **Pipelines To Set Up**

* Inquiry pipeline: New Inquiry → Quoted → Booking Pending → Booked → Cancelled

* Stay pipeline: Booked → Checked-in → Mid-stay → Checked-out → Reviewed

* Recapture pipeline (for OTA guests): Stayed → Day-90 sent → Day-180 sent → Returned (direct)

## **User Roles & Permissions**

* Owner (all 3 partners) — read all data across all hotels

* Hotel Manager — read/write for their own hotel only

* Reception staff — limited write access (walk-in form only)

* System admin (Shiv Automates) — full access

## **Backups**

* Automated daily backups of the Odoo database to a separate backup location

* 30-day retention minimum

* Tested restore process documented in SOPs

# **12\. Component: WhatsApp Business API**

## **Setup Steps**

16. Create Meta Business Manager account for TRIINDIA Hospitality

17. Verify the business with Meta (document upload, business address verification)

18. Choose BSP (Business Solution Provider) — AiSensy or Wati

19. Register the WhatsApp business phone number through the chosen BSP

20. Apply for green-tick (Official Business Account) verification

21. Submit message templates to WhatsApp for approval

22. Wait for template approvals (typically 24-72 hours per template)

23. Connect BSP to n8n via webhooks

## **Phone Number Strategy**

* J Residency gets one (1) verified WhatsApp Business number in Phase 1

* This number is the public-facing contact number — displayed on website, Google Business, Instagram

* Each subsequent hotel gets its own number in Phase 1.5

* Numbers are owned by the client (registered in TRIINDIA's name)

## **Green-Tick Application**

* Submitted at WhatsApp API setup time

* Meta-controlled approval process — typically 1-4 weeks

* Requires solid business documentation and brand presence

* Green-tick increases guest trust significantly (verified business indicator)

* Setup proceeds even if green-tick is pending; verification is asynchronous

## **BSP Choice: AiSensy vs Wati**

* Both are official Meta-approved BSPs in India

* Both support multi-agent inbox (multiple staff on same number)

* Both support automation via webhooks (n8n-compatible)

* Final choice made at setup based on current pricing and feature parity

* Default: AiSensy unless specific reason to choose Wati

## **Message Categories (per Meta policy)**

* Utility messages (transactional — booking confirmations, check-in reminders): cheaper, no opt-in required

* Marketing messages (promotional — RETURN15 offers, seasonal campaigns): more expensive, require opt-in

* Service messages (within 24-hour customer window): free, only after customer initiates

* All flows must use the correct category to comply with Meta policy

## **Template Approval Workflow**

* Every automated message requires a pre-approved template

* Templates have variables ({{1}}, {{2}}, etc.) for personalization

* Meta reviews templates for compliance (no spam, no misleading content)

* Plan template submissions early to avoid blocking go-live

## **Inbox & Escalation**

* All incoming messages flow through BSP inbox

* AI agent handles 80%+ automatically via n8n

* Escalations route to manager via BSP inbox (manager sees the conversation, takes over)

* Manager mobile app or web inbox — both work

## **Compliance Notes**

* Never send unsolicited marketing messages — opt-in required

* Guests booking on the website are deemed opted-in for transactional \+ service messages

* Explicit opt-in for marketing campaigns (e.g., RETURN15) captured during booking flow

* Honor unsubscribe requests immediately

# **13\. Component: AI WhatsApp Agent**

## **What it does (Full Version — Tier 2\)**

* Responds to guest inquiries on WhatsApp in 2 seconds, 24/7

* Handles approximately 80% of inquiries without human intervention

* Escalates the remaining 20% to the hotel manager

## **Specific Inquiry Types Handled**

**Availability and rates**

* 'Do you have a room for \[dates\]?'

* 'How much is the Deluxe room?'

* 'What's the price for 2 people for 3 nights?'

**Booking flow**

* Guest expresses booking intent → AI offers room options

* Guest selects room → AI confirms details

* AI sends Razorpay payment link

* On payment, AI sends confirmation

**Location and arrival**

* 'Where exactly are you located?'

* 'How do I get there from IGI Airport?'

* 'Should I take Uber or Ola?'

* 'What's the estimated fare from the airport?'

* 'How long does it take to reach you?'

**Amenities and policies**

* 'Is breakfast included?'

* 'What time is check-in / check-out?'

* 'Do you have AC?'

* 'Is there parking?'

* 'Is WiFi free?'

* 'Are pets allowed?'

**Special requests**

* 'Can I request an early check-in?'

* 'I need a vegetarian breakfast'

* 'Late check-out possible?'

* 'Extra bed available?'

## **When AI Escalates**

* Guest explicitly asks to speak to a human

* Question is outside AI's knowledge scope (e.g., custom event bookings, complex itineraries)

* AI fails to answer satisfactorily after 2 attempts

* Guest seems frustrated (negative sentiment detected)

* Complaint or dispute (auto-escalate immediately)

* Booking modification or cancellation (manager handles)

## **Tone & Voice Guidelines**

* Warm, professional, friendly — NEVER robotic

* Mirror the guest's language (Hindi or English) automatically

* Use 'Sir' / 'Ma'am' / first name (when known) for politeness

* Short messages — WhatsApp users prefer brevity

* Use emojis sparingly (welcome, confirmation, celebration moments)

* Never argue or contradict — escalate if there's conflict

## **Context Awareness**

* AI reads guest's history from CRM before responding (past stays, preferences, booking patterns)

* AI knows current booking status if guest has an active reservation

* AI knows room availability in real-time

* AI knows current rates and seasonal pricing

* AI knows ongoing offers (RETURN15, etc.)

## **Technical Architecture**

* Incoming WhatsApp message → BSP webhook → n8n workflow

* n8n pulls guest context from Odoo (history, current booking, etc.)

* n8n constructs prompt with system context \+ guest context \+ current message

* Sends to AI model (Claude or GPT-4o)

* Receives response, validates it, sends back to guest via BSP

* Logs conversation in Odoo against guest record

## **Knowledge Base For The Agent**

The AI needs structured knowledge about each hotel. Maintained as a JSON/YAML file or in Odoo, fed into every prompt:

* Hotel name, address, exact Google Maps coordinates

* Distance and estimated travel time from major landmarks (IGI Airport, New Delhi Railway Station, ISBT, Connaught Place, Khan Market, Nizamuddin, etc.)

* Room types, descriptions, current rates, amenities

* Check-in/check-out times, breakfast hours, gym/pool hours (if applicable)

* WiFi password (kept private — only shared post-check-in)

* Parking info

* Payment methods accepted

* Cancellation policy

* Pet policy

* Smoking policy

* Children policy

* Extra bed availability and cost

* Local recommendations (restaurants, attractions, shopping)

* Partner cab info if any (rates, contact)

* Emergency contact numbers

## **Critical Build Rule**

***Never let the AI invent information. If it doesn't know something, it must say so and escalate. Hallucinated rates, room availability, or policies will damage trust faster than a slow response would.***

# **14\. Component: Manager Mobile Walk-In Form**

## **Purpose**

* Replace the paper register at the front desk

* Capture every walk-in guest into the CRM in under 30 seconds

* Make Kalakar attribution automatic and tamper-proof

## **Where It Runs**

* Mobile-first web app (responsive design)

* Works on any phone (Android or iOS)

* Works on patchy internet (offline-tolerant if possible)

* Manager logs in once, stays logged in

## **Form Fields (Locked)**

24. Guest full name (required)

25. Guest phone number (required) — with country code

26. Guest email (optional)

27. ID type — dropdown: Aadhaar / PAN / Passport / Driving License / Voter ID / Other

28. ID number (required)

29. ID photograph — one-tap camera upload (required)

30. Room number (required) — dropdown of available rooms

31. Check-in date and time (auto-filled to now, editable)

32. Expected check-out date (required)

33. Rate per night (required) — auto-filled based on room type, editable

34. Number of guests (required)

35. Source — dropdown (LOCKED VALUES):

    * Walk-in

    * Booking.com

    * MMT

    * Website

    * Kalakar (triggers second dropdown)

    * Other

36. If Source \= Kalakar → second dropdown shows registered Kalakar names → manager selects correct one

37. Special requests / notes (optional, free text)

## **Form UX Requirements**

* Big buttons, easy thumb-tap targets

* Form labels in Hindi \+ English (manager picks language preference once)

* Auto-save draft if connection drops

* Visible 'Submitting...' state — never confuse the manager about whether it worked

* Success confirmation: 'Guest checked in successfully' \+ booking reference

* Failure handling: clear error message \+ retry button

* Form takes under 60 seconds for a trained manager

## **On Submit**

* n8n receives form data

* Creates / updates guest record in Odoo (matches by phone number if existing guest)

* Creates booking record linked to the guest

* If Source \= Kalakar, increments that Kalakar's referral count

* Triggers welcome WhatsApp message to guest

* Updates Owner Dashboard live counters

## **Anti-Misuse Rules**

***The Kalakar QR code idea was REJECTED earlier in the project for being susceptible to misuse. Drivers cannot scan codes — only the manager fills the Source field. This is intentional. Do not propose a Kalakar-side QR system.***

# **15\. Component: Owner Dashboard**

## **Purpose**

* Give all three partners live visibility into operations

* Replace the current process of calling managers for daily updates

* Provide drill-down detail for any metric

## **Access**

* Web-based — accessible on any device

* Mobile-responsive — primary use case is phone

* Each partner has their own login

* Read-only by default (they can't accidentally break things)

## **Top-Level Stat Cards (always visible at top)**

* Today's revenue across all hotels — with comparison to yesterday, last week, same date last year

* Live occupancy percentage across all hotels

* Direct bookings count today (vs OTA bookings count) — shows the OTA-to-direct shift over time

* AI messages handled today (with escalation rate)

## **Main Dashboard Sections**

**Section 1 — Bookings By Source (last 30 days)**

* Bar chart

* Categories: Walk-in / Booking.com / MMT / Website / Kalakar / WhatsApp / Other

* Shows trend over time (Direct Website should grow over months)

**Section 2 — Top Kalakars This Month**

* Ranked list with name, bookings count, revenue generated, commission earned

* Top 5 displayed, full list available on drill-down

* Pay button next to each (triggers commission payment workflow)

**Section 3 — Recent Check-Ins**

* Live feed of guests checking in today

* Click on any guest → full profile and stay history

**Section 4 — Upcoming Check-Ins (next 7 days)**

* Pipeline view

* Helps plan staffing and room prep

**Section 5 — Hotel-Level Performance**

* Each hotel as a card showing: occupancy %, today's revenue, top source

* Click into any hotel → hotel-specific dashboard

## **Drill-Down Capabilities**

* Tap any hotel → full booking calendar (room-by-room view for next 30 days)

* Tap any guest → complete history, communications, preferences

* Tap any Kalakar → all bookings referred, total earnings, contact info

* Tap any month → revenue trend, source mix, comparison to previous periods

* Filter by date range, by hotel, by source, by Kalakar

## **Reports (downloadable)**

* Monthly revenue summary (P\&L style)

* Source attribution report

* Kalakar performance leaderboard

* Guest list export (for marketing purposes)

* All exportable to Excel and PDF

## **Diwali Reward Planning View**

* Annual leaderboard view of Kalakar performance (last 12 months)

* Suggested reward tiers based on performance brackets

* Top 1: Premium tier

* Top 2-5: Secondary tier

* Top 6-10: Third tier

* Partners review, customize, and approve the list before Diwali distribution

## **Notifications**

* Daily WhatsApp summary to partners (revenue, occupancy, key events)

* Real-time alerts for: large bookings, complaints, escalations, payment failures

* Notifications can be turned off per partner

# **16\. Component: Pre-Arrival WhatsApp Flow**

## **Trigger**

* Activated 48 hours before guest's check-in date and time

* A second message goes out 24 hours before check-in

## **Message 1 — 48 Hours Before Check-In**

**Purpose**

* Confirm reservation

* Provide location and arrival info

* Capture special requests

* Make foreign guests feel safe

**Template content (Hindi \+ English, language matches guest preference)**

*Sample English version:*

***Hi \[guest name\], we're excited to host you in \[X\] days at \[hotel name\]\! Quick check-in info: our address is \[exact address\], here's the Google Maps pin \[link\]. From IGI Airport, an Uber/Ola takes about \[X\] minutes and costs roughly ₹\[range\]. Need any of these before you arrive? — early check-in / late check-in / vegetarian breakfast / extra bed / airport pickup quote. Just reply\!***

## **Message 2 — 24 Hours Before Check-In**

**Purpose**

* Final reminder

* Last-chance upsell (if AI Upsell Agent is enabled)

* Travel options confirmation

**Template content (sample)**

***\[Guest name\], your room is ready for tomorrow at \[hotel name\]\! Here's a quick recap: check-in from \[time\], breakfast \[times\], WiFi is on the house. Our address: \[address\] \[Google Maps link\]. Coming from IGI Airport? Uber/Ola \~\[fare\] / \~\[time\]. If you'd like us to arrange a partner cab, reply YES and we'll send a fixed quote. See you tomorrow\!***

## **Special Requests Capture**

* Any guest reply with special requests is auto-parsed by AI

* Extracted requests are added to the guest's booking record under 'Special Requests'

* Manager gets a notification with the request summary

## **Foreign Guest Adaptation**

* If guest's nationality is non-Indian (detected from ID, name, or phone country code), the message includes:

  *     More detailed airport instructions

  *     Tips on avoiding airport touts

  *     Reassurance about the area safety

  *     Optional partner cab pre-booking (foreigners value this hugely)

## **AI Upsell Integration**

* If guest booked a lower room category and a higher category is available, the 24hr message includes an upgrade offer

* Format: 'You booked Deluxe (₹X). For just ₹\[delta\] more, we can upgrade you to Executive — bigger room, workspace, minibar. Reply YES to confirm.'

* Guest YES → AI sends Razorpay payment link for upgrade

* Manager notified of upgrade

# **17\. Component: In-Stay WhatsApp Flow**

## **Trigger Points**

* At check-in completion (immediate)

* Mid-stay (depends on stay length: half-way point)

* On guest-initiated message (anytime during stay)

## **Message 1 — Check-In Welcome**

**Purpose**

* Set warm tone for the stay

* Provide essential info

* Open the support channel

**Template content (sample)**

***Welcome to \[hotel name\], \[guest name\]\! 🌟 You're in Room \[X\]. Your WiFi password: \[password\]. Breakfast is served \[times\]. If you need anything during your stay — extra pillow, room service, late check-out, restaurant recommendations — just reply to this message. We're here.***

## **Message 2 — Mid-Stay Pulse Check**

**Purpose**

* Catch problems early (before they become 1-star reviews)

* Show ongoing care

**Trigger logic**

* For 1-night stays: skipped (no time)

* For 2-night stays: sent on day 2 morning

* For 3+ night stays: sent at the half-way point

**Template content (sample)**

***Hi \[guest name\], hope you're having a great stay so far\! Quick check — is everything okay? Anything we can improve for the rest of your time with us? Just reply with anything you need.***

## **On-Demand Support Routing**

* Any guest message during stay → AI agent reads it

* AI handles common requests directly:

  *     Late check-out request → AI checks availability, confirms if possible

  *     Extra towels / pillows → AI confirms, manager gets notification to deliver

  *     WiFi issue → AI walks through reconnection steps

  *     AC / room temperature → AI escalates to manager

  *     Breakfast / food queries → AI shares menu, escalates orders to manager

  *     Local recommendations → AI shares curated suggestions

* Complex or sensitive requests → immediate manager escalation

## **Negative Sentiment Detection**

* AI analyzes guest message sentiment continuously

* If sentiment turns negative (frustration, anger, complaint), AI immediately escalates to manager

* Manager gets WhatsApp alert with conversation context

* Goal: defuse issues in person before they become public negative reviews

# **18\. Component: Post-Stay WhatsApp Flow**

## **Trigger Points**

* Within 2 hours of check-out (immediate thank-you \+ review \+ offer)

* Day 90 after check-out (re-engagement)

* Day 180 after check-out (seasonal offer)

## **Message 1 — Immediate Post-Checkout**

**Purpose**

* Thank the guest

* Capture a Google review while experience is fresh

* Plant the seed for direct booking next time

**Template content (sample)**

***Thanks so much for staying with us, \[guest name\]\! 🙏 We hope you had a wonderful time. If you have 30 seconds, would you mind leaving us a quick Google review? It really helps: \[one-tap Google review link\]. P.S — when you visit Delhi next, save 15% by booking direct on triindia.in/jresidency with code RETURN15. Plus a free upgrade if available. We'd love to host you again.***

## **Message 2 — Day 90 Re-Engagement**

**Purpose**

* Stay top-of-mind

* Convert OTA-acquired guests to direct bookers for future stays

**Template content (sample)**

***Hi \[guest name\], hope you're well\! It's been a few months since your stay with us. Heading back to Delhi anytime soon? Direct booking on triindia.in/jresidency gets you 15% off \+ free upgrade (code RETURN15). Save it for when you need it. 🏨***

## **Message 3 — Day 180 Seasonal**

**Purpose**

* Trigger based on guest's original booking pattern

* Suggest the right type of stay at the right time of year

**Logic**

* If guest originally came in wedding season → wedding-season offer

* If guest originally came for business → corporate-friendly offer

* If guest originally was a tourist → tourist package

* Template content adapts based on segment

## **Google Review Capture**

* One-tap link goes directly to the Google review page for the specific hotel

* Pre-filled with review prompt where possible

* If guest leaves a review, system captures it and notifies manager

* Google Review automation is OUT OF SCOPE for Phase 1 — we only do the request, not the automated reply

## **Offer Tracking**

* RETURN15 code generates a unique trackable instance per guest

* When used, system attributes the new direct booking back to the OTA-recapture flow

* Owner Dashboard shows: 'X direct bookings recaptured from OTA guests this month'

# **19\. Component: Kalakar Referral Tracking & Reward Dashboard**

## **Purpose**

* Digitize the existing Kalakar tradition WITHOUT changing the ritual

* Replace memory-based selection of top Kalakars with data-based selection

* Make Diwali reward planning fairer and more profitable

***CRITICAL: We are not replacing the Diwali tradition. We are only digitizing the tracking. The reward ceremony, the gift selection, the in-person gratitude — all of that stays exactly as it is. Only the underlying data improves.***

## **What gets captured**

* Every walk-in booking with Source \= Kalakar is attributed to a specific registered Kalakar

* System tracks: bookings count, revenue generated, commission paid, last referral date

## **Kalakar Registration Process**

* Each Kalakar must be registered before they can be selected in the walk-in form dropdown

* Manager registers new Kalakars via a simple admin form: name, phone, ID details, photo

* Existing Kalakars from current paper records get bulk-loaded during onboarding

## **Kalakar Cards (Existing Physical Tradition)**

* TRIINDIA currently uses physical cards for each Kalakar — this tradition can continue

* The digital system runs in parallel — the manager fills the walk-in form, the card is filled if useful

* Over time, the cards become optional

## **Commission Payment Workflow**

* Each booking has a commission amount linked to the Kalakar

* Commissions are paid out in cash at the time of check-in (current process — unchanged)

* The system records each payment for audit purposes

## **Diwali Reward Planning View**

* Annual leaderboard auto-generated based on 12 months of Kalakar performance

* Sortable by: bookings count, revenue generated, repeat-customer ratio

* Reward tiers auto-suggested based on performance brackets

* Partners review, edit, and finalize the list 2-3 weeks before Diwali

* System generates a printable summary of who gets what tier of reward

## **Reports for Partners**

* Monthly Kalakar performance report (auto-WhatsApp'd to partners)

* Year-over-year Kalakar comparison

* Trending Kalakars (those with growing referral counts)

* Inactive Kalakars (those who haven't referred in 90+ days — possible re-engagement opportunity)

# **20\. Component: OTA-to-Direct Recapture Flow**

## **Purpose**

* Convert OTA-acquired guests into direct-booking customers for their FUTURE stays

* Reduce long-term OTA commission dependency

***LEGAL/POLICY NOTE: We do NOT ask guests to cancel their current OTA booking and rebook direct. That violates OTA terms of service and risks delisting. We capture them for their NEXT visit — which is industry-standard practice (Hilton, Marriott, Indian chains all do this).***

## **The 3-Touch Sequence**

**Touch 1 — At Checkout (Day 0\)**

* Triggered: immediately after check-out is logged

* Message: thank-you \+ Google review request \+ RETURN15 offer for next visit

* Expected open rate: 60-80% (post-stay engagement is high)

* Expected conversion (use of RETURN15 on next visit): 10-15% within 12 months

**Touch 2 — Day 90 Re-Engagement**

* Triggered: 90 days after check-out

* Message: gentle 'heading back to Delhi?' nudge with RETURN15 reminder

* Expected: catches business travelers and frequent visitors

**Touch 3 — Day 180 Seasonal**

* Triggered: 180 days after check-out

* Message: tailored to the guest's original booking pattern (business / wedding / tourist)

* Often coincides with the same season they originally booked

## **Compound Effect Over Time**

* Year 1: 30-40% of repeat customers shift to direct booking

* Year 2+: compounds — direct bookers refer friends → friends book direct

* OTA dependency reduces gradually, not overnight

* This is exactly how Hilton, Marriott, and Indian chains like Lemon Tree built their direct moats

## **RETURN15 Offer Mechanics**

* 15% discount off direct booking rates

* Free room upgrade if available

* Code is universal but each use is tracked back to the recapture flow

* Tracking shows owners how much direct revenue is being recaptured from past OTA guests

## **Opt-Out**

* Every message includes 'reply STOP to unsubscribe'

* Unsubscribes are honored immediately and stored as guest preference

# **21\. Component: AI Upsell Agent**

## **Purpose**

* Offer pre-arrival room upgrades to confirmed guests

* Typical conversion: 12-18% of guests accept the upgrade

* Generates significant additional revenue per hotel per month

## **Trigger**

* Activated 24 hours before check-in

* Embedded in the 24-hour pre-arrival WhatsApp message

* Only triggers if a higher room category is available for the guest's dates

## **Offer Logic**

* System checks: guest's current booking \+ room availability for their dates

* Identifies the next-higher category available

* Calculates upgrade delta (difference between current rate and upgraded rate)

* Offers the delta with framing: 'For just ₹\[delta\] more, upgrade to \[next category\]'

* Highlights what's better about the upgraded room (size, view, workspace, amenities)

## **Sample Offers**

* Deluxe (₹4,500) → Executive (₹6,500): offer at ₹2,000 delta

* Executive (₹6,500) → Family (₹8,500): offer at ₹2,000 delta

## **Guest Acceptance Flow**

* Guest replies YES → AI confirms upgrade

* AI sends Razorpay payment link for the delta amount

* On payment, AI updates booking record

* Manager gets notification of the upgrade (so they prepare the right room)

## **Rules**

* Only one upsell offer per guest per stay

* Never offer an upgrade that's not actually available

* Never pressure — if guest declines, drop the topic completely

* Never offer upgrade after check-in (different workflow; manager handles in person)

# **22\. Component: Historical Register OCR Migration**

## **Purpose**

***CRITICAL CLARIFICATION: This is NOT an ongoing feature. It's a one-time service to bulk-import years of historical paper register data into the CRM. After this is done once, all NEW guest data is captured digitally via the walk-in form or WhatsApp. The OCR is not used day-to-day.***

## **Why It's Worth Doing**

* TRIINDIA has years of guest data sitting in physical registers

* Without migration, the CRM starts with zero history → can't identify repeat customers from before

* Marketing campaigns and re-engagement can target existing customer base from day one

* Captures: names, phone numbers, room history, check-in/out dates, payment info (to the extent legible)

## **Process**

38. Client provides access to the physical registers (hard copies or photos)

39. Team digitizes the pages (high-resolution photographs or scans)

40. Each page is processed through Claude Vision or GPT-4o Vision API

41. AI extracts structured data: guest name, phone, ID, dates, room, payment, etc.

42. Extracted data is reviewed for obvious errors (illegible handwriting, missing fields)

43. Data is bulk-loaded into the Odoo CRM

44. Quality check: spot-check 5-10% of records against original registers

## **Technical Approach**

* Do NOT use traditional OCR (Tesseract) — it fails on Indian handwriting, mixed Hindi/English, smudged registers

* Use Claude Vision or GPT-4o Vision — they handle messy real-world documents far better

* Process in batches of 50-100 pages at a time to manage cost and review quality

* Each page costs approximately ₹2-5 to process via Vision API

## **Output Quality Expectations**

* 90-95% accuracy on names and phone numbers (most legible fields)

* 80-90% accuracy on dates and room numbers

* Lower accuracy on handwritten notes and special requests

* Missing or illegible fields are flagged for manual review

* Set client expectation: this is a best-effort recovery of historical data — not perfect

## **Data Storage**

* All migrated data goes into the same Odoo CRM as new data

* Migrated records flagged with: 'data\_source \= historical\_migration'

* Migration date stored on each record

* Original page scan stored as attachment on each record for audit

## **Timing**

* Migration starts after Day 50 (post-handover)

* Typically takes 2-4 weeks depending on volume of historical data

* Runs in parallel with system going live for new guests

# **23\. The Complete Guest Journey (End-to-End Walkthrough)**

This walkthrough shows how all components connect across a real guest's lifecycle. Use this to understand integration points and dependencies.

## **Stage 1 — Discovery**

* Priya, a marketing manager from Mumbai, searches Google: 'hotels near Khan Market Delhi'

* TRIINDIA/J Residency listing appears (basic SEO is in place)

* Priya clicks → triindia.in/jresidency loads in under 2 seconds

## **Stage 2 — Inquiry**

* Priya isn't sure if the room has a workspace

* She taps the WhatsApp button on the site

* Her message hits the J Residency WhatsApp Business number

* Webhook fires to n8n → AI agent picks it up

* AI agent responds in 2 seconds: 'Yes, our Executive room has a workspace with high-speed WiFi. ₹6,500/night. Want to book for May 15-17?'

* Priya replies: yes

## **Stage 3 — Booking**

* AI sends a Razorpay payment link

* Priya pays via UPI

* Razorpay webhook → n8n → Odoo creates booking record

* Source attribution: 'Website / WhatsApp' (AI-initiated booking)

* Booking confirmation auto-sent to Priya on WhatsApp

* Pre-arrival flow scheduled for 48hr and 24hr before check-in

* Manager dashboard shows the new booking in real-time

## **Stage 4 — Pre-Arrival**

* 48 hours before her check-in: pre-arrival message sent

* Includes address, Maps pin, cab options, fare estimates, special requests prompt

* Priya replies: 'vegetarian breakfast please, arriving at 6 PM'

* AI parses the request → captures into her booking record

* Manager gets a notification: 'New special request from Priya — vegetarian breakfast'

* 24 hours before check-in: second message with final reminders \+ upsell offer

* Upsell offer: 'Upgrade from Executive to Family for ₹2,000 more?'

* Priya declines (she's solo, doesn't need bigger room)

* System notes the decline, doesn't ask again

## **Stage 5 — Arrival**

* Priya arrives Friday evening

* Manager opens the walk-in form (she's already in CRM via online booking)

* Manager pulls up her booking, confirms ID, marks check-in

* Check-in time \= now, automatic in CRM

* Welcome WhatsApp message auto-sent: WiFi password, breakfast info, support channel

## **Stage 6 — In-Stay**

* Day 1 night: Priya messages 'extra towels please'

* AI handles: 'Of course, sending right up\!'

* Manager gets notification: deliver towels to Room X

* Day 2 morning: mid-stay pulse check sent

* Priya replies: 'all good, thanks'

* AI: 'wonderful, enjoy your stay\!'

## **Stage 7 — Check-Out**

* Sunday morning, Priya checks out

* Manager marks check-out in system

* Within 2 hours: post-stay flow triggers

* Thank-you message \+ Google review request \+ RETURN15 offer for next time

* Priya, in a good mood, taps the Google review link and leaves a 5-star review

* Review automatically syncs into her CRM record

## **Stage 8 — Re-Engagement (Day 90\)**

* 90 days later, automatic message triggers

* 'Heading back to Delhi? Use RETURN15 for 15% off direct.'

* Priya is actually planning a Delhi trip in 2 weeks for a conference

* She clicks the link → books direct on triindia.in

* Uses RETURN15 → gets 15% off

* System attributes this new booking to the OTA-recapture flow (even though Priya was a direct-website guest originally — same mechanism works for both)

## **Stage 9 — Stay \#2 \+ Referral**

* Priya stays again at J Residency

* Now she's a repeat customer (CRM auto-detects)

* Receives slightly different welcome (acknowledging she's been here before)

* After this stay, mentions J Residency to a colleague

* Colleague books direct → new direct booking originating from a 'referral' (loosely tracked)

***This entire journey runs almost autonomously. Manager touches: 2 (check-in, check-out). Everything else is automated. This is the value proposition in one example.***

# **24\. Timeline & Milestones**

The project runs for 50 days from Day 0 (3 May 2026). Day 0 is the day the first payment is received and discovery begins.

## **Phase 0 — Days 1 to 7: Foundation**

**Goals**

* Sign contract

* Receive Day 0 milestone

* Complete discovery audit

* Set up all vendor accounts on the client's billing

**Tasks**

45. Contract signed via Zoho Sign by all 4 parties (Shiv \+ 3 partners)

46. Discovery interviews with all 3 partners

47. Discovery interview with J Residency hotel manager

48. Collect all existing assets: Instagram credentials, Google Business credentials, existing booking data, photos, brand assets

49. Register domain triindia.in

50. Set up Razorpay merchant account

51. Set up Meta Business Manager for TRIINDIA Hospitality

52. Provision VPS (Hetzner or DigitalOcean)

53. Install Odoo Community on VPS

54. Install n8n on same VPS

55. Set up shared project workspace (Notion or ClickUp)

## **Phase 1 — Days 8 to 20: Core Build**

**Goals**

* Website live

* Booking engine working

* CRM configured

* WhatsApp Business API registered

* Manager walk-in form working

* Owner Dashboard live

**Tasks**

56. Build Next.js site structure (master triindia.in \+ J Residency sub-page)

57. Implement booking engine with Razorpay integration

58. Configure Odoo CRM (hotel module, custom fields, pipelines, user roles)

59. Set up J Residency WhatsApp Business number with BSP (AiSensy or Wati)

60. Submit Meta green-tick application

61. Build manager walk-in form (mobile web app)

62. Build Owner Dashboard (read-only views, drill-downs)

63. Integrate Razorpay webhooks to n8n

64. Integrate BSP webhooks to n8n

65. Initial content for J Residency page (photos, copy, rates)

## **Phase 2 — Days 21 to 25: AI Layer \+ Demo**

**Goals**

* AI WhatsApp agent live and tested

* All automation flows triggering correctly

* Live demo to all 3 partners on Day 25

**Tasks**

66. Build AI WhatsApp agent (n8n workflow \+ Claude/GPT-4o integration)

67. Construct knowledge base for the agent (J Residency facts, FAQs, policies)

68. Build pre-arrival flow (48hr \+ 24hr templates, scheduled triggers)

69. Build in-stay flow (welcome, mid-stay pulse)

70. Build post-stay flow (thank-you, review request, RETURN15)

71. Build OTA-to-direct recapture flow (Day 90, Day 180\)

72. Build referral source tracking in walk-in form

73. Build Kalakar reward dashboard

74. Build AI upsell agent (24hr pre-arrival upgrade offer)

75. End-to-end testing with simulated bookings

76. Day 25: Live demo to Mr. Hansraj, Mr. Habib, Mr. Aftab

77. Day 25: Collect milestone payment

## **Phase 3 — Days 26 to 50: Optimization, Training, Handover**

**Goals**

* Real-world tuning based on actual guest conversations

* Manager fully trained

* SOPs documented

* System running independently

**Tasks**

78. Daily monitoring of AI agent conversations (first week post-demo)

79. Weekly tuning of AI responses based on real feedback

80. Day 40: pilot results report to partners

81. Train hotel manager in person (Hindi \+ English) on the walk-in form, the AI inbox, and escalations

82. Record video SOPs (Hindi \+ English)

83. Create written SOPs PDF (Hindi \+ English)

84. Document all workflows and architectures for handover

85. Final handover on Day 50

86. Collect final milestone payment

## **Post-Day 50 — Phase 1.5 Begins**

* Decision point with partners on rolling out to remaining 4 hotels

* Each additional hotel: \~1-2 weeks of work (mostly configuration)

* Historical Register OCR Migration runs in parallel during Phase 1.5

* Monthly maintenance fee active from deployment date onwards

# **25\. What We Need From The Client**

Timely client inputs are critical for hitting the 50-day timeline. Any delays from the client side may extend the timeline proportionally.

## **Inputs Required At Kickoff (Day 0-7)**

* Access to existing booking records from the last 90 days minimum

* All existing photos, videos, and brand assets for J Residency (and other 4 hotels eventually)

* Existing Instagram account admin access (jresidency\_)

* Existing Google Business Profile admin access

* Existing website (jresidency.in) login credentials if any

* Brand identity: logo, colors, fonts (if any exist; otherwise we discuss creation)

* Hotel manager contact details \+ WhatsApp \+ availability schedule

* Property details: exact address, rates, room types, amenities, policies

* Bank account details for Razorpay merchant setup

* Business documents required for Meta Business Manager verification (GST cert if any, business registration, address proof)

## **Ongoing Client Responsibilities**

* Set up vendor accounts on client's payment instruments (VPS, BSP, AI APIs)

* Hotel manager availability for 2 hours per week during weeks 1-4

* Timely review and approval of deliverables at each milestone (within 5 business days)

* Provide feedback on AI agent conversations during tuning phase

* Provide list of existing Kalakars for bulk-loading into the CRM

## **Decision-Making Cadence**

* All major decisions require all 3 partners on the call/group

* Day-to-day operational questions can be handled with any one partner

* Weekly project sync recommended (every Friday, 30 minutes)

## **What We Don't Need (To Be Clear)**

* No need for client to have any technical knowledge

* No need for client to manage any servers or accounts day-to-day (we do that)

* No need for client to write any content (we draft, they approve)

* No need for client to interface with vendors (we do that on their behalf)

# **26\. Phase 2 Roadmap (Post-Pilot Expansion)**

After J Residency pilot proves results in 50 days, expansion to remaining hotels and add-on features begins. These are documented here for context — they are NOT part of Phase 1 work. Each item is separately scoped and quoted at the time of activation.

## **Phase 1.5 — Roll Out To Remaining 4 Hotels**

* Hotel Satwah 29

* Hotel Ashram View

* Hotel Preet Place

* Hotel Samrat Residency

* Same system replicated for each

* Each hotel: dedicated sub-page on triindia.in, own WhatsApp number, own manager account, own dashboard view

* Most work is configuration — the platform is already built

* Estimated 1-2 weeks per hotel

## **Phase 2 — Marketing Engine**

**Instagram Strategy Reset**

* Replace the previous agency's vanity content with conversion-driven posts

* Every post has a clear CTA — book direct, save, share, DM

* Content split: 40% emotional/aspirational, 30% utility/local SEO, 20% social proof, 10% offers

* Posting cadence: 3-4 high-quality posts per week \+ daily stories

* Reels with hooks in first 1.5 seconds

* Bilingual captions (Hindi \+ English)

**Performance Ad Campaigns**

* Meta Ads (Facebook \+ Instagram)

* Google Ads (search, display)

* Google Hotel Ads (massive direct-booking lever)

* Geo-targeted Delhi searches: 'hotel near Khan Market', 'hotel Jangpura', etc.

* Retargeting: visitors who saw the site but didn't book

* Ad budgets are separate from agency fees — billed directly to client's ad accounts

**Local SEO \+ Google Business Profile Optimization**

* Done across all 5 hotels

* Drives 'hotels near \[landmark\]' organic searches

* Compounds over time — most valuable long-term marketing investment

* NAP (Name, Address, Phone) consistency across the web

* Local citation building

* Google posts, photos, review responses

**Summer Revenue Rescue Campaigns**

* Target: fight the March-July revenue dip

* Wedding-guest packages (May-June peak wedding season prep)

* Corporate offsite packages (year-round demand)

* 'Beat the Delhi heat' staycation packages with premium AC rooms

* Pilgrimage tourism packages (Hindu pilgrim guests)

* Multi-night discounts for slow weeks

**Corporate B2B Lead-Generation**

* AI agent scrapes LinkedIn for HR and Admin heads at Delhi NCR companies

* Sends personalized WhatsApp/email outreach pitching corporate room contracts

* Year-round demand at premium rates

* Builds long-term recurring revenue streams

## **Phase 3 — Advanced Capabilities**

**Foreign-Guest Multilingual Concierge**

* Languages: Spanish, French, Arabic, Mandarin (beyond Hindi/English)

* AI auto-detects guest's language preference and responds in kind

* Pre-arrival flows translated and culturally adapted

* Country-specific tips (e.g., what to expect at IGI Airport for first-time visitors)

**AI Integration With Existing Dynamic Pricing Tool**

* Client has an existing pricing tool — we INTEGRATE, not replace

* AI feeds the tool real-time signals:

  *     Price objections from guest conversations

  *     Competitor rates on OTA platforms

  *     Booking pace (slow vs fast weeks)

  *     Demand signals from inquiry volumes

* Pricing tool makes better decisions with these inputs

**Loyalty \+ Kalakar Reward Program (Digital)**

* Auto-Diwali payouts based on tracked performance

* Tier-based gift recommendations

* Push-button reward distribution

* Tracks loyalty over years

**PMS Integration (If Needed)**

* If client later adopts Hotelogix, eZee, Djubo, or other PMS

* Our system integrates cleanly via APIs

* No rebuild required

# **27\. Strategic Context (Long-Game Thinking)**

*This section is for internal team eyes only. It contains strategic context that informs how we operate, but is not for client conversations.*

## **Why This Project Matters For Shiv Automates**

* TRIINDIA is the first major hospitality tech client for Shiv Automates

* If executed well, this becomes our flagship case study

* Indian hotel SaaS is a wide-open market — most chains have no tech, BOTSHOT is the closest competitor

* This project's success opens the door to scaling the entire SaaS to 50-100 hotels in 12-18 months

## **Competitive Landscape (For Reference)**

* BOTSHOT — Indian AI-native hotel platform; their structure is the framework we're modeling

* Hotelogix, eZee (Yanolja), IDS Next, Djubo, Stayflexi — traditional PMS players; we don't compete with them, we'd integrate if needed

* Cloudbeds, Mews, RoomRaccoon — international players; mostly out of TRIINDIA's price range

* Visito, Conduit.ai, Canary Technologies — AI guest comm players; international focus

* OYO, Treebo, FabHotels — vertical chains with their own tech; not direct competitors but reference points for what's possible

## **The Long-Term Vision (Not For Client Conversations Yet)**

* Once Phase 1 \+ 1.5 is delivered for TRIINDIA, the system becomes productizable

* In months 4-6 post-launch, propose a partnership where TRIINDIA introduces other hotel networks

* Revenue share to TRIINDIA for every chain that closes through their referral

* This is the long-game — do NOT pitch this during the current project; let them experience value first

## **How To Talk About The System Externally**

* Always lead with outcomes, not technology

* Use stories (like Priya's journey), not feature lists

* Frame as 'how the business operates' not 'what software does'

* Owner-friendly language, never engineer-friendly

## **Brand Positioning**

* Shiv Automates \= the AI-native hospitality tech consultant for Indian hotel chains

* Not a generic agency, not a SaaS vendor — a specialist

* Delhi-based, Hindi+English fluent, India-native solutions

# **28\. Operational Protocols For The Team**

## **Client Communication**

* All client communication goes through Shiv only

* Team members do NOT message Mr. Hansraj, Mr. Habib, or Mr. Aftab directly

* Hotel manager communication is allowed but coordinated with Shiv

* If a team member encounters an urgent issue with client-facing impact, escalate to Shiv immediately

## **Data Handling**

* All guest data is client-owned and confidential

* No screenshots of guest data shared outside the team

* No guest data downloaded to personal devices

* CRM access logged and audited

* Comply with India's DPDP Act (Digital Personal Data Protection Act) at all times

## **Code Standards**

* All code in version control

* Code reviews mandatory before merging to main

* Environment variables never committed

* Sensitive credentials stored in a password manager (1Password, Bitwarden)

* Regular dependency updates and security patches

## **Testing Standards**

* Every WhatsApp flow tested end-to-end before going live

* Every n8n workflow tested with mock data

* Every Razorpay integration tested in test mode before production

* Smoke testing checklist for every deployment

## **Deployment Standards**

* Deploy to staging environment first

* Smoke test in staging

* Then deploy to production

* Notify Shiv before any production deployment

* Never deploy on Fridays after 4 PM (no support over weekend if something breaks)

## **Incident Response**

* If something breaks in production:

87. Notify Shiv immediately via WhatsApp

88. Assess impact (which hotel, which flow, how many guests affected)

89. Roll back to last working state if possible

90. Fix forward only after root cause identified

91. Post-incident report within 24 hours

## **Documentation Standards**

* Every workflow has inline comments explaining what and why

* Every API integration has a setup README

* Every customization to Odoo is documented with rationale

* SOPs updated whenever a process changes

## **Quality Bar**

* 'Done' means: built, tested, deployed, documented, handed over

* Half-done features don't ship

* If a deadline is at risk, raise it 48 hours in advance — never on the day

## **Team Hygiene**

* Daily 15-minute stand-up during build phase

* Weekly retro every Friday

* Clear ownership of every task (no 'we' tasks)

* Shared project board (Notion or ClickUp) is the source of truth for status

## **Critical Reminders**

***The partners are not tech-savvy. Every demo, every conversation, every screen must be designed for a non-technical audience. If a 60-year-old who has never used a smartphone app cannot understand what they're looking at in 10 seconds, redesign it.***

***The Kalakar tradition is sacred. Do not propose changes to the reward ceremony or the cash payment process. We are digitizing the data layer only. The ritual stays exactly as it is.***

***The previous agency made the partners cynical. They've heard 'we'll grow your business' before and got 10k followers with zero bookings. Every deliverable must produce a tangible, demonstrable outcome. No vanity metrics.***

# **29\. Final Pre-Build Checklist**

Before any code is written, every item on this checklist must be confirmed:

**Identity**

* Client entity: TRIINDIA HOSPITALITY (partnership firm) — confirmed

* Partners: Mr. Hansraj Lakhmani, Mr. Habib Mohammad, Mr. Mohd Aftab — confirmed

* Address: 2719, 2nd Floor, Gali No. 7, China Mandi, Paharganj, New Delhi 110055 — confirmed

* Service Provider: Shiv Arora, Shiv Automates — confirmed

**Scope**

* Tier 2 (Growth) — confirmed

* AI Upsell Agent add-on — INCLUDED

* Historical Register OCR Migration add-on — INCLUDED

* Google Reviews automation — NOT INCLUDED

**Properties**

* J Residency — PILOT (Phase 1\)

* Hotel Satwah 29 — Phase 1.5

* Hotel Ashram View — Phase 1.5

* Hotel Preet Place — Phase 1.5

* Hotel Samrat Residency — Phase 1.5

**Timeline**

* Day 0: 3 May 2026

* Day 25 demo: \~28 May 2026

* Day 50 handover: \~22 June 2026

**Tech Stack**

* Frontend: Next.js on Vercel

* CRM: Odoo Community Edition (self-hosted)

* Automation: n8n (self-hosted on same VPS as Odoo)

* VPS: Hetzner or DigitalOcean

* Payments: Razorpay (fresh merchant account)

* WhatsApp: Meta Business API via AiSensy or Wati BSP

* AI: Claude or GPT-4o (pay-per-use)

* OCR: Claude Vision or GPT-4o Vision

**Process**

* E-signature: Zoho Sign (free plan, link-per-person delivery)

* Project management: Notion or ClickUp (shared workspace)

* Code repository: Private GitHub under Shiv Automates

* Daily standups during build phase

* Weekly retros every Friday

# **30\. Closing — Build Mindset**

This is a serious project. TRIINDIA Hospitality is trusting us with the operational backbone of their business. Every decision we make affects real guests, real revenue, real relationships built over years.

**Build with the seriousness this deserves.**

The system we're building is not impressive because of the technology. It's impressive because it will let a 60-year-old hotelier in Paharganj see his revenue at a glance, recognize his best Kalakar by data, recover guests his competitors thought were lost, and welcome foreign travelers with the warmth they couldn't deliver before.

**That's what matters.**

Everything in this document is here to help you build that. If anything is unclear, ask Shiv. If anything is missing, raise it. If anything contradicts reality, flag it.

**Now build.**