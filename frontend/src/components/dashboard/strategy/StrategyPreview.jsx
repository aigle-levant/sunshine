// src/components/dashboard/strategy/StrategyPreview.jsx
//
// Section 6 — a read-only recap of every choice made above, right before the
// owner commits to generating the strategy.

import { ClipboardList } from "lucide-react";

import useTheme from "../../../hooks/useTheme";

function Row({ label, value, isLight }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <p className="w-40 shrink-0 text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
        {label}
      </p>
      <p className={`text-sm ${isLight ? "text-[#223843]/80" : "text-[#EFF1F3]/80"}`}>{value}</p>
    </div>
  );
}

function StrategyPreview({
  platform,
  brandTone,
  audience,
  businessContext,
  contentGoal,
  postingFrequency,
  contentTypes,
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const cardBg = isLight ? "bg-white border-[#223843]/10" : "bg-[#252525] border-white/10";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <div className="flex items-center gap-2 text-lg font-bold">
        <ClipboardList size={19} className="text-[#D77A61]" />
        Preview Summary
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <Row label="Platform" value={platform || "Instagram"} isLight={isLight} />
        <Row label="Brand Tone" value={brandTone || "N/A"} isLight={isLight} />
        <Row label="Audience" value={audience || "N/A"} isLight={isLight} />
        <Row
          label="Business Context"
          value={businessContext?.trim() ? businessContext : "AI will fill this in"}
          isLight={isLight}
        />
        <Row label="Campaign Goal" value={contentGoal || "Not set"} isLight={isLight} />
        <Row label="Posting Frequency" value={postingFrequency || "Not set"} isLight={isLight} />
        <Row
          label="Content Types"
          value={contentTypes?.length ? contentTypes.join(", ") : "AI Recommended"}
          isLight={isLight}
        />
      </div>
    </div>
  );
}

export default StrategyPreview;
