// src/components/dashboard/strategy/PlatformSummaryCard.jsx
//
// One connected-platform snapshot in the Marketing Strategy page's Section 1.
// Purely presentational — the parent decides which platforms to render.

import { CheckCircle2 } from "lucide-react";

import useTheme from "../../../hooks/useTheme";

function Stat({ label, value, isLight }) {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${isLight ? "text-[#223843]" : "text-[#EFF1F3]"}`}>
        {value}
      </p>
    </div>
  );
}

function PlatformSummaryCard({ emoji, name, profile, brandContext, selected = true }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const cardBg = isLight ? "bg-white border-[#223843]/10" : "bg-[#252525] border-white/10";

  const followers =
    typeof profile?.followers === "number" ? profile.followers.toLocaleString() : profile?.followers;

  return (
    <div
      className={`rounded-2xl border p-6 transition-colors duration-300 ${cardBg} ${
        selected ? "border-[#D77A61]" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-bold">
          <span className="text-2xl">{emoji}</span>
          {name}
        </div>

        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-green-600">
          <CheckCircle2 size={14} />
          Connected
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <Stat label="Followers" value={followers} isLight={isLight} />
        <Stat label="Tone" value={brandContext?.brandTone} isLight={isLight} />
        <Stat label="Audience" value={brandContext?.audience} isLight={isLight} />
      </div>

      {Array.isArray(brandContext?.contentPillars) && brandContext.contentPillars.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
            Content Pillars
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {brandContext.contentPillars.map((pillar) => (
              <span
                key={pillar}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isLight ? "bg-[#223843]/6 text-[#223843]/70" : "bg-white/8 text-[#EFF1F3]/70"
                }`}
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className="mt-5 inline-flex items-center rounded-lg bg-[#D77A61] px-4 py-1.5 text-xs font-semibold text-white">
          Selected
        </div>
      )}
    </div>
  );
}

export default PlatformSummaryCard;
