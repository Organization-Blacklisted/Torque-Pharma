export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string;        // HTML — strip for card previews, SafeHtml for detail page
  publish_date: string;       // "YYYY-MM-DD"
  status: "published" | "draft";
  medically_reviewed_by: string | null;
  featured_image: string;     // absolute URL from API
  is_featured: boolean;
  author: string;
  url: string | null;
  category: BlogCategory;
  tags: BlogTag[];
}

export interface BlogListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
  meta?: BlogListMeta;
}

export interface HomeBlogPreviewItem {
  id: number;
  title: string;
  image: string | null;
  slug: string;
  category_name: string | null;
  link: string;
}

export interface HomeBlogsPreviewData {
  title: string;      // "OUR Blogs" — used as eyebrow in SectionHeader
  sub_title: string;  // "Insights for Lasting Wellness" — used as heading
  view_text: string;
  view_link: string;  // relative slug e.g. "blogs" — prepend "/" when linking
  blogs: HomeBlogPreviewItem[];
}
