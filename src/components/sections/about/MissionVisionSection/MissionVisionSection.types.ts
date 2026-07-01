export interface MissionVisionItem {
  image: string;
  title: string;
  desc: string;
}

export interface MissionVisionSectionProps {
  items: MissionVisionItem[];
  className?: string;
}
