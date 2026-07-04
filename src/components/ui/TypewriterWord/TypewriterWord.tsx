"use client";

import { useEffect, useRef } from "react";

interface TypewriterWordProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
}

export default function TypewriterWord({
  words,
  typingSpeed = 160,
  deletingSpeed = 100,
  pauseMs = 2800,
  className = "",
}: TypewriterWordProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!words.length) return;
    const el = spanRef.current;
    if (!el) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = words[wordIndex];
      if (isDeleting) {
        el.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timer = setTimeout(tick, typingSpeed);
        } else {
          timer = setTimeout(tick, deletingSpeed);
        }
      } else {
        el.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          timer = setTimeout(tick, pauseMs);
        } else {
          timer = setTimeout(tick, typingSpeed);
        }
      }
    };

    timer = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timer);
  }, [words, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span className={className} aria-live="polite" aria-atomic="true">
      <span ref={spanRef} />
      <span aria-hidden="true" className="inline-block w-[0.55em] h-[1.5px] bg-current align-baseline animate-[blink_1s_step-end_infinite] ml-[1px] translate-y-[-1px]" />
    </span>
  );
}
