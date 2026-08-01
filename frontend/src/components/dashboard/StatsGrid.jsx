// src/components/dashboard/StatsGrid.jsx
//
// The four headline numbers. The grid is the only thing this owns — each card
// decides its own formatting and caption.

import CustomersCard from "./CustomersCard";
import OrdersCard from "./OrdersCard";
import PendingPaymentsCard from "./PendingPaymentsCard";
import RevenueCard from "./RevenueCard";

function StatsGrid({ stats, openOrders = 0 }) {
  return (
    <section
      aria-label="Business summary"
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
    >
      <RevenueCard
        amount={stats?.revenue ?? 0}
        trend={stats?.revenueTrend ?? null}
        index={0}
      />

      <OrdersCard
        count={stats?.orders ?? 0}
        open={openOrders}
        trend={stats?.ordersTrend ?? null}
        index={1}
      />

      <CustomersCard
        count={stats?.customers ?? 0}
        trend={stats?.customersTrend ?? null}
        index={2}
      />

      <PendingPaymentsCard
        amount={stats?.outstanding ?? 0}
        customers={stats?.outstandingCount ?? 0}
        index={3}
      />
    </section>
  );
}

export default StatsGrid;
