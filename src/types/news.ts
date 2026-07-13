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
