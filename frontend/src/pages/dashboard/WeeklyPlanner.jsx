// src/pages/dashboard/WeeklyPlanner.jsx
//
// Generates a full week of Instagram + WhatsApp content in one click, using
// the locally derived business summary and the user's saved Instagram brand
// analysis. Each day renders as a card; scheduling a day writes one row into
// `campaigns`.

import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import DayCard from "../../components/dashboard/DayCard";
import GenerateWeekButton from "../../components/dashboard/GenerateWeekButton";
import demoUser from "../../constants/demoUser";
import {
  buildBusinessSummary,
  getLatestBrandContext,
  generateWeeklyPlan,
  regenerateDay,
  saveWeeklyPlan,
  scheduleCampaign,
} from "../../services/planner";

function WeeklyPlanner() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const location = useLocation();

  const incomingStrategy = location.state?.strategy ?? null;
  const incomingBrandContext = location.state?.brandContext ?? null;

  const [week, setWeek] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scheduledDays, setScheduledDays] = useState(new Set());
  const [regeneratingDay, setRegeneratingDay] = useState(null);

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    setScheduledDays(new Set());

    try {
      const businessSummary = buildBusinessSummary();
      const brandContext =
        incomingBrandContext ?? (await getLatestBrandContext(demoUser.id));

      const generatedWeek = await generateWeeklyPlan(
        businessSummary,
        incomingStrategy ? { ...brandContext, strategy: incomingStrategy } : brandContext,
      );
      setWeek(generatedWeek);

      await saveWeeklyPlan(demoUser.id, generatedWeek).catch(() => {});
    } catch (err) {
      setError(err.message || "Failed to generate weekly plan");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (day) => {
    setError("");

    try {
      await scheduleCampaign(demoUser.id, day);
      setScheduledDays((prev) => new Set(prev).add(day.day));
    } catch (err) {
      setError(err.message || "Failed to schedule campaign");
    }
  };

  const handleRegenerate = async (day) => {
    setError("");
    setRegeneratingDay(day.day);

    try {
      const businessSummary = buildBusinessSummary();
      const brandContext = incomingBrandContext ?? (await getLatestBrandContext(demoUser.id));

      const newDay = await regenerateDay(businessSummary, brandContext, day.day);

      setWeek((prev) => prev.map((entry) => (entry.day === day.day ? newDay : entry)));
    } catch (err) {
      setError(err.message || "Failed to regenerate day");
    } finally {
      setRegeneratingDay(null);
    }
  };

  const textColor = isLight ? "text-[#223843]" : "text-[#EFF1F3]";

  return (
    <div className={textColor}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Weekly AI Marketing Planner</h1>
        <p className={`mt-2 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
          Generate an entire week&apos;s worth of marketing content in one click.
        </p>
      </div>

      {incomingStrategy && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-lg border p-4 text-sm ${
            isLight ? "border-[#D77A61]/30 bg-[#D77A61]/5" : "border-[#D77A61]/30 bg-[#D77A61]/10"
          }`}
        >
          <Sparkles size={16} className="shrink-0 text-[#D77A61]" />
          Using the marketing strategy you just generated — {incomingStrategy.weeklyTheme || incomingStrategy.marketingObjective}.
        </div>
      )}

      {error && (
        <div className="mb-6 flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-[#D77A61]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <GenerateWeekButton onGenerate={handleGenerate} isLoading={loading} isLight={isLight} />
      </div>

      {week && !loading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {week.map((day) => (
            <DayCard
              key={day.day}
              day={day}
              isLight={isLight}
              onSchedule={handleSchedule}
              onRegenerate={handleRegenerate}
              isScheduled={scheduledDays.has(day.day)}
              isRegenerating={regeneratingDay === day.day}
            />
          ))}
        </div>
      )}

      {!week && !loading && (
        <div
          className={`rounded-2xl border border-dashed p-12 text-center ${
            isLight ? "border-[#223843]/20" : "border-white/20"
          }`}
        >
          <p className={isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}>
            Click &quot;Generate Weekly Plan&quot; to build your 7-day content calendar.
          </p>
        </div>
      )}

      {scheduledDays.size > 0 && (
        <div className="mt-6 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 size={16} />
          {scheduledDays.size} {scheduledDays.size === 1 ? "day" : "days"} scheduled
        </div>
      )}
    </div>
  );
}

export default WeeklyPlanner;
