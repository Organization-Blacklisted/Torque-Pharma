export interface Event {
  id: number;
  title: string;
  slug: string;
  sub_title: string;
  desc_text: string;
  event_date: string;
  created_by: string;
  tag: string | null;
  featured_image: string;
  is_featured: boolean;
}
