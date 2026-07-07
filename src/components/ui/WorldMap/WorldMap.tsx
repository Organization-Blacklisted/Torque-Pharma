"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { WorldMapProps } from "./WorldMap.types";

const FADE_MS = 350;
const HOLD_MS = 3000;

// Dummy visual positions — spread across the map to match Figma layout.
// Some African countries are placed at South America / Asia zones intentionally
// so the overall map spread looks like the Figma design.
const POSITIONS: Record<string, { x: number; y: number }> = {
  // South America zone (2 pins, left side)
  "Gambia":       { x: 23.0, y: 53.0 },
  "Liberia":      { x: 27.0, y: 59.5 },
  // West / Central Africa zone
  "Mali":         { x: 47.0, y: 49.0 },
  "Algeria":      { x: 51.5, y: 48.5 },
  "Burkina Faso": { x: 48.5, y: 52.0 },
  "Ivory Coast":  { x: 46.0, y: 56.0 },
  "Cameroon":     { x: 51.5, y: 56.5 },
  // East Africa zone
  "South Sudan":  { x: 57.5, y: 50.5 },
  "Uganda":       { x: 58.5, y: 54.0 },
  "Ethiopia":     { x: 60.5, y: 50.5 },
  "Somalia":      { x: 62.5, y: 51.0 },
  "Burundi":      { x: 57.8, y: 59.0 },
  // South Africa zone
  "Angola":       { x: 54.0, y: 63.0 },
  "Mozambique":   { x: 58.5, y: 70.0 },
  // Asia zone (2 pins, right side)
  "Sudan":        { x: 73.0, y: 48.5 },
  "Zambia":       { x: 82.5, y: 52.0 },
  // Real country names (show if API sends them)
  "Guyana":       { x: 28.5, y: 55.5 },
  "Brazil":       { x: 27.5, y: 63.0 },
  "India":        { x: 72.5, y: 48.5 },
  "Yemen":        { x: 64.5, y: 48.5 },
  "Philippines":  { x: 82.0, y: 52.5 },
  "Malaysia":     { x: 80.0, y: 56.0 },
  "Indonesia":    { x: 81.5, y: 59.5 },
  "Myanmar":      { x: 77.0, y: 49.0 },
  "Sri Lanka":    { x: 73.5, y: 55.0 },
  "Oman":         { x: 66.0, y: 48.0 },
};

function RedPin() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="23" viewBox="0 0 17 23" fill="none" className="text-pin" aria-hidden="true">
      <path d="M8.43576 0C3.78484 0 0 3.81109 0 8.49668C0 15.1544 7.6428 22.0286 7.96804 22.3173C8.10208 22.4363 8.26892 22.4954 8.43576 22.4954C8.6026 22.4954 8.76944 22.4363 8.90347 22.3182C9.22872 22.0286 16.8715 15.1544 16.8715 8.49668C16.8715 3.81109 13.0867 0 8.43576 0ZM8.43576 13.1223C5.8516 13.1223 3.74923 11.0199 3.74923 8.43576C3.74923 5.8516 5.8516 3.74923 8.43576 3.74923C11.0199 3.74923 13.1223 5.8516 13.1223 8.43576C13.1223 11.0199 11.0199 13.1223 8.43576 13.1223Z" fill="currentColor" />
    </svg>
  );
}

