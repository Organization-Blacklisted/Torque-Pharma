import type { VideoSource } from "@/components/ui/VideoBackground/VideoBackground";

export type ContentMediaLayout = "centered" | "split-left" | "split-right";

export interface ContentMediaAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "outline-dark" | "ghost";
}

export interface ContentMediaData {
  eyebrow?: string;
  heading: string;
  description?: string;
  layout: ContentMediaLayout;
  media:
    | { type: "image"; src: string; alt: string; fit?: "cover" | "contain" }
    | { type: "video"; sources: VideoSource[]; poster?: string }
    | { type: "rotating"; src: string; alt: string; speed?: number };
  actions?: ContentMediaAction[];
}
