// src/components/dashboard/OrdersCard.jsx

import { Package } from "lucide-react";

import StatCard from "./StatCard";

function OrdersCard({ count = 0, open = 0, trend = null, index = 0 }) {
  return (
    <StatCard
      label="Total orders"
      value={count}
      caption={open > 0 ? `${open} still to fulfil` : "Everything fulfilled"}
      icon={Package}
      trend={trend}
      index={index}
    />
  );
}

export default OrdersCard;
