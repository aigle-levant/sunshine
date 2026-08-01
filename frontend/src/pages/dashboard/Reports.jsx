// src/pages/dashboard/Reports.jsx
//
// The headline numbers are real; the charts aren't built yet, so this says so
// rather than showing a placeholder graph of invented data.

import { BarChart3 } from "lucide-react";

import EmptyState from "../../components/dashboard/EmptyState";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import StatsGrid from "../../components/dashboard/StatsGrid";
import useDashboardData from "../../components/dashboard/useDashboardData";

function Reports() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) return <LoadingSkeleton variant="stats" />;

  return (
    <div className="flex flex-col gap-6">
      <StatsGrid stats={data.stats} openOrders={data.openOrders.length} />

      <EmptyState
        icon={BarChart3}
        title="Charts are coming"
        description="Month-on-month trends land here once there's enough history to plot."
      />
    </div>
  );
}

export default Reports;
