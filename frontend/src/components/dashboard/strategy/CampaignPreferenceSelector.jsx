// src/components/dashboard/strategy/CampaignPreferenceSelector.jsx
//
// Section 4 — multi-select content-type chips. Empty selection reads as
// "AI Recommended" rather than "nothing chosen".

import useTheme from "../../../hooks/useTheme";

export const CAMPAIGN_PREFERENCE_OPTIONS = [
  "Instagram Posts",
  "Instagram Reels",
  "Stories",
  "WhatsApp Campaigns",
  "Educational",
  "Promotional",
  "Festive",
  "Engagement",
  "Behind the Scenes",
];

function CampaignPreferenceSelector({ selected = [], onToggle }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const cardBg = isLight ? "bg-white border-[#223843]/10" : "bg-[#252525] border-white/10";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <h3 className="text-lg font-bold">Campaign Preferences</h3>
      <p className={`mt-1 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
        {selected.length ? "Selected content types" : "AI Recommended"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {CAMPAIGN_PREFERENCE_OPTIONS.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                isSelected
                  ? "border-[#D77A61] bg-[#D77A61] text-white"
                  : isLight
                    ? "border-[#223843]/15 text-[#223843]/70 hover:border-[#D77A61]/60"
                    : "border-white/15 text-[#EFF1F3]/70 hover:border-[#D77A61]/60"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CampaignPreferenceSelector;
