"use client";

import DOMPurify from "dompurify";

type SafeHtmlProps = {
  html: string;
  className?: string;
};

const sanitize = (html: string) => {
  if (typeof window === "undefined") return html;
  const clean = DOMPurify.sanitize(html);
  // Inject loading="lazy" on any <img> that doesn't already have it
  return clean.replace(/<img(?![^>]*\bloading=)/gi, '<img loading="lazy"');
};

export default function SafeHtml({ html, className = "" }: SafeHtmlProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  );
}
