"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import Pagination from "@/components/ui/Pagination";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductListingSectionProps } from "./ProductListingSection.types";

const LETTERS = ["ALL", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];
const PER_PAGE = 9;

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
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"default" | "az" | "za">("default");
  const [page, setPage] = useState(1);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

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

  const sortSelect = (
    <div className="relative shrink-0 flex items-center">
      <select
        value={sortBy}
        onChange={(e) => handleSort(e.target.value as "default" | "az" | "za")}
        aria-label="Sort products"
        className="appearance-none bg-transparent border-none pr-7 font-body text-h5 font-normal leading-[26px] text-[#3F4255] focus:outline-none cursor-pointer"
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
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 shrink-0"
      >
        <path d="M10 15L16 6H4L10 15Z" fill="#3F4255" />
      </svg>
    </div>
  );

  const azFilter = (
    <div className="flex overflow-x-auto border-b border-black/20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {LETTERS.map((letter) => (
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
                className="w-full flex items-center justify-between gap-[15px] bg-mint/15 rounded-[6px] p-[15px] font-body text-body font-medium text-[#3F4255]"
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
                        "w-full text-left p-[15px] font-body text-body leading-[26px] border-b border-primary/10 transition-colors duration-150",
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
            <div>

              {/* ── Mobile controls (hidden on desktop) ────────────── */}
              <div className="lg:hidden space-y-4 mb-8">

                {/* Row 1: Categories button + Sort */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-2 h-[42px] px-4 rounded-full border border-primary/15 bg-white/60 font-body text-h5 font-normal text-[#3F4255] transition-colors hover:border-primary/30"
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
                    onPageChange={(p) => {
                      setPage(p);
                      scrollToSection();
                    }}
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
