import { sanitize } from "@/lib/sanitize";

type SafeHtmlProps = {
  html: string;
  className?: string;
};

export default function SafeHtml({ html, className = "" }: SafeHtmlProps) {
  const clean = sanitize(html).replace(/<img(?![^>]*\bloading=)/gi, '<img loading="lazy"');
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
