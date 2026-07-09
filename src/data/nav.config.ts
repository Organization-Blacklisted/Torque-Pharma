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
      { label: "Company Profile", href: "/company" },
      { label: "Our History", href: "/company/our-history" },
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
          { label: "Eye/Ear", href: "/category/domestic/eye-ear" },
          { label: "Nasal", href: "/category/domestic/nasal" },
          { label: "Ayurveda", href: "/category/domestic/ayurveda" },
          { label: "NSAIDs", href: "/category/domestic/nsaids" },
          { label: "Urinary Alkalizer", href: "/category/domestic/urinary-alkalizer" },
          { label: "Anti-Allergy", href: "/category/domestic/anti-allergy" },
          { label: "Antigout", href: "/category/domestic/antigout" },
          { label: "Anti-Cardiac", href: "/category/domestic/anti-cardiac" },
          { label: "Anti-Diabetic", href: "/category/domestic/anti-diabetic" },
          { label: "Anti-Thyroid", href: "/category/domestic/anti-thyroid" },
          { label: "Erectile Dysfunction", href: "/category/domestic/erectile-dysfunction" },
          { label: "Contraception Disorder", href: "/category/domestic/contraception-disorder" },
        ],
      },
      {
        label: "International",
        slug: "export",
        areas: [
          { label: "Anti-Allergies", href: "/category/export/anti-allergies" },
          { label: "Antibiotics", href: "/category/export/antibiotics" },
          { label: "Dermatologicals", href: "/category/export/dermatologicals" },
          { label: "Gastrointestinals", href: "/category/export/gastrointestinals" },
          { label: "Haematinics", href: "/category/export/haematinics" },
          { label: "Multivitamins", href: "/category/export/multivitamins" },
          { label: "NSAIDs", href: "/category/export/nsaids" },
          { label: "Respiratory", href: "/category/export/respiratory" },
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
      { label: "Media Center", href: "/media-center" },
      { label: "Certifications & Accreditations", href: "/certifications" },
      { label: "Product Dossiers", href: "/product-dossiers" },
    ],
  },
];
