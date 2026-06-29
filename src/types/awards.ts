export interface AwardItem {
  image: string;
  title: string;
  desc: string;
  tag: string | null;
}

export interface AwardsSection {
  section_title: string;
  items: AwardItem[];
}

export interface AwardsPageData {
  title: string;
  description: string;
  sections: AwardsSection[];
}
