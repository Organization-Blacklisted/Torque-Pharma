import type { ManufacturingFacilityPageData } from "@/types/manufacturing-facility";

export const manufacturingFacilityPage: ManufacturingFacilityPageData = {

  contentMedia: {
    eyebrow: "Production Process",
    heading: "Manufacturing Medicines People Can Trust",
    description:
      "Our commitment to consistent quality and dependable delivery has earned us the lasting confidence of patients and healthcare professionals across the industry.",
    layout: "centered",
    media: {
      type: "video",
      sources: [
        { src: "/videos/manufacturing/together-better.mp4", type: "video/mp4" as const },
      ],
      poster: "/images/manufacturing/together-better-poster.png",
    },
    actions: [
      { label: "Download Company Profile", href: "/company-profile", variant: "primary" },
    ],
  },

  stats: {
    eyebrow: "MANUFACTURING EXCELLENCE",
    title: "Manufacturing That Moves at the Speed of Your Business",
    description:
      "For over four decades, Torque Pharma has delivered trusted, high-quality medicines backed by world-class manufacturing and streamlined pharmaceutical processes. Every formulation is developed with a strong focus on potency, safety, consistency, and regulatory excellence to meet the evolving demands of patients, healthcare providers, and business partners worldwide.",
    stats: [
      {
        label: "LARGE-SCALE OUTPUT",
        value: "43.5",
        suffix: "Billion",
        description: "units annually across diverse dosage forms",
        theme: "dark",
      },
      {
        label: "LOGISTICS NETWORK",
        value: "26",
        suffix: "Depots",
        description: "across India supporting growing healthcare supply needs",
        theme: "dark",
      },
      {
        label: "INDUSTRIAL MANUFACTURING BASE",
        value: "40+",
        suffix: "Acres",
        description: "used for manufacturing medicines and wellness products",
        theme: "dark",
      },
      {
        label: "DEDICATED WORKFORCE",
        value: "1500+",
        description: "individuals working towards the nation's better health",
        theme: "dark",
      },
    ],
  },

  cta: {
    eyebrow: "Let's Join Hands",
    title: "Let's Expand the Boundaries of Human Care Together!",
    button: {
      label: "Shape the Future with Us",
      href: "/contact-us",
    },
  },

  faq: {
    eyebrow: "FAQs",
    heading: "Got Questions About Us?",
    description:
      "Find the answer to common queries. ",
    items: [
      {
        title: "What dosage forms and product categories are manufactured at Torque Pharma's plants?",
        content:
          "<p>Torque Pharma manufactures a wide range of dosage forms including tablets, capsules, soft gels, injections, infusions, oral liquids, dry syrups, oral powders, eye/ear drops and external preparations.</p>",
      },
      {
        title: "What industry memberships does Torque Pharma hold relevant to manufacturing and exports?",
        content:
          "<p>Torque Pharma maintains memberships and certifications supporting manufacturing excellence and exports across regulated and emerging markets worldwide.</p>",
      },
      {
        title: "What is the annual production capacity of Torque Pharma's manufacturing plants?",
        content:
          "<p>Torque Pharma produces over 43.5 billion units annually across diverse dosage forms, supported by more than 40 acres of industrial manufacturing base.</p>",
      },
      {
        title: "How does Torque Pharma ensure quality control across its manufacturing processes?",
        content:
          "<p>Every formulation is developed with a strong focus on potency, safety, consistency, and regulatory excellence, meeting GMP standards and international compliance requirements.</p>",
      },
      {
        title: "How many awards and recognitions has Torque Pharma received for manufacturing excellence?",
        content:
          "<p>Torque Pharma has received numerous awards for innovation and quality in manufacturing. These accolades come from nationally and internationally renowned organisations, reflecting the company's consistent pursuit of excellence over four decades.</p>",
      },
    ],
  },

};
