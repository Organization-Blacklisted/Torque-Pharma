"use client";
import { useRef, useState } from "react";
import Image from "next/image";

export interface VideoSource {
  src: string;
  type: "video/mp4" | "video/webm" | "video/ogg";
  media?: string;
}

interface VideoBackgroundProps {
  sources: VideoSource[];
  poster?: string;
  className?: string;
  showAudioToggle?: boolean;
}

function AudioMutedIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 9v6h4l6 5V4L7 9H3z" fill="currentColor" />
      <path d="M15 9.5l5 5M20 9.5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AudioOnIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 9v6h4l6 5V4L7 9H3z" fill="currentColor" />
      <path d="M16 8.5a5 5 0 010 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 6a9 9 0 010 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function VideoBackground({
  sources,
  poster,
  className = "",
  showAudioToggle = false,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <>
      {/* Poster — Next.js Image with priority triggers <link rel="preload"> in <head>,
          serves AVIF/WebP, and is sized correctly. Fades out once video is playing. */}
      {poster && (
        <Image
          src={poster}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className={`absolute inset-0 object-cover transition-opacity duration-700 ease-in-out ${
            videoPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />
      )}

      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        title="Background video"
        onPlaying={() => setVideoPlaying(true)}
        aria-hidden="true"
      >
        {sources.map(({ src, type, media }) => (
          <source key={src} src={src} type={type} {...(media ? { media } : {})} />
        ))}
      </video>

      {showAudioToggle && (
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="absolute bottom-4 right-4 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-dark-blue/60 text-white backdrop-blur-sm transition-all hover:bg-primary"
        >
          {isMuted ? <AudioMutedIcon /> : <AudioOnIcon />}
        </button>
      )}
    </>
  );
}