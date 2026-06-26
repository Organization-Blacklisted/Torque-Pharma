import type { AboutUsPageData } from "@/types/about-us";


export const aboutUsPage: AboutUsPageData = {

  contentMedia: {
    eyebrow: "Who We Are",
    heading: "We are the People's Pharmaceutical Company",
    description:
      "With focused purpose and growing ambition, Torque Pharma combines precise science with human care to serve people, improve lives, and support healthier communities.",
    layout: "split-left",
    media: {
      type: "image",
      src: "/images/about/banner.png",
      alt: "Torque Pharma team",
      fit: "contain",
    },
    actions: [
      {
        label: "Download Company Profile",
        href: "/company-profile",
        variant: "primary",
      },
    ],
  },

  overview: {
    heading: "We Built the System Behind Better Medicines",
    description:
      "Since 1985, Torque Pharmaceuticals has stood for one thing: making quality healthcare more accessible. What began as a commitment to trusted medicines has grown into a diversified health company spanning continents. Our legacy is measured not just in years, but in communities served, standards upheld, and millions of lives improved.",
    video: "/videos/about/overview.mp4",
  },

  stats: [
    {
      value: "40+",
      suffix: "Years",
      description:
        "of developing healthcare solutions that consistently improve patient care and build lasting trust.",
      theme: "dark",
    },
    {
      value: "25+",
      description:
        "partnered countries making exceptional healthcare solutions accessible to those who need them most, around the world.",
      theme: "dark",
    },
    {
      value: "100+",
      description:
        "COPPs support compliant registrations and expand pharmaceutical access across regulated global markets.",
      theme: "dark",
    },
    {
      value: "500+",
      description:
        "products meet global health standards and are trusted for their clinical potency and consistent therapeutic performance.",
      theme: "dark",
    },
  ],

  cta: {
    eyebrow: "Code of Conduct",
    title: "The Standards That Guide Us",
    description:
      "We hold ourselves to consistent standards of ethics, respect, and accountability. This code explains the conduct expected across our teams, operations, and external interactions.",
    button: {
      label: "Download the Document",
      href: "/code-of-conduct",
    },
  },

};
