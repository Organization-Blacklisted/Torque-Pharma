"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";
import SectionHeader from "@/components/ui/SectionHeading";
import Container from "@/components/layouts/Container";
import type { HistJourneySectionProps } from "./HistJourneySection.types";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

if (typeof window !== "undefined") {
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
}

const PANEL_H = "calc(100vh - 96px)";
const HEADER_H = 96;
const BAR_DURATION = 4;       // seconds each progress bar takes to fill
const TRANSITION = 0.72;      // slide transition duration
const PARALLAX = 40;          // px background depth offset
const SCROLL_PER_STEP = 600;  // virtual scroll px reserved per step

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

  // positions[stepIndex] = { dateIdx, entryIdx }
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
  const barFillCache = useRef<Record<string, Element[]>>({});
  const quickIndicator = useRef<((value: number) => void) | null>(null);
  const btnYPositions = useRef<number[]>([]);
  // Exposes goToStep to jumpToDate (which lives outside the effect)
  const goToStepRef = useRef<((step: number) => void) | null>(null);

  // Initialize all slide content as invisible before section enters viewport
  useEffect(() => {
    if (!panelRef.current) return;
    const els = panelRef.current.querySelectorAll("[data-slide-text], [data-slide-image]");
    gsap.set(els, { autoAlpha: 0 });
  }, [dateGroups]);

  // Cache [data-fill] elements for zero-overhead bar updates
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

  // quickTo indicator + button position cache
  useEffect(() => {
    if (!sidebarNavRef.current || !sidebarIndicatorRef.current) return;
    const nav = sidebarNavRef.current;
    const indicator = sidebarIndicatorRef.current;

    quickIndicator.current = gsap.quickTo(indicator, "y", {
      duration: 0.65,
      ease: "power3.out",
    });

    const navTop = nav.getBoundingClientRect().top;
    const buttons = nav.querySelectorAll<HTMLElement>("[data-date-key]");
    btnYPositions.current = Array.from(buttons).map((btn) => {
      const r = btn.getBoundingClientRect();
      return r.top - navTop + r.height / 2 - 3;
    });

    if (btnYPositions.current[0] !== undefined) {
      gsap.set(indicator, { y: btnYPositions.current[0] });
    }
  }, [dateGroups]);

  // Set all bars to their filled/empty state; active bar is reset to 0 (startBar fills it)
  const updateProgressBars = useCallback(
    (dateIdx: number, entryIdx: number) => {
      dateGroups.forEach((group, g) => {
        for (let j = 0; j < group.entries.length; j++) {
          const isActive = g === dateIdx && j === entryIdx;
          const isFilled = g < dateIdx || (g === dateIdx && j < entryIdx);
          const els = barFillCache.current[`${g}-${j}`];
          if (!els?.length) return;
          if (isActive) {
            gsap.set(els, { width: "0%" });
          } else {
            gsap.to(els, {
              width: isFilled ? "100%" : "0%",
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        }
      });
    },
    [dateGroups]
  );

  // Stagger entrance: year text → desc → image
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current || !panelRef.current || !slidesTrackRef.current) return;
    if (dateGroups.length === 0 || totalEntries === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const getPanelHeight = () => panelRef.current?.offsetHeight ?? window.innerHeight - HEADER_H;
    const getPanelWidth = () => panelRef.current?.offsetWidth ?? window.innerWidth;
    const totalSteps = totalEntries;

    let currentStep = 0;
    let isAnimating = false;
    let barTween: gsap.core.Tween | null = null;
    let st: ScrollTrigger | null = null;
    let obs: ReturnType<typeof Observer.create> | null = null;

    // ── Sidebar sync (bypasses React state for the indicator, React state for button colours) ──
    const syncSidebar = (dateIdx: number) => {
      activeDateRef.current = dateIdx;
      setActiveDateIdx(dateIdx);
      if (quickIndicator.current && btnYPositions.current[dateIdx] !== undefined) {
        quickIndicator.current(btnYPositions.current[dateIdx]);
      }
    };

    // ── Start auto-fill timer for progress bar at gi/ei ──
    const startBar = (gi: number, ei: number) => {
      if (reduceMotion) return;
      const fills = barFillCache.current[`${gi}-${ei}`];
      if (!fills?.length) return;
      barTween?.kill();
      gsap.set(fills, { width: "0%" });
      barTween = gsap.to(fills, {
        width: "100%",
        duration: BAR_DURATION,
        ease: "none",
        overwrite: true,
        onComplete: () => {
          if (!isAnimating) handleAdvance(currentStep + 1);
        },
      });
    };

    // ── Transition to a specific step ──
    const goToStep = (newStep: number) => {
      if (newStep < 0 || newStep >= totalSteps || isAnimating) return;

      barTween?.kill();

      const prevPos = positions[currentStep];
      const nextPos = positions[newStep];
      const forward = newStep > currentStep;
      currentStep = newStep;

      activeEntryRef.current = nextPos.entryIdx;
      syncSidebar(nextPos.dateIdx);
      updateProgressBars(nextPos.dateIdx, nextPos.entryIdx);

      // Keep ST scroll position in sync with the current step
      if (st) {
        gsap.to(window, {
          scrollTo: { y: st.start + newStep * SCROLL_PER_STEP, autoKill: false },
          duration: 0.15,
          ease: "none",
        });
      }

      const onDone = () => {
        isAnimating = false;
        animateContentIn(nextPos.dateIdx, nextPos.entryIdx);
        startBar(nextPos.dateIdx, nextPos.entryIdx);
      };

      if (prevPos.dateIdx === nextPos.dateIdx) {
        // ── Horizontal: next/prev entry within same date ──
        const track = entryTrackRefs.current[nextPos.dateIdx];
        const slides = track?.querySelectorAll<HTMLElement>("[data-slide]");
        const leavingBg = slides?.[prevPos.entryIdx]?.querySelector<HTMLElement>("[data-slide-bg]");
        const enteringBg = slides?.[nextPos.entryIdx]?.querySelector<HTMLElement>("[data-slide-bg]");

        if (enteringBg) gsap.set(enteringBg, { x: forward ? -PARALLAX : PARALLAX, y: 0 });

        isAnimating = true;
        gsap.to(track, {
          x: () => -nextPos.entryIdx * getPanelWidth(),
          duration: TRANSITION,
          ease: "power3.inOut",
          onComplete: onDone,
        });
        if (leavingBg) gsap.to(leavingBg, { x: forward ? PARALLAX : -PARALLAX, duration: TRANSITION, ease: "power3.inOut" });
        if (enteringBg) gsap.to(enteringBg, { x: 0, duration: TRANSITION, ease: "power3.inOut" });

      } else {
        // ── Vertical: different date ──
        // Instantly snap the target date's entry track to the right entry
        const nextTrack = entryTrackRefs.current[nextPos.dateIdx];
        if (nextTrack) gsap.set(nextTrack, { x: -nextPos.entryIdx * getPanelWidth() });

        const prevSlides = entryTrackRefs.current[prevPos.dateIdx]?.querySelectorAll<HTMLElement>("[data-slide]");
        const nextSlides = entryTrackRefs.current[nextPos.dateIdx]?.querySelectorAll<HTMLElement>("[data-slide]");
        const leavingBg = prevSlides?.[prevPos.entryIdx]?.querySelector<HTMLElement>("[data-slide-bg]");
        const enteringBg = nextSlides?.[nextPos.entryIdx]?.querySelector<HTMLElement>("[data-slide-bg]");

        if (enteringBg) gsap.set(enteringBg, { y: forward ? PARALLAX : -PARALLAX, x: 0 });

        isAnimating = true;
        gsap.to(slidesTrackRef.current, {
          y: () => -nextPos.dateIdx * getPanelHeight(),
          duration: TRANSITION,
          ease: "power3.inOut",
          onComplete: onDone,
        });
        if (leavingBg) gsap.to(leavingBg, { y: forward ? -PARALLAX : PARALLAX, duration: TRANSITION, ease: "power3.inOut" });
        if (enteringBg) gsap.to(enteringBg, { y: 0, duration: TRANSITION, ease: "power3.inOut" });
      }
    };

    // ── handleAdvance: called by bar timer + observer; handles edge cases ──
    const handleAdvance = (newStep: number) => {
      if (newStep >= totalSteps) {
        // All done — release pin by scrolling past end
        barTween?.kill();
        if (st) {
          gsap.to(window, {
            scrollTo: { y: st.end + 10, autoKill: false },
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
        return;
      }
      if (newStep < 0) {
        barTween?.kill();
        if (st) {
          gsap.to(window, {
            scrollTo: { y: Math.max(0, st.start - 10), autoKill: false },
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
        return;
      }
      goToStep(newStep);
    };

    goToStepRef.current = goToStep;

    // ── Pin the panel for the duration of all steps ──
    st = ScrollTrigger.create({
      id: "hist-journey",
      trigger: wrapperRef.current,
      pin: panelRef.current,
      start: `top top+=${HEADER_H}`,
      end: () => `+=${(totalSteps - 1) * SCROLL_PER_STEP}`,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        obs?.enable();
        currentStep = 0;
        isAnimating = false;
        animateContentIn(0, 0);
        updateProgressBars(0, 0);
        startBar(0, 0);
      },
      onLeave: () => {
        obs?.disable();
      },
      onEnterBack: () => {
        obs?.enable();
      },
      onLeaveBack: () => {
        barTween?.kill();
        obs?.disable();
      },
    });

    scrollTriggerRef.current = st;

    // ── Observer: intercept wheel + touch for discrete step advancement ──
    obs = Observer.create({
      target: panelRef.current,
      type: "wheel,touch",
      preventDefault: true,
      tolerance: 10,
      onDown: () => !isAnimating && handleAdvance(currentStep + 1),
      onUp: () => !isAnimating && handleAdvance(currentStep - 1),
    });
    // Start disabled — enabled only when panel is pinned (onEnter fires)
    obs.disable();

    return () => {
      barTween?.kill();
      obs?.kill();
      st?.kill();
      scrollTriggerRef.current = null;
      goToStepRef.current = null;
    };
  }, [dateGroups, totalEntries, positions, animateContentIn, updateProgressBars]);

  const jumpToDate = useCallback(
    (gi: number, ei = 0) => {
      const targetStep = positions.findIndex((p) => p.dateIdx === gi && p.entryIdx === ei);
      if (targetStep !== -1 && goToStepRef.current) {
        goToStepRef.current(targetStep);
      }
    },
    [positions]
  );

  const activeGroup = dateGroups[activeDateIdx];
  if (!activeGroup) return null;
  const activeDateKey = `${activeGroup.decadeIndex}-${activeGroup.dateIndex}`;

  return (
    <div id="history-journey" className={className}>
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
          {/* Sidebar — desktop only, floats above slides */}
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
                      {/* Background with parallax depth */}
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

                      {/* Slide content */}
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

                            {/* Controls — positioned under the text column */}
                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
                              <div className="px-6 py-6 lg:pl-14 lg:pr-10">
                                {/* Progress bars */}
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
