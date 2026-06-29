import SafeHtml from "@/components/ui/SafeHtml";
import TableOfContents from "@/components/ui/TableOfContents";
import type { CodeOfConductSectionProps } from "./CodeOfConductSection.types";

export default function CodeOfConductSection({
  data: { title, subtitle, subTitle, mdMessage, overviewTitle, items },
  className = "",
}: CodeOfConductSectionProps) {
  const tocItems = items.map(({ id, title: t }) => ({ id, title: t }));

  return (
    <div className={className}>
      {/* Page header */}
      <div className="mb-10 border-b border-black/10 pb-8">
        <h1 className="font-heading text-h1 font-light leading-[1.1] text-primary">
          {title}
        </h1>
        <p className="mt-3 text-body text-secondary">{subtitle}</p>
        <p className="mt-2 text-body text-secondary mt-8">{subTitle}</p>
      </div>

      {/* Two-column layout — TableOfContents handles desktop sidebar + mobile pill internally */}
      <div className="flex gap-[clamp(2rem,_5vw,_5rem)]">
        <TableOfContents items={tocItems} className="w-[305px] shrink-0" />

        <div className="min-w-0 flex-1">
          <h2 className="mb-8 font-heading text-h2 font-light leading-[1.1] text-primary">
            {overviewTitle}
          </h2>

          <SafeHtml html={mdMessage} className="rich-text mb-12" />

          <div className="flex flex-col gap-10">
            {items.map((item) => (
              <section key={item.id} id={item.id} className="scroll-mt-24">
                <h3 className="mb-4 border-b border-black/10 pb-3 font-heading text-h3 font-light text-primary">
                  {item.title}
                </h3>
                <SafeHtml html={item.description} className="rich-text" />
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
