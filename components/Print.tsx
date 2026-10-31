import Photo from "@/components/Photo";
import type { PhotoKey } from "@/lib/photos";

/** A photo styled as a taped-up print, with an optional handwritten caption. Straightens on hover. */
export default function Print({
  name,
  width = 700,
  caption,
  rotate = "-2deg",
  tape = true,
  priority = false,
  className = "",
}: {
  name: PhotoKey;
  width?: number;
  caption?: string;
  rotate?: string;
  tape?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure
      style={{ "--r": rotate } as React.CSSProperties}
      className={`rotate-[var(--r)] border border-ink/10 bg-card p-2.5 pb-10 shadow-[0_14px_28px_-12px_rgba(27,26,23,0.45)] transition duration-300 hover:rotate-0 ${className}`}
    >
      {tape && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-mark/70 shadow-sm"
        />
      )}
      <Photo name={name} width={width} priority={priority} className="aspect-[4/3] w-full" />
      {caption && (
        <figcaption className="absolute bottom-1.5 left-4 font-hand text-xl leading-none text-ink-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
