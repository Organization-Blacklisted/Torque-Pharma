export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const quickLinksCol1: NavLink[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Board of Directors", href: "/board-of-directors" },
  { label: "Life at Torque", href: "/life-at-torque" },
  { label: "Global Presence", href: "/global-presence" },
  { label: "History", href: "/our-history" },
  { label: "Careers", href: "/career" },
  { label: "Manufacturing Units", href: "/manufacturing-facility" },
];

export const quickLinksCol2: NavLink[] = [
  { label: "Become a Dealer", href: "/become-a-dealer" },
  { label: "Torque Online Stores", href: "https://www.torqueonline.co.in/", external: true },
  { label: "Torque HRMS", href: "https://torque.keka.com/", external: true },
  { label: "Torque SFA", href: "https://dashboard.fieldassist.io/home", external: true },
  { label: "Blogs", href: "/blogs" },
];

export const subBrandsCol1: NavLink[] = [
  { label: "Torex", href: "https://torex.co.in/", external: true },
  { label: "No Scars", href: "http://noscars.in/", external: true },
  { label: "U-B Fair", href: "https://www.ubfair.com/", external: true },
];

export const subBrandsCol2: NavLink[] = [
  { label: "JAL (Mineral Water)", href: "https://www.torquesjal.com/", external: true },
  { label: "Medisalic", href: "https://www.medisalic.com/", external: true },
  { label: "Ketomac", href: "https://ketomac.co.in/", external: true },
];
