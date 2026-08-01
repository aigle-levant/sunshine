// src/components/dashboard/marketing/MarketingOnboarding.jsx
//
// Replaces the "No campaigns yet" empty state on the full Marketing page with
// a guided setup: pick a platform (or let AI decide) -> connect it -> review
// the brand analysis. Continuing from there hands off to the dedicated
// Marketing Strategy page (via router state) rather than generating anything
// inline — this widget's job stops at "brand analysis reviewed".

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import useTheme from "../../../hooks/useTheme";
import demoUser from "../../../constants/demoUser";
import { buildBusinessSummary, recommendPlatform } from "../../../services/planner";
import { saveInstagramAnalysis } from "../../../services/instagram";

import PlatformSelector from "./PlatformSelector";
import InstagramConnect from "./InstagramConnect";
import BrandSummaryCard from "./BrandSummaryCard";
import AIRecommendation from "./AIRecommendation";
import XConnect from "./XConnect";

const STEP = {
  SELECT: "select",
  INSTAGRAM_CONNECT: "instagram-connect",
  INSTAGRAM_CONNECTED: "instagram-connected",
  X_CONNECT: "x-connect",
  AI_RECOMMEND: "ai-recommend",
};

function MarketingOnboarding() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();

  const [step, setStep] = useState(STEP.SELECT);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [profile, setProfile] = useState(null);
  const [brandContext, setBrandContext] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState("");
  const [recommending, setRecommending] = useState(false);

  const resetToSelect = () => {
    setSelectedPlatform(null);
    setStep(STEP.SELECT);
  };

  const handleInstagramConnected = (handle, connectedProfile, connectedBrandContext) => {
    setProfile(connectedProfile);
    setBrandContext(connectedBrandContext);
    setStep(STEP.INSTAGRAM_CONNECTED);

    saveInstagramAnalysis(demoUser.id, handle, connectedProfile, connectedBrandContext).catch(
      () => {},
    );
  };

  const handleRecommend = async () => {
    setError("");
    setSelectedPlatform("ai");
    setRecommending(true);

    try {
      const businessSummary = buildBusinessSummary();
      const result = await recommendPlatform(businessSummary);
      setRecommendation(result);
      setStep(STEP.AI_RECOMMEND);
    } catch (err) {
      setError(err.message || "Failed to get a recommendation");
    } finally {
      setRecommending(false);
    }
  };

  // Brand analysis is already in hand — hand off to Marketing Strategy
  // instead of calling Claude again for anything.
  const handleContinueToStrategy = () => {
    navigate("/dashboard/marketing-strategy", { state: { profile, brandContext } });
  };

  return (
    <div>
      {error && (
        <div className="mb-6 flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-[#D77A61]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {step === STEP.SELECT && (
        <PlatformSelector
          selected={selectedPlatform}
          onSelectInstagram={() => {
            setSelectedPlatform("instagram");
            setStep(STEP.INSTAGRAM_CONNECT);
          }}
          onSelectX={() => {
            setSelectedPlatform("x");
            setStep(STEP.X_CONNECT);
          }}
          onRecommend={handleRecommend}
        />
      )}

      {step === STEP.SELECT && recommending && (
        <p className={`mt-4 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
          Analysing your business...
        </p>
      )}

      {step === STEP.INSTAGRAM_CONNECT && (
        <InstagramConnect onConnected={handleInstagramConnected} onBack={resetToSelect} />
      )}

      {step === STEP.INSTAGRAM_CONNECTED && (
        <BrandSummaryCard
          profile={profile}
          brandContext={brandContext}
          onContinue={handleContinueToStrategy}
        />
      )}

      {step === STEP.X_CONNECT && <XConnect onBack={resetToSelect} />}

      {step === STEP.AI_RECOMMEND && (
        <AIRecommendation
          recommendation={recommendation}
          onUseInstagram={() => {
            setSelectedPlatform("instagram");
            setStep(STEP.INSTAGRAM_CONNECT);
          }}
          onChooseAnother={resetToSelect}
        />
      )}
    </div>
  );
}

export default MarketingOnboarding;
