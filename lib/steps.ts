// The guided path. The same copy appears on the home page and in the wizard.
export const STEPS = [
  {
    n: 1,
    title: "Speak or paste a recap",
    body: "Dictate with Wispr Flow or paste a transcript. Filler words and self-corrections are fine.",
  },
  {
    n: 2,
    title: "Review what it found",
    body: "Decisions, owners and deadlines are pulled out. Anything that contradicts an earlier decision is flagged.",
  },
  {
    n: 3,
    title: "Confirm to create tasks",
    body: "Nothing is saved or sent until you confirm. Then tasks are created and tracked per person.",
  },
] as const;
