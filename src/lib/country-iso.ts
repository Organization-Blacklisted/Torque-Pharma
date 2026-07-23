// Maps a country-detail-page slug to its ISO 3166-1 alpha-2 code, used to
// pre-select the country in the phone field on that page's enquiry form (the
// user can still change it). Keyed by the exact slugs the country-categories
// API returns — including its misspellings ("mayanmar" = Myanmar,
// "yamen" = Yemen). Add new rows here as countries are added.
const SLUG_TO_ISO: Record<string, string> = {
  // Africa
  algeria: "DZ",
  angola: "AO",
  "burkina-faso": "BF",
  burundi: "BI",
  cameroon: "CM",
  ethiopia: "ET",
  gambia: "GM",
  "ivory-coast": "CI",
  liberia: "LR",
  mali: "ML",
  mozambique: "MZ",
  somalia: "SO",
  "south-sudan": "SS",
  sudan: "SD",
  uganda: "UG",
  zambia: "ZM",
  // Asia
  afghanistan: "AF",
  india: "IN",
  mayanmar: "MM", // Myanmar (API spelling)
  nepal: "NP",
  philippines: "PH",
  "sri-lanka": "LK",
  yamen: "YE", // Yemen (API spelling)
  // South America
  guyana: "GY",
};

// Falls back to "IN" (the site default) for any unmapped / newly added country.
export function countrySlugToIso(slug: string): string {
  return SLUG_TO_ISO[slug] ?? "IN";
}
