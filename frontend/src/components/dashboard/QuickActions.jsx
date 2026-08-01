// src/components/dashboard/QuickActions.jsx
//
// Speaking is the primary action and always leads. The rest are real routes —
// only Export stays a callback, since it produces a file rather than a page.

import { Download, Megaphone, Mic, Users, Wallet } from "lucide-react";

import ActionButton from "./ActionButton";
import Panel from "./Panel";
import { DASHBOARD_ROOT } from "./navItems";

const ACTIONS = [
  {
    id: "speak",
    label: "Record an update",
    description: "Speak in Tamil or English",
    icon: Mic,
    variant: "accent",
    to: "/speak",
  },
  {
    id: "payments",
    label: "Collect payments",
    description: "See who still owes you",
    icon: Wallet,
    to: `${DASHBOARD_ROOT}/payments`,
  },
  {
    id: "customers",
    label: "Customers",
    description: "Browse everyone you serve",
    icon: Users,
    to: `${DASHBOARD_ROOT}/customers`,
  },
  {
    id: "marketing",
    label: "Send an offer",
    description: "Ready-written WhatsApp messages",
    icon: Megaphone,
    to: `${DASHBOARD_ROOT}/marketing`,
  },
];

function QuickActions({ onExport, delay = 0 }) {
  return (
    <Panel eyebrow="Quick actions" title="What next?" delay={delay}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ACTIONS.map((action, index) => (
          <ActionButton
            key={action.id}
            label={action.label}
            description={action.description}
            icon={action.icon}
            variant={action.variant}
            to={action.to}
            index={index}
          />
        ))}

        <ActionButton
          label="Export records"
          description="Download everything as JSON"
          icon={Download}
          onClick={onExport}
          index={ACTIONS.length}
        />
      </div>
    </Panel>
  );
}

export default QuickActions;
