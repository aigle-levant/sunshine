// src/pages/dashboard/Customers.jsx

import CustomerPreview from "../../components/dashboard/CustomerPreview";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import useDashboardData from "../../components/dashboard/useDashboardData";

function Customers() {
  const { customers, isLoading } = useDashboardData();

  if (isLoading) return <LoadingSkeleton variant="list" rows={6} />;

  return (
    <CustomerPreview
      customers={customers}
      limit={50}
      title="Everyone you serve"
    />
  );
}

export default Customers;
