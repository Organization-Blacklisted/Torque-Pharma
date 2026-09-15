"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SplitButton } from "@/components/ui/SplitButton";
import type { ProductSearchResult } from "@/types/product-search";
import type { SearchOverlayProps } from "./SearchOverlay.types";

type SearchBy = "name" | "ingredient";

const SEARCH_BY_LABEL: Record<SearchBy, string> = {
  name: "Product Name",
  ingredient: "Ingredient",
};

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

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

// Same chevron path/weight as ui/Pagination, for visual consistency with
// the rest of the site's prev/next controls.
function SlideArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
      <path
        d={direction === "prev" ? "M6 1L1 6L6 11" : "M1 1L6 6L1 11"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Matches the Figma spec exactly on desktop: a fixed 198×198 #F3F3F3 tile
// (not the site-wide ProductCard, which uses a different aspect/padding
// treatment for category-page grids) — the 140×140 image sits inset by
// 29px on every side, and 4 of these plus 3×16px gaps fill the 840px
// results row exactly. On mobile the card is sized to exactly half the
// row's width (minus half the gap) instead of a fixed 198px, so precisely
// 2 cards fill the screen with no partial third one peeking at the edge —
// aspect-square + a proportional (not fixed-px) image inset keeps the
// tile's own proportions identical at either size.
function SearchResultCard({
  product,
  onNavigate,
}: {
  product: ProductSearchResult;
  onNavigate: () => void;
}) {
  return (
    // min-w-0 overrides the flex item's default min-width:auto — without
    // it, a long product name's min-content width can force this card
    // wider than its intended fixed/calc width instead of wrapping inside
    // it, which is what was pushing text past the card into the next one.
    <Link href={`/${product.slug}`} onClick={onNavigate} className="w-[calc((100%-16px)/2)] min-w-0 shrink-0 sm:w-[198px]">
      <div className="relative aspect-square w-full overflow-hidden rounded-[4px] bg-[#F3F3F3]">
        {product.featured_image && (
          <Image
            src={product.featured_image}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 198px, 45vw"
            loading="lazy"
            draggable={false}
            className="object-contain p-[14.65%]"
          />
        )}
      </div>
      <p className="mt-2.5 h-12 w-full line-clamp-2 text-center font-body text-[16px] leading-6 text-primary">
        {product.name}
      </p>
    </Link>
  );
}

export default function SearchOverlay({ isOpen, onClose, className = "" }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState<SearchBy>("name");
  const [byDropdownOpen, setByDropdownOpen] = useState(false);
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const inputRef = useRef<HTMLInputElement>(null);
  const byDropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const resultsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Reset on open/close so a stale query doesn't flash in on reopen.
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setStatus("idle");
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Locks background scroll while open — same pattern as the mobile
  // drawer in Header.tsx. Most useful on mobile, where the panel sits
  // right over the page content, but applied regardless of viewport for
  // consistency with that existing lock.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // No backdrop (matches the Products mega menu, which just closes on
  // mouse-leave with no dimming) — so closing on an outside click has to be
  // done by hand instead. The trigger button lives in a separate component
  // (Header), so it's excluded via a data attribute rather than a shared
  // ref — it already toggles isOpen itself on click, and without this
  // exclusion that click would also register as "outside" and close the
  // panel a tick before the toggle re-opened it.
  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (target.closest("[data-search-trigger]")) return;
      onClose();
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen, onClose]);

  // Debounced live search — cancels the in-flight request if the query
  // changes again before it resolves, so a slow early response can't
  // overwrite the results of a later, faster one.
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
      } catch (err) {
        if ((err as Error).name !== "AbortError") setStatus("error");
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchBy]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (byDropdownRef.current && !byDropdownRef.current.contains(e.target as Node)) {
        setByDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Tracks scroll position for the slide arrows' disabled state, and jumps
  // back to the start on every new result set — otherwise a scrolled-right
  // position from a previous, longer search would carry over onto a new
  // one that reuses the same scroll container.
  useEffect(() => {
    const el = resultsScrollRef.current;
    if (!el) return;
    el.scrollLeft = 0;

    const update = () => {
      setCanScrollPrev(el.scrollLeft > 4);
      setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [results]);

  // Scrolls by however many whole cards fit in the visible width, not a
  // flat clientWidth px value — clientWidth is rarely an exact multiple of
  // (card width + gap), so scrolling by it lands mid-card, showing a
  // sliver of a 5th card and clipping the one before it (the symptom
  // reported: a product name cut off, and a thin cut-off card peeking
  // behind the prev arrow). Measuring the real gap between two rendered
  // cards — rather than assuming a fixed px width — keeps this correct at
  // both the fixed 198px desktop size and the responsive mobile size.
  // Uses an absolute, clamped scrollTo target computed fresh from the
  // current position — not scrollBy, which (at least in Chrome) extends an
  // already-running smooth scroll's target rather than replacing it, so a
  // second click before the first animation finishes would otherwise
  // compound into an even bigger jump.
  function scrollSlide(direction: "prev" | "next") {
    const el = resultsScrollRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    if (cards.length < 2) return;
    const cardStep = cards[1].offsetLeft - cards[0].offsetLeft;
    const visibleCount = Math.max(1, Math.floor(el.clientWidth / cardStep));
    const page = visibleCount * cardStep;
    const max = el.scrollWidth - el.clientWidth;
    const target = direction === "next" ? Math.min(el.scrollLeft + page, max) : Math.max(el.scrollLeft - page, 0);
    el.scrollTo({ left: target, behavior: "smooth" });
  }

  // overflow-x-auto alone only responds to wheel/trackpad/touch — a mouse
  // has no native click-and-drag scroll, so it's wired up by hand here.
  // Listens on window (not the row) while dragging so a fast drag that
  // briefly leaves the row's bounds doesn't drop the gesture. draggedRef
  // also doubles as a click-suppressor: without it, releasing the mouse
  // after a drag lands on a product card and fires its Link navigation.
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const draggedRef = useRef(false);

  function onSlideMouseDown(e: React.MouseEvent) {
    const el = resultsScrollRef.current;
    if (!el) return;
    // Stops the browser's native image/text drag-ghost from hijacking the
    // gesture partway through — without it, a drag starting on a product
    // image only scrolls a few px before the native drag takes over.
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartXRef.current = e.pageX;
    dragStartScrollRef.current = el.scrollLeft;

    const onMove = (ev: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = ev.pageX - dragStartXRef.current;
      if (Math.abs(dx) > 3) draggedRef.current = true;
      el.scrollLeft = dragStartScrollRef.current - dx;
    };
    const onUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function onSlideClickCapture(e: React.MouseEvent) {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  }

  // Enter jumps straight to the full /search results page — same
  // destination as "View All" — rather than only being reachable once a
  // result set is long enough to show that button.
  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || !query.trim()) return;
    router.push(`/search?${searchBy}=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      {/* Positioned the same way the fixed header lays out its own content
          (mx-auto max-w-[1764px] + Container "wide") so this panel's right
          edge lines up with the header's right edge (the search icon /
          Contact Us) — a plain `fixed`+`absolute` combo can't anchor to the
          button directly here because the header itself carries a
          `transform` (its show/hide-on-scroll animation), which makes it
          the containing block for any fixed-position descendant. */}
      <div
        className={[
          "fixed inset-x-0 top-[92px] z-[70] px-4 py-3 md:px-6 lg:px-subsection transition-all duration-200",
          isOpen ? "opacity-100 translate-y-0 pointer-events-none" : "opacity-0 -translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        <div className="mx-auto max-w-[1764px]">
          {/* Container "wide" would add its own px-4/md:px-4/lg:px-10/
              xl:px-16 padding on top of the fixed wrapper's own matching
              header padding above — below the nav: breakpoint that's an
              extra, unwanted inset that made this panel narrower than the
              header bar itself. Reproduce that padding only from nav:
              upward (skipping the smaller px-4/md:px-4 steps, since nav:
              1200px already exceeds them), so mobile/tablet bleeds flush
              with the bar and only true desktop keeps Container's padding
              (needed there to line the panel's right edge up with the
              search icon/Contact Us, matching Figma). */}
          <div className="nav:px-10 xl:px-16">
            <div className="flex justify-end">
              <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Search products"
                // 888px, not a rounder 880 — panel(888) - p-6 padding(24px
                // ×2) = 840px for the results row, exactly 4×198px cards +
                // 3×16px gaps with nothing left over, so all 4 fit flush
                // instead of the row being 8px too narrow for a clean 4-up.
                className={["w-[min(888px,100%)]", isOpen ? "pointer-events-auto" : "", className].join(" ")}
              >
                <div className="rounded-lg border border-black/[0.06] bg-white p-5 shadow-xl sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-4">
                    {/* w-full (not flex-1) at mobile — the parent row is
                        flex-col here, so flex-1's flex-basis:0% runs along
                        the vertical main axis and silently overrides the
                        explicit h-[52px]/h-[42px] below. flex-1 only takes
                        over at sm:+ once the parent switches to flex-row,
                        where the main axis is horizontal instead. */}
                    {/* order-2 on mobile puts this below the "Search by"
                        dropdown (client asked for the filter on top there)
                        — reset to order-1 at sm:+ to keep the input first
                        (left) on desktop, matching Figma. */}
                    <div className="order-2 flex h-[52px] w-full items-center gap-3 rounded-full border border-black/20 px-5 sm:order-1 sm:h-[42px] sm:w-auto sm:flex-1 sm:px-4">
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onInputKeyDown}
                        placeholder={`Search by ${SEARCH_BY_LABEL[searchBy].toLowerCase()}…`}
                        aria-label="Search products"
                        className="min-w-0 flex-1 bg-transparent font-body text-h5 font-normal leading-[26px] text-[#3F4255] outline-none placeholder:text-[#3F4255]/60"
                      />
                      {query && (
                        <button
                          type="button"
                          aria-label="Clear search"
                          onClick={() => setQuery("")}
                          className="shrink-0 text-[#3F4255]/70 transition-colors duration-150 hover:text-primary"
                        >
                          <ClearIcon />
                        </button>
                      )}
                    </div>

                    <div ref={byDropdownRef} className="order-1 relative shrink-0 sm:order-2">
                      <button
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={byDropdownOpen}
                        onClick={() => setByDropdownOpen((v) => !v)}
                        className="flex items-center gap-[11px] whitespace-nowrap font-body text-h5 font-normal leading-[26px] text-[#3F4255] outline-none"
                      >
                        Search by: {SEARCH_BY_LABEL[searchBy]}
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

                  {query.trim() && (
                    <div className="mt-8">
                      <p className="mb-4 font-body text-h5 font-medium capitalize text-primary">Search results:</p>

                      {status === "loading" && (
                        <p className="font-body text-body-sm text-secondary">Searching…</p>
                      )}

                      {status === "error" && (
                        <p className="font-body text-body-sm text-secondary">
                          Something went wrong. Please try again.
                        </p>
                      )}

                      {status === "done" && results.length === 0 && (
                        <p className="font-body text-body-sm text-secondary">
                          No products found for &ldquo;{query.trim()}&rdquo;.
                        </p>
                      )}

                      {/* Figma only specs up to 4 results in a single static
                          row. Past 4 it becomes a horizontal slider instead,
                          with a "View All" button below — client-requested. */}
                      {results.length > 0 && (
                        <>
                          <div className="relative">
                            {results.length > 4 && canScrollPrev && (
                              <button
                                type="button"
                                aria-label="Previous products"
                                onClick={() => scrollSlide("prev")}
                                className="absolute left-0 top-[99px] z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-primary shadow-md transition-colors duration-200 hover:bg-surface"
                              >
                                <SlideArrow direction="prev" />
                              </button>
                            )}

                            <div
                              ref={resultsScrollRef}
                              onMouseDown={onSlideMouseDown}
                              onClickCapture={onSlideClickCapture}
                              className="flex cursor-grab gap-4 overflow-x-auto pb-1 select-none active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            >
                              {results.map((product) => (
                                <SearchResultCard key={product.slug} product={product} onNavigate={onClose} />
                              ))}
                            </div>

                            {results.length > 4 && canScrollNext && (
                              <button
                                type="button"
                                aria-label="Next products"
                                onClick={() => scrollSlide("next")}
                                className="absolute right-0 top-[99px] z-10 flex h-8 w-8 -translate-y-1/2 translate-x-1/2 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-primary shadow-md transition-colors duration-200 hover:bg-surface"
                              >
                                <SlideArrow direction="next" />
                              </button>
                            )}
                          </div>
                          {results.length > 4 && (
                            <div className="mt-6 flex justify-center">
                              <SplitButton
                                variant="outline-dark"
                                href={`/search?${searchBy}=${encodeURIComponent(query.trim())}`}
                              >
                                View All
                              </SplitButton>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
