"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import SectionHeader from "@/components/ui/SectionHeading";
import Container from "@/components/layouts/Container";
import type { HistJourneySectionProps } from "./HistJourneySection.types";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Module-level config — must run once, before any component mounts
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
ScrollTrigger.normalizeScroll(true);

const PANEL_H = "calc(100vh - 96px)";
const HEADER_H = 96;
const PARALLAX_DESKTOP = 60;
const PARALLAX_MOBILE = 20;

interface DateGroup {
  decadeIndex: number;
  dateIndex: number;
  decadeTitle: string;
  decadeSubTitle: string;
  dateStr: string;
  entries: Array<{ bg_image: string; image: string; desc: string }>;
}

export default function HistJourneySection({ section, className = "" }: HistJourneySectionProps) {
  const dateGroups = useMemo<DateGroup[]>(
    () =>
      section.items.flatMap((decade, di) =>
        decade.dates.map((date, dti) => ({
          decadeIndex: di,
          dateIndex: dti,
          decadeTitle: decade.title,
          decadeSubTitle: decade.sub_title,
          dateStr: date.date,
          entries: date.entries.map((e) => ({
            bg_image: e.bg_image,
            image: e.image,
            desc: e.desc,
          })),
        }))
      ),
    [section]
  );

  const totalEntries = useMemo(
    () => dateGroups.reduce((sum, g) => sum + g.entries.length, 0),
    [dateGroups]
  );

  // positions[i] = component state after i transitions (positions[0] = initial)
  const positions = useMemo(() => {
    const pos: Array<{ dateIdx: number; entryIdx: number }> = [{ dateIdx: 0, entryIdx: 0 }];
    dateGroups.forEach((group, gi) => {
      for (let ei = 1; ei < group.entries.length; ei++) {
        pos.push({ dateIdx: gi, entryIdx: ei });
      }
      if (gi < dateGroups.length - 1) {
        pos.push({ dateIdx: gi + 1, entryIdx: 0 });
      }
    });
    return pos;
  }, [dateGroups]);

  // Only React state needed: active date for sidebar button colour
  const [activeDateIdx, setActiveDateIdx] = useState(0);
  const activeDateRef = useRef(0);
  const activeEntryRef = useRef(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const slidesTrackRef = useRef<HTMLDivElement>(null);
  const entryTrackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sidebarNavRef = useRef<HTMLElement>(null);
  const sidebarIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  // Cached fill elements: key = `${gi}-${j}`
  const barFillCache = useRef<Record<string, Element[]>>({});
  // quickTo setter for indicator — bypasses React for frame-accurate updates
  const quickIndicator = useRef<((value: number) => void) | null>(null);
  // Cached button Y positions relative to nav (computed once, stable)
  const btnYPositions = useRef<number[]>([]);

  // Initialize all slide content as invisible — prevents flash before onEnter fires
  useEffect(() => {
    if (!panelRef.current) return;
    const els = panelRef.current.querySelectorAll("[data-slide-text], [data-slide-image]");
    gsap.set(els, { autoAlpha: 0 });
  }, [dateGroups]);

  // Cache progress bar fill elements after mount
  useEffect(() => {
    if (!panelRef.current) return;
    dateGroups.forEach((group, gi) => {
      for (let j = 0; j < group.entries.length; j++) {
        barFillCache.current[`${gi}-${j}`] = Array.from(
          panelRef.current!.querySelectorAll(`[data-fill="${gi}-${j}"]`)
        );
      }
    });
  }, [dateGroups]);

  // Cache sidebar button positions + create quickTo indicator setter
  useEffect(() => {
    if (!sidebarNavRef.current || !sidebarIndicatorRef.current) return;
    const nav = sidebarNavRef.current;
    const indicator = sidebarIndicatorRef.current;

    // quickTo: pre-compiled GSAP setter, no overhead on each call
    quickIndicator.current = gsap.quickTo(indicator, "y", {
      duration: 0.65,
      ease: "power3.out",
    });

    // Measure button positions once — they don't move after layout
    const navTop = nav.getBoundingClientRect().top;
    const buttons = nav.querySelectorAll<HTMLElement>("[data-date-key]");
    btnYPositions.current = Array.from(buttons).map((btn) => {
      const r = btn.getBoundingClientRect();
      return r.top - navTop + r.height / 2 - 3;
    });

    // Snap indicator to first button immediately — avoids y:0 start position
    if (btnYPositions.current[0] !== undefined) {
      gsap.set(indicator, { y: btnYPositions.current[0] });
    }
  }, [dateGroups]);

  // Drive progress bars via GSAP — zero React re-renders
  const updateProgressBars = useCallback(
    (dateIdx: number, entryIdx: number) => {
      dateGroups.forEach((group, g) => {
        for (let j = 0; j < group.entries.length; j++) {
          const filled = g < dateIdx || (g === dateIdx && j <= entryIdx);
          const els = barFillCache.current[`${g}-${j}`];
          if (els?.length) {
            gsap.to(els, {
              width: filled ? "100%" : "0%",
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        }
      });
    },
    [dateGroups]
  );

  // Stagger entrance for active slide content (year → desc → image)
  const animateContentIn = useCallback((dateIdx: number, entryIdx: number) => {
    const trackEl = entryTrackRefs.current[dateIdx];
    if (!trackEl) return;
    const slides = trackEl.querySelectorAll<HTMLElement>("[data-slide]");
    const slide = slides[entryIdx];
    if (!slide) return;
    const targets = [
      slide.querySelector("[data-slide-text]"),
      slide.querySelector("[data-slide-image]"),
    ].filter(Boolean);
    if (!targets.length) return;
    gsap.fromTo(
      targets,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.09,
        overwrite: "auto",
        clearProps: "transform,opacity,visibility",
      }
    );
  }, []);

  // Main ScrollTrigger setup — uses gsap.matchMedia() for responsive + a11y
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current || !panelRef.current || !slidesTrackRef.current) return;
    if (dateGroups.length === 0 || totalEntries === 0) return;

    const getPanelHeight = () => panelRef.current?.offsetHeight ?? 0;
    const getPanelWidth = () => panelRef.current?.offsetWidth ?? window.innerWidth;
    const totalTransitions = totalEntries - 1;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduceMotion } =
          context.conditions as { isDesktop: boolean; reduceMotion: boolean };

        // Accessibility: respect user's motion preference
        if (reduceMotion) {
          updateProgressBars(0, 0);
          return () => {};
        }

        const parallax = isDesktop ? PARALLAX_DESKTOP : PARALLAX_MOBILE;
        const scrubValue = isDesktop ? 0.3 : 0.55;
        // hasEntered: true after first onEnter fires
        // skipNextSnap: onEnter sets this so the immediately-following entry snap is ignored
        let hasEntered = false;
        let skipNextSnap = false;

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "hist-journey",
            trigger: wrapperRef.current,
            start: `top top+=${HEADER_H}`,
            end: () => `+=${getPanelHeight() * Math.max(totalTransitions, 0)}`,
            pin: panelRef.current,
            scrub: scrubValue,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // markers: process.env.NODE_ENV === "development",
            onEnter: () => {
              if (!hasEntered) {
                hasEntered = true;
                skipNextSnap = true; // the entry snap fires right after — skip it
                animateContentIn(0, 0);
                updateProgressBars(0, 0);
              }
            },
            snap:
              totalEntries > 1
                ? {
                    snapTo: 1 / totalTransitions,
                    duration: { min: 0.25, max: 0.55 },
                    delay: 0.04,
                    ease: "power3.inOut",
                    directional: true,
                    onComplete: () => {
                      // Skip the first snap — onEnter already handled the first slide
                      if (skipNextSnap) {
                        skipNextSnap = false;
                        return;
                      }
                      animateContentIn(activeDateRef.current, activeEntryRef.current);
                    },
                  }
                : undefined,
            onUpdate: (self) => {
              if (totalTransitions === 0) return;
              const posIdx = Math.min(
                Math.round(self.progress * totalTransitions),
                positions.length - 1
              );
              const { dateIdx, entryIdx } = positions[posIdx];

              if (dateIdx !== activeDateRef.current || entryIdx !== activeEntryRef.current) {
                activeDateRef.current = dateIdx;
                activeEntryRef.current = entryIdx;

                // React state for sidebar button colour — only re-renders sidebar
                setActiveDateIdx(dateIdx);

                // quickTo: frame-accurate indicator update, no React roundtrip
                if (
                  quickIndicator.current &&
                  btnYPositions.current[dateIdx] !== undefined
                ) {
                  quickIndicator.current(btnYPositions.current[dateIdx]);
                }

                // GSAP-direct progress bars
                updateProgressBars(dateIdx, entryIdx);
              }
            },
          },
        });

        // ── Timeline: horizontal transitions → vertical date advances ──
        dateGroups.forEach((group, gi) => {
          const entryTrack = entryTrackRefs.current[gi];
          const slides = entryTrack?.querySelectorAll<HTMLElement>("[data-slide]");

          for (let ei = 1; ei < group.entries.length; ei++) {
            // Main horizontal x tween
            tl.to(
              entryTrack,
              { x: () => -ei * getPanelWidth(), ease: "none", duration: 1 },
              ">"
            );

            // BG parallax: leaving slide bg drifts in direction of travel
            const leavingBg = slides?.[ei - 1]?.querySelector<HTMLElement>("[data-slide-bg]");
            if (leavingBg) {
              tl.to(leavingBg, { x: parallax, ease: "none", duration: 1 }, "<");
            }

            // BG parallax: entering slide bg arrives from opposite offset
            const enteringBg = slides?.[ei]?.querySelector<HTMLElement>("[data-slide-bg]");
            if (enteringBg) {
              gsap.set(enteringBg, { x: -parallax });
              tl.to(enteringBg, { x: 0, ease: "none", duration: 1 }, "<");
            }
          }

          // Main vertical y tween
          if (gi < dateGroups.length - 1) {
            tl.to(
              slidesTrackRef.current,
              { y: () => -(gi + 1) * getPanelHeight(), ease: "none", duration: 1 },
              ">"
            );

            // BG parallax: last entry of current date drifts upward
            const leavingBg =
              slides?.[group.entries.length - 1]?.querySelector<HTMLElement>("[data-slide-bg]");
            if (leavingBg) {
              tl.to(leavingBg, { y: -parallax, ease: "none", duration: 1 }, "<");
            }

            // BG parallax: first entry of next date arrives from below
            const nextSlides = entryTrackRefs.current[gi + 1]?.querySelectorAll<HTMLElement>(
              "[data-slide]"
            );
            const enteringBg = nextSlides?.[0]?.querySelector<HTMLElement>("[data-slide-bg]");
            if (enteringBg) {
              gsap.set(enteringBg, { y: parallax });
              tl.to(enteringBg, { y: 0, ease: "none", duration: 1 }, "<");
            }
          }
        });

        scrollTriggerRef.current = tl.scrollTrigger ?? null;

        return () => {
          scrollTriggerRef.current = null;
        };
      }
    );

    return () => mm.revert();
  }, [dateGroups, totalEntries, positions, animateContentIn, updateProgressBars]);

  const jumpToDate = useCallback(
    (gi: number, ei = 0) => {
      const st = scrollTriggerRef.current ?? ScrollTrigger.getById("hist-journey");
      if (!st || totalEntries <= 1) return;
      let count = 0;
      for (let g = 0; g < gi; g++) {
        count += dateGroups[g].entries.length - 1;
        if (g < dateGroups.length - 1) count += 1;
      }
      count += ei;
      const progress = count / (totalEntries - 1);
      const targetScroll = st.start + (st.end - st.start) * progress;
      gsap.to(window, {
        scrollTo: { y: targetScroll, autoKill: true },
        duration: 1.1,
        ease: "power3.inOut",
      });
    },
    [dateGroups, totalEntries]
  );

  const activeGroup = dateGroups[activeDateIdx];
  if (!activeGroup) return null;
  const activeDateKey = `${activeGroup.decadeIndex}-${activeGroup.dateIndex}`;

  return (
    <div id="history-journey" className={className}>
      {/* Section header — light area above the dark panel */}
      <div className="pb-12">
        <Container size="wide">
          <div className="mx-auto max-w-[900px]">
            <SectionHeader title={section.sub_title} align="center" />
          </div>
        </Container>
      </div>

      <div ref={wrapperRef}>
        <div
          ref={panelRef}
          className="relative overflow-hidden bg-dark-blue"
          style={{ height: PANEL_H }}
        >
          {/* Fixed sidebar — desktop only, floats above slides via z-30 */}
          <div className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
            <div className="mx-auto flex h-full w-full max-w-[1764px] py-[var(--spacing-section-inner)]">
              <aside className="pointer-events-auto flex w-84 shrink-0 flex-col gap-8 overflow-y-auto pr-8">
                <nav ref={sidebarNavRef} className="relative flex flex-col gap-8">
                  <div
                    ref={sidebarIndicatorRef}
                    className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-mint will-change-transform"
                    aria-hidden
                  />
                  {section.items.map((decade, di) => (
                    <div key={di}>
                      <p className="mb-subsection font-body text-body font-medium leading-[24px] text-white">
                        {decade.title}
                        <br />
                        {decade.sub_title}
                      </p>
                      <div className="flex flex-col">
                        {decade.dates.map((date, dti) => {
                          const key = `${di}-${dti}`;
                          const gi = dateGroups.findIndex(
                            (g) => g.decadeIndex === di && g.dateIndex === dti
                          );
                          const isActive = key === activeDateKey;
                          const isLast = dti === decade.dates.length - 1;
                          return (
                            <div key={dti}>
                              <button
                                type="button"
                                data-date-key={key}
                                onClick={() => jumpToDate(gi, 0)}
                                className={`flex items-center gap-2 py-0.5 pl-3.5 text-left font-body text-body font-normal leading-[24px] transition-colors duration-500 ${
                                  isActive ? "text-mint" : "text-white hover:text-mint"
                                }`}
                              >
                                {date.date}
                              </button>
                              {!isLast && (
                                <div className="ml-[3px] h-10 w-px bg-white/30" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </aside>
            </div>
          </div>

          {/* Vertical slides track — GSAP y tween between dates */}
          <div ref={slidesTrackRef} className="will-change-transform">
            {dateGroups.map((group, gi) => (
              <div
                key={gi}
                className="relative overflow-hidden"
                style={{ height: PANEL_H }}
              >
                {/* Horizontal entry track — GSAP x tween between entries */}
                <div
                  ref={(el) => { entryTrackRefs.current[gi] = el; }}
                  className="flex h-full will-change-transform"
                >
                  {group.entries.map((entry, ei) => (
                    <div
                      key={ei}
                      data-slide
                      className="relative h-full w-screen shrink-0 overflow-hidden"
                    >
                      {/* Background — parallax via [data-slide-bg] */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div
                          data-slide-bg
                          className="absolute inset-[-4%] will-change-transform"
                        >
                          <Image
                            src={entry.bg_image}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                            priority={gi === 0 && ei === 0}
                          />
                          <div className="absolute inset-0 bg-black/50" />
                        </div>
                      </div>

                      {/* Content — entrance via [data-slide-text] / [data-slide-image] */}
                      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1764px] flex-col py-[var(--spacing-section-inner)]">
                        <div className="flex min-h-0 flex-1">
                          <div className="hidden w-84 shrink-0 lg:block" aria-hidden />

                          <div className="flex flex-1 flex-col">
                            <div className="grid flex-1 grid-cols-1 items-center lg:grid-cols-[2fr_3fr]">
                              <div
                                data-slide-text
                                className="flex flex-col gap-6 px-6 lg:pl-14 lg:pr-10"
                              >
                                <p
                                  className="font-heading font-light leading-none text-mint"
                                  style={{ fontSize: "clamp(4rem, 7vw, 6.5rem)" }}
                                >
                                  {group.dateStr}
                                </p>
                                <p className="font-body text-body font-normal leading-relaxed text-white">
                                  {entry.desc}
                                </p>
                              </div>

                              <div
                                data-slide-image
                                className="flex items-center justify-center px-6 lg:px-10"
                              >
                                <Image
                                  src={entry.image}
                                  alt={`${group.dateStr} milestone`}
                                  width={0}
                                  height={0}
                                  sizes="100%"
                                  className="h-auto w-full"
                                  unoptimized
                                />
                              </div>
                            </div>

                            {/* Controls — aligned under text column */}
                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
                              <div className="px-6 py-6 lg:pl-14 lg:pr-10">
                                {/* Progress bars — GSAP fills via [data-fill] */}
                                <div className="mb-5 flex gap-2">
                                  {Array.from({ length: group.entries.length }).map((_, j) => (
                                    <div key={j} className="h-px flex-1 bg-mint/30">
                                      <div
                                        data-fill={`${gi}-${j}`}
                                        className="h-full w-0 bg-mint"
                                      />
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (ei > 0) jumpToDate(gi, ei - 1);
                                      else if (gi > 0)
                                        jumpToDate(gi - 1, dateGroups[gi - 1].entries.length - 1);
                                    }}
                                    disabled={gi === 0 && ei === 0}
                                    aria-label="Previous entry"
                                    className="flex items-center gap-2 font-body text-body-sm text-white/40 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                                      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Prev
                                  </button>

                                  <span className="font-body text-body-sm tabular-nums text-white/40">
                                    {ei + 1} / {group.entries.length}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (ei < group.entries.length - 1) jumpToDate(gi, ei + 1);
                                      else if (gi < dateGroups.length - 1) jumpToDate(gi + 1, 0);
                                    }}
                                    disabled={
                                      gi === dateGroups.length - 1 &&
                                      ei === group.entries.length - 1
                                    }
                                    aria-label="Next entry"
                                    className="flex items-center gap-2 font-body text-body-sm text-white/40 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                                  >
                                    Next
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
