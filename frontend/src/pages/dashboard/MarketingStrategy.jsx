// src/pages/dashboard/MarketingStrategy.jsx
//
// Sits between Brand Integration and the Weekly Planner. The owner reviews
// what the AI already understood about their brand — handed over by router
// state when arriving straight from Brand Integration, or read back from the
// saved analysis on a direct visit — adds optional context and preferences,
// then generates a marketing strategy that's handed off to the planner. This
// page never schedules or builds a calendar itself, and never re-runs
// Instagram analysis or brand-DNA generation.

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Sparkles } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import demoUser from "../../constants/demoUser";
import { buildBusinessSummary, generateMarketingStrategy } from "../../services/planner";
import { getLatestInstagramAnalysis } from "../../services/instagram";

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

  // Handed over by Brand Integration on navigation; absent on a direct visit,
  // in which case the saved analysis is read back below.
  const [profile, setProfile] = useState(location.state?.profile ?? null);
  const [brandContext, setBrandContext] = useState(location.state?.brandContext ?? null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(!location.state?.brandContext);
  const platform = "Instagram";

  useEffect(() => {
    if (location.state?.brandContext) return;

    let cancelled = false;

    getLatestInstagramAnalysis(demoUser.id)
      .then((result) => {
        if (cancelled || !result) return;

        setProfile(result.profile);
        setBrandContext(result.brandContext);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingAnalysis(false);
      });

    return () => {
      cancelled = true;
    };
    // Only ever runs for the direct-visit case, once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [brandDna, setBrandDna] = useState(brandDnaFromContext(brandContext));

  // Fills in once the direct-visit fetch above resolves; a no-op when brand
  // context already arrived via router state.
  useEffect(() => {
    if (brandContext) setBrandDna(brandDnaFromContext(brandContext));
  }, [brandContext]);

  const [businessContext, setBusinessContext] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [postingFrequency, setPostingFrequency] = useState("3x per week");
  const [contentGoal, setContentGoal] = useState("Awareness");
  const [targetAudience, setTargetAudience] = useState("");
  const [generating, setGenerating] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [error, setError] = useState("");

  const textColor = isLight ? "text-[#223843]" : "text-[#EFF1F3]";

  if (loadingAnalysis) {
    return (
      <div className={textColor}>
        <div
          className={`flex flex-col items-center gap-3 rounded-2xl border border-dashed p-12 text-center ${
            isLight ? "border-[#223843]/20" : "border-white/20"
          }`}
        >
          <Sparkles size={22} className="animate-pulse text-[#D77A61]" />
          <p className="text-sm font-medium">Checking for a saved brand analysis...</p>
        </div>
      </div>
    );
  }

  if (!brandContext) {
    return (
      <div className={textColor}>
        <div
          className={`rounded-2xl border border-dashed p-12 text-center ${
            isLight ? "border-[#223843]/20" : "border-white/20"
          }`}
        >
          <p className="text-lg font-semibold">No Brand Analysis found.</p>
          <p className={`mt-2 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
            Connect and analyse a platform in Brand Integration first.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/brand-integration")}
            className="mt-6 rounded-lg bg-[#D77A61] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C96B53]"
          >
            Go to Brand Integration
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

  const handleGenerate = async (contextOverride) => {
    setError("");
    setGenerating(true);

    try {
      const businessSummary = buildBusinessSummary();

      const result = await generateMarketingStrategy({
        businessSummary,
        brandContext: { ...brandContext, brandDNA: brandDna },
        platformAnalysis: profile,
        ownerContext: contextOverride ?? businessContext,
        campaignPreferences: selectedPreferences,
        postingFrequency,
        contentGoal,
        platform,
      });

      setStrategy(result);
    } catch (err) {
      setError(err.message || "Failed to generate marketing strategy");
    } finally {
      setGenerating(false);
    }
  };

  const handleContinue = () => {
    navigate("/dashboard/weekly-planner", { state: { strategy, brandContext, profile, platform } });
  };

  const handleCreateContent = () => {
    const prompt = [
      strategy?.weeklyTheme,
      strategy?.marketingObjective,
      Array.isArray(strategy?.keyMessages) ? strategy.keyMessages.join(". ") : null,
    ]
      .filter(Boolean)
      .join(" — ");

    navigate("/dashboard/content-studio", {
      state: {
        seed: {
          prompt,
          targetAudience: targetAudience || brandContext?.audience || "",
        },
      },
    });
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
        <GeneratedStrategyCard
          strategy={strategy}
          onContinue={handleContinue}
          onCreateContent={handleCreateContent}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <PlatformSummaryCard
            emoji="📸"
            name={platform}
            profile={profile}
            brandContext={brandContext}
          />

          <BrandDNAEditor value={brandDna} onChange={setBrandDna} />

          <BusinessContextInput
            value={businessContext}
            onChange={setBusinessContext}
            onGenerateWithContext={() => handleGenerate()}
            onGenerateAuto={() => {
              setBusinessContext("");
              handleGenerate("");
            }}
            generating={generating}
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
            platform={platform}
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
