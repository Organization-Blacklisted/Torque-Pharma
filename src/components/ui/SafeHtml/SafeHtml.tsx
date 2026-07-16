import { sanitizeRichText } from "@/lib/sanitize";

type SafeHtmlProps = {
  html: string;
  className?: string;
};

export default function SafeHtml({ html, className = "" }: SafeHtmlProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />;
}
