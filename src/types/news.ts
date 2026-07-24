export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  sub_title: string | null;
  featured_image: string | null;
  button_text: string | null;
  tag_image: string | null;
  tag_text: string | null;
  tag_link: string | null;
  news_date: string;
  is_featured: boolean;
  is_editors_pick: boolean;
  status: string;
  category: NewsCategory | null;
}

export interface NewsContentBlockImage {
  id: number;
  url: string;
}

export interface NewsContentBlock {
  id: string;               // slugified from title, used as the TOC anchor
  title: string;
  description: string | null; // sanitized HTML
  images: NewsContentBlockImage[];
}

export interface NewsDetail extends NewsItem {
  short_description: string | null;
  description: string;      // sanitized HTML — the intro copy
  content_blocks: NewsContentBlock[];
}
