// src/pages/dashboard/Payments.jsx
//
// Only customers with a balance. Everything owed is derived in dashboardData —
// order value minus what's been collected — so an advance shrinks the row
// rather than removing it.

import CustomerPreview from "../../components/dashboard/CustomerPreview";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import PendingPaymentsCard from "../../components/dashboard/PendingPaymentsCard";
import RevenueCard from "../../components/dashboard/RevenueCard";
import useDashboardData from "../../components/dashboard/useDashboardData";

function Payments() {
  const { data, customers, isLoading } = useDashboardData();

  if (isLoading) return <LoadingSkeleton variant="list" rows={6} />;

  const owing = customers.filter((customer) => customer.outstanding > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <RevenueCard
          amount={data.stats.revenue}
          trend={data.stats.revenueTrend}
          index={0}
        />

        <PendingPaymentsCard
          amount={data.stats.outstanding}
          customers={data.stats.outstandingCount}
          index={1}
        />
      </div>

      <CustomerPreview
        customers={owing}
        limit={50}
        title="Still to collect"
        emptyTitle="Everyone has paid"
        emptyDescription="No outstanding balances across your records."
        delay={0.05}
      />
    </div>
  );
}

export default Payments;
