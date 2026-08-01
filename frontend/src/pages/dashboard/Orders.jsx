// src/pages/dashboard/Orders.jsx

import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import RecentOrders from "../../components/dashboard/RecentOrders";
import useDashboardData from "../../components/dashboard/useDashboardData";

function Orders() {
  const { orders, isLoading } = useDashboardData();

  if (isLoading) return <LoadingSkeleton variant="list" rows={6} />;

  return <RecentOrders orders={orders} limit={50} title="All orders" />;
}

export default Orders;
