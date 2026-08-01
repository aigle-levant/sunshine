// src/components/dashboard/strategy/GeneratedStrategyCard.jsx
//
// The result of a successful /api/planner/generate-strategy call, plus the
// CTA that hands the strategy off to the Weekly Planner.

import { ArrowRight, CheckCircle2 } from "lucide-react";

import useTheme from "../../../hooks/useTheme";

function Block({ label, children, isLight }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">{label}</p>
      <div className={`mt-1.5 text-sm leading-6 ${isLight ? "text-[#223843]/80" : "text-[#EFF1F3]/80"}`}>
        {children}
      </div>
    </div>
  );
}

function GeneratedStrategyCard({ strategy, onContinue }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const cardBg = isLight ? "bg-white border-[#223843]/10" : "bg-[#252525] border-white/10";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 size={20} />
        <h3 className="text-lg font-bold">Strategy Generated</h3>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <Block label="Marketing Objective" isLight={isLight}>
          {strategy?.marketingObjective || "N/A"}
        </Block>

        <Block label="Weekly Theme" isLight={isLight}>
          {strategy?.weeklyTheme || "N/A"}
        </Block>

        <Block label="Recommended Platforms" isLight={isLight}>
          {strategy?.recommendedPlatforms?.join(", ") || "N/A"}
        </Block>

        {Array.isArray(strategy?.contentMix) && strategy.contentMix.length > 0 && (
          <Block label="Content Mix" isLight={isLight}>
            <div className="flex flex-wrap gap-2">
              {strategy.contentMix.map((entry) => (
                <span
                  key={entry.type}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isLight ? "bg-[#223843]/6 text-[#223843]/70" : "bg-white/8 text-[#EFF1F3]/70"
                  }`}
                >
                  {entry.type} · {entry.percentage}%
                </span>
              ))}
            </div>
          </Block>
        )}

        {Array.isArray(strategy?.keyMessages) && strategy.keyMessages.length > 0 && (
          <Block label="Key Messages" isLight={isLight}>
            <ul className="list-disc space-y-1 pl-5">
              {strategy.keyMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </Block>
        )}

        <Block label="CTA Style" isLight={isLight}>
          {strategy?.ctaStyle || "N/A"}
        </Block>

        <Block label="Image Style" isLight={isLight}>
          {strategy?.imageStyle || "N/A"}
        </Block>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#D77A61] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C96B53] sm:w-auto"
      >
        Continue to Weekly Planner
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

export default GeneratedStrategyCard;
