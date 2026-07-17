export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const quickLinksCol1: NavLink[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Leadership", href: "/leadership" },
  { label: "Life at Torque", href: "/life-at-torque" },
  { label: "Our Presence", href: "/our-presence" },
  { label: "History", href: "/our-history" },
  { label: "Careers", href: "/career" },
  { label: "Manufacturing Units", href: "/manufacturing-facility" },
];

export const quickLinksCol2: NavLink[] = [
  { label: "Distributor Connect", href: "https://directorque.com/login", external: true },
  { label: "Depot", href: "/depot" },
  { label: "Torque Online Stores", href: "https://www.torqueonline.co.in/", external: true },
  { label: "Torque HRMS", href: "https://torque.keka.com/", external: true },
  { label: "Torque SFA", href: "https://dashboard.fieldassist.io/home", external: true },
  { label: "Blogs", href: "/blogs" },
  { label: "News", href: "/news" },
];

export const subBrandsCol1: NavLink[] = [
  { label: "Torex", href: "https://www.torqueonline.co.in/products/torex-herbal-cough-syrup-ayurvedic-cough-relief-syrup-with-tulsi-and-honey-100ml", external: true },
  { label: "No Scars", href: "https://www.torqueonline.co.in/collections/no-scars", external: true },
  { label: "U-B Fair", href: "https://www.torqueonline.co.in/collections/all/products/u-b-fair-soap", external: true },
  { label: "Medisalic", href: "https://www.torqueonline.co.in/collections/medisalic", external: true },
  { label: "Ketomac", href: "https://www.torqueonline.co.in/collections/ketomac", external: true },
  { label: "Hemo Forte", href: "#" },
];

export const subBrandsCol2: NavLink[] = [
  { label: "JAL (Mineral Water)", href: "https://www.torqueonline.co.in/collections/jal-natural-mineral-water", external: true },
  { label: "Kesh 999", href: "https://www.torqueonline.co.in/collections/all/products/kesh-999-ayurvedic-hair-oil-anti-hair-fall-oil-hair-oil-with-24-natural-herbs-extract", external: true },
  { label: "Orthomac", href: "https://www.torqueonline.co.in/collections/all/products/orthomac-oil", external: true },
  { label: "Power Play", href: "#" },
  { label: "Torque Ayurveda", href: "https://www.torqueonline.co.in/collections/ayurveda", external: true },
  { label: "Torque’s Kvach", href: "https://www.torqueonline.co.in/products/torque-kvach-anti-lice-cream-wash-removes-lice-and-nits-made-with-reetha-shikakai-30-ml", external: true },
];
