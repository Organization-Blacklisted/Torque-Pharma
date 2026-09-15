import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SearchResultsSection from "@/components/sections/search/SearchResultsSection";
import type { SearchBy } from "@/components/sections/search/SearchResultsSection";

type SearchPageParams = {
  name?: string;
  ingredient?: string;
};

function resolveQuery(params: SearchPageParams): { query: string; by: SearchBy } {
  if (params.ingredient) return { query: params.ingredient, by: "ingredient" };
  return { query: params.name ?? "", by: "name" };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchPageParams>;
}): Promise<Metadata> {
  const { query } = resolveQuery(await searchParams);
  return {
    title: query ? `Search results for "${query}"` : "Search Products",
    description: "Search Torque Pharma's full product range by name or active ingredient.",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchPageParams>;
}) {
  const { query, by } = resolveQuery(await searchParams);

  return (
    <>
      <Section first spacing="none" className="mt-[var(--spacing-page-top)] pb-0">
        <Container size="wide" className="mb-[var(--spacing-subsection)] text-center">
          <h1 className="font-heading text-h1 font-light text-primary">
            Browse Our Complete Product Range
          </h1>
        </Container>
      </Section>

      {/* spacing="none" — default Section spacing adds my-[var(--spacing-section)]
          (100-200px), which read as a large dead gap under the heading;
          the heading's own mb-[var(--spacing-subsection)] above already
          provides enough separation. */}
      <Section spacing="none" className="pb-[var(--spacing-section)]">
        <Container size="wide">
          {/* key forces a full remount whenever the URL's query changes —
              e.g. clicking "View All" in the header search for a new term
              while already on this page. Without it, React reuses this
              same instance (same route, only the search params differ),
              and its query/searchBy state — seeded from initialQuery/
              initialBy only on first mount — keeps showing the old
              search instead of picking up the new one. */}
          <SearchResultsSection key={`${by}:${query}`} initialQuery={query} initialBy={by} />
        </Container>
      </Section>
    </>
  );
}
