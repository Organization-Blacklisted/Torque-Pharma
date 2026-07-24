export type NavChild = { label: string; href: string };

export type MegaParent = {
  label: string;
  slug: string;
  areas: NavChild[];
};

export type NavItem =
  | { label: string; href: string; children?: undefined; mega?: undefined }
  | { label: string; href?: undefined; children: NavChild[]; mega?: undefined }
  | { label: string; href?: undefined; children?: undefined; mega: MegaParent[] };

export const navItems: NavItem[] = [
  {
    label: "Company",
    children: [
      { label: "About Us", href: "/about-us" },
      { label: "Our History", href: "/our-history" },
      { label: "Board of Directors", href: "/board-of-directors" },
      { label: "Manufacturing Facilities", href: "/manufacturing-facility" },
      { label: "Certifications", href: "/certifications" },
    ],
  },
  { label: "Global Presence", href: "/global-presence" },
  {
    label: "Products",
    mega: [
      {
        label: "Domestic",
        slug: "domestic",
        areas: [
          { label: "Dermatology", href: "/category/domestic/dermatology" },
          { label: "Gastro", href: "/category/domestic/gastro" },
          { label: "Multi-Vitamins", href: "/category/domestic/multi-vitamins" },
          { label: "Haematinics", href: "/category/domestic/haematinics" },
          { label: "Antibiotics", href: "/category/domestic/antibiotics" },
          { label: "Respiratory", href: "/category/domestic/respiratory" },
          // Backend merged Eye/Ear and Nasal into a single category
          { label: "Eye/Ear/Nasal", href: "/category/domestic/eye-ear-nasal" },
          { label: "Ayurveda", href: "/category/domestic/ayurveda" },
          { label: "NSAIDs", href: "/category/domestic/nsaids" },
          // Single-product category — link straight to the product detail page
          { label: "Urinary Alkalizer", href: "/product/alkator-syrup" },
          { label: "Anti-Allergy", href: "/category/domestic/anti-allergy" },
          { label: "Antigout", href: "/category/domestic/anti-gout" },
          { label: "Anti-Cardiac", href: "/category/domestic/anti-cardiac" },
          { label: "Anti-Diabetic", href: "/category/domestic/anti-diabetic" },
          { label: "Anti-Thyroid", href: "/category/domestic/anti-thyroid" },
          { label: "Erectile Dysfunction", href: "/category/domestic/erectile-dysfunction" },
          // Single-product category — link straight to the product detail page
          { label: "Contraception Disorder", href: "/product/primotor-n-tablets" },
        ],
      },
      {
        label: "International",
        slug: "export",
        // hrefs use the real export category slugs from the API (several are
        // suffixed, e.g. gastro-1); labels stay as the curated menu names.
        areas: [
          { label: "Anti-Allergies", href: "/category/export/anti-allergies" },
          { label: "Antibiotics", href: "/category/export/antibiotics" },
          { label: "Dermatology", href: "/category/export/dermatology-1" },
          { label: "Gastro", href: "/category/export/gastro-1" },
          { label: "Haematinics", href: "/category/export/haematinics-1" },
          { label: "Multi Vitamins", href: "/category/export/multi-vitamins" },
          { label: "NSAID", href: "/category/export/nsaid" },
          { label: "Respiratory", href: "/category/export/respiratory-1" },
          { label: "Miscellaneous", href: "/category/export/miscellaneous" },
        ],
      },
    ],
  },
  {
    label: "Capabilities",
    children: [
      { label: "White Label Manufacturing", href: "/white-label-manufacturing" },
    ],
  },
  {
    label: "Life at Torque",
    children: [
      { label: "Career", href: "/career" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "Blogs", href: "/blogs" },
      { label: "Events", href: "/events" },
      { label: "Become a Dealer", href: "/become-a-dealer" },
      { label: "News & Media", href: "/news-and-media" },
      { label: "Certifications & Accreditations", href: "/certifications" },
    ],
  },
];
