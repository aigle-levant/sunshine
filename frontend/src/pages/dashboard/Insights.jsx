// src/pages/dashboard/Insights.jsx
//
// Everything the model observed, plus the tasks it suggested. Both are its own
// output — nothing on this page is computed locally.

import { ListChecks } from "lucide-react";

import AIInsights from "../../components/dashboard/AIInsights";
import EmptyState from "../../components/dashboard/EmptyState";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import Panel from "../../components/dashboard/Panel";
import useDashboardData from "../../components/dashboard/useDashboardData";
import { formatRelativeDate } from "../../components/dashboard/dashboardData";

function Insights() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) return <LoadingSkeleton variant="list" rows={6} />;

  return (
    <div className="flex flex-col gap-6">
      <AIInsights insights={data.insights} limit={50} />

      <Panel
        eyebrow="Follow-ups"
        title="Suggested tasks"
        count={data.tasks.length}
        delay={0.05}
      >
        {data.tasks.length ? (
          <ul className="flex flex-col gap-2.5">
            {data.tasks.map((task, index) => (
              <li
                key={`${task.text}-${index}`}
                className="flex items-start gap-3.5 text-[15px] leading-7"
              >
                <ListChecks
                  size={17}
                  strokeWidth={1.9}
                  className="mt-1.5 shrink-0 text-[#D77A61]"
                />

                <span className="min-w-0">
                  {task.text}

                  {formatRelativeDate(task.savedAt) && (
                    <span className="ml-2 text-[13px] opacity-50">
                      {formatRelativeDate(task.savedAt)}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={ListChecks}
            compact
            title="No tasks yet"
            description="Mention a delivery or a follow-up and it lands here."
          />
        )}
      </Panel>
    </div>
  );
}

export default Insights;
