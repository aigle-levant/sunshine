// src/components/dashboard/PendingPaymentsCard.jsx
//
// What's been ordered but not yet collected. Derived, not stated: order value
// minus payments received, so an advance correctly shrinks the balance.

import { Wallet } from "lucide-react";

import StatCard from "./StatCard";
import { formatCurrency } from "./dashboardData";

function PendingPaymentsCard({ amount = 0, customers = 0, index = 0 }) {
  return (
    <StatCard
      label="Awaiting payment"
      value={formatCurrency(amount, { compact: true })}
      caption={
        customers > 0
          ? `${customers} ${customers === 1 ? "customer" : "customers"} still to pay`
          : "Nothing outstanding"
      }
      icon={Wallet}
      // No trend chip: the balance is a running total, not a weekly flow.
      index={index}
    />
  );
}

export default PendingPaymentsCard;
