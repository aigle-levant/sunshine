// src/components/dashboard/GenerateWeekButton.jsx
//
// The "Generate AI Week" button. While a generation request is in flight it
// cycles status lines inside itself rather than replacing the page with a
// loading panel — the table stays on screen throughout.
//
// The request is one round trip; these lines are narration, not progress. They
// stop on the last one instead of looping, so a slow response reads as "still
// working" rather than starting again.

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const PLANNING_STEPS = [
  "✨ Understanding your business...",
  "📸 Applying Instagram brand voice...",
  "✍️ Creating weekly content...",
  "📅 Building your content calendar...",
];

/**
 * Mounted only while a request is in flight, which is what starts the narration
 * from the top each time — no counter to reset, and the only state update
 * happens in the interval callback.
 */
function PlanningNarration() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, PLANNING_STEPS.length - 1));
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  return PLANNING_STEPS[stepIndex];
}

function GenerateWeekButton({ onGenerate, isLoading }) {
  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={isLoading}
      aria-busy={isLoading}
      // A fixed minimum width keeps the narration from resizing the button —
      // and with it the whole toolbar — on every step.
      className="flex min-w-[15rem] items-center justify-center gap-2.5 rounded-full bg-[#D77A61] px-6 py-3 text-[13.5px] font-semibold text-[#EFF1F3] transition-colors duration-300 hover:bg-[#C96B53] disabled:cursor-default disabled:hover:bg-[#D77A61]"
    >
      <Sparkles
        size={16}
        strokeWidth={2}
        className={isLoading ? "animate-pulse" : undefined}
      />
      {isLoading ? <PlanningNarration /> : "Generate AI Week"}
    </button>
  );
}

export default GenerateWeekButton;