function BlackPin() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none" className="text-dark-blue" aria-hidden="true">
      <g clipPath="url(#wp-clip)">
        <path d="M14.252 0C8.35958 0 3.56445 4.82837 3.56445 10.7647C3.56445 19.1995 13.2473 27.9086 13.6594 28.2744C13.8292 28.4252 14.0406 28.5 14.252 28.5C14.4633 28.5 14.6747 28.4252 14.8445 28.2756C15.2566 27.9086 24.9395 19.1995 24.9395 10.7647C24.9395 4.82837 20.1443 0 14.252 0ZM14.252 16.625C10.978 16.625 8.31445 13.9614 8.31445 10.6875C8.31445 7.41356 10.978 4.75 14.252 4.75C17.5259 4.75 20.1895 7.41356 20.1895 10.6875C20.1895 13.9614 17.5259 16.625 14.252 16.625Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="wp-clip">
          <rect width="28.5" height="28.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function WorldMap({ items, className = "" }: WorldMapProps) {
  const [activeIndex, setActiveIndex]       = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [fading, setFading]                 = useState(false);
  const [isZoomed, setIsZoomed]             = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomInTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomOutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(0);
  activeRef.current = activeIndex;

  const advance = useCallback(() => {
    const next = (activeRef.current + 1) % items.length;
    setFading(true);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setActiveIndex(next);
      setDisplayedIndex(next);
      setFading(false);
    }, FADE_MS);
  }, [items.length]);

  useEffect(() => {
    const id = setInterval(advance, HOLD_MS);
    return () => {
      clearInterval(id);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [advance]);

  // Mobile zoom pulse — independent of the desktop pin/tooltip timing above.
  // Each time activeIndex changes: sit at default briefly, zoom in, hold, zoom back
  // out to default — all comfortably inside the existing HOLD_MS window so it settles
  // back to default before the next location's pulse begins.
  useEffect(() => {
    setIsZoomed(false);
    zoomInTimer.current = setTimeout(() => setIsZoomed(true), 200);
    zoomOutTimer.current = setTimeout(() => setIsZoomed(false), 200 + 700 + 1100);
    return () => {
      if (zoomInTimer.current) clearTimeout(zoomInTimer.current);
      if (zoomOutTimer.current) clearTimeout(zoomOutTimer.current);
    };
  }, [activeIndex]);

  const displayed    = items[displayedIndex];
  const displayedPos = displayed ? POSITIONS[displayed.title] : null;
  const activeItem   = items[activeIndex];
  const activePos    = activeItem ? POSITIONS[activeItem.title] : null;

  return (
    <div className={className}>
      <div className="relative w-full aspect-[3/2] lg:aspect-[1225/604]">
        {/* Image layer — clipped + edge-faded. Separate from pins so the mask
            doesn't cut off tooltips that overflow the map edges. */}
        <div className="absolute inset-0 overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%),linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] lg:[mask-composite:auto] lg:[mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]">
          {/* Mobile: pulses default → zoomed (pivoting on the active location's
              coordinate) → default on each activeIndex change, via isZoomed.
              Desktop: forced back to scale 1 regardless — pins handle it there. */}
          <div
            className="absolute inset-0 scale-[var(--map-zoom)] transition-transform duration-700 ease-in-out lg:!scale-100"
            style={{
              "--map-zoom": isZoomed ? "2.5" : "1",
              transformOrigin: activePos ? `${activePos.x}% ${activePos.y}%` : "50% 50%",
            } as CSSProperties}
          >
            {/* Figma Ellipse 76 — behind the dots, glow baked into SVG */}
            <Image
              src="/images/map/ellipse.svg"
              alt=""
              aria-hidden
              width={1472}
              height={1472}
              className="pointer-events-none absolute w-[120%] h-auto -translate-x-1/2 -translate-y-1/2 left-[54%] top-[55%] opacity-100"
            />
            <Image
              src="/images/map/dots.svg"
              alt="World map showing Torque Pharma global presence"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Pins layer — active pin shows on every breakpoint (anchors the mobile zoom).
            Inactive pins are desktop-only; mobile relies on the zoom effect instead. */}
        {items.map((item, i) => {
          const pos = POSITIONS[item.title];
          if (!pos) return null;
          const isActive = i === activeIndex;
          return (
            <div
              key={item.title}
              className={`absolute -translate-x-1/2 -translate-y-full ${isActive ? "z-10 block" : "z-0 hidden lg:block"}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {isActive ? <BlackPin /> : <RedPin />}
            </div>
          );
        })}

        {/* Floating tooltip — desktop only */}
        {displayedPos && (
          <div
            className={`
              hidden lg:block
              pointer-events-none absolute z-10
              -translate-x-1/2 -translate-y-[calc(100%+29px)]
              transition-opacity duration-[350ms] ease-in-out
              ${fading ? "opacity-0" : "opacity-100"}
            `}
            style={{ left: `${displayedPos.x}%`, top: `${displayedPos.y}%` }}
          >
            <div className="flex min-w-[141px] min-h-[86px] flex-col items-center justify-center rounded-lg border border-primary/30 bg-white p-2 shadow-[0_4px_10.1px_0_color-mix(in_srgb,var(--color-dark-grey)_25%,transparent)]">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-gray-100">
                <Image
                  src={displayed.image}
                  alt={displayed.title}
                  width={56}
                  height={56}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <p className="mt-1.5 whitespace-nowrap text-body-sm font-medium leading-6 capitalize text-center text-primary">
                {displayed.title}
              </p>
            </div>
            <div className="mx-auto w-[2px] h-7 bg-dark-blue" />
          </div>
        )}
      </div>

      {/* Below-map country card — mobile/tablet only (< lg) */}
      {displayed && (
        <div
          className={`
            lg:hidden mt-4
            flex items-center justify-center gap-3
            transition-opacity duration-[350ms] ease-in-out
            ${fading ? "opacity-0" : "opacity-100"}
          `}
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-primary/20">
            <Image
              src={displayed.image}
              alt={displayed.title}
              width={40}
              height={40}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <p className="text-body-sm font-semibold text-dark-grey">{displayed.title}</p>
        </div>
      )}

    </div>
  );
}
