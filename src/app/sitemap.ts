import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/api/product";
import { getSiblingCategories } from "@/lib/api/product-category";
import { getCountryCategories } from "@/lib/api/country-categories";
import { getEvents } from "@/lib/api/events";
import { getBlogs } from "@/lib/api/blogs";

const BASE_URL = "https://www.torquepharma.com";

// Real, built-out pages only — excludes /company, /capabilities, /products
// (h1-only stubs) and /news-and-media (deliberately unlinked from nav)
const STATIC_PATHS = [
  "",
  "about-us",
  "board-of-directors",
  "manufacturing-facility",
  "contact-us",
  "career",
  "become-a-dealer",
  "white-label-manufacturing",
  "disclaimer",
  "privacy-policy",
  "terms-and-conditions",
  "our-history",
  "global-presence",
  "blogs",
  "events",
  "certifications",
  "code-of-conduct",
  "life-at-torque",
];

const CATEGORY_PARENT_SLUGS = ["domestic", "export"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, categoryGroups, countryCategories, events, blogs] = await Promise.all([
    getAllProductSlugs(),
    Promise.all(
      CATEGORY_PARENT_SLUGS.map(async (parent) => {
        const siblings = await getSiblingCategories(parent);
        return siblings.map((s) => `category/${parent}/${s.slug}`);
      })
    ),
    getCountryCategories(),
    getEvents(),
    getBlogs(),
  ]);

  const paths = [
    ...STATIC_PATHS,
    ...categoryGroups.flat(),
    ...countryCategories.flatMap((cat) => cat.countries.map((c) => `country/${c.slug}`)),
    ...events.map((e) => `events/${e.slug}`),
    ...blogs.map((b) => `blogs/${b.slug}`),
    ...productSlugs,
  ];

  const lastModified = new Date();

  return paths.map((path) => ({
    url: path ? `${BASE_URL}/${path}` : BASE_URL,
    lastModified,
  }));
}
