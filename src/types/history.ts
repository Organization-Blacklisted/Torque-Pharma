export interface HistTopData {
  eyebrow: string;
  heading: string;
  description: string;
  image: string;
}

export interface HistJourneyEntry {
  bg_image: string;
  image: string;
  desc: string;
}

export interface HistJourneyDate {
  date: string;
  entries: HistJourneyEntry[];
}

export interface HistJourneyItem {
  title: string;
  sub_title: string;
  dates: HistJourneyDate[];
}

export interface HistJourneySectionData {
  title: string;
  sub_title: string;
  items: HistJourneyItem[];
}

export interface HistoryPageData {
  top: HistTopData;
  journeyLabel: string;
  journey: HistJourneySectionData;
}
