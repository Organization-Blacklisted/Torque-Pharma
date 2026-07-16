import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getCountryCategories } from "@/lib/api/country-categories";
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
  const categories = await getCountryCategories();
  const country = categories.flatMap((c) => c.countries).find((c) => c.slug === slug);
  if (!country) return { title: "Country | Torque Pharma" };
  return {
    title: `${country.name} | Torque Pharma`,
    description: `Torque Pharma's pharmaceutical products and presence in ${country.name}.`,
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getCountryCategories();
  const country = categories.flatMap((c) => c.countries).find((c) => c.slug === slug);
  if (!country) notFound();

  return (
    <Section first>
      <Container size="reading">
        <div className="flex flex-col items-center gap-6 text-center">
          {country.flagImage && (
            <div className="relative h-24 w-24 overflow-hidden rounded-full">
              <Image
                src={country.flagImage}
                alt={country.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
          <h1 className="font-heading text-h1 text-primary">{country.name}</h1>
        </div>
      </Container>
    </Section>
  );
}
