// Shared class strings so every screen uses the same buttons, cards and inputs.

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50";

export const btn = {
  primary: `${buttonBase} bg-indigo-600 text-white shadow-sm hover:bg-indigo-700`,
  secondary: `${buttonBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`,
  ghost: `${buttonBase} text-slate-600 hover:bg-slate-100`,
  large: "px-5 py-3 text-base",
};

export const card = "rounded-xl border border-slate-200 bg-white shadow-sm";

export const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export const sectionLabel = "text-xs font-semibold uppercase tracking-wider text-slate-500";
