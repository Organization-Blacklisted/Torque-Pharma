export type NavChild = { label: string; href: string };
export type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; href?: undefined; children: NavChild[] };

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
  { label: "Products", href: "/products" },
  {
    label: "Capabilities",
    children: [
      { label: "White Label Manufacturing", href: "/white-label-manufacturing" },
    ],
  },
  {
    label: "Life at Torque",
    children: [
      { label: "Career", href: "/life-at-torque/career" },
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
