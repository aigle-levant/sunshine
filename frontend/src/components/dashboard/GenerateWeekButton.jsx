// src/components/dashboard/GenerateWeekButton.jsx
//
// The "Generate Weekly Plan" button. While a generation request is in flight
// it cycles through a fixed list of status lines instead of a plain spinner —
// the request itself is one round trip, this is just narration.

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

export const PLANNING_STEPS = [
  "🧠 Understanding your business...",
  "📱 Analysing Instagram style...",
  "🗓 Planning Monday...",
  "🗓 Planning Tuesday...",
  "🗓 Planning Wednesday...",
  "🗓 Planning Thursday...",
  "🗓 Planning Friday...",
  "🗓 Planning Saturday...",
  "🗓 Planning Sunday...",
  "✨ Building your marketing calendar...",
];

function GenerateWeekButton({ onGenerate, isLoading, isLight }) {
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      setStepIndex(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, PLANNING_STEPS.length - 1));
    }, 900);

    return () => clearInterval(intervalRef.current);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div
        className={`flex w-full flex-col items-center gap-3 rounded-2xl border p-8 text-center ${
          isLight ? "border-[#223843]/10 bg-white/70" : "border-white/10 bg-[#252525]/70"
        }`}
      >
        <Sparkles size={22} className="animate-pulse text-[#D77A61]" />
        <p className="text-sm font-medium">{PLANNING_STEPS[stepIndex]}</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onGenerate}
      className="flex items-center justify-center gap-2 rounded-lg bg-[#D77A61] px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#C96B53]"
    >
      <Sparkles size={18} />
      Generate Weekly Plan
    </button>
  );
}

export default GenerateWeekButton;
