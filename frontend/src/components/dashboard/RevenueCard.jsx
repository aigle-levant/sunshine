// src/components/dashboard/RevenueCard.jsx
//
// Money actually collected — the sum of payments marked Paid. Orders that are
// still owed for live in PendingPaymentsCard, never here.

import { IndianRupee } from "lucide-react";

import StatCard from "./StatCard";
import { formatCurrency } from "./dashboardData";

function RevenueCard({ amount = 0, trend = null, index = 0 }) {
  return (
    <StatCard
      label="Revenue collected"
      value={formatCurrency(amount, { compact: true })}
      caption="Payments received in full or as advance"
      icon={IndianRupee}
      trend={trend}
      index={index}
    />
  );
}

export default RevenueCard;
