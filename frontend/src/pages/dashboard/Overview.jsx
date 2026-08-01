// src/pages/dashboard/Overview.jsx
//
// The /dashboard index: a condensed view of every section, each capped to a
// handful of rows with a "View all" that routes to the full section.

import AIInsights from "../../components/dashboard/AIInsights";
import CustomerPreview from "../../components/dashboard/CustomerPreview";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import MarketingPreview from "../../components/dashboard/MarketingPreview";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentOrders from "../../components/dashboard/RecentOrders";
import StatsGrid from "../../components/dashboard/StatsGrid";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import useDashboardData from "../../components/dashboard/useDashboardData";

function Overview() {
  const { data, entries, orders, customers, isLoading, onExport } =
    useDashboardData();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <LoadingSkeleton variant="banner" />
        <LoadingSkeleton variant="stats" />
        <LoadingSkeleton variant="list" rows={4} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner
        summary={entries[0]?.data?.summary ?? null}
        lastUpdated={data.lastUpdated}
      />

      <StatsGrid stats={data.stats} openOrders={data.openOrders.length} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrders orders={orders} limit={5} delay={0.05} />

        <CustomerPreview customers={customers} limit={5} delay={0.1} />

        <AIInsights insights={data.insights} limit={4} delay={0.15} />

        <MarketingPreview
          orders={data.orders}
          customers={data.customers}
          limit={2}
          delay={0.2}
        />
      </div>

      <QuickActions onExport={onExport} delay={0.25} />
    </div>
  );
}

export default Overview;
