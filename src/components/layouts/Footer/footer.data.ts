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
  { label: "News & Updates", href: "/news-updates" },
];

export const subBrandsCol1: NavLink[] = [
  { label: "Torex", href: "#" },
  { label: "No Scars", href: "#" },
  { label: "U-B Fair", href: "#" },
  { label: "Medisalic", href: "#" },
  { label: "Ketomac", href: "#" },
  { label: "Hemo Forte", href: "#" },
];

export const subBrandsCol2: NavLink[] = [
  { label: "JAL (Mineral Water)", href: "#" },
  { label: "Kesh 999", href: "#" },
  { label: "Torque Refresh", href: "#" },
  { label: "Torque Ayurveda", href: "#" },
  { label: "Torque Kvach", href: "#" },
];
