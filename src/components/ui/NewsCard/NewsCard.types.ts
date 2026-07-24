export interface NewsCardProps {
  slug: string;
  title: string;
  tag_image: string | null;
  tag_text: string | null;
  tag_link: string | null;
  featured_image: string | null;
  news_date: string;
  className?: string;
}
