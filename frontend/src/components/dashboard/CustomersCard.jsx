// src/components/dashboard/CustomersCard.jsx

import { Users } from "lucide-react";

import StatCard from "./StatCard";

function CustomersCard({ count = 0, trend = null, index = 0 }) {
  return (
    <StatCard
      label="Customers"
      value={count}
      caption="Unique names across everything you've said"
      icon={Users}
      trend={trend}
      index={index}
    />
  );
}

export default CustomersCard;
