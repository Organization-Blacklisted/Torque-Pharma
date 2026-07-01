export interface AlternatingItem {
  image: string;
  title: string;
  desc: string;
}

export interface AlternatingItemsListProps {
  items: AlternatingItem[];
  headingSize?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  headingFont?: "heading" | "body";
  headingClassName?: string;
  className?: string;
}
