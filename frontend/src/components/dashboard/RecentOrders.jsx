// src/components/dashboard/RecentOrders.jsx

import { Package } from "lucide-react";

import EmptyState from "./EmptyState";
import Panel from "./Panel";
import RecentOrderCard from "./RecentOrderCard";
import { DASHBOARD_ROOT } from "./navItems";

function RecentOrders({
  orders = [],
  limit = 5,
  title = "Recent orders",
  delay = 0,
}) {
  const visible = orders.slice(0, limit);

  return (
    <Panel
      eyebrow="Business overview"
      title={title}
      count={orders.length}
      // Only worth offering when there's more than what's on screen.
      actionLabel={orders.length > limit ? "View all" : null}
      actionTo={`${DASHBOARD_ROOT}/orders`}
      delay={delay}
    >
      {visible.length ? (
        <ul className="-mx-1 flex flex-col">
          {visible.map((order, index) => (
            <RecentOrderCard key={order.id} order={order} index={index} />
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Say something like “Lakshmi ordered 20 sarees, Friday delivery.”"
        />
      )}
    </Panel>
  );
}

export default RecentOrders;
