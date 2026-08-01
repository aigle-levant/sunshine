// src/components/dashboard/marketing/BrandSummaryCard.jsx
//
// Shown once Instagram analysis succeeds — a snapshot of the profile and the
// brand context Claude derived from it, before moving on to strategy.

import { CheckCircle2 } from "lucide-react";

import useTheme from "../../../hooks/useTheme";

function Stat({ label, value, isLight }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${isLight ? "text-[#223843]" : "text-[#EFF1F3]"}`}>
        {value ?? "N/A"}
      </p>
    </div>
  );
}

function BrandSummaryCard({ profile, brandContext, onContinue }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div>
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 size={20} />
        <h3 className="text-lg font-bold">Instagram Connected</h3>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
        <Stat
          label="Followers"
          value={profile?.followers?.toLocaleString?.() ?? profile?.followers}
          isLight={isLight}
        />
        <Stat label="Business Category" value={profile?.businessCategory} isLight={isLight} />
        <Stat label="Brand Tone" value={brandContext?.brandTone} isLight={isLight} />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
          Content Pillars
        </p>
        <p className={`mt-1 text-sm leading-6 ${isLight ? "text-[#223843]/80" : "text-[#EFF1F3]/80"}`}>
          {brandContext?.contentPillars?.join(", ") || "N/A"}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
          Brand DNA
        </p>
        <p className={`mt-1 text-sm leading-6 ${isLight ? "text-[#223843]/80" : "text-[#EFF1F3]/80"}`}>
          {brandContext?.brandDNA || "N/A"}
        </p>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 w-full rounded-lg bg-[#D77A61] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C96B53] sm:w-auto"
      >
        Continue →
      </button>
    </div>
  );
}

export default BrandSummaryCard;
