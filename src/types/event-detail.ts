export interface EventDetailOverviewItem {
  count: string;
  title: string;
}

export interface EventDetailOverviewSection {
  title: string;
  desc: string;
  items: EventDetailOverviewItem[];
}

export interface EventDetailImpressionItem {
  title: string;
  desc: string;
}

export interface EventDetailImpressionsSection {
  title: string;
  items: EventDetailImpressionItem[];
}

export interface EventDetailGallerySection {
  title: string;
  items: { image: string }[];
}

export interface EventDetailTakeawayItem {
  text: string;
}

export interface EventDetailTakeawaysSection {
  title: string;
  items: EventDetailTakeawayItem[];
}

export interface EventDetailTestimonialItem {
  image: string | null;
  name: string;
  designation: string;
  about: string;
}

export interface EventDetailTestimonialsSection {
  title: string;
  items: EventDetailTestimonialItem[];
}

export interface EventDetail {
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
  status: string;
  overview_section: EventDetailOverviewSection;
  impressions_section: EventDetailImpressionsSection;
  gallery_section: EventDetailGallerySection;
  takeaways_section: EventDetailTakeawaysSection;
  testimonials_section: EventDetailTestimonialsSection;
}
