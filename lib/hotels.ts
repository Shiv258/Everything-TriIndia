// Single source of truth for every TriIndia hotel.
// Drives: home Featured Stays, PortfolioMarquee, /hotels list, /hotels/[slug] detail pages,
// Delhi map pins, footer portfolio column, and stats counts.
//
// Coordinates are approximations derived from address + landmarks; user should verify
// each pin against Google Maps before P5 (map phase).

export type HotelStatus = "active" | "coming-soon";

export interface HotelCoordinates {
  lat: number;
  lng: number;
}

export interface HotelRoom {
  slug: string;
  name: string;
  rate: string;
  originalRate?: string;
  discount?: string;
  capacity?: number;
  description: string;
  heroImage: string;
  images: string[];
}

export interface Amenity {
  label: string;
  icon: "wifi" | "bed" | "dining" | "reception" | "parking" | "ac" | "tv" | "laundry" | "spa" | "bar" | "breakfast";
  detail?: string;
}

export interface GalleryEntry {
  src: string;
  label?: string;
  copy?: string;
}

export interface HotelExternalLinks {
  website?: string;
  makeMyTrip?: string;
  booking?: string;
  goibibo?: string;
}

export interface Hotel {
  slug: string;
  name: string;
  shortName?: string;
  tagline: string;
  city: "New Delhi";
  neighborhood: string;
  address: string;
  pincode: string;
  coordinates: HotelCoordinates;
  phone?: string;
  description: string[];
  amenities: Amenity[];
  rooms: HotelRoom[];
  heroImage: string;
  galleryImages: string[];
  detailGallery?: GalleryEntry[];
  heroVideo?: string;
  mapEmbedUrl?: string;
  featured: boolean;
  status: HotelStatus;
  rating?: number;
  ratingCount?: number;
  ratingSource?: string;
  establishedYear?: number;
  promoCode?: string;
  conciergeBlurb?: string[];
  scrollFrames?: boolean;
  externalLinks?: HotelExternalLinks;
}

const jResidencyDeluxe = [1, 2, 3, 4].map((n) => `/jresidency/rooms/deluxe/${n}.jpeg`);
const jResidencyStudio = [1, 2, 3, 4, 5, 6].map((n) => `/jresidency/rooms/studio/${n}.jpeg`);
const jResidencyExecutive = [1, 2, 3, 4, 5, 6, 7].map((n) => `/jresidency/rooms/executive-suite/${n}.jpeg`);
const jResidencyFamily = [1, 2, 3, 4].map((n) => `/jresidency/rooms/family-suite/${n}.jpeg`);

const ashramImages = [
  "/ashram/WhatsApp%20Image%202026-05-12%20at%2012.54.56%20PM%20(1).jpeg",
  "/ashram/WhatsApp%20Image%202026-05-12%20at%2012.54.57%20PM%20(1).jpeg",
  "/ashram/WhatsApp%20Image%202026-05-12%20at%2012.54.58%20PM%20(3).jpeg",
];

const jResidencyMainImages = [
  "/j-residency-main/WhatsApp%20Image%202026-05-17%20at%206.46.48%20PM%20(1).jpeg",
  "/j-residency-main/WhatsApp%20Image%202026-05-17%20at%206.46.48%20PM.jpeg",
  "/j-residency-main/WhatsApp%20Image%202026-05-17%20at%206.46.49%20PM%20(1).jpeg",
];

const preetImages = [
  "/preet/WhatsApp%20Image%202026-05-12%20at%2012.51.33%20PM%20(2).jpeg",
  "/preet/WhatsApp%20Image%202026-05-12%20at%2012.51.34%20PM.jpeg",
  "/preet/WhatsApp%20Image%202026-05-12%20at%2012.51.35%20PM%20(2).jpeg",
];

const samratImages = [
  "/samrth/WhatsApp%20Image%202026-05-12%20at%2012.53.10%20PM%20(2).jpeg",
  "/samrth/WhatsApp%20Image%202026-05-12%20at%2012.53.11%20PM%20(1).jpeg",
  "/samrth/WhatsApp%20Image%202026-05-12%20at%2012.53.15%20PM%20(1).jpeg",
];

