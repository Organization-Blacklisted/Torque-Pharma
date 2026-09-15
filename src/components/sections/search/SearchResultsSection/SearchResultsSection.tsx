"use client";

import { useEffect, useRef, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import ProductCard from "@/components/ui/ProductCard";
import Spinner from "@/components/ui/Spinner";
import type { ProductSearchResult } from "@/types/product-search";
import type { SearchBy, SearchResultsSectionProps } from "./SearchResultsSection.types";

// 12, not 9 — a multiple of the grid's 4 columns, so the last page's row
// never ends up with a single stray card sitting on its own.
const PER_PAGE = 12;

const SEARCH_BY_LABEL: Record<SearchBy, string> = {
  name: "Product Name",
  ingredient: "Ingredient",
};

function ChevronDown({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"
      className={`shrink-0 translate-y-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    >
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SearchResultsSection({
  initialQuery,
  initialBy,
  className = "",
}: SearchResultsSectionProps) {
  const [query, setQuery] = useState(initialQuery);
  const [searchBy, setSearchBy] = useState<SearchBy>(initialBy);
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [page, setPage] = useState(1);
  const [byDropdownOpen, setByDropdownOpen] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const byDropdownRef = useRef<HTMLDivElement>(null);

  // Debounced live search — same pattern as SearchOverlay. Cancels the
  // in-flight request if the query changes again before it resolves, so a
  // slow early response can't overwrite a later, faster one.
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products/search?${searchBy}=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal }
        );
        const json = await res.json();
        setResults(json.data ?? []);
        setStatus("done");
        setPage(1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setStatus("error");
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchBy]);

  // Keeps the URL in sync with query/searchBy/page — but only a bare page
  // change (the user clicked a pagination control, query/searchBy
  // untouched) gets its own history entry via pushState. Typing a new
  // query still uses replaceState, same as before, so every keystroke
  // doesn't flood the back-stack. Without this split, clicking "back" from
  // page 3 always landed back on page 1 — replaceState never leaves a
  // trail for the browser to step back *through*, it just keeps
  // overwriting the one entry this page already has.
  // Guarded to this route the same way ProductListingSection guards
  // itself: a prefetched instance of this page could in principle run
  // this effect while a different page is what's actually on screen.
  const prevSyncRef = useRef({ query, searchBy, page });
  // Set right before setPage() inside the popstate handler below, and
  // checked here so the resulting page-state update doesn't turn around
  // and pushState() a *new* entry describing the URL the browser just
  // navigated to on its own — without this, every "back" press was
  // immediately followed by a duplicate push, so the very next "back"
  // just landed on that duplicate instead of actually going further back.
  const isPopStateRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined" || window.location.pathname !== "/search") return;

    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      prevSyncRef.current = { query, searchBy, page };
      return;
    }

    const prev = prevSyncRef.current;
    const onlyPageChanged = prev.query === query && prev.searchBy === searchBy && prev.page !== page;
    prevSyncRef.current = { query, searchBy, page };

    const params = new URLSearchParams();
    if (query.trim()) params.set(searchBy, query.trim());
    if (page !== 1) params.set("page", String(page));
    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;

    if (onlyPageChanged) {
      window.history.pushState(window.history.state, "", newUrl);
    } else {
      window.history.replaceState(window.history.state, "", newUrl);
    }
  }, [query, searchBy, page]);

  // Pagination is a client-side slice of the already-fetched `results`
  // array, so restoring the page on back/forward is just a state update —
  // no re-fetch needed. This only has to resync `page`: a query/searchBy
  // change navigates via a real <Link> (View All) or full reload, which
  // remounts this component fresh with new initial props instead of
  // firing popstate.
  useEffect(() => {
    const onPopState = () => {
      isPopStateRef.current = true;
      const params = new URLSearchParams(window.location.search);
      setPage(Number(params.get("page")) || 1);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (byDropdownRef.current && !byDropdownRef.current.contains(e.target as Node)) {
        setByDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const visible = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Scroll back to the top of the results (not the whole page) on page
  // change, matching ProductListingSection's pagination behavior.
  const prevPageRef = useRef(page);
  useEffect(() => {
    if (prevPageRef.current !== page && sectionRef.current) {
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
      prevPageRef.current = page;
    }
  }, [page]);

  return (
    <div ref={sectionRef} className={className}>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-[515px] flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search by ${SEARCH_BY_LABEL[searchBy].toLowerCase()}`}
            aria-label="Search products"
            className="h-[42px] w-full rounded-full border border-black/10 bg-white/60 px-5 font-body text-h5 font-normal leading-[26px] text-[#3F4255] placeholder:text-[#3F4255]/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div ref={byDropdownRef} className="relative shrink-0">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={byDropdownOpen}
            onClick={() => setByDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 whitespace-nowrap font-body text-h5 font-normal leading-[26px] text-[#3F4255] outline-none"
          >
            Search by: <span className="font-medium text-primary">{SEARCH_BY_LABEL[searchBy]}</span>
            <ChevronDown isOpen={byDropdownOpen} />
          </button>

          <div
            className={[
              "absolute right-0 top-full z-10 mt-2 w-[180px] rounded-lg border border-black/[0.06] bg-white p-2 shadow-sm transition-all duration-150",
              byDropdownOpen
                ? "pointer-events-auto opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 -translate-y-1",
            ].join(" ")}
          >
            {(Object.keys(SEARCH_BY_LABEL) as SearchBy[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSearchBy(key);
                  setByDropdownOpen(false);
                }}
                className={[
                  "block w-full rounded-md px-3 py-2 text-left font-body text-body-sm transition-colors duration-150",
                  searchBy === key ? "bg-mint/10 font-medium text-primary" : "text-secondary hover:bg-gray-50",
                ].join(" ")}
              >
                {SEARCH_BY_LABEL[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!query.trim() && (
        <p className="py-20 text-center font-body text-body text-secondary">
          Type a product name or ingredient above to search.
        </p>
      )}

      {status === "loading" && (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {status === "error" && (
        <p className="py-20 text-center font-body text-body text-secondary">
          Something went wrong. Please try again.
        </p>
      )}

      {status === "done" && results.length === 0 && (
        <p className="py-20 text-center font-body text-body text-secondary">
          No products found for &ldquo;{query.trim()}&rdquo;.
        </p>
      )}

      {visible.length > 0 && (
        <div className="mb-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-10">
          {visible.map((product) => (
            <ProductCard key={product.slug} name={product.name} slug={product.slug} image={product.featured_image} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-2 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
