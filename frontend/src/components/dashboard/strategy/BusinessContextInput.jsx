// src/components/dashboard/strategy/BusinessContextInput.jsx
//
// Section 3 — free-form owner context, with an escape hatch to skip it
// entirely and let AI fill in the gaps.

import { Sparkles } from "lucide-react";

import useTheme from "../../../hooks/useTheme";

function BusinessContextInput({ value, onChange, onAiHandle }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const cardBg = isLight ? "bg-white border-[#223843]/10" : "bg-[#252525] border-white/10";
  const textareaBg = isLight
    ? "bg-[#F5F5F5] border-[#223843]/15"
    : "bg-[#333] border-white/15";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <h3 className="text-lg font-bold">Business Context</h3>
      <p className={`mt-1 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
        Tell AI anything it should know — upcoming festival, seasonal discounts, new product
        launch, preferred tone, target audience, budget, competitor.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Tell AI anything it should know."
        className={`mt-4 w-full resize-y rounded-lg border px-4 py-3 text-sm leading-6 transition-colors duration-300 ${textareaBg} ${
          isLight ? "placeholder-[#223843]/40" : "placeholder-[#EFF1F3]/40"
        }`}
      />

      <div className="mt-4 flex items-center gap-4">
        <span className={`h-px flex-1 ${isLight ? "bg-[#223843]/12" : "bg-white/12"}`} />
        <span className={`text-xs font-semibold ${isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"}`}>
          OR
        </span>
        <span className={`h-px flex-1 ${isLight ? "bg-[#223843]/12" : "bg-white/12"}`} />
      </div>

      <button
        type="button"
        onClick={onAiHandle}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
          isLight
            ? "border-[#223843]/15 text-[#223843] hover:bg-[#223843]/5"
            : "border-white/15 text-[#EFF1F3] hover:bg-white/5"
        }`}
      >
        <Sparkles size={16} className="text-[#D77A61]" />
        Let AI Handle Everything
      </button>
    </div>
  );
}

export default BusinessContextInput;
