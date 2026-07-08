"use client";

import { useMemo } from "react";
import Accordion from "@/components/ui/Accordion";
import SafeHtml from "@/components/ui/SafeHtml";
import TableOfContents from "@/components/ui/TableOfContents";
import type { BlogPostBodyProps } from "./BlogPostBody.types";

export default function BlogPostBody({ post, className = "" }: BlogPostBodyProps) {
  const { content, tags, faq_section } = post;

  const tocItems = useMemo(
    () => content.map(({ id, title }) => ({ id, title })),
    [content]
  );

  return (
    <div className={`flex gap-[clamp(2rem,_5vw,_5rem)] ${className}`}>
      <TableOfContents
        items={tocItems}
        label="Blog at a Glance"
        className="w-[260px] shrink-0"
      />

      <div className="min-w-0 flex-1">
        {/* Content sections */}
        <div className="flex flex-col">
          {content.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 mt-12 first:mt-0"
            >
              <h2 className="mb-4 font-body text-[24px] font-medium leading-normal text-primary">
                {section.title}
              </h2>
              <SafeHtml html={section.description} className="rich-text rich-text--blog" />
            </section>
          ))}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex w-fit items-center rounded-full bg-mint px-3.5 py-1 text-h5 font-normal capitalize text-mint-dark"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* FAQ */}
        {faq_section && faq_section.items.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-2 font-body text-[24px] font-medium leading-normal text-primary">
              {faq_section.title}
            </h2>
            {faq_section.sub_title && (
              <p className="mb-2 text-body text-secondary">{faq_section.sub_title}</p>
            )}
            <Accordion
              items={faq_section.items.map((item) => ({
                title: item.title,
                content: item.desc,
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
