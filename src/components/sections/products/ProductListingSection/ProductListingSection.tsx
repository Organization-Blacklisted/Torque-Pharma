"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import Pagination from "@/components/ui/Pagination";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductListingSectionProps } from "./ProductListingSection.types";

const ALL_LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const PER_PAGE = 9;

// Read directly from window.location rather than Next's useSearchParams —
// this page is statically generated, and useSearchParams would force a
// Suspense boundary; a plain browser API read needs neither Suspense nor
// keeping this in step with Next's own router state.
//
// expectedPath guards against Next's own link prefetching: prefetching a
// sibling category renders this component in the background to warm the
// cache, while window.location still shows whatever page you're currently
// on — so a naive read would pick up THAT page's query string (e.g. a
// "?letter=M" filter) and bake it into the prefetched instance, which then
// appears already-filtered the moment the real navigation swaps it in.
// Only trust the query string when we can confirm it's actually ours.
function readQueryParams(expectedPath: string) {
  if (typeof window === "undefined" || window.location.pathname !== expectedPath) {
    return { search: "", activeLetter: "ALL", sortBy: "default" as const, page: 1 };
  }
  const params = new URLSearchParams(window.location.search);
  const sort = params.get("sort");
  return {
    search: params.get("q") ?? "",
    activeLetter: params.get("letter") ?? "ALL",
    sortBy: (sort === "az" || sort === "za" ? sort : "default") as "default" | "az" | "za",
    page: Number(params.get("page")) || 1,
  };
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="16"
      viewBox="0 0 12 16"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <g clipPath="url(#clip0_6571_5400)">
        <path
          d="M11.4432 3.94808L12.5032 5.00908L6.7262 10.7881C6.63364 10.8812 6.52356 10.9552 6.40231 11.0056C6.28106 11.0561 6.15103 11.082 6.0197 11.082C5.88838 11.082 5.75835 11.0561 5.6371 11.0056C5.51585 10.9552 5.40577 10.8812 5.3132 10.7881L-0.466797 5.00908L0.593203 3.94908L6.0182 9.37308L11.4432 3.94808Z"
          fill="#3F4255"
        />
      </g>
      <defs>
        <clipPath id="clip0_6571_5400">
          <rect width="12" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function ProductListingSection({
  products,
  siblings,
  parentSlug,
  currentSlug,
  className = "",
}: ProductListingSectionProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const expectedPath = `/category/${parentSlug}/${currentSlug}`;
  const [search, setSearch] = useState(() => readQueryParams(expectedPath).search);
  const [activeLetter, setActiveLetter] = useState(() => readQueryParams(expectedPath).activeLetter);
  const [sortBy, setSortBy] = useState<"default" | "az" | "za">(() => readQueryParams(expectedPath).sortBy);
  const [page, setPage] = useState(() => readQueryParams(expectedPath).page);

  // Keep the URL in sync with search/filter/page state (via replaceState,
  // not a navigation) so that navigating to a product and hitting the
  // browser back button restores this exact view — both the filters
  // above and the scroll position the browser naturally restores for it —
  // instead of always landing back on page 1 at the top.
  useEffect(() => {
    // Guard against a prefetched/backgrounded instance (see readQueryParams
    // above) writing this category's filters onto whatever page happens to
    // be visible right now, which won't be this one.
    if (window.location.pathname !== expectedPath) return;

    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (activeLetter !== "ALL") params.set("letter", activeLetter);
    if (sortBy !== "default") params.set("sort", sortBy);
    if (page !== 1) params.set("page", String(page));
    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(window.history.state, "", newUrl);
  }, [search, activeLetter, sortBy, page, expectedPath]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const letters = useMemo(() => {
    const used = new Set(products.map((p) => p.name[0]?.toUpperCase()).filter(Boolean));
    return ["ALL", ...ALL_LETTERS.filter((l) => used.has(l))];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeLetter !== "ALL") {
      list = list.filter((p) => p.name[0]?.toUpperCase() === activeLetter);
    } else if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (sortBy === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "za") list.sort((a, b) => b.name.localeCompare(a.name));

    return list;
  }, [products, activeLetter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleSearch(value: string) {
    setSearch(value);
    if (value) setActiveLetter("ALL");
    setPage(1);
  }

  function handleLetter(letter: string) {
    setActiveLetter(letter);
    if (letter !== "ALL") setSearch("");
    setPage(1);
  }

  function handleSort(value: "default" | "az" | "za") {
    setSortBy(value);
    setPage(1);
  }

  function handleCategoryChange(slug: string) {
    router.push(`/category/${parentSlug}/${slug}`);
    setDrawerOpen(false);
  }

  function scrollToSection() {
    if (sectionRef.current) {
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  // Scroll after the page number actually commits and the new grid has
  // rendered, rather than inline in the click handler (which measures the
  // DOM before React's batched re-render lands) — the prev/next arrows and
  // numbered buttons all funnel through the same setPage call, so this
  // fires identically for all of them instead of racing render timing.
  const prevPageRef = useRef(page);
  useEffect(() => {
    if (prevPageRef.current !== page) {
      scrollToSection();
      prevPageRef.current = page;
    }
  }, [page]);

  const sortSelect = (
    <div className="relative flex min-w-0 shrink items-center lg:shrink-0">
      <select
        value={sortBy}
        onChange={(e) => handleSort(e.target.value as "default" | "az" | "za")}
        aria-label="Sort products"
        className="w-full appearance-none truncate bg-transparent border-none pr-6 lg:pr-7 font-body text-sm lg:text-h5 font-normal leading-[26px] text-[#3F4255] focus:outline-none cursor-pointer"
      >
        <option value="default">Sort by: Popularity</option>
        <option value="az">Sort by: A–Z</option>
        <option value="za">Sort by: Z–A</option>
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 lg:h-5 lg:w-5"
      >
        <path d="M10 15L16 6H4L10 15Z" fill="#3F4255" />
      </svg>
    </div>
  );

  const azFilter = (
    <div className="flex overflow-x-auto border-b border-black/20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {letters.map((letter) => (
        <button
          key={letter}
          type="button"
          onClick={() => handleLetter(letter)}
          className={[
            "-mb-px shrink-0 cursor-pointer border-b-[3px] px-[calc(var(--spacing-gutter)/2)] pb-3 pt-1",
            "font-body text-body-sm font-normal uppercase transition-colors duration-200",
            activeLetter === letter
              ? "border-mint text-primary"
              : "border-transparent text-primary/60 hover:text-primary",
          ].join(" ")}
        >
          {letter}
        </button>
      ))}
    </div>
  );

  return (
    <div ref={sectionRef}>

      {/* ── Off-canvas drawer (mobile only) ─────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={[
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={[
          "fixed top-0 left-0 z-50 h-full w-[300px] bg-white shadow-2xl lg:hidden",
          "flex flex-col transition-transform duration-300 ease-in-out",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Product categories"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
          <h2 className="font-heading text-h3 font-light text-primary">
            Product Categories
          </h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close categories"
            className="flex items-center justify-center w-8 h-8 rounded-full text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Drawer category list */}
        <div className="flex-1 overflow-y-auto">
          {siblings.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleCategoryChange(s.slug)}
              className={[
                "w-full text-left px-6 py-4 font-body text-body leading-[26px] border-b border-primary/10 transition-colors duration-150 flex items-center justify-between",
                s.slug === currentSlug
                  ? "text-primary font-medium bg-mint/5"
                  : "text-secondary hover:text-primary hover:bg-primary/[0.03]",
              ].join(" ")}
            >
              <span>{s.name}</span>
              {s.slug === currentSlug && (
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
                  <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <Section className={className}>
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-10 lg:gap-16">

            {/* ── Left: Category sidebar (desktop only) ──────────── */}
            <aside className="hidden lg:block max-w-[360px]">
              <h2 className="font-heading text-h3 font-light text-primary mb-[var(--spacing-subsection)]">
                Product Categories
              </h2>

              <button
                type="button"
                onClick={() => setCategoryOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-[15px] bg-mint/15 rounded-[6px] p-[15px] font-body text-body font-medium text-[#3F4255] cursor-pointer"
              >
                <span>All Products</span>
                <ChevronDown className={`transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
              </button>

              {categoryOpen && (
                <div>
                  {siblings.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleCategoryChange(s.slug)}
                      className={[
                        "w-full text-left p-[15px] font-body text-body leading-[26px] border-b border-primary/10 transition-colors duration-150 cursor-pointer",
                        s.slug === currentSlug
                          ? "text-primary font-medium"
                          : "text-secondary hover:text-primary",
                      ].join(" ")}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </aside>

            {/* ── Right: Controls + grid ─────────────────────────── */}
            <div className="min-w-0">

              {/* ── Mobile controls (hidden on desktop) ────────────── */}
              <div className="lg:hidden space-y-4 mb-8">

                {/* Row 1: Categories button + Sort — one line; mobile sizes are
                    reduced so they fit side-by-side without forcing horizontal
                    page scroll (Sort also truncates as a last resort). */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-1.5 h-[42px] px-3 rounded-full border border-primary/15 bg-white/60 font-body text-sm font-normal text-[#3F4255] transition-colors hover:border-primary/30 shrink-0"
                  >
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
                      <path d="M1 1h16M4 7h10M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Categories
                  </button>
                  {sortSelect}
                </div>

                {/* Row 2: Search */}
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full h-[42px] border border-black/10 rounded-full px-5 font-body text-h5 font-normal leading-[26px] text-[#3F4255] placeholder:text-[#3F4255]/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                {/* Row 3: A–Z filter */}
                {azFilter}
              </div>

              {/* ── Desktop controls (hidden on mobile) ────────────── */}
              <div className="hidden lg:flex flex-col gap-6 mb-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-[515px]">
                    <input
                      type="search"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full h-[42px] border border-black/10 rounded-full px-5 font-body text-h5 font-normal leading-[26px] text-[#3F4255] placeholder:text-[#3F4255]/80 bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  {sortSelect}
                </div>
                {azFilter}
              </div>

              {/* Product grid */}
              {visible.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 lg:gap-y-10 mb-10">
                  {visible.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="font-body text-body text-secondary">No products found.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-2">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
