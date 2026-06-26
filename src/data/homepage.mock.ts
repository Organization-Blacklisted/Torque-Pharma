import type { HomepageData } from "@/types/homepage";

export const homepageMock: HomepageData = {
  torqueLineup: {
    eyebrow: "The Torque Lineup",
    heading: "Brands That Earned Recognition",
    description: "Together, they represent a lineup built on usability, quality, and the quiet trust that comes from products that perform well.",
    items: [
      {
        category: "Respiratory Relief",
        pillColor: "#446615",
        logo: "/images/home/torex-image.svg",
        productImage: "/images/home/torex-pdp-image.png",
        description: "Fast relief, everyday wellness",
        brandName: "Torex",
        href: "#",
      },
      {
        category: "Anti-Scars & Brightening",
        pillColor: "#9D1A41",
        logo: "/images/home/no-scars-image.svg",
        productImage: "/images/home/no-scars-pdp-image.png",
        description: "Brighter-looking skin with focused scar care",
        brandName: "No Scars",
        href: "#",
      },
      {
        category: "Clinical Skin Solutions",
        pillColor: "#A13790",
        logo: "/images/home/medisalic-image.svg",
        productImage: "/images/home/medisalic-pdp-image.png",
        description: "Dermatological care for persistent skin concerns",
        brandName: "Medisalic",
        href: "#",
      },
      {
        category: "Hair and Scalp Care",
        pillColor: "#446615",
        logo: "/images/home/ketomac-image.svg",
        productImage: "/images/home/ketomac-pdp-image.png",
        description: "Targeted care for dandruff-prone scalps",
        brandName: "Ketomac",
        href: "#",
      },
    ],
  },
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
  statsMedia: {
    eyebrow: "Zero-Defect Production",
    title: "Manufacturing at Scale, Without Compromise",
    description:
      "Our manufacturing infrastructure is one of the most significant strengths Torque Pharma brings to its partners and markets. Spread across 5 state-of-the-art facilities, our plants are equipped to produce high volumes across multiple dosage forms, including tablets, capsules, liquids, topicals, and more.",
    stats: [
      {
        label: "Annual Output Capacity",
        value: "2.83",
        suffix: "Billion",
        description: "units per annum across all dosage forms",
        theme: "light",
      },
      {
        label: "Formulation Capabilities",
        value: "13+",
        description: "dosage forms supported within one manufacturing ecosystem",
        theme: "light",
      },
      {
        label: "Certified Export Strength",
        value: "100+",
        suffix: "COPPs",
        description: "reinforcing regulatory confidence for international supply",
        theme: "light",
      },
      {
        label: "Logistics Hubs",
        value: "26",
        suffix: "depots",
        description: "pan-India to meet the growing needs of the healthcare industry",
        theme: "light",
      },
    ],
    media: {
      sources: [
        { src: "/videos/manufacturing/higher-standards.mp4", type: "video/mp4" as const },
      ],
    },
    card: {
      title: "Built to a Higher Standard",
      description:
        "Our facilities are built to exceed global regulatory benchmarks, backed by rigorous audits, continuous improvement, teams trained to the highest pharmaceutical standards.",
    },
    footer: {
      label: "Manufacturing Capabilities",
      href: "/manufacturing-facility",
    },
  },

};
