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

  // Initialize all slide content as transparent before section enters viewport
  useEffect(() => {
    if (!panelRef.current) return;
    const els = panelRef.current.querySelectorAll("[data-slide-text], [data-slide-image]");
    gsap.set(els, { opacity: 0 });
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
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.06,
        overwrite: "auto",
        clearProps: "transform,opacity",
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

      // Pre-hide the entering slide's content now so animateContentIn fades
      // from 0→1 without a visible snap (backwards slides retain opacity:1
      // from clearProps after their last entrance animation)
      const nextTrackEl = entryTrackRefs.current[nextPos.dateIdx];
      const nextSlideEl = nextTrackEl?.querySelectorAll<HTMLElement>("[data-slide]")?.[nextPos.entryIdx];
      if (nextSlideEl) {
        gsap.set(nextSlideEl.querySelectorAll("[data-slide-text], [data-slide-image]"), { opacity: 0, y: 0 });
      }

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

    // ── Track active zone via ScrollTrigger (panel is CSS sticky — no pin needed) ──
    st = ScrollTrigger.create({
      id: "hist-journey",
      trigger: wrapperRef.current,
      start: `top top+=${HEADER_H}`,
      end: () => `+=${(totalSteps - 1) * SCROLL_PER_STEP}`,
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

    // ── Observer: target window so GSAP registers non-passive touch listeners at the top level ──
    // (element-level passive listeners are silently ignored on real iOS/Android; devtools sim does not replicate this)
    obs = Observer.create({
      target: window,
      type: "wheel,touch",
      preventDefault: true,
      tolerance: 10,
      lockAxis: true,
      onDown: () => {
        if (!isAnimating) handleAdvance(currentStep + 1);
      },
      onUp: () => {
        if (!isAnimating) handleAdvance(currentStep - 1);
      },
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

      {/* Wrapper is pre-sized to the full virtual scroll height so no layout
          shift occurs when the section becomes active. Panel uses CSS sticky
          instead of ScrollTrigger pin — eliminates the entry jerk entirely. */}
      <div
        ref={wrapperRef}
        style={{ height: `calc(${PANEL_H} + ${(totalEntries - 1) * SCROLL_PER_STEP}px)` }}
      >
        <div
          ref={panelRef}
          className="sticky overflow-hidden bg-dark-blue"
          style={{ top: HEADER_H, height: PANEL_H }}
        >
          {/* Sidebar — desktop only, floats above slides */}
          <div className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
            <Container size="wide" className="flex h-full py-[var(--spacing-section-inner)]">
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
            </Container>
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
                            sizes="100vw"
                            className="object-cover"
                            priority={gi === 0 && ei === 0}
                          />
                          <div className="absolute inset-0 bg-black/50" />
                        </div>
                      </div>

                      {/* Slide content */}
                      <Container size="wide" className="relative z-10 flex h-full flex-col py-[var(--spacing-section-inner)]">
                        <div className="flex min-h-0 flex-1">
                          <div className="hidden w-84 shrink-0 lg:block" aria-hidden />

                          <div className="flex flex-1 flex-col">
                            <div className="grid flex-1 grid-cols-1 items-center lg:grid-cols-[2fr_3fr]">
                              <div
                                data-slide-text
                                className="flex flex-col gap-6 lg:pl-14 lg:pr-10"
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
                                className="flex items-center justify-center lg:px-10"
                              >
                                <Image
                                  src={entry.image}
                                  alt={`${group.dateStr} milestone`}
                                  width={0}
                                  height={0}
                                  sizes="(max-width: 1024px) 100vw, 60vw"
                                  className="h-auto w-full"
                                />
                              </div>
                            </div>

                            {/* Controls — positioned under the text column */}
                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
                              <div className="py-6 lg:pl-14 lg:pr-10">
                                {/* Progress bars */}
                                <div className="mb-5 flex gap-2">
                                  {Array.from({ length: group.entries.length }).map((_, j) => (
                                    <div key={j} className="h-px flex-1 bg-white/30">
                                      <div
                                        data-fill={`${gi}-${j}`}
                                        className="h-full w-0 bg-mint"
                                      />
                                    </div>
                                  ))}
                                </div> 

                                <div className="flex items-center justify-end gap-4">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (ei > 0) jumpToDate(gi, ei - 1);
                                      else if (gi > 0)
                                        jumpToDate(gi - 1, dateGroups[gi - 1].entries.length - 1);
                                    }}
                                    disabled={gi === 0 && ei === 0}
                                    aria-label="Previous entry"
                                    className="opacity-100 transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-20"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                                      <path d="M5.07495 11.7237C4.98827 11.8104 4.93904 11.9277 4.93892 12.0504C4.93892 12.1731 4.98815 12.2915 5.07495 12.3784L10.111 17.4144C10.1978 17.5012 10.3156 17.5498 10.4383 17.5498C10.5611 17.5498 10.6788 17.5012 10.7656 17.4144C10.8525 17.3276 10.901 17.2099 10.901 17.0871C10.901 16.9643 10.8525 16.8466 10.7656 16.7598L6.51955 12.5137H18.4962C18.7518 12.5137 18.9595 12.306 18.9595 12.0504C18.9593 11.795 18.7522 11.5879 18.4969 11.5877H6.52024L10.7656 7.34229C10.8525 7.25547 10.9017 7.13707 10.9017 7.01429C10.9016 6.89168 10.8523 6.77442 10.7656 6.68766C10.6788 6.60084 10.5611 6.55094 10.4383 6.55094C10.3156 6.55095 10.1978 6.60086 10.111 6.68766L5.07495 11.7237Z" fill="white" stroke="white" strokeWidth="0.213672" />
                                    </svg>
                                  </button>

                                  <span className="font-body text-h5 font-normal tabular-nums tracking-[3.6px] text-white" style={{ lineHeight: "24px" }}>
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
                                    className="opacity-100 transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-20"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                                      <path d="M18.925 11.7237C19.0117 11.8104 19.061 11.9277 19.0611 12.0504C19.0611 12.1731 19.0119 12.2915 18.925 12.3784L13.889 17.4144C13.8022 17.5012 13.6844 17.5498 13.5617 17.5498C13.4389 17.5498 13.3212 17.5012 13.2344 17.4144C13.1475 17.3276 13.099 17.2099 13.099 17.0871C13.099 16.9643 13.1475 16.8466 13.2344 16.7598L17.4804 12.5137H5.50383C5.24819 12.5137 5.04051 12.306 5.04048 12.0504C5.04073 11.795 5.24782 11.5879 5.50314 11.5877H17.4798L13.2344 7.34229C13.1475 7.25547 13.0983 7.13707 13.0983 7.01429C13.0984 6.89168 13.1477 6.77442 13.2344 6.68766C13.3212 6.60084 13.4389 6.55094 13.5617 6.55094C13.6844 6.55095 13.8022 6.60086 13.889 6.68766L18.925 11.7237Z" fill="white" stroke="white" strokeWidth="0.213672" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Container>
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
