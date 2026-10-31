// Shared class strings so every screen uses the same buttons, cards and inputs.
// Palette and fonts live in app/globals.css (@theme).

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50";

export const btn = {
  primary: `${buttonBase} bg-ink text-paper shadow-[3px_3px_0_0_var(--color-accent)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_0_var(--color-accent)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_0_var(--color-accent)]`,
  secondary: `${buttonBase} border border-ink bg-card text-ink hover:bg-paper-2`,
  ghost: `${buttonBase} text-ink-2 hover:bg-paper-2`,
  large: "px-6 py-3 text-base",
};

/** Flat paper card with a hard offset shadow. */
export const card = "rounded-md border border-ink/15 bg-card text-ink shadow-[4px_4px_0_0_var(--color-rule)]";

export const input =
  "w-full rounded-md border border-ink/25 bg-card px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent/30";

/** Section heading in the serif face. */
export const sectionLabel = "font-display text-xl font-semibold text-ink";
