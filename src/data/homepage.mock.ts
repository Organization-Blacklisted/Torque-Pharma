import type { HomepageData } from "@/types/homepage";

export const homepageMock: HomepageData = {
  therapeuticAreas: {
    eyebrow: "Therapeutic Areas",
    heading: "Strengthening Health Across Multiple Specialities",
    description: "Our product portfolio spans a broad and carefully considered range of therapeutic areas, each chosen to address significant health needs across our markets.",
    items: [
      { title: "Dermatology",                image: "/images/categories/dermatology.png",                href: "/products/dermatology" },
      { title: "Respiratory Health",         image: "/images/categories/respiratory-health.png",         href: "/products/respiratory-health" },
      { title: "Gastrointestinal",           image: "/images/categories/gastrointestinal.png",           href: "/products/gastrointestinal" },
      { title: "Anti-Infective Antibiotics", image: "/images/categories/anti-infective-antibiotics.png", href: "/products/anti-infective-antibiotics" },
    ],
    cta: { label: "View All", href: "/products" },
  },
};
