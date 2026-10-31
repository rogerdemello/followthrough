// Seed data for the demo. See docs/06-demo-script-and-seed-data.md.

export const MEETING1 = {
  title: "Product sync",
  heldOn: "2026-10-26",
  source: "paste" as const,
  text: `Priya: Okay, let's lock the plan. We're launching the beta on November 15th.
Rahul: Fine by me. For payments I'd go with Stripe, it's what I know best.
Priya: Agreed, Stripe it is. Rahul, can you have the payments integration done by November 8th?
Rahul: Yes, November 8th works.
Meera: I'll finish the onboarding screens by November 5th.
Arjun: I'll draft the launch announcement and share it by November 10th.
Priya: Great. Let's also keep the beta invite-only for the first two weeks.`,
  decisions: [
    { text: "Launch the beta on November 15", topic: "beta launch date" },
    { text: "Use Stripe as the payments provider", topic: "payments provider" },
    { text: "Keep the beta invite-only for the first two weeks", topic: "beta access" },
  ],
  actions: [
    { text: "Finish the payments integration", owner: "Rahul", due_on: "2026-11-08" },
    { text: "Finish the onboarding screens", owner: "Meera", due_on: "2026-11-05" },
    { text: "Draft and share the launch announcement", owner: "Arjun", due_on: "2026-11-10" },
  ],
};

export const MEETING2 = {
  title: "Beta plan check-in",
  heldOn: "2026-10-29",
  source: "dictated" as const,
  text: `Okay so, um, quick recap of today's call with the team. So basically we talked about, uh, the beta date and honestly it's not going to work, Rahul said payments needs more time, so we're pushing the beta to December 1st. And on payments, um, Rahul found out Stripe is a pain for Indian customers, so we're going to switch to Razorpay instead. Rahul will own that, he'll have it done by, uh, Thursday, no wait, Friday the 13th of November. Meera needs to update the onboarding screens for the new payment flow, that's by November 18th. Oh and Arjun should move the launch announcement to the week of November 23rd, I'll say the 24th. Anyway, that's it.`,
};
