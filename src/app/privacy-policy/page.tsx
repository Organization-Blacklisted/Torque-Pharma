import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/api/pages";
import SafeHtml from "@/components/ui/SafeHtml/SafeHtml";
import Container from "@/components/layouts/Container";
import JsonLd from "@/components/ui/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("privacy-policy").catch(() => null);
  if (!page) return { title: "Privacy Policy" };
  const { seo, title } = page;

  return {
    title: seo.title ?? title,
    description: seo.description ?? undefined,
    keywords: seo.keywords ?? undefined,
    robots: seo.index
      ? undefined
      : { index: false, follow: false },
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPage("privacy-policy").catch(() => null);
  if (!page || page.status !== "published") {
    notFound();
  }

  return (
    <div className="py-section-inner">
      <JsonLd data={page.seo.schema} />
      <Container size="wide">
        <h1 className="font-heading text-h1 font-light text-primary leading-[1.1] mb-10">
          {page.title}
        </h1>
        <SafeHtml html={page.description} className="rich-text rich-text--policy" />
      </Container>
    </div>
  );
}
