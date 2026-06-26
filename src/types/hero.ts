export interface HeroVideoData {
  eyebrow: {
    prefix: string;
    words: string[];
  };
  heading: string;
  cta: {
    label: string;
    href: string;
  };
  video: {
    sources: { src: string; type: "video/mp4" | "video/webm" | "video/ogg"; media?: string }[];
    poster?: string;
  };
}
