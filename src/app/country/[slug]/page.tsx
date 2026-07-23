import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountryPage } from "@/lib/api/country";
import { getCountryCategories } from "@/lib/api/country-categories";
import { countrySlugToIso } from "@/lib/country-iso";
import CountryTopSection from "@/components/sections/country/CountryTopSection";
import CountryEdgeSection from "@/components/sections/country/CountryEdgeSection";
import CountryFormSection from "@/components/sections/country/CountryFormSection";
import JsonLd from "@/components/ui/JsonLd";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";

export async function generateStaticParams() {
  const categories = await getCountryCategories();
  return categories.flatMap((cat) =>
    cat.countries.map((country) => ({ slug: country.slug }))
  );
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCountryPage(slug).catch(() => null);
  if (!page) return { title: "Country" };
  return {
    title: `${page.name}`,
    description: `Torque Pharma's pharmaceutical products and presence in ${page.name}.`,
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await getCountryPage(slug).catch(() => null);

  if (!page) notFound();

  return (
    <>
      <JsonLd data={page.schema} />
      <Section first>
        <CountryTopSection top={page.top} counter={page.counter} />
      </Section>

      <Section>
        <CountryEdgeSection {...page.edge} />
      </Section>

      <Section>
        <Container size="large">
          <CountryFormSection
            {...page.form}
            pageName={page.name}
            pageUrl={`/country/${slug}`}
            defaultCountry={countrySlugToIso(slug)}
          />
        </Container>
      </Section>
    </>
  );
}
