// src/components/dashboard/marketing/WeeklyPlannerPreview.jsx
//
// Step 3 result — the generated 7-day calendar, one DayCard per day. Reuses
// the same DayCard used by the standalone Weekly Planner section so scheduled
// campaigns look identical everywhere.

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import DayCard from "../DayCard";

function WeeklyPlannerPreview({ week, isLight, onSchedule }) {
  const [scheduledDays, setScheduledDays] = useState(new Set());

  const handleSchedule = async (day) => {
    await onSchedule?.(day);
    setScheduledDays((prev) => new Set(prev).add(day.day));
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {week.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            isLight={isLight}
            onSchedule={handleSchedule}
            isScheduled={scheduledDays.has(day.day)}
          />
        ))}
      </div>

      {scheduledDays.size > 0 && (
        <div className="mt-6 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 size={16} />
          {scheduledDays.size} {scheduledDays.size === 1 ? "day" : "days"} scheduled
        </div>
      )}
    </div>
  );
}

export default WeeklyPlannerPreview;
