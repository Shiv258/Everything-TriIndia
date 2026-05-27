// Home page stats — 4 slots. Numbers that can change come from this file so the home
// page never carries them as hardcoded JSX.

import { getActiveHotels, getUniqueNeighborhoods } from "./hotels";

// TODO: replace with the real founding year once the operator provides it.
// Used both for the "Since YYYY" eyebrow and the "{n}+ years in Delhi hospitality" stat.
export const TRIINDIA_FOUNDED_YEAR = 2015;

// Current year evaluated at module load. Using a module-level constant (rather than calling
// new Date() per render) keeps SSR and client hydration stable.
export const CURRENT_YEAR = new Date().getFullYear();

// TriIndia operates 15+ hotels across Delhi in total; only the 5 in lib/hotels.ts are
// currently on the website. This number is the org-level reality, not the website inventory.
export const TRIINDIA_HOTELS_TOTAL = "15+";

// Lifetime guest count claimed by the operator. Replace once a verified number is known.
export const TRIINDIA_GUESTS_SERVED = "50K+";

export interface HomeStat {
  value: string;
  label: string;
  icon: "landmark" | "buildings" | "map-pinned" | "users";
}

export function getHomeStats(): HomeStat[] {
  const yearsInDelhi = Math.max(1, CURRENT_YEAR - TRIINDIA_FOUNDED_YEAR);
  const neighborhoodCount = getUniqueNeighborhoods().length;

  return [
    {
      value: `${yearsInDelhi}+`,
      label: "Years in Delhi hospitality",
      icon: "landmark",
    },
    {
      value: TRIINDIA_HOTELS_TOTAL,
      label: "Hotels across Delhi",
      icon: "buildings",
    },
    {
      value: `${neighborhoodCount}`,
      label: "Delhi neighbourhoods served",
      icon: "map-pinned",
    },
    {
      value: TRIINDIA_GUESTS_SERVED,
      label: "Guests hosted",
      icon: "users",
    },
  ];
}

export function getCurrentlyOnSiteCount(): number {
  return getActiveHotels().length;
}
