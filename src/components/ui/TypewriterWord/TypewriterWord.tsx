"use client";

import { useEffect, useState } from "react";

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
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!words.length) return;

    const currentWord = words[wordIndex];

    if (isPaused) {
      const t = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseMs);
      return () => clearTimeout(t);
    }

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
        return;
      }
      const t = setTimeout(
        () => setDisplayText((s) => s.slice(0, -1)),
        deletingSpeed
      );
      return () => clearTimeout(t);
    }

    if (displayText.length === currentWord.length) {
      setIsPaused(true);
      return;
    }

    const t = setTimeout(
      () => setDisplayText(currentWord.slice(0, displayText.length + 1)),
      typingSpeed
    );
    return () => clearTimeout(t);
  }, [displayText, wordIndex, isDeleting, isPaused, words, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span className={className}>
      {displayText}
      <span className="inline-block w-[0.55em] h-[1.5px] bg-current align-baseline animate-[blink_1s_step-end_infinite] ml-[1px] translate-y-[-1px]" />
    </span>
  );
}
