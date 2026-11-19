import type { VideoSource } from "@/components/ui/VideoBackground/VideoBackground";

export type ContentMediaLayout = "centered" | "split-left" | "split-right";

export interface ContentMediaAction {
  label: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "secondary" | "outline" | "outline-dark" | "ghost";
}

export interface ContentMediaData {
  eyebrow?: string;
  heading: string;
  description?: string;
  /** Rendered below the description with a left rule + italic style, for a caveat/disclaimer aside. */
  note?: string;
  layout: ContentMediaLayout;
  media:
    | { type: "image"; src: string; alt: string; fit?: "cover" | "contain" }
    | { type: "video"; sources: VideoSource[]; poster?: string }
    | { type: "rotating"; src: string; alt: string; speed?: number };
  actions?: ContentMediaAction[];
}
