// Shared class strings so every screen uses the same buttons, cards and inputs.

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-50";

export const btn = {
  primary: `${buttonBase} bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/50`,
  secondary: `${buttonBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`,
  /** For use on the dark background. */
  glass: `${buttonBase} border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20`,
  ghost: `${buttonBase} text-slate-600 hover:bg-slate-100`,
  large: "px-6 py-3 text-base",
};

/** White surface for forms, tables and anything dense. */
export const card = "rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-lg shadow-black/10";

/** Dark frosted surface for marketing and summary content. */
export const glass =
  "rounded-2xl border border-white/10 bg-white/[0.05] text-white shadow-xl shadow-black/20 backdrop-blur-md";

export const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export const sectionLabel = "text-xs font-semibold uppercase tracking-wider text-slate-500";
export const sectionLabelDark = "text-xs font-semibold uppercase tracking-wider text-indigo-200/80";
