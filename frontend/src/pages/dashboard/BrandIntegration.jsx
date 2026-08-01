// src/pages/dashboard/BrandIntegration.jsx
//
// First-class dashboard page for connecting social platforms and reviewing the
// brand analysis Claude derives from them, before moving on to Marketing
// Strategy. The step machine (platform select -> connect -> brand analysis ->
// AI recommendation) is untouched — this page only gives it its own header and
// its own place in the sidebar instead of living inside Marketing's empty state.

import useTheme from "../../hooks/useTheme";
import MarketingOnboarding from "../../components/dashboard/marketing/MarketingOnboarding";

function BrandIntegration() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const textColor = isLight ? "text-[#223843]" : "text-[#EFF1F3]";

  return (
    <div className={textColor}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Brand Integration</h1>
        <p className={`mt-2 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
          Connect your social media accounts so VoiceKart AI can understand your brand before
          generating marketing content.
        </p>
      </div>

      <MarketingOnboarding />
    </div>
  );
}

export default BrandIntegration;
