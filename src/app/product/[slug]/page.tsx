import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api/product";
import ProductDetailSection from "@/components/sections/products/ProductDetailSection";
import CtaSection from "@/components/sections/shared/CtaSection";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    return {
      title: product.seo.title ?? `${product.name} | Torque Pharma`,
      description: product.seo.description ?? product.description,
      ...(product.seo.keywords ? { keywords: product.seo.keywords } : {}),
      robots: product.seo.index
        ? { index: true, follow: true }
        : { index: false, follow: false },
    };
  } catch {
    return { title: "Product | Torque Pharma" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProduct(slug).catch(() => null);
  if (!product) notFound();

  return (
    <>
      <ProductDetailSection
        name={product.name}
        description={product.description}
        featuredImage={product.featuredImage}
        gallery={product.gallery}
        content={product.content}
      />
      <CtaSection
        eyebrow="GLOBAL HORIZONS"
        title="Your Efforts Extended Through a Partnership That's Better Together"
        button={{ label: "Become a Dealer", href: "/become-a-dealer" }}
      />
    </>
  );
}
