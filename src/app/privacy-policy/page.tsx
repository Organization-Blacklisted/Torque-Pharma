import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/api/pages";
import SafeHtml from "@/components/ui/SafeHtml/SafeHtml";
import Container from "@/components/layouts/Container";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("privacy-policy");
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
  const page = await getPage("privacy-policy");
  if (page.status !== "published") {
    notFound();
  }

  return (
    <main className="py-section-inner">
      <Container size="wide">
        <h1 className="font-heading text-h1 font-light text-primary leading-[1.1] mb-10">
          {page.title}
        </h1>
        <SafeHtml html={page.description} className="rich-text rich-text--policy" />
      </Container>
    </main>
  );
}
