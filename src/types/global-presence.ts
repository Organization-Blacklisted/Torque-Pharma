import type { FaqData } from "./faq";

// ── Homepage snippet (used by HomeGlobalPresenceSection) ─────────────────────

export interface GlobalPresenceItem {
  image: string;
  title: string;
}

export interface GlobalPresenceData {
  eyebrow: string;
  heading: string;
  description: string;
  items: GlobalPresenceItem[];
}

// ── Full Global Presence page ─────────────────────────────────────────────────

// gp_top_section
export interface GpTopData {
  eyebrow: string;
  heading: string;
  subHeading: string;       // raw HTML — contains <span> and <strong>
  description: string;
  cta: { label: string; href: string };
}

// gp_certifications_section
export interface GpCertificationItem {
  image: string;
  title: string;
}
export interface GpCertificationsData {
  eyebrow: string;
  items: GpCertificationItem[];
}

// gp_presence_section
export interface GpCountry {
  flagImage: string | null;
  title: string;
  slug: string;
}
export interface GpRegion {
  title: string;
  slug: string;
  countries: GpCountry[];
}
export interface GpPresenceData {
  eyebrow: string;
  heading: string;
  description: string;
  cta: { label: string; href: string };
  regions: GpRegion[];
}

// gp_export_categories_section
export interface GpExportCategoryItem {
  image: string;
  title: string;
  href: string;
}
export interface GpExportCategoriesData {
  eyebrow: string;
  items: GpExportCategoryItem[];
}

// gp_export_credentials_section
export interface GpCredentialItem {
  image: string;
  title: string;
  description: string;
}
export interface GpExportCredentialsData {
  eyebrow: string;
  title: string;       // matches GpExportCredentialsSectionProps
  description: string;
  items: GpCredentialItem[];
}

// gp_export_capability_section
export interface GpCapabilityItem {
  image: string | null;
  title: string;            // may contain HTML e.g. "40 <span>Years</span>"
  subTitle: string;
  description: string;
}
export interface GpCapabilityGroup {
  items: GpCapabilityItem[];
}
export interface GpExportCapabilityData {
  eyebrow: string;
  heading: string;
  description: string;
  groups: GpCapabilityGroup[];
}

// gp_torque_model_section
export interface GpTorqueModelItem {
  image: string;
  title: string;
}
export interface GpTorqueModelData {
  eyebrow: string;
  heading: string;
  description: string;
  items: GpTorqueModelItem[];
}

// gp_form_section
export interface GpFormData {
  eyebrow: string;
  heading: string;
  image: string;
}

// ── Assembled page data passed to the page component ─────────────────────────
export interface GlobalPresencePageData {
  top: GpTopData;
  certifications: GpCertificationsData;
  presence: GpPresenceData;
  exportCategories: GpExportCategoriesData;
  credentials: GpExportCredentialsData;
  exportCapability: GpExportCapabilityData;
  torqueModel: GpTorqueModelData;
  form: GpFormData;
  faq: FaqData;
}
