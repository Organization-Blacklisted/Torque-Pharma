"use client";

import type { PaginationProps } from "./Pagination.types";

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const page of sorted) {
    if (prev && page - prev > 1) result.push("ellipsis");
    result.push(page);
    prev = page;
  }
  return result;
}

const arrowButton =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-primary transition-colors duration-200 hover:bg-surface disabled:pointer-events-none disabled:opacity-30";

const pageButton =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-body text-body-sm transition-colors duration-200";

export default function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={`flex w-fit items-center gap-1 rounded-full bg-white p-1.5 shadow-sm ${className}`}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={arrowButton}
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
          <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="flex h-8 w-8 shrink-0 items-center justify-center text-body-sm text-secondary">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={`${pageButton} ${
              page === currentPage ? "bg-primary text-white" : "text-secondary hover:bg-surface"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={arrowButton}
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
          <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
