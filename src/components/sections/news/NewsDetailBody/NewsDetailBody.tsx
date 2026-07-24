import Image from "next/image";
import TableOfContents from "@/components/ui/TableOfContents";
import type { NewsDetailBodyProps } from "./NewsDetailBody.types";

export default function NewsDetailBody({ news, className = "" }: NewsDetailBodyProps) {
  const { description, content_blocks } = news;

  const tocItems = [
    { id: "introduction", title: "Introduction" },
    ...content_blocks.map(({ id, title }) => ({ id, title })),
  ];

  return (
    <div className={`flex gap-[clamp(2rem,_5vw,_5rem)] ${className}`}>
      <TableOfContents items={tocItems} label="News at a Glance" className="w-[260px] shrink-0" />

      <div className="min-w-0 flex-1">
        <section id="introduction" className="scroll-mt-24">
          {/* description is pre-sanitized in the API transform (sanitizeRichText) */}
          <div className="rich-text rich-text--blog" dangerouslySetInnerHTML={{ __html: description }} />
        </section>

        {content_blocks.map((block) => (
          <section key={block.id} id={block.id} className="scroll-mt-24 mt-12">
            <h2 className="mb-4 font-body text-[24px] font-medium leading-normal text-primary">
              {block.title}
            </h2>

            {block.description && (
              <div
                className="rich-text rich-text--blog"
                dangerouslySetInnerHTML={{ __html: block.description }}
              />
            )}

            {block.images.length > 0 && (
              <div
                className={`mt-6 grid gap-4 ${
                  block.images.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {block.images.map((image) => (
                  <div key={image.id} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface">
                    <Image
                      src={image.url}
                      alt={block.title}
                      fill
                      sizes={block.images.length > 1 ? "(max-width: 640px) 100vw, 50vw" : "100vw"}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
