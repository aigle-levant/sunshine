// src/components/dashboard/AIInsights.jsx
//
// Observations the model returned alongside the extraction. Nothing here is
// computed locally — if the model didn't say it, it isn't shown.

import { Sparkles } from "lucide-react";

import EmptyState from "./EmptyState";
import InsightCard from "./InsightCard";
import Panel from "./Panel";

function AIInsights({ insights = [], limit = 4, delay = 0 }) {
  const visible = insights.slice(0, limit);

  return (
    <Panel
      eyebrow="Powered by AI"
      title="Insights"
      count={insights.length}
      delay={delay}
    >
      {visible.length ? (
        <ul className="flex flex-col gap-3">
          {visible.map((insight, index) => (
            <InsightCard
              key={`${insight.text}-${index}`}
              insight={insight}
              index={index}
            />
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Sparkles}
          compact
          title="No insights yet"
          description="Record a few updates and patterns start showing up here."
        />
      )}
    </Panel>
  );
}

export default AIInsights;
