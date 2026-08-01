// src/components/dashboard/DayCard.jsx
//
// One card per day of the generated weekly plan. Purely presentational —
// scheduling and regenerating are handled by the parent page.

import { useState } from "react";
import { Clock, Image as ImageIcon, Loader, RefreshCw, Sparkles } from "lucide-react";

function PlatformBadge({ platform, isLight }) {
  const isInstagram = String(platform).toLowerCase().includes("instagram");

  const bg = isInstagram
    ? "bg-gradient-to-r from-[#D77A61] to-[#c9536b]"
    : "bg-gradient-to-r from-[#25D366] to-[#128C7E]";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${bg}`}>
      {isInstagram ? "Instagram" : "WhatsApp"}
    </span>
  );
}

function Section({ label, children, isLight }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">{label}</p>
      <div className={`mt-1 text-sm leading-6 ${isLight ? "text-[#223843]/80" : "text-[#EFF1F3]/80"}`}>
        {children}
      </div>
    </div>
  );
}

function DayCard({ day, isLight, onSchedule, onRegenerate, isScheduled = false, isRegenerating = false }) {
  const [scheduling, setScheduling] = useState(false);

  const cardBg = isLight
    ? "bg-white/80 border-[#223843]/10"
    : "bg-[#252525]/80 border-white/10";

  const handleSchedule = async () => {
    setScheduling(true);
    try {
      await onSchedule?.(day);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm backdrop-blur-md transition-colors duration-300 ${cardBg}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold">{day.day}</h3>
          <PlatformBadge platform={day.platform} isLight={isLight} />
        </div>
        {day.bestTime && (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"
            }`}
          >
            <Clock size={14} />
            {day.bestTime}
          </span>
        )}
      </div>

      <h4 className="mb-1 text-base font-semibold">{day.title}</h4>
      {day.objective && (
        <p className={`mb-4 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
          {day.objective}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {day.caption && (
          <Section label="Instagram Caption" isLight={isLight}>
            {day.caption}
          </Section>
        )}

        {day.whatsappMessage && (
          <Section label="WhatsApp Message" isLight={isLight}>
            {day.whatsappMessage}
          </Section>
        )}

        {Array.isArray(day.hashtags) && day.hashtags.length > 0 && (
          <Section label="Hashtags" isLight={isLight}>
            <span className="text-[#D77A61]">
              {day.hashtags.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)).join(" ")}
            </span>
          </Section>
        )}

        {day.imagePrompt && (
          <Section label="Image Prompt" isLight={isLight}>
            <span className="flex items-start gap-2">
              <ImageIcon size={14} className="mt-0.5 flex-shrink-0" />
              {day.imagePrompt}
            </span>
          </Section>
        )}

        {day.aiTool && (
          <Section label="Suggested Tool" isLight={isLight}>
            {day.aiTool}
          </Section>
        )}
      </div>

      <div className="mt-6 flex gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={handleSchedule}
          disabled={scheduling || isScheduled}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 ${
            isScheduled ? "bg-[#223843]/40" : "bg-[#D77A61] hover:bg-[#C96B53]"
          } ${scheduling ? "opacity-60" : ""}`}
        >
          {scheduling ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          {isScheduled ? "Scheduled" : scheduling ? "Scheduling..." : "Schedule"}
        </button>

        <button
          type="button"
          onClick={() => onRegenerate?.(day)}
          disabled={isRegenerating}
          className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
            isLight
              ? "border-[#223843]/15 text-[#223843] hover:bg-[#223843]/5"
              : "border-white/15 text-[#EFF1F3] hover:bg-white/5"
          } ${isRegenerating ? "opacity-60" : ""}`}
        >
          <RefreshCw size={16} className={isRegenerating ? "animate-spin" : ""} />
          Regenerate
        </button>
      </div>
    </div>
  );
}

export default DayCard;
