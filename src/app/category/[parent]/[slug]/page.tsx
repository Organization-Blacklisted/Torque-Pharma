import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryPage, getSiblingCategories } from "@/lib/api/product-category";
import ProductCategoryHero from "@/components/sections/products/ProductCategoryHero";
import MedicalDisclaimerSection from "@/components/sections/products/MedicalDisclaimerSection";
import ProductListingSection from "@/components/sections/products/ProductListingSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import FaqSection from "@/components/sections/shared/FaqSection";

const PARENT_SLUGS = ["domestic", "export"] as const;

export async function generateStaticParams() {
  const results = await Promise.all(
    PARENT_SLUGS.map(async (parent) => {
      const siblings = await getSiblingCategories(parent);
      return siblings.map((s) => ({ parent, slug: s.slug }));
    })
  );
  return results.flat();
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ parent: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await getCategoryPage(slug);
    return {
      title: page.seo.title ?? page.name,
      description: page.seo.description ?? undefined,
      robots: { index: page.seo.index, follow: true },
    };
  } catch {
    return { title: "Products" };
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ parent: string; slug: string }>;
}) {
  const { parent, slug } = await params;

  try {
    const [page, siblings] = await Promise.all([
      getCategoryPage(slug),
      getSiblingCategories(parent),
    ]);

    return (
      <>
        <ProductCategoryHero name={page.name} image={page.image} />

        {page.medicalDisclaimer && (
          <MedicalDisclaimerSection disclaimer={page.medicalDisclaimer} />
        )}

        <ProductListingSection
          products={page.products}
          siblings={siblings}
          parentSlug={parent}
          currentSlug={slug}
        />

        <CtaSection
          eyebrow="Global Horizons"
          title="Your Efforts Extended Through a Partnership That's Better Together"
          button={{ label: "Become a Partner", href: "/contact-us" }}
        />

        {page.faq.items.length > 0 && (
          <FaqSection
            eyebrow={page.faq.eyebrow}
            title={page.faq.title}
            description={page.faq.description}
            items={page.faq.items}
          />
        )}
      </>
    );
  } catch {
    notFound();
  }
}
