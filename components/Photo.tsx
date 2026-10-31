"use client";

import { useState } from "react";
import { PHOTOS, photoUrl, type PhotoKey } from "@/lib/photos";

/** A photo, slightly warmed to sit on paper. Falls back to a plain tint if the image can't load. */
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
  if (failed) return <div aria-hidden className={`bg-paper-2 ${className}`} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photoUrl(name, width)}
      alt={PHOTOS[name].alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover [filter:sepia(0.22)_saturate(0.85)_contrast(1.03)] ${className}`}
    />
  );
}