export const hotels: Hotel[] = [
  {
    slug: "j-residency",
    name: "J Residency",
    shortName: "J Residency",
    tagline: "A clean room and a calm welcome, two minutes from Nizamuddin Railway Station.",
    city: "New Delhi",
    neighborhood: "Jangpura B",
    address: "Jangpura B, New Delhi",
    pincode: "110014",
    coordinates: { lat: 28.5825, lng: 77.2421 },
    phone: "+919899402024",
    description: [
      "J Residency is our pilot property — a small, owner-run hotel tucked into Jangpura B, central south Delhi. It exists for travellers who care less about chandeliers and more about a clean room, working WiFi, and someone at the desk who actually answers the phone at 2 a.m.",
      "Two minutes from Nizamuddin Railway Station, ten from Khan Market, fifteen from Humayun's Tomb. The kind of address you want when you land in Delhi for the first time and don't want to gamble on a stranger's neighbourhood.",
    ],
    amenities: [
      { label: "Free WiFi", icon: "wifi", detail: "Fast connection for work, calls, and travel planning." },
      { label: "Luxury Rooms", icon: "bed", detail: "Clean rooms with polished finishes and comfortable bedding." },
      { label: "In-House Dining", icon: "dining", detail: "Food support inside the property without stepping out." },
      { label: "24/7 Reception", icon: "reception", detail: "Front-desk support for arrivals, stays, and questions." },
    ],
    rooms: [
      {
        slug: "deluxe",
        name: "Deluxe Room",
        rate: "₹1,999",
        originalRate: "₹2,999",
        discount: "33%",
        description: "Compact, clean, and easy for short Delhi stays.",
        heroImage: jResidencyDeluxe[0],
        images: jResidencyDeluxe,
      },
      {
        slug: "studio",
        name: "Studio Room",
        rate: "₹1,999",
        originalRate: "₹2,999",
        discount: "33%",
        description: "A practical studio-style room with a calmer residential feel.",
        heroImage: jResidencyStudio[0],
        images: jResidencyStudio,
      },
      {
        slug: "executive-suite",
        name: "Executive Attached Suite Room",
        rate: "₹2,499",
        originalRate: "₹3,499",
        discount: "29%",
        description: "More breathing space with an attached suite layout for longer stays.",
        heroImage: jResidencyExecutive[1],
        images: jResidencyExecutive,
      },
      {
        slug: "family-suite",
        name: "Family Suite Premium Room",
        rate: "₹4,499",
        originalRate: "₹6,499",
        discount: "31%",
        description: "The larger premium choice for families and group travel.",
        heroImage: jResidencyFamily[2],
        images: jResidencyFamily,
      },
    ],
    heroImage: "/main-images/J%20Residency.jpeg",
    galleryImages: jResidencyMainImages,
    detailGallery: [
      { src: "/jresidency/reception-area.jpeg", label: "Reception", copy: "Chandelier light, marble flooring, and a front desk built for quick arrivals." },
      { src: "/jresidency/sitting-area.jpeg", label: "Sitting Area", copy: "Teal lounge seating, gold table frames, wall art, and a quiet pause before the room." },
      { src: "/jresidency/bedroom-blue.jpeg", label: "Guest Room Detail", copy: "Crisp linen, paneled walls, and a clean room setup for business and leisure stays." },
      { src: "/jresidency/bedroom-red.jpeg", label: "Warm Suite Detail", copy: "Wood textures, warm sconces, and a softer room mood for families and longer nights in Delhi." },
    ],
    heroVideo: "/jresidency/hero-video.mp4",
    mapEmbedUrl: "https://maps.app.goo.gl/Ez8pNYKhYcpUrGLt5",
    featured: true,
    status: "active",
    promoCode: "RETURN15",
    conciergeBlurb: [
      "Ask about room types, rates, check-in, or dining before you arrive.",
      "Get the map link and arrival guidance without searching through messages.",
      "Send simple requests faster: extra bedding, dining questions, or late arrival notes.",
      "Reception stays in control whenever a guest needs a real person.",
    ],
    scrollFrames: true,
  },

  {
    slug: "hotel-ashram-view",
    name: "Hotel Ashram View",
    shortName: "Ashram View",
    tagline: "Two minutes from Ashram Metro. Quiet residential street. New build, modern fittings.",
    city: "New Delhi",
    neighborhood: "Siddhartha Enclave",
    address: "E102, Siddhartha Enclave, Sunlight Colony, New Delhi",
    pincode: "110014",
    coordinates: { lat: 28.5734, lng: 77.2576 },
    phone: undefined,
    description: [
      "Hotel Ashram View opened in 2024 in Siddhartha Enclave, a residential pocket of Sunlight Colony where the streets stay quiet at night. It's the newest property in the TriIndia portfolio — modern fittings, fresh paint, no inherited wear.",
      "Two to four minutes' walk from Ashram Metro Gate 2 and a short drive from Nizamuddin Railway Station. The location is engineered for guests who want central-Delhi access without paying central-Delhi noise.",
    ],
    amenities: [
      { label: "Free WiFi", icon: "wifi" },
      { label: "24/7 Room Service", icon: "reception" },
      { label: "Secure Parking", icon: "parking" },
      { label: "Air Conditioning", icon: "ac" },
    ],
    rooms: [],
    heroImage: "/main-images/Ashram.jpeg",
    galleryImages: ashramImages,
    featured: true,
    status: "active",
    establishedYear: 2024,
    externalLinks: {
      website: "https://hotelashramview.com",
    },
  },

  {
    slug: "hotel-preet-place",
    name: "Hotel Preet Place",
    shortName: "Preet Place",
    tagline: "Five minutes on foot to Nizamuddin Railway Station. AC rooms, sound-insulated walls.",
    city: "New Delhi",
    neighborhood: "Jangpura B",
    address: "Block C, Jangpura, Jangpura B, New Delhi",
    pincode: "110014",
    coordinates: { lat: 28.5808, lng: 77.2425 },
    phone: undefined,
    description: [
      "Hotel Preet Place sits in Block C, Jangpura B — a five-minute walk to Nizamuddin Railway Station and a short rickshaw to Khan Market. The property has been operating for years; the rooms have been refreshed to handle long-haul travellers who need a real night's sleep.",
      "Sound-insulated walls (a rarer touch in this price band in Delhi), AC in every room, free WiFi, and a 24-hour front desk. Free parking on the property for guests driving in.",
    ],
    amenities: [
      { label: "Free WiFi", icon: "wifi" },
      { label: "Air Conditioning", icon: "ac" },
      { label: "Free Parking", icon: "parking" },
      { label: "24/7 Front Desk", icon: "reception" },
      { label: "Room Service", icon: "dining" },
      { label: "Laundry", icon: "laundry" },
    ],
    rooms: [],
    heroImage: "/main-images/Preet.jpeg",
    galleryImages: preetImages,
    featured: true,
    status: "active",
    rating: 3.6,
    ratingCount: 1092,
    ratingSource: "Yatra",
  },

  {
    slug: "hotel-samrat-residency",
    name: "Hotel Samrat Residency",
    shortName: "Samrat Residency",
    tagline: "TriIndia-operated property near Nizamuddin Railway Station. Spacious rooms, restaurant on site.",
    city: "New Delhi",
    neighborhood: "Bhogal",
    address: "Shashtri Market, 707, Jangpura Rd, near Aggarwal Cement, Bhogal, New Delhi",
    pincode: "110014",
    coordinates: { lat: 28.5798, lng: 77.2467 },
    phone: undefined,
    description: [
      "Hotel Samrat Residency is one of our larger properties — spacious rooms, a full-service restaurant on the ground floor, and a location two kilometres from the nearest metro and three from Nizamuddin Railway Station. Listed externally as 'Samrat Residency Nizamuddin by TRIINDIA Hospitality'.",
      "It suits travellers who want a little more room than a typical Delhi guest house provides, and groups who want everyone on the same floor.",
    ],
    amenities: [
      { label: "Free WiFi", icon: "wifi" },
      { label: "On-site Restaurant", icon: "dining" },
      { label: "Spacious Rooms", icon: "bed" },
      { label: "Air Conditioning", icon: "ac" },
      { label: "Front Desk", icon: "reception" },
    ],
    rooms: [],
    heroImage: "/main-images/Samrath.jpeg",
    galleryImages: samratImages,
    featured: true,
    status: "active",
    rating: 3.9,
    ratingCount: 113,
    ratingSource: "Justdial",
  },

  {
    slug: "hotel-satwah-29",
    name: "Hotel Satwah 29",
    shortName: "Satwah 29",
    tagline: "Guest house in Bhogal. Bar, coffee shop, full restaurant. A short walk to Nizamuddin Railway.",
    city: "New Delhi",
    neighborhood: "Bhogal",
    address: "29 Church Road, Jangpura, Samman Bazar, Bhogal, New Delhi",
    pincode: "110014",
    coordinates: { lat: 28.5793, lng: 77.2451 },
    phone: "+917428822220",
    description: [
      "Hotel Satwah 29 is a 24-hour guest house on Church Road in Bhogal — the part of central south Delhi where the older Christian-colony streets meet the Jangpura grid. It has the full set of services TriIndia properties don't usually carry: an in-house bar, a coffee shop, and a sit-down restaurant on the ground floor.",
      "Walking distance to Nizamuddin Railway Station, with easy access by metered taxi, Uber, auto, and rickshaw for everywhere else in central Delhi.",
    ],
    amenities: [
      { label: "Bar", icon: "bar" },
      { label: "Restaurant", icon: "dining" },
      { label: "Free WiFi", icon: "wifi" },
      { label: "24/7 Front Desk", icon: "reception" },
      { label: "On-site Parking", icon: "parking" },
      { label: "Breakfast", icon: "breakfast" },
    ],
    rooms: [],
    // TODO: Hotel Satwah 29 photos pending from operator — using J Residency placeholder
    // hero so the marquee/featured grid doesn't break. Swap once photos are dropped in
    // public/satwah/.
    heroImage: "/main-images/J%20Residency.jpeg",
    galleryImages: [],
    featured: false,
    status: "active",
    rating: 3.5,
    ratingCount: 178,
    ratingSource: "Justdial",
  },
];

export function getHotelBySlug(slug: string): Hotel | undefined {
  return hotels.find((h) => h.slug === slug);
}

export function getActiveHotels(): Hotel[] {
  return hotels.filter((h) => h.status === "active");
}

export function getFeaturedHotels(limit?: number): Hotel[] {
  const featured = hotels.filter((h) => h.featured && h.status === "active");
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getUniqueNeighborhoods(): string[] {
  const set = new Set(getActiveHotels().map((h) => h.neighborhood));
  return Array.from(set);
}

export function getAllGalleryImages(): { hotel: Hotel; src: string }[] {
  return getActiveHotels().flatMap((hotel) =>
    hotel.galleryImages.map((src) => ({ hotel, src })),
  );
}
