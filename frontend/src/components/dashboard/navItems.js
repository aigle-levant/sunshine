// src/components/dashboard/navItems.js
//
// The dashboard's sections, in sidebar order. This is the single source for
// both the nav links and the page title, so a new section means one entry here
// plus one <Route> in App.jsx.
//
// Paths are absolute rather than relative so NavLink and the title lookup can
// use them unchanged. `end` is only on Overview — without it the index link
// would stay active on every child route.

import {
  BarChart3,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  Package,
  Users,
  Wallet,
} from "lucide-react";

export const DASHBOARD_ROOT = "/dashboard";

export const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    to: DASHBOARD_ROOT,
    end: true,
    icon: LayoutDashboard,
  },
  { id: "orders", label: "Orders", to: `${DASHBOARD_ROOT}/orders`, icon: Package },
  {
    id: "customers",
    label: "Customers",
    to: `${DASHBOARD_ROOT}/customers`,
    icon: Users,
  },
  {
    id: "payments",
    label: "Payments",
    to: `${DASHBOARD_ROOT}/payments`,
    icon: Wallet,
  },
  {
    id: "insights",
    label: "AI Insights",
    to: `${DASHBOARD_ROOT}/insights`,
    icon: Lightbulb,
  },
  {
    id: "marketing",
    label: "Marketing",
    to: `${DASHBOARD_ROOT}/marketing`,
    icon: Megaphone,
  },
  {
    id: "reports",
    label: "Reports",
    to: `${DASHBOARD_ROOT}/reports`,
    icon: BarChart3,
  },
];

/** Longest matching path wins, so /dashboard doesn't shadow its children. */
export function navItemForPath(pathname) {
  return (
    [...NAV_ITEMS]
      .sort((a, b) => b.to.length - a.to.length)
      .find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`)) ??
    NAV_ITEMS[0]
  );
}
