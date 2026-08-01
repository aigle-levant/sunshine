// src/components/dashboard/marketing/InstagramConnect.jsx
//
// Step 2 of the marketing onboarding flow — analyse an Instagram account via
// the existing POST /api/instagram endpoint, then hand the profile and brand
// context back to the parent flow.

import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, Loader } from "lucide-react";

import useTheme from "../../../hooks/useTheme";
import { analyzeInstagram } from "../../../services/instagram";

const ANALYSIS_STEPS = [
  "Reading profile...",
  "Learning your brand...",
  "Understanding your audience...",
  "Generating Brand DNA...",
];

function InstagramConnect({ onConnected, onBack }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      setStepIndex(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, ANALYSIS_STEPS.length - 1));
    }, 900);

    return () => clearInterval(intervalRef.current);
  }, [loading]);

  const inputBg = isLight
    ? "bg-[#F5F5F5] border-[#223843]/15"
    : "bg-[#333] border-white/15";

  const handleAnalyze = async () => {
    setError("");

    if (!username.trim()) {
      setError("Please enter an Instagram username");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeInstagram(username);
      onConnected?.(username, result.profile, result.brandContext);
    } catch (err) {
      setError(err.message || "Failed to analyze profile");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) handleAnalyze();
  };

  if (loading) {
    return (
      <div
        className={`flex flex-col items-center gap-3 rounded-2xl border p-10 text-center ${
          isLight ? "border-[#223843]/10 bg-white/70" : "border-white/10 bg-[#252525]/70"
        }`}
      >
        <Loader size={22} className="animate-spin text-[#D77A61]" />
        <p className="text-sm font-medium">{ANALYSIS_STEPS[stepIndex]}</p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className={`mb-5 flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
          isLight
            ? "text-[#223843]/70 hover:text-[#223843]"
            : "text-[#EFF1F3]/70 hover:text-[#EFF1F3]"
        }`}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h3 className="text-lg font-bold">Connect Instagram</h3>

      <label className="mb-2 mt-5 block text-sm font-semibold">Instagram Username</label>
      <div className="flex gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="@yourbusiness"
          className={`w-full rounded-lg border px-4 py-3 text-sm transition-colors duration-300 ${inputBg} ${
            isLight ? "placeholder-[#223843]/40" : "placeholder-[#EFF1F3]/40"
          }`}
        />

        <button
          type="button"
          onClick={handleAnalyze}
          className="shrink-0 rounded-lg bg-[#D77A61] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C96B53]"
        >
          Analyse Account
        </button>
      </div>

      {error && (
        <div className="mt-4 flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-[#D77A61]">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

export default InstagramConnect;
