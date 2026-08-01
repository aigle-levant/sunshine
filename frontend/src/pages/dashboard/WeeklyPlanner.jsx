// src/pages/dashboard/WeeklyPlanner.jsx
//
// A week of marketing content as one editable grid. This page composes and owns
// only two pieces of state — which week is showing, and which row is open for
// editing. The rows themselves live in useWeeklyPlan, which persists every
// change, and the AI import is translated in plannerModel.
//
// Generation still goes through the existing POST /api/planner/generate and the
// existing Instagram brand analysis; nothing about that pipeline changed, only
// how its answer is presented.
//
// Marketing Strategy can hand a freshly generated strategy over through router
// state, in which case that strategy and its brand context are what the week is
// generated from.

import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Plus, Sparkles } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import GenerateWeekButton from "../../components/dashboard/GenerateWeekButton";
import PlannerTable from "../../components/planner/PlannerTable";
import WeekSwitcher from "../../components/planner/WeekSwitcher";
import useWeeklyPlan from "../../components/planner/useWeeklyPlan";
import {
  addWeeks,
  rowsFromGeneratedWeek,
  startOfWeek,
  toKey,
} from "../../components/planner/plannerModel";
import { getPlannerWeeks } from "../../lib/storage.js";
import demoUser from "../../constants/demoUser";
import {
  buildBusinessSummary,
  generateWeeklyPlan,
  getLatestBrandContext,
  saveWeeklyPlan,
  scheduleCampaign,
} from "../../services/planner";

function WeeklyPlanner() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [editingId, setEditingId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const { rows, saveRow, deleteRow, addRow, replaceAll } = useWeeklyPlan(weekStart);

  const isLight = theme === "light";

  // Handed over by Marketing Strategy on navigation, absent on a direct visit.
  const incomingStrategy = location.state?.strategy ?? null;
  const incomingBrandContext = location.state?.brandContext ?? null;
  const incomingPlatform = "Instagram";

  const isThisWeek = toKey(weekStart) === toKey(startOfWeek(new Date()));

  // Marketing Strategy is assumed to exist by the time this page is used for
  // real. A direct visit with nothing generated yet and no saved weeks means
  // there's nothing to show or build from, so it sends the owner back to
  // create one — an existing plan or an in-flight generation is left alone.
  useEffect(() => {
    if (incomingStrategy) return;
    if (rows.length) return;
    if (Object.keys(getPlannerWeeks()).length) return;

    navigate("/dashboard/marketing-strategy", { replace: true });
    // Only ever relevant on first mount for a direct, empty visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToWeek = useCallback((next) => {
    // Nothing is left half-edited across a week change: the open editor belongs
    // to a row that's about to be replaced.
    setEditingId(null);
    setError("");
    setWeekStart(next);
  }, []);

  const handleSaveRow = useCallback(
    (row) => {
      const previous = rows.find((existing) => existing.id === row.id);

      saveRow(row);
      setEditingId(null);

      // Marking a row Scheduled is what the old card grid's "Schedule" button
      // did: one campaign row, written once, on the transition only.
      if (row.status === "Scheduled" && previous?.status !== "Scheduled") {
        scheduleCampaign(demoUser.id, {
          title: row.title,
          platform: row.platform,
          caption: row.caption,
          whatsappMessage: row.platform === "WhatsApp" ? row.caption : null,
          bestTime: row.scheduledTime,
          imagePrompt: row.mediaUrl || null,
        }).catch(() => {});
      }
    },
    [rows, saveRow],
  );

  const handleDeleteRow = useCallback(
    (id) => {
      deleteRow(id);
      setEditingId((current) => (current === id ? null : current));
    },
    [deleteRow],
  );

  /** A new row starts in edit mode — an empty read-only row is no use. */
  const handleAddRow = useCallback(() => {
    setError("");
    setEditingId(addRow().id);
  }, [addRow]);

  const handleGenerate = useCallback(async () => {
    setError("");
    setEditingId(null);
    setIsGenerating(true);

    try {
      const businessSummary = buildBusinessSummary();

      // The saved Instagram analysis is what gives the week its brand voice, but
      // it's optional — a missing or unreachable one shouldn't block generation.
      const brandContext =
        incomingBrandContext ??
        (await getLatestBrandContext(demoUser.id).catch(() => null));

      const week = await generateWeeklyPlan(
        businessSummary,
        incomingStrategy ? { ...brandContext, strategy: incomingStrategy } : brandContext,
        incomingPlatform,
      );

      replaceAll(rowsFromGeneratedWeek(week, weekStart));

      // Keeps the existing history write (Supabase, falling back to local) —
      // the table's own copy is already saved by replaceAll.
      saveWeeklyPlan(demoUser.id, week).catch(() => {});
    } catch (err) {
      setError(err.message || "Failed to generate weekly plan");
    } finally {
      setIsGenerating(false);
    }
  }, [incomingBrandContext, incomingPlatform, incomingStrategy, replaceAll, weekStart]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
            Weekly planner
          </p>

          <h2 className="mt-2 text-xl font-medium tracking-[-0.035em]">
            Plan, edit, and schedule your marketing content.
          </h2>
        </div>

        <WeekSwitcher
          weekStart={weekStart}
          isThisWeek={isThisWeek}
          onPrevious={() => goToWeek(addWeeks(weekStart, -1))}
          onNext={() => goToWeek(addWeeks(weekStart, 1))}
          onThisWeek={() => goToWeek(startOfWeek(new Date()))}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <GenerateWeekButton onGenerate={handleGenerate} isLoading={isGenerating} />

        <button
          type="button"
          onClick={handleAddRow}
          className={`flex items-center gap-2 rounded-full border px-5 py-3 text-[13.5px] font-semibold transition-colors duration-300 ${
            isLight
              ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
              : "border-white/15 hover:bg-white/10"
          }`}
        >
          <Plus size={16} strokeWidth={2.2} />
          Add Content
        </button>

        {rows.length > 0 && (
          <p
            className={`ml-auto text-[13px] ${
              isLight ? "text-[#223843]/50" : "text-[#EFF1F3]/50"
            }`}
          >
            {rows.length} {rows.length === 1 ? "item" : "items"} planned · saved
            automatically
          </p>
        )}
      </div>

      {incomingStrategy && (
        <div
          className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-[13.5px] leading-6 ${
            isLight
              ? "border-[#D77A61]/30 bg-[#D77A61]/5"
              : "border-[#D77A61]/30 bg-[#D77A61]/10"
          }`}
        >
          <Sparkles size={16} strokeWidth={2} className="shrink-0 text-[#D77A61]" />
          Using the marketing strategy you just generated —{" "}
          {incomingStrategy.weeklyTheme || incomingStrategy.marketingObjective}.
        </div>
      )}

      {error && (
        <div className="flex gap-3 rounded-2xl border border-[#D77A61]/30 bg-[#D77A61]/10 px-5 py-4 text-[#C96B53] dark:text-[#E29883]">
          <AlertCircle size={17} strokeWidth={2} className="mt-0.5 shrink-0" />
          <p className="text-[13.5px] leading-6">{error}</p>
        </div>
      )}

      <PlannerTable
        rows={rows}
        weekStart={weekStart}
        editingId={editingId}
        onEdit={setEditingId}
        onSave={handleSaveRow}
        onCancel={() => setEditingId(null)}
        onDelete={handleDeleteRow}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
}

export default WeeklyPlanner;
