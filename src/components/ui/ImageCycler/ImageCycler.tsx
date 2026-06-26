"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { ImageCyclerProps } from "./ImageCycler.types";

const SLIDE_MS = 900;

export default function ImageCycler({
  images,
  alt = "",
  initialIndex = 0,
  offset = 0,
  interval = 5000,
  sizes = "(max-width: 1024px) 50vw, 25vw",
  className = "",
}: ImageCyclerProps) {
  const count = images.length;
  const [current, setCurrent] = useState(count > 0 ? initialIndex % count : 0);
  const [prev, setPrev] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const slidingRef = useRef(false);
  const currentRef = useRef(current);
  currentRef.current = current;

  useEffect(() => {
    if (count <= 1) return;
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (slidingRef.current) return;
        const next = (currentRef.current + 1) % count;
        slidingRef.current = true;
        setPrev(currentRef.current);
        setCurrent(next);
        setIsSliding(true);
        setTimeout(() => {
          slidingRef.current = false;
          setIsSliding(false);
          setPrev(null);
        }, SLIDE_MS);
      }, interval);
    }, offset);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [count, interval, offset]);

  if (!count) return null;

  const enterAnim = "animate-[slideInRight_900ms_cubic-bezier(0.4,0,0.2,1)_forwards]";
  const exitAnim  = "animate-[slideOutLeft_900ms_cubic-bezier(0.4,0,0.2,1)_forwards]";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Exiting image */}
      {isSliding && prev !== null && (
        <div className={`absolute inset-0 ${exitAnim}`}>
          <Image
            src={images[prev]}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      )}

      {/* Entering image */}
      <div className={`absolute inset-0 ${isSliding ? enterAnim : ""}`}>
        <Image
          src={images[current]}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    </div>
  );
}
