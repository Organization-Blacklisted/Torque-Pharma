export interface AboutUsOverviewData {
  heading: string;
  description: string;
  video: string;
}

// contentMedia and stats are now API-driven — see lib/api/about.ts AboutUsApiData.
// This type covers only what's still mock-driven.
export interface AboutUsPageData {
  overview: AboutUsOverviewData;
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    button: { label: string; href: string };
  };
}
