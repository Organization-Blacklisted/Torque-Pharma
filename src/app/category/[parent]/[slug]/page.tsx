import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isNotFoundError } from "@/lib/api/fetcher";
import { getCategoryPage, getSiblingCategories, getAllCategoryRoutes } from "@/lib/api/product-category";
import ProductCategoryHero from "@/components/sections/products/ProductCategoryHero";
import MedicalDisclaimerSection from "@/components/sections/products/MedicalDisclaimerSection";
import ProductListingSection from "@/components/sections/products/ProductListingSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import FaqSection from "@/components/sections/shared/FaqSection";

// Derived from the API's own parent/child data (via getAllCategoryRoutes)
// rather than a hardcoded parent list — a new top-level category type
// (a third parent besides domestic/export) gets picked up automatically
// on the next build instead of silently missing pages.
export async function generateStaticParams() {
  return getAllCategoryRoutes();
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

  let page: Awaited<ReturnType<typeof getCategoryPage>>;
  let siblings: Awaited<ReturnType<typeof getSiblingCategories>>;
  try {
    [page, siblings] = await Promise.all([
      getCategoryPage(slug),
      getSiblingCategories(parent),
    ]);
  } catch (err) {
    // Only a genuine 404 from the API means the category doesn't exist.
    // Anything else (timeout, 5xx, network blip) is transient — surface
    // it as a real error instead of a misleading "page not found".
    if (isNotFoundError(err)) notFound();
    throw err;
  }

  return (
    <>
      <ProductCategoryHero name={page.name} bannerImage={page.bannerImage} />

      {page.medicalDisclaimer && (
        <MedicalDisclaimerSection disclaimer={page.medicalDisclaimer} />
      )}

      {/* key forces a full remount on category change — otherwise React
          reuses this instance across navigations to a sibling category
          (same page.tsx, only the param differs), and its search/letter/
          sort/page state — along with the URL query params it syncs to —
          would leak over from the previous category. */}
      <ProductListingSection
        key={`${parent}/${slug}`}
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

      {page.faq.items.length > 0 && <FaqSection {...page.faq} />}
    </>
  );
}
