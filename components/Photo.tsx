"use client";

import { useState } from "react";
import { PHOTOS, photoUrl, type PhotoKey } from "@/lib/photos";

/** A photo that falls back to a soft gradient if the image can't load. */
export default function Photo({
  name,
  width = 800,
  className = "",
  priority = false,
}: {
  name: PhotoKey;
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        aria-hidden
        className={`bg-gradient-to-br from-indigo-500/40 via-violet-500/30 to-cyan-400/30 ${className}`}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photoUrl(name, width)}
      alt={PHOTOS[name].alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
