// src/components/dashboard/marketing/PlatformSelector.jsx
//
// Step 1 of the marketing onboarding flow — pick a platform, or let AI decide.

import useTheme from "../../../hooks/useTheme";
import PlatformCard from "./PlatformCard";

function PlatformSelector({ selected, onSelectInstagram, onRecommend }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div>
      <h3 className="text-lg font-bold">Where would you like to market?</h3>
      <p className={`mt-1.5 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
        Choose a platform or let AI recommend one based on your business.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <PlatformCard
          emoji="📸"
          title="Instagram"
          features={["Reels", "Posts", "Stories"]}
          ctaLabel="Select"
          selected={selected === "instagram"}
          onSelect={onSelectInstagram}
        />

        <PlatformCard
          emoji="✨"
          title="Let AI Decide"
          features={["Analyse business", "Recommend the best platform"]}
          ctaLabel="Recommend"
          selected={selected === "ai"}
          onSelect={onRecommend}
        />
      </div>
    </div>
  );
}

export default PlatformSelector;
