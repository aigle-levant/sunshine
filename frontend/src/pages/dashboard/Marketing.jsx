// src/pages/dashboard/Marketing.jsx

import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import MarketingPreview from "../../components/dashboard/MarketingPreview";
import useDashboardData from "../../components/dashboard/useDashboardData";

function Marketing() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) return <LoadingSkeleton variant="list" rows={4} />;

  return (
    <MarketingPreview
      orders={data.orders}
      customers={data.customers}
      limit={20}
      title="All suggestions"
    />
  );
}

export default Marketing;
