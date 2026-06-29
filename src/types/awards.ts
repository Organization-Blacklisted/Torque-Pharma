export interface AwardItem {
  image: string;
  title: string;
  desc: string;
  tag: string | null;
}

export type AwardsSectionVariant = "certification" | "accreditation";

export interface AwardsSection {
  section_title: string;
  variant: AwardsSectionVariant;
  items: AwardItem[];
}

export interface AwardsPageData {
  title: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  sections: AwardsSection[];
}
