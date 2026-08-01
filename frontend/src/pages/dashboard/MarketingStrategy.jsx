// src/pages/dashboard/MarketingStrategy.jsx
//
// Sits between Instagram/X analysis and the Weekly Planner. The owner reviews
// what the AI already understood about their brand (from router state — no
// Instagram scrape or brand-DNA call happens here), adds optional context and
// preferences, then generates a marketing strategy that's handed off to the
// planner. This page never schedules or builds a calendar itself.

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Sparkles } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { buildBusinessSummary, generateMarketingStrategy } from "../../services/planner";

import PlatformSummaryCard from "../../components/dashboard/strategy/PlatformSummaryCard";
import BrandDNAEditor from "../../components/dashboard/strategy/BrandDNAEditor";
import BusinessContextInput from "../../components/dashboard/strategy/BusinessContextInput";
import CampaignPreferenceSelector from "../../components/dashboard/strategy/CampaignPreferenceSelector";
import GenerationSettings from "../../components/dashboard/strategy/GenerationSettings";
import StrategyPreview from "../../components/dashboard/strategy/StrategyPreview";
import GeneratedStrategyCard from "../../components/dashboard/strategy/GeneratedStrategyCard";

function brandDnaFromContext(brandContext) {
  if (!brandContext) return "";
  if (brandContext.brandDNA) return brandContext.brandDNA;

  const tone = brandContext.brandTone || "confident and approachable";
  const audience = brandContext.audience || "its core audience";

  return `This brand connects with ${audience} through ${tone.toLowerCase()} storytelling and consistent, high-quality content.`;
}

function MarketingStrategy() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const location = useLocation();
  const navigate = useNavigate();

  // This page only ever reads the profile/brandContext handed to it by the
  // previous step — it never re-runs Instagram analysis or brand-DNA
  // generation itself.
  const profile = location.state?.profile ?? null;
  const brandContext = location.state?.brandContext ?? null;

  const [brandDna, setBrandDna] = useState(brandDnaFromContext(brandContext));
  const [businessContext, setBusinessContext] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [postingFrequency, setPostingFrequency] = useState("3x per week");
  const [contentGoal, setContentGoal] = useState("Awareness");
  const [targetAudience, setTargetAudience] = useState("");
  const [generating, setGenerating] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [error, setError] = useState("");

  const textColor = isLight ? "text-[#223843]" : "text-[#EFF1F3]";

  if (!brandContext) {
    return (
      <div className={textColor}>
        <div
          className={`rounded-2xl border border-dashed p-12 text-center ${
            isLight ? "border-[#223843]/20" : "border-white/20"
          }`}
        >
          <p className="text-lg font-semibold">No brand analysis found.</p>
          <p className={`mt-2 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
            Please analyse an Instagram account first.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/marketing")}
            className="mt-6 rounded-lg bg-[#D77A61] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C96B53]"
          >
            Go to Marketing
          </button>
        </div>
      </div>
    );
  }

  const togglePreference = (option) => {
    setSelectedPreferences((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
    );
  };

  const handleGenerate = async () => {
    setError("");
    setGenerating(true);

    try {
      const businessSummary = buildBusinessSummary();

      const result = await generateMarketingStrategy({
        businessSummary,
        brandContext: { ...brandContext, brandDNA: brandDna },
        platformAnalysis: profile,
        ownerContext: businessContext,
        campaignPreferences: selectedPreferences,
        postingFrequency,
        contentGoal,
      });

      setStrategy(result);
    } catch (err) {
      setError(err.message || "Failed to generate marketing strategy");
    } finally {
      setGenerating(false);
    }
  };

  const handleContinue = () => {
    navigate("/dashboard/weekly-planner", { state: { strategy, brandContext, profile } });
  };

  return (
    <div className={textColor}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Marketing Strategy</h1>
        <p className={`mt-2 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
          Review your brand profile and help the AI create better marketing content.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-[#D77A61]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {strategy ? (
        <GeneratedStrategyCard strategy={strategy} onContinue={handleContinue} />
      ) : (
        <div className="flex flex-col gap-6">
          <PlatformSummaryCard
            emoji="📸"
            name="Instagram"
            profile={profile}
            brandContext={brandContext}
          />

          <BrandDNAEditor value={brandDna} onChange={setBrandDna} />

          <BusinessContextInput
            value={businessContext}
            onChange={setBusinessContext}
            onAiHandle={() => setBusinessContext("")}
          />

          <CampaignPreferenceSelector selected={selectedPreferences} onToggle={togglePreference} />

          <GenerationSettings
            postingFrequency={postingFrequency}
            onPostingFrequencyChange={setPostingFrequency}
            contentGoal={contentGoal}
            onContentGoalChange={setContentGoal}
            targetAudience={targetAudience}
            onTargetAudienceChange={setTargetAudience}
          />

          <StrategyPreview
            platform="Instagram"
            brandTone={brandContext?.brandTone}
            audience={brandContext?.audience}
            businessContext={businessContext}
            contentGoal={contentGoal}
            postingFrequency={postingFrequency}
            contentTypes={selectedPreferences}
          />

          {generating ? (
            <div
              className={`flex flex-col items-center gap-3 rounded-2xl border p-10 text-center ${
                isLight ? "border-[#223843]/10 bg-white/70" : "border-white/10 bg-[#252525]/70"
              }`}
            >
              <Sparkles size={22} className="animate-pulse text-[#D77A61]" />
              <p className="text-sm font-medium">Generating your marketing strategy...</p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#D77A61] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C96B53]"
              >
                <Sparkles size={18} />
                Generate Marketing Strategy
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors duration-300 ${
                  isLight
                    ? "border-[#223843]/15 text-[#223843] hover:bg-[#223843]/5"
                    : "border-white/15 text-[#EFF1F3] hover:bg-white/5"
                }`}
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MarketingStrategy;
