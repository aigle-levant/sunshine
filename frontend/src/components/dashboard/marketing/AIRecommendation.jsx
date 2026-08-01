// src/components/dashboard/marketing/AIRecommendation.jsx
//
// Shown after "Let AI Decide" calls the backend's platform-recommendation
// endpoint. Only Instagram has a working connect flow today, so that's the
// only platform offered a direct "Use" action.

import { Sparkles } from "lucide-react";

import useTheme from "../../../hooks/useTheme";

function AIRecommendation({ recommendation, onUseInstagram, onChooseAnother }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const isInstagram = String(recommendation?.recommendedPlatform)
    .toLowerCase()
    .includes("instagram");

  return (
    <div>
      <div className="flex items-center gap-2 text-[#D77A61]">
        <Sparkles size={20} />
        <h3 className="text-lg font-bold">AI Recommendation</h3>
      </div>

      <p className={`mt-4 text-xl font-bold ${isLight ? "text-[#223843]" : "text-[#EFF1F3]"}`}>
        {recommendation?.recommendedPlatform}
      </p>

      <p className={`mt-2 text-sm leading-6 ${isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"}`}>
        {recommendation?.reason}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {isInstagram && (
          <button
            type="button"
            onClick={onUseInstagram}
            className="rounded-lg bg-[#D77A61] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C96B53]"
          >
            Use Instagram
          </button>
        )}

        <button
          type="button"
          onClick={onChooseAnother}
          className={`rounded-lg border px-6 py-3 text-sm font-semibold transition-colors duration-300 ${
            isLight
              ? "border-[#223843]/15 text-[#223843] hover:bg-[#223843]/5"
              : "border-white/15 text-[#EFF1F3] hover:bg-white/5"
          }`}
        >
          Choose Another Platform
        </button>
      </div>
    </div>
  );
}

export default AIRecommendation;
