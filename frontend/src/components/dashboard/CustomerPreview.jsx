// src/components/dashboard/CustomerPreview.jsx

import { Users } from "lucide-react";

import CustomerRow from "./CustomerRow";
import EmptyState from "./EmptyState";
import Panel from "./Panel";
import { DASHBOARD_ROOT } from "./navItems";

function CustomerPreview({
  customers = [],
  limit = 5,
  title = "Who you're serving",
  emptyTitle = "No customers yet",
  emptyDescription = "Mention someone by name while speaking and they'll appear here.",
  onSelect,
  delay = 0,
}) {
  const visible = customers.slice(0, limit);

  return (
    <Panel
      eyebrow="Customers"
      title={title}
      count={customers.length}
      actionLabel={customers.length > limit ? "View all" : null}
      actionTo={`${DASHBOARD_ROOT}/customers`}
      delay={delay}
    >
      {visible.length ? (
        <ul className="-mx-1 flex flex-col">
          {visible.map((customer, index) => (
            <CustomerRow
              key={customer.name}
              customer={customer}
              index={index}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Users}
          title={emptyTitle}
          description={emptyDescription}
        />
      )}
    </Panel>
  );
}

export default CustomerPreview;
